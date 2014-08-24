/* jshint node:true */
var support = require("./Build Support/Utilities/Basic");
module.exports = function (grunt) {
    /**
     * Automatically load all Grunttasks, which follow the pattern `grunt-*`
     */
    require('load-grunt-tasks')(grunt);

    /**
     * Time grunt execution
     */
    require("time-grunt")(grunt);

    /**
     * Load main build parameters
     */
    var parameters = support.loadJSONFile("Parameters.json", {});

    /**
     * Create convenience append functions for each path ;)
     */
    var paths = support.createPathAccessors(parameters.paths);

    /**
     * Allow access to package.json if present
     */
    var pkg = support.loadJSONFile("package.json", {});

    /**
     * Load all subtask definitions
     */
    grunt.initConfig(
        require("load-grunt-configs")(grunt, {
            parameters: parameters,
            paths: paths,
            pkg: pkg,
            config: {
                src: ["Build Support/*.js"]
            }
        })
    );

    /**
     * Default grunt task
     */
    grunt.registerTask("default", ["lint", "test", "build", "clean:build"]);
};
