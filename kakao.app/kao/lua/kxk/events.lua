-- ████████  ███   ███  ████████  ███   ███  █████████   ███████  
-- ███       ███   ███  ███       ████  ███     ███     ███       
-- ███████    ███ ███   ███████   ███ █ ███     ███     ███████   
-- ███          ███     ███       ███  ████     ███          ███  
-- ████████      █      ████████  ███   ███     ███     ███████   


local events = class("events")
    


function events:init() 
    self.handlers = array()
    return self
    end


function events:on(event, handler, o) 
        self.handlers = self.handlers or (array())
        local list = (self.handlers[event] or array())
        
        if list:has(handler) then return self end
        
        if o then 
            list:push(array(o, handler))
        else 
            list:push(handler)
        end
        
        self.handlers[event] = list
        return self
    end


function events:emit(event, ...) 
        self.handlers = self.handlers or (array())
        local list = self.handlers[event]
        
        if valid(list) then 
            for i in iter(#list, 1) do 
                if list[i] then 
                    if is(list[i], "function") then 
                        list[i](...)
                    else 
                        list[i][2](list[i][1], ...)
                    end
                end
            end
        end
    end


function events:removeListener(event, handler, o) 
        self.handlers = self.handlers or (array())
        local list = self.handlers[event]
        if not list then return self end
        
        if handler then 
            for i in iter(1, #list) do 
                if (list[i] == handler) then 
                    table.remove(list, i)
                    break
                elseif ((is(list[i], array) and (list[i][1] == o)) and (list[i][2] == handler)) then 
                    table.remove(list, i)
                    break
                end
            end
            
            if (#list == 0) then 
                self.handlers[event] = nil
            end
        else 
            self.handlers[event] = nil
        end
        
        return self
    end


function events:removeAllListeners(eventName) 
        if not eventName then 
            self.handlers = array()
        else 
            self:removeListener(eventName)
        end
        
        return self
    end

_G.post = events()

return events