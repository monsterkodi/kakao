-- ███   ███  ███   ███  ███   ███
-- ███  ███    ███ ███   ███  ███ 
-- ███████      █████    ███████  
-- ███  ███    ███ ███   ███  ███ 
-- ███   ███  ███   ███  ███   ███


function _G.iter(from, to, step) 
    step = step or 1
    
    if (step ~= 0) then 
        step = math.abs(step)
        if (from > to) then step = -step end
        local i = (from - step)
        return function () 
            i = (i + step)
            if (((i >= to) and (step < 0)) or ((i <= to) and (step > 0))) then 
                return i
            end
        end
    end
    
    return function () 
    return nil
end
end


function _G.sleep(s) 
    local t = os.clock()
    while ((os.clock() - t) <= s) do _ = 1 end
end

_G.strbuff = require("string.buffer")
_G.class = require("kxk/class")
_G.inspect = require("kxk/inspect")
_G.slash = require("kxk/slash")
_G.array = require("kxk/array")
_G.kstr = require("kxk/kstr")
_G.test = require("kxk/test")

local kxk = {}
-- kxk.exec = cmd opt cb ->
--     
--     if cb == nil
--         cb = opt
--         opt = {}
--     
--     res = err out ->
--         if err ➜ out = ""
--         cb out
--         
--     childp.exec cmd opt res

-- kxk.shell = cmd ->
--     fileHandle = io.popen(cmd, 'r')
--     output = fileHandle:read('*a')
--     (ok failreason exitcode) = fileHandle:close()
--     (output ok failreason exitcode)

return kxk