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
        test.cmp(inc(dss[0], 0, "a"), 'function')
        test.cmp(inc(dss[0], 2, "="), 'punct function')
        test.cmp(inc(dss[0], 4, "b"), 'function argument')
        test.cmp(inc(dss[0], 6, "->"), 'punct function')
        
        dss = dissect("->")
        test.cmp(inc(dss[0], 0, "->"), 'punct function')
        
        dss = dissect("    -> true")
        test.cmp(inc(dss[0], 4, "->"), 'punct function')
        
        dss = dissect("=>")
        test.cmp(inc(dss[0], 0, "=>"), 'punct function bound')
        
        dss = dissect("    => true")
        test.cmp(inc(dss[0], 4, "=>"), 'punct function bound')
    end)
    
    -- ███   ███   ███████    ███████   ███   ███
    -- ████  ███  ███   ███  ███   ███  ████  ███
    -- ███ █ ███  ███   ███  ███   ███  ███ █ ███
    -- ███  ████  ███   ███  ███   ███  ███  ████
    -- ███   ███   ███████    ███████   ███   ███
    
    test("noon", function()
        lang('noon')
        
        local rgs = ranges("    property  value")
        test.cmp(inc(rgs, 4, 'property'), 'property')
        test.cmp(inc(rgs, 14, 'value'), 'text')
        
        rgs = ranges("top", 'noon')
        test.cmp(inc(rgs, 0, 'top'), 'obj')
        
        rgs = ranges("tip top")
        test.cmp(inc(rgs, 0, 'tip'), 'obj')
        test.cmp(inc(rgs, 4, 'top'), 'obj')
        
        rgs = ranges("top  prop")
        test.cmp(inc(rgs, 0, 'top'), 'obj')
        test.cmp(inc(rgs, 5, 'prop'), 'text')
        
        rgs = ranges("version  ^0.1.2")
        test.cmp(inc(rgs, 0, 'version'), 'obj')
        test.cmp(inc(rgs, 9, '^'), 'punct semver')
        test.cmp(inc(rgs, 10, '0'), 'semver')
        
        rgs = ranges("    some-package-name  1")
        test.cmp(inc(rgs, 4, 'some'), 'property')
        test.cmp(inc(rgs, 9, 'package'), 'property')
        test.cmp(inc(rgs, 17, 'name'), 'property')
        
        rgs = ranges("    some-package-name  ^1.2.3")
        test.cmp(inc(rgs, 4, 'some'), 'property')
        test.cmp(inc(rgs, 9, 'package'), 'property')
        test.cmp(inc(rgs, 17, 'name'), 'property')
        
        rgs = ranges("top  prop  value")
        test.cmp(inc(rgs, 0, 'top'), 'obj')
        test.cmp(inc(rgs, 5, 'prop'), 'property')
        test.cmp(inc(rgs, 11, 'value'), 'text')
        
        rgs = ranges("    http://domain.com")
        test.cmp(inc(rgs, 4, 'http'), 'url protocol')
        test.cmp(inc(rgs, 8, ':'), 'punct url')
        test.cmp(inc(rgs, 9, '/'), 'punct url')
        test.cmp(inc(rgs, 10, '/'), 'punct url')
        test.cmp(inc(rgs, 11, 'domain'), 'url domain')
        test.cmp(inc(rgs, 17, '.'), 'punct url tld')
        test.cmp(inc(rgs, 18, 'com'), 'url tld')
        
        rgs = ranges("    http://domain.com/dir/page.html")
        test.cmp(inc(rgs, 4, 'http'), 'url protocol')
        test.cmp(inc(rgs, 8, ':'), 'punct url')
        test.cmp(inc(rgs, 9, '/'), 'punct url')
        test.cmp(inc(rgs, 10, '/'), 'punct url')
        test.cmp(inc(rgs, 11, 'domain'), 'url domain')
        test.cmp(inc(rgs, 17, '.'), 'punct url tld')
        test.cmp(inc(rgs, 18, 'com'), 'url tld')
        test.cmp(inc(rgs, 21, '/'), 'punct dir')
        
        rgs = ranges("    file.kode")
        test.cmp(inc(rgs, 4, 'file'), 'file_kode')
        test.cmp(inc(rgs, 8, '.'), 'file_punct_kode')
        test.cmp(inc(rgs, 9, 'kode'), 'file_ext_kode')
        
        rgs = ranges("    /some/path")
        test.cmp(inc(rgs, 5, 'some'), 'text dir')
        test.cmp(inc(rgs, 9, '/'), 'punct dir')
        test.cmp(inc(rgs, 10, 'path'), 'text file')
        
        rgs = ranges('    /some\\path/file.txt:10')
        test.cmp(inc(rgs, 4, '/'), 'punct dir')
        test.cmp(inc(rgs, 5, 'some'), 'text dir')
        test.cmp(inc(rgs, 9, '\\'), 'punct dir')
        test.cmp(inc(rgs, 19, '.'), 'file_punct_txt')
        test.cmp(inc(rgs, 23, ':'), 'punct')
        
        rgs = ranges("    test  ./node_modules/.bin/mocha")
        test.cmp(inc(rgs, 4, 'test'), 'property')
        test.cmp(inc(rgs, 10, '.'), 'punct dir')
        test.cmp(inc(rgs, 11, '/'), 'punct dir')
        test.cmp(inc(rgs, 12, 'node_modules'), 'text dir')
        test.cmp(inc(rgs, 24, '/'), 'punct dir')
        test.cmp(inc(rgs, 25, '.'), 'punct dir')
        test.cmp(inc(rgs, 26, 'bin'), 'text dir')
        test.cmp(inc(rgs, 29, '/'), 'punct dir')
        test.cmp(inc(rgs, 30, 'mocha'), 'text file')
        
        rgs = ranges("c   #999")
        test.cmp(inc(rgs, 4, "#"), 'punct')
        test.cmp(inc(rgs, 5, '999'), 'number hex')
        
        rgs = ranges("c   #abc")
        test.cmp(inc(rgs, 4, "#"), 'punct')
        test.cmp(inc(rgs, 5, 'abc'), 'number hex')
        
        rgs = ranges("c   #abcdef")
        test.cmp(inc(rgs, 4, "#"), 'punct')
        test.cmp(inc(rgs, 5, 'abcdef'), 'number hex')
        
        test("comments", function()
            rgs = ranges("   # bla blub")
            test.cmp(inc(rgs, 3, "#"), 'punct comment')
            test.cmp(inc(rgs, 5, "bla"), 'comment')
            test.cmp(inc(rgs, 9, "blub"), 'comment')
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
        test.cmp(inc(rgs, 0, 'text'), 'text')
        
        rgs = ranges('text', 'fish')
        test.cmp(inc(rgs, 0, 'text'), 'text')
        
        rgs = ranges(' ###', 'kode')
        test.cmp(inc(rgs, 1, '###'), 'punct comment triple')
    end)
    
    --  0000000   0000000   00     00  00     00  00000000  000   000  000000000   0000000  
    -- 000       000   000  000   000  000   000  000       0000  000     000     000       
    -- 000       000   000  000000000  000000000  0000000   000 0 000     000     0000000   
    -- 000       000   000  000 0 000  000 0 000  000       000  0000     000          000  
    --  0000000   0000000   000   000  000   000  00000000  000   000     000     0000000   
    
    test("comments", function()
        local rgs = ranges("hello # world")
        test.cmp(inc(rgs, 6, "#"), 'punct comment')
        test.cmp(inc(rgs, 8, "world"), 'comment')
    end)
    
    test("triple comment", function()
        local rgs = ranges("###a###")
        test.cmp(inc(rgs, 0, '###'), 'punct comment triple')
        test.cmp(inc(rgs, 3, "a"), 'comment triple')
        test.cmp(inc(rgs, 4, '###'), 'punct comment triple')
        
        local dss = dissect("###\na\n###")
        test.cmp(inc(dss[0], 0, '###'), 'punct comment triple')
        test.cmp(inc(dss[1], 0, 'a'), 'comment triple')
        test.cmp(inc(dss[2], 0, '###'), 'punct comment triple')
        
        lang('styl')
        dss = dissect("/*\na\n*/")
        test.cmp(inc(dss[0], 0, "/"), 'punct comment triple')
        test.cmp(inc(dss[0], 1, "*"), 'punct comment triple')
        test.cmp(inc(dss[1], 0, "a"), 'comment triple')
        test.cmp(inc(dss[2], 0, "*"), 'punct comment triple')
        test.cmp(inc(dss[2], 1, "/"), 'punct comment triple')
    end)
    
    test("comment header", function()
        lang('kode')
        
        local rgs = ranges("# 0 00 0000")
        test.cmp(inc(rgs, 0, "#"), 'punct comment')
        test.cmp(inc(rgs, 2, "0"), 'comment header')
        test.cmp(inc(rgs, 4, "00"), 'comment header')
        test.cmp(inc(rgs, 7, "0000"), 'comment header')
        
        local dss = dissect("###\n 0 00 0 \n###")
        test.cmp(inc(dss[1], 1, "0"), 'comment triple header')
        
        rgs = ranges("# 0 * 0.2")
        test.cmp(inc(rgs, 2, '0'), 'comment')
        test.cmp(inc(rgs, 6, '0'), 'comment')
        
        dss = dissect("###\n 0 1 0 \n###")
        test.cmp(inc(dss[1], 1, "0"), 'number')
        
        lang('styl')
        
        rgs = ranges("// 000")
        test.cmp(inc(rgs, 3, "000"), 'comment header')
        
        dss = dissect("/*\n 0 0 0 \n*/")
        test.cmp(inc(dss[1], 1, "0"), 'comment triple header')
    end)
    
    -- 000   000  000   000  00     00  0000000    00000000  00000000    0000000  
    -- 0000  000  000   000  000   000  000   000  000       000   000  000       
    -- 000 0 000  000   000  000000000  0000000    0000000   0000000    0000000   
    -- 000  0000  000   000  000 0 000  000   000  000       000   000       000  
    -- 000   000   0000000   000   000  0000000    00000000  000   000  0000000   
    
    test("numbers", function()
        local rgs = ranges("a 6670")
        test.cmp(inc(rgs, 2, "6670"), 'number')
        
        rgs = ranges("0x667AC")
        test.cmp(inc(rgs, 0, "0x667AC"), 'number hex')
        
        rgs = ranges("66.700")
        test.cmp(inc(rgs, 0, "66"), 'number float')
        test.cmp(inc(rgs, 2, "."), 'punct number float')
        test.cmp(inc(rgs, 3, "700"), 'number float')
        
        rgs = ranges("77.800 -100")
        test.cmp(inc(rgs, 0, "77"), 'number float')
        test.cmp(inc(rgs, 8, "100"), 'number')
        
        rgs = ranges("(8.9,100.2)")
        test.cmp(inc(rgs, 3, "9"), 'number float')
        test.cmp(inc(rgs, 9, "2"), 'number float')
        
        rgs = ranges("#f00")
        test.cmp(inc(rgs, 0, "#"), 'punct number hex')
        test.cmp(inc(rgs, 1, 'f00'), 'number hex')
        
        lang('kode')
        
        rgs = ranges("#f00")
        test.cmp(inc(rgs, 0, "#"), 'punct comment')
        test.cmp(inc(rgs, 1, 'f00'), 'comment')
        
        rgs = ranges("'#f00'")
        test.cmp(inc(rgs, 1, "#"), 'string single')
        test.cmp(inc(rgs, 2, 'f00'), 'string single')
        
        rgs = ranges("'#808'")
        test.cmp(inc(rgs, 1, "#"), 'string single')
        test.cmp(inc(rgs, 2, '808'), 'string single')
    end)
    
    --  0000000  00000000  00     00  000   000  00000000  00000000   
    -- 000       000       000   000  000   000  000       000   000  
    -- 0000000   0000000   000000000   000 000   0000000   0000000    
    --      000  000       000 0 000     000     000       000   000  
    -- 0000000   00000000  000   000      0      00000000  000   000  
    
    test("semver    ", function()
        lang('coffee')
        
        local rgs = ranges("66.70.0")
        test.cmp(inc(rgs, 0, "66"), 'semver')
        test.cmp(inc(rgs, 2, "."), 'punct semver')
        test.cmp(inc(rgs, 3, "70"), 'semver')
        test.cmp(inc(rgs, 5, "."), 'punct semver')
        test.cmp(inc(rgs, 6, "0"), 'semver')
        
        rgs = ranges("^0.7.1")
        test.cmp(inc(rgs, 0, "^"), 'punct semver')
        test.cmp(inc(rgs, 1, "0"), 'semver')
        test.cmp(inc(rgs, 3, "7"), 'semver')
        test.cmp(inc(rgs, 5, "1"), 'semver')
        
        rgs = ranges("^1.0.0-alpha.12")
        test.cmp(inc(rgs, 1, "1"), 'semver')
        test.cmp(inc(rgs, 3, "0"), 'semver')
        test.cmp(inc(rgs, 5, "0"), 'semver')
        
        -- lang 'noon'
        
        rgs = ranges(">=6.7.9")
        test.cmp(inc(rgs, 0, ">"), 'punct semver')
        test.cmp(inc(rgs, 1, "="), 'punct semver')
        test.cmp(inc(rgs, 2, "6"), 'semver')
        test.cmp(inc(rgs, 3, "."), 'punct semver')
        test.cmp(inc(rgs, 4, "7"), 'semver')
        test.cmp(inc(rgs, 5, "."), 'punct semver')
        test.cmp(inc(rgs, 6, "9"), 'semver')
    end)
    
    --       000   0000000  
    --       000  000       
    --       000  0000000   
    -- 000   000       000  
    --  0000000   0000000   
    
    test("js", function()
        lang('js')
        
        local rgs = ranges("obj.prop.call(1);")
        test.cmp(inc(rgs, 0, 'obj'), 'obj')
        test.cmp(inc(rgs, 4, 'prop'), 'property')
        test.cmp(inc(rgs, 9, 'call'), 'function call')
        
        rgs = ranges("func = function() {")
        test.cmp(inc(rgs, 0, 'func'), 'function')
        test.cmp(inc(rgs, 7, 'function'), 'keyword function')
        
        rgs = ranges("obj.value = obj.another.value")
        test.cmp(inc(rgs, 0, "obj"), 'obj')
        test.cmp(inc(rgs, 4, "value"), 'property')
        test.cmp(inc(rgs, 12, "obj"), 'obj')
        test.cmp(inc(rgs, 16, "another"), 'property')
        test.cmp(inc(rgs, 24, "value"), 'property')
        
        rgs = ranges("a(2);")
        test.cmp(inc(rgs, 0, 'a'), 'function call')
        
        rgs = ranges("//# sourceMappingURL=data:")
        test.cmp(inc(rgs, 0, "/"), 'punct comment')
        test.cmp(inc(rgs, 1, "/"), 'punct comment')
        test.cmp(inc(rgs, 2, "#"), 'comment')
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
        
        test.cmp(inc(dss[2], 5, 'func'), 'string double')
    end)
    
    -- 000000000  000   000  000000000  
    --    000      000 000      000     
    --    000       00000       000     
    --    000      000 000      000     
    --    000     000   000     000     
    
    test("txt", function()
        lang('txt')
        
        local rgs = ranges("it's all we'll ever need. we'd never do that!")
        test.cmp(inc(rgs, 2, "'"), 'punct')
        test.cmp(inc(rgs, 3, "s"), 'text')
        test.cmp(inc(rgs, 11, "'"), 'punct')
        test.cmp(inc(rgs, 28, "'"), 'punct')
        
        rgs = ranges("'it' s, 'we' ll")
        test.cmp(inc(rgs, 0, "'"), 'punct string single')
        test.cmp(inc(rgs, 3, "'"), 'punct string single')
        test.cmp(inc(rgs, 5, "s"), 'text')
        test.cmp(inc(rgs, 8, "'"), 'punct string single')
        test.cmp(inc(rgs, 11, "'"), 'punct string single')
        test.cmp(inc(rgs, 13, "ll"), 'text')
        
        rgs = ranges("['s' 'll' 'd' 't']")
        test.cmp(inc(rgs, 1, "'"), 'punct string single')
        test.cmp(inc(rgs, 2, "s"), 'string single')
        test.cmp(inc(rgs, 3, "'"), 'punct string single')
        test.cmp(inc(rgs, 5, "'"), 'punct string single')
        test.cmp(inc(rgs, 8, "'"), 'punct string single')
    end)
    
    -- 000   000  000000000  00     00  000    
    -- 000   000     000     000   000  000    
    -- 000000000     000     000000000  000    
    -- 000   000     000     000 0 000  000    
    -- 000   000     000     000   000  0000000
    
    test("html", function()
        lang('html')
        
        local rgs = ranges("</div>")
        test.cmp(inc(rgs, 0, "<"), 'punct keyword')
        test.cmp(inc(rgs, 1, "/"), 'punct keyword')
        test.cmp(inc(rgs, 2, "div"), 'keyword')
        test.cmp(inc(rgs, 5, ">"), 'punct keyword')
        
        rgs = ranges("<div>")
        test.cmp(inc(rgs, 0, "<"), 'punct keyword')
        test.cmp(inc(rgs, 1, "div"), 'keyword')
        test.cmp(inc(rgs, 4, ">"), 'punct keyword')
    end)
    
    --  0000000   0000000   0000000  
    -- 000       000       000       
    -- 000       0000000   0000000   
    -- 000            000       000  
    --  0000000  0000000   0000000   
    
    test("css", function()
        lang('css')
        
        local rgs = ranges("0.5")
        test.cmp(inc(rgs, 0, "0"), 'number float')
        test.cmp(inc(rgs, 1, "."), 'punct number float')
        test.cmp(inc(rgs, 2, "5"), 'number float')
    end)
    
    test("styl", function()
        lang('styl')
        
        local rgs = ranges('   src    url("../font/NF.woff")')
        test.cmp(inc(rgs, 13, '('), 'punct minor')
        test.cmp(inc(rgs, 14, '"'), 'punct string double')
        test.cmp(inc(rgs, 15, '.'), 'string double')
        test.cmp(inc(rgs, 25, '.'), 'string double')
        test.cmp(inc(rgs, 26, 'woff'), 'string double')
        test.cmp(inc(rgs, 30, '"'), 'punct string double')
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
        test.cmp(inc(rgs, 0, "#"), 'punct define')
        test.cmp(inc(rgs, 1, "include"), 'define')
        
        rgs = ranges("#if")
        test.cmp(inc(rgs, 0, "#"), 'punct define')
        test.cmp(inc(rgs, 1, "if"), 'define')
        
        rgs = ranges("#  if")
        test.cmp(inc(rgs, 0, "#"), 'punct define')
        test.cmp(inc(rgs, 3, "if"), 'define')
        
        rgs = ranges("if (true) {} else {}")
        test.cmp(inc(rgs, 0, "if"), 'keyword')
        test.cmp(inc(rgs, 4, "true"), 'keyword')
        test.cmp(inc(rgs, 13, "else"), 'keyword')
        
        rgs = ranges("1.0f")
        test.cmp(inc(rgs, 0, "1"), 'number float')
        test.cmp(inc(rgs, 1, "."), 'punct number float')
        test.cmp(inc(rgs, 2, "0f"), 'number float')
        
        rgs = ranges("0.0000f")
        test.cmp(inc(rgs, 2, "0000f"), 'number float')
        
        rgs = ranges("obj.value = obj.another.value;")
        test.cmp(inc(rgs, 0, "obj"), 'obj')
        test.cmp(inc(rgs, 4, "value"), 'property')
        test.cmp(inc(rgs, 12, "obj"), 'obj')
        test.cmp(inc(rgs, 16, "another"), 'property')
        test.cmp(inc(rgs, 24, "value"), 'property')
        
        rgs = ranges("Cast<targ>")
        test.cmp(inc(rgs, 4, '<'), 'punct template')
        test.cmp(inc(rgs, 5, 'targ'), 'template')
        test.cmp(inc(rgs, 9, '>'), 'punct template')
        
        rgs = ranges("TMap<FGrid, FRoute>")
        test.cmp(inc(rgs, 0, 'TMap'), 'keyword type')
        test.cmp(inc(rgs, 4, '<'), 'punct template')
        test.cmp(inc(rgs, 5, 'FGrid'), 'template')
        test.cmp(inc(rgs, 10, ','), 'punct template')
        test.cmp(inc(rgs, 12, 'FRoute'), 'template')
        test.cmp(inc(rgs, 18, '>'), 'punct template')
    end)
    
    -- 00     00  00     00  
    -- 000   000  000   000  
    -- 000000000  000000000  
    -- 000 0 000  000 0 000  
    -- 000   000  000   000  
    
    test("mm", function()
        lang('mm')
        
        local rgs = ranges("@import")
        test.cmp(inc(rgs, 0, "@"), 'punct')
        test.cmp(inc(rgs, 1, "import"), 'define')
        
        rgs = ranges("@implementation")
        test.cmp(inc(rgs, 0, "@"), 'punct')
        test.cmp(inc(rgs, 1, "implementation"), 'define')
        
        rgs = ranges("@interface")
        test.cmp(inc(rgs, 0, "@"), 'punct')
        test.cmp(inc(rgs, 1, "interface"), 'define')
        
        rgs = ranges("@synthesize")
        test.cmp(inc(rgs, 0, "@"), 'punct')
        test.cmp(inc(rgs, 1, "synthesize"), 'define')
        
        rgs = ranges("@property")
        test.cmp(inc(rgs, 0, "@"), 'punct')
        test.cmp(inc(rgs, 1, "property"), 'define')
        
        test("NSString", function()
            rgs = ranges('@"X"')
            test.cmp(inc(rgs, 0, "@"), 'punct')
            test.cmp(inc(rgs, 1, '"'), 'punct string double')
            test.cmp(inc(rgs, 2, 'X'), 'string double')
            test.cmp(inc(rgs, 3, '"'), 'punct string double')
            
            rgs = ranges('@"%@"')
            test.cmp(inc(rgs, 0, "@"), 'punct')
            test.cmp(inc(rgs, 1, '"'), 'punct string double')
            test.cmp(inc(rgs, 2, '%'), 'string double')
            test.cmp(inc(rgs, 3, '@'), 'string double')
            test.cmp(inc(rgs, 4, '"'), 'punct string double')
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
        test.cmp(inc(rgs, 0, 'dir'), 'text dir')
        test.cmp(inc(rgs, 4, 'path'), 'text dir')
        test.cmp(inc(rgs, 9, 'with'), 'text dir')
        test.cmp(inc(rgs, 14, 'dashes'), 'text dir')
        
        rgs = ranges("prg --arg1 -arg2")
        test.cmp(inc(rgs, 4, '-'), 'punct argument')
        test.cmp(inc(rgs, 5, '-'), 'punct argument')
        test.cmp(inc(rgs, 6, 'arg1'), 'argument')
        test.cmp(inc(rgs, 11, '-'), 'punct argument')
        test.cmp(inc(rgs, 12, 'arg2'), 'argument')
        
        rgs = ranges("cd ~")
        test.cmp(inc(rgs, 3, '~'), 'text dir')
        
        rgs = ranges("~/home")
        test.cmp(inc(rgs, 0, '~'), 'text dir')
        test.cmp(inc(rgs, 1, '/'), 'punct dir')
        test.cmp(inc(rgs, 2, 'home'), 'text file')
    end)
    
    -- 000       0000000    0000000   
    -- 000      000   000  000        
    -- 000      000   000  000  0000  
    -- 000      000   000  000   000  
    -- 0000000   0000000    0000000   
    
    test("log", function()
        lang('log')
        
        local rgs = ranges("http://domain.com")
        test.cmp(inc(rgs, 0, 'http'), 'url protocol')
        test.cmp(inc(rgs, 4, ':'), 'punct url')
        test.cmp(inc(rgs, 5, '/'), 'punct url')
        test.cmp(inc(rgs, 6, '/'), 'punct url')
        test.cmp(inc(rgs, 7, 'domain'), 'url domain')
        test.cmp(inc(rgs, 13, '.'), 'punct url tld')
        test.cmp(inc(rgs, 14, 'com'), 'url tld')
        
        rgs = ranges("file.coffee")
        test.cmp(inc(rgs, 0, 'file'), 'file_coffee')
        test.cmp(inc(rgs, 4, '.'), 'file_punct_coffee')
        test.cmp(inc(rgs, 5, 'coffee'), 'file_ext_coffee')
        
        rgs = ranges("/some/path")
        test.cmp(inc(rgs, 1, 'some'), 'text dir')
        test.cmp(inc(rgs, 5, '/'), 'punct dir')
        
        rgs = ranges("key: value")
        test.cmp(inc(rgs, 0, 'key'), 'dictionary key')
        test.cmp(inc(rgs, 3, ':'), 'punct dictionary')
    end)
    
    -- 00     00  0000000    
    -- 000   000  000   000  
    -- 000000000  000   000  
    -- 000 0 000  000   000  
    -- 000   000  0000000    
    
    test("md", function()
        lang('md')
        
        local rgs = ranges("**bold**")
        test.cmp(inc(rgs, 0, '*'), 'punct bold')
        test.cmp(inc(rgs, 1, '*'), 'punct bold')
        test.cmp(inc(rgs, 2, 'bold'), 'text bold')
        test.cmp(inc(rgs, 6, '*'), 'punct bold')
        test.cmp(inc(rgs, 7, '*'), 'punct bold')
        
        rgs = ranges(",**b**,")
        test.cmp(inc(rgs, 1, '*'), 'punct bold')
        test.cmp(inc(rgs, 3, 'b'), 'text bold')
        test.cmp(inc(rgs, 4, '*'), 'punct bold')
        
        rgs = ranges("*it lic*")
        test.cmp(inc(rgs, 0, '*'), 'punct italic')
        test.cmp(inc(rgs, 1, 'it'), 'text italic')
        test.cmp(inc(rgs, 4, 'lic'), 'text italic')
        test.cmp(inc(rgs, 7, '*'), 'punct italic')
        
        rgs = ranges("*italic*")
        test.cmp(inc(rgs, 0, '*'), 'punct italic')
        test.cmp(inc(rgs, 1, 'italic'), 'text italic')
        test.cmp(inc(rgs, 7, '*'), 'punct italic')
        
        rgs = ranges("*`italic code`*")
        test.cmp(inc(rgs, 0, '*'), 'punct italic')
        test.cmp(inc(rgs, 1, '`'), 'punct italic code')
        test.cmp(inc(rgs, 2, 'italic'), 'text italic code')
        test.cmp(inc(rgs, 9, 'code'), 'text italic code')
        test.cmp(inc(rgs, 14, '*'), 'punct italic')
        
        rgs = ranges("it's good")
        test.cmp(inc(rgs, 0, 'it'), 'text')
        test.cmp(inc(rgs, 2, "'"), 'punct')
        test.cmp(inc(rgs, 3, 's'), 'text')
        
        rgs = ranges("if is empty in then")
        test.cmp(inc(rgs, 0, 'if'), 'text')
        test.cmp(inc(rgs, 3, 'is'), 'text')
        test.cmp(inc(rgs, 6, 'empty'), 'text')
        test.cmp(inc(rgs, 12, 'in'), 'text')
        test.cmp(inc(rgs, 15, 'then'), 'text')
        
        rgs = ranges('text files. bla')
        test.cmp(inc(rgs, 0, 'text'), 'text')
        test.cmp(inc(rgs, 10, '.'), 'punct')
        
        rgs = ranges('..bla')
        test.cmp(inc(rgs, 0, '.'), 'punct')
        test.cmp(inc(rgs, 1, '.'), 'punct')
        
        rgs = ranges('```coffeescript')
        test.cmp(inc(rgs, 0, '`'), 'punct code triple')
        test.cmp(inc(rgs, 3, 'coffeescript'), 'comment')
    end)
    
    test("md2", function()
        local rgs = ranges("- li")
        test.cmp(inc(rgs, 0, '-'), 'punct li1 marker')
        test.cmp(inc(rgs, 2, 'li'), 'text li1')
        
        rgs = ranges("    - **bold**")
        test.cmp(inc(rgs, 4, '-'), 'punct li2 marker')
        test.cmp(inc(rgs, 8, 'bold'), 'text li2 bold')
        
        rgs = ranges("        - **bold**")
        test.cmp(inc(rgs, 8, '-'), 'punct li3 marker')
        test.cmp(inc(rgs, 12, 'bold'), 'text li3 bold')
        
        rgs = ranges("        * **bold**")
        test.cmp(inc(rgs, 8, '*'), 'punct li3 marker')
        test.cmp(inc(rgs, 12, 'bold'), 'text li3 bold')
        
        local dss = dissect([[
    - li1
    text
]])
        
        test.cmp(inc(dss[0], 0, '-'), 'punct li1 marker')
        test.cmp(inc(dss[1], 0, 'text'), 'text')
        
        dss = dissect([[
    # h1
    ## h2
    ### h3
    #### h4
    ##### h5
]])
        
        test.cmp(inc(dss[0], 0, "#"), 'punct h1')
        test.cmp(inc(dss[0], 2, "h1"), 'text h1')
        test.cmp(inc(dss[1], 0, "#"), 'punct h2')
        test.cmp(inc(dss[1], 3, "h2"), 'text h2')
        test.cmp(inc(dss[2], 0, "#"), 'punct h3')
        test.cmp(inc(dss[2], 4, "h3"), 'text h3')
        test.cmp(inc(dss[3], 0, "#"), 'punct h4')
        test.cmp(inc(dss[3], 5, "h4"), 'text h4')
        test.cmp(inc(dss[4], 0, "#"), 'punct h5')
        test.cmp(inc(dss[4], 6, "h5"), 'text h5')
        
        dss = dissect('```js\n```')
        test.cmp(inc(dss[1], 0, '`'), 'punct code triple')
        
        dss = dissect([[
abc
    def    hello number 0.123
- num 0.2 
]])
        
        test.cmp(inc(dss[1], 24, '0'), 'number float')
        test.cmp(inc(dss[1], 25, '.'), 'punct number float')
        test.cmp(inc(dss[1], 26, '123'), 'number float')
        
        test.cmp(inc(dss[2], 6, '0'), 'number float')
        test.cmp(inc(dss[2], 7, '.'), 'punct number float')
        test.cmp(inc(dss[2], 8, '2'), 'number float')
        
        dss = dissect([[
ugga
    - fix me!
]])
        
        test.cmp(inc(dss[1], 4, '-'), 'punct li2 marker')
        
        dss = dissect([[
ugga
     - fix me!
]])
        
        test.cmp(inc(dss[1], 5, '-'), 'punct li2 marker')
        
        dss = dissect([[
ugga
      - fix me!
]])
        
        test.cmp(inc(dss[1], 6, '-'), 'punct li2 marker')
    end)
    
    -- 000   000  000   000  000   0000000   0000000   0000000    00000000  
    -- 000   000  0000  000  000  000       000   000  000   000  000       
    -- 000   000  000 0 000  000  000       000   000  000   000  0000000   
    -- 000   000  000  0000  000  000       000   000  000   000  000       
    --  0000000   000   000  000   0000000   0000000   0000000    00000000  
    
    test("unicode", function()
        local rgs = ranges("🌈")
        test.cmp(inc(rgs, 0, '🌈'), 'text unicode')
        
        test.cmp(rgs[0], {start = 0, length = 2, match = '🌈', turd = '🌈', clss = 'text unicode'})
        
        rgs = ranges("🌈🌱")
        test.cmp(inc(rgs, 0, '🌈'), 'text unicode')
        test.cmp(inc(rgs, 2, '🌱'), 'text unicode')
        
        rgs = ranges("🙂lol😀")
        test.cmp(inc(rgs, 0, '🙂'), 'text unicode')
        test.cmp(inc(rgs, 2, 'lol'), 'text')
        test.cmp(inc(rgs, 5, '😀'), 'text unicode')
        rgs = ranges("a➜b")
        test.cmp(inc(rgs, 1, '➜'), 'punct keyword')
        rgs = ranges('┌─┬─┐')
        test.cmp(inc(rgs, 0, '┌'), 'text unicode')
        test.cmp(inc(rgs, 1, '─'), 'text unicode')
        test.cmp(inc(rgs, 2, '┬'), 'text unicode')
        test.cmp(inc(rgs, 3, '─'), 'text unicode')
        test.cmp(inc(rgs, 4, '┐'), 'text unicode')
        rgs = ranges("🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥")
        test.cmp(inc(rgs, 0, '🐀'), 'text unicode')
        test.cmp(inc(rgs, 24, '🐌'), 'text unicode')
        
        rgs = ranges("'🔧' bla:1")
        test.cmp(inc(rgs, 5, 'bla'), 'dictionary key')
        
        rgs = ranges("icon: '🔧' bla:1")
        test.cmp(inc(rgs, 11, 'bla'), 'dictionary key')
    end)
    end)