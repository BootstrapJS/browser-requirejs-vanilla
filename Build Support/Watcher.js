/* jshint node:true, unused:false*/
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    return {
        tasks: {
            "watch": {
                options: {
                    atBegin: true
                },

                "lint": {
                    files: grunt.config.get("jshint.all"),
                    tasks: ["lint"]
                },

                "build": {
                    files: [
                        paths.source("**/*.js")
                    ],
                    tasks: ["build"]
                }
            }
        }
    };
};