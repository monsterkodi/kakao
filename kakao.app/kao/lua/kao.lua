-- ███   ███   ███████    ███████ 
-- ███  ███   ███   ███  ███   ███
-- ███████    █████████  ███   ███
-- ███  ███   ███   ███  ███   ███
-- ███   ███  ███   ███   ███████ 


function main(...) 
    std = require "std"
    io = require "io"
    kxk = require "kxk/kxk"
    
    local optparser = std.optparse([[
0.1
Usage: kao [Options ...] [Files ...]

Options:

  -t, --test         run tests
  -b, --build        create binary
      --out dir      output directory
  
  -v, --verbose      log more information
  -d, --debug        log debugging information
  
  -V, --version      display version information
  -h, --help         display this help
]])
    
    -- log slash.cwd()
    
    _G.files, _G.opts = optparser:parse(arg)
    
    local first = slash.absolute(files[1])
    if slash.isDir(first) then 
        print("CHWD", first)
        slash.chdir(first)
        array.shift(files)
        print("files after shift", array.str(_G.files))
    end
    
    if opts.verbose then 
        print('opts', inspect(opts))
        print('meta', inspect(getmetatable(opts)))
        print("build", opts.build)
        print("debug", opts.debug)
        print("verbose", opts.verbose)
        print('outdir', opts.outdir)
        print('files', #files)
        print('files', inspect(files))
    end
    
    if opts.build then 
        local output, ok = build()
        if ok then 
            print("✔")
            os.exit(0)
        end
        
        print("✘ " .. output)
        os.exit(1)
    end
    
    print("●")
    return watch(slash.path("."))
end


function build() 
    local luajit, _ = slash.shell("brew", "--prefix", "luajit")
    luajit = kstr.trim(luajit)
    local libjit = luajit .. "/lib/libluajit.a"
    local incjit = luajit .. "/include/luajit-2.1"
    -- log "luajit" luajit
    local dir = (opts.outdir or "")
    local out = slash.path(dir, "kao")
    if empty(_G.files) then 
        _G.files = {"kao.lua"}
    end
    
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
                            print("◆", slash.file(p))
                            kxkChanged:push(p)
                        elseif luaFiles[p] then 
                            print("◇", slash.file(p))
                            luaChanged:push(p)
                        end
                    end
                end
            end
        end
        
        local testPass = true
        if (#kxkChanged > 0) then 
            print("testing")
            if not test.run(kxkTests) then testPass = false end
        end
        
        if ((#luaChanged > 0) or (#kxkChanged > 0)) then 
            if testPass then 
                print("compile")
                local output, ok = build()
                -- log output 
                if ok then 
                    print("restart")
                    slash.respawn()
                    print("DAFUK?")
                    os.exit(1)
                else 
                    print("✘")
                    print(output)
                end
            else 
                print("skip compile")
            end
        end
        
        sleep(1)
    end
end

main()