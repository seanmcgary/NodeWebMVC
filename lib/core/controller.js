var fs = require('fs');

function controller(){
	var self = this;

	self.req = null;
	self.res = null;

    self._loaded_models = [];
}

controller.prototype.init = function(req, res, app, express, config, loader){
	var self = this;

	self.req = req;
	self.res = res;
	self.app = app;
	self.express = express;
	self.config = config;
    self.loader = loader;

};

controller.prototype.load_model = function(model_name, alias){
    var self = this;

    var model = self.loader.load_model(model_name, alias);

    // if given an alias, use it
    if(typeof alias != 'undefined'){
        self._loaded_models.push(alias);
        self[alias] = model;
    } else {
        // else, use the full model name
        self._loaded_models.push(model_name);
        self[model_name] = model;
    }

    self.loader._share_model(model_name, alias);

    self.loader._get_existing_models(model_name, alias);
};

controller.prototype.send = function(data){
    var self = this;
    self.res.send(data);
};

controller.prototype.send_json = function(json){
    var self = this;

    json = JSON.stringify(json);

    self.res.header('Content-Type', 'application/json');

    self.res.send(json);
}

exports.controller = controller;
