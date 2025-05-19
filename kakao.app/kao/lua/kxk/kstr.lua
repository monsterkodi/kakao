local kstr = {}


function kstr.splice(s, i, n, ...) 
    if (i < 0) then i = ((#s + i) + 1) end
    if (i > 1) then 
        return string.sub(s, 1, (i - 1)) .. table.concat({...}, '') .. string.sub(s, (i + n))
    elseif (i == 1) then 
        return table.concat({...}, '') .. string.sub(s, (i + n))
    end
end


function kstr.shift(s, n) 
    n = n or 1
    
    return kstr.splice(s, 1, n)
end


function kstr.pop(s, n) 
    n = n or 1
    
    return kstr.splice(s, -n, n)
end

return kstr