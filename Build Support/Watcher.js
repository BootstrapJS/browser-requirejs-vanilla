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
                    files: [
                        "Gruntfile.js",
                        "karma.conf.js",
                        "Build Support/**/*.js",
                        paths.specs("**/*" + parameters.specificationSuffix),
                        paths.source("**/*.js"),
                        paths.styles("**/*.less")
                    ],
                    tasks: ["lint"]
                },

                "build": {
                    files: [
                        paths.source("**/*.js"),
                        paths.styles("**/*.less")
                    ],
                    tasks: ["build"]
                }
            }
        }
    };
};
