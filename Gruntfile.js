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
     * Basic configuration for all uglify tasks
     */
    grunt.config("uglify", {
        options: {
            report: "gzip",
            /** preserve special comments, which include licensens and stuff */
            preserveComments: "some",
            /** Write out source maps for each uglified target */
            sourceMap: function(filepath) {
                return filepath + ".map";
            }
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

    grunt.registerTask("lint", ["jshint"]);


    /**
     * Statically build all dependencies into one file for production
     */
    grunt.config("requirejs", {
        all: {
            options: {
                basePath: "src/",
                mainConfigFile: "src/require.config.js",
                dir: "build/requirejs/",
                optimize: "none",
                generateSourceMaps: true,
                wrap: {
                    start: "(function() {",
                    end: "}());"
                },
                modules: [{
                    name: "main",
                    include: ["../../node_modules/almond/almond"],
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
                }]
            }
        }
    });

    grunt.config("uglify.build", {
        files: {
            "build/uglify/main.min.js": "build/requirejs/main.js"
        }
    });

    grunt.config("copy.dist", {
        files: [
            {
                expand: true,
                cwd: "assets",
                src: ["*"],
                dest: "dist/"
            },
            {
                expand: true,
                flatten: true,
                src: [
                    "build/requirejs/main.js",
                    "build/uglify/main.min.js",
                    "build/uglify/main.min.map"
                ],
                dest: "dist/js/"
            }
        ]
    });

    grunt.config("watch.build", {
        files: [
            "src/**/*.js"
        ],
        tasks: ["build"]
    });

    grunt.registerTask("build", ["lint", "requirejs", "uglify:build", "copy:dist"]);


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
     * Default grunt task ;)
     */
    grunt.registerTask("default", ["build"]);
};
