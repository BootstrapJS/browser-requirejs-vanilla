/* jshint node:true */
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;
    var pkg = options.pkg;

    grunt.registerTask("lint", ["jshint"]);

    return {
        tasks: {
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
            }
        }
    };
};