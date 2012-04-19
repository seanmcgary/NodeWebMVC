var path = require('path');

/****************************************************************************************
 * Web server settings
 ****************************************************************************************/
exports.port = 9000;
exports.base_url = 'http://localhost' + ((exports.port != 80) ? ':' + exports.port : '');
exports.url_ext = '/';
exports.full_url = exports.base_url + exports.url_ext;

/****************************************************************************************
 * Directory Definitions
 ****************************************************************************************/
exports.root_dir = path.normalize(__dirname + '/../');

// lib and core
exports.lib_dir = path.normalize(__dirname + '/../lib/');
exports.core_dir = path.normalize(__dirname + '/../lib/core/');

// config
exports.config_dir = path.normalize(__dirname + '/');

// modules
exports.modules_dir = path.normalize(__dirname + '/../www/modules/');

// www directories
exports.static_dir = path.normalize(__dirname + '/../www/static/');
exports.views_dir = path.normalize(__dirname + '/../www/views/');
exports.controllers_dir = path.normalize(__dirname + '/../www/controllers/');
exports.models_dir = path.normalize(__dirname + '/../www/models/');
exports.libraries_dir = path.normalize(__dirname + '/../www/libraries/');

/****************************************************************************************
 * Default Controllers and paths
 ****************************************************************************************/
// default controller
exports.default_controller = 'main';

// default controller function
exports.default_function = 'index';

/****************************************************************************************
 * View Cacheing
 ****************************************************************************************/
exports.cache_views = false;

// either cache using node, or use something like Redis
exports.cache_location = null; // local || redis

/****************************************************************************************
 * Template engine to use
 ****************************************************************************************/
exports.template_parser = 'mustache';

/****************************************************************************************
 * Session handling
 ****************************************************************************************/
exports.session_secret_key = '';

exports.redis_db = 2;
exports.redis_pass = '';
exports.redis_host = '';
exports.redis_prefix = '';

/****************************************************************************************
 * MongoDB Settings
 ****************************************************************************************/
exports.db_host = 'localhost';
exports.db_port = 27017;
exports.db_database = '';

/****************************************************************************************
 * App config loading
 ****************************************************************************************/
exports.app_config = require('../www/app_configs/app_config.js');
