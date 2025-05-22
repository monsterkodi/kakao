
function main(...) 
    std = require "std"
ffi = require "ffi"
io = require "io"
    kxk = require "./kxk/kxk"
    
    ffi.cdef([[
extern int execv(const char *path, char *const argv[]);
extern int dup2(int oldfd, int newfd);
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
    
    print(process.cwd())
    
    -- log "argp" array.str(process.argv), process.argv.len
    -- log "parg" process.argv[0]
    -- log "parg" process.argv[1]
    -- log "parg" process.argv[2]
    local argv = process.argv
    local appn = argv[0]
    local scrt = ""
    if ((#argv > 0) and (appn == "luvit")) then 
        scrt = array.shift(argv)
    end
    
    local arg, opts = optparser:parse(argv)
    print('exe', appn, scrt, array.str(args))
    
    local files = opts.unrecognised
    if opts.verbose then 
        print('opts', inspect(opts))
        print('meta', inspect(getmetatable(opts)))
        print("debug", opts.debug)
        print("verbose", opts.verbose)
        print('dryrun', opts.dryrun)
        print('outdir', opts.outdir)
        print('files', #files)
        print('files', inspect(files))
    end
    
    -- log "▸" kxk.exec("ls ~" print)
    
    -- log inspect opts
    -- log array.str files
    
    
    function sleep(s) 
        local t = os.clock()
        while ((os.clock() - t) <= s) do _ = 1 end
    end
    
    
    function load(file) 
        local cmd = "cat "..file
        return kxk.exec(cmd, print)
    end
    
    if (#files > 0) then 
        -- log "files" inspect(files)
        if opts.test then 
            for index, file in pairs(files) do 
                print('▸', file)
                load(file)
            end
        end
    end
    
    
    function verb(msg) 
        if opts.verbose then print(msg) end
    end
    
    local dir = process.cwd()
    local kuaFiles = array.indexdict(slash.files(slash.path(dir, "../kua"), "kua"))
    local luaFiles = array.indexdict(slash.files(slash.path(dir, "."), "lua"))
    local kxkFiles = array.indexdict(slash.files(slash.path(dir, "./kxk"), "lua"))
    local kxkTests = array.indexdict(slash.files(slash.path(dir, "kxk/test")))
    local kuaTests = array.indexdict(slash.files(slash.path(dir, "../lua/test")))
    
    if (true or verbose) then 
        print("\nkua files")
        print(array.str(kuaFiles))
        print("\nlua files")
        print(array.str(luaFiles))
        print("\nkxk files")
        print(array.str(kxkFiles))
        print("\nkua tests")
        print(array.str(kuaTests))
        print("\nkxk tests")
        print(array.str(kxkTests))
    end
    
    local modTimes = {}
    
    while true do 
        local kxkChanged = false
        local kuaChanged = false
        local luaChanged = false
        
        local kxkToTranspile = {}
        local kuaToTranspile = {}
        
        for i, f in ipairs(slash.walk(dir)) do 
            local p = f.path
            local stat = slash.stat(p)
            local modTime = stat.mtime
            
            if not modTimes[p] then 
                modTimes[p] = modTime
            elseif (modTimes[p] == modTime) then 
                local a = 1
            else 
                print("CHANGE", p)
                modTimes[p] = modTime
                
                if kxkFiles[p] then 
                    print("KXK", p)
                    kxkChanged = true
                    array.push(kxkToTranspile, p)
                elseif kuaFiles[p] then 
                    print("KUA", p)
                    kuaChanged = true
                    array.push(kuaToTranspile, p)
                elseif luaFiles[p] then 
                    luaChanged = true
                    print("LUA", p)
                end
            end
        end
        
        if (kuaChanged or kxkChanged) then 
            print("changed", array.str(kxkToTranspile), array.str(kuaToTranspile))
        end
        
        if luaChanged then 
            print("compile & restart")
            output, ok = kxk.shell("lit make")
            if ok then 
                -- log "restart " appn, argv.len
                
                ffi.C.fcntl(0, 2, 0)
                ffi.C.fcntl(1, 2, 0)
                ffi.C.fcntl(2, 2, 0)
                
                local args = ffi.new("char*[?]", (2 + #argv))
                args[0] = ffi.cast("char*", ffi.string(appn))
                for i = 1, (#argv + 1)-1 do 
                    args[i] = ffi.cast("char*", ffi.string(argv[i]))
                end
                
                args[(#argv + 1)] = nil
                ffi.C.execv(args[0], args)
                print("ASDSADS?")
                os.exit(1)
            else 
                print(output)
            end
        end
        
        -- else
        --     log "."
        sleep(1)
    end
end

return require('./init')(main, ...)