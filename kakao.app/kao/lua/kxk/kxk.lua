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
    
    return function () return nil end
end

_G.strbuff = require("string.buffer")
_G.childp = require("childprocess")
_G.class = require("./class")
_G.inspect = require("./inspect")
_G.slash = require("./slash")
_G.array = require("./array")
_G.kstr = require("./kstr")
_G.test = require("./test")

local kxk = {}

function kxk.exec(cmd, opt, cb) 
    if (cb == nil) then 
        cb = opt
        opt = {}
    end
    
    
    function res(err, out) 
        if err then out = "" end
        return cb(out)
    end
    
    return childp.exec(cmd, opt, res)
end

return kxk