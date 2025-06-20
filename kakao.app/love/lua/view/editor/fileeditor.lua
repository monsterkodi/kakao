--[[
00000000  000  000      00000000  00000000  0000000    000  000000000   0000000   00000000 
000       000  000      000       000       000   000  000     000     000   000  000   000
000000    000  000      0000000   0000000   000   000  000     000     000   000  0000000  
000       000  000      000       000       000   000  000     000     000   000  000   000
000       000  0000000  00000000  00000000  0000000    000     000      0000000   000   000
--]]

editor = require "edit.editor"
context = require "view.menu.context"


local fileeditor = class("fileeditor", editor)
    


function fileeditor:init(name) 
        local features = array('scroll', 'gutter', 'mapscr', 'complete', 'filepos', 'replex', 'brckts', 'unype', 'salter', 'vimple', 'uniko')
        
        editor.init(self, name, features)
        
        -- if @feats.mapscr
        --     @mapscr = mapscr @
        --     @mapscr.show()
        
        post:on('editor.highlight', self.state.highlightText, self.state)
        post:on('goto.line', self.onGotoLine, self)
        post:on('goto.bof', self.onGotoBof, self)
        post:on('goto.eof', self.onGotoEof, self)
        post:on('goto.func', self.onGotoFunc, self)
        post:on('git.diff', self.onGitDiff, self)
        post:on('git.commit', self.onGitCommit, self)
        post:on('funtree.loaded', self.onFuntreeLoaded, self)
        return self
    end


function fileeditor:setCurrentFile(currentFile) 
        self.currentFile = currentFile
        self.cells.meta_clear()
        return self.gutter.clearChanges()
    end


function fileeditor:onFuntreeLoaded() 
        if valid(self.gotoFuncOnLoad) then 
            self:onGotoFunc(self.gotoFuncOnLoad)
            return delete(self.gotoFuncOnLoad)
        end
    end


function fileeditor:onGitCommit() 
        return self.gutter.clearChanges()
    end

--  ███████   ███  █████████     ███████    ███  ████████  ████████
-- ███        ███     ███        ███   ███  ███  ███       ███     
-- ███  ████  ███     ███        ███   ███  ███  ██████    ██████  
-- ███   ███  ███     ███        ███   ███  ███  ███       ███     
--  ███████   ███     ███        ███████    ███  ███       ███     


function fileeditor:onGitDiff(diff) 
        local currentFile = ked_session.get('editor▸file')
        if (diff.file == currentFile) then 
            return self.gutter.onGitDiff(diff)
        end
    end

--[[        
     ███████    ███████   █████████   ███████         ███      ███  ███   ███  ████████  
    ███        ███   ███     ███     ███   ███        ███      ███  ████  ███  ███       
    ███  ████  ███   ███     ███     ███   ███        ███      ███  ███ █ ███  ███████   
    ███   ███  ███   ███     ███     ███   ███        ███      ███  ███  ████  ███       
     ███████    ███████      ███      ███████         ███████  ███  ███   ███  ████████  
    
    sets the main cursor:
        ◆ row       zero based line index to move the main cursor to
        ◆ col       optional column for the main cursor
        ◆ view      optional view offset
    --]]


function fileeditor:onGotoLine(row, col, view) 
        local mc = self.state.mainCursor()
        
        col = col or (mc[0])
        if is(col, str) then 
            if (col == 'ind') then col = belt.numIndent(self.state.s.lines[row])
            end
        end
        
        if (valid(view) and is(view, array)) then 
            self.state.setView(view)
            return self.state.setCursors(array(array(col, row)))
        else 
            local adjust = (view or 'topBotDeltaGrow')
            return self.state.setCursors(array(array(col, row)), {adjust = adjust})
        end
    end


function fileeditor:onGotoBof() 
    return self.state.moveCursors('bof')
    end

function fileeditor:onGotoEof() 
    return self.state.moveCursors('eof')
    end


function fileeditor:onGotoFunc(func) 
        local li = self.funtree.lineIndexForFunc(func)
        if li then 
            return self:onGotoLine(li, 'ind', 'topDelta')
        end
    end

--  ███████   ███████   ███   ███  █████████  ████████  ███   ███  █████████
-- ███       ███   ███  ████  ███     ███     ███        ███ ███      ███   
-- ███       ███   ███  ███ █ ███     ███     ███████     █████       ███   
-- ███       ███   ███  ███  ████     ███     ███        ███ ███      ███   
--  ███████   ███████   ███   ███     ███     ████████  ███   ███     ███   


function fileeditor:onContext(event) 
        local word = self.state:textOfSelectionOrWordAtCursor()
        if valid(word) then word = " '" .. tostring(word) .. "'" end
        return context.show(event.cell, fileeditor.onContextChoice, array("search" .. tostring(word) .. "", "find" .. tostring(word) .. "", 'status'))
    end


function fileeditor.static.onContextChoice(choice) 
        if kstr.startsWith(choice, 'search') then 
            return post:emit('searcher.show', kstr.trim(string.sub(choice, 7, -2), " '"))
        elseif kstr.startsWith(choice, 'find') then 
            return post:emit('finder.show', kstr.trim(string.sub(choice, 5, -2), " '"))
        else 
            if (choice == 'status') then 
    return post:emit('differ.status')
            end
        end
    end

--       ███  ███   ███  ██     ██  ████████         █████████   ███████         ███   ███   ███████   ████████   ███████  
--       ███  ███   ███  ███   ███  ███   ███           ███     ███   ███        ███ █ ███  ███   ███  ███   ███  ███   ███
--       ███  ███   ███  █████████  ████████            ███     ███   ███        █████████  ███   ███  ███████    ███   ███
-- ███   ███  ███   ███  ███ █ ███  ███                 ███     ███   ███        ███   ███  ███   ███  ███   ███  ███   ███
--  ███████    ███████   ███   ███  ███                 ███      ███████         ██     ██   ███████   ███   ███  ███████  


function fileeditor:jumpToWord(word) 
        -- log "fileeditor.jumpToWord '#{word}'"
        -- log 'fileeditor.jumpToWord classes' Object.keys(indexer.singleton.classes)
        -- log 'fileeditor.jumpToWord funcs'   Object.keys(indexer.singleton.funcs)
        
        local clss = indexer.singleton.classes[word]
        if clss then 
            post:emit('file.open', clss.file, (clss.line - 1))
            return true
        elseif indexer.singleton.funcs[word] then 
            local fnc = indexer.singleton.funcs[word]
            if is(fnc, array) then 
                local currentFile = ked_session.get('editor▸file')
                for fun, idx in ipairs(fnc) do 
                    if (fun.file == currentFile) then 
                        fnc = fnc[((idx + 1) % #fnc)]
                        break
                    end
                end
                
                if is(fnc, array) then 
                    fnc = fnc[0]
                end
            end
            
            if valid(fnc.file) then 
                post:emit('file.open', fnc.file, (fnc.line - 1), 'ind')
                return true
            end
        else 
            print("fileeditor.jumpToWord(" .. tostring(word) .. ") nothing found to jump to")
        end
        
        return false
    end


function fileeditor:singleCursorAtLine(li) 
        if empty(li) then return end
        
        self.state.setCursors(array(array(0, li)), {main = 'ind', adjust = 'topBotDelta'})
        
        return post:emit('redraw')
    end

--  ███████   ███████   ███   ███  ███   ███  █████████  ████████  ████████   ████████    ███████   ████████   █████████
-- ███       ███   ███  ███   ███  ████  ███     ███     ███       ███   ███  ███   ███  ███   ███  ███   ███     ███   
-- ███       ███   ███  ███   ███  ███ █ ███     ███     ███████   ███████    ████████   █████████  ███████       ███   
-- ███       ███   ███  ███   ███  ███  ████     ███     ███       ███   ███  ███        ███   ███  ███   ███     ███   
--  ███████   ███████    ███████   ███   ███     ███     ████████  ███   ███  ███        ███   ███  ███   ███     ███   


function fileeditor:jumpToCounterpart() 
        local currentFile = ked_session.get('editor▸file')
        local currext = slash.ext(currentFile)
        
        for ext in (fileutil.counterparts[currext] or array()) do 
            if nfs.fileExists(slash.swapExt(currentFile, ext)) then 
                self.gotoFuncOnLoad = self.funtree.current()
                post:emit('file.open', slash.swapExt(currentFile, ext))
                return
            end
        end
        
        for ext in (fileutil.counterparts[currext] or array()) do 
            local counter = slash.swapExt(currentFile, ext)
            local file = fileutil.swapLastDir(counter, currext, ext)
            
            if nfs.fileExists(file) then 
                self.gotoFuncOnLoad = self.funtree.current()
                post:emit('file.open', file)
                return
            end
        end
        
        for ext in (fileutil.counterparts[currext] or array()) do 
            local counter = slash.swapExt(currentFile, ext)
            
            if (currext == 'noon') then 
                local file = fileutil.swapLastDir(counter, 'kode', 'js')
                if nfs.fileExists(file) then 
                    post:emit('file.open', file)
                    return
                end
            end
            
            if (currext == 'json') then 
                local file = fileutil.swapLastDir(counter, 'js', 'kode')
                if nfs.fileExists(file) then 
                    post:emit('file.open', file)
                    return
                end
            end
        end
        
        return print('cant find counterpart', currentFile)
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function fileeditor:onMouse(event) 
        if editor.onMouse(self, event) then return true end
        if not ((self.dragStart or self.cells:isInsideEvent(event)) or self.gutter.cells:isInsideEvent(event)) then 
            return self.hover
        end
        
        local col, row = unpack(self:eventPos(event))
        
        if (event.type == 'press') then 
                if (event.count > 1) then 
                    if (not event.shift and (event.button == 'left')) then self.state:deselect() end
                    
                    local x = (col + self.state.s.view[1])
                    local y = (row + self.state.s.view[2])
                    
                    self.state:clearHighlights()
                    
                    if (event.count == 2) then 
                        if event.alt then 
                            self.state:selectChunk(x, y)
                        else 
                            self.state:selectWord(x, y)
                        end
                    else 
                        self.state:selectLine(y)
                    end
                    
                    self.state:highlightSelection()
                    
                    self.dragStart = copy(self.state.s.selections[1])
                    
                    return true
                else 
                    local x = ((col + self.state.s.view[1]) - 1)
                    local y = ((row + self.state.s.view[2]) - 1)
                    
                    if (event.cmd or event.ctrl) then 
                        local word = belt.wordAtPos(self.state.s.lines, array(x, y))
                        if word then 
                            -- log "jumpToWord #{word}" event
                            if self:jumpToWord(word) then 
                                return
                            end
                        end
                    end
                    
                    self.dragStart = array(x, y, x)
                    
                    if (not event.shift and (event.button == 'left')) then self.state:deselect() end
                    if not event.alt then self.state:clearCursors() end
                    
                    if event.alt then 
                        self.state:addCursor(x, y)
                    else 
                        if (event.shift and (#self.state.s.cursors == 1)) then 
                            self.state:setMainCursorAndSelect(x, y)
                        else 
                            self.state:setMainCursor(x, y)
                        end
                    end
                    
                    self:grabFocus()
                    
                    return true
                end
        elseif (event.type == 'drag') then 
                if self.dragStart then 
                    local x = (col + self.state.s.view[1])
                    local y = (row + self.state.s.view[2])
                    
                    local start = array(self.dragStart[0], self.dragStart[1])
                    
                    if (y < self.dragStart[1]) then 
                        start = array(self.dragStart[2], self.dragStart[1])
                    end
                    
                    if event.shift then self.state:addRangeToSelectionWithMainCursorAtEnd(belt.rangeFromStartToEnd(start, array(x, y)))
                    else self.state:select(start, array(x, y))
                    end
                    
                    return true
                end
        elseif (event.type == 'release') then 
                self.dragStart = nil
        elseif (event.type == 'move') then 
                if self.hover then 
                    if (not self:hasFocus() and empty(view.currentPopup)) then 
                        self:grabFocus()
                    end
                    
                    post:emit('pointer', 'text')
                elseif self.gutter.cells:isInsideEvent(event) then 
                    post:emit('pointer', 'vertical-text')
                end
        end
        
        return self.hover
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function fileeditor:onWheel(event) 
        if (event.cell[1] >= (self.cells.y + self.cells.rows)) then return end
        
        if self.dragStart then 
            local steps = 1 -- should be 4 if not using a mouse pad -> config
            if event.shift then steps = steps * 2 end
            if event.ctrl then steps = steps * 2 end
            if event.alt then steps = steps * 2 end
            
            local x, y = self.state.mainCursor()
            
            if (event.dir == 'up') then y = y - steps
            elseif (event.dir == 'down') then y = y + steps
            elseif (event.dir == 'left') then x = x - 1
            elseif (event.dir == 'right') then x = x + 1
            end
            
            y = clamp(0, (self.state.s.lines:len() - 1), y)
            x = clamp(0, (self.state.s.lines[y]:len() - 1), x)
            
            local start = array(self.dragStart[0], self.dragStart[1])
            
            if (y < self.dragStart[1]) then 
                start = array(self.dragStart[2], self.dragStart[1])
            end
            
            if self.state.select(start, array(x, y)) then 
                self:redraw()
            end
            
            return
        end
        
        -- super event
        return self
    end

return fileeditor