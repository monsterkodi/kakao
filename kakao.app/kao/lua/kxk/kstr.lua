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


function kstr.endsWith(s, o) 
    return (o == string.sub(s, ((#s - #o) + 1), #s))
end

function kstr.startsWith(s, o) 
    return (o == string.sub(s, 1, #o))
end


function kstr.rtrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (kstr.endsWith(s, c) or kstr.endsWith(s, "\n"))) do 
        s = kstr.pop(s)
    end
    
    return s
end


function kstr.ltrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (kstr.startsWith(s, c) or kstr.startsWith(s, "\n"))) do 
        s = string.sub(s, 2)
    end
    
    return s
end


function kstr.trim(s, c) 
    c = c or ' '
    
    return kstr.ltrim(kstr.rtrim(s, c), c)
end


function kstr.split(s, sep) 
    local r = {}
    local pat = string.format("([^%s]+)", sep)
    for part in string.gmatch(s, pat) do 
        table.insert(r, part)
    end
    
    return r
end


function kstr.rfind(s, c) 
    local i = ((#s + 1) - #c)
    while ((i > 0) and (string.sub(s, i, (i + #c)) ~= c)) do 
        i = (i - 1)
    end
    
    return i
end


function kstr.index(i) 
    if (i == 1) then return "1st"
    elseif (i == 2) then return "2nd"
    elseif (i == 3) then return "3rd"
    else return tostring(i) .. "th"
    end
end

return kstr