if (this.requirejs !== undefined) {
    this.requirejs.config({
        appDir: ".",
        baseUrl: "js",
        paths: {
            'fingerprint2': ['//cdn.jsdelivr.net/fingerprintjs2/1.4.1/fingerprint2.min'],
        },
        shim: {
            'fingerprint2': ['requirejs']
        }
    });

    require(['fingerprint2'], function(Fingerprint2) {
        (function(callback) {
            var fingerprintOptions = {
                excludeScreenResolution: true,
                excludeColorDepth: false,
                excludeAvailableScreenResolution: true,
                excludePixelRatio: true,
                excludeWebGL: false,
                excludeCanvas: false,
            };
            new Fingerprint2(fingerprintOptions).get(function(result, components) {
                callback(result);
            });
        })(function(fingerprint) {
            var el = document.createElement('script');
            el.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid=' + document.sezzleConfig["merchantID"] + '&fingerprint=' + fingerprint
            document.getElementsByTagName('head')[0].appendChild(el);
        });
    }, function(error) {
        (function(callback) {
            callback('');
        })(function(fingerprint) {
            var el = document.createElement('script');
            el.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid=' + document.sezzleConfig["merchantID"] + '&fingerprint=' + fingerprint
            document.getElementsByTagName('head')[0].appendChild(el);
        });
    });

} else {
    (function(callback) {
        var fingerprintOptions = {
            excludeScreenResolution: true,
            excludeColorDepth: false,
            excludeAvailableScreenResolution: true,
            excludePixelRatio: true,
            excludeWebGL: false,
            excludeCanvas: false,
        };
        if (typeof window.Fingerprint2 === 'undefined' || window.Fingerprint2.VERSION != "1.4.1") {
            var script = document.createElement("script")
            script.type = "text/javascript";
            script.src = 'https://cdn.jsdelivr.net/fingerprintjs2/1.4.1/fingerprint2.min.js';
            script.onload = function() {
                if (window.Fingerprint2 === undefined) {
                    callback('');
                } else {
                    new Fingerprint2(fingerprintOptions).get(function(result, components) {
                        callback(result);
                    });
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            new Fingerprint2(fingerprintOptions).get(function(result, components) {
                callback(result);
            });
        }
    })(function(fingerprint) {
        var el = document.createElement('script');
        el.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid=' + document.sezzleConfig["merchantID"] + '&fingerprint=' + fingerprint
        document.getElementsByTagName('head')[0].appendChild(el);
    });
}