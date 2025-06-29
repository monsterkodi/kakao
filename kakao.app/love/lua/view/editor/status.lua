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
statusfile = require "view.editor.statusfile"


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
        
        self.crumbs:on('action', self.onCrumbsAction, self)
        self.statusfile:on('action', self.onFileAction, self)
        self.filepos:on('action', self.onFileposAction, self)
        
        -- post∙on 'status.filepos' @onStatusFilepos @
        return self
    end


function status:onStatusFilepos(fileposl, fileoffs) 
        print("STATUS FILEPOS", fileposl)
        print("STATUS FILEOFF", fileoffs)
        
        self.fileposl = fileposl
        self.fileoffs = fileoffs
        
        if (self.fileposl:len() > 1) then 
            local off = (function () 
    if self.fileoffs then 
    return ((self.fileposl:len() - self.fileoffs) - 1) else 
    return ''
                  end
end)()
            local tilde = "" .. tostring(tilde) .. "" .. tostring((self.fileposl:len() - 1)) .. ""
            self.filepos:set({tilde = tilde})
        else 
            self.filepos:set(nil)
        end
        
        return self
    end


function status:onFileposAction(action, item) 
        if (action == 'leave') then 
    return print('hide filepos files?')
        elseif (action == 'click') then 
    return post:emit('filepos.swapPrevious')
        elseif (action == 'enter') then 
                if (#filepos.fileposl > 1) then 
                    local files = filepos.fileposl:map(function (fp) 
    return fp[0]
end)
                    -- files = files.reverse()
                    if (filepos.offset == 0) then files:shift() end
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


function status:droopCrumb(path, crumb) 
        -- clearTimeout @droopTimer
        -- delete @droopTimer
        
        path = slash.untilde(path)
        local files = slash.walk(path, {recursive = false})
        local x = (self.crumbs.cells.x + int(((crumb.cols[2] + crumb.cols[1]) / 2)))
        return post:emit('droop.show', {files = files, pos = array(x, (self.crumbs.cells.y + 1))})
    end


function status:onFileAction(action, file) 
        if empty(file) then return end
        print("onFileAction", action, file)
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
        
        local col, row = unpack(self:eventPos(event))
        
        if self.hover then 
            post:emit('pointer', self.pointerType)
        end
        
        if (event.type == 'press') then 
                if self.hover then 
                    if ((1 <= col) and (col <= 4)) then 
                        post:emit('dircol.toggle')
                        return true
                    end
                    
                    if (((self.cells.cols - 12) <= col) and (col <= self.cells.cols)) then 
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
        
        local cw = floor((w / 2))
        
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
        if self:hidden() then return end --or empty @file
        
        self.gutter = self.gutter or 4
        
        local x = 1
        local y = 1
        local cursor = self.state:mainCursor()
        local cols = self.cells.cols
        local fnl = #self.file
        local rdo = self.state:hasRedo()
        local dty = self.state:isDirty()
        local fg = array(255, 0, 0)
        local bg = array(55, 55, 55)
        
        
        function set(x, char, fg, bg) 
            if is(fg, "string") then fg = theme.status[fg] end
            if is(bg, "string") then bg = theme.status[bg] end
            self.cells:set(x, y, char, fg, bg)
            return 1
        end
        
        
        function add(char, fg, bg) 
    x = x + (set(x, char, fg, bg))
    return x
        end
        
        add('', 'col', self.color.gutter)
        local colno = kstr.rpad((self.gutter - 1), "" .. tostring(cursor[1]) .. "")
        for ci = 1, self.gutter-1 do 
            fg = (function () 
    if (cursor[1] > 1) then 
    return 'fg' else 
    return 'col_zero'
                 end
end)()
            if belt.isLinesPosOutside(self.state.s.lines, cursor) then 
                fg = 'col_empty'
            end
            
            local char = (function () 
    if ((ci - 1) < #colno) then 
    return string.sub(colno, (ci - 1), (ci - 1)) else 
    return ' '
                   end
end)()
            add(char, fg, 'col')
        end
        
        add('', 'col', self.color.gutter)
        
        self.crumbs:draw()
        self.statusfile:draw()
        self.filepos:draw()
        
        x = x + (#self.crumbs.rounded)
        x = x + (#self.statusfile.rounded)
        x = x + (#self.filepos.rounded)
        
        add('', 'dark', 'empty')
        if dty then add(' ', 'dirty', 'dark') end
        if dty then add(' ', 'dirty', 'dark') end
        if rdo then add('➜', 'redo', 'dark') end
        add(' ', 'dark', 'dark')
        
        if (self.state.s.cursors:len() > 1) then 
            local cur = "" .. tostring(self.state.s.cursors:len()) .. "♦"
            
            for i in iter(1, cur:len()) do 
                local color = (function () 
    if (i < cur:len()) then 
    return 'cur' else 
    return color.darken(theme.status.cur)
                        end
end)()
                add(cur[i], color, 'dark')
            end
        end
        
        if self.state.s.selections:len() then 
            local sel = "" .. tostring(self.state.s.selections:len()) .. "≡"
            
            for i in iter(1, sel:len()) do 
                local color = (function () 
    if (i < sel:len()) then 
    return 'sel' else 
    return color.darken(theme.status.sel)
                        end
end)()
                add(sel[i], color, 'dark')
            end
        end
        
        if self.state.s.highlights:len() then 
            local hil = "" .. tostring(self.state.s.highlights:len()) .. "❇"
            
            for i in iter(1, hil:len()) do 
                local color = (function () 
    if (i < hil:len()) then 
    return 'hil' else 
    return color.darken(theme.status.hil)
                        end
end)()
                add(hil[i], color, 'dark')
            end
        end
        
        -- fill to the right
        
        for ci = x, cols-1 do 
            add(' ', nil, 'dark')
        end
        
        add('', 'dark', self.color.gutter)
        
        return self:render()
    end

return status