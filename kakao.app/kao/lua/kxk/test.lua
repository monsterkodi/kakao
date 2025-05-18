-- █████████  ████████   ███████  █████████
--    ███     ███       ███          ███   
--    ███     ███████   ███████      ███   
--    ███     ███            ███     ███   
--    ███     ████████  ███████      ███   


local test = class("test")
    


function test:__tostring() return "▸" .. self.suite
    end


function test:init(s, t) 
        self.suite = s
        _G.testStack = _G.testStack or {}
        _G.testIndex = 0
        table.insert(testStack, self.suite)
        print("▸ " .. string.rep("    ", (#testStack - 1)) .. testStack[#testStack])
        t()
        table.remove(testStack)
        return self
    end


function test.static.cmp(a, b) 
    _G.testIndex = _G.testIndex + 1
    if (a ~= b) then 
        print("✘ [" .. _G.testIndex .. "] " .. a .. " != " .. b)
    end
end

return test