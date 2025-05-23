
function main(...) 
    std = require "std"
    io = require "io"
    kxk = require "kxk/kxk"
    
    local optparser = std.optparse([[
0.1
Usage: kao [Options ...] [Files ...]

Options:
  -t, --test         run tests
  -d, --debug        run with debugging output
  -o, --outdir=dir   output directory
  -v, --verbose      a combined short and long option
  -V, --version      display version information, then exit
  -h, --help         display this help, then exit
]])
    
    -- log slash.cwd()
    print("●")
    
    files, _G.opts = optparser:parse(arg)
    
    if opts.verbose then 
        print('opts', inspect(opts))
        print('meta', inspect(getmetatable(opts)))
        print("debug", opts.debug)
        print("verbose", opts.verbose)
        print('outdir', opts.outdir)
        print('files', #files)
        print('files', inspect(files))
    end
    
    return watch(slash.path("."))
end


function watch(...) 
    local luajit, _ = slash.shell("brew", "--prefix", "luajit")
    luajit = kstr.trim(luajit)
    local libjit = luajit .. "/lib/libluajit.a"
    local incjit = luajit .. "/include/luajit-2.1"
    -- log "luajit" luajit
    
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
        local kxkChanged = {}
        local luaChanged = {}
        
        for _, dir in ipairs({...}) do 
            for i, f in ipairs(slash.walk(dir)) do 
                local p = f.path
                local stat = slash.stat(p)
                local modTime = stat.mtime
                
                if not modTimes[p] then 
                    modTimes[p] = modTime
                elseif (modTimes[p] == modTime) then 
                    local a = 1
                else 
                    modTimes[p] = modTime
                    
                    if kxkFiles[p] then 
                        print("◆", slash.file(p))
                        array.push(kxkChanged, p)
                    elseif luaFiles[p] then 
                        print("◇", slash.file(p))
                        array.push(luaChanged, p)
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
                output, ok = slash.shell("luastatic", "kao.lua", libjit, "-I", incjit)
                -- log output 
                if ok then 
                    print("restart")
                    slash.respawn()
                    print("DAFUK?")
                    os.exit(1)
                else 
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