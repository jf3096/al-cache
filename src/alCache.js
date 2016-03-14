var ExpiredGC = (function () {
    function ExpiredGC() {
        this.gcStack = {};
    }
    ExpiredGC.prototype.put = function (key, val) {
        var pair = {
            key: key,
            val: val
        };
        this.clean();
        return this.put;
    };
    ExpiredGC.prototype.clean = function () {
        var gcStack = this.gcStack;
        while (gcStack.length > 0) {
            var expiredTime = gcStack[0].key;
            var isExpired = ExpiredGC.isExpired(expiredTime);
            if (isExpired) {
                gcStack[0].key = null;
                gcStack.shift();
            }
            else {
                return;
            }
        }
    };
    ExpiredGC.getCurrentTime = function () {
        return new Date().getTime();
    };
    ExpiredGC.isExpired = function (expiredTime) {
        return ExpiredGC.getCurrentTime() > expiredTime;
    };
    return ExpiredGC;
})();
var CacheFactory = (function () {
    function CacheFactory() {
    }
    CacheFactory.get = function (factoryName) {
        var factoryInstance = CacheFactory.factories[factoryName];
        return factoryInstance = factoryInstance || new CacheMachine();
    };
    CacheFactory.factories = {};
    return CacheFactory;
})();
var CacheMachine = (function () {
    function CacheMachine() {
        this.stack = {};
        this.expiredGC = new ExpiredGC();
    }
    CacheMachine.hash = function (str) {
        var hash = 5381, index = str.length;
        while (index) {
            hash = (hash * 33) ^ str.charCodeAt(--index);
        }
        return hash >>> 0;
    };
    CacheMachine.getExpiredTime = function (maxAgeParam) {
        var maxAge = maxAgeParam || CacheMachine.setting.maxAge;
        return new Date().getTime() + maxAge;
    };
    CacheMachine.prototype.put = function (key, val, maxAge) {
        var hashedKey = CacheMachine.hash(key);
        var expiredTime = CacheMachine.getExpiredTime(maxAge);
        this.stack[hashedKey] = {
            key: key,
            value: val,
            expiredTime: expiredTime
        };
        this.expiredGC.put(expiredTime, this.stack[hashedKey]);
    };
    CacheMachine.prototype.get = function (key) {
        var hashedKey = CacheMachine.hash(key);
        var pair = this.stack[hashedKey];
        var isExpired = ExpiredGC.isExpired(pair.expiredTime);
        return isExpired ? pair.value : null;
    };
    CacheMachine.setting = {
        maxAge: 60
    };
    return CacheMachine;
})();
//# sourceMappingURL=alCache.js.map