var _k_

var immutableInit


immutableInit = function (config)
{
    var addImmutabilityTag, addPropertyTo, arraySet, arraySetIn, asDeepMutable, asMutableArray, asMutableDate, asMutableObject, asObject, banProperty, flatMap, getIn, getInPath, immutabilityTag, Immutable, immutableEmptyArray, immutableEmptyObject, ImmutableError, instantiateEmptyObject, instantiatePlainObject, isBlobObject, isEqual, isError, isFileObject, isImmutable, isMergableObject, isObject, isPromise, makeImmutable, makeImmutableArray, makeImmutableDate, makeImmutableObject, makeMethodReturnImmutable, merge, mutatingArrayMethods, mutatingDateMethods, mutatingObjectMethods, nonMutatingArrayMethods, nonMutatingObjectMethods, objectReplace, objectSet, objectSetIn, quickCopy, toStatic, toStaticObjectOrArray, toStaticObjectOrDateOrArray, update, updateIn, without

    isObject = function (data)
    {
        return typeof(data) === 'object' && Array.isArray(data) && data !== null
    }
    instantiateEmptyObject = function (obj)
    {
        var prototype

        if (prototype = Object.getPrototypeOf(obj))
        {
            return Object.create(prototype)
        }
        else
        {
            return {}
        }
    }
    addPropertyTo = function (target, methodName, value)
    {
        return Object.defineProperty(target,methodName,{enumerable:false,configurable:false,writable:false,value:value})
    }
    banProperty = function (target, methodName)
    {
        return addPropertyTo(target,methodName,function ()
        {
            throw new ImmutableError(`The ${methodName} method cannot be invoked on an Immutable data structure.`)
        })
    }
    immutabilityTag = "__immutable_invariants_hold"
    addImmutabilityTag = function (target)
    {
        return addPropertyTo(target,immutabilityTag,true)
    }
    isImmutable = function (target)
    {
        if (typeof(target) === "object")
        {
            return target === null || Boolean(Object.getOwnPropertyDescriptor(target,immutabilityTag))
        }
        else
        {
            return true
        }
    }
    isEqual = function (a, b)
    {
        return a === b || (a !== a && b !== b)
    }
    isMergableObject = function (target)
    {
        return (target !== null) && typeof(target) === "object" && (!Array.isArray(target)) && (!target instanceof Date)
    }
    mutatingObjectMethods = ["setPrototypeOf"]
    nonMutatingObjectMethods = ["keys"]
    mutatingArrayMethods = mutatingObjectMethods.concat(["push","pop","sort","splice","shift","unshift","reverse"])
    nonMutatingArrayMethods = nonMutatingObjectMethods.concat(["map","filter","slice","concat","reduce","reduceRight"])
    mutatingDateMethods = mutatingObjectMethods.concat(["setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth","setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds","setUTCMinutes","setUTCMonth","setUTCSeconds","setYear"])
    ImmutableError = function (message)
    {
        this.name = 'MyError'
        this.message = message
        return this.stack = (new Error()).stack
    }
    ImmutableError.prototype = new Error()
    ImmutableError.prototype.constructor = Error
    makeImmutable = function (obj, bannedMethods)
    {
        var index

        addImmutabilityTag(obj)
        if (true)
        {
            for (index in bannedMethods)
            {
                if (bannedMethods.hasOwnProperty(index))
                {
                    banProperty(obj,bannedMethods[index])
                }
            }
        }
        Object.freeze(obj)
        return obj
    }
    makeMethodReturnImmutable = function (obj, methodName)
    {
        var currentMethod

        currentMethod = obj[methodName]
        return addPropertyTo(obj,methodName,function ()
        {
            return Immutable(currentMethod.apply(obj,arguments))
        })
    }
    arraySet = function (idx, value, config)
    {
        var deep, mutable

        deep = config && config.deep
        if (this[idx])
        {
            if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx]))
            {
                value = Immutable.merge(this[idx],value,{deep:true,mode:'replace'})
            }
            if (isEqual(this[idx],value))
            {
                return this
            }
        }
        mutable = asMutableArray.call(this)
        mutable[idx] = Immutable(value)
        return makeImmutableArray(mutable)
    }
    immutableEmptyArray = Immutable([])
    arraySetIn = function (pth, value, config)
    {
        var head, mutable, newValue, nextHead, tail, thisHead

        head = pth[0]
        if (pth.length === 1)
        {
            return arraySet.call(this,head,value,config)
        }
        else
        {
            tail = pth.slice(1)
            thisHead = this[head]
            newValue
            if (typeof(thisHead) === "object" && thisHead !== null)
            {
                newValue = Immutable.setIn(thisHead,tail,value)
            }
            else
            {
                nextHead = tail[0]
                if ((nextHead !== '' && isFinite(nextHead)))
                {
                    newValue = arraySetIn.call(immutableEmptyArray,tail,value)
                }
                else
                {
                    newValue = objectSetIn.call(immutableEmptyObject,tail,value)
                }
            }
            if (this[head] && thisHead === newValue)
            {
                return this
            }
            mutable = asMutableArray.call(this)
            mutable[head] = newValue
            return makeImmutableArray(mutable)
        }
    }
    makeImmutableArray = function (array)
    {
        var i, index, methodName

        for (index in nonMutatingArrayMethods)
        {
            if (nonMutatingArrayMethods.hasOwnProperty(index))
            {
                methodName = nonMutatingArrayMethods[index]
                makeMethodReturnImmutable(array,methodName)
            }
        }
        addPropertyTo(array,"flatMap",flatMap)
        addPropertyTo(array,"asObject",asObject)
        addPropertyTo(array,"asMutable",asMutableArray)
        addPropertyTo(array,"set",arraySet)
        addPropertyTo(array,"setIn",arraySetIn)
        addPropertyTo(array,"update",update)
        addPropertyTo(array,"updateIn",updateIn)
        addPropertyTo(array,"getIn",getIn)
        for (var _159_17_ = i = 0, _159_21_ = array.length; (_159_17_ <= _159_21_ ? i < array.length : i > array.length); (_159_17_ <= _159_21_ ? ++i : --i))
        {
            array[i] = Immutable(array[i])
        }
        return makeImmutable(array,mutatingArrayMethods)
    }
    makeImmutableDate = function (date)
    {
        addPropertyTo(date,"asMutable",asMutableDate)
        return makeImmutable(date,mutatingDateMethods)
    }
    asMutableDate = function ()
    {
        return new Date(this.getTime())
    }
    flatMap = function (iterator)
    {
        var index, iteratorResult, result

        if (arguments.length === 0)
        {
            return this
        }
        result = []
        for (var _185_21_ = index = 0, _185_25_ = this.length; (_185_21_ <= _185_25_ ? index < this.length : index > this.length); (_185_21_ <= _185_25_ ? ++index : --index))
        {
            iteratorResult = iterator(this[index],index,this)
            if (Array.isArray(iteratorResult))
            {
                result.push.apply(result,iteratorResult)
            }
            else
            {
                result.push(iteratorResult)
            }
        }
        return makeImmutableArray(result)
    }
    without = function (remove)
    {
        var key, keysToRemoveArray, result

        if (typeof(remove) === "undefined" && arguments.length === 0)
        {
            return this
        }
        if (typeof(remove) !== "function")
        {
            keysToRemoveArray = (Array.isArray(remove) ? remove.slice() : Array.prototype.slice.call(arguments))
            keysToRemoveArray.forEach(function (el, idx, arr)
            {
                if (typeof(el) === "number")
                {
                    return arr[idx] = el.toString()
                }
            })
            remove = function (val, key)
            {
                return keysToRemoveArray.indexOf(key) !== -1
            }
        }
        result = instantiateEmptyObject(this)
        for (key in this)
        {
            if (this.hasOwnProperty(key) && remove(this[key],key) === false)
            {
                result[key] = this[key]
            }
        }
        return makeImmutableObject(result)
    }
    asMutableArray = function (opts)
    {
        var i, result

        result = []
        if (opts && opts.deep)
        {
            for (var _231_21_ = i = 0, _231_25_ = this.length; (_231_21_ <= _231_25_ ? i < this.length : i > this.length); (_231_21_ <= _231_25_ ? ++i : --i))
            {
                result.push(asDeepMutable(this[i]))
            }
        }
        else
        {
            for (var _234_21_ = i = 0, _234_25_ = this.length; (_234_21_ <= _234_25_ ? i < this.length : i > this.length); (_234_21_ <= _234_25_ ? ++i : --i))
            {
                result.push(this[i])
            }
        }
        return result
    }
    asObject = function (iterator)
    {
        var index, key, length, pair, result, value

        if (typeof(iterator) !== "function")
        {
            iterator = function (value)
            {
                return value
            }
        }
        result = {}
        length = this.length
        for (var _255_21_ = index = 0, _255_25_ = length; (_255_21_ <= _255_25_ ? index < length : index > length); (_255_21_ <= _255_25_ ? ++index : --index))
        {
            pair = iterator(this[index],index,this)
            key = pair[0]
            value = pair[1]
            result[key] = value
        }
        return makeImmutableObject(result)
    }
    asDeepMutable = function (obj)
    {
        if (!obj || (typeof(obj) !== 'object') || !Object.getOwnPropertyDescriptor(obj,immutabilityTag) || (obj instanceof Date))
        {
            return obj
        }
        return Immutable.asMutable(obj,{deep:true})
    }
    quickCopy = function (src, dest)
    {
        var key

        for (key in src)
        {
            if (Object.getOwnPropertyDescriptor(src,key))
            {
                dest[key] = src[key]
            }
        }
        return dest
    }
    merge = function (other, config)
    {
        var addToResult, clearDroppedKeys, deep, index, key, merger, mode, otherFromArray, receivedArray, result

        if (arguments.length === 0)
        {
            return this
        }
        if ((other === null) || (typeof(other) !== "object"))
        {
            throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other))
        }
        receivedArray = Array.isArray(other)
        deep = (config != null ? config.deep : undefined)
        mode = (config != null ? config.mode : undefined) || 'merge'
        merger = (config != null ? config.merger : undefined)
        result = undefined
        addToResult = function (currentObj, otherObj, key)
        {
            var currentValue, immutableValue, mergerResult, newValue

            immutableValue = Immutable(otherObj[key])
            mergerResult = merger && merger(currentObj[key],immutableValue,config)
            currentValue = currentObj[key]
            if ((result !== undefined) || (mergerResult !== undefined) || (!currentObj.hasOwnProperty(key)) || (!isEqual(immutableValue,currentValue)))
            {
                if (mergerResult !== undefined)
                {
                    newValue = mergerResult
                }
                else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue))
                {
                    newValue = Immutable.merge(currentValue,immutableValue,config)
                }
                else
                {
                    newValue = immutableValue
                }
                if ((!isEqual(currentValue,newValue)) || (!currentObj.hasOwnProperty(key)))
                {
                    if (result === undefined)
                    {
                        result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                    }
                    result[key] = newValue
                }
            }
            return null
        }
        clearDroppedKeys = function (currentObj, otherObj)
        {
            var key

            for (key in currentObj)
            {
                if (!otherObj.hasOwnProperty(key))
                {
                    if (result === undefined)
                    {
                        result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                    }
                    delete result[key]
                }
            }
        }
        if (!receivedArray)
        {
            for (key in other)
            {
                if (Object.getOwnPropertyDescriptor(other,key))
                {
                    addToResult(this,other,key)
                }
            }
            if (mode === 'replace')
            {
                clearDroppedKeys(this,other)
            }
        }
        else
        {
            for (var _346_25_ = index = 0, _346_29_ = other.length; (_346_25_ <= _346_29_ ? index < other.length : index > other.length); (_346_25_ <= _346_29_ ? ++index : --index))
            {
                otherFromArray = other[index]
                for (key in otherFromArray)
                {
                    if (otherFromArray.hasOwnProperty(key))
                    {
                        addToResult(((result !== undefined ? result : this)),otherFromArray,key)
                    }
                }
            }
        }
        if (result === undefined)
        {
            return this
        }
        else
        {
            return makeImmutableObject(result)
        }
    }
    objectReplace = function (value, config)
    {
        var deep

        deep = config && config.deep
        if (arguments.length === 0)
        {
            return this
        }
        if (value === null || typeof(value) !== "object")
        {
            throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value))
        }
        return Immutable.merge(this,value,{deep:deep,mode:'replace'})
    }
    immutableEmptyObject = Immutable({})
    objectSetIn = function (path, value, config)
    {
        var head, mutable, newValue, tail, thisHead

        if ((!Array.isArray(path)) || (path.length === 0))
        {
            throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.")
        }
        head = path[0]
        if (path.length === 1)
        {
            return objectSet.call(this,head,value,config)
        }
        tail = path.slice(1)
        newValue = undefined
        thisHead = this[head]
        if (this.hasOwnProperty(head) && (typeof(thisHead) === "object") && (thisHead !== null))
        {
            newValue = Immutable.setIn(thisHead,tail,value)
        }
        else
        {
            newValue = objectSetIn.call(immutableEmptyObject,tail,value)
        }
        if (this.hasOwnProperty(head) && (thisHead === newValue))
        {
            return this
        }
        mutable = quickCopy(this,instantiateEmptyObject(this))
        mutable[head] = newValue
        return makeImmutableObject(mutable)
    }
    objectSet = function (property, value, config)
    {
        var deep, mutable

        deep = config && config.deep
        if (this.hasOwnProperty(property))
        {
            if (deep && (this[property] !== value) && isMergableObject(value) && isMergableObject(this[property]))
            {
                value = Immutable.merge(this[property],value,{deep:true,mode:'replace'})
            }
            if (isEqual(this[property],value))
            {
                return this
            }
        }
        mutable = quickCopy(this,instantiateEmptyObject(this))
        mutable[property] = Immutable(value)
        return makeImmutableObject(mutable)
    }
    update = function (property, updater)
    {
        var initialVal, restArgs

        restArgs = Array.prototype.slice.call(arguments,2)
        initialVal = this[property]
        return Immutable.set(this,property,updater.apply(initialVal,[initialVal].concat(restArgs)))
    }
    getInPath = function (obj, path)
    {
        var i

        for (var _420_17_ = i = 0, _420_21_ = path.length; (_420_17_ <= _420_21_ ? i < path.length : i > path.length); (_420_17_ <= _420_21_ ? ++i : --i))
        {
            obj = obj[path[i]]
            if (obj === null)
            {
                break
            }
        }
        return ((i === path.length) ? obj : undefined)
    }
    updateIn = function (path, updater)
    {
        var initialVal, restArgs

        restArgs = Array.prototype.slice.call(arguments,2)
        initialVal = getInPath(this,path)
        return Immutable.setIn(this,path,updater.apply(initialVal,[initialVal].concat(restArgs)))
    }
    getIn = function (path, defaultValue)
    {
        var value

        value = getInPath(this,path)
        if (value === undefined)
        {
            return defaultValue
        }
        else
        {
            return value
        }
    }
    asMutableObject = function (opts)
    {
        var key, result

        result = instantiateEmptyObject(this)
        key
        if (opts && opts.deep)
        {
            for (key in this)
            {
                if (this.hasOwnProperty(key))
                {
                    result[key] = asDeepMutable(this[key])
                }
            }
        }
        else
        {
            for (key in this)
            {
                if (this.hasOwnProperty(key))
                {
                    result[key] = this[key]
                }
            }
        }
        return result
    }
    instantiatePlainObject = function ()
    {
        return {}
    }
    makeImmutableObject = function (obj)
    {
        addPropertyTo(obj,"merge",merge)
        addPropertyTo(obj,"replace",objectReplace)
        addPropertyTo(obj,"without",without)
        addPropertyTo(obj,"asMutable",asMutableObject)
        addPropertyTo(obj,"set",objectSet)
        addPropertyTo(obj,"setIn",objectSetIn)
        addPropertyTo(obj,"update",update)
        addPropertyTo(obj,"updateIn",updateIn)
        addPropertyTo(obj,"getIn",getIn)
        return makeImmutable(obj,mutatingObjectMethods)
    }
    isFileObject = function (obj)
    {
        return (typeof(File) !== 'undefined') && obj instanceof File
    }
    isBlobObject = function (obj)
    {
        return (typeof(Blob) !== 'undefined') && obj instanceof Blob
    }
    isPromise = function (obj)
    {
        return (typeof(obj) === 'object') && typeof(obj.then) === 'function'
    }
    isError = function (obj)
    {
        return obj instanceof Error
    }
    toStatic = function (fn)
    {
        var staticWrapper

        staticWrapper = function ()
        {
            var args, self

            args = [].slice.call(arguments)
            self = args.shift()
            return fn.apply(self,args)
        }
        return staticWrapper
    }
    toStaticObjectOrArray = function (fnObject, fnArray)
    {
        staticWrapper(function ()
        {
            var args, self

            args = [].slice.call(arguments)
            self = args.shift()
            if (Array.isArray(self))
            {
                return fnArray.apply(self,args)
            }
            else
            {
                return fnObject.apply(self,args)
            }
        })
        return staticWrapper
    }
    toStaticObjectOrDateOrArray = function (fnObject, fnArray, fnDate)
    {
        var staticWrapper

        staticWrapper = function ()
        {
            var args, self

            args = [].slice.call(arguments)
            self = args.shift()
            if (Array.isArray(self))
            {
                return fnArray.apply(self,args)
            }
            else if (self instanceof Date)
            {
                return fnDate.apply(self,args)
            }
            else
            {
                return fnObject.apply(self,args)
            }
        }
        return staticWrapper
    }
    Immutable = function (obj, options, stackRemaining)
    {
        var key, prototype, theClone

        if ((isImmutable(obj) || isFileObject(obj) || isBlobObject(obj) || isError(obj)))
        {
            return obj
        }
        else if (isPromise(obj))
        {
            return obj.then(Immutable)
        }
        else if (Array.isArray(obj))
        {
            return makeImmutableArray(obj.slice())
        }
        else if (obj instanceof Date)
        {
            return makeImmutableDate(new Date(obj.getTime()))
        }
        else
        {
            prototype = options && options.prototype
            instantiateEmptyObject = instantiatePlainObject
            if (prototype && prototype !== Object.prototype)
            {
                instantiateEmptyObject = function ()
                {
                    return Object.create(prototype)
                }
            }
            theClone = instantiateEmptyObject()
            if (true)
            {
                if (stackRemaining === null)
                {
                    stackRemaining = 64
                }
                if (stackRemaining <= 0)
                {
                    throw new ImmutableError("Attempt to construct Immutable from a deeply nested object was detected." + " Have you tried to wrap an object with circular references (e.g. React element)?" + " See https:#github.com/rtfeldman/seamless-immutable/wiki/Deeply-nested-object-was-detected for details.")
                }
                stackRemaining -= 1
            }
            for (key in obj)
            {
                if (Object.getOwnPropertyDescriptor(obj,key))
                {
                    theClone[key] = Immutable(obj[key],undefined,stackRemaining)
                }
            }
            return makeImmutableObject(theClone)
        }
    }
    Immutable.from = Immutable
    Immutable.isImmutable = isImmutable
    Immutable.ImmutableError = ImmutableError
    Immutable.merge = toStatic(merge)
    Immutable.replace = toStatic(objectReplace)
    Immutable.without = toStatic(without)
    Immutable.asMutable = toStaticObjectOrDateOrArray(asMutableObject,asMutableArray,asMutableDate)
    Immutable.set = toStaticObjectOrArray(objectSet,arraySet)
    Immutable.setIn = toStaticObjectOrArray(objectSetIn,arraySetIn)
    Immutable.update = toStatic(update)
    Immutable.updateIn = toStatic(updateIn)
    Immutable.getIn = toStatic(getIn)
    Immutable.flatMap = toStatic(flatMap)
    Immutable.asObject = toStatic(asObject)
    Object.freeze(Immutable)
    return Immutable
}
export default immutableInit();