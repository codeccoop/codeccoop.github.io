var BackgroundPatterns = (function() {
    function b64url(svgText) {
        var prefix = "data:image/svg+xml;base64,";
        return prefix + btoa(unescape(encodeURIComponent(svgText)));
    }

    function toPNG(xmlSvg, canvas, settings) {
        settings = settings || {}
        settings.backgroundColor = settings.backgroundColor || '#eef5f0';
        canvas.height = xmlSvg.match(/height="([^"]+)"/)[1];
        canvas.width = xmlSvg.match(/width="([^"]+)"/)[1];

        var ctx = canvas.getContext("2d");
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";

        var svg = new Blob([xmlSvg], {
            type: "image/svg+xml;charset=utf-8"
        });
        var url = URL.createObjectURL(svg);
        var img = new Image();

        return new Promise(function(res, rej) {
            try {
                img.onload = function() {
                    ctx.fillStyle = settings.backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();
                    ctx.drawImage(this, 0, 0);
                    URL.revokeObjectURL(url);
                    res(canvas.toDataURL());
                }

                img.src = url;
            } catch (err) {
                rej('failed to convert svg to png ' + err);
            }
        });
    }

    function min(formula) {
        return Math.min.apply(
            null,
            formula
            .replace(/px/gi, "")
            .replace(/^min\(/i, "")
            .replace(/\)$/, "")
            .split(",")
        );
    }

    function max(formula) {
        return Math.max.apply(
            null,
            formula
            .replace(/px/gi, "")
            .replace(/^max\(/i, "")
            .replace(/\)$/, "")
            .split(",")
        );
    }

    function calc(formula) {
        return eval(formula.replace(/px/gi, ""));
    }

    function render(template, viewport) {
        var token = template.match(/calc\(((.(?!\)))+[^\)])\)/i);
        while (token) {
            template = template.replace(
                /calc\((.(?!\)))+.\)/i,
                calc(render(token[1], viewport))
            );
            token = template.match(/calc\(((.(?!\)))+.)\)/i);
        }

        token = template.match(/min\( *((.(?!\)))+.)\)/i);
        while (token) {
            template = template.replace(
                /min\( *(.(?!\)))+.\)/i,
                min(render(token[1], viewport))
            );
            token = template.match(/min\( *((.(?!\)))+.)\)/i);
        }

        token = template.match(/max\( *((.(?!\)))+.)\)/i);
        while (token) {
            template = template.replace(
                /max\( *(.(?!\)))+.\)/i,
                max(render(token[1], viewport))
            );
            token = template.match(/max\( *((.(?!\)))+.)\)/i);
        }

        token = template.match(/\{ *(([0-9](?!vw))*[0-9])vw *\}/i);
        while (token) {
            template = template.replace(
                /\{ *([0-9](?!vw))*[0-9]vw *\}/i,
                token[1] * viewport.width * 0.01
            );
            token = template.match(/\{ *(([0-9](?!vw))*[0-9])vw *\}/i);
        }

        token = template.match(/\{ *(([0-9](?!vh))*[0-9])vh *\}/i);
        while (token) {
            template = template.replace(
                /\{ *([0-9](?!vh))*[0-9]vh *\}/i,
                token[1] * viewport.height * 0.01
            );
            token = template.match(/\{ *(([0-9](?!vh))*[0-9])vh *\}/i);
        }

        return template;
    }

    var debounce = (function() {
        return function(callback, debounce) {
            var now, last, debounced;

            function _callback() {
                debounced = void 0;
                callback();
                // console.log("%cresize", "color: red");
            }

            return function(ev) {
                debounce = debounce || 50;
                clearTimeout(debounced);
                now = Date.now();
                if (last === void 0) {
                    _callback();
                    last = now;
                } else if (now - last > debounce) {
                    _callback();
                    last = now;
                } else {
                    debounced = setTimeout(_callback, now - last);
                }
            };
        };
    })();

    var _settingsBoilerplate = {
        isMobile: true
    }

    function BackgroundPatterns(page, settings) {
        var self = this;
        this.page = page;
        this.settings = {};
        settings = settings || {};
        Object.keys(_settingsBoilerplate).forEach(function(k) {
            self.settings[k] = Object.prototype.hasOwnProperty.call(settings, k) ? settings[k] : _settingsBoilerplate[k];
        });

        var self = this;
        Object.defineProperty(this, "viewport", {
            get: function() {
                if (self.node) {
                    return {
                        width: this.node.offsetWidth,
                        height: this.node.offsetHeight,
                    };
                } else {
                    return {
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                }
            },
        });

        Object.defineProperty(this, "templates", {
            get: function() {
                var bandWidth = self.settings.isMobile ? '72px' : '110px';
                return {
                    home: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        `<path d="M 0, calc(100px + ${bandWidth}) H {82vw} V 100 H 0 Z" fill="#051d41" />` +
                        `<path d="M {82vw}, calc(100px + ${bandWidth}) V 0 H calc({82vw} + ${bandWidth}) V 110 Z" fill="#fe9a00"/>` +
                        `<path d="M 0, calc({95vh} - ${bandWidth}) H {2vw} V {95vh} H 0 Z" fill="#051d41"/>` +
                        `<path d="M {2vw}, calc({95vh} - ${bandWidth}) V {100vh} H calc({2vw} + ${bandWidth}) V {95vh} Z" fill="#fe9a00"/>` +
                        "</svg>",
                    work: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        `<path d="M calc({2vw} + ${bandWidth}), calc({45vh} - ${bandWidth}) V 0 H {2vw} V {45vh} Z" fill="#fe9a00" />` +
                        `<path d="M {2vw}, {45vh} H 0 V calc({45vh} - ${bandWidth}) H {2vw} Z" fill="#051d41" />` +
                        `<path d="M {98vw}, {55vh} V {100vh} H calc({98vw} - ${bandWidth}) V calc({55vh} + ${bandWidth}) Z" fill="#fe9a00" />` +
                        `<path d="M {150vw}, {55vh} H {98vw} V calc({55vh} + ${bandWidth}) H {150vw} Z" fill="#051d41" />` +
                        "</svg>",
                    team: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        `<path d="M calc({98vw} - ${bandWidth}), {98vh} V 0 H calc({98vw}) V calc({98vh} - ${bandWidth}) Z" fill="#fe9a00" />` +
                        `<path d="M calc({98vw} - ${bandWidth}), {98vh} H calc({2vw} + ${bandWidth}) V calc({98vh} - ${bandWidth}) H calc({98vw}) Z" fill="#051d41" />` +
                        `<path d="M {2vw}, {98vh} V {100vh} H calc({2vw} + ${bandWidth}) V calc({98vh} - ${bandWidth}) Z" fill="#fe9a00"/>` +
                        "</svg>",
                    products: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        `<path d="M {92vw}, calc(75px + ${bandWidth}) V 0 H calc({92vw} + ${bandWidth}) V 75 Z" fill="#fe9a00"/>` +
                        `<path d="M 0, calc(75px + ${bandWidth}) H {92vw} V 75 H 0 Z" fill="#184042" />` +
                        `<path d="M {12vw}, calc({98vh} - ${bandWidth}) V {100vh} H calc({12vw} - ${bandWidth}) V {98vh} Z" fill="#fe9a00"/>` +
                        `<path d="M {12vw}, calc({98vh} - ${bandWidth}) H {100vw} V {98vh} H {12vw} Z" fill="#184042" />` +
					'</svg>',
                    workshops: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        `<path d="M {92vw}, calc(75px + ${bandWidth}) V 0 H calc({92vw} + ${bandWidth}) V 75 Z" fill="#fe9a00"/>` +
                        `<path d="M 0, calc(75px + ${bandWidth}) H {92vw} V 75 H 0 Z" fill="#3f2752" />` +
                        `<path d="M {12vw}, calc({98vh} - ${bandWidth}) V {100vh} H calc({12vw} - ${bandWidth}) V {98vh} Z" fill="#fe9a00"/>` +
                        `<path d="M {12vw}, calc({98vh} - ${bandWidth}) H {100vw} V {98vh} H {12vw} Z" fill="#3f2752" />` +
					'</svg>',
                    default: '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M 0, 90 H {5vw} V calc(90px + {8vw}) H 0 Z" fill="#f6ff62" />' +
                        '<path d="M {5vw}, 90 H {90vw} V calc(90px + {8vw}) H {5vw} Z" fill="#005f89" />' + '<path d="M 0, calc(90px + {8vw}) H {5vw} V {50vh} H 0 Z" fill="#f76464" />' +
                        "</svg>",
                };
            },
        });

        var canvas = document.createElement('canvas');
        canvas.style.visibility = "hidden";
        canvas.style.positio = "fixed";
        canvas.style.zIndex = -10;
        canvas.style.pointerEvents = "none";
        this.canvas = canvas;
    }

    BackgroundPatterns.prototype.bind = function(node) {
        this.node = node;
        /* node.style.backgroundImage =
            "url(" + b64url(render(this.templates[this.page], this.viewport)) + ")"; */
        node.style.backgroundPositionX = "0px";
        node.style.backgroundPositionY = "0px";
        node.style.backgroundSize = "cover";
        node.style.backgroundRepeat = "no-repeat";
        toPNG(render(this.templates[this.page], this.viewport), this.canvas)
            .then(function(dataURL) {
                node.style.backgroundImage = "url(" + dataURL + ")";
            }).catch(function(err) {
                console.warn(err);
            });

        var self = this;
        window.addEventListener(
            "resize",
            debounce(function() {
                /* node.style.backgroundImage =
                    "url(" +
                    b64url(render(self.templates[self.page], self.viewport)) +
                    ")"; */
                toPNG(render(self.templates[self.page], self.viewport), self.canvas)
                    .then(function(dataURL) {
                        node.style.backgroundImage = "url(" + dataURL + ")";
                    }).catch(function(err) {
                        console.warn(err);
                    });
            }, 150)
        );
    };

    return BackgroundPatterns;
})();
