/* jshint node:true, unused:false */
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

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

    return {
        tasks: {
            /**
             * Karma-Runner execution configuration to execute Unit-Tests from
             * within Grunt
             */
            "karma": {
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
            }
        }
    };
};