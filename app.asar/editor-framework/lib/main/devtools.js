(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {
            focus(e) {
                e.openDevTools(), e.nativeWin.devToolsWebContents && e.nativeWin.devToolsWebContents.focus()
            }, executeJavaScript(e, t) {
                e.openDevTools(), e.nativeWin.devToolsWebContents && e.nativeWin.devToolsWebContents.executeJavaScript(t)
            }, enterInspectElementMode(t) {
                e.executeJavaScript(t, "DevToolsAPI.enterInspectElementMode()")
            }
        };
        module.exports = e;
    }.call(this, exports, require, module, __filename, __dirname);
});