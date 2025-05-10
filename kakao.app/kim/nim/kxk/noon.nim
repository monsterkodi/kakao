#[
    000   000   0000000    0000000   000   000  
    0000  000  000   000  000   000  0000  000  
    000 0 000  000   000  000   000  000 0 000  
    000  0000  000   000  000   000  000  0000  
    000   000   0000000    0000000   000   000  
]#
# 00000000    0000000   00000000    0000000  00000000
# 000   000  000   000  000   000  000       000
# 00000000   000000000  0000000    0000000   0000000
# 000        000   000  000   000       000  000
# 000        000   000  000   000  0000000   00000000

proc parseNoon*(s : string) = 
    if not s: return ''
    if (s == ''): return ''
    var EMPTY = "/^\s*$/"
    var NEWLINE = "/\r?\n/"
    var FLOAT = "/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/"
    var INT = "/^(\-|\+)?([0-9]+|Infinity)$/"
    
    proc last(a) = a?[(a.length - 1)]
    
    proc isArray(a) = ((a? and (typeof(a) == "object")) and (a.constructor.name == "Array"))
    # 000   000  000   000  0000000    00000000  000   000   0000000  00000000
    # 000   000  0000  000  000   000  000       0000  000  000       000
    # 000   000  000 0 000  000   000  0000000   000 0 000  0000000   0000000
    # 000   000  000  0000  000   000  000       000  0000       000  000
    #  0000000   000   000  0000000    00000000  000   000  0000000   00000000
    
    proc undense(d, s) = # undenses string s at depth d. Returns list of padded lines
    
        sl = s.length
        sd = d
        p = 0
        while ((p < sl) and (s[p] == '.')): # depth dots
        
            (d += 1)
            (p += 1)
        while ((p < sl) and (s[p] == ' ')): # spaces before key/item
        
            (p += 1)
        l = ''
        key = true
        esc = false
        while (p < sl): 
            if (((l != '') and (s[p] == ' ')) and (s[(p + 1)] == '.')): 
                pp = (p + 2)
                while ((pp < sl) and (s[pp] == '.')): 
                    (pp += 1)
                if (s[pp] == ' '): 
                    (p += 1)
                    break
            esc(| = (s[p] == '|'))
            (l += s[p])
            if ((not esc and key) and (s[p] == ' ')): 
                if ((p < (sl + 1)) and (s[(p + 1)] != ' ')): 
                    (l += ' ')
                key = false
            (p += 1)
            esc(^ = (s[p] == '|'))
        ld = '' # pad line with spaces
        for i in @[0..<d]: 
            (ld += ' ')
        (ld += l)
        if (p < sl): 
            t = undense(sd, s.substring(p))
            t.unshift(ld)
            t
        else: 
            @[ld]
    #  0000000  00000000   000      000  000000000
    # 000       000   000  000      000     000
    # 0000000   00000000   000      000     000
    #      000  000        000      000     000
    # 0000000   000        0000000  000     000
    var leadingSpaces = 0
    proc (lines = s.split(NEWLINE).filter(l)) = not EMPTY.test(l)
    if (lines.length == 0): 
        return ''
    elif (lines.length == 1): 
        var lines = @[lines[0].trim()]
    else: 
        while (lines[0][leadingSpaces] == ' '): 
            (leadingSpaces += 1)
    var stack = @[o: @[], d: leadingSpaces]
    # 00     00   0000000   000   000  00000000         0000000   0000000          000
    # 000   000  000   000  000  000   000             000   000  000   000        000
    # 000000000  000000000  0000000    0000000         000   000  0000000          000
    # 000 0 000  000   000  000  000   000             000   000  000   000  000   000
    # 000   000  000   000  000   000  00000000         0000000   0000000     0000000
    
    proc makeObject(t) = 
        var o = {}
        for i in t.o: 
            o[i] = null
        t.l = last(t.o)
        t.o = o
        if (stack.length > 1): 
            var b = stack[(stack.length - 2)]
            if isArray(b.o): 
                b.o.pop()
                b.o.push(o)
            else: 
                b.o[b.l] = o
        o
    # 000   000  00000000  000   000
    # 000  000   000        000 000
    # 0000000    0000000     00000
    # 000  000   000          000
    # 000   000  00000000     000
    
    proc key(k) = 
        if (k?[0] == '|'): 
            if (k[(k.length - 1)] == '|'): 
                return k.substr(1, (k.length - 2))
            return k.substr(1).trimRight()
        k
    # 000   000   0000000   000      000   000  00000000   0000000
    # 000   000  000   000  000      000   000  000       000
    #  000 000   000000000  000      000   000  0000000   0000000
    #    000     000   000  000      000   000  000            000
    #     0      000   000  0000000   0000000   00000000  0000000
    var values = 
        "null": null
        "true": true
        "false": false
    
    proc value(v) = 
        if (values[v] != undefined): return values[v]
        if (v?[0] == '|'): return key(v)
        elif (v?[(v.length - 1)] == '|'): 
            return v.substr(0, (v.length - 1))
        if FLOAT.test(v): return parseFloat(v)
        if INT.test(v): return parseInt(v)
        v
    # 000  000   000   0000000  00000000  00000000   000000000
    # 000  0000  000  000       000       000   000     000
    # 000  000 0 000  0000000   0000000   0000000       000
    # 000  000  0000       000  000       000   000     000
    # 000  000   000  0000000   00000000  000   000     000
    
    proc insert(t, k, v) = 
        if isArray(t.o): 
            if not v?: 
                if ((last(t.o) == '.') == k): 
                    t.o.pop()
                    t.o.push(@[])
                t.o.push(value(k))
            else: 
                makeObject(t)[key(k)] = value(v)
        else: 
            t.o[key(k)] = value(v)
            t.l = key(k)
    # 000  000   000  0000000    00000000  000   000  000000000
    # 000  0000  000  000   000  000       0000  000     000
    # 000  000 0 000  000   000  0000000   000 0 000     000
    # 000  000  0000  000   000  000       000  0000     000
    # 000  000   000  0000000    00000000  000   000     000
    
    proc indent(t, k, v) = 
        var o = @[]
        o = if v?: {}
        if isArray(t.o): 
            if (last(t.o) == '.'): 
                t.o.pop()
                t.o.push(o)
            else: 
                var l = last(t.o)
                makeObject(t)
                t.o[l] = o
        else: 
            t.o[t.l] = o
        if v?: 
            o[key(k)] = value(v)
        else: 
            o.push(value(k))
        o
    #  0000000   0000000    0000000    000      000  000   000  00000000
    # 000   000  000   000  000   000  000      000  0000  000  000
    # 000000000  000   000  000   000  000      000  000 0 000  0000000
    # 000   000  000   000  000   000  000      000  000  0000  000
    # 000   000  0000000    0000000    0000000  000  000   000  00000000
    
    proc addLine(d, k, v) = 
        if k?: 
            var t = last(stack)
            var undensed = t.undensed
            t.undensed = false
            if ((d > t.d) and not undensed): 
                stack.push
                
                    o: indent(t, k, v)
                    d: d
            elif (d < t.d): 
                if (isArray(t.o) and (last(t.o) == '.')): 
                    t.o.pop()
                    t.o.push(@[])
                while (t?.d > d): 
                    stack.pop()
                    t = last(stack)
                insert(t, k, v)
            else: 
                if undensed: 
                    t.d = d
                insert(t, k, v)
    # 000  000   000   0000000  00000000   00000000   0000000  000000000
    # 000  0000  000  000       000   000  000       000          000
    # 000  000 0 000  0000000   00000000   0000000   000          000
    # 000  000  0000       000  000        000       000          000
    # 000  000   000  0000000   000        00000000   0000000     000
    
    proc inspect(l) = 
        var p = 0
        while (l[p] == ' '): # preceeding spaces
        
            (p += 1)
        if not l[p]: ? else: return @[0, null, null, false] # only spaces in line
        var d = p
        var k = ''
        if (l[p] == '#'): return @[0, null, null, false] # comment line
        var escl = false
        var escr = false
        if (l[p] == '|'): 
            escl = true
            (k += '|')
            (p += 1)
        while l[p]: ?
        
            if (((l[p] == ' ') and (l[(p + 1)] == ' ')) and not escl): 
                break
            (k += l[p])
            (p += 1)
            if (escl and (l[(p - 1)] == '|')): 
                break
        if not escl: 
            k = k.trimRight()
        while (l[p] == ' '): # whitespace between key and value
        
            (p += 1)
        var v = ''
        if (l[p] == '|'): 
            escr = true
            (v += '|')
            (p += 1)
        while l[p]: ?
        
            (v += l[p])
            (p += 1)
            if ((escr and (l[(p - 1)] == '|')) and (l.trimRight().length == p)): 
                break
        if ((l[(p - 1)] == ' ') and not escr): 
            v = if v?: v.trimRight()
        k = if (k == ''): null
        v = if (v == ''): null
        @[d, k, v, escl]
    #  0000000   000   000  00000000        000      000  000   000  00000000
    # 000   000  0000  000  000             000      000  0000  000  000
    # 000   000  000 0 000  0000000         000      000  000 0 000  0000000
    # 000   000  000  0000  000             000      000  000  0000  000
    #  0000000   000   000  00000000        0000000  000  000   000  00000000
    if (lines.length == 1): 
        if (0 < lines[0].indexOf(":: ")): 
            proc (lines = lines[0].split(":: ").map(l)) = 
                p = 0
                while (l[p] == ' '): 
                    (p += 1)
                while l[p]: (? and (l[p] != ' '))
                
                    (p += 1)
                if (l[p] == ' '): 
                    ((l.slice(0, p) + ' ') + l.slice(p))
                else: 
                    l
        var p = lines[0].indexOf(" . ")
        var e = lines[0].indexOf('|')
        if (((p > 0) and (p == lines[0].indexOf), ' ') and ((e < 0) or (p < e))): 
            var lines = @[((lines[0].slice(0, p) + ' ') + lines[0].slice(p))]
    # 00000000   0000000    0000000  000   000        000      000  000   000  00000000
    # 000       000   000  000       000   000        000      000  0000  000  000
    # 0000000   000000000  000       000000000        000      000  000 0 000  0000000
    # 000       000   000  000       000   000        000      000  000  0000  000
    # 00000000  000   000   0000000  000   000        0000000  000  000   000  00000000
    var i = 0
    while (i < lines.length): 
        var line = lines[i]
        @[d, k, v, e] = inspect(line)
        if k?: 
            if ((v? and not e) and (v.substr(0, 2) == ". ")): # dense value
            elif addLine(d, k): 
                var ud = last(stack).d
                for e in undense(d, v): 
                    @[dd, dk, dv] = inspect(e)
                    addLine(dd, dk, dv)
                while (last(stack).d > (ud + 1)): 
                    stack.pop()
                last(stack).undensed = true
            else: 
                var oi = i
                
                proc lineFail = if (i >= lines.length): error(&"unmatched multiline string in line {(oi + 1)}" ; return 1)
                if ((k == "...") and not v?): 
                    (i += 1)
                    var vl = @[]
                    if lineFail(): return
                    while (lines[i].trimLeft().substr(0, 3) != "..."): 
                        var l = lines[i].trim()
                        if (l[0] == '|'): l = l.substr(1)
                        if (l[(l.length - 1)] == '|'): l = l.substr(0, (l.length - 1))
                        vl.push(l)
                        (i += 1)
                        if lineFail(): return
                    var k = vl.join("\n")
                    var r = lines[i].trimLeft().substr(3).trim()
                    if r.length: 
                        var v = r
                if (v == "..."): 
                    (i += 1)
                    if lineFail(): return
                    var vl = @[]
                    while (lines[i].trim() != "..."): 
                        var l = lines[i].trim()
                        if (l[0] == '|'): l = l.substr(1)
                        if (l[(l.length - 1)] == '|'): l = l.substr(0, (l.length - 1))
                        vl.push(l)
                        (i += 1)
                        if lineFail(): return
                    var v = vl.join("\n")
                addLine(d, k, v)
        (i += 1)
    stack[0].o