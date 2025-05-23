-- █████████  ████████   ███████  █████████
--    ███     ███       ███          ███   
--    ███     ███████   ███████      ███   
--    ███     ███            ███     ███   
--    ███     ████████  ███████      ███   

os = require "os"

_G.testFail = 0


local test = class("test")
    


function test:__tostring() 
    return "▸" .. self.suite
    end


function test:init(s, t) 
        self.suite = s
        _G.testStack = _G.testStack or {}
        _G.testIndex = 0
        table.insert(testStack, self.suite)
        print("▸ " .. string.rep("    ", (#testStack - 1)) .. testStack[#testStack])
        t()
        table.remove(testStack)
        if (#testStack == 0) then 
            -- log "exit" _G.testFail
            os.exit(_G.testFail)
        end
        return self
    end


function test.static.cmp(a, b) 
    _G.testIndex = _G.testIndex + 1
    
    if (type(a) ~= type(b)) then 
        print("✘ [" .. _G.testIndex .. "] type mismatch: " .. type(a) .. " != " .. type(b))
        _G.testFail = _G.testFail + 1
        return false
    end
    
    if (type(a) == "table") then 
        for k, v in pairs(a) do 
            if not test.static.cmp(v, b[k]) then 
                print("✘ [" .. _G.testIndex .. "] table mismatch at index: " .. tostring(k)) -- & " " & $v & " != " & $b[k]
                return false
            end
        end
    elseif (type(a) == "number") then 
        if (math.abs((a - b)) > 1e-10) then 
            print("✘ [" .. _G.testIndex .. "] number mismatch: " .. tostring(a) .. " != " .. tostring(b))
            return false
        end
    elseif (a ~= b) then 
        print("✘ [" .. _G.testIndex .. "] " .. tostring(a) .. " != " .. tostring(b) .. " " .. type(a))
        _G.testFail = _G.testFail + 1
        return false
    end
    
    return true
end


function test.static.run(files) 
    -- log "test.run" array.str files
    local success = true
    for f, _ in pairs(files) do 
        -- log "test" f
        local output, ok, exitcode = slash.shell("luajit", f)
        if ok then 
            -- log output
            -- log output, ok, exitcode
            -- log "✔ " f
            local a = 1
        else 
            print(output)
            print("✘ ", f, exitcode)
            success = false
        end
    end
    
    return success
end

return test