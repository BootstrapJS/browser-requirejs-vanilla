/* jshint node:true */
var support = require("./Build Support/Utilities/Basic");

/**
 * Load main build parameters and paths
 */
var parameters = support.loadJSONFile("Parameters.json", {});
var paths = support.createPathAccessors(parameters.paths);

module.exports = function (config) {
    var preprocessors = {};
    preprocessors[paths.fixtures("**/*.html")] = ["html2js"];

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: './',

        frameworks: ['jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            // Requirejs configuration and test bootstrapping
            // Define before non included files to prioritize inclusion
            paths.source(parameters.requireJsConfigName),
            paths.specs("Environment/require.config.js"),
            paths.specs("Environment/init.js"),

            // Html fixtures
            paths.fixtures("**/*.html"),

            // All application and library source files
            {pattern: paths.source("**/*.js"), included: false, served: true},
            
            // All Test specs
            {pattern: paths.specs("**/*.spec.js"), included: false, served: true}
        ],

        // list of files to exclude
        exclude: [],

        // Preprocess certain files, like HTML ;)
        preprocessors: preprocessors,

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['progress', 'junit'],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: paths.logs("Karma/test-results.xml")
        },

        // web server port
        // CLI --port 9876
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        //
        // Started browsers are configured using Gruntfile.js
        //
        browsers: [],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 5000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500
    });
};
