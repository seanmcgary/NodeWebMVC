var express = require('express'),
	config = require('../config/server_config.js')
	app = express.createServer();
	router = require('./core/router.js').router;


var app_router = new router(config, app, express);

app.listen(config.port);