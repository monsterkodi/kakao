--[[
00     00   0000000   000000000   0000000  000   000  00000000 
000   000  000   000     000     000       000   000  000   000
000000000  000000000     000     000       000000000  0000000  
000 0 000  000   000     000     000       000   000  000   000
000   000  000   000     000      0000000  000   000  000   000
--]]

--  0000000   0000000   000   000  00000000  000   0000000 
-- 000       000   000  0000  000  000       000  000      
-- 000       000   000  000 0 000  000000    000  000  0000
-- 000       000   000  000  0000  000       000  000   000
--  0000000   0000000   000   000  000       000   0000000 

-- convert the patterns object to a list of [RegExp(key), value] pairs


local matchr = class("matchr")
    


function matchr.static.config(patterns, flags) 
        if is(patterns, "string") then 
            patterns = noon.parse(patterns)
        end
        
        local rgxs = array()
        for p, a in pairs(patterns) do 
            rgxs:push(array(p, a))
        end
        
        return rgxs
    end


function matchr.static.sortRanges(rgs) 
        rgs:sort(function (a, b) 
            if (a.start == b.start) then 
                return (a.index < b.index)
            else 
                return (a.start < b.start)
            end
        end)
        
        return rgs
    end

--[[
        00000000    0000000   000   000   0000000   00000000   0000000
        000   000  000   000  0000  000  000        000       000     
        0000000    000000000  000 0 000  000  0000  0000000   0000000 
        000   000  000   000  000  0000  000   000  000            000
        000   000  000   000  000   000   0000000   00000000  0000000 
    
        accepts a list of [regexp, value(s)] pairs and a string
        
        returns a list of objects with information about the matches:
            
            match: the matched substring
            start: position of match in str
            clss:  the value for the match
            index: index of the regexp
          
            the objects are sorted by start and index
            
            if the regexp has capture groups then 
                the value for the match of the nth group is
                    the nth item of values(s) if value(s) is an array
                    the nth [key, value] pair if value(s) is an object
    --]]


function matchr.static.pack(...) 
        local n = select("#", ...)
        local r = array()
        for i = 1, n-1 do 
            r:push(select(i, ...))
        end
        
        return r
    end


function matchr.static.match(s, p) 
        return matchr.pack(string.match(s, p))
    end


function matchr.static.ranges(regexes, text, flags) 
        if is(not regexes, array) then 
            if is(regexes, "string") then 
                regexes = array(array(regexes, 'found'))
            else 
                regexes = array(array(regexes, 'found'))
            end
        elseif (valid(regexes) and is(not regexes[1], array)) then 
            regexes = array(regexes)
        end
        
        local rgs = array()
        
        if (not text or empty(regexes)) then return rgs end
        
        for r in iter(1, #regexes) do 
            local reg = regexes[r][1]
            
            if not reg then 
                error('no reg?', regexes, text, flags)
                return rgs
            end
            
            local arg = regexes[r][2]
            local i = 1
            local s = text
            
            while #s do 
                local match = matchr.match(s, reg)
                
                write("STRING ", s)
                
                if not match then break end
                
                write("MATCHES " .. tostring(#match) .. " ", match)
                
                for i = 1, (#match + 1)-1 do 
                    write("MATCH " .. tostring(i) .. ". ", match[i])
                end
                
                if (#match == 1) then 
                    if (#match[1] > 0) then 
                        local start = (match.index + i)
                        rgs:push({
                            start = start, 
                            match = match[1], 
                            length = #match[1], 
                            clss = arg, 
                            index = r
                            })
                    end
                    
                    i = i + ((match.index + max(1, #match[1])))
                    s = text:slice(i)
                elseif (#match > 1) then 
                    local gs = 0
                    
                    for j in iter(1, #match) do 
                        local value = arg[j]
                        -- if value is array and j < value.len then value = value[j]
                        -- elif value is obj and j < dict.keys(value).len 
                        --     value = [dict.keys(value)[j], value[dict.keys(value)[j]]]
                        -- break if not match[j+1]
                        -- gi = kstr.find kstr.slice(match[1] gs) match[j+1]
                        local start = i --+ gs + gi
                        rgs:push({
                            start = start, 
                            length = #match[j], 
                            match = match[j], 
                            clss = value
                            })
                        
                        -- gs += match[j+1].len
                        i = i + (#match[j])
                    end
                    
                    s = kstr.slice(text, i)
                else 
                     break
                end
            end
        end
        
        return matchr.sortRanges(rgs)
    end

--[[
        0000000    000   0000000   0000000  00000000   0000000  000000000
        000   000  000  000       000       000       000          000   
        000   000  000  0000000   0000000   0000000   000          000   
        000   000  000       000       000  000       000          000   
        0000000    000  0000000   0000000   00000000   0000000     000   
     
        accepts a list of ranges
        returns a list of objects:
        
            match: the matched substring
            start: position of match in str
            clss:  string of classnames joined with a space
           
            with none of the [start, start+match.len] ranges overlapping
    --]]


function matchr.static.dissect(ranges, opt) 
        opt = opt or ({join = false})
        
        if (#ranges < 1) then 
            return array()
        end
        
        local di = array() -- collect a list of positions where a match starts or ends
        for _, rg in ipairs(ranges) do 
            di:push(array(rg.start, rg.index))
            di:push(array((rg.start + #rg.match), rg.index))
        end
        
        -- sort the start/end positions by x or index
        di:sort(function (a, b) 
            if (a[1] == b[1]) then 
                return (a[2] - b[2])
            else 
                return (a[1] - b[1])
            end
        end)
        
        local d = array()
        local si = -1
        
        for _, dps in ipairs(di) do 
            if (dps[1] > si) then 
                si = dps[1]
                d:push({
                    start = si, 
                    cls = array()
                    })
            end
        end
        
        local p = 0
        for ri in iter(1, #ranges) do 
            rg = ranges[ri]
            while (d[p].start < rg.start) do 
                p = p + 1
            end
            
            local pn = p
            while (d[pn].start < (rg.start + #rg.match)) do 
                if rg.clss then 
                    if not rg.clss.split then 
                        for _, r in ipairs(rg.clss) do 
                            if r.split then 
                                for c in r:split('.') do 
                                    if (d[pn].cls:indexof(c) < 0) then 
                                        d[pn].cls:push(c)
                                    end
                                end
                            end
                        end
                    else 
                        for c in rg.clss.split('.') do 
                            if (d[pn].cls:indexof(c) < 0) then 
                                d[pn].cls:push(c)
                            end
                        end
                    end
                end
                
                if ((pn + 1) < #d) then 
                    if not d[pn].match then 
                        d[pn].match = rg.match.substr((d[pn].start - rg.start), (d[(pn + 1)].start - d[pn].start))
                    end
                    
                    pn = pn + 1
                else 
                    if not d[pn].match then 
                        d[pn].match = rg.match.substr((d[pn].start - rg.start))
                    end
                    
                    break
                end
            end
        end
        
        d = d:filter(function (i) 
    return #i.match.trim()
end)
        
        for _, i in ipairs(d) do 
            i.clss = i.cls:join(' ')
            i.cls = nil
        end
        
        if (#d > 1) then 
            for i in iter((#d - 1), 1) do 
                if ((d[i].start + #d[i].match) == d[(i + 1)].start) then 
                    if (d[i].clss == d[(i + 1)].clss) then 
                        d[i].match = d[i].match + (d[(i + 1)].match)
                        d:splice((i + 1), 1)
                    end
                end
            end
        end
        
        return d
    end

--[[
        00     00  00000000  00000000    0000000   00000000  
        000   000  000       000   000  000        000       
        000000000  0000000   0000000    000  0000  0000000   
        000 0 000  000       000   000  000   000  000       
        000   000  00000000  000   000   0000000   00000000  
     
        merges two sorted lists of dissections
    --]]


function matchr:merge(dssA, dssB) 
        local result = array()
        local A = dssA:shift()
        local B = dssB:shift()
        
        while (A and B) do 
            if ((A.start + #A.match) < B.start) then 
                result:push(A)
                A = dssA:shift()
            elseif ((B.start + #B.match) < A.start) then 
                result:push(B)
                B = dssB:shift()
            elseif (A.start < B.start) then 
                local d = (B.start - A.start)
                result:push({
                    start = A.start, 
                    clss = A.clss, 
                    match = A.match:slice(1, d)
                    })
                
                A.start = A.start + d
                A.match = A.match:slice(d)
            elseif (B.start < A.start) then 
                local d = (A.start - B.start)
                result:push({
                    start = B.start, 
                    clss = B.clss, 
                    match = B.match:slice(1, d)
                    })
                
                B.start = B.start + d
                B.match = B.match:slice(d)
            elseif (A.start == B.start) then 
                local d = (#A.match - #B.match)
                local clss = A.clss .. " " .. B.clss
                local match = (function () 
    if (d >= 0) then 
    return B.match else 
    return A.match
                        end
end)()
                result:push({
                    start = A.start, 
                    clss = clss, 
                    match = match
                    })
                
                if (d > 0) then 
                    A.match = A.match:slice(#B.match)
                    A.start = A.start + (#B.match)
                    B = dssB:shift()
                elseif (d < 0) then 
                    B.match = B.match:slice(#A.match)
                    B.start = B.start + (#A.match)
                    A = dssA:shift()
                else 
                    A = dssA:shift()
                    B = dssB:shift()
                end
            end
        end
        
        if (B and not A) then 
            result = result + (array(B))
            result = result + dssB
        end
        
        if (A and not B) then 
            result = result + (array(A))
            result = result + dssA
        end
        
        return result
    end

return matchr