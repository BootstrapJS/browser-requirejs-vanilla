/* jshint node:true */
module.exports = function (grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    grunt.registerTask("build", ["concurrent:build", "copy:dist"]);

    return {
        tasks: {
            /**
             * Concurrency of the build module
             */
            "concurrent": {
                "build": ["javascript", "styles"]
            },

            /**
             * Copy all the needed files to the distribution directory
             */
            "copy": {
                "dist": {
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
                            rename: function (dest, src) {
                                return dest + "/" + src.replace(".cleaned.", ".");
                            }
                        }
                    ]
                }
            }
        }
    };
};
