--[[
00000000  000  000      00000000  00000000    0000000    0000000
000       000  000      000       000   000  000   000  000     
000000    000  000      0000000   00000000   000   000  0000000 
000       000  000      000       000        000   000       000
000       000  0000000  00000000  000         0000000   0000000 

◆ on cursors change ➜ stores main cursor and view in session 
◆ on file loaded    ➜ restores main cursor and view from session
◆ on key event      ➜ provides file edits navigation via shortcuts
◆ on post insert    ➜ tracks insertion points for file edits navigation
--]]


local filepos = class("filepos")
    filepos.static.autoStart = true
    
    filepos.static.fileposl = array()
    filepos.static.offset = 0


function filepos:init(state) 
        self.state = state
        self.name = 'filepos'
        
        -- since this is a mode, it gets loaded late.
        -- but the editor loads recent files immediately.
        -- fake file loaded here to re-apply view and cursor positions of earlier session.
        -- this shoudn't be a problem as long mode loading is fast enough.
        
        self:fileLoaded(ked_session:get("editor▸file"))
        
        post:on('filepos.goBackward', self.goBackward)
        post:on('filepos.goForward', self.goForward)
        post:on('filepos.swapPrevious', self.swapPrevious)
        
        post:emit('redraw')
        return self
    end

--  ███████  ███   ███  ████████    ███████   ███████   ████████    ███████
-- ███       ███   ███  ███   ███  ███       ███   ███  ███   ███  ███     
-- ███       ███   ███  ███████    ███████   ███   ███  ███████    ███████ 
-- ███       ███   ███  ███   ███       ███  ███   ███  ███   ███       ███
--  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ███████ 


function filepos:cursorsSet() 
        local file = ked_session:get("editor▸file")
        if file then 
            local curview = (self.state:mainCursor() + self.state.s.view)
            
            local fposl = filepos.fileposl
            
            if empty(fposl) then 
                fposl.push(array(file, curview))
            else 
                if ((filepos.offset and (#fposl > 1)) and (fposl[((#fposl - 1) - filepos.offset)][0] == file)) then 
                    fposl[((#fposl - 1) - filepos.offset)][1] = curview
                else 
                    if (filepos.offset and (fposl[((#fposl - 1) - filepos.offset)][0] ~= file)) then 
                        filepos.offset = 0
                    end
                    
                    kutil.pullIf(fposl, function (fp) 
    return (fp[0] == file)
end)
                    fposl.push(array(file, curview))
                end
            end
            
            -- for fp in fposl
            --     log "○ #{b6 slash.file(fp[0])} #{fp[1][0]} #{fp[1][1]} #{fp[1][2]} #{fp[1][3]}"
            
            post:emit('status.filepos', fposl, filepos.offset)
            return ked_session:set("editor▸filepos▸" .. tostring(file) .. "", curview)
        end
    end

-- ███       ███████    ███████   ███████    ████████  ███████  
-- ███      ███   ███  ███   ███  ███   ███  ███       ███   ███
-- ███      ███   ███  █████████  ███   ███  ███████   ███   ███
-- ███      ███   ███  ███   ███  ███   ███  ███       ███   ███
-- ███████   ███████   ███   ███  ███████    ████████  ███████  


function filepos:fileLoaded(file, row, col, view) 
        if row then 
            -- log "filepos.fileLoaded post goto.line #{row} #{col} #{view?[0]} #{view?[1]}"
            return post:emit('goto.line', row, col, view)
        else 
            local posview = ked_session:get("editor▸filepos▸" .. tostring(file) .. "")
            if posview then 
                -- log "filepos.fileLoaded apply session #{posview} #{file}"
                self.state:setCursors(array(posview:slice(1, 2)))
                return self.state:setView(posview:slice(3))
            end
        end
    end

--  ███████  ███   ███   ███████   ████████ 
-- ███       ███ █ ███  ███   ███  ███   ███
-- ███████   █████████  █████████  ████████ 
--      ███  ███   ███  ███   ███  ███      
-- ███████   ██     ██  ███   ███  ███      


function filepos:swapPrevious() 
        if (#filepos.fileposl < 2) then return end
        
        if filepos.offset then 
            filepos.offset = 0
        else 
            local lf = filepos.fileposl:pop()
            local pf = filepos.fileposl:pop()
            filepos.fileposl:push(lf)
            filepos.fileposl:push(pf)
        end
        
        return self:emitOpen()
    end

--  ███████    ███████ 
-- ███        ███   ███
-- ███  ████  ███   ███
-- ███   ███  ███   ███
--  ███████    ███████ 


function filepos:goBackward() 
        if (#filepos.fileposl < 2) then return end
        if (filepos.offset >= (#filepos.fileposl - 1)) then return end
        
        filepos.offset = filepos.offset + 1
        
        return self:emitOpen()
    end


function filepos:goForward() 
        if (#filepos.fileposl < 2) then return end
        if (filepos.offset <= 0) then return end
        
        filepos.offset = filepos.offset - 1
        
        return self:emitOpen()
    end

-- ████████  ██     ██  ███  █████████         ███████   ████████   ████████  ███   ███
-- ███       ███   ███  ███     ███           ███   ███  ███   ███  ███       ████  ███
-- ███████   █████████  ███     ███           ███   ███  ████████   ███████   ███ █ ███
-- ███       ███ █ ███  ███     ███           ███   ███  ███        ███       ███  ████
-- ████████  ███   ███  ███     ███            ███████   ███        ████████  ███   ███


function filepos:emitOpen() 
        local fp = filepos.fileposl[((#filepos.fileposl - filepos.offset) - 1)]
        
        post:emit('status.filepos', filepos.fileposl, filepos.offset)
        return post:emit('file.open', fp[0], fp[1][1], fp[1][0], array(fp[1][2], fp[1][3]))
    end

return filepos