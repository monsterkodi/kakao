--  ███████  ███       ███████    ███████   ███████
-- ███       ███      ███   ███  ███       ███     
-- ███       ███      █████████  ███████   ███████ 
-- ███       ███      ███   ███       ███       ███
--  ███████  ███████  ███   ███  ███████   ███████ 

-- Copyright (c) 2011 Enrique García Cota


function _wrapIndex(aClass, f) 
    if (f == nil) then 
        return aClass.__members
    elseif (type(f) == "function") then 
        return function (self, name) 
            local value = aClass.__members[name]
            
            if (value ~= nil) then 
                return value
            else 
                return f(self, name)
            end
        end
    else 
        assert((type(f) == 'table'), "__index not a table")
        return function (self, name) 
            local value = aClass.__members[name]
            
            if (value ~= nil) then 
                return value
            else 
                return f[name]
            end
        end
    end
end


function _wrapMethod(aClass, f) 
    return function (self, ...) 
        assert(((type(self) == "table") and ((self.class == aClass) or self.class:extends(aClass))), "Invalid self: expected " .. aClass.name .. " but got " .. type(self))
        
        return f(self, ...)
    end
end


function _propMember(aClass, name, f) 
    f = (((name == "__index") and _wrapIndex(aClass, f)) or f)
    
    if (type(f) == "function") then 
        aClass.__members[name] = _wrapMethod(aClass, f)
        for subclass in pairs(aClass.subclasses) do 
            if (rawget(subclass.__members, name) == nil) then 
                _propMember(subclass, name, f)
            end
        end
    else 
        aClass.__proto[name] = f
        for subclass in pairs(aClass.subclasses) do 
            if (rawget(subclass.__proto, name) == nil) then 
                _propMember(subclass, name, f)
            end
        end
    end
end


function _newMember(aClass, name, f) 
    if ((f == nil) and aClass.super) then f = aClass.super.__members[name] end
    if ((f == nil) and aClass.super) then f = aClass.super.__proto[name] end
    
    _propMember(aClass, name, f)
end


function _call(self, ...) return self:new(...)
end


function _createClass(name, super) 
    local dict = {}
    dict.__index = dict
    
    local aClass = {
        name = name, 
        super = super, 
        static = {}, 
        __proto = {}, 
        __members = dict, 
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
        __tostring = function (self) return "class " .. self.name end, 
        __call = _call, 
        __newindex = _newMember
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
    isOf = function (self, aClass) 
        assert((type(self) == 'table'), "Use :isOf instead of .isOf")
        return (((type(aClass) == 'table') and (type(self) == 'table')) and ((self.class == aClass) or (((type(self.class) == 'table') and (type(self.class.extends) == 'function')) and self.class:extends(aClass))))
    end, 
    static = {
        alloc = function (self) 
            assert((type(self) == 'table'), "Use :alloc instead of .alloc")
            instance = {class = self}
            for k, m in pairs(self.__proto) do 
                instance[k] = m
            end
            
            return setmetatable(instance, self.__members)
        end, 
        new = function (self, ...) 
            assert((type(self) == 'table'), "Use :new instead of .new")
            instance = self:alloc()
            if (type(instance.init) == "function") then 
                return instance:init(...)
            end
            
            return instance
        end, 
        subclass = function (self, name) 
            assert((type(self) == 'table'), "Use :subclass instead of .subclass")
            assert((type(name) == "string"), "Invalid subclass name")
            
            subclass = _createClass(name, self)
            
            for name, f in pairs(self.__members) do 
                if not ((name == "__index") and (type(f) == "table")) then 
                    _propMember(subclass, name, f)
                end
            end
            
            for name, f in pairs(self.__proto) do 
                if not ((name == "__index") and (type(f) == "table")) then 
                    _propMember(subclass, name, f)
                end
            end
            
            subclass.init = function (instance, ...) return self.init(instance, ...) end
            
            self.subclasses[subclass] = true
            
            return subclass
        end, 
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

local middleclass = {
    class = function (name, super) 
        assert((type(name) == 'string'), "Invalid class name")
        return ((super and super:subclass(name)) or _includeMixin(_createClass(name), DefaultMixin))
    end
    }

setmetatable(middleclass, {__call = function (_, ...) return middleclass.class(...) end})

return middleclass