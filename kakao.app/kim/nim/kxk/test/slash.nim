# 000000000  00000000   0000000  000000000
#    000     000       000          000
#    000     0000000   0000000      000
#    000     000            000     000
#    000     00000000  0000000      000
import std/[envvars]
import ../kxk
import ../slash

template t(f:(proc (_:string) : string), a:string, b:string) = testCmp(a, f(a), b, instantiationInfo())

template p(f:(proc (_:string) : slash.parseInfo), a:string, b:slash.parseInfo) = testCmp(a, f(a), b, instantiationInfo())

template c(f:(proc (_:string, _:string) : bool), a:string, b:string, c:bool) = testCmp(a & "," & b, f(a, b), c, instantiationInfo())
suite "slash": 
    # 000   000   0000000   00000000   00     00   0000000   000      000  0000000  00000000  
    # 0000  000  000   000  000   000  000   000  000   000  000      000     000   000       
    # 000 0 000  000   000  0000000    000000000  000000000  000      000    000    0000000   
    # 000  0000  000   000  000   000  000 0 000  000   000  000      000   000     000       
    # 000   000   0000000   000   000  000   000  000   000  0000000  000  0000000  00000000  
    test "normalize": 
          t(slash.normalize, "a/", "a")
          t(slash.normalize, "xyz", "xyz")
          t(slash.normalize, "x/y/z", "x/y/z")
          t(slash.normalize, "x\\y/z\\", "x/y/z")
          t(slash.normalize, "\\x\\y/z", "/x/y/z")
          t(slash.normalize, "..\\x\\y/z", "../x/y/z")
          t(slash.normalize, "./x\\y/z", "./x/y/z")
          t(slash.normalize, "x/./z", "x/z")
          t(slash.normalize, "x/../z", "z")
          t(slash.normalize, "./x/y/z/../../a", "./x/a")
          t(slash.normalize, "../up", "../up")
          t(slash.normalize, "//", "/")
          t(slash.normalize, "//././////././", "/")
          t(slash.normalize, "./x/../../z", "../z")
          t(slash.normalize, "./x/../../../y", "../../y")
    # 00000000    0000000   000000000  000   000  
    # 000   000  000   000     000     000   000  
    # 00000000   000000000     000     000000000  
    # 000        000   000     000     000   000  
    # 000        000   000     000     000   000  
    test "path": 
        check slash.path("") == ""
        check slash.path("a", "b", "c") == "a/b/c"
        check slash.path("", "", "void", "", "") == "void"
        check slash.path("", "", "oops", "", "alla") == "oops/alla"
        check slash.path("C:\\FOO", ".\\BAR", "that\\sucks") == "C:/FOO/BAR/that/sucks"
        check slash.path("~") == "~"
        check slash.path("/") == "/"
        check slash.path("./") == "."
        check slash.path("../") == ".."
        check slash.path(".././") == ".."
        check slash.path("./relative") == "./relative"
        check slash.path("../parent") == "../parent"
        check slash.path(".././././") == ".."
        check slash.path("//") == "/"
        check slash.path("C:/") == "C:"
        check slash.path("C://") == "C:"
        check slash.path("C:") == "C:"
        check slash.path("C:\\") == "C:"
        check slash.path("C:/some/path/on.c") == "C:/some/path/on.c"
        check slash.path("C:\\") == "C:"
        check slash.path("C:/") == "C:"
        check slash.path("C://") == "C:"
        check slash.path("C:") == "C:"
        check slash.path("C:\\Back\\Slash\\Crap") == "C:/Back/Slash/Crap"
        check slash.path("C:/Back/Slash/Crap/../../../The/../The/./Future") == "C:/The/Future"
        check slash.path("C:\\Back\\Slash\\Crap\\..\\..\\To\\The\\..\\Future") == "C:/Back/To/Future"
    # 000   0000000  00000000    0000000    0000000   000000000  
    # 000  000       000   000  000   000  000   000     000     
    # 000  0000000   0000000    000   000  000   000     000     
    # 000       000  000   000  000   000  000   000     000     
    # 000  0000000   000   000   0000000    0000000      000     
    test "isRoot": 
        check slash.isRoot("/") == true
        check slash.isRoot("/a") == false
    # 00000000    0000000   00000000    0000000  00000000  
    # 000   000  000   000  000   000  000       000       
    # 00000000   000000000  0000000    0000000   0000000   
    # 000        000   000  000   000       000  000       
    # 000        000   000  000   000  0000000   00000000  
    test "parse": 
        p(slash.parse, "/a/b/c.txt", (dir: "/a/b", name: "c", ext: "txt", file: "c.txt", path: "/a/b/c.txt"))
        p(slash.parse, "/a/b/c", (dir: "/a/b", name: "c", ext: "", file: "c", path: "/a/b/c"))
        p(slash.parse, "/a/b/c/", (dir: "/a/b", name: "c", ext: "", file: "c", path: "/a/b/c"))
        p(slash.parse, "/a", (dir: "/", name: "a", ext: "", file: "a", path: "/a"))
    # 0000000    000  00000000   
    # 000   000  000  000   000  
    # 000   000  000  0000000    
    # 000   000  000  000   000  
    # 0000000    000  000   000  
    test "dir": 
        check slash.dir("/some/path/file.txt") == "/some/path"
        check slash.dir("/some/dir") == "/some"
        check slash.dir("/some/dir/") == "/some"
        check slash.dir("some/dir/") == "some"
        check slash.dir("some/dir") == "some"
        check slash.dir("/some/") == "/"
        check slash.dir("/some") == "/"
        check slash.dir("./rel") == "."
        check slash.dir("./rel/ative") == "./rel"
        check slash.dir("../..") == ".."
        check slash.dir(".") == ""
        check slash.dir("..") == ""
        check slash.dir("./") == ""
        check slash.dir("../") == ""
        check slash.dir("~") == slash.dir(slash.home())
        check slash.dir("~/") == slash.dir(slash.home())
    # 000   000   0000000   00     00  00000000  
    # 0000  000  000   000  000   000  000       
    # 000 0 000  000000000  000000000  0000000   
    # 000  0000  000   000  000 0 000  000       
    # 000   000  000   000  000   000  00000000  
    test "name": 
        check slash.name("/some/path.txt") == "path"
        check slash.name("/some/path.with.ext") == "path.with"
    # 00000000  000  000      00000000  
    # 000       000  000      000       
    # 000000    000  000      0000000   
    # 000       000  000      000       
    # 000       000  0000000  00000000  
    test "file": 
        check slash.file("/some/path.txt") == "path.txt"
        check slash.file("/some/path.with.ext") == "path.with.ext"
        check slash.file("file:///files.css") == "files.css"
    # 00000000  000   000  000000000  
    # 000        000 000      000     
    # 0000000     00000       000     
    # 000        000 000      000     
    # 00000000  000   000     000     
    test "ext": 
        check slash.ext("./none") == ""
        check slash.ext("./some.ext") == "ext"
        check slash.ext("./some.more.ext") == "ext"
    # 00000000   00000000  00     00   0000000   000   000  00000000  00000000  000   000  000000000  
    # 000   000  000       000   000  000   000  000   000  000       000        000 000      000     
    # 0000000    0000000   000000000  000   000   000 000   0000000   0000000     00000       000     
    # 000   000  000       000 0 000  000   000     000     000       000        000 000      000     
    # 000   000  00000000  000   000   0000000       0      00000000  00000000  000   000     000     
    test "removeExt": 
        check slash.removeExt("./none") == "./none"
        check slash.removeExt("./some.ext") == "./some"
        check slash.removeExt("./some.more.ext") == "./some.more"
        check slash.removeExt("../none") == "../none"
        check slash.removeExt("../some.ext") == "../some"
        check slash.removeExt("../some.more.ext") == "../some.more"
        check slash.removeExt("none") == "none"
        check slash.removeExt("some.ext") == "some"
        check slash.removeExt("some.more.ext") == "some.more"
    #  0000000  00000000   000      000  000000000  00000000  000   000  000000000  
    # 000       000   000  000      000     000     000        000 000      000     
    # 0000000   00000000   000      000     000     0000000     00000       000     
    #      000  000        000      000     000     000        000 000      000     
    # 0000000   000        0000000  000     000     00000000  000   000     000     
    test "splitExt": 
        check slash.splitExt("./none") == @["./none", ""]
        check slash.splitExt("./some.ext") == @["./some", "ext"]
        check slash.splitExt("./some.more.ext") == @["./some.more", "ext"]
        check slash.splitExt("/none") == @["/none", ""]
        check slash.splitExt("/some.ext") == @["/some", "ext"]
        check slash.splitExt("/some.more.ext") == @["/some.more", "ext"]
        check slash.splitExt("none") == @["none", ""]
        check slash.splitExt("some.ext") == @["some", "ext"]
        check slash.splitExt("some.more.ext") == @["some.more", "ext"]
    #  0000000  000   000   0000000   00000000   00000000  000   000  000000000  
    # 000       000 0 000  000   000  000   000  000        000 000      000     
    # 0000000   000000000  000000000  00000000   0000000     00000       000     
    #      000  000   000  000   000  000        000        000 000      000     
    # 0000000   00     00  000   000  000        00000000  000   000     000     
    test "swapExt": 
        check slash.swapExt("./some", "new") == "./some.new"
        check slash.swapExt("./some.ext", "new") == "./some.new"
        check slash.swapExt("./some.more.ext", "new") == "./some.more.new"
        check slash.swapExt("/some", "new") == "/some.new"
        check slash.swapExt("/some.ext", "new") == "/some.new"
        check slash.swapExt("/some.more.ext", "new") == "/some.more.new"
        check slash.swapExt("some", "new") == "some.new"
        check slash.swapExt("some.ext", "new") == "some.new"
        check slash.swapExt("some.more.ext", "new") == "some.more.new"
    # 000   000   0000000   00     00  00000000  
    # 000   000  000   000  000   000  000       
    # 000000000  000   000  000000000  0000000   
    # 000   000  000   000  000 0 000  000       
    # 000   000   0000000   000   000  00000000  
    test "home": 
        var home = getEnv("HOME")
        check slash.home() == home
        check slash.home("sub", "dir") == slash.path(home, "sub", "dir")
        check slash.tilde(home) == "~"
        check slash.tilde(home & "/sub") == "~/sub"
        check slash.untilde("~/sub") == home & "/sub"
    # 00000000   00000000  000       0000000   000000000  000  000   000  00000000  
    # 000   000  000       000      000   000     000     000  000   000  000       
    # 0000000    0000000   000      000000000     000     000   000 000   0000000   
    # 000   000  000       000      000   000     000     000     000     000       
    # 000   000  00000000  0000000  000   000     000     000      0      00000000  
    test "relative": 
        check slash.relative("\\test\\some\\path.txt", "\\test\\some\\other\\path") == "../../path.txt"
        check slash.relative("/Users/kodi/s/konrad/app/js/coffee.js", "/Users/kodi/s/konrad") == "app/js/coffee.js"
        check slash.relative("/some/path/on.c", "/path/on.d") == "../../some/path/on.c"
        check slash.relative("\\some\\path\\on.c", "\\path\\on.d") == "../../some/path/on.c"
        check slash.relative("\\some\\path", "/some/path") == "."
        check slash.relative("/Users/kodi/s/kakao/kakao.app/js/bin/kode/returner.js", "/Users/kodi/s/kakao/kakao.app/js/bin/kode/test") == "../returner.js"
    test "absolute": 
        check slash.absolute("/some/path") == "/some/path"
        check slash.absolute("./child", "/parent") == "/parent/child"
        check slash.untilde("~/child") == &"{slash.home()}/child"
        check slash.absolute("~/child") == &"{slash.home()}/child"
    #  0000000  00000000   000      000  000000000  
    # 000       000   000  000      000     000     
    # 0000000   00000000   000      000     000     
    #      000  000        000      000     000     
    # 0000000   000        0000000  000     000     
    test "split": 
        check slash.split("/c/users/home/") == @["", "c", "users", "home"]
        check slash.split("d/users/home") == @["d", "users", "home"]
        check slash.split("c:/some/path") == @["c:", "some", "path"]
        check slash.split("~/home/path") == @["~", "home", "path"]
    # 000   0000000  00000000   00000000  000       0000000   000000000  000  000   000  00000000  
    # 000  000       000   000  000       000      000   000     000     000  000   000  000       
    # 000  0000000   0000000    0000000   000      000000000     000     000   000 000   0000000   
    # 000       000  000   000  000       000      000   000     000     000     000     000       
    # 000  0000000   000   000  00000000  0000000  000   000     000     000      0      00000000  
    test "isRelative": 
        # slash.isRelative ◆dir                 ▸ false
        check slash.isRelative(".") == true
        check slash.isRelative("..") == true
        check slash.isRelative(".././bla../../fark") == true
        check slash.isRelative("..\\blafark") == true
        check slash.isRelative("a/b") == true
        check slash.isRelative("/a/b") == false
        check slash.isRelative("~") == false
        check slash.isAbsolute(".") == false
        check slash.isAbsolute("..") == false
        check slash.isAbsolute(".././bla../../fark") == false
        check slash.isAbsolute("..\\blafark") == false
        check slash.isAbsolute("a/b") == false
        check slash.isAbsolute("/a/b") == true
        check slash.isAbsolute("~") == true
    #  0000000   0000000   000   000  000000000   0000000   000  000   000   0000000  
    # 000       000   000  0000  000     000     000   000  000  0000  000  000       
    # 000       000   000  000 0 000     000     000000000  000  000 0 000  0000000   
    # 000       000   000  000  0000     000     000   000  000  000  0000       000  
    #  0000000   0000000   000   000     000     000   000  000  000   000  0000000   
    test "contains": 
        c(slash.contains, "/c/users/home/", "users", true)
        c(slash.contains, "/home", "hom", false)
        c(slash.contains, "/abc.def/ghi.jkl", "abc", false)
        c(slash.contains, "/abc.def/ghi.jkl", "def", false)
        c(slash.contains, "/abc.def/ghi.jkl", "ghi", false)
        c(slash.contains, "/abc.def/ghi.jkl", "jkl", false)
        c(slash.contains, "/abc.def/ghi.jkl", "abc.def", true)
        c(slash.contains, "/abc.def/ghi.jkl", "ghi.jkl", true)
    test "files": 
        var fls = slash.files(slash.dir(currentSourcePath()))
        check (fls.find(currentSourcePath()) >= 0) == true
    # ████████  ███  ███      ████████  ████████    ███████    ███████
    # ███       ███  ███      ███       ███   ███  ███   ███  ███     
    # ██████    ███  ███      ███████   ████████   ███   ███  ███████ 
    # ███       ███  ███      ███       ███        ███   ███       ███
    # ███       ███  ███████  ████████  ███         ███████   ███████ 
    #▸ splitFileLine
    #    
    #    slash.splitFileLine "/some/path"            ▸ ["/some/path" 1 0]
    #    slash.splitFileLine "/some/path:123"        ▸ ["/some/path" 123 0]
    #    slash.splitFileLine "/some/path:123:15"     ▸ ["/some/path" 123 15]
    #    slash.splitFileLine "c:/some/path:123"      ▸ ["c:/some/path" 123 0]
    #    slash.splitFileLine "c:/some/path:123:15"   ▸ ["c:/some/path" 123 15]
    #▸ splitFilePos
    #    
    #    slash.splitFilePos "/some/path"             ▸ ["/some/path" [0  0]]
    #    slash.splitFilePos "/some/path:123"         ▸ ["/some/path" [0  122]]
    #    slash.splitFilePos "/some/path:123:15"      ▸ ["/some/path" [15 122]]
    #    slash.splitFilePos "c:/some/path:123"       ▸ ["c:/some/path" [0  122]]
    #    slash.splitFilePos "c:/some/path:123:15"    ▸ ["c:/some/path" [15 122]]
    #▸ joinFilePos
    #    
    #    slash.joinFilePos "/some/path" [0 0]         ▸ "/some/path"
    #    slash.joinFilePos "/some/path" [1 0]         ▸ "/some/path:1:1"
    #    slash.joinFilePos "/some/path" [0 1]         ▸ "/some/path:2"
    #    slash.joinFilePos "/some/path" [1 1]         ▸ "/some/path:2:1"
    #    slash.joinFilePos "/some/path" [0 4]         ▸ "/some/path:5"
    #    slash.joinFilePos "/some/path" [1 5]         ▸ "/some/path:6:1"
    #    slash.joinFilePos "/some/path:23:45" [1 5]   ▸ "/some/path:6:1"
    #    slash.joinFilePos "/some/path:23" [1 5]      ▸ "/some/path:6:1"
    #    slash.joinFilePos "/some/path"               ▸ "/some/path"
    #    slash.joinFilePos "/some/path" []            ▸ "/some/path"
    #▸ joinFileLine
    #    
    #    slash.joinFileLine "/some/path" 1         ▸ "/some/path:1"
    #    slash.joinFileLine "/some/path" 4 0       ▸ "/some/path:4"
    #    slash.joinFileLine "/some/path" 5 1       ▸ "/some/path:5:1"
    #    slash.joinFileLine "/some/path:23:45" 5 1 ▸ "/some/path:5:1"
    #    slash.joinFileLine "/some/path:23" 5 1    ▸ "/some/path:5:1"
    #    slash.joinFileLine "/some/path"           ▸ "/some/path"
    #    slash.joinFileLine "/some/path" 0         ▸ "/some/path"
    #▸ sameFilePos
    #    
    #    slash.sameFilePos "/some/other/path:1" "/some/path:1"   ▸ false
    #    slash.sameFilePos "/some/path:1"       "/some/path:2"   ▸ false
    #    slash.sameFilePos "/some/path:1:2"     "/some/path:1:3" ▸ false
    #    slash.sameFilePos "/some/path:1:2"     "/some/path:1"   ▸ false
    #    slash.sameFilePos "/some/path:1:2"     "/some/path"     ▸ false
    #    
    #    slash.sameFilePos "/some/path:1:3"     "/some/path:1:3" ▸ true
    #    slash.sameFilePos "/some/path:1:0"     "/some/path:1:0" ▸ true
    #    slash.sameFilePos "/some/path:1:0"     "/some/path:1"   ▸ true
    #    slash.sameFilePos "/some/path:1:0"     "/some/path"     ▸ true
    #    
    #▸ sameFileLine
    #    
    #    slash.sameFileLine "/some/other/path:1" "/some/path:1"   ▸ false
    #    slash.sameFileLine "/some/path:1"       "/some/path:2"   ▸ false
    #    slash.sameFileLine "/some/path:2:2"     "/some/path"     ▸ false
    #    
    #    slash.sameFileLine "/some/path:1:3"     "/some/path:1:3" ▸ true
    #    slash.sameFileLine "/some/path:1:4"     "/some/path:1:0" ▸ true
    #    slash.sameFileLine "/some/path:1:5"     "/some/path:1"   ▸ true
    #    slash.sameFileLine "/some/path:1:6"     "/some/path"     ▸ true
    #    
    #▸ hasFilePos
    #    
    #    slash.hasFilePos "some/path"      ▸ false
    #    slash.hasFilePos "some/path:1"    ▸ false
    #    slash.hasFilePos "some/path:1:0"  ▸ false
    #    
    #    slash.hasFilePos "some/path:1:1"  ▸ true
    #    slash.hasFilePos "some/path:2"    ▸ true
    #    slash.hasFilePos "some/path:2:0"  ▸ true
    #    slash.hasFilePos "some/path:2:2"  ▸ true
    # ▸ unenv
    #     
    #     slash.unenv "C:/$Recycle.bin"           ▸ "C:/$Recycle.bin"
    #     slash.unenv "$HOME/test"                ▸ slash.path(process.env["HOME"]) + "/test"
    #     # user = slash.user()
    #     # slash.parse("~") ▸ path:"~" dir:"/Users" file:user, name:user, ext: ""
    
                    