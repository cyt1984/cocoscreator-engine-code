(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const {
            setClientId: e,
            prepareUserIdentity: t,
            sendAppInfo: o,
            trackEvent: r
        } = require("../../share/metrics");
        exports.dashboardOpen = function () {
            e(function () {
                t(), o(), r({
                    category: "Editor",
                    action: "Dashboard Open",
                    label: "new metrics"
                })
            })
        }, exports.dashboardClose = function (e) {
            let t = !1,
                o = function () {
                    t || (t = !0, e && e())
                };
            r({
                category: "Editor",
                action: "Dashboard Close",
                label: "new metrics"
            }, o), setTimeout(() => {
                console.log("quit due to request timeout"), o()
            }, 2e3)
        };
    }.call(this, exports, require, module, __filename, __dirname);
});