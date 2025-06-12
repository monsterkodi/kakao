--[[
     ███████  █████████   ███████   █████████  ███   ███   ███████  
    ███          ███     ███   ███     ███     ███   ███  ███       
    ███████      ███     █████████     ███     ███   ███  ███████   
         ███     ███     ███   ███     ███     ███   ███       ███  
    ███████      ███     ███   ███     ███      ███████   ███████   

    the row above the fileeditor
    displays currently edited file and editor state information 
--]]

view = require "view.base.view"
crumbs = require "view.base.crumbs"
bubble = require "view.base.bubble"
statusfile = require "view.status.statusfile"


local fileposSyntax = class("fileposSyntax")
    


function fileposSyntax:init() 
        self.color = {}
        self.color.number = theme.status.filepos
        -- @color.symbol = color.darken @color.number 0.8
        self.color.symbol = theme.status.filepos
        return self
    end


function fileposSyntax:getColor(x, y, ch) 
        if (ch == '') then 
    return self.color.symbol
        else 
    return self.color.number
        end
    end


local status = class("status", view)
    


function status:init(editor) 
        self.editor = editor
        
        view.init(self, 'status')
        
        self.state = self.editor.state
        self.gutter = 4
        self.file = ''
        self.drawTime = ''
        self.fileposl = array()
        self.fileoffs = array()
        
        self.pointerType = 'pointer'
        
        self:setColor('gutter', theme.gutter.bg)
        
        self.crumbs = crumbs("status_crumbs")
        self.statusfile = statusfile("status_file")
        self.filepos = bubble("status_filepos")
        
        self.crumbs:setColor('empty_left', self.color.gutter)
        self.crumbs:setColor('empty_right', theme.status.empty)
        
        self.filepos:setColor('empty', theme.status.empty)
        self.filepos.syntax = fileposSyntax()
        
        self.crumbs:on('action', self.onCrumbsAction)
        self.statusfile:on('action', self.onFileAction)
        self.filepos:on('action', self.onFileposAction)
        
        -- post.on 'status.filepos' @onStatusFilepos
        return self
    end

-- onStatusFilepos: @fileposl @fileoffs -> 
-- 
--     if @fileposl.length > 1
--         tilde = if @fileoffs ➜ @fileposl.length-@fileoffs-1 ➜ ''
--         @filepos.set tilde:"#{tilde}#{@fileposl.length-1}"
--     else
--         @filepos.set null 


function status:onFileposAction(action, item) 
        if (action == 'leave') then 
    return print('hide filepos files?')
        elseif (action == 'click') then 
    return post:emit('filepos.swapPrevious')
        elseif (action == 'enter') then 
                if (#filepos.fileposl > 1) then 
                    local files = filepos.fileposl.map(function (fp) 
    return fp[0]
end)
                    files = files.reverse()
                    if (filepos.offset == 0) then files.shift() end
                    return -- post∙emit 'droop.show' files:files pos:[@filepos.cells.x+int(@filepos.cells.cols/2) @filepos.cells.y+1]
                end
        end
    end


function status:onCrumbsAction(action, path, event) 
        -- switch action
        -- 
        --     'click'  
        --         
        --         clearTimeout @droopTimer
        --         if valid event.mods
        --             post∙emit 'dircol.root' path
        --         else
        --             post∙emit 'browse.dir' path
        --             
        --     'enter'
        --         
        --         post∙emit 'droop.hide'
        --         clearTimeout @droopTimer
        --         @droopTimer = setTimeout ((p e) -> ->  @droopCrumb(p e))(path event), 500
        --         
        --     'leave'
        --         
        --         clearTimeout @droopTimer
        return --         delete @droopTimer
    end


function status:droopCrumb(path, crumb, ○) 
        clearTimeout(self.droopTimer)
        delete(self.droopTimer)
        
        path = slash.untilde(path)
        local files = ○(nfs.list, path, {recursive = false})
        local x = (self.crumbs.cells.x + int(((crumb.cols[1] + crumb.cols[0]) / 2)))
        return post:emit('droop.show', {files = files, pos = array(x, (self.crumbs.cells.y + 1))})
    end


function status:onFileAction(action, file) 
        if (action == 'click') then 
    return post:emit('browse.dir', slash.dir(file), file)
        end
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function status:onMouse(event) 
        local cret = self.crumbs:onMouse(event)
        local sret = self.statusfile:onMouse(event)
        local fret = self.filepos:onMouse(event)
        
        if ((sret or cret) or fret) then 
            return ((sret or cret) or fret)
        end
        
        view.onMouse(self, event)
        
        local col, row = self:eventPos(event)
        
        if self.hover then 
            post:emit('pointer', self.pointerType)
        end
        
        if (event.type == 'press') then 
                if self.hover then 
                    if ((0 <= col) < 4) then 
                        post:emit('dircol.toggle')
                        return true
                    end
                    
                    if (((self.cells.cols - 12) <= col) < self.cells.cols) then 
                        post:emit('funcol.toggle')
                        return true
                    end
                end
        end
        
        return self.hover
    end

--  0000000  00000000  000000000        00000000  000  000      00000000  
-- 000       000          000           000       000  000      000       
-- 0000000   0000000      000           000000    000  000      0000000   
--      000  000          000           000       000  000      000       
-- 0000000   00000000     000           000       000  0000000  00000000  


function status:setFile(file) 
        self.file = file
        if empty(self.file) then return end
        self.crumbs:set(slash.dir(self.file))
        return self.statusfile:set(self.file)
    end

-- ███       ███████   ███   ███   ███████   ███   ███  █████████
-- ███      ███   ███   ███ ███   ███   ███  ███   ███     ███   
-- ███      █████████    █████    ███   ███  ███   ███     ███   
-- ███      ███   ███     ███     ███   ███  ███   ███     ███   
-- ███████  ███   ███     ███      ███████    ███████      ███   


function status:layout(x, y, w, h) 
        view.layout(self, x, y, w, h)
        
        local cw = math.floor((w / 2))
        
        x = x + ((self.gutter + 1))
        
        self.crumbs:layout(x, y, cw, 1) -- 𝜏𝖍𝚒𝖘 ⟅◯⊚𝛋𝖘 ϝ𝚒𝖘𝖍𝛾 
        self.crumbs:layout(x, y, #self.crumbs.rounded, 1) -- ⟒𝖍𝛾 𝜏⟒⊚ ⟅𝕒𝛾◯𝓊𝜏𝖘?
        
        x = x + (#self.crumbs.rounded)
        
        self.statusfile:layout(x, y, #self.statusfile.rounded, 1)
        
        x = x + (#self.statusfile.rounded)
        
        return self.filepos:layout(x, y, #self.filepos.rounded, 1)
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function status:draw() 
        if (self:hidden() or empty(self.file)) then return end
        
        local x = 0
        local y = 0
        local cursor = self.state:mainCursor()
        local cols = self.cells.cols
        local fnl = #self.file
        local rdo = self.state:hasRedo()
        local dty = self.state:isDirty()
        
        
        function set(x, char, fg, bg) 
            if is(fg, str) then fg = theme.status[fg] end
            if is(bg, str) then bg = theme.status[bg] end
            self.cells.set(x, y, char, fg, bg)
            return 1
        end
        
        
        function add(char, fg, bg) 
    x = x + (set(x, char, fg, bg))
    return x
        end
        
        add('', 'col', self.color.gutter) -- column number ...
        local colno = rpad((self.gutter - 1), "" .. tostring(cursor[0]) .. "")
        for ci = 1, self.gutter-1 do 
            local fg = (function () 
    if cursor[0] then 
    return 'fg' else 
    return 'col_zero'
                 end
end)()
            if belt.isLinesPosOutside(self.state.s.lines, cursor) then 
                fg = 'col_empty'
            end
            
            local char = (function () 
    if ((ci - 1) < #colno) then 
    return colno[(ci - 1)] else 
    return ' '
                   end
end)()
            add(char, fg, 'col')
        end
        
        add('', 'col', self.color.gutter) -- column number end
        
        self.crumbs:draw() -- dir path
        self.statusfile:draw() -- file
        self.filepos:draw()
        
        x = x + (#self.crumbs.rounded)
        x = x + (#self.statusfile.rounded)
        x = x + (#self.filepos.rounded)
        
        -- dirty and redo indicators
        add('', 'dark', 'empty')
        if dty then add('', 'dirty', 'dark') end
        if dty then add(' ', 'dirty', 'dark') end
        if rdo then add('', 'redo', 'dark') end
        add(' ', 'dark', 'dark')
        
        if (#self.state.s.cursors > 1) then 
            local cur = "" .. tostring(#self.state.s.cursors) .. "♦"
            
            for i = 0, #cur-1 do 
                local color = (function () 
    if (i < (#cur - 1)) then 
    return 'cur' else 
    return color.darken(theme.status.cur)
                        end
end)()
                add(cur[i], color, 'dark')
            end
        end
        
        if #self.state.s.selections then 
            local sel = "" .. tostring(#self.state.s.selections) .. "≡"
            
            for i = 0, #sel-1 do 
                local color = (function () 
    if (i < (#sel - 1)) then 
    return 'sel' else 
    return color.darken(theme.status.sel)
                        end
end)()
                add(sel[i], color, 'dark')
            end
        end
        
        if #self.state.s.highlights then 
            local hil = "" .. tostring(#self.state.s.highlights) .. "❇"
            
            for i = 0, #hil-1 do 
                local color = (function () 
    if (i < (#hil - 1)) then 
    return 'hil' else 
    return color.darken(theme.status.hil)
                        end
end)()
                add(hil[i], color, 'dark')
            end
        end
        
        -- fill to the right
        
        for ci = x, (cols - 1)-1 do 
            add(' ', null, 'dark')
        end
        
        add('', 'dark', self.color.gutter)
        
        ci = clamp(0, 3, math.floor((((self.time / (1000 * 1000)) - 8) / 8)))
        local ch = string.sub(" •", ci) -- 
        local fg = array(array(32, 32, 32), array(0, 96, 0), array(255, 0, 0), array(255, 255, 0))[ci]
        -- switch ch
        --     '•' ➜ 1 #log "#{g1 ch} #{w3 kstr.time(BigInt(@time))}"
        --     '' ➜ 1 #log "#{r3 ch} #{w3 kstr.time(BigInt(@time))}"
        --     '' ➜ log "#{y5 ch} #{w3 kstr.time(BigInt(@time))}"
        return set((cols - 2), ch, fg, 'dark')
    end

return status