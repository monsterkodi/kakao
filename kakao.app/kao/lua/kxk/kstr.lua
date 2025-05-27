local kstr = {}


function kstr.splice(s, i, n, ...) 
    if (i < 0) then i = ((#s + i) + 1) end
    if (i > 1) then 
        return string.sub(s, 1, (i - 1)) .. table.concat({...}, '') .. string.sub(s, (i + n))
    elseif (i == 1) then 
        return table.concat({...}, '') .. string.sub(s, (i + n))
    end
end


function kstr.slice(s, f, t) 
    return string.sub(s, f, t)
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
    n = n or 1
    c = c or " "
end

function kstr.lpad(l, s, c) 
    s = s or ""
    c = c or ' '
    
    while (#s < l) do s = c .. s end
    return s
end


function kstr.rpad(l, s, c) 
    s = s or ""
    c = c or ' '
    
    while (#s < l) do s = s .. c end
    return s
end


function kstr.pad(l, s, c) 
    s = s or ""
    c = c or ' '
    
    return kstr.rpad(l, s, c)
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


function kstr.chars(s) 
    local result = array()
    for i in iter(1, #s) do 
        result:push(s:sub(i, i))
    end
    
    return result
end


function kstr.split(s, sep, limit) 
    if (sep == nil) then return {s} end
    if (sep == "") then return kstr.chars(s) end
    
    local reslt = array()
    local start = 1
    local count = 0
    
    while true do 
        local pos = s:find(sep, start, true)
        
        if ((limit and (count >= limit)) or not pos) then 
            reslt:push(s:sub(start))
            break
        end
        
        reslt:push(s:sub(start, (pos - 1)))
        start = (pos + #sep)
        count = (count + 1)
    end
    
    return reslt
end


function kstr.find(s, c) 
    return (string.find(s, c, 1, true) or -1)
end


function kstr.rfind(s, c) 
    local i = ((#s + 1) - #c)
    while ((i > 0) and (string.sub(s, i, ((i + #c) - 1)) ~= c)) do 
        i = i - 1
    end
    
    return (((i >= 1) and i) or -1)
end


function kstr.index(i) 
    if is(i, "number") then 
        if (i == 1) then return "1st"
        elseif (i == 2) then return "2nd"
        elseif (i == 3) then return "3rd"
        else return tostring(i) .. "th"
        end
    end
    
    return i
end


function kstr.count(s, c) 
    if empty(s) then return 0 end
    local cnt = 0
    for i in iter(1, #s) do 
        if (kstr.find(c, s:sub(i, i)) >= 0) then 
            cnt = cnt + 1
        end
    end
    
    return cnt
end

return kstr