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
     * Statically build all dependencies into one file for production
     */
    grunt.config("requirejs", {
        all: {
            options: {
                basePath: "src/",
                mainConfigFile: "src/require.config.js",
                dir: "build/",
                optimize: "none",
                generateSourceMaps: true,
                wrap: {
                    start: "(function() {",
                    end: "}());"
                },
                modules: {
                    name: "main",
                    include: ["../node_modules/almond/almond"],
                    override: {
                        // We use the wrapping technique here instead of `insertRequire`
                        // as we need one initial sync `require` to make sure the library
                        // is fully loaded once the file is completely processed.
                        // `insertRequire` is async!
                        wrap: {
                            start: "(function() {",
                            end: "require('main');\n" + "}());"
                        }
                    }
                }
            }
        }
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
        },
        build: {
            files: [
                "src/**/*.js"
            ]
        }
    });


    /**
     * Available Grunt-Tasks to the outside world
     */
    grunt.registerTask("lint", ["jshint"]);

    grunt.registerTask("build", ["lint", "requirejs"]);

    grunt.registerTask("default", ["build"]);
};
