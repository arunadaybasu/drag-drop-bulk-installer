jQuery(document).ready(function ($) {
    const dropZone = $('#bpd-dropzone');
    let activeUploads = 0;

    // Create notification container
    if (!$('#bpd-notifications').length) {
        $('body').append('<div id="bpd-notifications"></div>');
    }

    // Create progress container
    if (!$('#bpd-progress-container').length) {
        $('body').append(`
            <div id="bpd-progress-container" style="display:none;">
                <div id="bpd-progress-header">
                    <span id="bpd-progress-text">Installing plugins...</span>
                    <span id="bpd-progress-count"></span>
                </div>
                <div id="bpd-progress-bar">
                    <div id="bpd-progress-fill"></div>
                </div>
                <div id="bpd-progress-details"></div>
            </div>
        `);
    }

    function showNotification(message, type = 'success') {
        const notification = $(`
            <div class="bpd-notification bpd-${type}">
                <span>${message}</span>
                <button class="bpd-close">&times;</button>
            </div>
        `);
        
        $('#bpd-notifications').append(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.fadeOut(() => notification.remove());
        }, 5000);
        
        // Manual close
        notification.find('.bpd-close').click(() => {
            notification.fadeOut(() => notification.remove());
        });
    }

    function updateProgress(current, total, details = '') {
        const percentage = Math.round((current / total) * 100);
        $('#bpd-progress-fill').css('width', percentage + '%');
        $('#bpd-progress-count').text(`${current}/${total}`);
        $('#bpd-progress-details').text(details);
        
        if (current >= total) {
            setTimeout(() => {
                $('#bpd-progress-container').fadeOut();
            }, 1000);
        }
    }

    $(document).on('dragover', function (e) {
        e.preventDefault();
        dropZone.addClass('dragover');
    });

    $(document).on('dragleave drop', function () {
        dropZone.removeClass('dragover');
    });

    $(document).on('drop', function (e) {
        e.preventDefault();

        const files = e.originalEvent.dataTransfer.files;
        if (!files.length) return;

        // Filter only ZIP files
        const zipFiles = Array.from(files).filter(file => 
            file.name.toLowerCase().endsWith('.zip')
        );

        if (!zipFiles.length) {
            showNotification('Please drop only ZIP files.', 'error');
            return;
        }

        // Show progress container
        activeUploads = zipFiles.length;
        let completedUploads = 0;
        $('#bpd-progress-container').show();
        updateProgress(0, activeUploads, 'Preparing to install plugins...');

        zipFiles.forEach((file, index) => {
            const formData = new FormData();
            formData.append('action', 'bpd_upload_plugin');
            formData.append('nonce', BPD_AJAX.nonce);
            formData.append('file', file);

            updateProgress(completedUploads, activeUploads, `Installing ${file.name}...`);

            $.ajax({
                url: BPD_AJAX.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success(response) {
                    console.log('Raw response:', response);
                    completedUploads++;
                    
                    // Handle different response formats
                    let message = 'Installation completed';
                    let isSuccess = true;
                    let jsonResponse = null;
                    
                    // Try to parse JSON from the response
                    if (typeof response === 'string') {
                        // Look for JSON at the end of the response (after HTML)
                        const jsonMatch = response.match(/\{"success":(true|false).*?\}$/);
                        if (jsonMatch) {
                            try {
                                jsonResponse = JSON.parse(jsonMatch[0]);
                            } catch (e) {
                                console.warn('Failed to parse JSON from response:', e);
                            }
                        }
                        
                        // If no JSON found, parse HTML for error messages
                        if (!jsonResponse) {
                            if (response.includes('Plugin installation failed') || response.includes('Could not copy file')) {
                                isSuccess = false;
                                message = 'Installation failed - check server permissions';
                            } else if (response.includes('Plugin installed successfully')) {
                                message = 'Plugin installed successfully';
                            }
                        }
                    } else if (response && typeof response === 'object') {
                        jsonResponse = response;
                    }
                    
                    // Use JSON response if available
                    if (jsonResponse) {
                        isSuccess = jsonResponse.success;
                        message = (jsonResponse.data && jsonResponse.data.message) ? jsonResponse.data.message : (isSuccess ? 'Installation completed' : 'Installation failed');
                    }
                    
                    if (isSuccess) {
                        showNotification(`✓ ${file.name}: ${message}`, 'success');
                        updateProgress(completedUploads, activeUploads, `Completed ${file.name}`);
                    } else {
                        showNotification(`✗ ${file.name}: ${message}`, 'error');
                        updateProgress(completedUploads, activeUploads, `Failed ${file.name}`);
                    }
                    
                    // Check if all uploads are complete
                    if (completedUploads === activeUploads) {
                        setTimeout(() => {
                            showNotification(`All ${activeUploads} plugin(s) processed!`, 'info');
                            // Refresh the page after a delay to show updated plugin list
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        }, 500);
                    }
                },
                error(xhr, status, error) {
                    console.error('AJAX Error:', { xhr, status, error, response: xhr.responseText });
                    completedUploads++;
                    
                    // Check if this is actually a success disguised as an error due to mixed response
                    let isActuallySuccess = false;
                    let message = 'Upload failed';
                    
                    if (xhr.responseText) {
                        // Look for JSON success response in the error response
                        const jsonMatch = xhr.responseText.match(/\{"success":true.*?\}$/);
                        if (jsonMatch) {
                            try {
                                const jsonResponse = JSON.parse(jsonMatch[0]);
                                if (jsonResponse.success) {
                                    isActuallySuccess = true;
                                    message = (jsonResponse.data && jsonResponse.data.message) ? jsonResponse.data.message : 'Installation completed';
                                }
                            } catch (e) {
                                console.warn('Failed to parse JSON from error response:', e);
                            }
                        }
                        
                        // If not success, determine error type
                        if (!isActuallySuccess) {
                            if (xhr.responseText.includes('413')) {
                                message = 'File too large';
                            } else if (xhr.responseText.includes('403')) {
                                message = 'Permission denied';
                            } else if (xhr.responseText.includes('500')) {
                                message = 'Server error';
                            } else if (xhr.responseText.includes('Plugin installation failed') || xhr.responseText.includes('Could not copy file')) {
                                message = 'Installation failed - check server permissions';
                            }
                        }
                    }
                    
                    if (isActuallySuccess) {
                        showNotification(`✓ ${file.name}: ${message}`, 'success');
                        updateProgress(completedUploads, activeUploads, `Completed ${file.name}`);
                    } else {
                        showNotification(`✗ ${file.name}: ${message}`, 'error');
                        updateProgress(completedUploads, activeUploads, `Failed ${file.name}`);
                    }
                    
                    // Check if all uploads are complete
                    if (completedUploads === activeUploads) {
                        setTimeout(() => {
                            const successMessage = isActuallySuccess ? `All ${activeUploads} plugin(s) processed!` : `Processing completed with errors`;
                            showNotification(successMessage, 'info');
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        }, 500);
                    }
                }
            });
        });
    });
});
