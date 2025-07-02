--[[
000   000  000   000  000      000   000  00000000     
000  000   000   000  000      000   000  000   000    
0000000    000   000  000      000   000  0000000      
000  000   000   000  000      000   000  000   000    
000   000   0000000   0000000   0000000   000   000    
--]]

kxk = require "kxk.kxk"
kulur = require "kxk.kulur"

local ext = 'kode'

function lang(l) 
    ext = l
    return ext
end

function ranges(s) 
    return kulur.ranges(s, ext)
end

function dissect(c) 
    return kulur.dissect(kstr.lines(c), ext)
end

function inc(rgs, start, match) 
    if rgs then 
        for _, r in ipairs(rgs) do 
            if ((r.start == start) and (r.match == match)) then 
                return r.clss
            end
        end
    end
    
    return write("\x1b[0m\x1b[31m", noon(rgs), "\nexpected ", "\x1b[0m\x1b[32m", match, "\x1b[0m\x1b[31m", ' at index ', "\x1b[0m\x1b[34m", start)
end

test("kulur", function()
    -- ███   ███  ███  ██     ██
    -- ███  ███   ███  ███   ███
    -- ███████    ███  █████████
    -- ███  ███   ███  ███ █ ███
    -- ███   ███  ███  ███   ███
    
    test("kim", function()
        lang('kim')
        
        local rgs = ranges('if')
        test.cmp(inc(rgs, 1, 'if'), 'keyword')
        
        rgs = ranges('●if')
        test.cmp(inc(rgs, 1, '●'), 'punct')
        -- inc rgs 2 'if' ▸ 'text'
    end)
    
    -- ███   ███  ███  ██     ██
    -- ████  ███  ███  ███   ███
    -- ███ █ ███  ███  █████████
    -- ███  ████  ███  ███ █ ███
    -- ███   ███  ███  ███   ███
    
    test("nim", function()
        lang('nim')
        
        local dss = dissect("proc f(str:string)")
        -- write "dss" dss
        
        test.cmp(inc(dss[1], 1, "proc"), 'keyword')
        test.cmp(inc(dss[1], 12, "string"), 'keyword type')
    end)
    
    -- 000   000   0000000   0000000    00000000  
    -- 000  000   000   000  000   000  000       
    -- 0000000    000   000  000   000  0000000   
    -- 000  000   000   000  000   000  000       
    -- 000   000   0000000   0000000    00000000  
    
    test("kode", function()
        lang('kode')
        
        local dss = dissect("a = b -> true")
        test.cmp(inc(dss[1], 1, "a"), 'function')
        test.cmp(inc(dss[1], 3, "="), 'punct function')
        test.cmp(inc(dss[1], 5, "b"), 'function argument')
        test.cmp(inc(dss[1], 7, "->"), 'punct function')
        
        dss = dissect("->")
        test.cmp(inc(dss[1], 1, "->"), 'punct function')
        
        dss = dissect("    -> true")
        test.cmp(inc(dss[1], 5, "->"), 'punct function')
        
        dss = dissect("=>")
        test.cmp(inc(dss[1], 1, "=>"), 'punct function bound')
        
        dss = dissect("    => true")
        test.cmp(inc(dss[1], 5, "=>"), 'punct function bound')
    end)
    
    -- ███   ███   ███████    ███████   ███   ███
    -- ████  ███  ███   ███  ███   ███  ████  ███
    -- ███ █ ███  ███   ███  ███   ███  ███ █ ███
    -- ███  ████  ███   ███  ███   ███  ███  ████
    -- ███   ███   ███████    ███████   ███   ███
    
    test("noon", function()
        lang('noon')
        
        local rgs = ranges("    property  value")
        test.cmp(inc(rgs, 5, 'property'), 'property')
        test.cmp(inc(rgs, 15, 'value'), 'text')
        
        rgs = ranges("top", 'noon')
        -- inc rgs 1 'top'        ▸ 'obj'
        test.cmp(inc(rgs, 1, 'top'), 'text')
        
        rgs = ranges("tip top")
        -- inc rgs 1 'tip'        ▸ 'obj'
        -- inc rgs 5 'top'        ▸ 'obj'
        
        rgs = ranges("top  prop")
        -- inc rgs 1 'top'        ▸ 'obj'
        test.cmp(inc(rgs, 6, 'prop'), 'text')
        
        rgs = ranges("version  ^0.1.2")
        -- inc rgs 1 'version'    ▸ 'obj'
        test.cmp(inc(rgs, 10, '^'), 'punct semver')
        test.cmp(inc(rgs, 11, '0'), 'semver')
        
        rgs = ranges("    some-package-name  1")
        test.cmp(inc(rgs, 5, 'some'), 'property')
        test.cmp(inc(rgs, 10, 'package'), 'property')
        test.cmp(inc(rgs, 18, 'name'), 'property')
        
        rgs = ranges("    some-package-name  ^1.2.3")
        test.cmp(inc(rgs, 5, 'some'), 'property')
        test.cmp(inc(rgs, 10, 'package'), 'property')
        test.cmp(inc(rgs, 18, 'name'), 'property')
        
        rgs = ranges("top  prop  value")
        -- inc rgs 1  'top'       ▸ 'obj'
        test.cmp(inc(rgs, 6, 'prop'), 'property')
        test.cmp(inc(rgs, 12, 'value'), 'text')
        
        rgs = ranges("    http://domain.com")
        test.cmp(inc(rgs, 5, 'http'), 'url protocol')
        test.cmp(inc(rgs, 9, ':'), 'punct url')
        test.cmp(inc(rgs, 10, '/'), 'punct url')
        test.cmp(inc(rgs, 11, '/'), 'punct url')
        test.cmp(inc(rgs, 12, 'domain'), 'url domain')
        test.cmp(inc(rgs, 18, '.'), 'punct url tld')
        test.cmp(inc(rgs, 19, 'com'), 'url tld')
        
        rgs = ranges("    http://domain.com/dir/page.html")
        test.cmp(inc(rgs, 5, 'http'), 'url protocol')
        test.cmp(inc(rgs, 9, ':'), 'punct url')
        test.cmp(inc(rgs, 10, '/'), 'punct url')
        test.cmp(inc(rgs, 11, '/'), 'punct url')
        test.cmp(inc(rgs, 12, 'domain'), 'url domain')
        test.cmp(inc(rgs, 18, '.'), 'punct url tld')
        test.cmp(inc(rgs, 19, 'com'), 'url tld')
        -- inc rgs 22 '/'         ▸ 'punct dir'
        
        rgs = ranges("    file.kode")
        -- inc rgs 5  'file'      ▸ 'file_kode'
        -- inc rgs 9  '.'         ▸ 'file_punct_kode'
        -- inc rgs 10 'kode'      ▸ 'file_ext_kode'
        
        rgs = ranges("    /some/path")
        -- inc rgs 6  'some'      ▸ 'text dir'
        -- inc rgs 10 '/'         ▸ 'punct dir'
        -- inc rgs 11 'path'      ▸ 'text file'
        
        rgs = ranges('    /some\\path/file.txt:10')
        -- inc rgs 5  '/'         ▸ 'punct dir'
        -- inc rgs 6  'some'      ▸ 'text dir'
        -- inc rgs 10  '\\'       ▸ 'punct dir'
        -- inc rgs 20 '.'         ▸ 'file_punct_txt'
        -- inc rgs 24 ':'         ▸ 'punct'
        
        rgs = ranges("    test  ./node_modules/.bin/mocha")
        -- inc rgs 5 'test'       ▸ 'property'
        -- inc rgs 11 '.'         ▸ 'punct dir'
        -- inc rgs 12 '/'         ▸ 'punct dir'
        -- inc rgs 13 'node_modules' ▸ 'text dir'
        -- inc rgs 25 '/'         ▸ 'punct dir'
        -- inc rgs 26 '.'         ▸ 'punct dir'
        -- inc rgs 27 'bin'       ▸ 'text dir'
        -- inc rgs 30 '/'         ▸ 'punct dir'
        -- inc rgs 31 'mocha'     ▸ 'text file'
        
        rgs = ranges("c   #999")
        test.cmp(inc(rgs, 5, "#"), 'punct')
        test.cmp(inc(rgs, 6, '999'), 'number hex')
        
        rgs = ranges("c   #abc")
        test.cmp(inc(rgs, 5, "#"), 'punct')
        test.cmp(inc(rgs, 6, 'abc'), 'number hex')
        
        rgs = ranges("c   #abcdef")
        test.cmp(inc(rgs, 5, "#"), 'punct')
        test.cmp(inc(rgs, 6, 'abcdef'), 'number hex')
        
        test("comments", function()
            rgs = ranges("   # bla blub")
            -- inc rgs 4  "#"      ▸ 'punct comment'
            -- inc rgs 6  "bla"    ▸ 'comment'
            -- inc rgs 10 "blub"   ▸ 'comment'
    end)
    end)
    
    -- 00000000   0000000   000      000      0000000     0000000    0000000  000   000  
    -- 000       000   000  000      000      000   000  000   000  000       000  000   
    -- 000000    000000000  000      000      0000000    000000000  000       0000000    
    -- 000       000   000  000      000      000   000  000   000  000       000  000   
    -- 000       000   000  0000000  0000000  0000000    000   000   0000000  000   000  
    
    test("fallback", function()
        lang('kode')
        
        local rgs = ranges('text', 'unknown')
        test.cmp(inc(rgs, 1, 'text'), 'text')
        
        rgs = ranges('text', 'fish')
        test.cmp(inc(rgs, 1, 'text'), 'text')
        
        rgs = ranges(' ###', 'kode')
        -- inc rgs 2 '###' ▸ 'punct comment triple'
    end)
    
    --  0000000   0000000   00     00  00     00  00000000  000   000  000000000   0000000  
    -- 000       000   000  000   000  000   000  000       0000  000     000     000       
    -- 000       000   000  000000000  000000000  0000000   000 0 000     000     0000000   
    -- 000       000   000  000 0 000  000 0 000  000       000  0000     000          000  
    --  0000000   0000000   000   000  000   000  00000000  000   000     000     0000000   
    
    test("comments", function()
        local rgs = ranges("hello # world")
        test.cmp(inc(rgs, 7, "#"), 'punct comment')
        -- inc rgs 9 "world"  ▸ 'comment'
    end)
    
    test("triple comment", function()
        local rgs = ranges("###a###")
        -- inc rgs 1 '###'  ▸ 'punct comment triple'
        -- inc rgs 4 "a"    ▸ 'comment triple'
        -- inc rgs 5 '###'  ▸ 'punct comment triple'
        
        local dss = dissect("###\na\n###")
        -- inc dss[1] 1 '###'   ▸ 'punct comment triple'
        -- inc dss[2] 1 'a'     ▸ 'comment triple'
        -- inc dss[3] 1 '###'   ▸ 'punct comment triple'
        
        lang('styl')
        dss = dissect("/*\na\n*/")
        -- inc dss[1] 1 "/"   ▸ 'punct comment triple'
        -- inc dss[1] 2 "*"   ▸ 'punct comment triple'
        -- inc dss[2] 1 "a"   ▸ 'comment triple'
        -- inc dss[3] 1 "*"   ▸ 'punct comment triple'
        -- inc dss[3] 2 "/"   ▸ 'punct comment triple'
    end)
    
    test("comment header", function()
        lang('kode')
        
        local rgs = ranges("# 0 00 0000")
        test.cmp(inc(rgs, 1, "#"), 'punct comment')
        test.cmp(inc(rgs, 3, "0"), 'comment header')
        test.cmp(inc(rgs, 5, "00"), 'comment header')
        test.cmp(inc(rgs, 8, "0000"), 'comment header')
        
        local dss = dissect("###\n 0 00 0 \n###")
        -- inc dss[2] 2 "0"   ▸ 'comment triple header'
        
        rgs = ranges("# 0 * 0.2")
        test.cmp(inc(rgs, 3, '0'), 'comment')
        test.cmp(inc(rgs, 7, '0'), 'comment')
        
        dss = dissect("###\n 0 1 0 \n###")
        -- inc dss[1] 1 "0"   ▸ 'number'
        
        lang('styl')
        
        rgs = ranges("// 000")
        -- inc rgs 4  "000"   ▸ 'comment header'
        
        dss = dissect("/*\n 0 0 0 \n*/")
        -- inc dss[1] 1 "0"   ▸ 'comment triple header'
    end)
    
    -- 000   000  000   000  00     00  0000000    00000000  00000000    0000000  
    -- 0000  000  000   000  000   000  000   000  000       000   000  000       
    -- 000 0 000  000   000  000000000  0000000    0000000   0000000    0000000   
    -- 000  0000  000   000  000 0 000  000   000  000       000   000       000  
    -- 000   000   0000000   000   000  0000000    00000000  000   000  0000000   
    
    test("numbers", function()
        local rgs = ranges("a 6670")
        test.cmp(inc(rgs, 3, "6670"), 'number')
        
        rgs = ranges("0x667AC")
        test.cmp(inc(rgs, 1, "0x667AC"), 'number hex')
        
        rgs = ranges("66.700")
        test.cmp(inc(rgs, 1, "66"), 'number float')
        test.cmp(inc(rgs, 3, "."), 'punct number float')
        test.cmp(inc(rgs, 4, "700"), 'number float')
        
        rgs = ranges("77.800 -100")
        test.cmp(inc(rgs, 1, "77"), 'number float')
        test.cmp(inc(rgs, 9, "100"), 'number')
        
        rgs = ranges("(8.9,100.2)")
        test.cmp(inc(rgs, 4, "9"), 'number float')
        test.cmp(inc(rgs, 10, "2"), 'number float')
        
        rgs = ranges("#f00")
        test.cmp(inc(rgs, 1, "#"), 'punct number hex')
        test.cmp(inc(rgs, 2, 'f00'), 'number hex')
        
        lang('kode')
        
        rgs = ranges("#f00")
        test.cmp(inc(rgs, 1, "#"), 'punct comment')
        -- inc rgs 2 'f00'    ▸ 'comment'
        
        rgs = ranges("'#f00'")
        test.cmp(inc(rgs, 2, "#"), 'string single')
        test.cmp(inc(rgs, 3, 'f00'), 'string single')
        
        rgs = ranges("'#808'")
        test.cmp(inc(rgs, 2, "#"), 'string single')
        test.cmp(inc(rgs, 3, '808'), 'string single')
    end)
    
    --  0000000  00000000  00     00  000   000  00000000  00000000   
    -- 000       000       000   000  000   000  000       000   000  
    -- 0000000   0000000   000000000   000 000   0000000   0000000    
    --      000  000       000 0 000     000     000       000   000  
    -- 0000000   00000000  000   000      0      00000000  000   000  
    
    test("semver    ", function()
        lang('coffee')
        
        local rgs = ranges("66.70.0")
        test.cmp(inc(rgs, 1, "66"), 'semver')
        test.cmp(inc(rgs, 3, "."), 'punct semver')
        test.cmp(inc(rgs, 4, "70"), 'semver')
        test.cmp(inc(rgs, 6, "."), 'punct semver')
        test.cmp(inc(rgs, 7, "0"), 'semver')
        
        rgs = ranges("^0.7.1")
        test.cmp(inc(rgs, 1, "^"), 'punct semver')
        test.cmp(inc(rgs, 2, "0"), 'semver')
        test.cmp(inc(rgs, 4, "7"), 'semver')
        test.cmp(inc(rgs, 6, "1"), 'semver')
        
        rgs = ranges("^1.0.0-alpha.12")
        test.cmp(inc(rgs, 2, "1"), 'semver')
        test.cmp(inc(rgs, 4, "0"), 'semver')
        test.cmp(inc(rgs, 6, "0"), 'semver')
        
        -- lang 'noon'
        
        rgs = ranges(">=6.7.9")
        test.cmp(inc(rgs, 1, ">"), 'punct semver')
        test.cmp(inc(rgs, 2, "="), 'punct semver')
        test.cmp(inc(rgs, 3, "6"), 'semver')
        test.cmp(inc(rgs, 4, "."), 'punct semver')
        test.cmp(inc(rgs, 5, "7"), 'semver')
        test.cmp(inc(rgs, 6, "."), 'punct semver')
        test.cmp(inc(rgs, 7, "9"), 'semver')
    end)
    
    --       000   0000000  
    --       000  000       
    --       000  0000000   
    -- 000   000       000  
    --  0000000   0000000   
    
    test("js", function()
        lang('js')
        
        local rgs = ranges("obj.prop.call(1);")
        test.cmp(inc(rgs, 1, 'obj'), 'obj')
        test.cmp(inc(rgs, 5, 'prop'), 'property')
        test.cmp(inc(rgs, 10, 'call'), 'function call')
        
        rgs = ranges("func = function() {")
        test.cmp(inc(rgs, 1, 'func'), 'function')
        test.cmp(inc(rgs, 8, 'function'), 'keyword function')
        
        rgs = ranges("obj.value = obj.another.value")
        test.cmp(inc(rgs, 1, "obj"), 'obj')
        test.cmp(inc(rgs, 5, "value"), 'property')
        test.cmp(inc(rgs, 13, "obj"), 'obj')
        test.cmp(inc(rgs, 17, "another"), 'property')
        test.cmp(inc(rgs, 25, "value"), 'property')
        
        rgs = ranges("a(2);")
        test.cmp(inc(rgs, 1, 'a'), 'function call')
        
        rgs = ranges("//# sourceMappingURL=data:")
        test.cmp(inc(rgs, 1, "/"), 'punct comment')
        test.cmp(inc(rgs, 2, "/"), 'punct comment')
        test.cmp(inc(rgs, 3, "#"), 'comment')
    end)
    
    --       ███   ███████   ███████   ███   ███
    --       ███  ███       ███   ███  ████  ███
    --       ███  ███████   ███   ███  ███ █ ███
    -- ███   ███       ███  ███   ███  ███  ████
    --  ███████   ███████    ███████   ███   ███
    
    test("json", function()
        lang('json')
        
        local dss = dissect([[
{
  "key": [
    "func.call"
  ]
}
]])
        
        test.cmp(inc(dss[3], 6, 'func'), 'string double')
    end)
    
    -- 000000000  000   000  000000000  
    --    000      000 000      000     
    --    000       00000       000     
    --    000      000 000      000     
    --    000     000   000     000     
    
    test("txt", function()
        lang('txt')
        
        local rgs = ranges("it's all we'll ever need. we'd never do that!")
        test.cmp(inc(rgs, 3, "'"), 'punct')
        test.cmp(inc(rgs, 4, "s"), 'text')
        test.cmp(inc(rgs, 12, "'"), 'punct')
        test.cmp(inc(rgs, 29, "'"), 'punct')
        
        rgs = ranges("'it' s, 'we' ll")
        test.cmp(inc(rgs, 1, "'"), 'punct string single')
        test.cmp(inc(rgs, 4, "'"), 'punct string single')
        test.cmp(inc(rgs, 6, "s"), 'text')
        test.cmp(inc(rgs, 9, "'"), 'punct string single')
        test.cmp(inc(rgs, 12, "'"), 'punct string single')
        test.cmp(inc(rgs, 14, "ll"), 'text')
        
        rgs = ranges("['s' 'll' 'd' 't']")
        test.cmp(inc(rgs, 2, "'"), 'punct string single')
        test.cmp(inc(rgs, 3, "s"), 'string single')
        test.cmp(inc(rgs, 4, "'"), 'punct string single')
        test.cmp(inc(rgs, 6, "'"), 'punct string single')
        test.cmp(inc(rgs, 9, "'"), 'punct string single')
    end)
    
    -- 000   000  000000000  00     00  000    
    -- 000   000     000     000   000  000    
    -- 000000000     000     000000000  000    
    -- 000   000     000     000 0 000  000    
    -- 000   000     000     000   000  0000000
    
    test("html", function()
        lang('html')
        
        local rgs = ranges("</div>")
        test.cmp(inc(rgs, 1, "<"), 'punct keyword')
        test.cmp(inc(rgs, 2, "/"), 'punct keyword')
        test.cmp(inc(rgs, 3, "div"), 'keyword')
        test.cmp(inc(rgs, 6, ">"), 'punct keyword')
        
        rgs = ranges("<div>")
        test.cmp(inc(rgs, 1, "<"), 'punct keyword')
        test.cmp(inc(rgs, 2, "div"), 'keyword')
        test.cmp(inc(rgs, 5, ">"), 'punct keyword')
    end)
    
    --  0000000   0000000   0000000  
    -- 000       000       000       
    -- 000       0000000   0000000   
    -- 000            000       000  
    --  0000000  0000000   0000000   
    
    test("css", function()
        lang('css')
        
        local rgs = ranges("0.5")
        test.cmp(inc(rgs, 1, "0"), 'number float')
        test.cmp(inc(rgs, 2, "."), 'punct number float')
        test.cmp(inc(rgs, 3, "5"), 'number float')
    end)
    
    test("styl", function()
        lang('styl')
        
        local rgs = ranges('   src    url("../font/NF.woff")')
        test.cmp(inc(rgs, 14, '('), 'punct minor')
        test.cmp(inc(rgs, 15, '"'), 'punct string double')
        test.cmp(inc(rgs, 16, '.'), 'string double')
        test.cmp(inc(rgs, 26, '.'), 'string double')
        test.cmp(inc(rgs, 27, 'woff'), 'string double')
        test.cmp(inc(rgs, 31, '"'), 'punct string double')
        -- log rgs
    end)
    
    --  0000000  00000000   00000000 
    -- 000       000   000  000   000
    -- 000       00000000   00000000 
    -- 000       000        000      
    --  0000000  000        000      
    
    test("cpp", function()
        lang('cpp')
        
        local rgs = ranges("#include")
        test.cmp(inc(rgs, 1, "#"), 'punct define')
        test.cmp(inc(rgs, 2, "include"), 'define')
        
        rgs = ranges("#if")
        test.cmp(inc(rgs, 1, "#"), 'punct define')
        test.cmp(inc(rgs, 2, "if"), 'define')
        
        rgs = ranges("#  if")
        test.cmp(inc(rgs, 1, "#"), 'punct define')
        test.cmp(inc(rgs, 4, "if"), 'define')
        
        rgs = ranges("if (true) {} else {}")
        test.cmp(inc(rgs, 1, "if"), 'keyword')
        test.cmp(inc(rgs, 5, "true"), 'keyword')
        test.cmp(inc(rgs, 14, "else"), 'keyword')
        
        rgs = ranges("1.0f")
        test.cmp(inc(rgs, 1, "1"), 'number float')
        test.cmp(inc(rgs, 2, "."), 'punct number float')
        test.cmp(inc(rgs, 3, "0f"), 'number float')
        
        rgs = ranges("0.0000f")
        test.cmp(inc(rgs, 3, "0000f"), 'number float')
        
        rgs = ranges("obj.value = obj.another.value;")
        test.cmp(inc(rgs, 1, "obj"), 'obj')
        test.cmp(inc(rgs, 5, "value"), 'property')
        test.cmp(inc(rgs, 13, "obj"), 'obj')
        test.cmp(inc(rgs, 17, "another"), 'property')
        test.cmp(inc(rgs, 25, "value"), 'property')
        
        rgs = ranges("Cast<targ>")
        test.cmp(inc(rgs, 5, '<'), 'punct template')
        test.cmp(inc(rgs, 6, 'targ'), 'template')
        test.cmp(inc(rgs, 10, '>'), 'punct template')
        
        rgs = ranges("TMap<FGrid, FRoute>")
        test.cmp(inc(rgs, 1, 'TMap'), 'keyword type')
        test.cmp(inc(rgs, 5, '<'), 'punct template')
        test.cmp(inc(rgs, 6, 'FGrid'), 'template')
        test.cmp(inc(rgs, 11, ','), 'punct template')
        test.cmp(inc(rgs, 13, 'FRoute'), 'template')
        test.cmp(inc(rgs, 19, '>'), 'punct template')
    end)
    
    -- 00     00  00     00  
    -- 000   000  000   000  
    -- 000000000  000000000  
    -- 000 0 000  000 0 000  
    -- 000   000  000   000  
    
    test("mm", function()
        lang('mm')
        
        local rgs = ranges("@import")
        test.cmp(inc(rgs, 1, "@"), 'punct')
        test.cmp(inc(rgs, 2, "import"), 'define')
        
        rgs = ranges("@implementation")
        test.cmp(inc(rgs, 1, "@"), 'punct')
        test.cmp(inc(rgs, 2, "implementation"), 'define')
        
        rgs = ranges("@interface")
        test.cmp(inc(rgs, 1, "@"), 'punct')
        test.cmp(inc(rgs, 2, "interface"), 'define')
        
        rgs = ranges("@synthesize")
        test.cmp(inc(rgs, 1, "@"), 'punct')
        test.cmp(inc(rgs, 2, "synthesize"), 'define')
        
        rgs = ranges("@property")
        test.cmp(inc(rgs, 1, "@"), 'punct')
        test.cmp(inc(rgs, 2, "property"), 'define')
        
        test("NSString", function()
            rgs = ranges('@"X"')
            test.cmp(inc(rgs, 1, "@"), 'punct')
            test.cmp(inc(rgs, 2, '"'), 'punct string double')
            test.cmp(inc(rgs, 3, 'X'), 'string double')
            test.cmp(inc(rgs, 4, '"'), 'punct string double')
            
            rgs = ranges('@"%@"')
            test.cmp(inc(rgs, 1, "@"), 'punct')
            test.cmp(inc(rgs, 2, '"'), 'punct string double')
            test.cmp(inc(rgs, 3, '%'), 'string double')
            test.cmp(inc(rgs, 4, '@'), 'string double')
            test.cmp(inc(rgs, 5, '"'), 'punct string double')
    end)
    end)
    
    --  0000000  000   000  
    -- 000       000   000  
    -- 0000000   000000000  
    --      000  000   000  
    -- 0000000   000   000  
    
    test("sh", function()
        lang('sh')
        
        local rgs = ranges("dir/path/with/dashes/file.txt")
        -- inc rgs 1 'dir'        ▸ 'text dir'
        -- inc rgs 5 'path'       ▸ 'text dir'
        -- inc rgs 10 'with'      ▸ 'text dir'
        -- inc rgs 15 'dashes'    ▸ 'text dir'
        
        rgs = ranges("prg --arg1 -arg2")
        test.cmp(inc(rgs, 5, '-'), 'punct argument')
        test.cmp(inc(rgs, 6, '-'), 'punct argument')
        test.cmp(inc(rgs, 7, 'arg1'), 'argument')
        test.cmp(inc(rgs, 12, '-'), 'punct argument')
        test.cmp(inc(rgs, 13, 'arg2'), 'argument')
        
        rgs = ranges("cd ~")
        test.cmp(inc(rgs, 4, '~'), 'text dir')
        
        rgs = ranges("~/home")
        test.cmp(inc(rgs, 1, '~'), 'text dir')
        -- inc rgs 2 '/'          ▸ 'punct dir'
        test.cmp(inc(rgs, 3, 'home'), 'text file')
    end)
    
    -- 000       0000000    0000000   
    -- 000      000   000  000        
    -- 000      000   000  000  0000  
    -- 000      000   000  000   000  
    -- 0000000   0000000    0000000   
    
    test("log", function()
        lang('log')
        
        local rgs = ranges("http://domain.com")
        test.cmp(inc(rgs, 1, 'http'), 'url protocol')
        test.cmp(inc(rgs, 5, ':'), 'punct url')
        test.cmp(inc(rgs, 6, '/'), 'punct url')
        test.cmp(inc(rgs, 7, '/'), 'punct url')
        test.cmp(inc(rgs, 8, 'domain'), 'url domain')
        test.cmp(inc(rgs, 14, '.'), 'punct url tld')
        test.cmp(inc(rgs, 15, 'com'), 'url tld')
        
        rgs = ranges("file.coffee")
        -- inc rgs 1 'file'           ▸ 'file_coffee'
        -- inc rgs 5 '.'              ▸ 'file_punct_coffee'
        -- inc rgs 6 'coffee'         ▸ 'file_ext_coffee'
        
        rgs = ranges("/some/path")
        -- inc rgs 2 'some'           ▸ 'text dir'
        -- inc rgs 6 '/'              ▸ 'punct dir'
        
        rgs = ranges("key: value")
        test.cmp(inc(rgs, 1, 'key'), 'dictionary key')
        test.cmp(inc(rgs, 4, ':'), 'punct dictionary')
    end)
    
    -- 00     00  0000000    
    -- 000   000  000   000  
    -- 000000000  000   000  
    -- 000 0 000  000   000  
    -- 000   000  0000000    
    
    test("md", function()
        lang('md')
        
        local rgs = ranges("**bold**")
        test.cmp(inc(rgs, 1, '*'), 'punct bold')
        test.cmp(inc(rgs, 2, '*'), 'punct bold')
        test.cmp(inc(rgs, 3, 'bold'), 'text bold')
        test.cmp(inc(rgs, 7, '*'), 'punct bold')
        test.cmp(inc(rgs, 8, '*'), 'punct bold')
        
        rgs = ranges(",**b**,")
        test.cmp(inc(rgs, 2, '*'), 'punct bold')
        test.cmp(inc(rgs, 4, 'b'), 'text bold')
        test.cmp(inc(rgs, 5, '*'), 'punct bold')
        
        rgs = ranges("*it lic*")
        test.cmp(inc(rgs, 1, '*'), 'punct italic')
        test.cmp(inc(rgs, 2, 'it'), 'text italic')
        test.cmp(inc(rgs, 5, 'lic'), 'text italic')
        test.cmp(inc(rgs, 8, '*'), 'punct italic')
        
        rgs = ranges("*italic*")
        test.cmp(inc(rgs, 1, '*'), 'punct italic')
        test.cmp(inc(rgs, 2, 'italic'), 'text italic')
        test.cmp(inc(rgs, 8, '*'), 'punct italic')
        
        rgs = ranges("*`italic code`*")
        test.cmp(inc(rgs, 1, '*'), 'punct italic')
        test.cmp(inc(rgs, 2, '`'), 'punct italic code')
        test.cmp(inc(rgs, 3, 'italic'), 'text italic code')
        test.cmp(inc(rgs, 10, 'code'), 'text italic code')
        test.cmp(inc(rgs, 15, '*'), 'punct italic')
        
        rgs = ranges("it's good")
        test.cmp(inc(rgs, 1, 'it'), 'text')
        test.cmp(inc(rgs, 3, "'"), 'punct')
        test.cmp(inc(rgs, 4, 's'), 'text')
        
        rgs = ranges("if is empty in then")
        test.cmp(inc(rgs, 1, 'if'), 'text')
        test.cmp(inc(rgs, 4, 'is'), 'text')
        test.cmp(inc(rgs, 7, 'empty'), 'text')
        test.cmp(inc(rgs, 13, 'in'), 'text')
        test.cmp(inc(rgs, 16, 'then'), 'text')
        
        rgs = ranges('text files. bla')
        test.cmp(inc(rgs, 1, 'text'), 'text')
        test.cmp(inc(rgs, 11, '.'), 'punct')
        
        rgs = ranges('..bla')
        test.cmp(inc(rgs, 1, '.'), 'punct')
        test.cmp(inc(rgs, 2, '.'), 'punct')
        
        rgs = ranges('```coffeescript')
        test.cmp(inc(rgs, 1, '`'), 'punct code triple')
        test.cmp(inc(rgs, 4, 'coffeescript'), 'comment')
    end)
    
    test("md2", function()
        lang('md')
        
        local rgs = ranges("- li")
        -- inc rgs 1 '-'      ▸ 'punct li1 marker'
        -- inc rgs 3 'li'     ▸ 'text li1'
        
        rgs = ranges("    - **bold**")
        -- inc rgs 5 '-'      ▸ 'punct li2 marker'
        -- inc rgs 9 'bold'   ▸ 'text li2 bold'
        
        rgs = ranges("        - **bold**")
        -- inc rgs 9 '-'      ▸ 'punct li3 marker'
        -- inc rgs 13 'bold'  ▸ 'text li3 bold'
        
        rgs = ranges("        * **bold**")
        -- inc rgs 9 '*'      ▸ 'punct li3 marker'
        -- inc rgs 13 'bold'  ▸ 'text li3 bold'
        
        local dss = dissect([[
- li1
text
]])
        
        -- inc dss[1] 1  '-'    ▸ 'punct li1 marker'
        test.cmp(inc(dss[2], 1, 'text'), 'text')
        
        dss = dissect([[
# h1
## h2
### h3
#### h4
##### h5
]])
        
        -- inc dss[1] 1  "#"    ▸ 'punct h1'
        -- inc dss[1] 3  "h1"   ▸ 'text h1'
        -- inc dss[2] 1  "#"    ▸ 'punct h2'
        -- inc dss[2] 4  "h2"   ▸ 'text h2'
        -- inc dss[3] 1  "#"    ▸ 'punct h3'
        -- inc dss[3] 5  "h3"   ▸ 'text h3'
        -- inc dss[4] 1  "#"    ▸ 'punct h4'
        -- inc dss[4] 6  "h4"   ▸ 'text h4'
        -- inc dss[5] 1  "#"    ▸ 'punct h5'
        -- inc dss[5] 7  "h5"   ▸ 'text h5'
        
        dss = dissect('```js\n```')
        test.cmp(inc(dss[1], 1, '`'), 'punct code triple')
        
        dss = dissect([[
abc
    def    hello number 0.123
- num 0.2 
]])
        
        test.cmp(inc(dss[2], 25, '0'), 'number float')
        test.cmp(inc(dss[2], 26, '.'), 'punct number float')
        test.cmp(inc(dss[2], 27, '123'), 'number float')
        
        test.cmp(inc(dss[3], 7, '0'), 'number float')
        test.cmp(inc(dss[3], 8, '.'), 'punct number float')
        test.cmp(inc(dss[3], 9, '2'), 'number float')
        
        dss = dissect([[
ugga
    - fix me!
]])
        
        -- inc dss[2] 5 '-' ▸ 'punct li2 marker'
        
        dss = dissect([[
ugga
     - fix me!
]])
        
        -- inc dss[2] 6 '-' ▸ 'punct li2 marker'
        
        dss = dissect([[
ugga
      - fix me!
]])
        
        -- inc dss[2] 7 '-' ▸ 'punct li2 marker'
    end)
    
    -- 000   000  000   000  000   0000000   0000000   0000000    00000000  
    -- 000   000  0000  000  000  000       000   000  000   000  000       
    -- 000   000  000 0 000  000  000       000   000  000   000  0000000   
    -- 000   000  000  0000  000  000       000   000  000   000  000       
    --  0000000   000   000  000   0000000   0000000   0000000    00000000  
    
    --▸ unicode
    --    
    --    rgs = ranges "🌈"
    --    inc rgs 0 '🌈' ▸  'text unicode'
    --    
    --    rgs[0] ▸ { start:0 length:2 match:'🌈' turd: '🌈' clss: 'text unicode' }
    --    
    --    rgs = ranges "🌈🌱"
    --    inc rgs 0 '🌈' ▸ 'text unicode'
    --    inc rgs 2 '🌱' ▸ 'text unicode'
    --      
    --    rgs = ranges "🙂lol😀"
    --    inc rgs 0 '🙂'   ▸   'text unicode'
    --    inc rgs 2 'lol'  ▸   'text'
    --    inc rgs 5 '😀'    ▸  'text unicode'
    --    rgs = ranges "a➜b"
    --    inc rgs 1 '➜' ▸ 'punct keyword'
    --    rgs = ranges '┌─┬─┐'
    --    inc rgs 0 '┌' ▸ 'text unicode'
    --    inc rgs 1 '─' ▸ 'text unicode'
    --    inc rgs 2 '┬' ▸ 'text unicode'
    --    inc rgs 3 '─' ▸ 'text unicode'
    --    inc rgs 4 '┐' ▸ 'text unicode'
    --    rgs = ranges "🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥"
    --    inc rgs 0  '🐀' ▸ 'text unicode'
    --    inc rgs 24 '🐌' ▸ 'text unicode'
    --  
    --    rgs = ranges "'🔧' bla:1"
    --    inc rgs 5 'bla' ▸ 'dictionary key'
    --      
    --    rgs = ranges "icon: '🔧' bla:1"
    --    inc rgs 11 'bla' ▸ 'dictionary key'
    end)