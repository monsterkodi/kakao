--[[
    ███   ███  ████████  ███████    
    ███  ███   ███       ███   ███  
    ███████    ███████   ███   ███  
    ███  ███   ███       ███   ███  
    ███   ███  ████████  ███████    
--]]

kxk = require "kxk.kxk"
logfile = require "util.logfile"
session = require "util.session"
fileeditor = require "view.editor.fileeditor"
status = require "view.editor.status"
menu = require "view.menu.menu"
macro = require "view.menu.macro"
context = require "view.menu.context"
dircol = require "view.colmns.dircol"
funcol = require "view.colmns.funcol"
theme = require "theme.theme"


local KED = class("KED")
    


function KED:init() 
        self.version = '0.1.0'
        
        self.session = session(self.args)
        self.logfile = logfile()
        
        _G.ked_session = self.session
        _G.screen = {cols = 1, rows = 1, cw = 1, ch = 1}
        
        -- @session.on 'loaded' @onSessionLoaded
        
        -- @indexer  = indexer()
        -- @git      = git()
        
        self.menu = menu()
        self.macro = macro()
        -- @quicky   = quicky()
        -- @browse   = browse()
        self.editor = fileeditor('editor')
        -- @droop    = droop     @screen @editor
        self.dircol = dircol(self.editor, array('scroll', 'knob'))
        self.funcol = funcol(self.editor, array('scroll', 'knob'))
        -- @finder   = finder    @editor
        -- @searcher = searcher  @editor
        -- @differ   = differ    @editor
        self.status = status(self.editor)
        self.context = context()
        -- @input    = input()
        
        -- @input.on 'action' @onInputAction
        
        print("\x1b[0m\x1b[90m", "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "\x1b[0m\x1b[32m", self.session.name, "\x1b[0m\x1b[90m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
        
        -- log "THEME" noon(theme)
        
        -- @editor.state.hasFocus = true
        -- @editor.funtree = @funcol.funtree
        
        post:on('redraw', self.redraw, self)
        post:on('window.focus', self.redraw, self)
        post:on('window.blur', self.redraw, self)
        post:on('input.popup', self.onInputPopup, self)
        post:on('view.size', self.onViewSize, self)
        post:on('quicky', self.onQuicky, self)
        post:on('file.new', self.newFile, self)
        post:on('file.reload', self.reloadFile, self)
        post:on('file.open', self.openFile, self)
        post:on('quit', self.quit, self)
        post:on('file.change', self.onFileChange, self)
        
        self.contextHandlers = array(self.editor, self.dircol, self.funcol)
        self.mouseHandlers = array(self.input, self.context, self.finder, self.searcher, self.differ, self.quicky, self.browse, self.droop, self.menu, self.macro, self.editor, self.status, self.dircol, self.funcol)
        self.wheelHandlers = array(self.finder, self.searcher, self.differ, self.quicky, self.browse, self.droop, self.macro, self.editor, self.dircol, self.funcol)
        self.keyHandlers = array(self.input, self.context, self.finder, self.searcher, self.differ, self.quicky, self.browse, self.droop, self.menu, self.macro, self.editor, self.dircol, self.funcol)
        
        -- log 'ked args:' @args
        
        -- ked_session.set 'ked▸args' @args
        -- 
        -- if valid @args.options
        --     @loadFile @args.options[0]
        -- elif @args.fresh
        --     @hideEditor()
        --     @menu.show true
        -- elif @args.new
        --     @newFile()
        
        self.menu:show(true)
        return self
    end


function KED:showEditor() 
        self.editor:show()
        self.status:show()
        -- @dircol∙show()
        return -- @funcol∙show()
    end


function KED:hideEditor() 
        self.editor:hide()
        self.status:hide()
        -- @dircol∙hide()
        return -- @funcol∙hide()
    end

-- 00000000   000   000  000   000  
-- 000   000  000   000  0000  000  
-- 0000000    000   000  000 0 000  
-- 000   000  000   000  000  0000  
-- 000   000   0000000   000   000  


function KED.static.run() 
    return new(KED())
    end

--  ███████  ████████   ███████   ███████  ███   ███████   ███   ███
-- ███       ███       ███       ███       ███  ███   ███  ████  ███
-- ███████   ███████   ███████   ███████   ███  ███   ███  ███ █ ███
--      ███  ███            ███       ███  ███  ███   ███  ███  ████
-- ███████   ████████  ███████   ███████   ███   ███████   ███   ███


function KED:onSessionLoaded() 
        if self.args.fresh then return end
        if self.args.new then return end
        
        if (empty(self.currentFile) and empty(self.loadingFile)) then 
            local file = ked_session.get("editor▸file")
            if file then 
                -- log 'no current or loading file ... loading last session file'
                return self:loadFile(file)
            else 
                self:hideEditor()
                return self.menu.show(true)
            end
        end
    end

--  ███████   ████████   ████████    ███████   ███   ███   ███████   ████████
-- ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███        ███     
-- █████████  ███████    ███████    █████████  ███ █ ███  ███  ████  ███████ 
-- ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███   ███  ███   ███  ███   ███  ███   ███  ███   ███   ███████   ████████


function KED:arrange(si) 
        local dcw = 0
        local fcw = 0
        
        self.dircol:layout(0, 0, dcw, si.rows)
        self.status:layout(dcw, 0, (si.cols - dcw), 1)
        self.funcol:layout((si.cols - fcw), 1, fcw, (si.rows - 1))
        return self.editor:layout(dcw, 1, ((si.cols - dcw) - fcw), (si.rows - 1))
    end

--  ███████   ███   ███  ███  █████████
-- ███   ███  ███   ███  ███     ███   
-- ███ ██ ██  ███   ███  ███     ███   
-- ███ ████   ███   ███  ███     ███   
--  █████ ██   ███████   ███     ███   


function KED:quit(msg) 
        self.quitting = true
        
        -- @session.save()
        
        print("\x1b[0m\x1b[90m", "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ", "\x1b[0m\x1b[32m", self.session.name, "\x1b[0m\x1b[90m", " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")
        
        if (msg ~= nil) then 
           if msg.stack then 
               error(msg.stack)
           end
           
           error(msg)
        end
        
        self.logfile:close()
        return self
    end

-- 000   000  00000000  000   000  
-- 0000  000  000       000 0 000  
-- 000 0 000  0000000   000000000  
-- 000  0000  000       000   000  
-- 000   000  00000000  00     00  


function KED:newFile() 
        self.currentFile = nil
        
        self.status:setFile('')
        
        self.editor.state.syntax.ext = 'txt'
        self.editor.state:loadLines(array('hello world!1', 'hello world!2', 'hello world!3'))
        
        -- @t.setCursor 0 0
        -- @t.setTitle 'kėd'
        
        if self.editor.mapscr then 
            self.editor.mapscr:reload()
        end
        
        post:emit('file.loaded', nil)
        
        self:showEditor()
        
        self.editor:grabFocus()
        
        return self:redraw()
    end

-- ████████  ███  ███      ████████   ███████  ███   ███   ███████   ███   ███   ███████   ████████
-- ███       ███  ███      ███       ███       ███   ███  ███   ███  ████  ███  ███        ███     
-- ██████    ███  ███      ███████   ███       █████████  █████████  ███ █ ███  ███  ████  ███████ 
-- ███       ███  ███      ███       ███       ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███       ███  ███████  ████████   ███████  ███   ███  ███   ███  ███   ███   ███████   ████████


function KED:onFileChange(event) 
        if (event.path == self.currentFile) then 
            if (event.change == 'delete') then self:newFile() ; return -- todo: load current text into new file
            elseif (event.change == 'change') or (event.change == 'rename') then 
    return self:reloadFile()
            end
        end
    end

-- ████████   ████████  ███       ███████    ███████   ███████  
-- ███   ███  ███       ███      ███   ███  ███   ███  ███   ███
-- ███████    ███████   ███      ███   ███  █████████  ███   ███
-- ███   ███  ███       ███      ███   ███  ███   ███  ███   ███
-- ███   ███  ████████  ███████   ███████   ███   ███  ███████  


function KED:reloadFile() 
        if valid(self.currentFile) then 
            return self:loadFile(self.currentFile)
        else 
            return self:newFile()
        end
    end

--  0000000   00000000   00000000  000   000  
-- 000   000  000   000  000       0000  000  
-- 000   000  00000000   0000000   000 0 000  
-- 000   000  000        000       000  0000  
--  0000000   000        00000000  000   000  


function KED:openFile(path, row, col, view) 
        self:loadFile(path, row, col, view)
        return self.editor:grabFocus()
    end

--  0000000   000   000  000   0000000  000   000  000   000  
-- 000   000  000   000  000  000       000  000    000 000   
-- 000 00 00  000   000  000  000       0000000      00000    
-- 000 0000   000   000  000  000       000  000      000     
--  00000 00   0000000   000   0000000  000   000     000     


function KED:onQuicky(path) 
        if valid(self.loadingFile) then return end
        
        if slash.isAbsolute(path) then 
            local file = path
        else 
            local file = slash.absolute(path, slash.dir(self.currentFile))
        end
        
        if slash.samePath(file, self.currentFile) then return end
        
        return self:loadFile(file)
    end

-- ███       ███████    ███████   ███████          ████████  ███  ███      ████████
-- ███      ███   ███  ███   ███  ███   ███        ███       ███  ███      ███     
-- ███      ███   ███  █████████  ███   ███        ██████    ███  ███      ███████ 
-- ███      ███   ███  ███   ███  ███   ███        ███       ███  ███      ███     
-- ███████   ███████   ███   ███  ███████          ███       ███  ███████  ████████


function KED:loadFile(p, row, col, view) 
        print("ked.loadFile " .. tostring(p) .. " " .. tostring(row) .. " " .. tostring(col) .. " " .. tostring(noon(view)) .. "")
        
        local absFile = p
        if slash.isAbsolute(p) then 
            absFile = slash.absolute(p)
        else 
            absFile = slash.path(process.cwd(), p)
        end
        
        if slash.samePath(absFile, self.loadingFile) then return end
        
        self.loadingFile = absFile
        
        local exists = slash.fileExists(self.loadingFile)
        
        if not exists then 
            warn("ked.loadFile - file doesn't exist! " .. tostring(self.loadingFile) .. "")
            self.loadingFile = nil
            return
        end
        
        self.loadingFile = slash.resolveSymlink(self.loadingFile)
        
        if empty(self.loadingFile) then 
            error("ked.loadFile - " .. tostring(absFile) .. " resolved to empty!")
            return
        end
        
        assert('loadingFile', self.loadingFile)
        
        local readingFile = self.loadingFile
        
        local text = slash.readText(self.loadingFile)
        
        if (self.loadingFile ~= readingFile) then 
            -- warn 'another file started loading, skip editor update'
            return
        end
        
        self.currentFile = self.loadingFile
        
        assert('currentFile', self.currentFile)
        
        self.loadingFile = nil
        
        self.status:setFile(slash.tilde(self.currentFile))
        
        if (text == undefined) then 
            text = '○ binary ○'
        end
        
        local colors, segls = belt.colorSeglsForText(text)
        
        if valid(colors) then 
            self.editor.state.syntax:setColors(colors)
        else 
            self.editor.state.syntax:setExt(slash.ext(self.currentFile))
        end
        
        self.editor.state:loadSegls(segls)
        self.editor:setCurrentFile(self.currentFile)
        ked_session:set("editor▸file", self.currentFile)
        
        mode.fileLoaded(self.editor.state, self.currentFile, row, col, view)
        
        post:emit("file.loaded", self.currentFile)
        
        self:showEditor()
        self:redraw()
        
        self.indexer:index(self.currentFile)
        prjcts.index(self.currentFile)
        git.diff(self.currentFile)
        watcher.watch(self.currentFile)
        
        -- @t.setTitle slash.file(@status.file)
        
        self:saveSessionFile(self.currentFile, 'loaded')
        
        local gitDir = git.dir(self.currentFile)
        if gitDir then 
            watcher.watch(slash.path(gitDir, '.git/refs/heads'), {recursive = false})
        end
        
        return self
    end

--  0000000   0000000   000   000  00000000  
-- 000       000   000  000   000  000       
-- 0000000   000000000   000 000   0000000   
--      000  000   000     000     000       
-- 0000000   000   000      0      00000000  


function KED:saveFile() 
        local text = kseg.str(self.editor.state.s.lines)
        
        if valid(self.currentFile) then 
            slash.write(self.currentFile, text)
            self.editor.state:clearHistory() -- lazy way to 'undirty' :> no undo after save :(
            self:redraw()
            return self:saveSessionFile(self.currentFile, 'saved')
        end
    end


function KED:saveSessionFile(file, typ) 
        frecent:fileAction(file, typ)
        
        return self.session:set('files▸recent', frecent:store('file'))
    end


function KED:saveAs() 
    return print('todo: saveAs')
    end

-- 00000000    0000000    0000000  000000000  00000000  
-- 000   000  000   000  000          000     000       
-- 00000000   000000000  0000000      000     0000000   
-- 000        000   000       000     000     000       
-- 000        000   000  0000000      000     00000000  


function KED:onPaste(text) 
        self.editor.state:insert(text)
        return self:redraw()
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function KED:onMouse(event) 
        if (event.type == 'wheel') then 
            for _, handler in ipairs(self.wheelHandlers) do 
                if handler:onWheel(event) then 
                    return
                end
            end
            
            return
        end
        
        -- log "mouse" event.type, event.x, event.y
        for _, handler in ipairs(self.mouseHandlers) do 
            if handler:onMouse(event) then 
                -- log "handled" handler.name
                event.handled = true
                if ((event.type ~= 'move') or handler.isPopup) then break end
            end
        end
        
        if (((event.button == 'right') and (event.type == 'press')) and (event.count == 1)) then 
            for _, handler in ipairs(self.contextHandlers) do 
                if handler.hover then 
                    if handler:onContext(event) then 
                        break
                    end
                end
            end
        end
    end


function KED:showFinderOrSearcher() 
        if (self.finder:visible() and valid(self.finder.input:current())) then 
            self.searcher:show(self.finder.input:current())
        else 
            self.finder:show()
        end
        
        return self
    end


function KED:showFileposHistory() 
        if (#filepos.fileposl > 1) then 
            local files = filepos.fileposl:map(function (fp) 
    return fp[0]
end)
            files = files:reverse()
            if (filepos.offset == 0) then files.shift() end
            local scx = int((self.screen.cols / 2))
            local scy = int((self.screen.rows / 2))
            post:emit('droop.show', {files = files, pos = array(scx, (scy - 6))})
        end
        
        return self
    end

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function KED:onKey(key, event) 
        -- log 'ked.onKey' event
        
        if (key == 'alt+1') then return post:emit('filepos.goBackward')
        elseif (key == 'alt+2') then return post:emit('filepos.goForward')
        elseif (key == 'cmd+1') then return post:emit('filepos.swapPrevious')
        elseif (key == 'alt+h') then return self:showFileposHistory()
        elseif (key == 'alt+q') or (key == 'ctrl+q') or (key == 'cmd+esc') then return self:quit()
        elseif (key == 'ctrl+r') or (key == 'cmd+r') then return self:reloadFile()
        elseif (key == 'ctrl+s') or (key == 'cmd+s') then return self:saveFile()
        elseif (key == 'shift+cmd+s') or (key == 'shift+ctrl+s') then return self:saveAs()
        elseif (key == 'cmd+n') or (key == 'ctrl+n') then return self:newFile()
        elseif (key == 'alt+m') then return self.menu:show()
        elseif (key == 'cmd+p') or (key == 'ctrl+p') then return self.quicky:showProjectFiles(self.currentFile)
        elseif (key == 'cmd+f') or (key == 'ctrl+f') then return self:showFinderOrSearcher()
        elseif (key == 'shift+cmd+f') or (key == 'shift+ctrl+f') then return self.searcher:show()
        elseif (key == 'alt+o') then return self.editor:jumpToCounterpart()
        elseif (key == 'alt+,') then return self.editor:singleCursorAtLine(self.funcol.funtree:lineIndexOfPrevFunc())
        elseif (key == 'alt+.') then return self.editor:singleCursorAtLine(self.funcol.funtree:lineIndexOfNextFunc())
        elseif (key == 'cmd+o') or (key == 'ctrl+o') or (key == 'cmd+m') or (key == 'cmd+;') or (key == 'ctrl+;') then return self.macro:show()
        elseif (key == 'cmd+.') or (key == 'ctrl+.') then return self.browse:gotoDir(slash.dir(self.currentFile))
        elseif (key == 'cmd+i') then return post:emit('differ.status')
        elseif (key == 'alt+r') then return post:emit('dircol.reveal', self.currentFile)
        elseif (key == "cmd+\\") or (key == "ctrl+\\") then return post:emit('dircol.toggle')
        elseif (key == "cmd+'") or (key == "ctrl+'") then return post:emit('funcol.toggle')
        end
        
        local result = nil
        for handler in self.keyHandlers:each() do 
            -- ●▸ on key
            if not handler:hidden() then 
                print("handler", handler.name)
                result = handler:onKey(key, event)
                print("result", result)
                if result then 
                    break
                end
            end
            
            -- ●▪ on key
        end
        
        -- @redraw() if result.redraw != false
        return self
    end

--  0000000  000  0000000  00000000  
-- 000       000     000   000       
-- 0000000   000    000    0000000   
--      000  000   000     000       
-- 0000000   000  0000000  00000000  


function KED:onViewSize(name, side, delta) 
        self.viewSizeDelta = {name = name, side = side, delta = delta}
        return self:redraw()
    end


function KED:onResize(cols, rows, size, cellsz) 
        local mcw = int((cols / 6))
        
        rounded.cache = {}
        
        if (mcw >= 16) then 
            self.dircol.cells.cols = mcw
            self.funcol.cells.cols = mcw
            self.dircol.show()
            self.funcol.show()
        else 
            self.dircol.hide()
            self.funcol.hide()
        end
        
        squares.onResize(cols, rows, size, cellsz)
        sircels.onResize(cols, rows, size, cellsz)
        self:redraw()
        return self.editor.mapscr.onResize()
    end

-- ███  ███   ███  ████████   ███   ███  █████████       ████████    ███████   ████████   ███   ███  ████████ 
-- ███  ████  ███  ███   ███  ███   ███     ███          ███   ███  ███   ███  ███   ███  ███   ███  ███   ███
-- ███  ███ █ ███  ████████   ███   ███     ███          ████████   ███   ███  ████████   ███   ███  ████████ 
-- ███  ███  ████  ███        ███   ███     ███          ███        ███   ███  ███        ███   ███  ███      
-- ███  ███   ███  ███         ███████      ███          ███         ███████   ███         ███████   ███      


function KED:onInputPopup(opt) 
        self.input.set(opt.text)
        self.input.state.moveCursors('eol')
        self.input.layout(opt.x, opt.y, opt.w, 1)
        self.input.grabFocus()
        self.input.orig = opt.text
        self.input.cb = opt.cb
        return self:redraw()
    end


function KED:onInputAction(action, event) 
        -- log "ked.onInputAction #{action} #{event}"
        if (action == 'submit') then 
                if is(self.input.cb, function () 
                    self.input.cb(self.input.current())
                end) then 
                return self.input.hide()
                end
        elseif (action == 'cancel') then 
                if is(self.input.cb, function () 
                    self.input.cb(self.input.orig)
                end) then 
                return self.input.hide()
                end
        end
    end

-- ███████    ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███████    █████████  █████████
-- ███   ███  ███   ███  ███   ███  ███   ███
-- ███████    ███   ███  ███   ███  ██     ██


function KED:redraw() 
        if self.quitting then 
    return
           end
    end


function KED:draw(cols, rows, cw, ch) 
        if self.quitting then return end
        
        -- @status.gutter = @editor.state.gutterWidth()
        
        _G.screen = {cols = cols, rows = rows, cw = cw, ch = ch}
        
        self:arrange(screen)
        
        if self.menu.greet:hidden() then 
             self.editor:draw() --if not @differ∙visible()
             self.status:draw()
             self.dircol:draw()
             self.funcol:draw()
        end
        
        -- for y in 1..rows
        --     for x in 1..cols
        --         @screen∙set x y string.sub($x 1 1) [50 0 0] 
        
        self.menu:draw()
        self.macro:draw()
        -- @quicky∙draw()
        -- @browse∙draw()
        -- @droop∙draw()
        -- @finder∙draw()
        -- @searcher∙draw()
        -- @differ∙draw()
        self.context:draw()
        return -- @input∙draw()
    end

return KED