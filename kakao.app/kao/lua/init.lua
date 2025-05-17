uv = require "uv"
utils = require "utils"
process = require "process"
hooks = require "hooks"
math = require "math"
os = require "os"

function initFunc(main, ...) 
    _G.process = process.globalProcess()
    math.randomseed(os.time())
    local pretty = require("pretty-print")
    local args = {...}
    
    function runMain() 
        local thread = coroutine.create(main)
        utils.assertResume(thread, unpack(args))
        uv.run()
    end
    
    function errMain(err) 
        pcall(function () hooks:emit('process.uncaughtException', err) end)
        return debug.traceback(err)
    end
    local success, err = xpcall(runMain, errMain)
    if success then 
        hooks:emit('process.exit')
        uv.run()
    else 
        _G.process.exitCode = -1
        pretty.stderr:write("Uncaught exception:\n" .. err .. "\n")
    end
    
    function isFileHandle(handle, name, fd) 
        return ((_G.process[name].handle == handle) and (uv.guess_handle(fd) == 'file'))
    end
    
    function isStdioFileHandle(handle) 
        return ((isFileHandle(handle, 'stdin', 0) or isFileHandle(handle, 'stdout', 1)) or isFileHandle(handle, 'stderr', 2))
    end
    
    function closeHandle(handle) 
        if handle then 
            
            function close() 
                    if not handle:is_closing() then handle:close() end
            end
            if (handle.shutdown and not isStdioFileHandle(handle)) then 
                handle:shutdown(close)
            else 
                close()
            end
        end
    end
    uv.walk(closeHandle)
    uv.run()
    return _G.process.exitCode
end
return initFunc