/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 1/6/12
 * Time: 6:09 PM
 * To change this template use File | Settings | File Templates.
 */

var util = require('util'),
    cli = require('cli');

//console.log(process.argv);

/*if(process.argv.length < 3){
    console.log("Usage: node generate_controller <controller_name> ")
}*/

cli.parse({
    test: ['t', 'This is a test message'],

});

cli.main(function(args, options){
    console.log(args);
    console.log(options);
});