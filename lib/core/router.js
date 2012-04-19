var path = require('path'),
    loader = require('./loader.js').loader;

var router = function(config, app, express){
	var self = this;

	self.config = config;
	self.app = app;
	self.express = express;
    self.redis_store = require('connect-redis')(self.express);

	// configure our application
	self.app.configure(function(){
        // lets setup some sessions
        // cookieParser requires the secret key be passed to it directly
        self.app.use(self.express.cookieParser(self.config.session_secret_key));
        self.app.use(self.express.session({
                secret: self.config.session_secret_key,
                store: new self.redis_store({
                    db: self.config.redis_db,
                    host: self.config.redis_host,
                    pass: self.config.redis_pass,
                    prefix: self.config.redis_prefix
                })
            }
        ));

        // views dir
		self.app.set('views', self.config.views_dir);	
		// make sure to serve static files before hitting the router
		self.app.use(self.express.bodyParser());
		self.app.use(self.express.static(self.config.static_dir));
		self.app.use(self.app.router);
	});

    // TODO - fix the fucking favicon.ico problem

	self.app.get('*', function(req, res){
        var conn = this;
        console.log("GET");
        if(req.url != '/favicon.ico'){
            conn.loader = new loader(self.config);
            // controller that will be used
            conn.controller_inst = null;

            self.route('get', req, res, conn);
        }
	});

	self.app.post('*', function(req, res){
        var conn = this;

        if(req.url != '/favicon.ico'){
            conn.loader = new loader(self.config);
            // controller that will be used
            conn.controller_inst = null;

            self.route('post', req, res, conn);
        }

	});
}

router.prototype = {
	route: function(req_type, req, res, conn){
		var self = this;
		
		var controller_params = [req, res, self.app, self.express, self.config, conn.loader];

        // if session.user doesnt exist, set it to null
        if(req.session.user == null || typeof req.session.user == 'undefined'){
            req.session.user = null;
        }

		if(req.url == '/'){
			conn.controller_inst = self.get_controller(self.config.default_controller, controller_params);

			req.uri = [];

		} else {
			var uri = [];

			// remove the leading slash
			if(req.url[0] == '/'){
				req.url = req.url.substr(-1 * (req.url.length - 1));
			}

			req.uri = req.url.split("/");

            // resolve the URI properly.
            // check to see if the controller name is a reserved controller.
            // if its not, we assume that its a person username, push the app_config generic controller
            // onto the front of the req.uri array to send it to the proper controller
            if(self.config.app_config.is_reserved(req.uri[0]) == false){
                req.uri.unshift(self.config.app_config.generic_controller);
            }

			conn.controller_inst = self.get_controller(req.uri[0], controller_params);
		}

        // check to see if the controller requires quthentication
        if(conn.controller_inst.requires_auth == true && req.session.user == null){
            res.redirect(conn.controller_inst.auth_redirect);
            return;
        } else {
            // if the uri length < 2, it doesnt have function params
            if(req.uri.length < 2){

                conn.controller_inst[self.config.default_function]();

            } else {

                // check to see if the controller has a _remap function. if it does, run that
                // otherwise, run the normal function
                if('_remap' in conn.controller_inst){

                    var params = [];
                    if(req.uri.length > 1){
                        params = req.uri.slice(1, req.uri.length);
                    }

                    conn.controller_inst['_remap'].apply(conn.controller_inst, [params]);
                } else {
                    // make sure to split off any GET params to get the correct function
                    var func = req.uri[1].split("\?")[0];

                    // if its a valid route, go there
                    if(self.is_route(conn.controller_inst, func)){
                        var params = [];
                        if(req.uri.length > 2){
                            params = req.uri.slice(2, req.uri.length);
                        }

                        conn.controller_inst[func].apply(conn.controller_inst, params);
                    } else {
                        // throw a 404 page
                        console.log("404 " + req.uri[1] + " not found");
                    }
                }
            }
        }
	},
	get_controller: function(controller_name, params){
		var self = this;
		var controller = require(self.config.controllers_dir + controller_name)[controller_name];

		return new controller(params);
	},
	is_route: function(controller_inst, route){
		var self = this;

		for(var i = 0; i < controller_inst.routes.length; i++){
			if(controller_inst.routes[i] == route){
				return true;
			}
		}

		return false;
	}

}

exports.router = router;
