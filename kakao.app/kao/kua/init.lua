
local uv = require('uv')

return function (main, ...)
    
    _G.process = require('process').globalProcess()
    
    do
      local math = require('math')
      local os   = require('os')
      math.randomseed(os.time())
    end
    
    local hooks  = require 'hooks'
    local pretty = require 'pretty-print'
    
    local args = {...}
    local success, err = xpcall(
        function ()
            local utils  = require 'utils'
            local thread = coroutine.create(main) -- Call the main app inside a coroutine
            utils.assertResume(thread, unpack(args))
            uv.run() -- Start the event loop
        end,
        function(err)
            -- During a stack overflow error, this can fail due to exhausting the remaining stack.
            -- We can't recover from that failure, but wrapping it in a pcall allows us to still
            -- return the stack overflow error even if the 'process.uncaughtException' fails to emit
            pcall(function() hooks:emit('process.uncaughtException',err) end)
            return debug.traceback(err)
        end)
    
    if success then
        hooks:emit('process.exit') -- Allow actions to run at process exit.
        uv.run()
    else
        _G.process.exitCode = -1
        pretty.stderr:write("Uncaught exception:\n" .. err .. "\n")
    end
    
    local function isFileHandle(handle, name, fd)
        return _G.process[name].handle == handle and uv.guess_handle(fd) == 'file'
    end
    
    local function isStdioFileHandle(handle)
        return isFileHandle(handle, 'stdin', 0) or isFileHandle(handle, 'stdout', 1) or isFileHandle(handle, 'stderr', 2)
    end
    
    -- When the loop exits, close all unclosed uv handles (flushing any streams found).
    uv.walk(function (handle)
        if handle then
            local function close()
                if not handle:is_closing() then handle:close() end
            end
            if handle.shutdown and not isStdioFileHandle(handle) then
                handle:shutdown(close)
            else
                close()
            end
        end
    end)
    uv.run()
    
    return _G.process.exitCode
end
