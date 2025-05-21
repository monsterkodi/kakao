
function main(...) 
    std = require "std"
    kxk = require "./kxk/kxk"
    
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
    
    print("argp", table.concat(process.argv, " "), #process.argv, process.argc)
    print("parg", process.argv[0])
    print("parg", process.argv[1])
    print("parg", process.argv[2])
    local argv = array.slice(process.argv, 2, #process.argv)
    print("argv", table.concat(argv, " "))
    
    local arg, opts = optparser:parse(argv)
    
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
    
    print(inspect(opts))
    print(table.concat(files, " "))
    
    
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
    local kuaTests = slash.files(slash.path(dir, "../lua/test"))
    local kuaFiles = slash.files(slash.path(dir, "../kua"))
    local kxkFiles = slash.files(slash.path(dir, "../kua/kxk"))
    local kxkTests = slash.files(slash.path(dir, "kxk/test"))
    
    if (true or verbose) then 
        print(table.concat(kuaTests))
        print(table.concat(kuaFiles))
        print(table.concat(kxkFiles))
        print(table.concat(kxkTests))
    end
    
    return print(slash.normalize(slash.path(dir, "../lua/test")))
end

return require('./init')(main, ...)