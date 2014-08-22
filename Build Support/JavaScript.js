/* jshint node:true */
var cleaner = require("./Utilities/AMDClean");

module.exports = function (grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    grunt.registerTask("javascript", ["requirejs", "uglify:build"]);

    return {
        tasks: {
            /**
             * Statically build all dependencies into one file for production
             */
            "requirejs": {
                all: {
                    options: {
                        basePath: paths.source(),
                        mainConfigFile: paths.source(parameters.requireJsConfigName),
                        dir: paths.build("requirejs"),
                        optimize: "none",
                        generateSourceMaps: true,
                        modules: [{
                            name: parameters.entryPoint
                        }],
                        // Run amdclean on the build result
                        onModuleBundleComplete: cleaner.createOnModuleBundleComplete(parameters, paths)
                    }
                }
            },

            /**
             * Minify the build
             */
            "uglify": {
                options: {
                    report: "min",
                    /** preserve special comments, which include licenses and stuff */
                    preserveComments: "some",
                    /** Write out source maps for each uglified target */
                    sourceMap: function (filepath) {
                        return filepath + ".map";
                    }
                },
                "build": {
                    files: [
                        {
                            src: paths.build("requirejs", parameters.entryPoint + ".cleaned.js"),
                            dest: paths.build("uglify", parameters.entryPoint + ".cleaned.min.js")
                        }
                    ]
                }
            }
        }
    };
};
