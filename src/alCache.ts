interface IKeyValuePair {
    key:string|number;
    value:any;
    expiredTime?:number;
}

interface IExpiredGC {
    gcStack:IKeyValuePair[]
    clean():void;
    put(key:number, val:IKeyValuePair):Function;
}

class ExpiredGC implements IExpiredGC {
    gcStack:IKeyValuePair[] = <IKeyValuePair[]>{};

    public put(key:number, val:IKeyValuePair):Function {
        let pair = {
            key: key,
            val: <IKeyValuePair>val
        };
        this.clean();
        return this.put;
    }

    public clean():void {
        var gcStack = this.gcStack;
        while (gcStack.length > 0) {
            var expiredTime:number = <number>gcStack[0].key;
            var isExpired = ExpiredGC.isExpired(expiredTime);
            if (isExpired) {
                gcStack[0].key = null;
                gcStack.shift();
            }
            else {
                return;
            }
        }
    }

    static getCurrentTime():number {
        return new Date().getTime();
    }

    static isExpired(expiredTime:number):boolean {
        return ExpiredGC.getCurrentTime() > expiredTime
    }
}


class CacheFactory {
    static factories = {};

    static get(factoryName:string):CacheMachine {
        var factoryInstance = CacheFactory.factories[factoryName];
        return factoryInstance = factoryInstance || new CacheMachine();
    }
}

class CacheMachine {
    private stack:IKeyValuePair = <IKeyValuePair>{};
    private expiredGC:IExpiredGC = new ExpiredGC();

    static setting = {
        maxAge: 60
    }

    static hash(str:string):number {
        var hash = 5381,
            index = str.length;

        while (index) {
            hash = (hash * 33) ^ str.charCodeAt(--index);
        }
        return hash >>> 0;
    }

    static getExpiredTime(maxAgeParam?) {
        var maxAge:number = maxAgeParam || CacheMachine.setting.maxAge;
        return new Date().getTime() + maxAge;
    }

    public put(key:string, val:any, maxAge:number) {
        var hashedKey:number = CacheMachine.hash(key);
        var expiredTime:number = CacheMachine.getExpiredTime(maxAge);
        this.stack[hashedKey] = <IKeyValuePair>{
            key: key,
            value: val,
            expiredTime: expiredTime
        }
        this.expiredGC.put(expiredTime, this.stack[hashedKey]);
    }

    public get(key) {
        var hashedKey:number = CacheMachine.hash(key);
        var pair = this.stack[hashedKey];
        var isExpired = ExpiredGC.isExpired(pair.expiredTime);
        return isExpired ? pair.value : null;
    }
}


