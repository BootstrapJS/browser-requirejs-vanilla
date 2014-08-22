/* jshint node:true */
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    grunt.registerTask("server", ["symlink", "devserver:all"]);

    return {
        tasks: {
            /**
             * Symlink files to www directory
             */
            "symlink": {
                options: {
                    overwrite: true
                },
                "www": {
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
                            src: paths.styles(),
                            dest: paths.www(paths.styles())
                        },
                        {
                            expand: true,
                            cwd: paths.assets(),
                            src: ["*"],
                            dest: paths.www()
                        }
                    ]
                }
            },

            /*
             * DevServer configuration
             */
            devserver: {
                all: {
                    options: {
                        port: parameters.devServer.port,
                        base: __dirname + "/../" + parameters.devServer.documentRoot
                    }
                }
            }
        }
    };
};
