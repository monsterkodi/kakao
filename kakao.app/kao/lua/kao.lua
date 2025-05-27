-- ███   ███   ███████    ███████ 
-- ███  ███   ███   ███  ███   ███
-- ███████    █████████  ███   ███
-- ███  ███   ███   ███  ███   ███
-- ███   ███  ███   ███   ███████ 


function main(...) 
    std = require "std"
    io = require "io"
    kxk = require "kxk.kxk"
    
    local optparser = std.optparse([[
0.1
Usage: kao [Options ...] [Files ...]

Options:

  -t, --test         run tests
  -b, --build        create binary
  -o, --out=dir      output directory
  -c, --cwd=dir      working directory
  
  -v, --verbose      log more information
  
  -V, --version      display version information
  -h, --help         display this help
]])
    
    -- log slash.cwd()
    
    _G.files, _G.opts = optparser:parse(arg)
    _G.files = array(unpack(_G.files))
    
    if opts.cwd then 
        write("\x1b[0m\x1b[33m\x1b[1m", "CWD ", opts.cwd)
        slash.chdir(opts.cwd)
    end
    
    if opts.verbose then 
        print("cwd", opts.cwd)
        print("build", opts.build)
        print('out', opts.out)
        print("verbose", opts.verbose)
        print('files', #files)
        print('files', files)
    end
    
    if opts.build then 
        local output, ok = build()
        if ok then 
            write("\x1b[0m\x1b[32m", "✔")
            os.exit(0)
        end
        
        write("\x1b[0m\x1b[31m", "✘ ", output)
        os.exit(1)
    end
    
    math.randomseed(os.clock())
    
    local cl = array("■■■", "◀■▶", "▶■◀", "▶●◀", "▶◆◀", "▶▶▶", "◀◀◀", "▲▼▲", "▼▲▼", "▪▪▪", "◆◆◆", "■◆■", "●◆●", "◆■◆", "●●●", "●▲●")
    local cs = kseg(cl:rnd())
    local co = array("\x1b[0m\x1b[31m", "\x1b[0m\x1b[38;2;240;208;0m", "\x1b[0m\x1b[38;2;128;128;240m")
    co:shuffle()
    write(co[1], cs[1], co[2], cs[2], co[3], cs[3])
    
    return watch(slash.path("."))
end


function build() 
    local luajit, _ = slash.shell("brew", "--prefix", "luajit")
    local luajit = kstr.trim(luajit)
    local libjit = luajit .. "/lib/libluajit.a"
    local incjit = luajit .. "/include/luajit-2.1"
    -- log "luajit" luajit
    local dir = (opts.out or "")
    local out = slash.path(dir, "kao")
    if empty(_G.files) then 
        _G.files = array("kao.lua")
    end
    
    _G.files:push("./kxk/array.lua")
    _G.files:push("./kxk/class.lua")
    _G.files:push("./kxk/inspect.lua")
    _G.files:push("./kxk/kseg.lua")
    _G.files:push("./kxk/kstr.lua")
    _G.files:push("./kxk/kxk.lua")
    _G.files:push("./kxk/slash.lua")
    _G.files:push("./kxk/test.lua")
    local args = array("luastatic")
    args:push(unpack(files))
    args:push(libjit, "-I", incjit, "-o", out)
    output, ok = slash.shell(unpack(args))
    return output, ok
end


function watch(...) 
    local dir = slash.cwd()
    local luaFiles = array.indexdict(slash.files(slash.path(dir, "."), "lua"))
    local kxkFiles = array.indexdict(slash.files(slash.path(dir, "./kxk"), "lua"))
    local kxkTests = array.indexdict(slash.files(slash.path(dir, "kxk/test")))
    
    if verbose then 
        print("\nlua files")
        print(array.str(luaFiles))
        print("\nkxk files")
        print(array.str(kxkFiles))
        print("\nkxk tests")
        print(array.str(kxkTests))
    end
    
    local modTimes = {}
    
    while true do 
        local kxkChanged = array()
        local luaChanged = array()
        
        for _, dir in ipairs({...}) do 
            for i, f in ipairs(slash.walk(dir)) do 
                local p = f.path
                local stat = slash.stat(p)
                if stat then 
                    local modTime = stat.mtime
                    
                    if not modTimes[p] then 
                        modTimes[p] = modTime
                    elseif (modTimes[p] == modTime) then 
                        local a = 1
                    else 
                        modTimes[p] = modTime
                        
                        if kxkFiles[p] then 
                            write("\x1b[0m\x1b[90m\x1b[2m", "◇ ", "\x1b[0m\x1b[3m\x1b[1m", slash.file(p))
                            kxkChanged:push(p)
                        elseif luaFiles[p] then 
                            write("\x1b[0m\x1b[90m\x1b[2m", "◆ ", "\x1b[0m\x1b[3m\x1b[1m", slash.file(p))
                            luaChanged:push(p)
                        end
                    end
                end
            end
        end
        
        local testPass = true
        if (#kxkChanged > 0) then 
            write("\x1b[0m\x1b[32m\x1b[4m", "testing")
            
            if not test.run(kxkTests) then 
                testPass = false
                -- write "\x1b[1F\x1b[2K" ◌rx "testing"
                write("\x1b[0m\x1b[31m\x1b[9m", "testing")
            end
        end
        
        if ((#luaChanged > 0) or (#kxkChanged > 0)) then 
            if testPass then 
                write("\x1b[0m\x1b[30m\x1b[4:3m", "compile")
                local output, ok = build()
                -- log output 
                if ok then 
                    write("\x1b[0m\x1b[2m\x1b[31m\x1b[4:4m", "restart")
                    slash.respawn()
                    print("DAFUK?")
                    os.exit(1)
                else 
                    write("\x1b[0m\x1b[31m", "✘")
                    print(output)
                end
            else 
                write("\x1b[0m\x1b[31m\x1b[9m", "compile")
            end
        end
        
        sleep(1)
    end
end

main()