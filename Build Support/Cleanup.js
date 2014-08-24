/* jshint node:true, unused:false*/
module.exports = function(grunt, options) {
    var parameters = options.parameters;
    var paths = options.paths;

    return {
        tasks: {
            /**
             * Clean all the build and temporary directories
             */
            clean: {
                "build": [paths.build()],
                "distribution": [paths.distribution()],
                "www": [paths.www()]
            }
        }
    };
};
