-- Copyright (c) 2011 Enrique García Cota
local middleclass = {}

function _createIndexWrapper(aClass, f) 
    if (f == nil) then 
        return aClass.__instanceDict
    elseif (type(f) == "function") then 
        return function (self, name) 
            local value = aClass.__instanceDict[name]
            if (value ~= nil) then 
                return value
            else 
                return f(self, name)
            end
        end
    else 
        return function (self, name) 
            local value = aClass.__instanceDict[name]
            if (value ~= nil) then 
                return value
            else 
                return f[name]
            end
        end
    end
end

function _propagateInstanceMethod(aClass, name, f) 
    f = (((name == "__index") and _createIndexWrapper(aClass, f)) or f)
    aClass.__instanceDict[name] = f
    for subclass in pairs(aClass.subclasses) do 
        if (rawget(subclass.__declaredMethods, name) == nil) then 
            _propagateInstanceMethod(subclass, name, f)
        end
    end
end

function _declareInstanceMethod(aClass, name, f) 
    aClass.__declaredMethods[name] = f
    if ((f == nil) and aClass.super) then 
        f = aClass.super.__instanceDict[name]
    end
    _propagateInstanceMethod(aClass, name, f)
end

function _tostring(self) return "class "..self.name
end

function _call(self, ...) return self:new(...)
end

function _createClass(name, super) 
    local dict = {}
    dict.__index = dict
    aClass = {name = name, super = super, static = {}, 
               __instanceDict = dict, __declaredMethods = {}, 
               subclasses = setmetatable({}, {__mode = 'k'})
               }
    if super then 
        setmetatable(aClass.static, {
            function __index(_, k) 
                result = rawget(dict, k)
                if (result == nil) then 
                      return super.static[k]
                end
                return result
            end
            })
    else 
        setmetatable(aClass.static, {__index = function (_, k) return rawget(dict, k) end})
    end
    setmetatable(aClass, {__index = aClass.static, 
                            __tostring = _tostring, 
                            __call = _call, 
                            __newindex = _declareInstanceMethod
                            })
    return aClass
end

function _includeMixin(aClass, mixin) 
    assert((type(mixin) == 'table'), "Invalid Mixin table")
    for name, method in pairs(mixin) do 
        if ((name ~= "included") and (name ~= "static")) then method aClass[name]()
                                                           end end
    end
    for name, method in pairs((mixin.static or {})) do 
        
        method aClass.static[name]()
                     end
    end
    if (type(mixin.included) == "function") then mixin:included(aClass) end
    return aClass
end
local DefaultMixin = {
  __tostring = function (self) return "instance of "..tostring(self.class) end, 
  initialize = function (self, ...) end, 
  function isInstanceOf(self, aClass) 
    return (((type(aClass) == 'table') and (type(self) == 'table')) and ((self.class == aClass) or (((type(self.class) == 'table') and (type(self.class.isSubclassOf) == 'function')) and self.class)), :isSubclassOf(aClass))
  end, 
  static = {
        function allocate(self) 
            assert((type(self) == 'table'), "Use :allocate instead of .allocate")
            return setmetatable({class = self}, self.__instanceDict)
        end, 
        function new(self, ...) 
            assert((type(self) == 'table'), "Use :new instead of .new")
            instance = self:allocate()
            instance:initialize(...)
            return instance
        end, 
        function subclass(self, name) 
            assert((type(self) == 'table'), "Use :subclass instead of .subclass")
            assert((type(name) == "string"), "Invalid subclass name")
            local, subclass = _createClass(name, self)
            for methodName, f in pairs(self.__instanceDict) do 
                if not ((methodName == "__index") and (type(f) == "table")) then 
                    _propagateInstanceMethod(subclass, methodName, f)
                end
            end
            subclass.initialize = function (instance, ...) return self.initialize(instance, ...) end
            self.subclasses[subclass] = true
            self:subclassed(subclass)
            return subclass
        end, 
        function subclassed(self, other)
        end, 
        function isSubclassOf(self, other) 
            return (((type(other) == 'table') and (type(self.super) == 'table')) and ((self.super == other) or self.super:isSubclassOf(other)))
        end, 
        function include(self, ...) 
            assert((type(self) == 'table'), "Use :include instead of .include")
            for _, mixin in ipairs({...}) do _includeMixin(self, mixin) end
            return self
        end
        }
  }

function middleclass.class(name, super) 
    assert((type(name) == 'string'), "Invalid class name")
    return ((super and super:subclass(name)) or _includeMixin(_createClass(name), DefaultMixin))
end
setmetatable(middleclass, {__call = function (_, ...) return middleclass.class(...) end})
return middleclass