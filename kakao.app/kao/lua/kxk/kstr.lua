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

function kstr.lpad(s, n, c) 
    c = c or " " n = n or 1
end

function kstr.lpad(l, s, c) 
    c = c or ' ' s = s or ""
    
    while (#s < l) do s = c .. s end
    return s
end


function kstr.rpad(l, s, c) 
    c = c or ' ' s = s or ""
    
    while (#s < l) do s = s .. c end
    return s
end


function kstr.rtrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (s[#s] == c)) do 
        s = kstr.pop(s)
    end
    
    return s
end


function kstr.ltrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (s[1] == c)) do 
        s = string.sub(s, 2)
    end
    
    return s
end


function kstr.trim(s, c) 
    c = c or ' '
    
    return kstr.ltrim(kstr.rtrim(s, c), c)
end

return kstr