/* jshint node:true */
var support = require("./Build Support/Basic");
var cleaner = require("./Build Support/AMDClean");
module.exports = function (grunt) {
    /**
     * Automatically load all Grunttasks, which follow the pattern `grunt-*`
     */
    require('load-grunt-tasks')(grunt);

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
            report: "min",
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
            "Build Support/**/*.js",
            paths.specs("**/*" + parameters.specificationSuffix),
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
    });

    grunt.config("uglify.build", {
        files: [
            {
                src: paths.build("requirejs", parameters.entryPoint + ".cleaned.js"),
                dest: paths.build("uglify", parameters.entryPoint + ".cleaned.min.js")
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
                    paths.build("requirejs", parameters.entryPoint + ".cleaned.js"),
                    paths.build("uglify", parameters.entryPoint + ".cleaned.min.js"),
                    paths.build("uglify", parameters.entryPoint + ".cleaned.min.map")
                ],
                dest: paths.distribution(paths.source()),
                rename: function(dest, src) {
                    return dest + "/" + src.replace(".cleaned.", ".");
                }
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
                src: ["Parameters.json"],
                dest: paths.www()
            },
            {
                expand: true,
                cwd: ".",
                src: [paths.bower()],
                dest: paths.www()
            },
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
                dest: paths.www(paths.source())
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
     * DevServer configuration
     */
    grunt.config("devserver", {
        all: {
            options: {
                port: parameters.devServer.port,
                base: __dirname + "/" + parameters.devServer.documentRoot
            }
        }
    });

    grunt.registerTask("server", ["symlink", "devserver:all"]);

    /**
     * Clean all the build and temporary directories
     */
    grunt.config("clean", {
        "build": [paths.build()],
        "distribution": [paths.distribution()],
        "www": [paths.www()]
    });

    /**
     * Default grunt task ;)
     */
    grunt.registerTask("default", ["build"]);
};
