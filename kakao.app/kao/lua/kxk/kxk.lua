-- ███   ███  ███   ███  ███   ███
-- ███  ███    ███ ███   ███  ███ 
-- ███████      █████    ███████  
-- ███  ███    ███ ███   ███  ███ 
-- ███   ███  ███   ███  ███   ███

_G.buffer = require("string.buffer")
_G.childp = require("childprocess")
_G.class = require("./class")
_G.inspect = require("./inspect")
_G.slash = require("./slash")
_G.test = require("./test")

local kxk = {}


function kxk.exec(cmd, opt, cb) 
    if (cb == nil) then 
        cb = opt
        opt = {}
    end
    
    
    function res(err, out) 
        if err then out = "" end
        cb(out)
    end
    
    childp.exec(cmd, opt, res)
end

return kxk