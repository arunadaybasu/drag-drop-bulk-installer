<?php
/*
Plugin Name: Drag Drop Bulk Installer
Description: Drag and drop multiple ZIP files onto WordPress admin pages to install them at once.
Version: 1.0
Author: Arunday Basu
Author URI: https://github.com/arunadaybasu
Plugin URI: https://github.com/arunadaybasu/drag-drop-bulk-installer
Text Domain: drag-drop-bulk-installer
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.4
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'plugins.php' || $hook === 'plugin-install.php') {
        wp_enqueue_script('drag-drop-bulk-installer', plugin_dir_url(__FILE__) . 'js/dragdrop.js', ['jquery'], '1.0', true);
        wp_enqueue_style('drag-drop-bulk-installer', plugin_dir_url(__FILE__) . 'css/style.css', [], '1.0');
        wp_localize_script('drag-drop-bulk-installer', 'BPD_AJAX', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('bpd_upload'),
        ]);
    }
});

add_action('admin_footer', function () {
    $screen = get_current_screen();
    if (in_array($screen->id, ['plugins', 'plugin-install'])) {
        echo '<div id="bpd-dropzone"><strong>Drop plugin ZIP files here to install</strong></div>';
    }
});

add_action('wp_ajax_bpd_upload_plugin', function () {
    check_ajax_referer('bpd_upload', 'nonce');
    
    // Check user capabilities
    if (!current_user_can('install_plugins')) {
        wp_send_json_error(['message' => 'You do not have permission to install plugins.']);
    }

    if (empty($_FILES['file'])) {
        wp_send_json_error(['message' => 'No file received.']);
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
    require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
    require_once ABSPATH . 'wp-admin/includes/plugin.php';

    $file = $_FILES['file']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- File upload handling, validated below
    
    // Validate file type
    $file_type = wp_check_filetype(sanitize_file_name($file['name']));
    if ($file_type['ext'] !== 'zip') {
        wp_send_json_error(['message' => 'Only ZIP files are allowed.']);
    }
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        wp_send_json_error(['message' => 'File upload error: ' . $file['error']]);
    }

    // Use the uploaded file directly
    ob_start(); // Start output buffering to capture any HTML output
    $upgrader = new Plugin_Upgrader();
    $result = $upgrader->install($file['tmp_name']);
    $output = ob_get_clean(); // Get and clean the output buffer

    if (is_wp_error($result)) {
        wp_send_json_error(['message' => 'Installation failed: ' . $result->get_error_message()]);
    }
    
    // Check for errors in the output
    if (strpos($output, 'Plugin installation failed') !== false || strpos($output, 'Could not copy file') !== false) {
        wp_send_json_error(['message' => 'Installation failed due to file system error. Check directory permissions.']);
    }

    $plugin_info = $upgrader->plugin_info();
    if ($plugin_info) {
        $activate_result = activate_plugin($plugin_info);
        if (is_wp_error($activate_result)) {
            wp_send_json_success(['message' => 'Plugin installed but activation failed: ' . $activate_result->get_error_message()]);
        } else {
            wp_send_json_success(['message' => 'Plugin installed and activated successfully.']);
        }
    } else {
        wp_send_json_success(['message' => 'Plugin installed successfully.']);
    }
});
