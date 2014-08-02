/* jshint node:true */
var fs = require("fs");
var amdclean = require("amdclean");

exports.createOnModuleBundleComplete = function (parameters, paths) {
    return function (data) {
        var modulePath = paths.build("requirejs", data.path);
        var cleanedModulePath = paths.build("requirejs", data.name + ".cleaned.js");
        var globalModules = (parameters.exportEntryPoint === true) ? [parameters.entryPoint] : [];
        fs.writeFileSync(cleanedModulePath, amdclean.clean({
            filePath: modulePath,
            globalModules: globalModules,
            transformAMDChecks: true
        }));
    };
};
