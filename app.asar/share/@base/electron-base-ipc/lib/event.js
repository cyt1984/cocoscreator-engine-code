(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        exports.MessageEvent = class {
            constructor(s) {
                this.senderType = s, this.sender = "", this.needCallback = !1, this.reply = function () {}
            }
        };
    }.call(this, exports, require, module, __filename, __dirname);
});