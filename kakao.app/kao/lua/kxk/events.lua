-- ████████  ███   ███  ████████  ███   ███  █████████   ███████  
-- ███       ███   ███  ███       ████  ███     ███     ███       
-- ███████    ███ ███   ███████   ███ █ ███     ███     ███████   
-- ███          ███     ███       ███  ████     ███          ███  
-- ████████      █      ████████  ███   ███     ███     ███████   


local events = class("events")
    events.emit = event function (...) 
        ret = false
        list = @handlers[event]
        if list then 
            for i in iter(#list, 1) do 
                if list[i] then 
                    list[i](...)
                end
            end
        end
    end


function events:init() 
    self.handlers = array()
    return self
    end


function events:on(event, handler) 
        local list = (self.handlers[event] or array())
        if list:has(handler) then return self end
        
        list:push(handler)
        self.handlers[event] = list
        return self
    end


function events:removeListener(event, handler) 
        local list = self.handlers[event]
        if not list then return self end
        
        if handler then 
            for i in iter(1, #list) do 
                if (list[i] == handler) then 
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

return events