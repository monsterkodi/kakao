--[[
     ███████   ███   ███  █████████  █████████  ████████  ████████   
    ███        ███   ███     ███        ███     ███       ███   ███  
    ███  ████  ███   ███     ███        ███     ███████   ███████    
    ███   ███  ███   ███     ███        ███     ███       ███   ███  
     ███████    ███████      ███        ███     ████████  ███   ███  

    displays line numbers to the left of an editor
    used in fileeditor and searcher/finder 
    searcher/finder replaces lineno to display source line numbers 
--]]

view = require "view.base.view"


local gutter = class("gutter", view)
    


function gutter:init(editor) 
        self.editor = editor
        self.state = self.editor.state
        
        view.init(self, self.state.name .. '.gutter')
        
        self:setColor('fg', theme.gutter.fg)
        self:setColor('bg', theme.gutter.bg)
        self:setColor('bg_selected', theme.gutter.bg_selected)
        self:setColor('bg_fully_selected', theme.gutter.bg_fully_selected)
        self:setColor('bg_git_mod', theme.gutter.bg_git_mod)
        self:setColor('bg_git_add', theme.gutter.bg_git_add)
        self:setColor('bg_git_del', theme.gutter.bg_git_del)
        self:setColor('cursor_main', theme.cursor.main)
        self:setColor('cursor_multi', theme.cursor.multi)
        self:setColor('selection', theme.selection.span)
        self:setColor('selection_line', theme.selection.line)
        self:setColor('highlight', theme.highlight.bg)
        
        self.gitChanges = {}
        return self
    end

-- ██     ██   ███████   ███   ███   ███████  ████████
-- ███   ███  ███   ███  ███   ███  ███       ███     
-- █████████  ███   ███  ███   ███  ███████   ███████ 
-- ███ █ ███  ███   ███  ███   ███       ███  ███     
-- ███   ███   ███████    ███████   ███████   ████████


function gutter:onMouse(event) 
        if self.cells:isOutsideEvent(event) then 
            if valid(self.preview) then 
                self.preview = array()
                post:emit('redraw')
            end
            
            return
        end
        
        -- if valid @gitChanges and (event.cmd or event.ctrl or event.alt)            
        --     pos = @eventPos event
        --     idx = pos[1]+@state.s.view[1]
        --     if @gitChanges[idx]
        --         if event.type == 'press'
        --             log 'todo: press on git change!' @gitChanges[idx]
        --         else if event.type == 'move'
        --             if @gitChanges[idx].old
        --                 @preview = [idx]
        --                 ⮐  {redraw:true}
        
        if valid(self.preview) then 
            self.preview = array()
            return post:emit('redraw')
        end
    end


function gutter:drawPreviews() 
        if empty((self.preview or empty), self.gitChanges) then return end
        
        -- for idx _ in ipairs @preview
        --     segl = kseg(@gitChanges[idx].old or '')
        --     # log "drawPreviewLine #{idx}" segl
        --     syntax = @editor.state.syntax
        --     oldDiss = syntax.diss[idx]
        --     syntax.diss[idx] = kulur.dissect [segl] syntax.ext
        --     @editor.drawLine segl idx
        return --     syntax.diss[idx] = oldDiss
    end


function gutter:lineno(y) 
        local lineno = kstr.lpad((self.cells.cols - 1), tostring(y))
        lineno = lineno .. ' '
        return lineno
    end


function gutter:fgcolor(x, y) 
    
    end


function gutter:clearChanges() 
        self.gitChanges = {}
        self.gitBlocks = array()
        return self.gitBlocks
    end

--  ███████   ███  █████████     ███████    ███  ████████  ████████
-- ███        ███     ███        ███   ███  ███  ███       ███     
-- ███  ████  ███     ███        ███   ███  ███  ██████    ██████  
-- ███   ███  ███     ███        ███   ███  ███  ███       ███     
--  ███████   ███     ███        ███████    ███  ███       ███     


function gutter:onGitDiff(diff) 
        self:clearChanges()
        
        for _, change in ipairs(diff.changes) do 
            local firstLine = change.line
            
            local mod = (change.mod or array())
            local add = (change.add or array())
            local del = (change.del or array())
            
            local mods = mod.concat(add)
            local numLines = #mods
            mods = mods.concat(del)
            
            for modi = 0, numLines-1 do 
                local off = (function () 
    if mods[modi].new then 
    return -1 else 
    return 0
                      end
end)()
                self.gitChanges[((firstLine + modi) + off)] = mods[modi]
            end
            
            self.gitBlocks.push(array((change.line - 1), numLines, #mod))
        end
        
        if valid(self.gitChanges) then 
            -- log 'gutter.onGitDiff' @gitChanges
            return post:emit('redraw')
        end
    end

--  ███████   ███  █████████         ███████   ███████  ████████    ███████   ███      ███            
-- ███        ███     ███           ███       ███       ███   ███  ███   ███  ███      ███            
-- ███  ████  ███     ███           ███████   ███       ███████    ███   ███  ███      ███            
-- ███   ███  ███     ███                ███  ███       ███   ███  ███   ███  ███      ███            
--  ███████   ███     ███           ███████    ███████  ███   ███   ███████   ███████  ███████        


function gutter:drawGitScroll() 
        if empty(self.gitBlocks) then return end
        local cw = _G.screen.cw
        local ch = _G.screen.ch
        
        local sw = int((cw / 2))
        local sx = ((self.cells.x - 1) * cw)
        local oy = (self.cells.y * ch)
        local pixelsPerRow = clamp(0, ch, ((ch * self.cells.rows) / #self.state.s.lines))
        
        for _, gb in ipairs(self.gitBlocks) do 
            local sy = int(((gb[0] * pixelsPerRow) + oy))
            
            if (gb[1] <= 0) then 
                local fg = self.color.bg_git_del
                local sh = int(pixelsPerRow)
            else 
                local fg = (function () 
    if gb[2] then 
    return self.color.bg_git_mod else 
    return self.color.bg_git_add
                     end
end)()
                local sh = int((gb[1] * pixelsPerRow))
            end
            
            if (gb[2] and (gb[2] < gb[1])) then 
                local mh = int((gb[2] * pixelsPerRow))
                squares.place(sx, sy, sw, mh, self.color.bg_git_mod)
                sy = sy + mh
                local ah = (sh - mh)
                squares.place(sx, sy, sw, ah, self.color.bg_git_add)
            else 
                squares.place(sx, sy, sw, sh, fg)
            end
        end
    end

-- ███████    ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███████    █████████  █████████
-- ███   ███  ███   ███  ███   ███  ███   ███
-- ███████    ███   ███  ███   ███  ██     ██


function gutter:draw() 
        local mainCursor = self.state:mainCursor()
        
        for row in iter(1, self.cells.rows) do 
            local y = ((self.state.s.view[2] + row) - 1)
            
            local lineno = self:lineno(y)
            
            local hasCursor = self.state:isAnyCursorInLine(y)
            local selected = self.state:isSelectedLine(y)
            local highlighted = self.state:isHighlightedLine(y)
            local spansel = self.state:isSpanSelectedLine(y)
            
            for i in iter(1, #lineno) do 
                local c = string.sub(lineno, i, i)
                local col = i
                if (col < self.cells.rows) then 
                    local sc = self:fgcolor(i, y, c)
                    local fg = self.color.fg
                    if sc then 
                        fg = sc
                    else 
                        local df = (function () 
    if self.state.hasFocus then 
    return 1 else 
    return 0.5
                             end
end)()
                        -- if
                        --     y == mainCursor[1] ➜ fg = color.darken(@color.cursor_main df)
                        --     hasCursor          ➜ fg = @color.cursor_multi
                        --     spansel            ➜ fg = @color.selection
                        --     selected           ➜ fg = @color.selection_line
                        --     highlighted        ➜ fg = @color.highlight
                        
                        -- if (selected or hasCursor or highlighted) and not @cells.screen.t.hasFocus  
                        --     fg = color.darken fg 
                    end
                    
                    local bg = self.color.bg
                    
                    
                        -- @gitChanges[y].old and @gitChanges[y].new ➜ bg = @color.bg_git_mod
                        -- @gitChanges[y].old    ➜ bg = @color.bg_git_del
                        -- @gitChanges[y]        ➜ bg = @color.bg_git_add
                    
                    if spansel then bg = self.color.bg_selected
                    elseif selected then bg = self.color.bg_fully_selected
                    end
                    
                    -- if selected and not @cells.screen.t.hasFocus
                    --     bg = color.darken bg 
                    local cr = (function () 
    if (y < self.state.s.lines:len()) then 
    return c else 
    return ' '
                         end
end)()
                    
                    self.cells:set(col, row, cr, fg, bg)
                end
            end
        end
        
        -- @drawPreviews()
        -- @drawGitScroll()
        return self:render()
    end

return gutter