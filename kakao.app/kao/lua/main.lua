
function main(...) 
    std = require "std"
ffi = require "ffi"
io = require "io"
    kxk = require "./kxk/kxk"
    
    ffi.cdef([[
extern int execv(const char *path, char *const argv[]);
typedef void *FILE; 
extern int fileno(FILE *stream);
extern int fcntl(int fd, int cmd, ...);        
]])
    
    local optparser = std.optparse([[
0.1.0
Usage: kao [Options ...] [Files ...]

Options:
  -t, --test         run tests
  -d, --debug        run with debugging output
  -n, --dryrun,      run without execution
  -o, --outdir=dir   output directory
  -v, --verbose      a combined short and long option
  -V, --version      display version information, then exit
  -h, --help         display this help, then exit
]])
    
    -- log process.cwd()
    
    _G.argv = process.argv
    _G.appn = argv[0]
    _G.scrt = ""
    if ((#argv > 0) and (appn == "luvit")) then 
        local scrt = array.shift(argv)
    end
    
    _G.opts = {}
    arg, _G.opts = optparser:parse(argv)
    -- log 'exe' appn, scrt, array.str(args)
    
    local files = opts.unrecognised
    if opts.verbose then 
        print('opts', inspect(opts))
        print('meta', inspect(getmetatable(opts)))
        print("debug", opts.debug)
        print("verbose", opts.verbose)
        print('outdir', opts.outdir)
        print('files', #files)
        print('files', inspect(files))
    end
    
    -- log inspect opts
    -- log array.str files
    
    return watch(slash.path("."))
end


function watch(...) 
    local dir = process.cwd()
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
                    -- log "CHANGE" p
                    modTimes[p] = modTime
                    
                    if kxkFiles[p] then 
                        print("KXK", p)
                        array.push(kxkChanged, p)
                    elseif luaFiles[p] then 
                        array.push(luaChanged, p)
                        print("LUA", p)
                    end
                end
            end
        end
        
        local testPass = true
        if (#kxkChanged > 0) then 
            if not test.run(kxkTests) then 
                testPass = false
            end
        end
        
        if ((#luaChanged > 0) or (#kxkChanged > 0)) then 
            if testPass then 
                print("compile")
                local output, ok = slash.shell("lit", "make")
                if ok then 
                    print("restart ", appn)
                    slash.respawn(appn, argv)
                    print("DAFUK?")
                    os.exit(1)
                else 
                    print(output)
                end
            else 
                print("skip compile")
            end
        end
        
        -- else
        --     log "."
        sleep(1)
    end
end

return require('./init')(main, ...)