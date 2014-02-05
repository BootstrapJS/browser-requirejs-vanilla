/* globals module */
module.exports = function (grunt) {
    /**
     * Automatically load all Grunttasks, which follow the pattern `grunt-*`
     */
    require('load-grunt-tasks')(grunt);

    /**
     * Basic configuration for all watch tasks
     */
    grunt.config("watch", {
        options: {
            atBegin: true
        }
    });

    /**
     * Basic configuration for all symlink tasks
     */
    grunt.config("symlink", {
        options: {
            overwrite: true
        }
    });


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

    grunt.config("watch.lint", {
        files: grunt.config.get("jshint.all"),
        tasks: ["lint"]
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

    grunt.config("watch.build", {
        files: [
            "src/**/*.js"
        ]
    });


    /**
     * Symlink files to www directory
     */
    grunt.config("symlink.www", {
        files: [
            {
                src: "node_modules/requirejs/require.js",
                dest: "www/vendor/requirejs/require.js"
            },
            {
                src: "src",
                dest: "www/js"
            },
            {
                expand: true,
                cwd: "assets",
                src: ["*"],
                dest: "www/"
            }
        ]
    });

    /**
     * Available Grunt-Tasks to the outside world
     */
    grunt.registerTask("lint", ["jshint"]);

    grunt.registerTask("build", ["lint", "requirejs"]);

    grunt.registerTask("default", ["build"]);
};
