
function model(){
	var self = this;
	
	self._loaded_models = [];
	self.config = null;
}

model.prototype.init = function(config, loader, name){
	var self = this;

	self.config = config;
    self.name = name;
    self.loader = loader;

    self.hash = self.loader.load_module('hashlib');
    self.mongo = self.loader.load_module('mongodb-wrapper');

    self.db = self.mongo.db(self.config.db_host, self.config.db_port, self.config.db_database);

};

model.prototype.load_model = function(model_name){

};

model.prototype._receive_model_share = function(model_inst, model_alias){
    var self = this;

    //if(!(model_alias in self)){
    //    self._loaded_models.push(model_alias);
    //}

    self[model_alias] = model_inst;
};

model.prototype._show_loaded_models = function(){
    var self = this;
    //console.log("Loaded models - " + self.name + ":\n--------");
    //console.log(self._loaded_models);
    //console.log(self);
};

model.prototype._unix_time = function(){
    var self = this;

    return parseInt(new Date().getTime() / 1000);
};

model.prototype._get_item_for_attr = function(collection, attr, val, cb){
    var self = this;

    self.db.collection(collection);

    self.db[collection].findOne({attr: val}, function(err, obj){
        if(err == null){
            cb(obj);
        } else {
            cb(false);
        }
    });
};

model.prototype._generate_id = function(collection, attr, cb){
    var self = this;

    var id = '';

    for(i = 0; i < 10; i++){
        id += (Math.floor(Math.random() * (9 - 0 + 1)) + 0).toString();
    }

    self.db.collection(collection);

    self._get_item_for_attr(collection, attr, id, function(obj){
        if(typeof obj == 'undefined'){
            cb(id);
        } else {
            self._generate_id(cb);
        }
    });
};



exports.model = model;


