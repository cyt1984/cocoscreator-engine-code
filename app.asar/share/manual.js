(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const t = require("electron"),
            o = {
                en: {
                    home: "https://docs.cocos2d-x.org/creator/manual/en/",
                    "quick-start": "https://docs.cocos2d-x.org/creator/manual/en/getting-started/quick-start.html",
                    "getting-started": "https://docs.cocos2d-x.org/creator/manual/en/getting-started/"
                },
                zh: {
                    home: "https://docs.cocos.com/creator/manual/zh/",
                    "quick-start": "https://docs.cocos.com/creator/manual/zh/getting-started/quick-start.html",
                    "getting-started": "https://docs.cocos.com/creator/manual/zh/getting-started/"
                }
            },
            e = {
                en: {
                    home: "https://docs.cocos2d-x.org/creator/api/en/",
                    services: "https://docs.cocos2d-x.org/creator/2.1/manual/en/sdk/cocos-services.html"
                },
                zh: {
                    home: "https://docs.cocos.com/creator/api/zh/",
                    services: "https://docs.cocos.com/creator/manual/zh/sdk/cocos-services.html"
                }
            };
        exports.openManual = function (e) {
            e = e || "home";
            let c = o[Editor.lang];
            c || (c = o.en);
            let s = c[e];
            e && t.shell.openExternal(s)
        }, exports.openAPI = function (o) {
            o = o || "home";
            let c = e[Editor.lang];
            c || (c = e.en);
            let s = c[o];
            o && t.shell.openExternal(s)
        };
    }.call(this, exports, require, module, __filename, __dirname);
});