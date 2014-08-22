/* jshint node:true */
var loadJSONFile = require("./Utilities/Basic.js").loadJSONFile;

module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;
    var pkg = options.pkg;

    var csslintOptions = loadJSONFile(
        pkg.csslintConfig || "csslint.json",
        {}
    );

    grunt.registerTask("lint", ["concurrent:lint"]);

    return {
        tasks: {
            "concurrent": {
                "lint": ["jshint", "lesslint"]
            },
            /**
             * Jshint configuration for linting the project files
             */
            "jshint": {
                options: {
                    jshintrc: pkg.jshintConfig || "jshint.json"
                },
                all: [
                   "Gruntfile.js",
                    "karma.conf.js",
                    "Build Support/**/*.js",
                    paths.specs("**/*" + parameters.specificationSuffix),
                    paths.source("**/*.js")
                ]
            },

            /**
             * LessLint configuration for linting Less files
             */
            "lesslint": {
                options: {
                    less: {
                        paths: [paths.styles()]
                    },
                    csslint: csslintOptions
                },
                src: [paths.styles("*/*.less")]
            }
        }
    };
};
