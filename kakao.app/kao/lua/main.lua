
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
    
    
    function slice(tbl, first, last) 
        local sliced = {}
        for i = first, last do 
            sliced[(#sliced + 1)] = tbl[i]
        end
        
        return sliced
    end
    
    local argv = slice(process.argv, 2, #process.argv)
    
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
    
    print("▸", kxk.exec("ls ~", print))
    
    
    function load(file) 
        local cmd = "cat "..file
        return kxk.exec(cmd, print)
    end
    
    if (#files > 0) then 
        print("files", inspect(files))
        if opts.test then 
            for index, file in pairs(files) do 
                print('▸', file)
                load(file)
            end
        end
    end
    
    
    function verb(msg) 
        return if opts.verbose then print(msg) end
    end
    return verb
end

return require('./init')(main, ...)