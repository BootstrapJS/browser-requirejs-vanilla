/* jshint node:true */
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    /**
     * The whole css processing chain in one build step command
     */
    grunt.registerTask("styles", ["less", "autoprefixer", "cssmin"]);
    grunt.registerTask("css", ["styles"]);

    return {
        tasks: {
            /**
             * Configuration of less CSS preprocessing
             */
            "less": {
                all: {
                    options: {
                        paths: [
                            paths.styles
                        ],
                        modifyVars: parameters.less.modifyVars || {},
                        relativeUrls: false
                    },
                    files: [{
                        expand: true,
                        flatten: true,
                        src: [paths.styles("*.less")],
                        dest: paths.build("less"),
                        ext: ".css"
                    }]
                }
            },

            /**
             * Configuration of CSS browser specific prefixing
             */
            "autoprefixer": {
                all: {
                    options: {
                        browsers: parameters.autoprefixer.browsers
                    },
                    files: [{
                        expand: true,
                        flatten: true,
                        src: [paths.build("less/*.css")],
                        dest: paths.build("autoprefixer")
                    }]
                }
            },

            /**
             * Configuration of CSS minification
             */
            "cssmin": {
                all: {
                    options: {
                        keepSpecialComments: 0,
                        report: "min"
                    },
                    files: [{
                        expand: true,
                        flatten: true,
                        src: [paths.build("autoprefixer/*.css")],
                        dest: paths.build("cssmin"),
                        ext: ".min.css"
                    }]
                }
            }
        }
    };
};
