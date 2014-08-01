/* globals module, __dirname */
var fs = require("fs");

module.exports = function (grunt) {
    /**
     * Automatically load all Grunttasks, which follow the pattern `grunt-*`
     */
    require('load-grunt-tasks')(grunt);

    /**
     * Configure the projects paths
     */
    var paths = {
        source: "Library",
        specs: "Specifications",
        build: "Temporary",
        distribution: "Package",
        assets: "Assets",
        www: "Public",
        vendor: "Vendor",
        bower: "bower_components",
        node: "node_modules"
    };

    // Create convenience append functions for each path ;)
    (function() {
        var key, path;
        /*jshint -W083, -W089*/
        for (key in paths) {
            if (paths.hasOwnProperty(key)) {
                path = paths[key];
                paths[key] = (function(path) {
                    return function(/* segment... */) {
                        var args = Array.prototype.slice.apply(arguments);
                        if (args.length === 0) {
                            return path;
                        }

                        var suffix = "";
                        args.forEach(function(segment) {
                            if (segment.substr(0, 1) === "/") {
                                segment = segment.substring(1);
                            }

                            suffix = suffix + "/" + segment;
                        });

                        return path + "/" + suffix;
                    };
                }(path));
            }
        }
        /*jshint +W083, +W089*/
    }());

    /**
     * Allow access to package.json if present
     */
    var pkg = {};
    if (fs.existsSync(__dirname + "/package.json")) {
        pkg = JSON.parse(
            fs.readFileSync(__dirname + "/package.json", {encoding: "utf8"})
        );
    }

    /**
     * Allow description and definition of avaialable tasks
     */
    grunt.config("availabletasks.tasks.options", {
        /* No special config yet */
    });
    grunt.registerTask("tasks", ["availabletasks"]);


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
            /** preserve special comments, which include licenses and stuff */
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
            jshintrc: pkg.jshintConfig || "jshint.json"
        },
        all: [
            "Gruntfile.js",
            "karma.conf.js",
            paths.specs("**/*.spec.js"),
            paths.source("**/*.js")
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
                basePath: paths.source(),
                mainConfigFile: paths.source("require.config.js"),
                dir: paths.build("requirejs"),
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
        files: [
            {
                src: paths.build("requirejs/main.js"),
                dest: paths.build("uglify/main.min.js")
            }
        ]
    });

    grunt.config("copy.dist", {
        files: [
            {
                expand: true,
                cwd: paths.assets(),
                src: ["*"],
                dest: paths.distribution()
            },
            {
                expand: true,
                flatten: true,
                src: [
                    paths.build("requirejs/main.js"),
                    paths.build("uglify/main.min.js"),
                    paths.build("uglify/main.min.map")
                ],
                dest: paths.distribution("js")
            }
        ]
    });

    grunt.config("watch.build", {
        files: [
            paths.source("**/*.js")
        ],
        tasks: ["build"]
    });

    grunt.registerTask("build", ["lint", "requirejs", "uglify:build", "copy:dist"]);


     /**
     * Karma-Runner execution configuration to execute Unit-Tests from
     * within Grunt
     */
    grunt.config("karma", {
        "all": {
            configFile: 'karma.conf.js',
            autoWatch: true
        },
        "all-single": {
            configFile: 'karma.conf.js',
            autoWatch: false
        },
        "dev":{
            configFile: 'karma.conf.js',
            browsers: ['PhantomJS'],
            autoWatch: true
        },
        "dev-single": {
            configFile: 'karma.conf.js',
            browsers: ['PhantomJS'],
            singleRun: true
        }
    });

    // Execute single test run with PhantomJS
    grunt.registerTask("test", ["karma:dev-single"]);

    // Execute a test run on a running server
    grunt.registerTask("test:run", ["karma:dev:run"]);

    // Watch changes and run tests on Phantom automatically
    grunt.registerTask("watch:test", ["karma:dev"]);

    // Run a karma test-server for everybody else to connect to
    grunt.registerTask("test:server", ["lint", "karma:all-single"]);

    // Run a karma test server for everybody to connect to, while watching
    // and auto-executing tests once files change
    grunt.registerTask("watch:test:server", ["lint", "karma:all"]);


    /**
     * Symlink files to www directory
     */
    grunt.config("symlink.www", {
        /*
         * Mostly use dynamic file lists in order to automatically skip those,
         * which may not exist like vendor or node_modules or bower_components
         */
        files: [
            {
                expand: true,
                cwd: ".",
                src: [paths.bower()],
                dest: paths.www()
            },
            {
                expand: true,
                cwd: ".",
                src: [paths.node()],
                dest: paths.www()
            },
            {
                expand: true,
                cwd: ".",
                src: [paths.vendor()],
                dest: paths.www()
            },
            {
                src: paths.source(),
                dest: paths.www("js")
            },
            {
                expand: true,
                cwd: paths.assets(),
                src: ["*"],
                dest: paths.www()
            }
        ]
    });


    /**
     * Clean all the build and temporary directories
     */
    grunt.config("clean", {
        "build": [paths.build("**/*")],
        "distribution": [paths.distribution("**/*")],
        "www": [paths.www("**/*")]
    });

    /**
     * Default grunt task ;)
     */
    grunt.registerTask("default", ["build"]);
};
