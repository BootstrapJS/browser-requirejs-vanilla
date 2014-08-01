/* global require */
(function() {
    var karma = window.__karma__;

    var specs = [];
    var file;

    // Collect all the defined specs
    for (file in karma.files) {
        if (karma.files.hasOwnProperty(file)) {
            if (/\.spec\.js$/.test(file)) {
                specs.push(file);
            }
        }
    }

    // Require all the test files using requirejs to properly load all their dependencies
    // After that start the karma run
    require(specs, karma.start);
})();
