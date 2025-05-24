kxk = require "kxk/kxk"

test("slash", function()
    test("normalize", function()
        test.cmp(slash.normalize("a/"), "a")
        test.cmp(slash.normalize("../"), "..")
        test.cmp(slash.normalize("C:/"), "C:")
        test.cmp(slash.normalize("//"), "/")
        test.cmp(slash.normalize("xyz"), "xyz")
        test.cmp(slash.normalize("../up"), "../up")
        test.cmp(slash.normalize("x/y/z"), "x/y/z")
        test.cmp(slash.normalize("x\\y/z\\"), "x/y/z")
        test.cmp(slash.normalize("\\x\\y/z"), "/x/y/z")
        test.cmp(slash.normalize("./x\\y/z"), "./x/y/z")
        test.cmp(slash.normalize("..\\x\\y/z"), "../x/y/z")
        test.cmp(slash.normalize("x/./z"), "x/z")
        test.cmp(slash.normalize("x/../z"), "z")
        test.cmp(slash.normalize(".././"), "..")
        test.cmp(slash.normalize("//././////././"), "/")
        test.cmp(slash.normalize("./x/y/z/../../a"), "./x/a")
        test.cmp(slash.normalize("./x/../../z"), "../z")
        test.cmp(slash.normalize("./x/../../../y"), "../../y")
        test.cmp(slash.normalize("/Users/kodi/kao/lua/../kua/test"), "/Users/kodi/kao/kua/test")
    end)
    
    -- 00000000    0000000   000000000  000   000  
    -- 000   000  000   000     000     000   000  
    -- 00000000   000000000     000     000000000  
    -- 000        000   000     000     000   000  
    -- 000        000   000     000     000   000  
    
    test("path", function()
        test.cmp(slash.path(""), nil)
        test.cmp(slash.path("a", "b", "c"), "a/b/c")
        
        test.cmp(slash.path("", "", "void", "", ""), "void")
        test.cmp(slash.path("", "", "oops", "", "alla"), "oops/alla")
        
        test.cmp(slash.path("C:\\FOO", ".\\BAR", "that\\sucks"), "C:/FOO/BAR/that/sucks")
        
        test.cmp(slash.path("~"), "~")
        test.cmp(slash.path("/"), "/")
        test.cmp(slash.path("./"), ".")
        test.cmp(slash.path("../"), "..")
        test.cmp(slash.path(".././"), "..")
        test.cmp(slash.path("./relative"), "./relative")
        test.cmp(slash.path("../parent"), "../parent")
        test.cmp(slash.path(".././././"), "..")
        test.cmp(slash.path("//"), "/")
        test.cmp(slash.path("C:/"), "C:")
        test.cmp(slash.path("C://"), "C:")
        test.cmp(slash.path("C:"), "C:")
        test.cmp(slash.path("C:/"), "C:")
        test.cmp(slash.path("C:\\"), "C:")
        test.cmp(slash.path("C:/some/path/on.c"), "C:/some/path/on.c")
        
        test.cmp(slash.path("C:\\Back\\Slash\\Crap"), "C:/Back/Slash/Crap")
        test.cmp(slash.path("C:/Back/Slash/Crap/../../../The/../The/./Future"), "C:/The/Future")
        test.cmp(slash.path("C:\\Back\\Slash\\Crap\\..\\..\\To\\The\\..\\Future"), "C:/Back/To/Future")
    end)
    
    -- 000   0000000  00000000    0000000    0000000   000000000  
    -- 000  000       000   000  000   000  000   000     000     
    -- 000  0000000   0000000    000   000  000   000     000     
    -- 000       000  000   000  000   000  000   000     000     
    -- 000  0000000   000   000   0000000    0000000      000     
    
    test("isRoot", function()
        test.cmp(slash.isRoot("/"), true)
        test.cmp(slash.isRoot("/a"), false)
    end)
    
    -- 00000000    0000000   00000000    0000000  00000000  
    -- 000   000  000   000  000   000  000       000       
    -- 00000000   000000000  0000000    0000000   0000000   
    -- 000        000   000  000   000       000  000       
    -- 000        000   000  000   000  0000000   00000000  
    
    -- ▸ parse
    
    
        -- slash.parse "/a/b/c.txt"   ▸ {dir: "/a/b" name: "c" ext: "txt" file: "c.txt" path:"/a/b/c.txt"}
        -- slash.parse "/a/b/c"       ▸ {dir: "/a/b" name: "c" ext: ""    file: "c"     path:"/a/b/c"    }
        -- slash.parse "/a/b/c/"      ▸ {dir: "/a/b" name: "c" ext: ""    file: "c"     path:"/a/b/c"    }
        -- slash.parse "/a"           ▸ {dir: "/"    name: "a" ext: ""    file: "a"     path:"/a"        }
    
    -- 0000000    000  00000000   
    -- 000   000  000  000   000  
    -- 000   000  000  0000000    
    -- 000   000  000  000   000  
    -- 0000000    000  000   000  
    
    test("dir", function()
        -- slash.dir "/some/path/file.txt"         ▸ "/some/path"
        -- slash.dir "/some/dir"                   ▸ "/some"
        -- slash.dir "/some/dir/"                  ▸ "/some"
        test.cmp(slash.dir("some/dir/"), "some")
        test.cmp(slash.dir("some/dir"), "some")
        -- slash.dir "/some/"                      ▸ "/"
        -- slash.dir "/some"                       ▸ "/"
        test.cmp(slash.dir("./rel"), ".")
        test.cmp(slash.dir("./rel/ative"), "./rel")
        test.cmp(slash.dir("../.."), "..")
        test.cmp(slash.dir("."), "")
        test.cmp(slash.dir(".."), "")
        test.cmp(slash.dir("./"), "")
        test.cmp(slash.dir("../"), "")
        -- slash.dir "~"                           ▸ slash.dir slash.home()
        -- slash.dir "~/"                          ▸ slash.dir slash.home()
    end)
    
    -- 000   000   0000000   00     00  00000000  
    -- 0000  000  000   000  000   000  000       
    -- 000 0 000  000000000  000000000  0000000   
    -- 000  0000  000   000  000 0 000  000       
    -- 000   000  000   000  000   000  00000000  
    
    test("name", function()
        test.cmp(slash.name("/some/path.txt"), "path")
        test.cmp(slash.name("/some/path.with.ext"), "path.with")
    end)
    
    -- 00000000  000  000      00000000  
    -- 000       000  000      000       
    -- 000000    000  000      0000000   
    -- 000       000  000      000       
    -- 000       000  0000000  00000000  
    
    test("file", function()
        test.cmp(slash.file("/some/path.txt"), "path.txt")
        test.cmp(slash.file("/some/path.with.ext"), "path.with.ext")
        test.cmp(slash.file("file:///files.css"), "files.css")
    end)
    
    -- 00000000  000   000  000000000  
    -- 000        000 000      000     
    -- 0000000     00000       000     
    -- 000        000 000      000     
    -- 00000000  000   000     000     
    
    test("ext", function()
        test.cmp(slash.ext("./none"), "")
        test.cmp(slash.ext("./some.ext"), "ext")
        test.cmp(slash.ext("./some.more.ext"), "ext")
    end)
    
    -- 00000000   00000000  00     00   0000000   000   000  00000000  00000000  000   000  000000000  
    -- 000   000  000       000   000  000   000  000   000  000       000        000 000      000     
    -- 0000000    0000000   000000000  000   000   000 000   0000000   0000000     00000       000     
    -- 000   000  000       000 0 000  000   000     000     000       000        000 000      000     
    -- 000   000  00000000  000   000   0000000       0      00000000  00000000  000   000     000     
    
    -- ▸ removeExt
    -- 
    --     slash.removeExt "./none"                ▸ "./none"
    --     slash.removeExt "./some.ext"            ▸ "./some"
    --     slash.removeExt "./some.more.ext"       ▸ "./some.more"
    --                                             
    --     slash.removeExt "../none"               ▸ "../none"
    --     slash.removeExt "../some.ext"           ▸ "../some"
    --     slash.removeExt "../some.more.ext"      ▸ "../some.more"
    --                                             
    --     slash.removeExt "none"                  ▸ "none"
    --     slash.removeExt "some.ext"              ▸ "some"
    --     slash.removeExt "some.more.ext"         ▸ "some.more"
    
    --  0000000  00000000   000      000  000000000  00000000  000   000  000000000  
    -- 000       000   000  000      000     000     000        000 000      000     
    -- 0000000   00000000   000      000     000     0000000     00000       000     
    --      000  000        000      000     000     000        000 000      000     
    -- 0000000   000        0000000  000     000     00000000  000   000     000     
    
    test("splitExt", function()
        test.cmp(slash.splitExt("./none"), {"./none", ""})
        test.cmp(slash.splitExt("./some.ext"), {"./some", "ext"})
    end)
    
    --     slash.splitExt "./some.more.ext"        ▸ ["./some.more" "ext"]
    --                                             
    --     slash.splitExt "/none"                  ▸ ["/none" ""]
    --     slash.splitExt "/some.ext"              ▸ ["/some" "ext"]
    --     slash.splitExt "/some.more.ext"         ▸ ["/some.more" "ext"]
    --                                             
    --     slash.splitExt "none"                   ▸ ["none" ""]
    --     slash.splitExt "some.ext"               ▸ ["some" "ext"]
    --     slash.splitExt "some.more.ext"          ▸ ["some.more" "ext"]
    
    --  0000000  000   000   0000000   00000000   00000000  000   000  000000000  
    -- 000       000 0 000  000   000  000   000  000        000 000      000     
    -- 0000000   000000000  000000000  00000000   0000000     00000       000     
    --      000  000   000  000   000  000        000        000 000      000     
    -- 0000000   00     00  000   000  000        00000000  000   000     000     
    
    -- ▸ swapExt
    
    
        -- slash.swapExt "./some" "new"            ▸ "./some.new"
        -- slash.swapExt "./some.ext" "new"        ▸ "./some.new"
        -- slash.swapExt "./some.more.ext" "new"   ▸ "./some.more.new"
        
        -- slash.swapExt "/some" "new"             ▸ "/some.new"
        -- slash.swapExt "/some.ext" "new"         ▸ "/some.new"
        -- slash.swapExt "/some.more.ext" "new"    ▸ "/some.more.new"
        
        -- slash.swapExt "some" "new"              ▸ "some.new"
        -- slash.swapExt "some.ext" "new"          ▸ "some.new"
        -- slash.swapExt "some.more.ext" "new"     ▸ "some.more.new"
    
    -- 000   000   0000000   00     00  00000000  
    -- 000   000  000   000  000   000  000       
    -- 000000000  000   000  000000000  0000000   
    -- 000   000  000   000  000 0 000  000       
    -- 000   000   0000000   000   000  00000000  
    
    test("home", function()
        local home = os.getenv("HOME")
        
        test.cmp(slash.home(), home)
        -- slash.home("sub" "dir")                 ▸ slash.path home "sub" "dir"
        -- slash.tilde home                        ▸ "~"
        -- slash.tilde home & "/sub"               ▸ "~/sub"
        -- slash.untilde "~/sub"                   ▸ home & "/sub"
    end)
    
    -- 00000000   00000000  000       0000000   000000000  000  000   000  00000000  
    -- 000   000  000       000      000   000     000     000  000   000  000       
    -- 0000000    0000000   000      000000000     000     000   000 000   0000000   
    -- 000   000  000       000      000   000     000     000     000     000       
    -- 000   000  00000000  0000000  000   000     000     000      0      00000000  
    
    -- ▸ relative
    -- 
    --     slash.relative "\\test\\some\\path.txt" "\\test\\some\\other\\path" ▸ "../../path.txt"
    --     slash.relative "/Users/kodi/s/konrad/app/js/coffee.js" "/Users/kodi/s/konrad" ▸ "app/js/coffee.js"
    --     slash.relative "/some/path/on.c" "/path/on.d" ▸ "../../some/path/on.c"
    --     slash.relative "\\some\\path\\on.c" "\\path\\on.d" ▸ "../../some/path/on.c"
    --     slash.relative "\\some\\path" "/some/path" ▸ "."
    --     slash.relative "/Users/kodi/s/kakao/kakao.app/js/bin/kode/returner.js" "/Users/kodi/s/kakao/kakao.app/js/bin/kode/test" ▸ "../returner.js"
    
    test("absolute", function()
        test.cmp(slash.absolute("/some/path"), "/some/path")
        test.cmp(slash.absolute("./child", "/parent"), "/parent/child")
        -- slash.untilde  "~/child"                ▸ slash.home() & "/child"
        -- slash.absolute "~/child"                ▸ slash.home() & "/child"
    end)
    
    --  0000000  00000000   000      000  000000000  
    -- 000       000   000  000      000     000     
    -- 0000000   00000000   000      000     000     
    --      000  000        000      000     000     
    -- 0000000   000        0000000  000     000     
    
    test("split", function()
        -- slash.split "/c/users/home/"            ▸ ["" "c" "users" "home"]
        -- slash.split "d/users/home"              ▸ ["d" "users" "home"]
        test.cmp(slash.split("c:/some/path"), {"c:", "some", "path"})
        test.cmp(slash.split("~/home/path"), {"~", "home", "path"})
    end)
    
    -- 000   0000000  00000000   00000000  000       0000000   000000000  000  000   000  00000000  
    -- 000  000       000   000  000       000      000   000     000     000  000   000  000       
    -- 000  0000000   0000000    0000000   000      000000000     000     000   000 000   0000000   
    -- 000       000  000   000  000       000      000   000     000     000     000     000       
    -- 000  0000000   000   000  00000000  0000000  000   000     000     000      0      00000000  
    
    test("isRelative", function()
        test.cmp(slash.isRelative("."), true)
        test.cmp(slash.isRelative(".."), true)
        test.cmp(slash.isRelative(".././bla../../fark"), true)
        test.cmp(slash.isRelative("..\\blafark"), true)
        test.cmp(slash.isRelative("a/b"), true)
        test.cmp(slash.isRelative("/a/b"), false)
        test.cmp(slash.isRelative("~"), false)
        
        test.cmp(slash.isAbsolute("."), false)
        test.cmp(slash.isAbsolute(".."), false)
        test.cmp(slash.isAbsolute(".././bla../../fark"), false)
        test.cmp(slash.isAbsolute("..\\blafark"), false)
        test.cmp(slash.isAbsolute("a/b"), false)
        test.cmp(slash.isAbsolute("/a/b"), true)
        test.cmp(slash.isAbsolute("~"), true)
    end)
    
    --  0000000   0000000   000   000  000000000   0000000   000  000   000   0000000  
    -- 000       000   000  0000  000     000     000   000  000  0000  000  000       
    -- 000       000   000  000 0 000     000     000000000  000  000 0 000  0000000   
    -- 000       000   000  000  0000     000     000   000  000  000  0000       000  
    --  0000000   0000000   000   000     000     000   000  000  000   000  0000000   
    
    test("contains", function()
        test.cmp(slash.contains("/c/users/home/", "users"), true)
        test.cmp(slash.contains("/home", "hom"), false)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "abc"), false)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "def"), false)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "ghi"), false)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "jkl"), false)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "abc.def"), true)
        test.cmp(slash.contains("/abc.def/ghi.jkl", "ghi.jkl"), true)
    end)
    
    test("exists", function()
        test.cmp((slash.exists(slash.cwd()) ~= nil), true)
        test.cmp((slash.isDir(slash.cwd()) ~= nil), true)
        test.cmp(slash.isFile(slash.cwd()), nil)
        test.cmp(slash.isLink(slash.cwd()), nil)
        test.cmp((slash.isDir("/Users/kodi/s/kakao/kakao.app/kao/lua/kxk/test/kstr.lua") ~= nil), true)
    end)
    end)