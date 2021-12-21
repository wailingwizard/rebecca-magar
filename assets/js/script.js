function hasClass(t, e) {
    return new RegExp(" " + e + " ").test(" " + t.className + " ");
}
function toggleClass(t, e) {
    var n = " " + t.className.replace(/[\t\r\n]/g, " ") + " ";
    if (hasClass(t, e)) {
        for (; n.indexOf(" " + e + " ") >= 0;) n = n.replace(" " + e + " ", " ");
        t.className = n.replace(/^\s+|\s+$/g, "");
    } else t.className += " " + e;
}
function select(t) {
    var e = document.querySelectorAll(t);
    return e.length > 1 ? e : e.item(0);
}
!(function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? (module.exports = e()) : (t.EvEmitter = e());
})("undefined" != typeof window ? window : this, function () {
    function t() { }
    var e = t.prototype;
    return (
        (e.on = function (t, e) {
            if (t && e) {
                var n = (this._events = this._events || {}),
                    r = (n[t] = n[t] || []);
                return -1 == r.indexOf(e) && r.push(e), this;
            }
        }),
        (e.once = function (t, e) {
            if (t && e) {
                this.on(t, e);
                var n = (this._onceEvents = this._onceEvents || {}),
                    r = (n[t] = n[t] || {});
                return (r[e] = !0), this;
            }
        }),
        (e.off = function (t, e) {
            var n = this._events && this._events[t];
            if (n && n.length) {
                var r = n.indexOf(e);
                return -1 != r && n.splice(r, 1), this;
            }
        }),
        (e.emitEvent = function (t, e) {
            var n = this._events && this._events[t];
            if (n && n.length) {
                var r = 0,
                    i = n[r];
                e = e || [];
                for (var o = this._onceEvents && this._onceEvents[t]; i;) {
                    var a = o && o[i];
                    a && (this.off(t, i), delete o[i]), i.apply(this, e), (r += a ? 0 : 1), (i = n[r]);
                }
                return this;
            }
        }),
        t
    );
}),
    (function (t, e) {
        "use strict";
        "function" == typeof define && define.amd
            ? define(["ev-emitter/ev-emitter"], function (n) {
                return e(t, n);
            })
            : "object" == typeof module && module.exports
                ? (module.exports = e(t, require("ev-emitter")))
                : (t.imagesLoaded = e(t, t.EvEmitter));
    })(window, function (t, e) {
        function n(t, e) {
            for (var n in e) t[n] = e[n];
            return t;
        }
        function r(t) {
            var e = [];
            if (Array.isArray(t)) e = t;
            else if ("number" == typeof t.length) for (var n = 0; n < t.length; n++) e.push(t[n]);
            else e.push(t);
            return e;
        }
        function i(t, e, o) {
            return this instanceof i
                ? ("string" == typeof t && (t = document.querySelectorAll(t)),
                    (this.elements = r(t)),
                    (this.options = n({}, this.options)),
                    "function" == typeof e ? (o = e) : n(this.options, e),
                    o && this.on("always", o),
                    this.getImages(),
                    s && (this.jqDeferred = new s.Deferred()),
                    void setTimeout(
                        function () {
                            this.check();
                        }.bind(this)
                    ))
                : new i(t, e, o);
        }
        function o(t) {
            this.img = t;
        }
        function a(t, e) {
            (this.url = t), (this.element = e), (this.img = new Image());
        }
        var s = t.jQuery,
            l = t.console;
        (i.prototype = Object.create(e.prototype)),
            (i.prototype.options = {}),
            (i.prototype.getImages = function () {
                (this.images = []), this.elements.forEach(this.addElementImages, this);
            }),
            (i.prototype.addElementImages = function (t) {
                "IMG" == t.nodeName && this.addImage(t), this.options.background === !0 && this.addElementBackgroundImages(t);
                var e = t.nodeType;
                if (e && c[e]) {
                    for (var n = t.querySelectorAll("img"), r = 0; r < n.length; r++) {
                        var i = n[r];
                        this.addImage(i);
                    }
                    if ("string" == typeof this.options.background) {
                        var o = t.querySelectorAll(this.options.background);
                        for (r = 0; r < o.length; r++) {
                            var a = o[r];
                            this.addElementBackgroundImages(a);
                        }
                    }
                }
            });
        var c = { 1: !0, 9: !0, 11: !0 };
        return (
            (i.prototype.addElementBackgroundImages = function (t) {
                var e = getComputedStyle(t);
                if (e)
                    for (var n = /url\((['"])?(.*?)\1\)/gi, r = n.exec(e.backgroundImage); null !== r;) {
                        var i = r && r[2];
                        i && this.addBackground(i, t), (r = n.exec(e.backgroundImage));
                    }
            }),
            (i.prototype.addImage = function (t) {
                var e = new o(t);
                this.images.push(e);
            }),
            (i.prototype.addBackground = function (t, e) {
                var n = new a(t, e);
                this.images.push(n);
            }),
            (i.prototype.check = function () {
                function t(t, n, r) {
                    setTimeout(function () {
                        e.progress(t, n, r);
                    });
                }
                var e = this;
                return (
                    (this.progressedCount = 0),
                    (this.hasAnyBroken = !1),
                    this.images.length
                        ? void this.images.forEach(function (e) {
                            e.once("progress", t), e.check();
                        })
                        : void this.complete()
                );
            }),
            (i.prototype.progress = function (t, e, n) {
                this.progressedCount++,
                    (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
                    this.emitEvent("progress", [this, t, e]),
                    this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t),
                    this.progressedCount == this.images.length && this.complete(),
                    this.options.debug && l && l.log("progress: " + n, t, e);
            }),
            (i.prototype.complete = function () {
                var t = this.hasAnyBroken ? "fail" : "done";
                if (((this.isComplete = !0), this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred)) {
                    var e = this.hasAnyBroken ? "reject" : "resolve";
                    this.jqDeferred[e](this);
                }
            }),
            (o.prototype = Object.create(e.prototype)),
            (o.prototype.check = function () {
                var t = this.getIsImageComplete();
                return t
                    ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
                    : ((this.proxyImage = new Image()),
                        this.proxyImage.addEventListener("load", this),
                        this.proxyImage.addEventListener("error", this),
                        this.img.addEventListener("load", this),
                        this.img.addEventListener("error", this),
                        void (this.proxyImage.src = this.img.src));
            }),
            (o.prototype.getIsImageComplete = function () {
                return this.img.complete && void 0 !== this.img.naturalWidth;
            }),
            (o.prototype.confirm = function (t, e) {
                (this.isLoaded = t), this.emitEvent("progress", [this, this.img, e]);
            }),
            (o.prototype.handleEvent = function (t) {
                var e = "on" + t.type;
                this[e] && this[e](t);
            }),
            (o.prototype.onload = function () {
                this.confirm(!0, "onload"), this.unbindEvents();
            }),
            (o.prototype.onerror = function () {
                this.confirm(!1, "onerror"), this.unbindEvents();
            }),
            (o.prototype.unbindEvents = function () {
                this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this);
            }),
            (a.prototype = Object.create(o.prototype)),
            (a.prototype.check = function () {
                this.img.addEventListener("load", this), this.img.addEventListener("error", this), (this.img.src = this.url);
                var t = this.getIsImageComplete();
                t && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents());
            }),
            (a.prototype.unbindEvents = function () {
                this.img.removeEventListener("load", this), this.img.removeEventListener("error", this);
            }),
            (a.prototype.confirm = function (t, e) {
                (this.isLoaded = t), this.emitEvent("progress", [this, this.element, e]);
            }),
            (i.makeJQueryPlugin = function (e) {
                (e = e || t.jQuery),
                    e &&
                    ((s = e),
                        (s.fn.imagesLoaded = function (t, e) {
                            var n = new i(this, t, e);
                            return n.jqDeferred.promise(s(this));
                        }));
            }),
            i.makeJQueryPlugin(),
            i
        );
    }),
    !(function (t, e) {
        "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? (module.exports = e()) : (t.ScrollMagic = e());
    })(this, function () {
        "use strict";
        var t = function () { };
        (t.version = "2.0.5"), window.addEventListener("mousewheel", function () { });
        var e = "data-scrollmagic-pin-spacer";
        t.Controller = function (r) {
            var o,
                a,
                s = "ScrollMagic.Controller",
                l = "FORWARD",
                c = "REVERSE",
                u = "PAUSED",
                f = n.defaults,
                h = this,
                d = i.extend({}, f, r),
                p = [],
                g = !1,
                m = 0,
                v = u,
                y = !0,
                x = 0,
                b = !0,
                w = function () {
                    for (var t in d) f.hasOwnProperty(t) || delete d[t];
                    if (((d.container = i.get.elements(d.container)[0]), !d.container)) throw s + " init failed.";
                    (y = d.container === window || d.container === document.body || !document.body.contains(d.container)),
                        y && (d.container = window),
                        (x = k()),
                        d.container.addEventListener("resize", j),
                        d.container.addEventListener("scroll", j),
                        (d.refreshInterval = parseInt(d.refreshInterval) || f.refreshInterval),
                        C();
                },
                C = function () {
                    d.refreshInterval > 0 && (a = window.setTimeout(M, d.refreshInterval));
                },
                S = function () {
                    return d.vertical ? i.get.scrollTop(d.container) : i.get.scrollLeft(d.container);
                },
                k = function () {
                    return d.vertical ? i.get.height(d.container) : i.get.width(d.container);
                },
                E = (this._setScrollPos = function (t) {
                    d.vertical ? (y ? window.scrollTo(i.get.scrollLeft(), t) : (d.container.scrollTop = t)) : y ? window.scrollTo(t, i.get.scrollTop()) : (d.container.scrollLeft = t);
                }),
                T = function () {
                    if (b && g) {
                        var t = i.type.Array(g) ? g : p.slice(0);
                        g = !1;
                        var e = m;
                        m = h.scrollPos();
                        var n = m - e;
                        0 !== n && (v = n > 0 ? l : c),
                            v === c && t.reverse(),
                            t.forEach(function (t) {
                                t.update(!0);
                            });
                    }
                },
                _ = function () {
                    o = i.rAF(T);
                },
                j = function (t) {
                    "resize" == t.type && ((x = k()), (v = u)), g !== !0 && ((g = !0), _());
                },
                M = function () {
                    if (!y && x != k()) {
                        var t;
                        try {
                            t = new Event("resize", { bubbles: !1, cancelable: !1 });
                        } catch (e) {
                            (t = document.createEvent("Event")), t.initEvent("resize", !1, !1);
                        }
                        d.container.dispatchEvent(t);
                    }
                    p.forEach(function (t) {
                        t.refresh();
                    }),
                        C();
                };
            this._options = d;
            var B = function (t) {
                if (t.length <= 1) return t;
                var e = t.slice(0);
                return (
                    e.sort(function (t, e) {
                        return t.scrollOffset() > e.scrollOffset() ? 1 : -1;
                    }),
                    e
                );
            };
            return (
                (this.addScene = function (e) {
                    if (i.type.Array(e))
                        e.forEach(function (t) {
                            h.addScene(t);
                        });
                    else if (e instanceof t.Scene)
                        if (e.controller() !== h) e.addTo(h);
                        else if (p.indexOf(e) < 0) {
                            p.push(e),
                                (p = B(p)),
                                e.on("shift.controller_sort", function () {
                                    p = B(p);
                                });
                            for (var n in d.globalSceneOptions) e[n] && e[n].call(e, d.globalSceneOptions[n]);
                        }
                    return h;
                }),
                (this.removeScene = function (t) {
                    if (i.type.Array(t))
                        t.forEach(function (t) {
                            h.removeScene(t);
                        });
                    else {
                        var e = p.indexOf(t);
                        e > -1 && (t.off("shift.controller_sort"), p.splice(e, 1), t.remove());
                    }
                    return h;
                }),
                (this.updateScene = function (e, n) {
                    return (
                        i.type.Array(e)
                            ? e.forEach(function (t) {
                                h.updateScene(t, n);
                            })
                            : n
                                ? e.update(!0)
                                : g !== !0 && e instanceof t.Scene && ((g = g || []), -1 == g.indexOf(e) && g.push(e), (g = B(g)), _()),
                        h
                    );
                }),
                (this.update = function (t) {
                    return j({ type: "resize" }), t && T(), h;
                }),
                (this.scrollTo = function (n, r) {
                    if (i.type.Number(n)) E.call(d.container, n, r);
                    else if (n instanceof t.Scene) n.controller() === h && h.scrollTo(n.scrollOffset(), r);
                    else if (i.type.Function(n)) E = n;
                    else {
                        var o = i.get.elements(n)[0];
                        if (o) {
                            for (; o.parentNode.hasAttribute(e);) o = o.parentNode;
                            var a = d.vertical ? "top" : "left",
                                s = i.get.offset(d.container),
                                l = i.get.offset(o);
                            y || (s[a] -= h.scrollPos()), h.scrollTo(l[a] - s[a], r);
                        }
                    }
                    return h;
                }),
                (this.scrollPos = function (t) {
                    return arguments.length ? (i.type.Function(t) && (S = t), h) : S.call(h);
                }),
                (this.info = function (t) {
                    var e = { size: x, vertical: d.vertical, scrollPos: m, scrollDirection: v, container: d.container, isDocument: y };
                    return arguments.length ? (void 0 !== e[t] ? e[t] : void 0) : e;
                }),
                (this.loglevel = function () {
                    return h;
                }),
                (this.enabled = function (t) {
                    return arguments.length ? (b != t && ((b = !!t), h.updateScene(p, !0)), h) : b;
                }),
                (this.destroy = function (t) {
                    window.clearTimeout(a);
                    for (var e = p.length; e--;) p[e].destroy(t);
                    return d.container.removeEventListener("resize", j), d.container.removeEventListener("scroll", j), i.cAF(o), null;
                }),
                w(),
                h
            );
        };
        var n = { defaults: { container: window, vertical: !0, globalSceneOptions: {}, loglevel: 2, refreshInterval: 100 } };
        (t.Controller.addOption = function (t, e) {
            n.defaults[t] = e;
        }),
            (t.Controller.extend = function (e) {
                var n = this;
                (t.Controller = function () {
                    return n.apply(this, arguments), (this.$super = i.extend({}, this)), e.apply(this, arguments) || this;
                }),
                    i.extend(t.Controller, n),
                    (t.Controller.prototype = n.prototype),
                    (t.Controller.prototype.constructor = t.Controller);
            }),
            (t.Scene = function (n) {
                var o,
                    a,
                    s = "BEFORE",
                    l = "DURING",
                    c = "AFTER",
                    u = r.defaults,
                    f = this,
                    h = i.extend({}, u, n),
                    d = s,
                    p = 0,
                    g = { start: 0, end: 0 },
                    m = 0,
                    v = !0,
                    y = function () {
                        for (var t in h) u.hasOwnProperty(t) || delete h[t];
                        for (var e in u) _(e);
                        E();
                    },
                    x = {};
                (this.on = function (t, e) {
                    return (
                        i.type.Function(e) &&
                        ((t = t.trim().split(" ")),
                            t.forEach(function (t) {
                                var n = t.split("."),
                                    r = n[0],
                                    i = n[1];
                                "*" != r && (x[r] || (x[r] = []), x[r].push({ namespace: i || "", callback: e }));
                            })),
                        f
                    );
                }),
                    (this.off = function (t, e) {
                        return t
                            ? ((t = t.trim().split(" ")),
                                t.forEach(function (t) {
                                    var n = t.split("."),
                                        r = n[0],
                                        i = n[1] || "",
                                        o = "*" === r ? Object.keys(x) : [r];
                                    o.forEach(function (t) {
                                        for (var n = x[t] || [], r = n.length; r--;) {
                                            var o = n[r];
                                            !o || (i !== o.namespace && "*" !== i) || (e && e != o.callback) || n.splice(r, 1);
                                        }
                                        n.length || delete x[t];
                                    });
                                }),
                                f)
                            : f;
                    }),
                    (this.trigger = function (e, n) {
                        if (e) {
                            var r = e.trim().split("."),
                                i = r[0],
                                o = r[1],
                                a = x[i];
                            a &&
                                a.forEach(function (e) {
                                    (o && o !== e.namespace) || e.callback.call(f, new t.Event(i, e.namespace, f, n));
                                });
                        }
                        return f;
                    }),
                    f
                        .on("change.internal", function (t) {
                            "loglevel" !== t.what && "tweenChanges" !== t.what && ("triggerElement" === t.what ? C() : "reverse" === t.what && f.update());
                        })
                        .on("shift.internal", function () {
                            b(), f.update();
                        }),
                    (this.addTo = function (e) {
                        return (
                            e instanceof t.Controller && a != e && (a && a.removeScene(f), (a = e), E(), w(!0), C(!0), b(), a.info("container").addEventListener("resize", S), e.addScene(f), f.trigger("add", { controller: a }), f.update()),
                            f
                        );
                    }),
                    (this.enabled = function (t) {
                        return arguments.length ? (v != t && ((v = !!t), f.update(!0)), f) : v;
                    }),
                    (this.remove = function () {
                        if (a) {
                            a.info("container").removeEventListener("resize", S);
                            var t = a;
                            (a = void 0), t.removeScene(f), f.trigger("remove");
                        }
                        return f;
                    }),
                    (this.destroy = function (t) {
                        return f.trigger("destroy", { reset: t }), f.remove(), f.off("*.*"), null;
                    }),
                    (this.update = function (t) {
                        if (a)
                            if (t)
                                if (a.enabled() && v) {
                                    var e,
                                        n = a.info("scrollPos");
                                    (e = h.duration > 0 ? (n - g.start) / (g.end - g.start) : n >= g.start ? 1 : 0), f.trigger("update", { startPos: g.start, endPos: g.end, scrollPos: n }), f.progress(e);
                                } else j && d === l && B(!0);
                            else a.updateScene(f, !1);
                        return f;
                    }),
                    (this.refresh = function () {
                        return w(), C(), f;
                    }),
                    (this.progress = function (t) {
                        if (arguments.length) {
                            var e = !1,
                                n = d,
                                r = a ? a.info("scrollDirection") : "PAUSED",
                                i = h.reverse || t >= p;
                            if (
                                (0 === h.duration
                                    ? ((e = p != t), (p = 1 > t && i ? 0 : 1), (d = 0 === p ? s : l))
                                    : 0 > t && d !== s && i
                                        ? ((p = 0), (d = s), (e = !0))
                                        : t >= 0 && 1 > t && i
                                            ? ((p = t), (d = l), (e = !0))
                                            : t >= 1 && d !== c
                                                ? ((p = 1), (d = c), (e = !0))
                                                : d !== l || i || B(),
                                    e)
                            ) {
                                var o = { progress: p, state: d, scrollDirection: r },
                                    u = d != n,
                                    g = function (t) {
                                        f.trigger(t, o);
                                    };
                                u && n !== l && (g("enter"), g(n === s ? "start" : "end")), g("progress"), u && d !== l && (g(d === s ? "start" : "end"), g("leave"));
                            }
                            return f;
                        }
                        return p;
                    });
                var b = function () {
                    (g = { start: m + h.offset }), a && h.triggerElement && (g.start -= a.info("size") * h.triggerHook), (g.end = g.start + h.duration);
                },
                    w = function (t) {
                        if (o) {
                            var e = "duration";
                            T(e, o.call(f)) && !t && (f.trigger("change", { what: e, newval: h[e] }), f.trigger("shift", { reason: e }));
                        }
                    },
                    C = function (t) {
                        var n = 0,
                            r = h.triggerElement;
                        if (a && r) {
                            for (var o = a.info(), s = i.get.offset(o.container), l = o.vertical ? "top" : "left"; r.parentNode.hasAttribute(e);) r = r.parentNode;
                            var c = i.get.offset(r);
                            o.isDocument || (s[l] -= a.scrollPos()), (n = c[l] - s[l]);
                        }
                        var u = n != m;
                        (m = n), u && !t && f.trigger("shift", { reason: "triggerElementPosition" });
                    },
                    S = function () {
                        h.triggerHook > 0 && f.trigger("shift", { reason: "containerResize" });
                    },
                    k = i.extend(r.validate, {
                        duration: function (t) {
                            if (i.type.String(t) && t.match(/^(\.|\d)*\d+%$/)) {
                                var e = parseFloat(t) / 100;
                                t = function () {
                                    return a ? a.info("size") * e : 0;
                                };
                            }
                            if (i.type.Function(t)) {
                                o = t;
                                try {
                                    t = parseFloat(o());
                                } catch (n) {
                                    t = -1;
                                }
                            }
                            if (((t = parseFloat(t)), !i.type.Number(t) || 0 > t)) throw o ? ((o = void 0), 0) : 0;
                            return t;
                        },
                    }),
                    E = function (t) {
                        (t = arguments.length ? [t] : Object.keys(k)),
                            t.forEach(function (t) {
                                var e;
                                if (k[t])
                                    try {
                                        e = k[t](h[t]);
                                    } catch (n) {
                                        e = u[t];
                                    } finally {
                                        h[t] = e;
                                    }
                            });
                    },
                    T = function (t, e) {
                        var n = !1,
                            r = h[t];
                        return h[t] != e && ((h[t] = e), E(t), (n = r != h[t])), n;
                    },
                    _ = function (t) {
                        f[t] ||
                            (f[t] = function (e) {
                                return arguments.length ? ("duration" === t && (o = void 0), T(t, e) && (f.trigger("change", { what: t, newval: h[t] }), r.shifts.indexOf(t) > -1 && f.trigger("shift", { reason: t })), f) : h[t];
                            });
                    };
                (this.controller = function () {
                    return a;
                }),
                    (this.state = function () {
                        return d;
                    }),
                    (this.scrollOffset = function () {
                        return g.start;
                    }),
                    (this.triggerPosition = function () {
                        var t = h.offset;
                        return a && (t += h.triggerElement ? m : a.info("size") * f.triggerHook()), t;
                    });
                var j, M;
                f.on("shift.internal", function (t) {
                    var e = "duration" === t.reason;
                    ((d === c && e) || (d === l && 0 === h.duration)) && B(), e && A();
                })
                    .on("progress.internal", function () {
                        B();
                    })
                    .on("add.internal", function () {
                        A();
                    })
                    .on("destroy.internal", function (t) {
                        f.removePin(t.reset);
                    });
                var B = function (t) {
                    if (j && a) {
                        var e = a.info(),
                            n = M.spacer.firstChild;
                        if (t || d !== l) {
                            var r = { position: M.inFlow ? "relative" : "absolute", top: 0, left: 0 },
                                o = i.css(n, "position") != r.position;
                            M.pushFollowers
                                ? h.duration > 0 && (d === c && 0 === parseFloat(i.css(M.spacer, "padding-top")) ? (o = !0) : d === s && 0 === parseFloat(i.css(M.spacer, "padding-bottom")) && (o = !0))
                                : (r[e.vertical ? "top" : "left"] = h.duration * p),
                                i.css(n, r),
                                o && A();
                        } else {
                            "fixed" != i.css(n, "position") && (i.css(n, { position: "fixed" }), A());
                            var u = i.get.offset(M.spacer, !0),
                                f = h.reverse || 0 === h.duration ? e.scrollPos - g.start : Math.round(p * h.duration * 10) / 10;
                            (u[e.vertical ? "top" : "left"] += f), i.css(M.spacer.firstChild, { top: u.top, left: u.left });
                        }
                    }
                },
                    A = function () {
                        if (j && a && M.inFlow) {
                            var t = d === l,
                                e = a.info("vertical"),
                                n = M.spacer.firstChild,
                                r = i.isMarginCollapseType(i.css(M.spacer, "display")),
                                o = {};
                            M.relSize.width || M.relSize.autoFullWidth
                                ? t
                                    ? i.css(j, { width: i.get.width(M.spacer) })
                                    : i.css(j, { width: "100%" })
                                : ((o["min-width"] = i.get.width(e ? j : n, !0, !0)), (o.width = t ? o["min-width"] : "auto")),
                                M.relSize.height
                                    ? t
                                        ? i.css(j, { height: i.get.height(M.spacer) - (M.pushFollowers ? h.duration : 0) })
                                        : i.css(j, { height: "100%" })
                                    : ((o["min-height"] = i.get.height(e ? n : j, !0, !r)), (o.height = t ? o["min-height"] : "auto")),
                                M.pushFollowers && ((o["padding" + (e ? "Top" : "Left")] = h.duration * p), (o["padding" + (e ? "Bottom" : "Right")] = h.duration * (1 - p))),
                                i.css(M.spacer, o);
                        }
                    },
                    F = function () {
                        a && j && d === l && !a.info("isDocument") && B();
                    },
                    N = function () {
                        a &&
                            j &&
                            d === l &&
                            (((M.relSize.width || M.relSize.autoFullWidth) && i.get.width(window) != i.get.width(M.spacer.parentNode)) || (M.relSize.height && i.get.height(window) != i.get.height(M.spacer.parentNode))) &&
                            A();
                    },
                    L = function (t) {
                        a && j && d === l && !a.info("isDocument") && (t.preventDefault(), a._setScrollPos(a.info("scrollPos") - ((t.wheelDelta || t[a.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -t.detail)));
                    };
                (this.setPin = function (t, n) {
                    var r = { pushFollowers: !0, spacerClass: "scrollmagic-pin-spacer" };
                    if (((n = i.extend({}, r, n)), (t = i.get.elements(t)[0]), !t)) return f;
                    if ("fixed" === i.css(t, "position")) return f;
                    if (j) {
                        if (j === t) return f;
                        f.removePin();
                    }
                    j = t;
                    var o = j.parentNode.style.display,
                        a = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                    j.parentNode.style.display = "none";
                    var s = "absolute" != i.css(j, "position"),
                        l = i.css(j, a.concat(["display"])),
                        c = i.css(j, ["width", "height"]);
                    (j.parentNode.style.display = o), !s && n.pushFollowers && (n.pushFollowers = !1);
                    var u = j.parentNode.insertBefore(document.createElement("div"), j),
                        h = i.extend(l, { position: s ? "relative" : "absolute", boxSizing: "content-box", mozBoxSizing: "content-box", webkitBoxSizing: "content-box" });
                    if (
                        (s || i.extend(h, i.css(j, ["width", "height"])),
                            i.css(u, h),
                            u.setAttribute(e, ""),
                            i.addClass(u, n.spacerClass),
                            (M = {
                                spacer: u,
                                relSize: { width: "%" === c.width.slice(-1), height: "%" === c.height.slice(-1), autoFullWidth: "auto" === c.width && s && i.isMarginCollapseType(l.display) },
                                pushFollowers: n.pushFollowers,
                                inFlow: s,
                            }),
                            !j.___origStyle)
                    ) {
                        j.___origStyle = {};
                        var d = j.style,
                            p = a.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
                        p.forEach(function (t) {
                            j.___origStyle[t] = d[t] || "";
                        });
                    }
                    return (
                        M.relSize.width && i.css(u, { width: c.width }),
                        M.relSize.height && i.css(u, { height: c.height }),
                        u.appendChild(j),
                        i.css(j, { position: s ? "relative" : "absolute", margin: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }),
                        (M.relSize.width || M.relSize.autoFullWidth) && i.css(j, { boxSizing: "border-box", mozBoxSizing: "border-box", webkitBoxSizing: "border-box" }),
                        window.addEventListener("scroll", F),
                        window.addEventListener("resize", F),
                        window.addEventListener("resize", N),
                        j.addEventListener("mousewheel", L),
                        j.addEventListener("DOMMouseScroll", L),
                        B(),
                        f
                    );
                }),
                    (this.removePin = function (t) {
                        if (j) {
                            if ((d === l && B(!0), t || !a)) {
                                var n = M.spacer.firstChild;
                                if (n.hasAttribute(e)) {
                                    var r = M.spacer.style,
                                        o = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                                    (margins = {}),
                                        o.forEach(function (t) {
                                            margins[t] = r[t] || "";
                                        }),
                                        i.css(n, margins);
                                }
                                M.spacer.parentNode.insertBefore(n, M.spacer), M.spacer.parentNode.removeChild(M.spacer), j.parentNode.hasAttribute(e) || (i.css(j, j.___origStyle), delete j.___origStyle);
                            }
                            window.removeEventListener("scroll", F),
                                window.removeEventListener("resize", F),
                                window.removeEventListener("resize", N),
                                j.removeEventListener("mousewheel", L),
                                j.removeEventListener("DOMMouseScroll", L),
                                (j = void 0);
                        }
                        return f;
                    });
                var $,
                    P = [];
                return (
                    f.on("destroy.internal", function (t) {
                        f.removeClassToggle(t.reset);
                    }),
                    (this.setClassToggle = function (t, e) {
                        var n = i.get.elements(t);
                        return 0 !== n.length && i.type.String(e)
                            ? (P.length > 0 && f.removeClassToggle(),
                                ($ = e),
                                (P = n),
                                f.on("enter.internal_class leave.internal_class", function (t) {
                                    var e = "enter" === t.type ? i.addClass : i.removeClass;
                                    P.forEach(function (t) {
                                        e(t, $);
                                    });
                                }),
                                f)
                            : f;
                    }),
                    (this.removeClassToggle = function (t) {
                        return (
                            t &&
                            P.forEach(function (t) {
                                i.removeClass(t, $);
                            }),
                            f.off("start.internal_class end.internal_class"),
                            ($ = void 0),
                            (P = []),
                            f
                        );
                    }),
                    y(),
                    f
                );
            });
        var r = {
            defaults: { duration: 0, offset: 0, triggerElement: void 0, triggerHook: 0.5, reverse: !0, loglevel: 2 },
            validate: {
                offset: function (t) {
                    if (((t = parseFloat(t)), !i.type.Number(t))) throw 0;
                    return t;
                },
                triggerElement: function (t) {
                    if ((t = t || void 0)) {
                        var e = i.get.elements(t)[0];
                        if (!e) throw 0;
                        t = e;
                    }
                    return t;
                },
                triggerHook: function (t) {
                    var e = { onCenter: 0.5, onEnter: 1, onLeave: 0 };
                    if (i.type.Number(t)) t = Math.max(0, Math.min(parseFloat(t), 1));
                    else {
                        if (!(t in e)) throw 0;
                        t = e[t];
                    }
                    return t;
                },
                reverse: function (t) {
                    return !!t;
                },
            },
            shifts: ["duration", "offset", "triggerHook"],
        };
        (t.Scene.addOption = function (t, e, n, i) {
            t in r.defaults || ((r.defaults[t] = e), (r.validate[t] = n), i && r.shifts.push(t));
        }),
            (t.Scene.extend = function (e) {
                var n = this;
                (t.Scene = function () {
                    return n.apply(this, arguments), (this.$super = i.extend({}, this)), e.apply(this, arguments) || this;
                }),
                    i.extend(t.Scene, n),
                    (t.Scene.prototype = n.prototype),
                    (t.Scene.prototype.constructor = t.Scene);
            }),
            (t.Event = function (t, e, n, r) {
                r = r || {};
                for (var i in r) this[i] = r[i];
                return (this.type = t), (this.target = this.currentTarget = n), (this.namespace = e || ""), (this.timeStamp = this.timestamp = Date.now()), this;
            });
        var i = (t._util = (function (t) {
            var e,
                n = {},
                r = function (t) {
                    return parseFloat(t) || 0;
                },
                i = function (e) {
                    return e.currentStyle ? e.currentStyle : t.getComputedStyle(e);
                },
                o = function (e, n, o, a) {
                    if (((n = n === document ? t : n), n === t)) a = !1;
                    else if (!f.DomElement(n)) return 0;
                    e = e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
                    var s = (o ? n["offset" + e] || n["outer" + e] : n["client" + e] || n["inner" + e]) || 0;
                    if (o && a) {
                        var l = i(n);
                        s += "Height" === e ? r(l.marginTop) + r(l.marginBottom) : r(l.marginLeft) + r(l.marginRight);
                    }
                    return s;
                },
                a = function (t) {
                    return t.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function (t) {
                        return t[1].toUpperCase();
                    });
                };
            (n.extend = function (t) {
                for (t = t || {}, e = 1; e < arguments.length; e++) if (arguments[e]) for (var n in arguments[e]) arguments[e].hasOwnProperty(n) && (t[n] = arguments[e][n]);
                return t;
            }),
                (n.isMarginCollapseType = function (t) {
                    return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(t) > -1;
                });
            var s = 0,
                l = ["ms", "moz", "webkit", "o"],
                c = t.requestAnimationFrame,
                u = t.cancelAnimationFrame;
            for (e = 0; !c && e < l.length; ++e) (c = t[l[e] + "RequestAnimationFrame"]), (u = t[l[e] + "CancelAnimationFrame"] || t[l[e] + "CancelRequestAnimationFrame"]);
            c ||
                (c = function (e) {
                    var n = new Date().getTime(),
                        r = Math.max(0, 16 - (n - s)),
                        i = t.setTimeout(function () {
                            e(n + r);
                        }, r);
                    return (s = n + r), i;
                }),
                u ||
                (u = function (e) {
                    t.clearTimeout(e);
                }),
                (n.rAF = c.bind(t)),
                (n.cAF = u.bind(t));
            var f = (n.type = function (t) {
                return Object.prototype.toString
                    .call(t)
                    .replace(/^\[object (.+)\]$/, "$1")
                    .toLowerCase();
            });
            (f.String = function (t) {
                return "string" === f(t);
            }),
                (f.Function = function (t) {
                    return "function" === f(t);
                }),
                (f.Array = function (t) {
                    return Array.isArray(t);
                }),
                (f.Number = function (t) {
                    return !f.Array(t) && t - parseFloat(t) + 1 >= 0;
                }),
                (f.DomElement = function (t) {
                    return "object" == typeof HTMLElement ? t instanceof HTMLElement : t && "object" == typeof t && null !== t && 1 === t.nodeType && "string" == typeof t.nodeName;
                });
            var h = (n.get = {});
            return (
                (h.elements = function (e) {
                    var n = [];
                    if (f.String(e))
                        try {
                            e = document.querySelectorAll(e);
                        } catch (r) {
                            return n;
                        }
                    if ("nodelist" === f(e) || f.Array(e))
                        for (var i = 0, o = (n.length = e.length); o > i; i++) {
                            var a = e[i];
                            n[i] = f.DomElement(a) ? a : h.elements(a);
                        }
                    else (f.DomElement(e) || e === document || e === t) && (n = [e]);
                    return n;
                }),
                (h.scrollTop = function (e) {
                    return e && "number" == typeof e.scrollTop ? e.scrollTop : t.pageYOffset || 0;
                }),
                (h.scrollLeft = function (e) {
                    return e && "number" == typeof e.scrollLeft ? e.scrollLeft : t.pageXOffset || 0;
                }),
                (h.width = function (t, e, n) {
                    return o("width", t, e, n);
                }),
                (h.height = function (t, e, n) {
                    return o("height", t, e, n);
                }),
                (h.offset = function (t, e) {
                    var n = { top: 0, left: 0 };
                    if (t && t.getBoundingClientRect) {
                        var r = t.getBoundingClientRect();
                        (n.top = r.top), (n.left = r.left), e || ((n.top += h.scrollTop()), (n.left += h.scrollLeft()));
                    }
                    return n;
                }),
                (n.addClass = function (t, e) {
                    e && (t.classList ? t.classList.add(e) : (t.className += " " + e));
                }),
                (n.removeClass = function (t, e) {
                    e && (t.classList ? t.classList.remove(e) : (t.className = t.className.replace(RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " ")));
                }),
                (n.css = function (t, e) {
                    if (f.String(e)) return i(t)[a(e)];
                    if (f.Array(e)) {
                        var n = {},
                            r = i(t);
                        return (
                            e.forEach(function (t) {
                                n[t] = r[a(t)];
                            }),
                            n
                        );
                    }
                    for (var o in e) {
                        var s = e[o];
                        s == parseFloat(s) && (s += "px"), (t.style[a(o)] = s);
                    }
                }),
                n
            );
        })(window || {}));
        return t;
    }),
    !(function (t) {
        var e,
            n,
            r = "0.4.2",
            i = "hasOwnProperty",
            o = /[\.\/]/,
            a = /\s*,\s*/,
            s = "*",
            l = function (t, e) {
                return t - e;
            },
            c = { n: {} },
            u = function () {
                for (var t = 0, e = this.length; e > t; t++) if ("undefined" != typeof this[t]) return this[t];
            },
            f = function () {
                for (var t = this.length; --t;) if ("undefined" != typeof this[t]) return this[t];
            },
            h = function (t, r) {
                t = String(t);
                var i,
                    o = n,
                    a = Array.prototype.slice.call(arguments, 2),
                    s = h.listeners(t),
                    c = 0,
                    d = [],
                    p = {},
                    g = [],
                    m = e;
                (g.firstDefined = u), (g.lastDefined = f), (e = t), (n = 0);
                for (var v = 0, y = s.length; y > v; v++) "zIndex" in s[v] && (d.push(s[v].zIndex), s[v].zIndex < 0 && (p[s[v].zIndex] = s[v]));
                for (d.sort(l); d[c] < 0;) if (((i = p[d[c++]]), g.push(i.apply(r, a)), n)) return (n = o), g;
                for (v = 0; y > v; v++)
                    if (((i = s[v]), "zIndex" in i))
                        if (i.zIndex == d[c]) {
                            if ((g.push(i.apply(r, a)), n)) break;
                            do if ((c++, (i = p[d[c]]), i && g.push(i.apply(r, a)), n)) break;
                            while (i);
                        } else p[i.zIndex] = i;
                    else if ((g.push(i.apply(r, a)), n)) break;
                return (n = o), (e = m), g;
            };
        (h._events = c),
            (h.listeners = function (t) {
                var e,
                    n,
                    r,
                    i,
                    a,
                    l,
                    u,
                    f,
                    h = t.split(o),
                    d = c,
                    p = [d],
                    g = [];
                for (i = 0, a = h.length; a > i; i++) {
                    for (f = [], l = 0, u = p.length; u > l; l++) for (d = p[l].n, n = [d[h[i]], d[s]], r = 2; r--;) (e = n[r]), e && (f.push(e), (g = g.concat(e.f || [])));
                    p = f;
                }
                return g;
            }),
            (h.on = function (t, e) {
                if (((t = String(t)), "function" != typeof e)) return function () { };
                for (var n = t.split(a), r = 0, i = n.length; i > r; r++)
                    !(function (t) {
                        for (var n, r = t.split(o), i = c, a = 0, s = r.length; s > a; a++) (i = i.n), (i = (i.hasOwnProperty(r[a]) && i[r[a]]) || (i[r[a]] = { n: {} }));
                        for (i.f = i.f || [], a = 0, s = i.f.length; s > a; a++)
                            if (i.f[a] == e) {
                                n = !0;
                                break;
                            }
                        !n && i.f.push(e);
                    })(n[r]);
                return function (t) {
                    +t == +t && (e.zIndex = +t);
                };
            }),
            (h.f = function (t) {
                var e = [].slice.call(arguments, 1);
                return function () {
                    h.apply(null, [t, null].concat(e).concat([].slice.call(arguments, 0)));
                };
            }),
            (h.stop = function () {
                n = 1;
            }),
            (h.nt = function (t) {
                return t ? new RegExp("(?:\\.|\\/|^)" + t + "(?:\\.|\\/|$)").test(e) : e;
            }),
            (h.nts = function () {
                return e.split(o);
            }),
            (h.off = h.unbind = function (t, e) {
                if (!t) return void (h._events = c = { n: {} });
                var n = t.split(a);
                if (n.length > 1) for (var r = 0, l = n.length; l > r; r++) h.off(n[r], e);
                else {
                    n = t.split(o);
                    var u,
                        f,
                        d,
                        r,
                        l,
                        p,
                        g,
                        m = [c];
                    for (r = 0, l = n.length; l > r; r++)
                        for (p = 0; p < m.length; p += d.length - 2) {
                            if (((d = [p, 1]), (u = m[p].n), n[r] != s)) u[n[r]] && d.push(u[n[r]]);
                            else for (f in u) u[i](f) && d.push(u[f]);
                            m.splice.apply(m, d);
                        }
                    for (r = 0, l = m.length; l > r; r++)
                        for (u = m[r]; u.n;) {
                            if (e) {
                                if (u.f) {
                                    for (p = 0, g = u.f.length; g > p; p++)
                                        if (u.f[p] == e) {
                                            u.f.splice(p, 1);
                                            break;
                                        }
                                    !u.f.length && delete u.f;
                                }
                                for (f in u.n)
                                    if (u.n[i](f) && u.n[f].f) {
                                        var v = u.n[f].f;
                                        for (p = 0, g = v.length; g > p; p++)
                                            if (v[p] == e) {
                                                v.splice(p, 1);
                                                break;
                                            }
                                        !v.length && delete u.n[f].f;
                                    }
                            } else {
                                delete u.f;
                                for (f in u.n) u.n[i](f) && u.n[f].f && delete u.n[f].f;
                            }
                            u = u.n;
                        }
                }
            }),
            (h.once = function (t, e) {
                var n = function () {
                    return h.unbind(t, n), e.apply(this, arguments);
                };
                return h.on(t, n);
            }),
            (h.version = r),
            (h.toString = function () {
                return "You are running Eve " + r;
            }),
            "undefined" != typeof module && module.exports
                ? (module.exports = h)
                : "function" == typeof define && define.amd
                    ? define("eve", [], function () {
                        return h;
                    })
                    : (t.eve = h);
    })(this),
    (function (t, e) {
        if ("function" == typeof define && define.amd)
            define(["eve"], function (n) {
                return e(t, n);
            });
        else if ("undefined" != typeof exports) {
            var n = require("eve");
            module.exports = e(t, n);
        } else e(t, t.eve);
    })(window || this, function (t, e) {
        var n = (function (e) {
            var n = {},
                r =
                    t.requestAnimationFrame ||
                    t.webkitRequestAnimationFrame ||
                    t.mozRequestAnimationFrame ||
                    t.oRequestAnimationFrame ||
                    t.msRequestAnimationFrame ||
                    function (t) {
                        setTimeout(t, 16);
                    },
                i =
                    Array.isArray ||
                    function (t) {
                        return t instanceof Array || "[object Array]" == Object.prototype.toString.call(t);
                    },
                o = 0,
                a = "M" + (+new Date()).toString(36),
                s = function () {
                    return a + (o++).toString(36);
                },
                l =
                    Date.now ||
                    function () {
                        return +new Date();
                    },
                c = function (t) {
                    var e = this;
                    if (null == t) return e.s;
                    var n = e.s - t;
                    (e.b += e.dur * n), (e.B += e.dur * n), (e.s = t);
                },
                u = function (t) {
                    var e = this;
                    return null == t ? e.spd : void (e.spd = t);
                },
                f = function (t) {
                    var e = this;
                    return null == t ? e.dur : ((e.s = (e.s * t) / e.dur), void (e.dur = t));
                },
                h = function () {
                    var t = this;
                    delete n[t.id], t.update(), e("mina.stop." + t.id, t);
                },
                d = function () {
                    var t = this;
                    t.pdif || (delete n[t.id], t.update(), (t.pdif = t.get() - t.b));
                },
                p = function () {
                    var t = this;
                    t.pdif && ((t.b = t.get() - t.pdif), delete t.pdif, (n[t.id] = t));
                },
                g = function () {
                    var t,
                        e = this;
                    if (i(e.start)) {
                        t = [];
                        for (var n = 0, r = e.start.length; r > n; n++) t[n] = +e.start[n] + (e.end[n] - e.start[n]) * e.easing(e.s);
                    } else t = +e.start + (e.end - e.start) * e.easing(e.s);
                    e.set(t);
                },
                m = function () {
                    var t = 0;
                    for (var i in n)
                        if (n.hasOwnProperty(i)) {
                            var o = n[i],
                                a = o.get();
                            t++,
                                (o.s = (a - o.b) / (o.dur / o.spd)),
                                o.s >= 1 &&
                                (delete n[i],
                                    (o.s = 1),
                                    t--,
                                    (function (t) {
                                        setTimeout(function () {
                                            e("mina.finish." + t.id, t);
                                        });
                                    })(o)),
                                o.update();
                        }
                    t && r(m);
                },
                v = function (t, e, i, o, a, l, y) {
                    var x = { id: s(), start: t, end: e, b: i, s: 0, dur: o - i, spd: 1, get: a, set: l, easing: y || v.linear, status: c, speed: u, duration: f, stop: h, pause: d, resume: p, update: g };
                    n[x.id] = x;
                    var b,
                        w = 0;
                    for (b in n) if (n.hasOwnProperty(b) && (w++, 2 == w)) break;
                    return 1 == w && r(m), x;
                };
            return (
                (v.time = l),
                (v.getById = function (t) {
                    return n[t] || null;
                }),
                (v.linear = function (t) {
                    return t;
                }),
                (v.easeout = function (t) {
                    return Math.pow(t, 1.7);
                }),
                (v.easein = function (t) {
                    return Math.pow(t, 0.48);
                }),
                (v.easeinout = function (t) {
                    if (1 == t) return 1;
                    if (0 == t) return 0;
                    var e = 0.48 - t / 1.04,
                        n = Math.sqrt(0.1734 + e * e),
                        r = n - e,
                        i = Math.pow(Math.abs(r), 1 / 3) * (0 > r ? -1 : 1),
                        o = -n - e,
                        a = Math.pow(Math.abs(o), 1 / 3) * (0 > o ? -1 : 1),
                        s = i + a + 0.5;
                    return 3 * (1 - s) * s * s + s * s * s;
                }),
                (v.backin = function (t) {
                    if (1 == t) return 1;
                    var e = 1.70158;
                    return t * t * ((e + 1) * t - e);
                }),
                (v.backout = function (t) {
                    if (0 == t) return 0;
                    t -= 1;
                    var e = 1.70158;
                    return t * t * ((e + 1) * t + e) + 1;
                }),
                (v.elastic = function (t) {
                    return t == !!t ? t : Math.pow(2, -10 * t) * Math.sin((2 * (t - 0.075) * Math.PI) / 0.3) + 1;
                }),
                (v.bounce = function (t) {
                    var e,
                        n = 7.5625,
                        r = 2.75;
                    return 1 / r > t ? (e = n * t * t) : 2 / r > t ? ((t -= 1.5 / r), (e = n * t * t + 0.75)) : 2.5 / r > t ? ((t -= 2.25 / r), (e = n * t * t + 0.9375)) : ((t -= 2.625 / r), (e = n * t * t + 0.984375)), e;
                }),
                (t.mina = v),
                v
            );
        })("undefined" == typeof e ? function () { } : e),
            r = (function (t) {
                function n(t, e) {
                    if (t) {
                        if (t.nodeType) return C(t);
                        if (i(t, "array") && n.set) return n.set.apply(n, t);
                        if (t instanceof y) return t;
                        if (null == e) return (t = k.doc.querySelector(String(t))), C(t);
                    }
                    return (t = null == t ? "100%" : t), (e = null == e ? "100%" : e), new w(t, e);
                }
                function r(t, e) {
                    if (e) {
                        if (("#text" == t && (t = k.doc.createTextNode(e.text || e["#text"] || "")), "#comment" == t && (t = k.doc.createComment(e.text || e["#text"] || "")), "string" == typeof t && (t = r(t)), "string" == typeof e))
                            return 1 == t.nodeType
                                ? "xlink:" == e.substring(0, 6)
                                    ? t.getAttributeNS(G, e.substring(6))
                                    : "xml:" == e.substring(0, 4)
                                        ? t.getAttributeNS(H, e.substring(4))
                                        : t.getAttribute(e)
                                : "text" == e
                                    ? t.nodeValue
                                    : null;
                        if (1 == t.nodeType) {
                            for (var n in e)
                                if (e[E](n)) {
                                    var i = T(e[n]);
                                    i ? ("xlink:" == n.substring(0, 6) ? t.setAttributeNS(G, n.substring(6), i) : "xml:" == n.substring(0, 4) ? t.setAttributeNS(H, n.substring(4), i) : t.setAttribute(n, i)) : t.removeAttribute(n);
                                }
                        } else "text" in e && (t.nodeValue = e.text);
                    } else t = k.doc.createElementNS(H, t);
                    return t;
                }
                function i(t, e) {
                    return (
                        (e = T.prototype.toLowerCase.call(e)),
                        "finite" == e
                            ? isFinite(t)
                            : !("array" != e || !(t instanceof Array || (Array.isArray && Array.isArray(t)))) ||
                            ("null" == e && null === t) ||
                            (e == typeof t && null !== t) ||
                            ("object" == e && t === Object(t)) ||
                            $.call(t).slice(8, -1).toLowerCase() == e
                    );
                }
                function o(t) {
                    if ("function" == typeof t || Object(t) !== t) return t;
                    var e = new t.constructor();
                    for (var n in t) t[E](n) && (e[n] = o(t[n]));
                    return e;
                }
                function a(t, e) {
                    for (var n = 0, r = t.length; r > n; n++) if (t[n] === e) return t.push(t.splice(n, 1)[0]);
                }
                function s(t, e, n) {
                    function r() {
                        var i = Array.prototype.slice.call(arguments, 0),
                            o = i.join("â€"),
                            s = (r.cache = r.cache || {}),
                            l = (r.count = r.count || []);
                        return s[E](o) ? (a(l, o), n ? n(s[o]) : s[o]) : (l.length >= 1e3 && delete s[l.shift()], l.push(o), (s[o] = t.apply(e, i)), n ? n(s[o]) : s[o]);
                    }
                    return r;
                }
                function l(t, e, n, r, i, o) {
                    if (null == i) {
                        var a = t - n,
                            s = e - r;
                        return a || s ? (180 + (180 * M.atan2(-s, -a)) / N + 360) % 360 : 0;
                    }
                    return l(t, e, i, o) - l(n, r, i, o);
                }
                function c(t) {
                    return ((t % 360) * N) / 180;
                }
                function u(t) {
                    return ((180 * t) / N) % 360;
                }
                function f(t) {
                    var e = [];
                    return (
                        (t = t.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (t, n, r) {
                            return (
                                (r = r.split(/\s*,\s*|\s+/)),
                                "rotate" == n && 1 == r.length && r.push(0, 0),
                                "scale" == n && (r.length > 2 ? (r = r.slice(0, 2)) : 2 == r.length && r.push(0, 0), 1 == r.length && r.push(r[0], 0, 0)),
                                e.push("skewX" == n ? ["m", 1, 0, M.tan(c(r[0])), 1, 0, 0] : "skewY" == n ? ["m", 1, M.tan(c(r[0])), 0, 1, 0, 0] : [n.charAt(0)].concat(r)),
                                t
                            );
                        })),
                        e
                    );
                }
                function h(t, e) {
                    var r = tt(t),
                        i = new n.Matrix();
                    if (r)
                        for (var o = 0, a = r.length; a > o; o++) {
                            var s,
                                l,
                                c,
                                u,
                                f,
                                h = r[o],
                                d = h.length,
                                p = T(h[0]).toLowerCase(),
                                g = h[0] != p,
                                m = g ? i.invert() : 0;
                            "t" == p && 2 == d
                                ? i.translate(h[1], 0)
                                : "t" == p && 3 == d
                                    ? g
                                        ? ((s = m.x(0, 0)), (l = m.y(0, 0)), (c = m.x(h[1], h[2])), (u = m.y(h[1], h[2])), i.translate(c - s, u - l))
                                        : i.translate(h[1], h[2])
                                    : "r" == p
                                        ? 2 == d
                                            ? ((f = f || e), i.rotate(h[1], f.x + f.width / 2, f.y + f.height / 2))
                                            : 4 == d && (g ? ((c = m.x(h[2], h[3])), (u = m.y(h[2], h[3])), i.rotate(h[1], c, u)) : i.rotate(h[1], h[2], h[3]))
                                        : "s" == p
                                            ? 2 == d || 3 == d
                                                ? ((f = f || e), i.scale(h[1], h[d - 1], f.x + f.width / 2, f.y + f.height / 2))
                                                : 4 == d
                                                    ? g
                                                        ? ((c = m.x(h[2], h[3])), (u = m.y(h[2], h[3])), i.scale(h[1], h[1], c, u))
                                                        : i.scale(h[1], h[1], h[2], h[3])
                                                    : 5 == d && (g ? ((c = m.x(h[3], h[4])), (u = m.y(h[3], h[4])), i.scale(h[1], h[2], c, u)) : i.scale(h[1], h[2], h[3], h[4]))
                                            : "m" == p && 7 == d && i.add(h[1], h[2], h[3], h[4], h[5], h[6]);
                        }
                    return i;
                }
                function d(t) {
                    var e = (t.node.ownerSVGElement && C(t.node.ownerSVGElement)) || (t.node.parentNode && C(t.node.parentNode)) || n.select("svg") || n(0, 0),
                        r = e.select("defs"),
                        i = null != r && r.node;
                    return i || (i = b("defs", e.node).node), i;
                }
                function p(t) {
                    return (t.node.ownerSVGElement && C(t.node.ownerSVGElement)) || n.select("svg");
                }
                function m(t, e, n) {
                    function i(t) {
                        if (null == t) return L;
                        if (t == +t) return t;
                        r(c, { width: t });
                        try {
                            return c.getBBox().width;
                        } catch (e) {
                            return 0;
                        }
                    }
                    function o(t) {
                        if (null == t) return L;
                        if (t == +t) return t;
                        r(c, { height: t });
                        try {
                            return c.getBBox().height;
                        } catch (e) {
                            return 0;
                        }
                    }
                    function a(r, i) {
                        null == e ? (l[r] = i(t.attr(r) || 0)) : r == e && (l = i(null == n ? t.attr(r) || 0 : n));
                    }
                    var s = p(t).node,
                        l = {},
                        c = s.querySelector(".svg---mgr");
                    switch ((c || ((c = r("rect")), r(c, { x: -9e9, y: -9e9, width: 10, height: 10, class: "svg---mgr", fill: "none" }), s.appendChild(c)), t.type)) {
                        case "rect":
                            a("rx", i), a("ry", o);
                        case "image":
                            a("width", i), a("height", o);
                        case "text":
                            a("x", i), a("y", o);
                            break;
                        case "circle":
                            a("cx", i), a("cy", o), a("r", i);
                            break;
                        case "ellipse":
                            a("cx", i), a("cy", o), a("rx", i), a("ry", o);
                            break;
                        case "line":
                            a("x1", i), a("x2", i), a("y1", o), a("y2", o);
                            break;
                        case "marker":
                            a("refX", i), a("markerWidth", i), a("refY", o), a("markerHeight", o);
                            break;
                        case "radialGradient":
                            a("fx", i), a("fy", o);
                            break;
                        case "tspan":
                            a("dx", i), a("dy", o);
                            break;
                        default:
                            a(e, i);
                    }
                    return s.removeChild(c), l;
                }
                function v(t) {
                    i(t, "array") || (t = Array.prototype.slice.call(arguments, 0));
                    for (var e = 0, n = 0, r = this.node; this[e];) delete this[e++];
                    for (e = 0; e < t.length; e++)
                        "set" == t[e].type
                            ? t[e].forEach(function (t) {
                                r.appendChild(t.node);
                            })
                            : r.appendChild(t[e].node);
                    var o = r.childNodes;
                    for (e = 0; e < o.length; e++) this[n++] = C(o[e]);
                    return this;
                }
                function y(t) {
                    if (t.snap in X) return X[t.snap];
                    var e;
                    try {
                        e = t.ownerSVGElement;
                    } catch (n) { }
                    (this.node = t), e && (this.paper = new w(e)), (this.type = t.tagName || t.nodeName);
                    var r = (this.id = U(this));
                    if (((this.anims = {}), (this._ = { transform: [] }), (t.snap = r), (X[r] = this), "g" == this.type && (this.add = v), this.type in { g: 1, mask: 1, pattern: 1, symbol: 1 }))
                        for (var i in w.prototype) w.prototype[E](i) && (this[i] = w.prototype[i]);
                }
                function x(t) {
                    this.node = t;
                }
                function b(t, e) {
                    var n = r(t);
                    e.appendChild(n);
                    var i = C(n);
                    return i;
                }
                function w(t, e) {
                    var n,
                        i,
                        o,
                        a = w.prototype;
                    if (t && "svg" == t.tagName) {
                        if (t.snap in X) return X[t.snap];
                        var s = t.ownerDocument;
                        (n = new y(t)),
                            (i = t.getElementsByTagName("desc")[0]),
                            (o = t.getElementsByTagName("defs")[0]),
                            i || ((i = r("desc")), i.appendChild(s.createTextNode("Created with Snap")), n.node.appendChild(i)),
                            o || ((o = r("defs")), n.node.appendChild(o)),
                            (n.defs = o);
                        for (var l in a) a[E](l) && (n[l] = a[l]);
                        n.paper = n.root = n;
                    } else (n = b("svg", k.doc.body)), r(n.node, { height: e, version: 1.1, width: t, xmlns: H });
                    return n;
                }
                function C(t) {
                    return t
                        ? t instanceof y || t instanceof x
                            ? t
                            : t.tagName && "svg" == t.tagName.toLowerCase()
                                ? new w(t)
                                : t.tagName && "object" == t.tagName.toLowerCase() && "image/svg+xml" == t.type
                                    ? new w(t.contentDocument.getElementsByTagName("svg")[0])
                                    : new y(t)
                        : t;
                }
                function S(t, e) {
                    for (var n = 0, r = t.length; r > n; n++) {
                        var i = { type: t[n].type, attr: t[n].attr() },
                            o = t[n].children();
                        e.push(i), o.length && S(o, (i.childNodes = []));
                    }
                }
                (n.version = "0.4.0"),
                    (n.toString = function () {
                        return "Snap v" + this.version;
                    }),
                    (n._ = {});
                var k = { win: t.window, doc: t.window.document };
                n._.glob = k;
                var E = "hasOwnProperty",
                    T = String,
                    _ = parseFloat,
                    j = parseInt,
                    M = Math,
                    B = M.max,
                    A = M.min,
                    F = M.abs,
                    N = (M.pow, M.PI),
                    L = (M.round, ""),
                    $ = Object.prototype.toString,
                    P = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
                    I = ((n._.separator = /[,\s]+/), /[\s]*,[\s]*/),
                    z = { hs: 1, rg: 1 },
                    O = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
                    q = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
                    D = /(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/gi,
                    R = 0,
                    V = "S" + (+new Date()).toString(36),
                    U = function (t) {
                        return (t && t.type ? t.type : L) + V + (R++).toString(36);
                    },
                    G = "http://www.w3.org/1999/xlink",
                    H = "http://www.w3.org/2000/svg",
                    X = {};
                (n.url = function (t) {
                    return "url('#" + t + "')";
                }),
                    (n._.$ = r),
                    (n._.id = U),
                    (n.format = (function () {
                        var t = /\{([^\}]+)\}/g,
                            e = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
                            n = function (t, n, r) {
                                var i = r;
                                return (
                                    n.replace(e, function (t, e, n, r, o) {
                                        (e = e || r), i && (e in i && (i = i[e]), "function" == typeof i && o && (i = i()));
                                    }),
                                    (i = (null == i || i == r ? t : i) + "")
                                );
                            };
                        return function (e, r) {
                            return T(e).replace(t, function (t, e) {
                                return n(t, e, r);
                            });
                        };
                    })()),
                    (n._.clone = o),
                    (n._.cacher = s),
                    (n.rad = c),
                    (n.deg = u),
                    (n.sin = function (t) {
                        return M.sin(n.rad(t));
                    }),
                    (n.tan = function (t) {
                        return M.tan(n.rad(t));
                    }),
                    (n.cos = function (t) {
                        return M.cos(n.rad(t));
                    }),
                    (n.asin = function (t) {
                        return n.deg(M.asin(t));
                    }),
                    (n.acos = function (t) {
                        return n.deg(M.acos(t));
                    }),
                    (n.atan = function (t) {
                        return n.deg(M.atan(t));
                    }),
                    (n.atan2 = function (t) {
                        return n.deg(M.atan2(t));
                    }),
                    (n.angle = l),
                    (n.len = function (t, e, r, i) {
                        return Math.sqrt(n.len2(t, e, r, i));
                    }),
                    (n.len2 = function (t, e, n, r) {
                        return (t - n) * (t - n) + (e - r) * (e - r);
                    }),
                    (n.closestPoint = function (t, e, n) {
                        function r(t) {
                            var r = t.x - e,
                                i = t.y - n;
                            return r * r + i * i;
                        }
                        for (var i, o, a, s, l = t.node, c = l.getTotalLength(), u = (c / l.pathSegList.numberOfItems) * 0.125, f = 1 / 0, h = 0; c >= h; h += u) (s = r((a = l.getPointAtLength(h)))) < f && ((i = a), (o = h), (f = s));
                        for (u *= 0.5; u > 0.5;) {
                            var d, p, g, m, v, y;
                            (g = o - u) >= 0 && (v = r((d = l.getPointAtLength(g)))) < f ? ((i = d), (o = g), (f = v)) : (m = o + u) <= c && (y = r((p = l.getPointAtLength(m)))) < f ? ((i = p), (o = m), (f = y)) : (u *= 0.5);
                        }
                        return (i = { x: i.x, y: i.y, length: o, distance: Math.sqrt(f) });
                    }),
                    (n.is = i),
                    (n.snapTo = function (t, e, n) {
                        if (((n = i(n, "finite") ? n : 10), i(t, "array"))) {
                            for (var r = t.length; r--;) if (F(t[r] - e) <= n) return t[r];
                        } else {
                            t = +t;
                            var o = e % t;
                            if (n > o) return e - o;
                            if (o > t - n) return e - o + t;
                        }
                        return e;
                    }),
                    (n.getRGB = s(function (t) {
                        if (!t || (t = T(t)).indexOf("-") + 1) return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: Z };
                        if ("none" == t) return { r: -1, g: -1, b: -1, hex: "none", toString: Z };
                        if ((!(z[E](t.toLowerCase().substring(0, 2)) || "#" == t.charAt()) && (t = W(t)), !t)) return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: Z };
                        var e,
                            r,
                            o,
                            a,
                            s,
                            l,
                            c = t.match(P);
                        return c
                            ? (c[2] && ((o = j(c[2].substring(5), 16)), (r = j(c[2].substring(3, 5), 16)), (e = j(c[2].substring(1, 3), 16))),
                                c[3] && ((o = j((s = c[3].charAt(3)) + s, 16)), (r = j((s = c[3].charAt(2)) + s, 16)), (e = j((s = c[3].charAt(1)) + s, 16))),
                                c[4] &&
                                ((l = c[4].split(I)),
                                    (e = _(l[0])),
                                    "%" == l[0].slice(-1) && (e *= 2.55),
                                    (r = _(l[1])),
                                    "%" == l[1].slice(-1) && (r *= 2.55),
                                    (o = _(l[2])),
                                    "%" == l[2].slice(-1) && (o *= 2.55),
                                    "rgba" == c[1].toLowerCase().slice(0, 4) && (a = _(l[3])),
                                    l[3] && "%" == l[3].slice(-1) && (a /= 100)),
                                c[5]
                                    ? ((l = c[5].split(I)),
                                        (e = _(l[0])),
                                        "%" == l[0].slice(-1) && (e /= 100),
                                        (r = _(l[1])),
                                        "%" == l[1].slice(-1) && (r /= 100),
                                        (o = _(l[2])),
                                        "%" == l[2].slice(-1) && (o /= 100),
                                        ("deg" == l[0].slice(-3) || "Â°" == l[0].slice(-1)) && (e /= 360),
                                        "hsba" == c[1].toLowerCase().slice(0, 4) && (a = _(l[3])),
                                        l[3] && "%" == l[3].slice(-1) && (a /= 100),
                                        n.hsb2rgb(e, r, o, a))
                                    : c[6]
                                        ? ((l = c[6].split(I)),
                                            (e = _(l[0])),
                                            "%" == l[0].slice(-1) && (e /= 100),
                                            (r = _(l[1])),
                                            "%" == l[1].slice(-1) && (r /= 100),
                                            (o = _(l[2])),
                                            "%" == l[2].slice(-1) && (o /= 100),
                                            ("deg" == l[0].slice(-3) || "Â°" == l[0].slice(-1)) && (e /= 360),
                                            "hsla" == c[1].toLowerCase().slice(0, 4) && (a = _(l[3])),
                                            l[3] && "%" == l[3].slice(-1) && (a /= 100),
                                            n.hsl2rgb(e, r, o, a))
                                        : ((e = A(M.round(e), 255)),
                                            (r = A(M.round(r), 255)),
                                            (o = A(M.round(o), 255)),
                                            (a = A(B(a, 0), 1)),
                                            (c = { r: e, g: r, b: o, toString: Z }),
                                            (c.hex = "#" + (16777216 | o | (r << 8) | (e << 16)).toString(16).slice(1)),
                                            (c.opacity = i(a, "finite") ? a : 1),
                                            c))
                            : { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: Z };
                    }, n)),
                    (n.hsb = s(function (t, e, r) {
                        return n.hsb2rgb(t, e, r).hex;
                    })),
                    (n.hsl = s(function (t, e, r) {
                        return n.hsl2rgb(t, e, r).hex;
                    })),
                    (n.rgb = s(function (t, e, n, r) {
                        if (i(r, "finite")) {
                            var o = M.round;
                            return "rgba(" + [o(t), o(e), o(n), +r.toFixed(2)] + ")";
                        }
                        return "#" + (16777216 | n | (e << 8) | (t << 16)).toString(16).slice(1);
                    }));
                var W = function (t) {
                    var e = k.doc.getElementsByTagName("head")[0] || k.doc.getElementsByTagName("svg")[0],
                        n = "rgb(255, 0, 0)";
                    return (W = s(function (t) {
                        if ("red" == t.toLowerCase()) return n;
                        (e.style.color = n), (e.style.color = t);
                        var r = k.doc.defaultView.getComputedStyle(e, L).getPropertyValue("color");
                        return r == n ? null : r;
                    }))(t);
                },
                    Y = function () {
                        return "hsb(" + [this.h, this.s, this.b] + ")";
                    },
                    Q = function () {
                        return "hsl(" + [this.h, this.s, this.l] + ")";
                    },
                    Z = function () {
                        return 1 == this.opacity || null == this.opacity ? this.hex : "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
                    },
                    J = function (t, e, r) {
                        if ((null == e && i(t, "object") && "r" in t && "g" in t && "b" in t && ((r = t.b), (e = t.g), (t = t.r)), null == e && i(t, string))) {
                            var o = n.getRGB(t);
                            (t = o.r), (e = o.g), (r = o.b);
                        }
                        return (t > 1 || e > 1 || r > 1) && ((t /= 255), (e /= 255), (r /= 255)), [t, e, r];
                    },
                    K = function (t, e, r, o) {
                        (t = M.round(255 * t)), (e = M.round(255 * e)), (r = M.round(255 * r));
                        var a = { r: t, g: e, b: r, opacity: i(o, "finite") ? o : 1, hex: n.rgb(t, e, r), toString: Z };
                        return i(o, "finite") && (a.opacity = o), a;
                    };
                (n.color = function (t) {
                    var e;
                    return (
                        i(t, "object") && "h" in t && "s" in t && "b" in t
                            ? ((e = n.hsb2rgb(t)), (t.r = e.r), (t.g = e.g), (t.b = e.b), (t.opacity = 1), (t.hex = e.hex))
                            : i(t, "object") && "h" in t && "s" in t && "l" in t
                                ? ((e = n.hsl2rgb(t)), (t.r = e.r), (t.g = e.g), (t.b = e.b), (t.opacity = 1), (t.hex = e.hex))
                                : (i(t, "string") && (t = n.getRGB(t)),
                                    i(t, "object") && "r" in t && "g" in t && "b" in t && !("error" in t)
                                        ? ((e = n.rgb2hsl(t)), (t.h = e.h), (t.s = e.s), (t.l = e.l), (e = n.rgb2hsb(t)), (t.v = e.b))
                                        : ((t = { hex: "none" }), (t.r = t.g = t.b = t.h = t.s = t.v = t.l = -1), (t.error = 1))),
                        (t.toString = Z),
                        t
                    );
                }),
                    (n.hsb2rgb = function (t, e, n, r) {
                        i(t, "object") && "h" in t && "s" in t && "b" in t && ((n = t.b), (e = t.s), (r = t.o), (t = t.h)), (t *= 360);
                        var o, a, s, l, c;
                        return (t = (t % 360) / 60), (c = n * e), (l = c * (1 - F((t % 2) - 1))), (o = a = s = n - c), (t = ~~t), (o += [c, l, 0, 0, l, c][t]), (a += [l, c, c, l, 0, 0][t]), (s += [0, 0, l, c, c, l][t]), K(o, a, s, r);
                    }),
                    (n.hsl2rgb = function (t, e, n, r) {
                        i(t, "object") && "h" in t && "s" in t && "l" in t && ((n = t.l), (e = t.s), (t = t.h)), (t > 1 || e > 1 || n > 1) && ((t /= 360), (e /= 100), (n /= 100)), (t *= 360);
                        var o, a, s, l, c;
                        return (
                            (t = (t % 360) / 60),
                            (c = 2 * e * (0.5 > n ? n : 1 - n)),
                            (l = c * (1 - F((t % 2) - 1))),
                            (o = a = s = n - c / 2),
                            (t = ~~t),
                            (o += [c, l, 0, 0, l, c][t]),
                            (a += [l, c, c, l, 0, 0][t]),
                            (s += [0, 0, l, c, c, l][t]),
                            K(o, a, s, r)
                        );
                    }),
                    (n.rgb2hsb = function (t, e, n) {
                        (n = J(t, e, n)), (t = n[0]), (e = n[1]), (n = n[2]);
                        var r, i, o, a;
                        return (
                            (o = B(t, e, n)),
                            (a = o - A(t, e, n)),
                            (r = 0 == a ? null : o == t ? (e - n) / a : o == e ? (n - t) / a + 2 : (t - e) / a + 4),
                            (r = (((r + 360) % 6) * 60) / 360),
                            (i = 0 == a ? 0 : a / o),
                            { h: r, s: i, b: o, toString: Y }
                        );
                    }),
                    (n.rgb2hsl = function (t, e, n) {
                        (n = J(t, e, n)), (t = n[0]), (e = n[1]), (n = n[2]);
                        var r, i, o, a, s, l;
                        return (
                            (a = B(t, e, n)),
                            (s = A(t, e, n)),
                            (l = a - s),
                            (r = 0 == l ? null : a == t ? (e - n) / l : a == e ? (n - t) / l + 2 : (t - e) / l + 4),
                            (r = (((r + 360) % 6) * 60) / 360),
                            (o = (a + s) / 2),
                            (i = 0 == l ? 0 : 0.5 > o ? l / (2 * o) : l / (2 - 2 * o)),
                            { h: r, s: i, l: o, toString: Q }
                        );
                    }),
                    (n.parsePathString = function (t) {
                        if (!t) return null;
                        var e = n.path(t);
                        if (e.arr) return n.path.clone(e.arr);
                        var r = { a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0 },
                            o = [];
                        return (
                            i(t, "array") && i(t[0], "array") && (o = n.path.clone(t)),
                            o.length ||
                            T(t).replace(O, function (t, e, n) {
                                var i = [],
                                    a = e.toLowerCase();
                                if (
                                    (n.replace(D, function (t, e) {
                                        e && i.push(+e);
                                    }),
                                        "m" == a && i.length > 2 && (o.push([e].concat(i.splice(0, 2))), (a = "l"), (e = "m" == e ? "l" : "L")),
                                        "o" == a && 1 == i.length && o.push([e, i[0]]),
                                        "r" == a)
                                )
                                    o.push([e].concat(i));
                                else for (; i.length >= r[a] && (o.push([e].concat(i.splice(0, r[a]))), r[a]););
                            }),
                            (o.toString = n.path.toString),
                            (e.arr = n.path.clone(o)),
                            o
                        );
                    });
                var tt = (n.parseTransformString = function (t) {
                    if (!t) return null;
                    var e = [];
                    return (
                        i(t, "array") && i(t[0], "array") && (e = n.path.clone(t)),
                        e.length ||
                        T(t).replace(q, function (t, n, r) {
                            var i = [];
                            n.toLowerCase(),
                                r.replace(D, function (t, e) {
                                    e && i.push(+e);
                                }),
                                e.push([n].concat(i));
                        }),
                        (e.toString = n.path.toString),
                        e
                    );
                });
                (n._.svgTransform2string = f),
                    (n._.rgTransform = /^[a-z][\s]*-?\.?\d/i),
                    (n._.transform2matrix = h),
                    (n._unit2px = m),
                    k.doc.contains || k.doc.compareDocumentPosition
                        ? function (t, e) {
                            var n = 9 == t.nodeType ? t.documentElement : t,
                                r = e && e.parentNode;
                            return t == r || !(!r || 1 != r.nodeType || !(n.contains ? n.contains(r) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(r)));
                        }
                        : function (t, e) {
                            if (e) for (; e;) if (((e = e.parentNode), e == t)) return !0;
                            return !1;
                        },
                    (n._.getSomeDefs = d),
                    (n._.getSomeSVG = p),
                    (n.select = function (t) {
                        return (t = T(t).replace(/([^\\]):/g, "$1\\:")), C(k.doc.querySelector(t));
                    }),
                    (n.selectAll = function (t) {
                        for (var e = k.doc.querySelectorAll(t), r = (n.set || Array)(), i = 0; i < e.length; i++) r.push(C(e[i]));
                        return r;
                    }),
                    setInterval(function () {
                        for (var t in X)
                            if (X[E](t)) {
                                var e = X[t],
                                    n = e.node;
                                (("svg" != e.type && !n.ownerSVGElement) || ("svg" == e.type && (!n.parentNode || ("ownerSVGElement" in n.parentNode && !n.ownerSVGElement)))) && delete X[t];
                            }
                    }, 1e4),
                    (y.prototype.attr = function (t, n) {
                        var r = this,
                            o = r.node;
                        if (!t) {
                            if (1 != o.nodeType) return { text: o.nodeValue };
                            for (var a = o.attributes, s = {}, l = 0, c = a.length; c > l; l++) s[a[l].nodeName] = a[l].nodeValue;
                            return s;
                        }
                        if (i(t, "string")) {
                            if (!(arguments.length > 1)) return e("snap.util.getattr." + t, r).firstDefined();
                            var u = {};
                            (u[t] = n), (t = u);
                        }
                        for (var f in t) t[E](f) && e("snap.util.attr." + f, r, t[f]);
                        return r;
                    }),
                    (n.parse = function (t) {
                        var e = k.doc.createDocumentFragment(),
                            n = !0,
                            r = k.doc.createElement("div");
                        if (((t = T(t)), t.match(/^\s*<\s*svg(?:\s|>)/) || ((t = "<svg>" + t + "</svg>"), (n = !1)), (r.innerHTML = t), (t = r.getElementsByTagName("svg")[0])))
                            if (n) e = t;
                            else for (; t.firstChild;) e.appendChild(t.firstChild);
                        return new x(e);
                    }),
                    (n.fragment = function () {
                        for (var t = Array.prototype.slice.call(arguments, 0), e = k.doc.createDocumentFragment(), r = 0, i = t.length; i > r; r++) {
                            var o = t[r];
                            o.node && o.node.nodeType && e.appendChild(o.node), o.nodeType && e.appendChild(o), "string" == typeof o && e.appendChild(n.parse(o).node);
                        }
                        return new x(e);
                    }),
                    (n._.make = b),
                    (n._.wrap = C),
                    (w.prototype.el = function (t, e) {
                        var n = b(t, this.node);
                        return e && n.attr(e), n;
                    }),
                    (y.prototype.children = function () {
                        for (var t = [], e = this.node.childNodes, r = 0, i = e.length; i > r; r++) t[r] = n(e[r]);
                        return t;
                    }),
                    (y.prototype.toJSON = function () {
                        var t = [];
                        return S([this], t), t[0];
                    }),
                    e.on("snap.util.getattr", function () {
                        var t = e.nt();
                        t = t.substring(t.lastIndexOf(".") + 1);
                        var n = t.replace(/[A-Z]/g, function (t) {
                            return "-" + t.toLowerCase();
                        });
                        return et[E](n) ? this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(n) : r(this.node, t);
                    });
                var et = {
                    "alignment-baseline": 0,
                    "baseline-shift": 0,
                    clip: 0,
                    "clip-path": 0,
                    "clip-rule": 0,
                    color: 0,
                    "color-interpolation": 0,
                    "color-interpolation-filters": 0,
                    "color-profile": 0,
                    "color-rendering": 0,
                    cursor: 0,
                    direction: 0,
                    display: 0,
                    "dominant-baseline": 0,
                    "enable-background": 0,
                    fill: 0,
                    "fill-opacity": 0,
                    "fill-rule": 0,
                    filter: 0,
                    "flood-color": 0,
                    "flood-opacity": 0,
                    font: 0,
                    "font-family": 0,
                    "font-size": 0,
                    "font-size-adjust": 0,
                    "font-stretch": 0,
                    "font-style": 0,
                    "font-variant": 0,
                    "font-weight": 0,
                    "glyph-orientation-horizontal": 0,
                    "glyph-orientation-vertical": 0,
                    "image-rendering": 0,
                    kerning: 0,
                    "letter-spacing": 0,
                    "lighting-color": 0,
                    marker: 0,
                    "marker-end": 0,
                    "marker-mid": 0,
                    "marker-start": 0,
                    mask: 0,
                    opacity: 0,
                    overflow: 0,
                    "pointer-events": 0,
                    "shape-rendering": 0,
                    "stop-color": 0,
                    "stop-opacity": 0,
                    stroke: 0,
                    "stroke-dasharray": 0,
                    "stroke-dashoffset": 0,
                    "stroke-linecap": 0,
                    "stroke-linejoin": 0,
                    "stroke-miterlimit": 0,
                    "stroke-opacity": 0,
                    "stroke-width": 0,
                    "text-anchor": 0,
                    "text-decoration": 0,
                    "text-rendering": 0,
                    "unicode-bidi": 0,
                    visibility: 0,
                    "word-spacing": 0,
                    "writing-mode": 0,
                };
                e.on("snap.util.attr", function (t) {
                    var n = e.nt(),
                        i = {};
                    (n = n.substring(n.lastIndexOf(".") + 1)), (i[n] = t);
                    var o = n.replace(/-(\w)/gi, function (t, e) {
                        return e.toUpperCase();
                    }),
                        a = n.replace(/[A-Z]/g, function (t) {
                            return "-" + t.toLowerCase();
                        });
                    et[E](a) ? (this.node.style[o] = null == t ? L : t) : r(this.node, i);
                }),
                    (function () { })(w.prototype),
                    (n.ajax = function (t, n, r, o) {
                        var a = new XMLHttpRequest(),
                            s = U();
                        if (a) {
                            if (i(n, "function")) (o = r), (r = n), (n = null);
                            else if (i(n, "object")) {
                                var l = [];
                                for (var c in n) n.hasOwnProperty(c) && l.push(encodeURIComponent(c) + "=" + encodeURIComponent(n[c]));
                                n = l.join("&");
                            }
                            return (
                                a.open(n ? "POST" : "GET", t, !0),
                                n && (a.setRequestHeader("X-Requested-With", "XMLHttpRequest"), a.setRequestHeader("Content-type", "application/x-www-form-urlencoded")),
                                r && (e.once("snap.ajax." + s + ".0", r), e.once("snap.ajax." + s + ".200", r), e.once("snap.ajax." + s + ".304", r)),
                                (a.onreadystatechange = function () {
                                    4 == a.readyState && e("snap.ajax." + s + "." + a.status, o, a);
                                }),
                                4 == a.readyState ? a : (a.send(n), a)
                            );
                        }
                    }),
                    (n.load = function (t, e, r) {
                        n.ajax(t, function (t) {
                            var i = n.parse(t.responseText);
                            r ? e.call(r, i) : e(i);
                        });
                    });
                var nt = function (t) {
                    var e = t.getBoundingClientRect(),
                        n = t.ownerDocument,
                        r = n.body,
                        i = n.documentElement,
                        o = i.clientTop || r.clientTop || 0,
                        a = i.clientLeft || r.clientLeft || 0,
                        s = e.top + (g.win.pageYOffset || i.scrollTop || r.scrollTop) - o,
                        l = e.left + (g.win.pageXOffset || i.scrollLeft || r.scrollLeft) - a;
                    return { y: s, x: l };
                };
                return (
                    (n.getElementByPoint = function (t, e) {
                        var n = this,
                            r = (n.canvas, k.doc.elementFromPoint(t, e));
                        if (k.win.opera && "svg" == r.tagName) {
                            var i = nt(r),
                                o = r.createSVGRect();
                            (o.x = t - i.x), (o.y = e - i.y), (o.width = o.height = 1);
                            var a = r.getIntersectionList(o, null);
                            a.length && (r = a[a.length - 1]);
                        }
                        return r ? C(r) : null;
                    }),
                    (n.plugin = function (t) {
                        t(n, y, w, k, x);
                    }),
                    (k.win.Snap = n),
                    n
                );
            })(t || this);
        return (
            r.plugin(function (r, i, o, a, s) {
                function l(t, e) {
                    if (null == e) {
                        var n = !0;
                        if (((e = t.node.getAttribute("linearGradient" == t.type || "radialGradient" == t.type ? "gradientTransform" : "pattern" == t.type ? "patternTransform" : "transform")), !e)) return new r.Matrix();
                        e = r._.svgTransform2string(e);
                    } else (e = r._.rgTransform.test(e) ? p(e).replace(/\.{3}|\u2026/g, t._.transform || "") : r._.svgTransform2string(e)), d(e, "array") && (e = r.path ? r.path.toString.call(e) : p(e)), (t._.transform = e);
                    var i = r._.transform2matrix(e, t.getBBox(1));
                    return n ? i : void (t.matrix = i);
                }
                function c(t) {
                    function e(t, e) {
                        var n = m(t.node, e);
                        (n = n && n.match(o)),
                            (n = n && n[2]),
                            n &&
                            "#" == n.charAt() &&
                            ((n = n.substring(1)),
                                n &&
                                (s[n] = (s[n] || []).concat(function (n) {
                                    var r = {};
                                    (r[e] = URL(n)), m(t.node, r);
                                })));
                    }
                    function n(t) {
                        var e = m(t.node, "xlink:href");
                        e &&
                            "#" == e.charAt() &&
                            ((e = e.substring(1)),
                                e &&
                                (s[e] = (s[e] || []).concat(function (e) {
                                    t.attr("xlink:href", "#" + e);
                                })));
                    }
                    for (var r, i = t.selectAll("*"), o = /^\s*url\(("|'|)(.*)\1\)\s*$/, a = [], s = {}, l = 0, c = i.length; c > l; l++) {
                        (r = i[l]), e(r, "fill"), e(r, "stroke"), e(r, "filter"), e(r, "mask"), e(r, "clip-path"), n(r);
                        var u = m(r.node, "id");
                        u && (m(r.node, { id: r.id }), a.push({ old: u, id: r.id }));
                    }
                    for (l = 0, c = a.length; c > l; l++) {
                        var f = s[a[l].old];
                        if (f) for (var h = 0, d = f.length; d > h; h++) f[h](a[l].id);
                    }
                }
                function u(t, e, n) {
                    return function (r) {
                        var i = r.slice(t, e);
                        return 1 == i.length && (i = i[0]), n ? n(i) : i;
                    };
                }
                function f(t) {
                    return function () {
                        var e = t ? "<" + this.type : "",
                            n = this.node.attributes,
                            r = this.node.childNodes;
                        if (t) for (var i = 0, o = n.length; o > i; i++) e += " " + n[i].name + '="' + n[i].value.replace(/"/g, '\\"') + '"';
                        if (r.length) {
                            for (t && (e += ">"), i = 0, o = r.length; o > i; i++) 3 == r[i].nodeType ? (e += r[i].nodeValue) : 1 == r[i].nodeType && (e += b(r[i]).toString());
                            t && (e += "</" + this.type + ">");
                        } else t && (e += "/>");
                        return e;
                    };
                }
                var h = i.prototype,
                    d = r.is,
                    p = String,
                    g = r._unit2px,
                    m = r._.$,
                    v = r._.make,
                    y = r._.getSomeDefs,
                    x = "hasOwnProperty",
                    b = r._.wrap;
                h.getBBox = function (t) {
                    if (!r.Matrix || !r.path) return this.node.getBBox();
                    var e = this,
                        n = new r.Matrix();
                    if (e.removed) return r._.box();
                    for (; "use" == e.type;)
                        if ((t || (n = n.add(e.transform().localMatrix.translate(e.attr("x") || 0, e.attr("y") || 0))), e.original)) e = e.original;
                        else {
                            var i = e.attr("xlink:href");
                            e = e.original = e.node.ownerDocument.getElementById(i.substring(i.indexOf("#") + 1));
                        }
                    var o = e._,
                        a = r.path.get[e.type] || r.path.get.deflt;
                    try {
                        return t
                            ? ((o.bboxwt = a ? r.path.getBBox((e.realPath = a(e))) : r._.box(e.node.getBBox())), r._.box(o.bboxwt))
                            : ((e.realPath = a(e)), (e.matrix = e.transform().localMatrix), (o.bbox = r.path.getBBox(r.path.map(e.realPath, n.add(e.matrix)))), r._.box(o.bbox));
                    } catch (s) {
                        return r._.box();
                    }
                };
                var w = function () {
                    return this.string;
                };
                (h.transform = function (t) {
                    var e = this._;
                    if (null == t) {
                        for (var n, i = this, o = new r.Matrix(this.node.getCTM()), a = l(this), s = [a], c = new r.Matrix(), u = a.toTransformString(), f = p(a) == p(this.matrix) ? p(e.transform) : u; "svg" != i.type && (i = i.parent());)
                            s.push(l(i));
                        for (n = s.length; n--;) c.add(s[n]);
                        return { string: f, globalMatrix: o, totalMatrix: c, localMatrix: a, diffMatrix: o.clone().add(a.invert()), global: o.toTransformString(), total: c.toTransformString(), local: u, toString: w };
                    }
                    return (
                        t instanceof r.Matrix ? ((this.matrix = t), (this._.transform = t.toTransformString())) : l(this, t),
                        this.node &&
                        ("linearGradient" == this.type || "radialGradient" == this.type
                            ? m(this.node, { gradientTransform: this.matrix })
                            : "pattern" == this.type
                                ? m(this.node, { patternTransform: this.matrix })
                                : m(this.node, { transform: this.matrix })),
                        this
                    );
                }),
                    (h.parent = function () {
                        return b(this.node.parentNode);
                    }),
                    (h.append = h.add = function (t) {
                        if (t) {
                            if ("set" == t.type) {
                                var e = this;
                                return (
                                    t.forEach(function (t) {
                                        e.add(t);
                                    }),
                                    this
                                );
                            }
                            (t = b(t)), this.node.appendChild(t.node), (t.paper = this.paper);
                        }
                        return this;
                    }),
                    (h.appendTo = function (t) {
                        return t && ((t = b(t)), t.append(this)), this;
                    }),
                    (h.prepend = function (t) {
                        if (t) {
                            if ("set" == t.type) {
                                var e,
                                    n = this;
                                return (
                                    t.forEach(function (t) {
                                        e ? e.after(t) : n.prepend(t), (e = t);
                                    }),
                                    this
                                );
                            }
                            t = b(t);
                            var r = t.parent();
                            this.node.insertBefore(t.node, this.node.firstChild), this.add && this.add(), (t.paper = this.paper), this.parent() && this.parent().add(), r && r.add();
                        }
                        return this;
                    }),
                    (h.prependTo = function (t) {
                        return (t = b(t)), t.prepend(this), this;
                    }),
                    (h.before = function (t) {
                        if ("set" == t.type) {
                            var e = this;
                            return (
                                t.forEach(function (t) {
                                    var n = t.parent();
                                    e.node.parentNode.insertBefore(t.node, e.node), n && n.add();
                                }),
                                this.parent().add(),
                                this
                            );
                        }
                        t = b(t);
                        var n = t.parent();
                        return this.node.parentNode.insertBefore(t.node, this.node), this.parent() && this.parent().add(), n && n.add(), (t.paper = this.paper), this;
                    }),
                    (h.after = function (t) {
                        t = b(t);
                        var e = t.parent();
                        return (
                            this.node.nextSibling ? this.node.parentNode.insertBefore(t.node, this.node.nextSibling) : this.node.parentNode.appendChild(t.node),
                            this.parent() && this.parent().add(),
                            e && e.add(),
                            (t.paper = this.paper),
                            this
                        );
                    }),
                    (h.insertBefore = function (t) {
                        t = b(t);
                        var e = this.parent();
                        return t.node.parentNode.insertBefore(this.node, t.node), (this.paper = t.paper), e && e.add(), t.parent() && t.parent().add(), this;
                    }),
                    (h.insertAfter = function (t) {
                        t = b(t);
                        var e = this.parent();
                        return t.node.parentNode.insertBefore(this.node, t.node.nextSibling), (this.paper = t.paper), e && e.add(), t.parent() && t.parent().add(), this;
                    }),
                    (h.remove = function () {
                        var t = this.parent();
                        return this.node.parentNode && this.node.parentNode.removeChild(this.node), delete this.paper, (this.removed = !0), t && t.add(), this;
                    }),
                    (h.select = function (t) {
                        return b(this.node.querySelector(t));
                    }),
                    (h.selectAll = function (t) {
                        for (var e = this.node.querySelectorAll(t), n = (r.set || Array)(), i = 0; i < e.length; i++) n.push(b(e[i]));
                        return n;
                    }),
                    (h.asPX = function (t, e) {
                        return null == e && (e = this.attr(t)), +g(this, t, e);
                    }),
                    (h.use = function () {
                        var t,
                            e = this.node.id;
                        return (
                            e || ((e = this.id), m(this.node, { id: e })),
                            (t = "linearGradient" == this.type || "radialGradient" == this.type || "pattern" == this.type ? v(this.type, this.node.parentNode) : v("use", this.node.parentNode)),
                            m(t.node, { "xlink:href": "#" + e }),
                            (t.original = this),
                            t
                        );
                    }),
                    (h.clone = function () {
                        var t = b(this.node.cloneNode(!0));
                        return m(t.node, "id") && m(t.node, { id: t.id }), c(t), t.insertAfter(this), t;
                    }),
                    (h.toDefs = function () {
                        var t = y(this);
                        return t.appendChild(this.node), this;
                    }),
                    (h.pattern = h.toPattern = function (t, e, n, r) {
                        var i = v("pattern", y(this));
                        return (
                            null == t && (t = this.getBBox()),
                            d(t, "object") && "x" in t && ((e = t.y), (n = t.width), (r = t.height), (t = t.x)),
                            m(i.node, { x: t, y: e, width: n, height: r, patternUnits: "userSpaceOnUse", id: i.id, viewBox: [t, e, n, r].join(" ") }),
                            i.node.appendChild(this.node),
                            i
                        );
                    }),
                    (h.marker = function (t, e, n, r, i, o) {
                        var a = v("marker", y(this));
                        return (
                            null == t && (t = this.getBBox()),
                            d(t, "object") && "x" in t && ((e = t.y), (n = t.width), (r = t.height), (i = t.refX || t.cx), (o = t.refY || t.cy), (t = t.x)),
                            m(a.node, { viewBox: [t, e, n, r].join(" "), markerWidth: n, markerHeight: r, orient: "auto", refX: i || 0, refY: o || 0, id: a.id }),
                            a.node.appendChild(this.node),
                            a
                        );
                    });
                var C = function (t, e, r, i) {
                    "function" != typeof r || r.length || ((i = r), (r = n.linear)), (this.attr = t), (this.dur = e), r && (this.easing = r), i && (this.callback = i);
                };
                (r._.Animation = C),
                    (r.animation = function (t, e, n, r) {
                        return new C(t, e, n, r);
                    }),
                    (h.inAnim = function () {
                        var t = this,
                            e = [];
                        for (var n in t.anims)
                            t.anims[x](n) &&
                                !(function (t) {
                                    e.push({
                                        anim: new C(t._attrs, t.dur, t.easing, t._callback),
                                        mina: t,
                                        curStatus: t.status(),
                                        status: function (e) {
                                            return t.status(e);
                                        },
                                        stop: function () {
                                            t.stop();
                                        },
                                    });
                                })(t.anims[n]);
                        return e;
                    }),
                    (r.animate = function (t, r, i, o, a, s) {
                        "function" != typeof a || a.length || ((s = a), (a = n.linear));
                        var l = n.time(),
                            c = n(t, r, l, l + o, n.time, i, a);
                        return s && e.once("mina.finish." + c.id, s), c;
                    }),
                    (h.stop = function () {
                        for (var t = this.inAnim(), e = 0, n = t.length; n > e; e++) t[e].stop();
                        return this;
                    }),
                    (h.animate = function (t, r, i, o) {
                        "function" != typeof i || i.length || ((o = i), (i = n.linear)), t instanceof C && ((o = t.callback), (i = t.easing), (r = t.dur), (t = t.attr));
                        var a,
                            s,
                            l,
                            c,
                            f = [],
                            h = [],
                            g = {},
                            m = this;
                        for (var v in t)
                            if (t[x](v)) {
                                m.equal ? ((c = m.equal(v, p(t[v]))), (a = c.from), (s = c.to), (l = c.f)) : ((a = +m.attr(v)), (s = +t[v]));
                                var y = d(a, "array") ? a.length : 1;
                                (g[v] = u(f.length, f.length + y, l)), (f = f.concat(a)), (h = h.concat(s));
                            }
                        var b = n.time(),
                            w = n(
                                f,
                                h,
                                b,
                                b + r,
                                n.time,
                                function (t) {
                                    var e = {};
                                    for (var n in g) g[x](n) && (e[n] = g[n](t));
                                    m.attr(e);
                                },
                                i
                            );
                        return (
                            (m.anims[w.id] = w),
                            (w._attrs = t),
                            (w._callback = o),
                            e("snap.animcreated." + m.id, w),
                            e.once("mina.finish." + w.id, function () {
                                delete m.anims[w.id], o && o.call(m);
                            }),
                            e.once("mina.stop." + w.id, function () {
                                delete m.anims[w.id];
                            }),
                            m
                        );
                    });
                var S = {};
                (h.data = function (t, n) {
                    var i = (S[this.id] = S[this.id] || {});
                    if (0 == arguments.length) return e("snap.data.get." + this.id, this, i, null), i;
                    if (1 == arguments.length) {
                        if (r.is(t, "object")) {
                            for (var o in t) t[x](o) && this.data(o, t[o]);
                            return this;
                        }
                        return e("snap.data.get." + this.id, this, i[t], t), i[t];
                    }
                    return (i[t] = n), e("snap.data.set." + this.id, this, n, t), this;
                }),
                    (h.removeData = function (t) {
                        return null == t ? (S[this.id] = {}) : S[this.id] && delete S[this.id][t], this;
                    }),
                    (h.outerSVG = h.toString = f(1)),
                    (h.innerSVG = f()),
                    (h.toDataURL = function () {
                        if (t && t.btoa) {
                            var e = this.getBBox(),
                                n = r.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                                    x: +e.x.toFixed(3),
                                    y: +e.y.toFixed(3),
                                    width: +e.width.toFixed(3),
                                    height: +e.height.toFixed(3),
                                    contents: this.outerSVG(),
                                });
                            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(n)));
                        }
                    }),
                    (s.prototype.select = h.select),
                    (s.prototype.selectAll = h.selectAll);
            }),
            r.plugin(function (t) {
                function e(t, e, r, i, o, a) {
                    return null == e && "[object SVGMatrix]" == n.call(t)
                        ? ((this.a = t.a), (this.b = t.b), (this.c = t.c), (this.d = t.d), (this.e = t.e), void (this.f = t.f))
                        : void (null != t ? ((this.a = +t), (this.b = +e), (this.c = +r), (this.d = +i), (this.e = +o), (this.f = +a)) : ((this.a = 1), (this.b = 0), (this.c = 0), (this.d = 1), (this.e = 0), (this.f = 0)));
                }
                var n = Object.prototype.toString,
                    r = String,
                    i = Math,
                    o = "";
                !(function (n) {
                    function a(t) {
                        return t[0] * t[0] + t[1] * t[1];
                    }
                    function s(t) {
                        var e = i.sqrt(a(t));
                        t[0] && (t[0] /= e), t[1] && (t[1] /= e);
                    }
                    (n.add = function (t, n, r, i, o, a) {
                        var s,
                            l,
                            c,
                            u,
                            f = [[], [], []],
                            h = [
                                [this.a, this.c, this.e],
                                [this.b, this.d, this.f],
                                [0, 0, 1],
                            ],
                            d = [
                                [t, r, o],
                                [n, i, a],
                                [0, 0, 1],
                            ];
                        for (
                            t &&
                            t instanceof e &&
                            (d = [
                                [t.a, t.c, t.e],
                                [t.b, t.d, t.f],
                                [0, 0, 1],
                            ]),
                            s = 0;
                            3 > s;
                            s++
                        )
                            for (l = 0; 3 > l; l++) {
                                for (u = 0, c = 0; 3 > c; c++) u += h[s][c] * d[c][l];
                                f[s][l] = u;
                            }
                        return (this.a = f[0][0]), (this.b = f[1][0]), (this.c = f[0][1]), (this.d = f[1][1]), (this.e = f[0][2]), (this.f = f[1][2]), this;
                    }),
                        (n.invert = function () {
                            var t = this,
                                n = t.a * t.d - t.b * t.c;
                            return new e(t.d / n, -t.b / n, -t.c / n, t.a / n, (t.c * t.f - t.d * t.e) / n, (t.b * t.e - t.a * t.f) / n);
                        }),
                        (n.clone = function () {
                            return new e(this.a, this.b, this.c, this.d, this.e, this.f);
                        }),
                        (n.translate = function (t, e) {
                            return this.add(1, 0, 0, 1, t, e);
                        }),
                        (n.scale = function (t, e, n, r) {
                            return null == e && (e = t), (n || r) && this.add(1, 0, 0, 1, n, r), this.add(t, 0, 0, e, 0, 0), (n || r) && this.add(1, 0, 0, 1, -n, -r), this;
                        }),
                        (n.rotate = function (e, n, r) {
                            (e = t.rad(e)), (n = n || 0), (r = r || 0);
                            var o = +i.cos(e).toFixed(9),
                                a = +i.sin(e).toFixed(9);
                            return this.add(o, a, -a, o, n, r), this.add(1, 0, 0, 1, -n, -r);
                        }),
                        (n.x = function (t, e) {
                            return t * this.a + e * this.c + this.e;
                        }),
                        (n.y = function (t, e) {
                            return t * this.b + e * this.d + this.f;
                        }),
                        (n.get = function (t) {
                            return +this[r.fromCharCode(97 + t)].toFixed(4);
                        }),
                        (n.toString = function () {
                            return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
                        }),
                        (n.offset = function () {
                            return [this.e.toFixed(4), this.f.toFixed(4)];
                        }),
                        (n.determinant = function () {
                            return this.a * this.d - this.b * this.c;
                        }),
                        (n.split = function () {
                            var e = {};
                            (e.dx = this.e), (e.dy = this.f);
                            var n = [
                                [this.a, this.c],
                                [this.b, this.d],
                            ];
                            (e.scalex = i.sqrt(a(n[0]))),
                                s(n[0]),
                                (e.shear = n[0][0] * n[1][0] + n[0][1] * n[1][1]),
                                (n[1] = [n[1][0] - n[0][0] * e.shear, n[1][1] - n[0][1] * e.shear]),
                                (e.scaley = i.sqrt(a(n[1]))),
                                s(n[1]),
                                (e.shear /= e.scaley),
                                this.determinant() < 0 && (e.scalex = -e.scalex);
                            var r = -n[0][1],
                                o = n[1][1];
                            return (
                                0 > o ? ((e.rotate = t.deg(i.acos(o))), 0 > r && (e.rotate = 360 - e.rotate)) : (e.rotate = t.deg(i.asin(r))),
                                (e.isSimple = !(+e.shear.toFixed(9) || (e.scalex.toFixed(9) != e.scaley.toFixed(9) && e.rotate))),
                                (e.isSuperSimple = !+e.shear.toFixed(9) && e.scalex.toFixed(9) == e.scaley.toFixed(9) && !e.rotate),
                                (e.noRotation = !+e.shear.toFixed(9) && !e.rotate),
                                e
                            );
                        }),
                        (n.toTransformString = function (t) {
                            var e = t || this.split();
                            return +e.shear.toFixed(9)
                                ? "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
                                : ((e.scalex = +e.scalex.toFixed(4)),
                                    (e.scaley = +e.scaley.toFixed(4)),
                                    (e.rotate = +e.rotate.toFixed(4)),
                                    (e.dx || e.dy ? "t" + [+e.dx.toFixed(4), +e.dy.toFixed(4)] : o) + (1 != e.scalex || 1 != e.scaley ? "s" + [e.scalex, e.scaley, 0, 0] : o) + (e.rotate ? "r" + [+e.rotate.toFixed(4), 0, 0] : o));
                        });
                })(e.prototype),
                    (t.Matrix = e),
                    (t.matrix = function (t, n, r, i, o, a) {
                        return new e(t, n, r, i, o, a);
                    });
            }),
            r.plugin(function (t, n, r, i, o) {
                function a(r) {
                    return function (i) {
                        if (
                            (e.stop(),
                                i instanceof o &&
                                1 == i.node.childNodes.length &&
                                ("radialGradient" == i.node.firstChild.tagName || "linearGradient" == i.node.firstChild.tagName || "pattern" == i.node.firstChild.tagName) &&
                                ((i = i.node.firstChild), d(this).appendChild(i), (i = f(i))),
                                i instanceof n)
                        )
                            if ("radialGradient" == i.type || "linearGradient" == i.type || "pattern" == i.type) {
                                i.node.id || g(i.node, { id: i.id });
                                var a = m(i.node.id);
                            } else a = i.attr(r);
                        else if (((a = t.color(i)), a.error)) {
                            var s = t(d(this).ownerSVGElement).gradient(i);
                            s ? (s.node.id || g(s.node, { id: s.id }), (a = m(s.node.id))) : (a = i);
                        } else a = v(a);
                        var l = {};
                        (l[r] = a), g(this.node, l), (this.node.style[r] = x);
                    };
                }
                function s(t) {
                    e.stop(), t == +t && (t += "px"), (this.node.style.fontSize = t);
                }
                function l(t) {
                    for (var e = [], n = t.childNodes, r = 0, i = n.length; i > r; r++) {
                        var o = n[r];
                        3 == o.nodeType && e.push(o.nodeValue), "tspan" == o.tagName && e.push(1 == o.childNodes.length && 3 == o.firstChild.nodeType ? o.firstChild.nodeValue : l(o));
                    }
                    return e;
                }
                function c() {
                    return e.stop(), this.node.style.fontSize;
                }
                var u = t._.make,
                    f = t._.wrap,
                    h = t.is,
                    d = t._.getSomeDefs,
                    p = /^url\(#?([^)]+)\)$/,
                    g = t._.$,
                    m = t.url,
                    v = String,
                    y = t._.separator,
                    x = "";
                e.on("snap.util.attr.mask", function (t) {
                    if (t instanceof n || t instanceof o) {
                        if ((e.stop(), t instanceof o && 1 == t.node.childNodes.length && ((t = t.node.firstChild), d(this).appendChild(t), (t = f(t))), "mask" == t.type)) var r = t;
                        else (r = u("mask", d(this))), r.node.appendChild(t.node);
                        !r.node.id && g(r.node, { id: r.id }), g(this.node, { mask: m(r.id) });
                    }
                }),
                    (function (t) {
                        e.on("snap.util.attr.clip", t), e.on("snap.util.attr.clip-path", t), e.on("snap.util.attr.clipPath", t);
                    })(function (t) {
                        if (t instanceof n || t instanceof o) {
                            if ((e.stop(), "clipPath" == t.type)) var r = t;
                            else (r = u("clipPath", d(this))), r.node.appendChild(t.node), !r.node.id && g(r.node, { id: r.id });
                            g(this.node, { "clip-path": m(r.node.id || r.id) });
                        }
                    }),
                    e.on("snap.util.attr.fill", a("fill")),
                    e.on("snap.util.attr.stroke", a("stroke"));
                var b = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
                e.on("snap.util.grad.parse", function (t) {
                    t = v(t);
                    var e = t.match(b);
                    if (!e) return null;
                    var n = e[1],
                        r = e[2],
                        i = e[3];
                    return (
                        (r = r.split(/\s*,\s*/).map(function (t) {
                            return +t == t ? +t : t;
                        })),
                        1 == r.length && 0 == r[0] && (r = []),
                        (i = i.split("-")),
                        (i = i.map(function (t) {
                            t = t.split(":");
                            var e = { color: t[0] };
                            return t[1] && (e.offset = parseFloat(t[1])), e;
                        })),
                        { type: n, params: r, stops: i }
                    );
                }),
                    e.on("snap.util.attr.d", function (n) {
                        e.stop(), h(n, "array") && h(n[0], "array") && (n = t.path.toString.call(n)), (n = v(n)), n.match(/[ruo]/i) && (n = t.path.toAbsolute(n)), g(this.node, { d: n });
                    })(-1),
                    e.on("snap.util.attr.#text", function (t) {
                        e.stop(), (t = v(t));
                        for (var n = i.doc.createTextNode(t); this.node.firstChild;) this.node.removeChild(this.node.firstChild);
                        this.node.appendChild(n);
                    })(-1),
                    e.on("snap.util.attr.path", function (t) {
                        e.stop(), this.attr({ d: t });
                    })(-1),
                    e.on("snap.util.attr.class", function (t) {
                        e.stop(), (this.node.className.baseVal = t);
                    })(-1),
                    e.on("snap.util.attr.viewBox", function (t) {
                        var n;
                        (n = h(t, "object") && "x" in t ? [t.x, t.y, t.width, t.height].join(" ") : h(t, "array") ? t.join(" ") : t), g(this.node, { viewBox: n }), e.stop();
                    })(-1),
                    e.on("snap.util.attr.transform", function (t) {
                        this.transform(t), e.stop();
                    })(-1),
                    e.on("snap.util.attr.r", function (t) {
                        "rect" == this.type && (e.stop(), g(this.node, { rx: t, ry: t }));
                    })(-1),
                    e.on("snap.util.attr.textpath", function (t) {
                        if ((e.stop(), "text" == this.type)) {
                            var r, i, o;
                            if (!t && this.textPath) {
                                for (i = this.textPath; i.node.firstChild;) this.node.appendChild(i.node.firstChild);
                                return i.remove(), void delete this.textPath;
                            }
                            if (h(t, "string")) {
                                var a = d(this),
                                    s = f(a.parentNode).path(t);
                                a.appendChild(s.node), (r = s.id), s.attr({ id: r });
                            } else (t = f(t)), t instanceof n && ((r = t.attr("id")), r || ((r = t.id), t.attr({ id: r })));
                            if (r)
                                if (((i = this.textPath), (o = this.node), i)) i.attr({ "xlink:href": "#" + r });
                                else {
                                    for (i = g("textPath", { "xlink:href": "#" + r }); o.firstChild;) i.appendChild(o.firstChild);
                                    o.appendChild(i), (this.textPath = f(i));
                                }
                        }
                    })(-1),
                    e.on("snap.util.attr.text", function (t) {
                        if ("text" == this.type) {
                            for (
                                var n = this.node,
                                r = function (t) {
                                    var e = g("tspan");
                                    if (h(t, "array")) for (var n = 0; n < t.length; n++) e.appendChild(r(t[n]));
                                    else e.appendChild(i.doc.createTextNode(t));
                                    return e.normalize && e.normalize(), e;
                                };
                                n.firstChild;

                            )
                                n.removeChild(n.firstChild);
                            for (var o = r(t); o.firstChild;) n.appendChild(o.firstChild);
                        }
                        e.stop();
                    })(-1),
                    e.on("snap.util.attr.fontSize", s)(-1),
                    e.on("snap.util.attr.font-size", s)(-1),
                    e.on("snap.util.getattr.transform", function () {
                        return e.stop(), this.transform();
                    })(-1),
                    e.on("snap.util.getattr.textpath", function () {
                        return e.stop(), this.textPath;
                    })(-1),
                    (function () {
                        function n(n) {
                            return function () {
                                e.stop();
                                var r = i.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + n);
                                return "none" == r ? r : t(i.doc.getElementById(r.match(p)[1]));
                            };
                        }
                        function r(t) {
                            return function (n) {
                                e.stop();
                                var r = "marker" + t.charAt(0).toUpperCase() + t.substring(1);
                                if ("" == n || !n) return void (this.node.style[r] = "none");
                                if ("marker" == n.type) {
                                    var i = n.node.id;
                                    return i || g(n.node, { id: n.id }), void (this.node.style[r] = m(i));
                                }
                            };
                        }
                        e.on("snap.util.getattr.marker-end", n("end"))(-1),
                            e.on("snap.util.getattr.markerEnd", n("end"))(-1),
                            e.on("snap.util.getattr.marker-start", n("start"))(-1),
                            e.on("snap.util.getattr.markerStart", n("start"))(-1),
                            e.on("snap.util.getattr.marker-mid", n("mid"))(-1),
                            e.on("snap.util.getattr.markerMid", n("mid"))(-1),
                            e.on("snap.util.attr.marker-end", r("end"))(-1),
                            e.on("snap.util.attr.markerEnd", r("end"))(-1),
                            e.on("snap.util.attr.marker-start", r("start"))(-1),
                            e.on("snap.util.attr.markerStart", r("start"))(-1),
                            e.on("snap.util.attr.marker-mid", r("mid"))(-1),
                            e.on("snap.util.attr.markerMid", r("mid"))(-1);
                    })(),
                    e.on("snap.util.getattr.r", function () {
                        return "rect" == this.type && g(this.node, "rx") == g(this.node, "ry") ? (e.stop(), g(this.node, "rx")) : void 0;
                    })(-1),
                    e.on("snap.util.getattr.text", function () {
                        if ("text" == this.type || "tspan" == this.type) {
                            e.stop();
                            var t = l(this.node);
                            return 1 == t.length ? t[0] : t;
                        }
                    })(-1),
                    e.on("snap.util.getattr.#text", function () {
                        return this.node.textContent;
                    })(-1),
                    e.on("snap.util.getattr.viewBox", function () {
                        e.stop();
                        var n = g(this.node, "viewBox");
                        return n ? ((n = n.split(y)), t._.box(+n[0], +n[1], +n[2], +n[3])) : void 0;
                    })(-1),
                    e.on("snap.util.getattr.points", function () {
                        var t = g(this.node, "points");
                        return e.stop(), t ? t.split(y) : void 0;
                    })(-1),
                    e.on("snap.util.getattr.path", function () {
                        var t = g(this.node, "d");
                        return e.stop(), t;
                    })(-1),
                    e.on("snap.util.getattr.class", function () {
                        return this.node.className.baseVal;
                    })(-1),
                    e.on("snap.util.getattr.fontSize", c)(-1),
                    e.on("snap.util.getattr.font-size", c)(-1);
            }),
            r.plugin(function (t, e) {
                var n = /\S+/g,
                    r = String,
                    i = e.prototype;
                (i.addClass = function (t) {
                    var e,
                        i,
                        o,
                        a,
                        s = r(t || "").match(n) || [],
                        l = this.node,
                        c = l.className.baseVal,
                        u = c.match(n) || [];
                    if (s.length) {
                        for (e = 0; (o = s[e++]);) (i = u.indexOf(o)), ~i || u.push(o);
                        (a = u.join(" ")), c != a && (l.className.baseVal = a);
                    }
                    return this;
                }),
                    (i.removeClass = function (t) {
                        var e,
                            i,
                            o,
                            a,
                            s = r(t || "").match(n) || [],
                            l = this.node,
                            c = l.className.baseVal,
                            u = c.match(n) || [];
                        if (u.length) {
                            for (e = 0; (o = s[e++]);) (i = u.indexOf(o)), ~i && u.splice(i, 1);
                            (a = u.join(" ")), c != a && (l.className.baseVal = a);
                        }
                        return this;
                    }),
                    (i.hasClass = function (t) {
                        var e = this.node,
                            r = e.className.baseVal,
                            i = r.match(n) || [];
                        return !!~i.indexOf(t);
                    }),
                    (i.toggleClass = function (t, e) {
                        if (null != e) return e ? this.addClass(t) : this.removeClass(t);
                        var r,
                            i,
                            o,
                            a,
                            s = (t || "").match(n) || [],
                            l = this.node,
                            c = l.className.baseVal,
                            u = c.match(n) || [];
                        for (r = 0; (o = s[r++]);) (i = u.indexOf(o)), ~i ? u.splice(i, 1) : u.push(o);
                        return (a = u.join(" ")), c != a && (l.className.baseVal = a), this;
                    });
            }),
            r.plugin(function () {
                function t(t) {
                    return t;
                }
                function n(t) {
                    return function (e) {
                        return +e.toFixed(3) + t;
                    };
                }
                var r = {
                    "+": function (t, e) {
                        return t + e;
                    },
                    "-": function (t, e) {
                        return t - e;
                    },
                    "/": function (t, e) {
                        return t / e;
                    },
                    "*": function (t, e) {
                        return t * e;
                    },
                },
                    i = String,
                    o = /[a-z]+$/i,
                    a = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
                e.on("snap.util.attr", function (t) {
                    var n = i(t).match(a);
                    if (n) {
                        var s = e.nt(),
                            l = s.substring(s.lastIndexOf(".") + 1),
                            c = this.attr(l),
                            u = {};
                        e.stop();
                        var f = n[3] || "",
                            h = c.match(o),
                            d = r[n[1]];
                        if ((h && h == f ? (t = d(parseFloat(c), +n[2])) : ((c = this.asPX(l)), (t = d(this.asPX(l), this.asPX(l, n[2] + f)))), isNaN(c) || isNaN(t))) return;
                        (u[l] = t), this.attr(u);
                    }
                })(-10),
                    e.on("snap.util.equal", function (s, l) {
                        var c = i(this.attr(s) || ""),
                            u = i(l).match(a);
                        if (u) {
                            e.stop();
                            var f = u[3] || "",
                                h = c.match(o),
                                d = r[u[1]];
                            return h && h == f ? { from: parseFloat(c), to: d(parseFloat(c), +u[2]), f: n(h) } : ((c = this.asPX(s)), { from: c, to: d(c, this.asPX(s, u[2] + f)), f: t });
                        }
                    })(-10);
            }),
            r.plugin(function (n, r, i, o) {
                var a = i.prototype,
                    s = n.is;
                (a.rect = function (t, e, n, r, i, o) {
                    var a;
                    return null == o && (o = i), s(t, "object") && "[object Object]" == t ? (a = t) : null != t && ((a = { x: t, y: e, width: n, height: r }), null != i && ((a.rx = i), (a.ry = o))), this.el("rect", a);
                }),
                    (a.circle = function (t, e, n) {
                        var r;
                        return s(t, "object") && "[object Object]" == t ? (r = t) : null != t && (r = { cx: t, cy: e, r: n }), this.el("circle", r);
                    });
                var l = (function () {
                    function t() {
                        this.parentNode.removeChild(this);
                    }
                    return function (e, n) {
                        var r = o.doc.createElement("img"),
                            i = o.doc.body;
                        (r.style.cssText = "position:absolute;left:-9999em;top:-9999em"),
                            (r.onload = function () {
                                n.call(r), (r.onload = r.onerror = null), i.removeChild(r);
                            }),
                            (r.onerror = t),
                            i.appendChild(r),
                            (r.src = e);
                    };
                })();
                (a.image = function (t, e, r, i, o) {
                    var a = this.el("image");
                    if (s(t, "object") && "src" in t) a.attr(t);
                    else if (null != t) {
                        var c = { "xlink:href": t, preserveAspectRatio: "none" };
                        null != e && null != r && ((c.x = e), (c.y = r)),
                            null != i && null != o
                                ? ((c.width = i), (c.height = o))
                                : l(t, function () {
                                    n._.$(a.node, { width: this.offsetWidth, height: this.offsetHeight });
                                }),
                            n._.$(a.node, c);
                    }
                    return a;
                }),
                    (a.ellipse = function (t, e, n, r) {
                        var i;
                        return s(t, "object") && "[object Object]" == t ? (i = t) : null != t && (i = { cx: t, cy: e, rx: n, ry: r }), this.el("ellipse", i);
                    }),
                    (a.path = function (t) {
                        var e;
                        return s(t, "object") && !s(t, "array") ? (e = t) : t && (e = { d: t }), this.el("path", e);
                    }),
                    (a.group = a.g = function (t) {
                        var e = this.el("g");
                        return 1 == arguments.length && t && !t.type ? e.attr(t) : arguments.length && e.add(Array.prototype.slice.call(arguments, 0)), e;
                    }),
                    (a.svg = function (t, e, n, r, i, o, a, l) {
                        var c = {};
                        return (
                            s(t, "object") && null == e
                                ? (c = t)
                                : (null != t && (c.x = t), null != e && (c.y = e), null != n && (c.width = n), null != r && (c.height = r), null != i && null != o && null != a && null != l && (c.viewBox = [i, o, a, l])),
                            this.el("svg", c)
                        );
                    }),
                    (a.mask = function (t) {
                        var e = this.el("mask");
                        return 1 == arguments.length && t && !t.type ? e.attr(t) : arguments.length && e.add(Array.prototype.slice.call(arguments, 0)), e;
                    }),
                    (a.ptrn = function (t, e, n, r, i, o, a, l) {
                        if (s(t, "object")) var c = t;
                        else
                            (c = { patternUnits: "userSpaceOnUse" }),
                                t && (c.x = t),
                                e && (c.y = e),
                                null != n && (c.width = n),
                                null != r && (c.height = r),
                                (c.viewBox = null != i && null != o && null != a && null != l ? [i, o, a, l] : [t || 0, e || 0, n || 0, r || 0]);
                        return this.el("pattern", c);
                    }),
                    (a.use = function (t) {
                        return null != t
                            ? (t instanceof r && (t.attr("id") || t.attr({ id: n._.id(t) }), (t = t.attr("id"))), "#" == String(t).charAt() && (t = t.substring(1)), this.el("use", { "xlink:href": "#" + t }))
                            : r.prototype.use.call(this);
                    }),
                    (a.symbol = function (t, e, n, r) {
                        var i = {};
                        return null != t && null != e && null != n && null != r && (i.viewBox = [t, e, n, r]), this.el("symbol", i);
                    }),
                    (a.text = function (t, e, n) {
                        var r = {};
                        return s(t, "object") ? (r = t) : null != t && (r = { x: t, y: e, text: n || "" }), this.el("text", r);
                    }),
                    (a.line = function (t, e, n, r) {
                        var i = {};
                        return s(t, "object") ? (i = t) : null != t && (i = { x1: t, x2: n, y1: e, y2: r }), this.el("line", i);
                    }),
                    (a.polyline = function (t) {
                        arguments.length > 1 && (t = Array.prototype.slice.call(arguments, 0));
                        var e = {};
                        return s(t, "object") && !s(t, "array") ? (e = t) : null != t && (e = { points: t }), this.el("polyline", e);
                    }),
                    (a.polygon = function (t) {
                        arguments.length > 1 && (t = Array.prototype.slice.call(arguments, 0));
                        var e = {};
                        return s(t, "object") && !s(t, "array") ? (e = t) : null != t && (e = { points: t }), this.el("polygon", e);
                    }),
                    (function () {
                        function r() {
                            return this.selectAll("stop");
                        }
                        function i(t, e) {
                            var r = u("stop"),
                                i = { offset: +e + "%" };
                            return (t = n.color(t)), (i["stop-color"] = t.hex), t.opacity < 1 && (i["stop-opacity"] = t.opacity), u(r, i), this.node.appendChild(r), this;
                        }
                        function o() {
                            if ("linearGradient" == this.type) {
                                var t = u(this.node, "x1") || 0,
                                    e = u(this.node, "x2") || 1,
                                    r = u(this.node, "y1") || 0,
                                    i = u(this.node, "y2") || 0;
                                return n._.box(t, r, math.abs(e - t), math.abs(i - r));
                            }
                            var o = this.node.cx || 0.5,
                                a = this.node.cy || 0.5,
                                s = this.node.r || 0;
                            return n._.box(o - s, a - s, 2 * s, 2 * s);
                        }
                        function s(t, n) {
                            function r(t, e) {
                                for (var n = (e - f) / (t - h), r = h; t > r; r++) a[r].offset = +(+f + n * (r - h)).toFixed(2);
                                (h = t), (f = e);
                            }
                            var i,
                                o = e("snap.util.grad.parse", null, n).firstDefined();
                            if (!o) return null;
                            o.params.unshift(t), (i = "l" == o.type.toLowerCase() ? l.apply(0, o.params) : c.apply(0, o.params)), o.type != o.type.toLowerCase() && u(i.node, { gradientUnits: "userSpaceOnUse" });
                            var a = o.stops,
                                s = a.length,
                                f = 0,
                                h = 0;
                            s--;
                            for (var d = 0; s > d; d++) "offset" in a[d] && r(d, a[d].offset);
                            for (a[s].offset = a[s].offset || 100, r(s, a[s].offset), d = 0; s >= d; d++) {
                                var p = a[d];
                                i.addStop(p.color, p.offset);
                            }
                            return i;
                        }
                        function l(t, e, a, s, l) {
                            var c = n._.make("linearGradient", t);
                            return (c.stops = r), (c.addStop = i), (c.getBBox = o), null != e && u(c.node, { x1: e, y1: a, x2: s, y2: l }), c;
                        }
                        function c(t, e, a, s, l, c) {
                            var f = n._.make("radialGradient", t);
                            return (f.stops = r), (f.addStop = i), (f.getBBox = o), null != e && u(f.node, { cx: e, cy: a, r: s }), null != l && null != c && u(f.node, { fx: l, fy: c }), f;
                        }
                        var u = n._.$;
                        (a.gradient = function (t) {
                            return s(this.defs, t);
                        }),
                            (a.gradientLinear = function (t, e, n, r) {
                                return l(this.defs, t, e, n, r);
                            }),
                            (a.gradientRadial = function (t, e, n, r, i) {
                                return c(this.defs, t, e, n, r, i);
                            }),
                            (a.toString = function () {
                                var t,
                                    e = this.node.ownerDocument,
                                    r = e.createDocumentFragment(),
                                    i = e.createElement("div"),
                                    o = this.node.cloneNode(!0);
                                return r.appendChild(i), i.appendChild(o), n._.$(o, { xmlns: "http://www.w3.org/2000/svg" }), (t = i.innerHTML), r.removeChild(r.firstChild), t;
                            }),
                            (a.toDataURL = function () {
                                return t && t.btoa ? "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this))) : void 0;
                            }),
                            (a.clear = function () {
                                for (var t, e = this.node.firstChild; e;) (t = e.nextSibling), "defs" != e.tagName ? e.parentNode.removeChild(e) : a.clear.call({ node: e }), (e = t);
                            });
                    })();
            }),
            r.plugin(function (t, e) {
                function n(t) {
                    var e = (n.ps = n.ps || {});
                    return (
                        e[t] ? (e[t].sleep = 100) : (e[t] = { sleep: 100 }),
                        setTimeout(function () {
                            for (var n in e) e[P](n) && n != t && (e[n].sleep--, !e[n].sleep && delete e[n]);
                        }),
                        e[t]
                    );
                }
                function r(t, e, n, r) {
                    return (
                        null == t && (t = e = n = r = 0),
                        null == e && ((e = t.y), (n = t.width), (r = t.height), (t = t.x)),
                        {
                            x: t,
                            y: e,
                            width: n,
                            w: n,
                            height: r,
                            h: r,
                            x2: t + n,
                            y2: e + r,
                            cx: t + n / 2,
                            cy: e + r / 2,
                            r1: O.min(n, r) / 2,
                            r2: O.max(n, r) / 2,
                            r0: O.sqrt(n * n + r * r) / 2,
                            path: C(t, e, n, r),
                            vb: [t, e, n, r].join(" "),
                        }
                    );
                }
                function i() {
                    return this.join(",").replace(I, "$1");
                }
                function o(t) {
                    var e = $(t);
                    return (e.toString = i), e;
                }
                function a(t, e, n, r, i, o, a, s, c) {
                    return null == c ? d(t, e, n, r, i, o, a, s) : l(t, e, n, r, i, o, a, s, p(t, e, n, r, i, o, a, s, c));
                }
                function s(n, r) {
                    function i(t) {
                        return +(+t).toFixed(3);
                    }
                    return t._.cacher(
                        function (t, o, s) {
                            t instanceof e && (t = t.attr("d")), (t = B(t));
                            for (var c, u, f, h, d, p = "", g = {}, m = 0, v = 0, y = t.length; y > v; v++) {
                                if (((f = t[v]), "M" == f[0])) (c = +f[1]), (u = +f[2]);
                                else {
                                    if (((h = a(c, u, f[1], f[2], f[3], f[4], f[5], f[6])), m + h > o)) {
                                        if (r && !g.start) {
                                            if (((d = a(c, u, f[1], f[2], f[3], f[4], f[5], f[6], o - m)), (p += ["C" + i(d.start.x), i(d.start.y), i(d.m.x), i(d.m.y), i(d.x), i(d.y)]), s)) return p;
                                            (g.start = p), (p = ["M" + i(d.x), i(d.y) + "C" + i(d.n.x), i(d.n.y), i(d.end.x), i(d.end.y), i(f[5]), i(f[6])].join()), (m += h), (c = +f[5]), (u = +f[6]);
                                            continue;
                                        }
                                        if (!n && !r) return (d = a(c, u, f[1], f[2], f[3], f[4], f[5], f[6], o - m));
                                    }
                                    (m += h), (c = +f[5]), (u = +f[6]);
                                }
                                p += f.shift() + f;
                            }
                            return (g.end = p), (d = n ? m : r ? g : l(c, u, f[0], f[1], f[2], f[3], f[4], f[5], 1));
                        },
                        null,
                        t._.clone
                    );
                }
                function l(t, e, n, r, i, o, a, s, l) {
                    var c = 1 - l,
                        u = V(c, 3),
                        f = V(c, 2),
                        h = l * l,
                        d = h * l,
                        p = u * t + 3 * f * l * n + 3 * c * l * l * i + d * a,
                        g = u * e + 3 * f * l * r + 3 * c * l * l * o + d * s,
                        m = t + 2 * l * (n - t) + h * (i - 2 * n + t),
                        v = e + 2 * l * (r - e) + h * (o - 2 * r + e),
                        y = n + 2 * l * (i - n) + h * (a - 2 * i + n),
                        x = r + 2 * l * (o - r) + h * (s - 2 * o + r),
                        b = c * t + l * n,
                        w = c * e + l * r,
                        C = c * i + l * a,
                        S = c * o + l * s,
                        k = 90 - (180 * O.atan2(m - y, v - x)) / q;
                    return { x: p, y: g, m: { x: m, y: v }, n: { x: y, y: x }, start: { x: b, y: w }, end: { x: C, y: S }, alpha: k };
                }
                function c(e, n, i, o, a, s, l, c) {
                    t.is(e, "array") || (e = [e, n, i, o, a, s, l, c]);
                    var u = M.apply(null, e);
                    return r(u.min.x, u.min.y, u.max.x - u.min.x, u.max.y - u.min.y);
                }
                function u(t, e, n) {
                    return e >= t.x && e <= t.x + t.width && n >= t.y && n <= t.y + t.height;
                }
                function f(t, e) {
                    return (
                        (t = r(t)),
                        (e = r(e)),
                        u(e, t.x, t.y) ||
                        u(e, t.x2, t.y) ||
                        u(e, t.x, t.y2) ||
                        u(e, t.x2, t.y2) ||
                        u(t, e.x, e.y) ||
                        u(t, e.x2, e.y) ||
                        u(t, e.x, e.y2) ||
                        u(t, e.x2, e.y2) ||
                        (((t.x < e.x2 && t.x > e.x) || (e.x < t.x2 && e.x > t.x)) && ((t.y < e.y2 && t.y > e.y) || (e.y < t.y2 && e.y > t.y)))
                    );
                }
                function h(t, e, n, r, i) {
                    var o = -3 * e + 9 * n - 9 * r + 3 * i,
                        a = t * o + 6 * e - 12 * n + 6 * r;
                    return t * a - 3 * e + 3 * n;
                }
                function d(t, e, n, r, i, o, a, s, l) {
                    null == l && (l = 1), (l = l > 1 ? 1 : 0 > l ? 0 : l);
                    for (
                        var c = l / 2,
                        u = 12,
                        f = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816],
                        d = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472],
                        p = 0,
                        g = 0;
                        u > g;
                        g++
                    ) {
                        var m = c * f[g] + c,
                            v = h(m, t, n, i, a),
                            y = h(m, e, r, o, s),
                            x = v * v + y * y;
                        p += d[g] * O.sqrt(x);
                    }
                    return c * p;
                }
                function p(t, e, n, r, i, o, a, s, l) {
                    if (!(0 > l || d(t, e, n, r, i, o, a, s) < l)) {
                        var c,
                            u = 1,
                            f = u / 2,
                            h = u - f,
                            p = 0.01;
                        for (c = d(t, e, n, r, i, o, a, s, h); U(c - l) > p;) (f /= 2), (h += (l > c ? 1 : -1) * f), (c = d(t, e, n, r, i, o, a, s, h));
                        return h;
                    }
                }
                function g(t, e, n, r, i, o, a, s) {
                    if (!(R(t, n) < D(i, a) || D(t, n) > R(i, a) || R(e, r) < D(o, s) || D(e, r) > R(o, s))) {
                        var l = (t * r - e * n) * (i - a) - (t - n) * (i * s - o * a),
                            c = (t * r - e * n) * (o - s) - (e - r) * (i * s - o * a),
                            u = (t - n) * (o - s) - (e - r) * (i - a);
                        if (u) {
                            var f = l / u,
                                h = c / u,
                                d = +f.toFixed(2),
                                p = +h.toFixed(2);
                            if (
                                !(
                                    d < +D(t, n).toFixed(2) ||
                                    d > +R(t, n).toFixed(2) ||
                                    d < +D(i, a).toFixed(2) ||
                                    d > +R(i, a).toFixed(2) ||
                                    p < +D(e, r).toFixed(2) ||
                                    p > +R(e, r).toFixed(2) ||
                                    p < +D(o, s).toFixed(2) ||
                                    p > +R(o, s).toFixed(2)
                                )
                            )
                                return { x: f, y: h };
                        }
                    }
                }
                function m(t, e, n) {
                    var r = c(t),
                        i = c(e);
                    if (!f(r, i)) return n ? 0 : [];
                    for (var o = d.apply(0, t), a = d.apply(0, e), s = ~~(o / 8), u = ~~(a / 8), h = [], p = [], m = {}, v = n ? 0 : [], y = 0; s + 1 > y; y++) {
                        var x = l.apply(0, t.concat(y / s));
                        h.push({ x: x.x, y: x.y, t: y / s });
                    }
                    for (y = 0; u + 1 > y; y++) (x = l.apply(0, e.concat(y / u))), p.push({ x: x.x, y: x.y, t: y / u });
                    for (y = 0; s > y; y++)
                        for (var b = 0; u > b; b++) {
                            var w = h[y],
                                C = h[y + 1],
                                S = p[b],
                                k = p[b + 1],
                                E = U(C.x - w.x) < 0.001 ? "y" : "x",
                                T = U(k.x - S.x) < 0.001 ? "y" : "x",
                                _ = g(w.x, w.y, C.x, C.y, S.x, S.y, k.x, k.y);
                            if (_) {
                                if (m[_.x.toFixed(4)] == _.y.toFixed(4)) continue;
                                m[_.x.toFixed(4)] = _.y.toFixed(4);
                                var j = w.t + U((_[E] - w[E]) / (C[E] - w[E])) * (C.t - w.t),
                                    M = S.t + U((_[T] - S[T]) / (k[T] - S[T])) * (k.t - S.t);
                                j >= 0 && 1 >= j && M >= 0 && 1 >= M && (n ? v++ : v.push({ x: _.x, y: _.y, t1: j, t2: M }));
                            }
                        }
                    return v;
                }
                function v(t, e) {
                    return x(t, e);
                }
                function y(t, e) {
                    return x(t, e, 1);
                }
                function x(t, e, n) {
                    (t = B(t)), (e = B(e));
                    for (var r, i, o, a, s, l, c, u, f, h, d = n ? 0 : [], p = 0, g = t.length; g > p; p++) {
                        var v = t[p];
                        if ("M" == v[0]) (r = s = v[1]), (i = l = v[2]);
                        else {
                            "C" == v[0] ? ((f = [r, i].concat(v.slice(1))), (r = f[6]), (i = f[7])) : ((f = [r, i, r, i, s, l, s, l]), (r = s), (i = l));
                            for (var y = 0, x = e.length; x > y; y++) {
                                var b = e[y];
                                if ("M" == b[0]) (o = c = b[1]), (a = u = b[2]);
                                else {
                                    "C" == b[0] ? ((h = [o, a].concat(b.slice(1))), (o = h[6]), (a = h[7])) : ((h = [o, a, o, a, c, u, c, u]), (o = c), (a = u));
                                    var w = m(f, h, n);
                                    if (n) d += w;
                                    else {
                                        for (var C = 0, S = w.length; S > C; C++) (w[C].segment1 = p), (w[C].segment2 = y), (w[C].bez1 = f), (w[C].bez2 = h);
                                        d = d.concat(w);
                                    }
                                }
                            }
                        }
                    }
                    return d;
                }
                function b(t, e, n) {
                    var r = w(t);
                    return (
                        u(r, e, n) &&
                        x(
                            t,
                            [
                                ["M", e, n],
                                ["H", r.x2 + 10],
                            ],
                            1
                        ) %
                        2 ==
                        1
                    );
                }
                function w(t) {
                    var e = n(t);
                    if (e.bbox) return $(e.bbox);
                    if (!t) return r();
                    t = B(t);
                    for (var i, o = 0, a = 0, s = [], l = [], c = 0, u = t.length; u > c; c++)
                        if (((i = t[c]), "M" == i[0])) (o = i[1]), (a = i[2]), s.push(o), l.push(a);
                        else {
                            var f = M(o, a, i[1], i[2], i[3], i[4], i[5], i[6]);
                            (s = s.concat(f.min.x, f.max.x)), (l = l.concat(f.min.y, f.max.y)), (o = i[5]), (a = i[6]);
                        }
                    var h = D.apply(0, s),
                        d = D.apply(0, l),
                        p = R.apply(0, s),
                        g = R.apply(0, l),
                        m = r(h, d, p - h, g - d);
                    return (e.bbox = $(m)), m;
                }
                function C(t, e, n, r, o) {
                    if (o)
                        return [
                            ["M", +t + +o, e],
                            ["l", n - 2 * o, 0],
                            ["a", o, o, 0, 0, 1, o, o],
                            ["l", 0, r - 2 * o],
                            ["a", o, o, 0, 0, 1, -o, o],
                            ["l", 2 * o - n, 0],
                            ["a", o, o, 0, 0, 1, -o, -o],
                            ["l", 0, 2 * o - r],
                            ["a", o, o, 0, 0, 1, o, -o],
                            ["z"],
                        ];
                    var a = [["M", t, e], ["l", n, 0], ["l", 0, r], ["l", -n, 0], ["z"]];
                    return (a.toString = i), a;
                }
                function S(t, e, n, r, o) {
                    if ((null == o && null == r && (r = n), (t = +t), (e = +e), (n = +n), (r = +r), null != o))
                        var a = Math.PI / 180,
                            s = t + n * Math.cos(-r * a),
                            l = t + n * Math.cos(-o * a),
                            c = e + n * Math.sin(-r * a),
                            u = e + n * Math.sin(-o * a),
                            f = [
                                ["M", s, c],
                                ["A", n, n, 0, +(o - r > 180), 0, l, u],
                            ];
                    else f = [["M", t, e], ["m", 0, -r], ["a", n, r, 0, 1, 1, 0, 2 * r], ["a", n, r, 0, 1, 1, 0, -2 * r], ["z"]];
                    return (f.toString = i), f;
                }
                function k(e) {
                    var r = n(e),
                        a = String.prototype.toLowerCase;
                    if (r.rel) return o(r.rel);
                    (t.is(e, "array") && t.is(e && e[0], "array")) || (e = t.parsePathString(e));
                    var s = [],
                        l = 0,
                        c = 0,
                        u = 0,
                        f = 0,
                        h = 0;
                    "M" == e[0][0] && ((l = e[0][1]), (c = e[0][2]), (u = l), (f = c), h++, s.push(["M", l, c]));
                    for (var d = h, p = e.length; p > d; d++) {
                        var g = (s[d] = []),
                            m = e[d];
                        if (m[0] != a.call(m[0]))
                            switch (((g[0] = a.call(m[0])), g[0])) {
                                case "a":
                                    (g[1] = m[1]), (g[2] = m[2]), (g[3] = m[3]), (g[4] = m[4]), (g[5] = m[5]), (g[6] = +(m[6] - l).toFixed(3)), (g[7] = +(m[7] - c).toFixed(3));
                                    break;
                                case "v":
                                    g[1] = +(m[1] - c).toFixed(3);
                                    break;
                                case "m":
                                    (u = m[1]), (f = m[2]);
                                default:
                                    for (var v = 1, y = m.length; y > v; v++) g[v] = +(m[v] - (v % 2 ? l : c)).toFixed(3);
                            }
                        else {
                            (g = s[d] = []), "m" == m[0] && ((u = m[1] + l), (f = m[2] + c));
                            for (var x = 0, b = m.length; b > x; x++) s[d][x] = m[x];
                        }
                        var w = s[d].length;
                        switch (s[d][0]) {
                            case "z":
                                (l = u), (c = f);
                                break;
                            case "h":
                                l += +s[d][w - 1];
                                break;
                            case "v":
                                c += +s[d][w - 1];
                                break;
                            default:
                                (l += +s[d][w - 2]), (c += +s[d][w - 1]);
                        }
                    }
                    return (s.toString = i), (r.rel = o(s)), s;
                }
                function E(e) {
                    var r = n(e);
                    if (r.abs) return o(r.abs);
                    if (((L(e, "array") && L(e && e[0], "array")) || (e = t.parsePathString(e)), !e || !e.length)) return [["M", 0, 0]];
                    var a,
                        s = [],
                        l = 0,
                        c = 0,
                        u = 0,
                        f = 0,
                        h = 0;
                    "M" == e[0][0] && ((l = +e[0][1]), (c = +e[0][2]), (u = l), (f = c), h++, (s[0] = ["M", l, c]));
                    for (var d, p, g = 3 == e.length && "M" == e[0][0] && "R" == e[1][0].toUpperCase() && "Z" == e[2][0].toUpperCase(), m = h, v = e.length; v > m; m++) {
                        if ((s.push((d = [])), (p = e[m]), (a = p[0]), a != a.toUpperCase()))
                            switch (((d[0] = a.toUpperCase()), d[0])) {
                                case "A":
                                    (d[1] = p[1]), (d[2] = p[2]), (d[3] = p[3]), (d[4] = p[4]), (d[5] = p[5]), (d[6] = +p[6] + l), (d[7] = +p[7] + c);
                                    break;
                                case "V":
                                    d[1] = +p[1] + c;
                                    break;
                                case "H":
                                    d[1] = +p[1] + l;
                                    break;
                                case "R":
                                    for (var y = [l, c].concat(p.slice(1)), x = 2, b = y.length; b > x; x++) (y[x] = +y[x] + l), (y[++x] = +y[x] + c);
                                    s.pop(), (s = s.concat(F(y, g)));
                                    break;
                                case "O":
                                    s.pop(), (y = S(l, c, p[1], p[2])), y.push(y[0]), (s = s.concat(y));
                                    break;
                                case "U":
                                    s.pop(), (s = s.concat(S(l, c, p[1], p[2], p[3]))), (d = ["U"].concat(s[s.length - 1].slice(-2)));
                                    break;
                                case "M":
                                    (u = +p[1] + l), (f = +p[2] + c);
                                default:
                                    for (x = 1, b = p.length; b > x; x++) d[x] = +p[x] + (x % 2 ? l : c);
                            }
                        else if ("R" == a) (y = [l, c].concat(p.slice(1))), s.pop(), (s = s.concat(F(y, g))), (d = ["R"].concat(p.slice(-2)));
                        else if ("O" == a) s.pop(), (y = S(l, c, p[1], p[2])), y.push(y[0]), (s = s.concat(y));
                        else if ("U" == a) s.pop(), (s = s.concat(S(l, c, p[1], p[2], p[3]))), (d = ["U"].concat(s[s.length - 1].slice(-2)));
                        else for (var w = 0, C = p.length; C > w; w++) d[w] = p[w];
                        if (((a = a.toUpperCase()), "O" != a))
                            switch (d[0]) {
                                case "Z":
                                    (l = +u), (c = +f);
                                    break;
                                case "H":
                                    l = d[1];
                                    break;
                                case "V":
                                    c = d[1];
                                    break;
                                case "M":
                                    (u = d[d.length - 2]), (f = d[d.length - 1]);
                                default:
                                    (l = d[d.length - 2]), (c = d[d.length - 1]);
                            }
                    }
                    return (s.toString = i), (r.abs = o(s)), s;
                }
                function T(t, e, n, r) {
                    return [t, e, n, r, n, r];
                }
                function _(t, e, n, r, i, o) {
                    var a = 1 / 3,
                        s = 2 / 3;
                    return [a * t + s * n, a * e + s * r, a * i + s * n, a * o + s * r, i, o];
                }
                function j(e, n, r, i, o, a, s, l, c, u) {
                    var f,
                        h = (120 * q) / 180,
                        d = (q / 180) * (+o || 0),
                        p = [],
                        g = t._.cacher(function (t, e, n) {
                            var r = t * O.cos(n) - e * O.sin(n),
                                i = t * O.sin(n) + e * O.cos(n);
                            return { x: r, y: i };
                        });
                    if (u) (k = u[0]), (E = u[1]), (C = u[2]), (S = u[3]);
                    else {
                        (f = g(e, n, -d)), (e = f.x), (n = f.y), (f = g(l, c, -d)), (l = f.x), (c = f.y);
                        var m = (O.cos((q / 180) * o), O.sin((q / 180) * o), (e - l) / 2),
                            v = (n - c) / 2,
                            y = (m * m) / (r * r) + (v * v) / (i * i);
                        y > 1 && ((y = O.sqrt(y)), (r = y * r), (i = y * i));
                        var x = r * r,
                            b = i * i,
                            w = (a == s ? -1 : 1) * O.sqrt(U((x * b - x * v * v - b * m * m) / (x * v * v + b * m * m))),
                            C = (w * r * v) / i + (e + l) / 2,
                            S = (w * -i * m) / r + (n + c) / 2,
                            k = O.asin(((n - S) / i).toFixed(9)),
                            E = O.asin(((c - S) / i).toFixed(9));
                        (k = C > e ? q - k : k), (E = C > l ? q - E : E), 0 > k && (k = 2 * q + k), 0 > E && (E = 2 * q + E), s && k > E && (k -= 2 * q), !s && E > k && (E -= 2 * q);
                    }
                    var T = E - k;
                    if (U(T) > h) {
                        var _ = E,
                            M = l,
                            B = c;
                        (E = k + h * (s && E > k ? 1 : -1)), (l = C + r * O.cos(E)), (c = S + i * O.sin(E)), (p = j(l, c, r, i, o, 0, s, M, B, [E, _, C, S]));
                    }
                    T = E - k;
                    var A = O.cos(k),
                        F = O.sin(k),
                        N = O.cos(E),
                        L = O.sin(E),
                        $ = O.tan(T / 4),
                        P = (4 / 3) * r * $,
                        I = (4 / 3) * i * $,
                        z = [e, n],
                        D = [e + P * F, n - I * A],
                        R = [l + P * L, c - I * N],
                        V = [l, c];
                    if (((D[0] = 2 * z[0] - D[0]), (D[1] = 2 * z[1] - D[1]), u)) return [D, R, V].concat(p);
                    p = [D, R, V].concat(p).join().split(",");
                    for (var G = [], H = 0, X = p.length; X > H; H++) G[H] = H % 2 ? g(p[H - 1], p[H], d).y : g(p[H], p[H + 1], d).x;
                    return G;
                }
                function M(t, e, n, r, i, o, a, s) {
                    for (var l, c, u, f, h, d, p, g, m = [], v = [[], []], y = 0; 2 > y; ++y)
                        if ((0 == y ? ((c = 6 * t - 12 * n + 6 * i), (l = -3 * t + 9 * n - 9 * i + 3 * a), (u = 3 * n - 3 * t)) : ((c = 6 * e - 12 * r + 6 * o), (l = -3 * e + 9 * r - 9 * o + 3 * s), (u = 3 * r - 3 * e)), U(l) < 1e-12)) {
                            if (U(c) < 1e-12) continue;
                            (f = -u / c), f > 0 && 1 > f && m.push(f);
                        } else (p = c * c - 4 * u * l), (g = O.sqrt(p)), 0 > p || ((h = (-c + g) / (2 * l)), h > 0 && 1 > h && m.push(h), (d = (-c - g) / (2 * l)), d > 0 && 1 > d && m.push(d));
                    for (var x, b = m.length, w = b; b--;)
                        (f = m[b]), (x = 1 - f), (v[0][b] = x * x * x * t + 3 * x * x * f * n + 3 * x * f * f * i + f * f * f * a), (v[1][b] = x * x * x * e + 3 * x * x * f * r + 3 * x * f * f * o + f * f * f * s);
                    return (v[0][w] = t), (v[1][w] = e), (v[0][w + 1] = a), (v[1][w + 1] = s), (v[0].length = v[1].length = w + 2), { min: { x: D.apply(0, v[0]), y: D.apply(0, v[1]) }, max: { x: R.apply(0, v[0]), y: R.apply(0, v[1]) } };
                }
                function B(t, e) {
                    var r = !e && n(t);
                    if (!e && r.curve) return o(r.curve);
                    for (
                        var i = E(t),
                        a = e && E(e),
                        s = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
                        l = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
                        c = function (t, e, n) {
                            var r, i;
                            if (!t) return ["C", e.x, e.y, e.x, e.y, e.x, e.y];
                            switch ((!(t[0] in { T: 1, Q: 1 }) && (e.qx = e.qy = null), t[0])) {
                                case "M":
                                    (e.X = t[1]), (e.Y = t[2]);
                                    break;
                                case "A":
                                    t = ["C"].concat(j.apply(0, [e.x, e.y].concat(t.slice(1))));
                                    break;
                                case "S":
                                    "C" == n || "S" == n ? ((r = 2 * e.x - e.bx), (i = 2 * e.y - e.by)) : ((r = e.x), (i = e.y)), (t = ["C", r, i].concat(t.slice(1)));
                                    break;
                                case "T":
                                    "Q" == n || "T" == n ? ((e.qx = 2 * e.x - e.qx), (e.qy = 2 * e.y - e.qy)) : ((e.qx = e.x), (e.qy = e.y)), (t = ["C"].concat(_(e.x, e.y, e.qx, e.qy, t[1], t[2])));
                                    break;
                                case "Q":
                                    (e.qx = t[1]), (e.qy = t[2]), (t = ["C"].concat(_(e.x, e.y, t[1], t[2], t[3], t[4])));
                                    break;
                                case "L":
                                    t = ["C"].concat(T(e.x, e.y, t[1], t[2]));
                                    break;
                                case "H":
                                    t = ["C"].concat(T(e.x, e.y, t[1], e.y));
                                    break;
                                case "V":
                                    t = ["C"].concat(T(e.x, e.y, e.x, t[1]));
                                    break;
                                case "Z":
                                    t = ["C"].concat(T(e.x, e.y, e.X, e.Y));
                            }
                            return t;
                        },
                        u = function (t, e) {
                            if (t[e].length > 7) {
                                t[e].shift();
                                for (var n = t[e]; n.length;) (h[e] = "A"), a && (d[e] = "A"), t.splice(e++, 0, ["C"].concat(n.splice(0, 6)));
                                t.splice(e, 1), (v = R(i.length, (a && a.length) || 0));
                            }
                        },
                        f = function (t, e, n, r, o) {
                            t && e && "M" == t[o][0] && "M" != e[o][0] && (e.splice(o, 0, ["M", r.x, r.y]), (n.bx = 0), (n.by = 0), (n.x = t[o][1]), (n.y = t[o][2]), (v = R(i.length, (a && a.length) || 0)));
                        },
                        h = [],
                        d = [],
                        p = "",
                        g = "",
                        m = 0,
                        v = R(i.length, (a && a.length) || 0);
                        v > m;
                        m++
                    ) {
                        i[m] && (p = i[m][0]),
                            "C" != p && ((h[m] = p), m && (g = h[m - 1])),
                            (i[m] = c(i[m], s, g)),
                            "A" != h[m] && "C" == p && (h[m] = "C"),
                            u(i, m),
                            a && (a[m] && (p = a[m][0]), "C" != p && ((d[m] = p), m && (g = d[m - 1])), (a[m] = c(a[m], l, g)), "A" != d[m] && "C" == p && (d[m] = "C"), u(a, m)),
                            f(i, a, s, l, m),
                            f(a, i, l, s, m);
                        var y = i[m],
                            x = a && a[m],
                            b = y.length,
                            w = a && x.length;
                        (s.x = y[b - 2]), (s.y = y[b - 1]), (s.bx = z(y[b - 4]) || s.x), (s.by = z(y[b - 3]) || s.y), (l.bx = a && (z(x[w - 4]) || l.x)), (l.by = a && (z(x[w - 3]) || l.y)), (l.x = a && x[w - 2]), (l.y = a && x[w - 1]);
                    }
                    return a || (r.curve = o(i)), a ? [i, a] : i;
                }
                function A(t, e) {
                    if (!e) return t;
                    var n, r, i, o, a, s, l;
                    for (t = B(t), i = 0, a = t.length; a > i; i++) for (l = t[i], o = 1, s = l.length; s > o; o += 2) (n = e.x(l[o], l[o + 1])), (r = e.y(l[o], l[o + 1])), (l[o] = n), (l[o + 1] = r);
                    return t;
                }
                function F(t, e) {
                    for (var n = [], r = 0, i = t.length; i - 2 * !e > r; r += 2) {
                        var o = [
                            { x: +t[r - 2], y: +t[r - 1] },
                            { x: +t[r], y: +t[r + 1] },
                            { x: +t[r + 2], y: +t[r + 3] },
                            { x: +t[r + 4], y: +t[r + 5] },
                        ];
                        e
                            ? r
                                ? i - 4 == r
                                    ? (o[3] = { x: +t[0], y: +t[1] })
                                    : i - 2 == r && ((o[2] = { x: +t[0], y: +t[1] }), (o[3] = { x: +t[2], y: +t[3] }))
                                : (o[0] = { x: +t[i - 2], y: +t[i - 1] })
                            : i - 4 == r
                                ? (o[3] = o[2])
                                : r || (o[0] = { x: +t[r], y: +t[r + 1] }),
                            n.push(["C", (-o[0].x + 6 * o[1].x + o[2].x) / 6, (-o[0].y + 6 * o[1].y + o[2].y) / 6, (o[1].x + 6 * o[2].x - o[3].x) / 6, (o[1].y + 6 * o[2].y - o[3].y) / 6, o[2].x, o[2].y]);
                    }
                    return n;
                }
                var N = e.prototype,
                    L = t.is,
                    $ = t._.clone,
                    P = "hasOwnProperty",
                    I = /,?([a-z]),?/gi,
                    z = parseFloat,
                    O = Math,
                    q = O.PI,
                    D = O.min,
                    R = O.max,
                    V = O.pow,
                    U = O.abs,
                    G = s(1),
                    H = s(),
                    X = s(0, 1),
                    W = t._unit2px,
                    Y = {
                        path: function (t) {
                            return t.attr("path");
                        },
                        circle: function (t) {
                            var e = W(t);
                            return S(e.cx, e.cy, e.r);
                        },
                        ellipse: function (t) {
                            var e = W(t);
                            return S(e.cx || 0, e.cy || 0, e.rx, e.ry);
                        },
                        rect: function (t) {
                            var e = W(t);
                            return C(e.x || 0, e.y || 0, e.width, e.height, e.rx, e.ry);
                        },
                        image: function (t) {
                            var e = W(t);
                            return C(e.x || 0, e.y || 0, e.width, e.height);
                        },
                        line: function (t) {
                            return "M" + [t.attr("x1") || 0, t.attr("y1") || 0, t.attr("x2"), t.attr("y2")];
                        },
                        polyline: function (t) {
                            return "M" + t.attr("points");
                        },
                        polygon: function (t) {
                            return "M" + t.attr("points") + "z";
                        },
                        deflt: function (t) {
                            var e = t.node.getBBox();
                            return C(e.x, e.y, e.width, e.height);
                        },
                    };
                (t.path = n),
                    (t.path.getTotalLength = G),
                    (t.path.getPointAtLength = H),
                    (t.path.getSubpath = function (t, e, n) {
                        if (this.getTotalLength(t) - n < 1e-6) return X(t, e).end;
                        var r = X(t, n, 1);
                        return e ? X(r, e).end : r;
                    }),
                    (N.getTotalLength = function () {
                        return this.node.getTotalLength ? this.node.getTotalLength() : void 0;
                    }),
                    (N.getPointAtLength = function (t) {
                        return H(this.attr("d"), t);
                    }),
                    (N.getSubpath = function (e, n) {
                        return t.path.getSubpath(this.attr("d"), e, n);
                    }),
                    (t._.box = r),
                    (t.path.findDotsAtSegment = l),
                    (t.path.bezierBBox = c),
                    (t.path.isPointInsideBBox = u),
                    (t.closest = function (e, n, i, o) {
                        for (
                            var a = 100,
                            s = r(e - a / 2, n - a / 2, a, a),
                            l = [],
                            c = i[0].hasOwnProperty("x")
                                ? function (t) {
                                    return { x: i[t].x, y: i[t].y };
                                }
                                : function (t) {
                                    return { x: i[t], y: o[t] };
                                },
                            f = 0;
                            1e6 >= a && !f;

                        ) {
                            for (var h = 0, d = i.length; d > h; h++) {
                                var p = c(h);
                                if (u(s, p.x, p.y)) {
                                    f++, l.push(p);
                                    break;
                                }
                            }
                            f || ((a *= 2), (s = r(e - a / 2, n - a / 2, a, a)));
                        }
                        if (1e6 != a) {
                            var g,
                                m = 1 / 0;
                            for (h = 0, d = l.length; d > h; h++) {
                                var v = t.len(e, n, l[h].x, l[h].y);
                                m > v && ((m = v), (l[h].len = v), (g = l[h]));
                            }
                            return g;
                        }
                    }),
                    (t.path.isBBoxIntersect = f),
                    (t.path.intersection = v),
                    (t.path.intersectionNumber = y),
                    (t.path.isPointInside = b),
                    (t.path.getBBox = w),
                    (t.path.get = Y),
                    (t.path.toRelative = k),
                    (t.path.toAbsolute = E),
                    (t.path.toCubic = B),
                    (t.path.map = A),
                    (t.path.toString = i),
                    (t.path.clone = o);
            }),
            r.plugin(function (t) {
                var r = Math.max,
                    i = Math.min,
                    o = function (t) {
                        if (((this.items = []), (this.bindings = {}), (this.length = 0), (this.type = "set"), t))
                            for (var e = 0, n = t.length; n > e; e++) t[e] && ((this[this.items.length] = this.items[this.items.length] = t[e]), this.length++);
                    },
                    a = o.prototype;
                (a.push = function () {
                    for (var t, e, n = 0, r = arguments.length; r > n; n++) (t = arguments[n]), t && ((e = this.items.length), (this[e] = this.items[e] = t), this.length++);
                    return this;
                }),
                    (a.pop = function () {
                        return this.length && delete this[this.length--], this.items.pop();
                    }),
                    (a.forEach = function (t, e) {
                        for (var n = 0, r = this.items.length; r > n; n++) if (t.call(e, this.items[n], n) === !1) return this;
                        return this;
                    }),
                    (a.animate = function (r, i, o, a) {
                        "function" != typeof o || o.length || ((a = o), (o = n.linear)), r instanceof t._.Animation && ((a = r.callback), (o = r.easing), (i = o.dur), (r = r.attr));
                        var s = arguments;
                        if (t.is(r, "array") && t.is(s[s.length - 1], "array")) var l = !0;
                        var c,
                            u = function () {
                                c ? (this.b = c) : (c = this.b);
                            },
                            f = 0,
                            h = this,
                            d =
                                a &&
                                function () {
                                    ++f == h.length && a.call(this);
                                };
                        return this.forEach(function (t, n) {
                            e.once("snap.animcreated." + t.id, u), l ? s[n] && t.animate.apply(t, s[n]) : t.animate(r, i, o, d);
                        });
                    }),
                    (a.remove = function () {
                        for (; this.length;) this.pop().remove();
                        return this;
                    }),
                    (a.bind = function (t, e, n) {
                        var r = {};
                        if ("function" == typeof e) this.bindings[t] = e;
                        else {
                            var i = n || t;
                            this.bindings[t] = function (t) {
                                (r[i] = t), e.attr(r);
                            };
                        }
                        return this;
                    }),
                    (a.attr = function (t) {
                        var e = {};
                        for (var n in t) this.bindings[n] ? this.bindings[n](t[n]) : (e[n] = t[n]);
                        for (var r = 0, i = this.items.length; i > r; r++) this.items[r].attr(e);
                        return this;
                    }),
                    (a.clear = function () {
                        for (; this.length;) this.pop();
                    }),
                    (a.splice = function (t, e) {
                        (t = 0 > t ? r(this.length + t, 0) : t), (e = r(0, i(this.length - t, e)));
                        var n,
                            a = [],
                            s = [],
                            l = [];
                        for (n = 2; n < arguments.length; n++) l.push(arguments[n]);
                        for (n = 0; e > n; n++) s.push(this[t + n]);
                        for (; n < this.length - t; n++) a.push(this[t + n]);
                        var c = l.length;
                        for (n = 0; n < c + a.length; n++) this.items[t + n] = this[t + n] = c > n ? l[n] : a[n - c];
                        for (n = this.items.length = this.length -= e - c; this[n];) delete this[n++];
                        return new o(s);
                    }),
                    (a.exclude = function (t) {
                        for (var e = 0, n = this.length; n > e; e++) if (this[e] == t) return this.splice(e, 1), !0;
                        return !1;
                    }),
                    (a.insertAfter = function (t) {
                        for (var e = this.items.length; e--;) this.items[e].insertAfter(t);
                        return this;
                    }),
                    (a.getBBox = function () {
                        for (var t = [], e = [], n = [], o = [], a = this.items.length; a--;)
                            if (!this.items[a].removed) {
                                var s = this.items[a].getBBox();
                                t.push(s.x), e.push(s.y), n.push(s.x + s.width), o.push(s.y + s.height);
                            }
                        return (t = i.apply(0, t)), (e = i.apply(0, e)), (n = r.apply(0, n)), (o = r.apply(0, o)), { x: t, y: e, x2: n, y2: o, width: n - t, height: o - e, cx: t + (n - t) / 2, cy: e + (o - e) / 2 };
                    }),
                    (a.clone = function (t) {
                        t = new o();
                        for (var e = 0, n = this.items.length; n > e; e++) t.push(this.items[e].clone());
                        return t;
                    }),
                    (a.toString = function () {
                        return "Snapâ€˜s set";
                    }),
                    (a.type = "set"),
                    (t.Set = o),
                    (t.set = function () {
                        var t = new o();
                        return arguments.length && t.push.apply(t, Array.prototype.slice.call(arguments, 0)), t;
                    });
            }),
            r.plugin(function (t, n) {
                function r(t) {
                    var e = t[0];
                    switch (e.toLowerCase()) {
                        case "t":
                            return [e, 0, 0];
                        case "m":
                            return [e, 1, 0, 0, 1, 0, 0];
                        case "r":
                            return 4 == t.length ? [e, 0, t[2], t[3]] : [e, 0];
                        case "s":
                            return 5 == t.length ? [e, 1, 1, t[3], t[4]] : 3 == t.length ? [e, 1, 1] : [e, 1];
                    }
                }
                function i(e, n, i) {
                    (n = g(n).replace(/\.{3}|\u2026/g, e)), (e = t.parseTransformString(e) || []), (n = t.parseTransformString(n) || []);
                    for (var o, a, s, l, f = Math.max(e.length, n.length), h = [], d = [], p = 0; f > p; p++) {
                        if (((s = e[p] || r(n[p])), (l = n[p] || r(s)), s[0] != l[0] || ("r" == s[0].toLowerCase() && (s[2] != l[2] || s[3] != l[3])) || ("s" == s[0].toLowerCase() && (s[3] != l[3] || s[4] != l[4])))) {
                            (e = t._.transform2matrix(e, i())), (n = t._.transform2matrix(n, i())), (h = [["m", e.a, e.b, e.c, e.d, e.e, e.f]]), (d = [["m", n.a, n.b, n.c, n.d, n.e, n.f]]);
                            break;
                        }
                        for (h[p] = [], d[p] = [], o = 0, a = Math.max(s.length, l.length); a > o; o++) o in s && (h[p][o] = s[o]), o in l && (d[p][o] = l[o]);
                    }
                    return { from: u(h), to: u(d), f: c(h) };
                }
                function o(t) {
                    return t;
                }
                function a(t) {
                    return function (e) {
                        return +e.toFixed(3) + t;
                    };
                }
                function s(t) {
                    return t.join(" ");
                }
                function l(e) {
                    return t.rgb(e[0], e[1], e[2]);
                }
                function c(t) {
                    var e,
                        n,
                        r,
                        i,
                        o,
                        a,
                        s = 0,
                        l = [];
                    for (e = 0, n = t.length; n > e; e++) {
                        for (o = "[", a = ['"' + t[e][0] + '"'], r = 1, i = t[e].length; i > r; r++) a[r] = "val[" + s++ + "]";
                        (o += a + "]"), (l[e] = o);
                    }
                    return Function("val", "return Snap.path.toString.call([" + l + "])");
                }
                function u(t) {
                    for (var e = [], n = 0, r = t.length; r > n; n++) for (var i = 1, o = t[n].length; o > i; i++) e.push(t[n][i]);
                    return e;
                }
                function f(t) {
                    return isFinite(parseFloat(t));
                }
                function h(e, n) {
                    return !(!t.is(e, "array") || !t.is(n, "array")) && e.toString() == n.toString();
                }
                var d = {},
                    p = /[a-z]+$/i,
                    g = String;
                (d.stroke = d.fill = "colour"),
                    (n.prototype.equal = function (t, n) {
                        return e("snap.util.equal", this, t, n).firstDefined();
                    }),
                    e.on("snap.util.equal", function (e, n) {
                        var r,
                            m,
                            v = g(this.attr(e) || ""),
                            y = this;
                        if (f(v) && f(n)) return { from: parseFloat(v), to: parseFloat(n), f: o };
                        if ("colour" == d[e]) return (r = t.color(v)), (m = t.color(n)), { from: [r.r, r.g, r.b, r.opacity], to: [m.r, m.g, m.b, m.opacity], f: l };
                        if ("viewBox" == e) return (r = this.attr(e).vb.split(" ").map(Number)), (m = n.split(" ").map(Number)), { from: r, to: m, f: s };
                        if ("transform" == e || "gradientTransform" == e || "patternTransform" == e)
                            return (
                                n instanceof t.Matrix && (n = n.toTransformString()),
                                t._.rgTransform.test(n) || (n = t._.svgTransform2string(n)),
                                i(v, n, function () {
                                    return y.getBBox(1);
                                })
                            );
                        if ("d" == e || "path" == e) return (r = t.path.toCubic(v, n)), { from: u(r[0]), to: u(r[1]), f: c(r[0]) };
                        if ("points" == e)
                            return (
                                (r = g(v).split(t._.separator)),
                                (m = g(n).split(t._.separator)),
                                {
                                    from: r,
                                    to: m,
                                    f: function (t) {
                                        return t;
                                    },
                                }
                            );
                        var x = v.match(p),
                            b = g(n).match(p);
                        return x && h(x, b) ? { from: parseFloat(v), to: parseFloat(n), f: a(x) } : { from: this.asPX(e), to: this.asPX(e, n), f: o };
                    });
            }),
            r.plugin(function (t, n, r, i) {
                for (
                    var o = n.prototype,
                    a = "hasOwnProperty",
                    s = ("createTouch" in i.doc),
                    l = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel"],
                    c = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" },
                    u = function (t, e) {
                        var n = "y" == t ? "scrollTop" : "scrollLeft",
                            r = e && e.node ? e.node.ownerDocument : i.doc;
                        return r[(n in r.documentElement) ? "documentElement" : "body"][n];
                    },
                    f = function () {
                        return this.originalEvent.preventDefault();
                    },
                    h = function () {
                        return this.originalEvent.stopPropagation();
                    },
                    d = function (t, e, n, r) {
                        var i = s && c[e] ? c[e] : e,
                            o = function (i) {
                                var o = u("y", r),
                                    l = u("x", r);
                                if (s && c[a](e))
                                    for (var d = 0, p = i.targetTouches && i.targetTouches.length; p > d; d++)
                                        if (i.targetTouches[d].target == t || t.contains(i.targetTouches[d].target)) {
                                            var g = i;
                                            (i = i.targetTouches[d]), (i.originalEvent = g), (i.preventDefault = f), (i.stopPropagation = h);
                                            break;
                                        }
                                var m = i.clientX + l,
                                    v = i.clientY + o;
                                return n.call(r, i, m, v);
                            };
                        return (
                            e !== i && t.addEventListener(e, o, !1),
                            t.addEventListener(i, o, !1),
                            function () {
                                return e !== i && t.removeEventListener(e, o, !1), t.removeEventListener(i, o, !1), !0;
                            }
                        );
                    },
                    p = [],
                    g = function (t) {
                        for (var n, r = t.clientX, i = t.clientY, o = u("y"), a = u("x"), l = p.length; l--;) {
                            if (((n = p[l]), s)) {
                                for (var c, f = t.touches && t.touches.length; f--;)
                                    if (((c = t.touches[f]), c.identifier == n.el._drag.id || n.el.node.contains(c.target))) {
                                        (r = c.clientX), (i = c.clientY), (t.originalEvent ? t.originalEvent : t).preventDefault();
                                        break;
                                    }
                            } else t.preventDefault();
                            var h = n.el.node;
                            h.nextSibling, h.parentNode, h.style.display, (r += a), (i += o), e("snap.drag.move." + n.el.id, n.move_scope || n.el, r - n.el._drag.x, i - n.el._drag.y, r, i, t);
                        }
                    },
                    m = function (n) {
                        t.unmousemove(g).unmouseup(m);
                        for (var r, i = p.length; i--;) (r = p[i]), (r.el._drag = {}), e("snap.drag.end." + r.el.id, r.end_scope || r.start_scope || r.move_scope || r.el, n), e.off("snap.drag.*." + r.el.id);
                        p = [];
                    },
                    v = l.length;
                    v--;

                )
                    !(function (e) {
                        (t[e] = o[e] = function (n, r) {
                            if (t.is(n, "function")) (this.events = this.events || []), this.events.push({ name: e, f: n, unbind: d(this.node || document, e, n, r || this) });
                            else
                                for (var i = 0, o = this.events.length; o > i; i++)
                                    if (this.events[i].name == e)
                                        try {
                                            this.events[i].f.call(this);
                                        } catch (a) { }
                            return this;
                        }),
                            (t["un" + e] = o["un" + e] = function (t) {
                                for (var n = this.events || [], r = n.length; r--;) if (n[r].name == e && (n[r].f == t || !t)) return n[r].unbind(), n.splice(r, 1), !n.length && delete this.events, this;
                                return this;
                            });
                    })(l[v]);
                (o.hover = function (t, e, n, r) {
                    return this.mouseover(t, n).mouseout(e, r || n);
                }),
                    (o.unhover = function (t, e) {
                        return this.unmouseover(t).unmouseout(e);
                    });
                var y = [];
                (o.drag = function (n, r, i, o, a, s) {
                    function l(l, c, f) {
                        (l.originalEvent || l).preventDefault(),
                            (u._drag.x = c),
                            (u._drag.y = f),
                            (u._drag.id = l.identifier),
                            !p.length && t.mousemove(g).mouseup(m),
                            p.push({ el: u, move_scope: o, start_scope: a, end_scope: s }),
                            r && e.on("snap.drag.start." + u.id, r),
                            n && e.on("snap.drag.move." + u.id, n),
                            i && e.on("snap.drag.end." + u.id, i),
                            e("snap.drag.start." + u.id, a || o || u, c, f, l);
                    }
                    function c(t, n, r) {
                        e("snap.draginit." + u.id, u, t, n, r);
                    }
                    var u = this;
                    if (!arguments.length) {
                        var f;
                        return u.drag(
                            function (t, e) {
                                this.attr({ transform: f + (f ? "T" : "t") + [t, e] });
                            },
                            function () {
                                f = this.transform().local;
                            }
                        );
                    }
                    return e.on("snap.draginit." + u.id, l), (u._drag = {}), y.push({ el: u, start: l, init: c }), u.mousedown(c), u;
                }),
                    (o.undrag = function () {
                        for (var n = y.length; n--;) y[n].el == this && (this.unmousedown(y[n].init), y.splice(n, 1), e.unbind("snap.drag.*." + this.id), e.unbind("snap.draginit." + this.id));
                        return !y.length && t.unmousemove(g).unmouseup(m), this;
                    });
            }),
            r.plugin(function (t, n, r) {
                var i = (n.prototype, r.prototype),
                    o = /^\s*url\((.+)\)/,
                    a = String,
                    s = t._.$;
                (t.filter = {}),
                    (i.filter = function (e) {
                        var r = this;
                        "svg" != r.type && (r = r.paper);
                        var i = t.parse(a(e)),
                            o = t._.id(),
                            l = (r.node.offsetWidth, r.node.offsetHeight, s("filter"));
                        return s(l, { id: o, filterUnits: "userSpaceOnUse" }), l.appendChild(i.node), r.defs.appendChild(l), new n(l);
                    }),
                    e.on("snap.util.getattr.filter", function () {
                        e.stop();
                        var n = s(this.node, "filter");
                        if (n) {
                            var r = a(n).match(o);
                            return r && t.select(r[1]);
                        }
                    }),
                    e.on("snap.util.attr.filter", function (r) {
                        if (r instanceof n && "filter" == r.type) {
                            e.stop();
                            var i = r.node.id;
                            i || (s(r.node, { id: r.id }), (i = r.id)), s(this.node, { filter: t.url(i) });
                        }
                        (r && "none" != r) || (e.stop(), this.node.removeAttribute("filter"));
                    }),
                    (t.filter.blur = function (e, n) {
                        null == e && (e = 2);
                        var r = null == n ? e : [e, n];
                        return t.format('<feGaussianBlur stdDeviation="{def}"/>', { def: r });
                    }),
                    (t.filter.blur.toString = function () {
                        return this();
                    }),
                    (t.filter.shadow = function (e, n, r, i, o) {
                        return (
                            "string" == typeof r && ((i = r), (o = i), (r = 4)),
                            "string" != typeof i && ((o = i), (i = "#000")),
                            (i = i || "#000"),
                            null == r && (r = 4),
                            null == o && (o = 1),
                            null == e && ((e = 0), (n = 2)),
                            null == n && (n = e),
                            (i = t.color(i)),
                            t.format(
                                '<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>',
                                { color: i, dx: e, dy: n, blur: r, opacity: o }
                            )
                        );
                    }),
                    (t.filter.shadow.toString = function () {
                        return this();
                    }),
                    (t.filter.grayscale = function (e) {
                        return (
                            null == e && (e = 1),
                            t.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
                                a: 0.2126 + 0.7874 * (1 - e),
                                b: 0.7152 - 0.7152 * (1 - e),
                                c: 0.0722 - 0.0722 * (1 - e),
                                d: 0.2126 - 0.2126 * (1 - e),
                                e: 0.7152 + 0.2848 * (1 - e),
                                f: 0.0722 - 0.0722 * (1 - e),
                                g: 0.2126 - 0.2126 * (1 - e),
                                h: 0.0722 + 0.9278 * (1 - e),
                            })
                        );
                    }),
                    (t.filter.grayscale.toString = function () {
                        return this();
                    }),
                    (t.filter.sepia = function (e) {
                        return (
                            null == e && (e = 1),
                            t.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
                                a: 0.393 + 0.607 * (1 - e),
                                b: 0.769 - 0.769 * (1 - e),
                                c: 0.189 - 0.189 * (1 - e),
                                d: 0.349 - 0.349 * (1 - e),
                                e: 0.686 + 0.314 * (1 - e),
                                f: 0.168 - 0.168 * (1 - e),
                                g: 0.272 - 0.272 * (1 - e),
                                h: 0.534 - 0.534 * (1 - e),
                                i: 0.131 + 0.869 * (1 - e),
                            })
                        );
                    }),
                    (t.filter.sepia.toString = function () {
                        return this();
                    }),
                    (t.filter.saturate = function (e) {
                        return null == e && (e = 1), t.format('<feColorMatrix type="saturate" values="{amount}"/>', { amount: 1 - e });
                    }),
                    (t.filter.saturate.toString = function () {
                        return this();
                    }),
                    (t.filter.hueRotate = function (e) {
                        return (e = e || 0), t.format('<feColorMatrix type="hueRotate" values="{angle}"/>', { angle: e });
                    }),
                    (t.filter.hueRotate.toString = function () {
                        return this();
                    }),
                    (t.filter.invert = function (e) {
                        return (
                            null == e && (e = 1),
                            t.format(
                                '<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>',
                                { amount: e, amount2: 1 - e }
                            )
                        );
                    }),
                    (t.filter.invert.toString = function () {
                        return this();
                    }),
                    (t.filter.brightness = function (e) {
                        return (
                            null == e && (e = 1),
                            t.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', { amount: e })
                        );
                    }),
                    (t.filter.brightness.toString = function () {
                        return this();
                    }),
                    (t.filter.contrast = function (e) {
                        return (
                            null == e && (e = 1),
                            t.format(
                                '<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>',
                                { amount: e, amount2: 0.5 - e / 2 }
                            )
                        );
                    }),
                    (t.filter.contrast.toString = function () {
                        return this();
                    });
            }),
            r.plugin(function (t, e) {
                var n = t._.box,
                    r = t.is,
                    i = /^[^a-z]*([tbmlrc])/i,
                    o = function () {
                        return "T" + this.dx + "," + this.dy;
                    };
                (e.prototype.getAlign = function (t, e) {
                    null == e && r(t, "string") && ((e = t), (t = null)), (t = t || this.paper);
                    var a = t.getBBox ? t.getBBox() : n(t),
                        s = this.getBBox(),
                        l = {};
                    switch (((e = e && e.match(i)), (e = e ? e[1].toLowerCase() : "c"))) {
                        case "t":
                            (l.dx = 0), (l.dy = a.y - s.y);
                            break;
                        case "b":
                            (l.dx = 0), (l.dy = a.y2 - s.y2);
                            break;
                        case "m":
                            (l.dx = 0), (l.dy = a.cy - s.cy);
                            break;
                        case "l":
                            (l.dx = a.x - s.x), (l.dy = 0);
                            break;
                        case "r":
                            (l.dx = a.x2 - s.x2), (l.dy = 0);
                            break;
                        default:
                            (l.dx = a.cx - s.cx), (l.dy = 0);
                    }
                    return (l.toString = o), l;
                }),
                    (e.prototype.align = function (t, e) {
                        return this.transform("..." + this.getAlign(t, e));
                    });
            }),
            r
        );
    }),
    function () {
        var t, e;
        (t = (function () {
            function t(t, e) {
                var n, r;
                if (((this.options = { target: "instafeed", get: "popular", resolution: "thumbnail", sortBy: "none", links: !0, mock: !1, useHttp: !1 }), "object" == typeof t)) for (n in t) (r = t[n]), (this.options[n] = r);
                (this.context = null != e ? e : this), (this.unique = this._genKey());
            }
            return (
                (t.prototype.hasNext = function () {
                    return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0;
                }),
                (t.prototype.next = function () {
                    return !!this.hasNext() && this.run(this.context.nextUrl);
                }),
                (t.prototype.run = function (e) {
                    var n, r, i;
                    if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
                    if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
                    return (
                        null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this),
                        "undefined" != typeof document &&
                        null !== document &&
                        ((i = document.createElement("script")),
                            (i.id = "instafeed-fetcher"),
                            (i.src = e || this._buildUrl()),
                            (n = document.getElementsByTagName("head")),
                            n[0].appendChild(i),
                            (r = "instafeedCache" + this.unique),
                            (window[r] = new t(this.options, this)),
                            (window[r].unique = this.unique)),
                        !0
                    );
                }),
                (t.prototype.parse = function (t) {
                    var e, n, r, i, o, a, s, l, c, u, f, h, d, p, g, m, v, y, x, b, w, C;
                    if ("object" != typeof t) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                        throw new Error("Invalid JSON response");
                    }
                    if (200 !== t.meta.code) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                        throw new Error("Error from Instagram: " + t.meta.error_message);
                    }
                    if (0 === t.data.length) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                        throw new Error("No images were returned from Instagram");
                    }
                    if (
                        (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t),
                            (this.context.nextUrl = ""),
                            null != t.pagination && (this.context.nextUrl = t.pagination.next_url),
                            "none" !== this.options.sortBy)
                    )
                        switch (((p = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-")), (d = "least" === p[0]), p[1])) {
                            case "random":
                                t.data.sort(function () {
                                    return 0.5 - Math.random();
                                });
                                break;
                            case "recent":
                                t.data = this._sortBy(t.data, "created_time", d);
                                break;
                            case "liked":
                                t.data = this._sortBy(t.data, "likes.count", d);
                                break;
                            case "commented":
                                t.data = this._sortBy(t.data, "comments.count", d);
                                break;
                            default:
                                throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
                        }
                    if ("undefined" != typeof document && null !== document && this.options.mock === !1) {
                        if (
                            ((l = t.data),
                                null != this.options.limit && l.length > this.options.limit && (l = l.slice(0, this.options.limit + 1 || 9e9)),
                                (n = document.createDocumentFragment()),
                                null != this.options.filter && "function" == typeof this.options.filter && (l = this._filter(l, this.options.filter)),
                                null != this.options.template && "string" == typeof this.options.template)
                        ) {
                            for (i = "", a = "", u = "", g = document.createElement("div"), m = 0, x = l.length; m < x; m++)
                                (o = l[m]),
                                    (s = o.images[this.options.resolution].url),
                                    this.options.useHttp || (s = s.replace("http://", "//")),
                                    (a = this._makeTemplate(this.options.template, {
                                        model: o,
                                        id: o.id,
                                        link: o.link,
                                        image: s,
                                        caption: this._getObjectProperty(o, "caption.text"),
                                        likes: o.likes.count,
                                        comments: o.comments.count,
                                        location: this._getObjectProperty(o, "location.name"),
                                    })),
                                    (i += a);
                            for (g.innerHTML = i, C = [].slice.call(g.childNodes), v = 0, b = C.length; v < b; v++) (h = C[v]), n.appendChild(h);
                        } else
                            for (y = 0, w = l.length; y < w; y++)
                                (o = l[y]),
                                    (c = document.createElement("img")),
                                    (s = o.images[this.options.resolution].url),
                                    this.options.useHttp || (s = s.replace("http://", "//")),
                                    (c.src = s),
                                    this.options.links === !0 ? ((e = document.createElement("a")), (e.href = o.link), e.appendChild(c), n.appendChild(e)) : n.appendChild(c);
                        document.getElementById(this.options.target).appendChild(n),
                            (r = document.getElementsByTagName("head")[0]),
                            r.removeChild(document.getElementById("instafeed-fetcher")),
                            (f = "instafeedCache" + this.unique),
                            (window[f] = void 0);
                        try {
                            delete window[f];
                        } catch (S) { }
                    }
                    return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0;
                }),
                (t.prototype._buildUrl = function () {
                    var t, e, n;
                    switch (((t = "https://api.instagram.com/v1"), this.options.get)) {
                        case "popular":
                            e = "media/popular";
                            break;
                        case "tagged":
                            if ("string" != typeof this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                            e = "tags/" + this.options.tagName + "/media/recent";
                            break;
                        case "location":
                            if ("number" != typeof this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                            e = "locations/" + this.options.locationId + "/media/recent";
                            break;
                        case "user":
                            if ("number" != typeof this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                            if ("string" != typeof this.options.accessToken) throw new Error("No access token. Use the 'accessToken' option.");
                            e = "users/" + this.options.userId + "/media/recent";
                            break;
                        default:
                            throw new Error("Invalid option for get: '" + this.options.get + "'.");
                    }
                    return (
                        (n = "" + t + "/" + e),
                        (n += null != this.options.accessToken ? "?access_token=" + this.options.accessToken : "?client_id=" + this.options.clientId),
                        null != this.options.limit && (n += "&count=" + this.options.limit),
                        (n += "&callback=instafeedCache" + this.unique + ".parse")
                    );
                }),
                (t.prototype._genKey = function () {
                    var t;
                    return (
                        (t = function () {
                            return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
                        }),
                        "" + t() + t() + t() + t()
                    );
                }),
                (t.prototype._makeTemplate = function (t, e) {
                    var n, r, i, o, a;
                    for (r = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = t; r.test(n);) (i = n.match(r)[1]), (o = null != (a = this._getObjectProperty(e, i)) ? a : ""), (n = n.replace(r, "" + o));
                    return n;
                }),
                (t.prototype._getObjectProperty = function (t, e) {
                    var n, r;
                    for (e = e.replace(/\[(\w+)\]/g, ".$1"), r = e.split("."); r.length;) {
                        if (((n = r.shift()), !(null != t && n in t))) return null;
                        t = t[n];
                    }
                    return t;
                }),
                (t.prototype._sortBy = function (t, e, n) {
                    var r;
                    return (
                        (r = function (t, r) {
                            var i, o;
                            return (i = this._getObjectProperty(t, e)), (o = this._getObjectProperty(r, e)), n ? (i > o ? 1 : -1) : i < o ? 1 : -1;
                        }),
                        t.sort(r.bind(this)),
                        t
                    );
                }),
                (t.prototype._filter = function (t, e) {
                    var n, r, i, o, a;
                    for (
                        n = [],
                        i = function (t) {
                            if (e(t)) return n.push(t);
                        },
                        o = 0,
                        a = t.length;
                        o < a;
                        o++
                    )
                        (r = t[o]), i(r);
                    return n;
                }),
                t
            );
        })()),
            (e = "undefined" != typeof exports && null !== exports ? exports : window),
            (e.Instafeed = t);
    }.call(this);
var core = (function () {
    "use strict";
    function t() {
        return $(window).height();
    }
    function e() {
        return $(".js-project-detail").height();
    }
    return { getWindowHeight: t, getProjectHeight: e };
})(),
    featuredCases = (function () {
        function t() {
            (r = new ScrollMagic.Controller()),
                new ScrollMagic.Scene({ triggerElement: ".overview", triggerHook: 0, offset: -80 }).setPin("#overview").addTo(r),
                $(".js-project-cover-background").height(core.getWindowHeight() - 160),
                setTimeout(function () {
                    e();
                }, 0);
        }
        function e() {
            var t,
                e,
                i = n() - 160;
            $(".js-overview .js-project-cover").each(function (o) {
                (this.id = "project-cover-" + o),
                    new ScrollMagic.Scene({ triggerElement: "#project-cover-" + o, triggerHook: 0, offset: -80, duration: i }).setClassToggle("#project-title-" + o, "show").addTo(r),
                    new ScrollMagic.Scene({ triggerElement: "#project-cover-" + o, duration: n }).addTo(r).on("progress", function (n) {
                        (e = 30 + 40 * n.progress),
                            (t = n.currentTarget.triggerElement()),
                            $(t)
                                .find(".feat-project-title")
                                .css("transform", "translate3d(0, -" + e + "%, 0)");
                    });
            });
        }
        function n() {
            return $(".js-project-cover").height() + 80;
        }
        var r;
        return { init: t };
    })(),
    header = (function () {
        function t() {
            r.click(e), (n = new ScrollMagic.Controller()), $(".js-hero-logo").length && new ScrollMagic.Scene({ triggerElement: ".js-hero-logo", triggerHook: 0, offset: 61 }).setClassToggle(".logo, .logo-main-mobile", "show").addTo(n);
        }
        function e() {
            $(window).width() >= $(window).height() ? o.removeClass("portrait") : o.addClass("portrait"),
                o.hasClass("show")
                    ? ($(".project-detail").css("opacity", "1"),
                        i.text("Menu"),
                        $("html").removeClass("disable-scroll"),
                        $(".js-logo-main-image, .js-logo-main-mobile").removeClass("light"),
                        $(".js-menu").removeClass("show"),
                        $(".js-nav-bg-shape").each(function () {
                            var t = Snap(this).select("path");
                            t.animate({ path: $(t.node).attr("data-inactive") }, 150, mina.easein, function () {
                                o.removeClass("show");
                            });
                        }))
                    : ($(".project-detail").css("opacity", "0.5"),
                        $(".up-icon").css("display", "none"),
                        i.text("Close"),
                        $("html").addClass("disable-scroll"),
                        o.addClass("show"),
                        $(".js-logo-main-image, .js-logo-main-mobile").addClass("light"),
                        $(".js-nav-bg-shape").each(function () {
                            var t = Snap(this).select("path");
                            t.animate({ path: $(t.node).attr("data-active") }, 500, mina.menuEasing, function () {
                                $(".js-menu").not(".show").addClass("show");
                            });
                        }));
        }
        var n,
            r = $(".js-menu-toggle"),
            i = $(".js-menu-toggle-label"),
            o = $(".js-nav-overlay");
        return (
            $(function () {
                $(window).scroll(function () {
                    var t = $(window).scrollTop();
                    t <= 400 ? $(".up-icon").css("display", "none") : $(".up-icon").css("display", "block");
                });
            }),
            { init: t }
        );
    })();
mina.menuEasing = function (t) {
    var e = 1.70158,
        n = 1.1;
    return 0 == t ? 0 : 1 == t ? 1 : ((e = (n / (2 * Math.PI)) * Math.asin(1)), Math.pow(2, -10 * t) * Math.sin(((t - e) * (2 * Math.PI)) / n) + 1);
};
var hero = (function () {
    function t() {
        window.addEventListener(
            "deviceorientation",
            function (t) {
                var e = t.gamma / 80;
                t.beta < 40 && (e = t.gamma / 40), 90 == Math.abs(window.orientation) && (e = t.beta / 40), (window.orientation != -90 && 180 != window.orientation) || (e = -e), r(e);
            },
            !1
        ),
            s.css("height", $(window).height()),
            $(window).on("resize load", i),
            $("body").hasClass("ie") && setTimeout(i, 100),
            $(window).scroll(e),
            s
                .mousemove(function (t) {
                    if (!s.hasClass("inactive")) {
                        var e = t.clientX / s.width(),
                            r = t.clientY / s.height();
                        n(e, r);
                    }
                })
                .mouseleave(function (t) {
                    n(0.5, 0.5);
                }),
            s.click(function (t) {
                var e = t.clientX / s.width(),
                    n = t.clientY / s.height();
                (e <= x.blue.x && n <= x.blue.y) || (e >= x.red.x && n >= x.red.y) || a();
            });
    }
    function e() {
        $(window).scrollTop() > $(window).height() / 5
            ? s.hasClass("inactive") ||
            (s.addClass("inactive"),
                n(0.5, 0.5),
                d.each(function () {
                    var t = Snap(this).select("path");
                    t.stop(), t.animate({ path: $(t.node).attr("data-hidden") }, 500, mina.heroEasing);
                }))
            : s.hasClass("inactive") &&
            (s.removeClass("inactive"),
                d.each(function () {
                    var t = Snap(this).select("path");
                    t.stop(), t.animate({ path: $(t.node).attr("data-mouseout") }, 500, mina.heroEasing);
                })),
            $(window).scrollTop() > s.height()
                ? ($(".js-navbar").addClass("fixed"), $(".js-mobile-header-spacer, .js-mobile-header-background").addClass("visible"))
                : ($(".js-navbar").removeClass("fixed"), $(".js-mobile-header-spacer, .js-mobile-header-background").removeClass("visible"));
    }
    function n(t, e) {
        var n = null;
        t <= x.blue.x && e <= x.blue.y ? (n = "blue") : t >= x.red.x && e >= x.red.y && (n = "red"),
            "blue" == n && "blue" != p ? o(!0, "blue") : "blue" != n && "blue" == p && o(!1, "blue"),
            "red" == n && "red" != p ? o(!0, "red") : "red" != n && "red" == p && o(!1, "red"),
            (p = n);
    }
    function r(t) {
        t <= -0.5 && g > -0.5 ? o(!0, "red") : g <= -0.5 && t > -0.5 && o(!1, "red"), t >= 0.5 && g < 0.5 ? o(!0, "blue") : g >= 0.5 && t < 0.5 && o(!1, "blue"), (g = t);
    }
    function i() {
        if (y == $(window).width() && $(window).scrollTop() > 0) {
            var t = Math.abs($(window).height() - v);
            if (t < 60) return !1;
        }
        e(), s.css("height", $(window).height()), $(window).width() >= $(window).height() ? ((m = "-landscape"), s.removeClass("portrait"), s.addClass("landscape")) : ((m = "-portrait"), s.removeClass("landscape"), s.addClass("portrait"));
        for (var n = 30, r = c.width(), i = c.height(), o = f.width() > h.width() ? f : h, a = o.width(), p = o.height(); ;)
            if (((n += a < r / 2 && p < i / 2 ? 10 : 2), u.css("font-size", n + "px"), (a = o.width()), (p = o.height()), a > r || p > i)) {
                (n -= 2), u.css("font-size", n + "px");
                break;
            }
        f.css({ left: Math.round((r - f.width()) / 2), top: Math.round((i - f.height()) / 2) }), h.css({ left: Math.round((r - h.width()) / 2), top: Math.round((i - h.height()) / 2) });
        var g = s.height() - f.height() - f.offset().top,
            x = (g - l.height()) / 2;
        l.css("bottom", x),
            s.hasClass("fadein") ||
            (s.addClass("fadein"),
                s.hasClass("inactive") ||
                setTimeout(function () {
                    d.each(function () {
                        var t = Snap(this).select("path");
                        t.stop(), t.animate({ path: $(t.node).attr("data-mouseout") }, 500, mina.heroEasing);
                    });
                }, 500)),
            (v = $(window).height()),
            (y = $(window).width());
    }
    function o(t, e) {
        var n = Snap(document.querySelector(".js-hero-shape-" + e + m)).select("path");
        n &&
            (t
                ? (n.stop(), n.animate({ path: $(n.node).attr("data-mouseover") }, 700, mina.heroEasing))
                : (n.stop(), n.animate({ path: $(n.node).attr("data-mouseout") }, 700, mina.heroEasing)));
    }
    function a() {
        d.each(function () {
            var t = Snap(this).select("path");
            t.stop(),
                t.animate({ path: $(t.node).attr("data-alternative") }, 100, mina.easein, function () {
                    t.animate({ path: $(t.node).attr("data-mouseout") }, 4e3, mina.wobbleEasing);
                });
        });
    }
    var s = $(".js-hero"),
        l = $(".js-hero-logo"),
        c = $(".js-hero-titles"),
        u = $(".js-hero-title"),
        f = $(".js-hero-title-blue"),
        h = $(".js-hero-title-red"),
        d = $(".js-hero-shape"),
        p = null,
        g = 0,
        m = "",
        v = null,
        y = null,
        x = { blue: { x: 0.33, y: 0.75 }, red: { x: 0.66, y: 0.25 } };
    return { init: t };
})();
(mina.heroEasing = function (t) {
    var e = 1.70158,
        n = 1.1;
    return 0 == t ? 0 : 1 == t ? 1 : ((e = (n / (2 * Math.PI)) * Math.asin(1)), Math.pow(2, -10 * t) * Math.sin(((t - e) * (2 * Math.PI)) / n) + 1);
}),
    (mina.wobbleEasing = function (t) {
        var e = 1.70158,
            n = 0.1;
        return 0 == t ? 0 : 1 == t ? 1 : ((e = (n / (2 * Math.PI)) * Math.asin(1)), Math.pow(2, -10 * t) * Math.sin(((t - e) * (2 * Math.PI)) / n) + 1);
    });
var mobile = (function () {
    "use strict";
    function t() {
        (n = $(".button, .project-grid .grid-item")),
            n.on("touchstart", function () {
                $(this).addClass("active");
            }),
            n.on("touchend", function () {
                $(this).removeClass("active");
            });
        var t = $(".grid-item");
        t.on("touchstart", function () {
            r = !1;
        }),
            t.on("touchmove", function () {
                r = !0;
            }),
            t.on("touchend", e);
    }
    function e() {
        r || ($(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active"));
    }
    var n, r;
    return { init: t };
})(),
    scrollMagic = (function () {
        function t() {
            n = new ScrollMagic.Controller();
            var t = new ScrollMagic.Scene({ triggerElement: ".project-overview", triggerHook: 0, offset: -80 }).setPin("#project-overview");
            if (!$("body").hasClass("home")) var r = new ScrollMagic.Scene({ triggerElement: "section", triggerHook: 0, offset: -80, duration: e() }).setPin(".sticky-title");
            n.addScene([t, r]);
        }
        function e() {
            return $(".project-detail").height() - 160;
        }
        var n;
        return { init: t, getCdHeight: e };
    })(),
    doc = window.document,
    docElem = doc.documentElement;
"querySelector" in document && "localStorage" in window && "addEventListener" in window && (toggleClass(docElem, "no-js"), toggleClass(docElem, "enhanced")),
    ("ontouchstart" in window || "onmsgesturechange" in window) && (toggleClass(docElem, "no-touch"), toggleClass(docElem, "touch")),
    "CSS" in window && "supports" in window.CSS ? window.CSS.supports("mix-blend-mode", "soft-light") && toggleClass(docElem, "mix-blend-mode") : toggleClass(docElem, "no-mix-blend-mode"),
    document.querySelector(".overview") &&
    imagesLoaded(document.querySelector(".overview"), function (t) {
        scrollMagic.init(), featuredCases.init();
    }),
    $(document).ready(function () {
        if (
            (navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && window.navigator.platform && window.navigator.platform.toLowerCase().indexOf("mac") > -1 && $("html").addClass("firefox-osx"),
                header.init(),
                $(".js-hero").length && hero.init(),
                $("body").hasClass("contact") && googleMaps.init(),
                $(".js-up").click(function () {
                    $("body,html").animate({ scrollTop: 0 }, 500);
                }),
                $("html").hasClass("touch") && mobile.init(),
                $(".js-instafeed").length)
        ) {
            var t = new Instafeed({
                get: "user",
                clientId: "3eaa20e548fc468a8925343b67f75781",
                userId: 1288210289,
                accessToken: "1288210289.3eaa20e.b677320bda03466885c2aa19c99a0a0b",
                resolution: "standard_resolution",
                limit: 8,
                filter: function (t) {
                    return (
                        t.caption && t.caption.text
                            ? ((t.short_caption = t.caption.text),
                                t.short_caption.length > 160 && (t.short_caption = t.caption.text.slice(0, 150) + "..."),
                                (t.short_caption = t.short_caption.replace(/(#[a-zA-Z0-9_-]+)/g, '<strong class="hashtag">$1</strong>')))
                            : (t.short_caption = ""),
                        !0
                    );
                },
                template:
                    '<a href="{{link}}" target="_blank" class="small-6 medium-6 large-3 grid-item instafeed__grid-item"><img class="grid-item-background" src="{{image}}"><div class="instafeed__grid-item__overlay grid-item-overlay"><div class="grid-item-overlay-inner"><p>{{model.short_caption}}</p><p>{{location}}</p></div></div></a>',
            });
            t.run();
        }
    });
$(window).scroll(function () {
    if ($(this).scrollTop() > 194) {
        $('#sticky-navigation-home').addClass('navscroll');
    } else {
        $('#sticky-navigation-home').removeClass('navscroll');
    }
});
$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('#sticky-navigation').addClass('navscroll');
    } else {
        $('#sticky-navigation').removeClass('navscroll');
    }
});
function toggleIcon() {
    var menuToggleIconClasses = document.getElementById("menuswitch").classList;

    if (menuToggleIconClasses.contains("open")) {
        menuToggleIconClasses.remove("open");
    } else {
        menuToggleIconClasses.add("open");
    }
    if (menuToggleIconClasses.contains("close")) {
        menuToggleIconClasses.remove("close");
    } else {
        menuToggleIconClasses.add("close");
    }
}