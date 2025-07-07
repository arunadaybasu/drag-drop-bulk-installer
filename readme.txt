=== Drag Drop Bulk Installer ===
Contributors: arunadaybasu
Tags: installer, bulk, drag-drop, upload, admin
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Drag and drop multiple ZIP files onto WordPress admin pages to install them instantly with a beautiful progress bar interface.

== Description ==

Drag Drop Bulk Installer revolutionizes the way you install WordPress extensions by allowing you to drag and drop multiple ZIP files directly onto your WordPress admin pages. No more tedious one-by-one installations!

= Key Features =

* **Drag & Drop Interface** - Simply drag ZIP files onto the Plugins or Add Plugins pages
* **Bulk Installation** - Install multiple plugins at once with a single drag action
* **Real-time Progress Bar** - Beautiful modal with progress tracking for each installation
* **Smart Notifications** - Color-coded notifications for success, errors, and completion status
* **Automatic Activation** - Plugins are automatically activated after successful installation
* **File Validation** - Only accepts valid ZIP files for security
* **Permission Checking** - Respects WordPress user capabilities and security
* **Auto Page Refresh** - Automatically refreshes to show newly installed plugins

= How It Works =

1. Navigate to **Plugins > Installed Plugins** or **Plugins > Add New**
2. Look for the blue drop zone in the bottom-right corner
3. Drag one or more ZIP files onto any part of the page
4. Watch the progress bar as plugins install automatically
5. Receive notifications for each plugin's installation status
6. Page automatically refreshes to show your new plugins

= Perfect For =

* Developers setting up new WordPress sites
* Agencies managing multiple client websites
* Anyone who regularly installs multiple plugins
* Users who want a faster, more efficient installation process

= Technical Details =

* Uses WordPress native installation APIs
* Implements proper security checks and nonces
* Handles file upload errors gracefully
* Provides detailed error messages for troubleshooting
* Compatible with all standard WordPress plugin ZIP formats

== Installation ==

= Automatic Installation =

1. Go to **Plugins > Add New** in your WordPress admin
2. Search for "Drag Drop Bulk Installer"
3. Click **Install Now** and then **Activate**

= Manual Installation =

1. Download the plugin ZIP file
2. Go to **Plugins > Add New > Upload Plugin**
3. Choose the downloaded ZIP file and click **Install Now**
4. Activate the plugin after installation

= From Source =

1. Upload the `drag-drop-bulk-installer` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress

== Frequently Asked Questions ==

= Does this work with all ZIP files? =

Yes, any standard WordPress plugin ZIP file will work. The plugin validates file types and only accepts ZIP files for security.

= Can I install premium/commercial plugins? =

Absolutely! As long as you have the ZIP file, you can install any WordPress plugin, including premium plugins.

= What happens if a plugin fails to install? =

The plugin provides detailed error messages and continues installing other plugins. Failed installations are clearly marked with red error notifications.

= Does this plugin slow down my site? =

No, the plugin only loads its JavaScript and CSS on admin plugin pages and has no impact on your site's frontend performance.

= Is this secure? =

Yes, the plugin uses WordPress's built-in security features including nonces, capability checks, and the standard WordPress plugin installation API.

= Can I install plugins on multisite? =

The plugin respects WordPress multisite permissions. You need the appropriate capabilities to install plugins on a multisite network.

== Screenshots ==

1. **Drop Zone Interface** - The blue drop zone appears in the bottom-right corner of plugin pages
2. **Progress Modal** - Beautiful progress bar showing installation status in real-time
3. **Success Notifications** - Green notifications confirm successful plugin installations
4. **Error Handling** - Red notifications clearly show any installation failures
5. **Bulk Processing** - Install multiple plugins simultaneously with individual progress tracking

== Changelog ==

= 1.0 =
* Initial release
* Drag and drop interface for plugin installation
* Real-time progress bar with completion tracking
* Smart notification system with success/error states
* Automatic plugin activation after installation
* File type validation and security checks
* Output buffering to handle mixed HTML/JSON responses
* Automatic page refresh after completion
* Support for bulk plugin installation
* Error handling with detailed messages
* Modern, responsive UI design

== Upgrade Notice ==

= 1.0 =
Initial release of Drag Drop Bulk Installer. Install to start using drag and drop installation!

== Development ==

This plugin is actively developed and maintained on GitHub: https://github.com/arunadaybasu/drag-drop-bulk-installer

Feature requests and bug reports are welcome.

= Contributing =

* View source code and contribute on GitHub: https://github.com/arunadaybasu/drag-drop-bulk-installer
* Report bugs and suggest features on the support forum
* Submit pull requests for code improvements
* Help translate the plugin into other languages

= Technical Requirements =

* WordPress 5.0 or higher
* PHP 7.4 or higher
* Standard WordPress file permissions for plugin installation
* JavaScript enabled in browser

== Support ==

For support questions, please use the WordPress.org support forum for this plugin. For urgent issues or custom development needs, please contact the plugin author.

== Privacy ==

This plugin does not collect, store, or transmit any user data. All plugin installations happen locally on your WordPress installation using WordPress's standard APIs.