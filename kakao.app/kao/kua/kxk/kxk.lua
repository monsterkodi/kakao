
_G.buffer  = require "string.buffer"
_G.childp  = require "childprocess"
_G.inspect = require "./inspect"
_G.slash   = require "./slash"

kxk = {}
        
function kxk.exec(cmd, opt, cb)
    
    if cb == nil then
        cb = opt
        opt = {}
    end
    
    local res = function (err, out)
        if err then out = "" end
        cb(out)
    end
        
    childp.exec(cmd, opt, res)
    
end

return kxk
