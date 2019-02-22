(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {};
        if (module.exports = e, e.isNode = !("undefined" == typeof process || !process.versions || !process.versions.node), e.isElectron = !!(e.isNode && "electron" in process.versions), e.isNative = e.isElectron, e.isPureWeb = !e.isNode && !e.isNative, e.isElectron ? e.isRendererProcess = "undefined" != typeof process && "renderer" === process.type : e.isRendererProcess = "undefined" == typeof __dirname || null === __dirname, e.isMainProcess = "undefined" != typeof process && "browser" === process.type, e.isNode) e.isDarwin = "darwin" === process.platform, e.isWin32 = "win32" === process.platform;
        else {
            let s = window.navigator.platform;
            e.isDarwin = "Mac" === s.substring(0, 3), e.isWin32 = "Win" === s.substring(0, 3)
        }
        Object.defineProperty(e, "isRetina", {
            enumerable: !0,
            get: () => e.isRendererProcess && window.devicePixelRatio && window.devicePixelRatio > 1
        });
    }.call(this, exports, require, module, __filename, __dirname);
});