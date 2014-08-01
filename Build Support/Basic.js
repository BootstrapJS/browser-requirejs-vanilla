/* jshint node:true */
/**
 * Simple collection of Grunt related build helpers
 */
var fs = require("fs");

/**
 * Load a JSON file relative to the project directory, stubbing it with a default,
 * if it does not exist
 *
 * @param {string} filename
 * @param {*} alternative
 * @return {*}
 */
exports.loadJSONFile = function(filename, alternative) {
    var fullPath = __dirname + "/../" + filename;
    if (fs.existsSync(fullPath)) {
        return JSON.parse(
            fs.readFileSync(fullPath, {encoding: "utf8"})
        );
    } else {
        return alternative;
    }
};

/**
 * Create easy to use path accessor methods from a given path object
 *
 * @param {Object.<String,String>} paths
 * @return {Object.<String, Function>}
 */
exports.createPathAccessors = function(paths) {
    var pathAccessors = {};
    var key, path;
    /*jshint -W083, -W089*/
    for (key in paths) {
        if (paths.hasOwnProperty(key)) {
            path = paths[key];
            pathAccessors[key] = (function(path) {
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

    return pathAccessors;
};

