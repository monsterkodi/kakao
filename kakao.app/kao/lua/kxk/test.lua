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
        if (#_G.testStack == 1) then 
            print("▸ " .. self.suite)
        else 
            print("  " .. string.rep("    ", (#testStack - 1)) .. self.suite)
        end
        
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
    
    
    function fail(msg) 
        print("✘ [" .. _G.testIndex .. "] " .. msg)
        _G.testFail = _G.testFail + 1
        return false
    end
    
    if (type(a) ~= type(b)) then 
        return fail("type mismatch: " .. type(a) .. " != " .. type(b))
    end
    
    if (type(a) == "table") then 
            for k, v in pairs(a) do 
                if not test.static.cmp(v, b[k]) then 
                    return fail("table mismatch at " .. kstr.index(k)) -- & " " & $v & " != " & $b[k]
                end
            end
    elseif (type(a) == "number") then 
            if (math.abs((a - b)) > 1e-10) then 
                return fail("number mismatch: " .. tostring(a) .. " != " .. tostring(b))
            end
    else 
            if (a ~= b) then return fail(tostring(a) .. " != " .. tostring(b)) end -- & " ◇" & type(a)
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
            print(output)
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