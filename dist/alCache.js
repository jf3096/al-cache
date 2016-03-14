var ExpiredGC = function () {
    function t() {
        this.gcStack = {}
    }

    return t.prototype.put = function (t, e) {
        return this.clean(), this.put
    }, t.prototype.clean = function () {
        for (var e = this.gcStack; e.length > 0;) {
            var n = e[0].key, i = t.isExpired(n);
            if (!i)return;
            e[0].key = null, e.shift()
        }
    }, t.getCurrentTime = function () {
        return (new Date).getTime()
    }, t.isExpired = function (e) {
        return t.getCurrentTime() > e
    }, t
}(), CacheFactory = function () {
    function t() {
    }

    return t.get = function (e) {
        var n = t.factories[e];
        return n = n || new CacheMachine
    }, t.factories = {}, t
}(), CacheMachine = function () {
    function t() {
        this.stack = {}, this.expiredGC = new ExpiredGC
    }

    return t.hash = function (t) {
        for (var e = 5381, n = t.length; n;)e = 33 * e ^ t.charCodeAt(--n);
        return e >>> 0
    }, t.getExpiredTime = function (e) {
        var n = e || t.setting.maxAge;
        return (new Date).getTime() + n
    }, t.prototype.put = function (e, n, i) {
        var r = t.hash(e), u = t.getExpiredTime(i);
        this.stack[r] = {key: e, value: n, expiredTime: u}, this.expiredGC.put(u, this.stack[r])
    }, t.prototype.get = function (e) {
        var n = t.hash(e), i = this.stack[n], r = ExpiredGC.isExpired(i.expiredTime);
        return r ? i.value : null
    }, t.setting = {maxAge: 60}, t
}();