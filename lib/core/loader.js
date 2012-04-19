/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 1/4/12
 * Time: 8:29 PM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

function loader(config){
    var self = this;

    self.config = config;
    self.loaded_objects = {};
    self.loaded_models = [];

    self.handlebars = require('handlebars');

    console.log("loader initialized");
}

/**
 * get_inst is used for objects that should be initialzed only once (e.g. objects following the singleton pattern)
 * @param object_name
 */
loader.prototype.get_inst = function(object_name){
    var self = this;

    if(object_name in self.loaded_objects){
        return self.loaded_objects[object_name];
    } else {

        self.loaded_objects[object_name] = self.get_obj(object_name)

        return self.loaded_objects[object_name];
    }
};

/**
 * Get an instance of an object. Resolves the require path based on the objects name
 *
 * @param object_name
 */
loader.prototype.get_obj = function(object_name){
    var self = this;

    object_path = object_name.replace(/_/g, '/');

    var object_path = self.config.root_dir + object_path;

    var obj = require(object_path)[object_name];

    return new obj([self.config, self]);
}

/**
 * Alias function to wrap get_inst to make loading models more obvious
 * @param model_name
 */
loader.prototype.load_model = function(model_name, alias){
    var self = this;
    var model = null;

    if(self._model_is_loaded(model_name) == false){
        model = self.get_inst(model_name);
    } else {
        model = self.loaded_objects[model_name];
    }

    self.loaded_models.push({model_name: model_name, alias: alias});

    return model;

};

loader.prototype._model_is_loaded = function(model_name){
    var self = this;

    for(var i = 0; i < self.loaded_models.length; i++){

        if(self.loaded_models[i].model_name == model_name){
            return true;
        }
    }

    return false;
};

/**
 * Used to share an instance of a model to the rest of the models.
 *
 * When a model is created, give all the other models a reference to it
 *
 * @param model_name
 * @param alias
 */
loader.prototype._share_model = function(model_name, alias){
    var self = this;

    if(typeof alias == 'undefined'){
        alias = model_name;
    }

    if(self._model_is_loaded(model_name)){
        var model = self.loaded_objects[model_name];

        for(var i = 0; i < self.loaded_models.length; i++){

            if(self.loaded_models[i].model_name != model_name){

                self.loaded_objects[self.loaded_models[i].model_name]._receive_model_share(model, alias);
            }
        }

    } else {
        console.error('Model not initialized');
    }

};

/**
 * When a model is initialized, get references to existing models
 * @param model_name - model name to send other models to
 */
loader.prototype._get_existing_models = function(model_name, alias){
    var self = this;

    var current_model = self.loaded_objects[model_name];

    if(typeof alias == 'undefined'){
        alias = model_name;
    }

    for(var i = 0; i < self.loaded_models.length; i++){
        if(self.loaded_models[i].model_name != model_name){
            current_model._receive_model_share(self.loaded_objects[self.loaded_models[i].model_name],self.loaded_models[i].alias);
        }
    }
};

/**
 * Arguments:
 *  0 - view name
 *  1 - data || callback
 *  2 - callback
 */
loader.prototype.get_view = function(view, data){
    var self = this;

    var view = fs.readFileSync(self.config.views_dir + view).toString();

    if(typeof data != 'undefined'){
        switch(self.config.template_parser){
            case 'mustache':
                view = self.handlebars.compile(view);
                view = view(data);
                break;
        }
    }

    return view;
};

loader.prototype.load_module = function(module_name){
    var self = this;
    return require(self.config.modules_dir + module_name);
};

exports.loader = loader;