/* globals module */
module.exports = function (grunt) {
    /**
     * Automatically load all Grunttasks, which follow the pattern `grunt-*`
     */
    require('load-grunt-tasks')(grunt);

    /**
     * Jshint configuration for linting the project files
     */
    grunt.config("jshint", {
        options: {
            jshintrc: "jshint.json"
        },
        all: [
            "Gruntfile.js",
            "specs/**/*.js",
            "src/**/*.js"
        ]
    });


    /**
     * Allow to watch and re-execute tasks once files change automatically
     */
    grunt.config("watch", {
        options: {
            atBegin: true
        },
        lint: {
            files: grunt.config.get("jshint.all"),
            tasks: ["lint"]
        }
    });


    /**
     * Available Grunt-Tasks to the outside world
     */
    grunt.registerTask("lint", ["jshint"]);
};
