--  ███████  ███       ███████    ███████   ███████
-- ███       ███      ███   ███  ███       ███     
-- ███       ███      █████████  ███████   ███████ 
-- ███       ███      ███   ███       ███       ███
--  ███████  ███████  ███   ███  ███████   ███████ 

-- Copyright (c) 2011 Enrique García Cota


function _createIndexWrapper(aClass, f) 
    if (f == nil) then 
        return aClass.__methods
    elseif (type(f) == "function") then 
        return function (self, name) 
            local value = aClass.__methods[name]
            
            if (value ~= nil) then 
                return value
            else 
                return f(self, name)
            end
        end
    else 
        return function (self, name) 
            local value = aClass.__methods[name]
            
            if (value ~= nil) then 
                return value
            else 
                return f[name]
            end
        end
    end
end


function _propagateMethod(aClass, name, f) 
    f = (((name == "__index") and _createIndexWrapper(aClass, f)) or f)
    
    aClass.__methods[name] = f
    
    for subclass in pairs(aClass.subclasses) do 
        if (rawget(subclass.__declaredMethods, name) == nil) then 
            _propagateMethod(subclass, name, f)
        end
    end
end


function _declareMethod(aClass, name, f) 
    aClass.__declaredMethods[name] = f
    
    if ((f == nil) and aClass.super) then 
        f = aClass.super.__methods[name]
    end
    
    _propagateMethod(aClass, name, f)
end


function _tostring(self) return "class "..self.name
end

function _call(self, ...) return self:new(...)
end


function _createClass(name, super) 
    local dict = {}
    dict.__index = dict
    
    aClass = {
        name = name, 
        super = super, 
        static = {}, 
        __methods = dict, 
        __declaredMethods = {}, 
        subclasses = setmetatable({}, {__mode = 'k'})
        }
    
    if super then 
        setmetatable(aClass.static, {
            __index = function (_, k) 
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
    
    setmetatable(aClass, {
        __index = aClass.static, 
        __tostring = _tostring, 
        __call = _call, 
        __newindex = _declareMethod
        })
    
    return aClass
end


function _includeMixin(aClass, mixin) 
    assert((type(mixin) == 'table'), "Invalid Mixin table")
    
    for name, meth in pairs(mixin) do 
        if ((name ~= "included") and (name ~= "static")) then 
            aClass[name] = meth
        end
    end
    
    for name, meth in pairs((mixin.static or {})) do 
        aClass.static[name] = meth
    end
    
    if (type(mixin.included) == "function") then mixin:included(aClass) end
    return aClass
end

local DefaultMixin = {
    __tostring = function (self) return "instance of "..tostring(self.class) end, 
    init = function (self, ...) end, 
    isOf = function (self, aClass) 
        assert((type(self) == 'table'), "Use :isOf instead of .isOf")
        return (((type(aClass) == 'table') and (type(self) == 'table')) and ((self.class == aClass) or (((type(self.class) == 'table') and (type(self.class.extends) == 'function')) and self.class:extends(aClass))))
    end, 
    static = {
        allocate = function (self) 
            assert((type(self) == 'table'), "Use :allocate instead of .allocate")
            return setmetatable({class = self}, self.__methods)
        end, 
        new = function (self, ...) 
            assert((type(self) == 'table'), "Use :new instead of .new")
            instance = self:allocate()
            instance:init(...)
            return instance
        end, 
        subclass = function (self, name) 
            assert((type(self) == 'table'), "Use :subclass instead of .subclass")
            assert((type(name) == "string"), "Invalid subclass name")
            
            subclass = _createClass(name, self)
            
            for methodName, f in pairs(self.__methods) do 
                if not ((methodName == "__index") and (type(f) == "table")) then 
                    _propagateMethod(subclass, methodName, f)
                end
            end
            
            subclass.init = function (instance, ...) return self.init(instance, ...) end
            
            self.subclasses[subclass] = true
            self:subclassed(subclass)
            
            return subclass
        end, 
        subclassed = function (self, other) end, 
        extends = function (self, other) 
            assert((type(self) == 'table'), "Use :extends instead of .extends")
            return (((type(other) == 'table') and (type(self.super) == 'table')) and ((self.super == other) or self.super:extends(other)))
        end, 
        include = function (self, ...) 
            assert((type(self) == 'table'), "Use :include instead of .include")
            for _, mixin in ipairs({...}) do _includeMixin(self, mixin) end
            return self
        end
        }
    }

local middleclass = {}


function middleclass.class(name, super) 
    assert((type(name) == 'string'), "Invalid class name")
    return ((super and super:subclass(name)) or _includeMixin(_createClass(name), DefaultMixin))
end

setmetatable(middleclass, {__call = function (_, ...) return middleclass.class(...) end})

return middleclass