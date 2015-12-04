module.exports = function(oldRequire,options){
    /*
    * reload options
    */
    options = options || {};

    /**
     * Removes a module from the cache.
     */
    oldRequire.uncache = function (moduleName) {
        // Run over the cache looking for the files
        // loaded by the specified module name
        oldRequire.searchCache(moduleName, function (mod) {
            delete oldRequire.cache[mod.id];
        });
    };
     
    /**
     * Runs over the cache to search for all the cached files.
     */
   oldRequire.searchCache = function (moduleName, callback) {
        // Resolve the module identified by the specified name
        var mod = oldRequire.resolve(moduleName);
     
        // Check if the module has been resolved and found within
        // the cache
        if (mod && ((mod = oldRequire.cache[mod]) !== undefined)) {
            // Recursively go over the results
            (function run(mod) {
                // no reload library
                if( options.noLibrary && mod.id.indexOf('node_modules') != -1 ){
                    return;
                }

                // Go over each of the module's children and
                // run over it
                mod.children.forEach(function (child) {
                    run(child);
                });
     
                // Call the specified callback providing the
                // found module
                callback(mod);
            })(mod);
        }
    };
     
    /*
     * Load a module, clearing it from the cache if necessary.
     */
    oldRequire.reload = function(moduleName) {
        oldRequire.uncache(moduleName);
        return oldRequire(moduleName);
    };
    return oldRequire.reload.bind(oldRequire);
}
