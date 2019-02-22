(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const i = require("util");
        i.promisify || (i.promisify = function (i) {
            return function (...n) {
                return new Promise(function (r, t) {
                    i(...n, (i, n) => {
                        i ? t(i) : r(n)
                    })
                })
            }
        });
    }.call(this, exports, require, module, __filename, __dirname);
});