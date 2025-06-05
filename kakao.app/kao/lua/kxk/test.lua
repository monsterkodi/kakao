-- █████████  ████████   ███████  █████████
--    ███     ███       ███          ███   
--    ███     ███████   ███████      ███   
--    ███     ███            ███     ███   
--    ███     ████████  ███████      ███   

os = require "os"


function rawpairs(t) 
    return next, t, nil
end

_G.testFail = 0


local test = class("test")
    


function test:__tostring() 
    return "▸" .. self.suite
    end


function test:init(s, t) 
        self.suite = s
        _G.testStack = _G.testStack or ({})
        _G.testIndex = 0
        table.insert(testStack, self.suite)
        if (#_G.testStack == 1) then 
            write("\x1b[0m\x1b[32m\x1b[2m", "▸ ", "\x1b[0m\x1b[32m", self.suite)
        else 
            write("  ", string.rep("    ", (#testStack - 1)), "\x1b[0m\x1b[32m\x1b[2m", self.suite)
        end
        
        t()
        table.remove(testStack)
        if (#testStack == 0) then 
            os.exit(_G.testFail)
        end
        return self
    end


function test.static.cmp(a, b) 
    _G.testIndex = _G.testIndex + 1
    
    
    function fail(...) 
        write("\x1b[0m\x1b[31m", "✘ ", "\x1b[0m\x1b[31m\x1b[2m", "[", _G.testIndex, "] ", "\x1b[0m\x1b[33m", tostring(strg(...)))
        _G.testFail = _G.testFail + 1
        return false
    end
    
    
    function cmpTable(a, b) 
        if (#a ~= #b) then 
            return fail("\x1b[0m\x1b[90m\x1b[2m", "table length mismatch ", "\x1b[0m\x1b[34m", #a, "\x1b[0m\x1b[31m", " != ", "\x1b[0m\x1b[32m", #b) --"\n" ◌y [unpack(a)] ◌r "\n!=\n" ◌g [unpack(b)]
        end
        
        for k, v in rawpairs(a) do 
            if ((type(v) ~= "function") and ((type(k) ~= "string") or (k:sub(1, 2) ~= "__"))) then 
                if not test.static.cmp(v, b[k]) then 
                    local key = k
                    if (type(k) == "number") then 
                        key = kstr.index(k)
                    end
                    
                    return fail("\x1b[0m\x1b[90m\x1b[2m", "table value mismatch at ", "\x1b[0m\x1b[34m", key, "\n", "\x1b[0m\x1b[33m", array(unpack(a)), "\x1b[0m\x1b[31m", "\n!=\n", "\x1b[0m\x1b[32m", array(unpack(b)))
                end
            end
            
            -- else if v != b[k]
            --     ⮐  fail ◌d- "table ??? " ◌b $k "\n" ◌y $[unpack(a)] ◌r "!=\n" ◌g $[unpack(b)]
        end
        
        return true
    end
    
    if (type(a) ~= type(b)) then 
        return fail("\x1b[0m\x1b[90m\x1b[2m", "type mismatch ", "\x1b[0m\x1b[34m\x1b[2m", "◇", "\x1b[0m\x1b[34m", type(a), "\x1b[0m\x1b[31m", " != ", "\x1b[0m\x1b[34m\x1b[2m", "◇", "\x1b[0m\x1b[34m", type(b), "\x1b[0m\x1b[90m", " (", tostring(a), " != ", tostring(b), ")")
    end
    
    if (type(a) == "table") then 
            return cmpTable(a, b)
    elseif (type(a) == "number") then 
            if (math.abs((a - b)) > 1e-10) then 
                return fail("\x1b[0m\x1b[90m\x1b[2m", "number mismatch ", "\x1b[0m\x1b[33m", a, "\x1b[0m\x1b[31m", " != ", "\x1b[0m\x1b[32m", b)
            end
    else 
            if (a ~= b) then return fail("\x1b[0m\x1b[34m\x1b[2m", "◇", "\x1b[0m\x1b[34m", type(a), "\x1b[0m\x1b[90m\x1b[2m", " mismatch\n", "\x1b[0m\x1b[33m", a, "\x1b[0m\x1b[31m", "\n!=\n", "\x1b[0m\x1b[32m", b) end
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
            write("\x1b[0m\x1b[31m", "✘ ", "\x1b[0m\x1b[34m", slash.tilde(slash.dir(f)), "/", "\x1b[0m\x1b[38;2;160;160;240m", slash.name(f), "\x1b[0m\x1b[38;2;96;96;240m", ".", slash.ext(f))
            success = false
        end
    end
    
    return success
end

return test