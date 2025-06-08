--[[
0000000    00000000    0000000   000   000
000   000  000   000  000   000  000 0 000
000   000  0000000    000000000  000000000
000   000  000   000  000   000  000   000
0000000    000   000  000   000  00     00
--]]

-- use ../../kxk    ▪ kseg kstr 
-- use ../util      ◆ prof
-- use ../util/img  ◆ rounded
-- use ../theme     ◆ color theme 
-- use ../view/base ◆ view
-- use ./tool       ◆ belt
-- use              ◆ mode

view = require "view.base.view"


local draw = class("draw", view)
    


function draw:init(screen, name, features) 
        view.init(self, screen, name, features)
        
        self:setColor('bg', theme.editor.bg)
        self:setColor('empty', theme.editor.empty)
        
        self:setColor('cursor', theme.cursor)
        self:setColor('selection', theme.selection)
        self:setColor('highlight', theme.highlight)
        return self
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function draw:draw() 
        if self:hidden() then return end
        
        -- prof.start 'draw' if @name == 'editor'
        -- ● draw
        
        local view = self.state.s.view
        local lines = self.state.s.lines
        if self.complete then 
            lines = self.complete:preDrawLines(lines)
        end
        
        -- lines  = mode.preDrawLines @state @state.s.lines
        
        for row = 0, self.cells.rows-1 do 
            local y = (row + view[1])
            
            if (y >= #lines) then break end
            
            self:drawLine(lines[y], y, row)
        end
        
        self:drawTrailingRows()
        self:drawHighlights()
        self:drawSelections()
        
        if self.complete then 
            self.complete:drawCompletion()
        end
        
        self:drawCursors()
        if self.complete then 
            self.complete:drawPopup()
        end
        
        if self.gutter then 
            self.gutter:draw()
        end
        
        if self.mapscr then 
            self.mapscr:draw()
        end
        
        if self.scroll then 
            self.scroll:draw()
        end
        
        -- prof.end 'draw'   if @name == 'editor'
        
        return mode.postDraw(self.state)
    end

-- ███      ███  ███   ███  ████████
-- ███      ███  ████  ███  ███     
-- ███      ███  ███ █ ███  ███████ 
-- ███      ███  ███  ████  ███     
-- ███████  ███  ███   ███  ████████


function draw:drawLine(line, y, row) 
        row = row or ((y - self.state.s.view[1]))
        local bg = self.color.bg
        
        local checkColor = false
        local headerClass = null
        
        local syntax = self.state.syntax
        local view = self.state.s.view
        
        local linel = (kseg.width(line) - view[0])
        
        local c = 0
        local firstIndex = kseg.indexAtWidth(line, view[0]) -- check if leftmost grapheme is 
        local firstSegi = kseg.segiAtWidth(line, view[0]) -- cut in half, if yes, start at
        c = (function () 
    if (firstIndex ~= firstSegi) then 
    return 1
              end
end)() -- one column to the right 
        
        local x = 0
        while (x < self.cells.cols) do 
            local ci = (x + view[0])
            local si = kseg.indexAtWidth(line, ci)
            
            -- log "draw #{@name} #{ci} #{si} #{view} #{r3 kseg.str(line)} #{row} #{@cells.cols} #{@cells.rows} #{y} #{lines.length}"
            
            if (si >= #line) then 
                -- log "#{@name} #{r5 'break!'}"
                break
            end
            
            local fg = syntax.getColor(ci, y)
            
            local ch = syntax.getChar(ci, y, line[si])
            if (ch == "#") then checkColor = true
            elseif ((ch == '0') or (ch == '█')) then 
                local clss = syntax.getClass(ci, y)
                if clss.endsWith('header') then headerClass = clss end
            end
            
            local cw = kseg.segWidth(line[si])
            cw = max(1, cw) -- todo: this is to prevent endless loop with zero width characters, should be fixed eventually
            x = x + cw
            
            if (x < self.cells.cols) then 
                -- @cells.meta_clone c row # ϵ⌶⟙ℍϵℜ 𝛋𝚒⟅⟅ 𝚒𝜏 ⊚ℜ ⫐◯ 𝚒𝜏!
                c = c + (self.cells.add(c, row, ch, fg, bg))
            end
            
            if (clss == 'invert_bg') then 
                bg = self.color.bg
            end
        end
        
        self:drawRowBackground(row, linel)
        
        if checkColor then self:drawColorPills(line, row, linel) end
        if headerClass then 
    return self:drawAsciiHeader(line, row, headerClass)
        end
    end

-- 00000000    0000000   000   000       0000000     0000000    0000000  000   000   0000000   00000000   0000000    
-- 000   000  000   000  000 0 000       000   000  000   000  000       000  000   000        000   000  000   000  
-- 0000000    000   000  000000000       0000000    000000000  000       0000000    000  0000  0000000    000   000  
-- 000   000  000   000  000   000       000   000  000   000  000       000  000   000   000  000   000  000   000  
-- 000   000   0000000   00     00       0000000    000   000   0000000  000   000   0000000   000   000  0000000    


function draw:drawRowBackground(row, linel) 
        if ((row + view[1]) == self.state.mainCursor()[1]) then 
            if (linel > 0) then 
                self.cells.bg_rect(0, row, linel, row, self.color.cursor.main)
            end
            
            if (linel < self.cells.cols) then 
                return self.cells.bg_fill(max(0, linel), row, -1, row, self.color.cursor.empty)
            end
        else 
            if (linel > 0) then 
                self.cells.bg_rect(0, row, linel, row, self.color.bg)
            end
            
            return self.cells.bg_fill(max(0, linel), row, -1, row, self.color.empty)
        end
    end

-- 000000000  00000000    0000000   000  000      000  000   000   0000000   
--    000     000   000  000   000  000  000      000  0000  000  000        
--    000     0000000    000000000  000  000      000  000 0 000  000  0000  
--    000     000   000  000   000  000  000      000  000  0000  000   000  
--    000     000   000  000   000  000  0000000  000  000   000   0000000   


function draw:drawTrailingRows() 
        -- fill empty rows below last line
        local vl = (#self.state.s.lines - self.state.s.view[1])
        if (vl >= self.cells.rows) then return end
        
        for row = vl, self.cells.rows-1 do 
            self.cells:bg_fill(0, row, -1, row, self.color.empty)
        end
    end

-- 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000   0000000  
-- 000   000  000  000        000   000  000      000  000        000   000     000     000       
-- 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000     0000000   
-- 000   000  000  000   000  000   000  000      000  000   000  000   000     000          000  
-- 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000     0000000   


function draw:drawHighlights() 
        local bg = self.color.highlight.bg
        local ul = self.color.highlight.ul
        -- bg = color.darken(bg) if not @cells.screen.t.hasFocus
        
        local vx, vy = self.state.s.view
        
        for highlight in self.state.s.highlights:each() do 
            local y = (highlight[1] - vy)
            
            if (y >= self.cells.rows) then break end
            
            for x = highlight[0], highlight[2]-1 do 
                local hlc = self.cells:get_char((x - vx), y)
                if (hlc == '{') or (hlc == '[') or (hlc == '(') or (hlc == ')') or (hlc == ']') or (hlc == '}') then local ulc = self.color.highlight.bracket_ul ; local bgc = self.color.highlight.bracket
                elseif (hlc == "'") or (hlc == '"') then local ulc = self.color.highlight.string_ul ; local bgc = self.color.highlight.string
                else local ulc = ul ; local bgc = bg
                end
                
                self.cells:set_bg((x - vx), y, bgc)
                self.cells:set_char((x - vx), y, (((color.ul_rgb(ulc) + '\x1b[4:1m') + hlc) + '\x1b[4:0m'))
                self.cells:adjustContrastForHighlight((x - vx), y, bgc)
            end
        end
    end

--  0000000  00000000  000      00000000   0000000  000000000  000   0000000   000   000   0000000  
-- 000       000       000      000       000          000     000  000   000  0000  000  000       
-- 0000000   0000000   000      0000000   000          000     000  000   000  000 0 000  0000000   
--      000  000       000      000       000          000     000  000   000  000  0000       000  
-- 0000000   00000000  0000000  00000000   0000000     000     000   0000000   000   000  0000000   


function draw:drawSelections() 
        -- prof.start 'selection'
        
        local spanbg = self.color.selection.span
        local linebg = self.color.selection.line
        
        if not self.cells.screen.t.hasFocus then 
            spanbg = color.darken(spanbg)
            linebg = color.darken(linebg)
        end
        
        for selection in self.state.s.selections do 
            local bg = (belt.isSpanLineRange(self.state.s.lines, selection) or {spanbg = linebg})
            
            for li in iter(selection[1], selection[3]) do 
                local y = (li - self.state.s.view[1])
                
                if (y >= self.cells.rows) then break end
                
                if (li == selection[1]) then 
                    local xs = selection[0]
                else 
                    local xs = 0
                end
                
                if (li == selection[3]) then 
                    local xe = selection[2]
                else 
                    local xe = kseg.width(self.state.s.lines[li])
                end
                
                for x = xs, xe-1 do 
                    self.cells.set_bg((x - self.state.s.view[0]), y, bg)
                    self.cells.adjustContrastForHighlight(x, y, bg)
                end
            end
        end
        
        return -- prof.end 'selection'
    end

--  0000000  000   000  00000000    0000000   0000000   00000000    0000000  
-- 000       000   000  000   000  000       000   000  000   000  000       
-- 000       000   000  0000000    0000000   000   000  0000000    0000000   
-- 000       000   000  000   000       000  000   000  000   000       000  
--  0000000   0000000   000   000  0000000    0000000   000   000  0000000   


function draw:drawCursors() 
        local s = self.state.s
        local mainCursor = self.state.mainCursor()
        
        local fg = self.color.cursor.fg
        
        local bg = mode.themeColor(self.state, 'cursor.multi', self.color.cursor.multi)
        
        bg = (function () 
    if not self.cells.screen.t.hasFocus then 
    return color.darken(bg)
                              end
end)()
        
        for cursor in s.cursors do 
            if (cursor ~= mainCursor) then 
                if self:isCursorVisible(cursor) then 
                    self.cells.draw_rounded_multi_cursor((cursor[0] - s.view[0]), (cursor[1] - s.view[1]), bg)
                end
            end
        end
        
        if self:isCursorVisible(mainCursor) then 
            fg = self.color.cursor.fg
            
            bg = mode.themeColor(self.state, 'cursor.main', self.color.cursor.main)
            
            if not self:hasFocus() then bg = color.darken(bg) end
            
            local x, y = array((mainCursor[0] - s.view[0]), (mainCursor[1] - s.view[1]))
            
            if (#s.cursors <= 1) then 
                if self:isCursorInEmpty() then 
                    bg = color.darken(bg, 0.5)
                elseif (' ' == self.cells.get_char(x, y)) then 
                    bg = color.darken(bg, 0.8)
                end
            end
            
            bg = (function () 
    if not self.cells.screen.t.hasFocus then 
    return color.darken(bg)
                                  end
end)()
            
            return self.cells.draw_rounded_cursor(x, y, bg)
        end
    end

--  0000000   0000000   000       0000000   00000000   00000000   000  000      000       0000000  
-- 000       000   000  000      000   000  000   000  000   000  000  000      000      000       
-- 000       000   000  000      000   000  0000000    00000000   000  000      000      0000000   
-- 000       000   000  000      000   000  000   000  000        000  000      000           000  
--  0000000   0000000   0000000   0000000   000   000  000        000  0000000  0000000  0000000   


function draw:drawColorPills(line, row, linel) 
        local rngs = kstr.colorRanges(kseg.str(line))
        if rngs then 
            local cx = (max(0, linel) + 1)
            for rng, idx in rngs do 
                local dta = 4
                if (idx == 0) then self.cells.set(cx, row, '', rng.color, self.color.empty) ; cx = cx + 1 ; dta = dta - 1 end
                if (idx == (#rngs - 1)) then dta = dta - 1 end
                self.cells.bg_rect(cx, row, (cx + dta), row, rng.color) ; cx = cx + dta
                if (idx == (#rngs - 1)) then self.cells.set(cx, row, '', rng.color, self.color.empty) end
            end
        end
    end


function draw:drawAsciiHeader(line, row, clss) 
        -- █ █ █ █ █ █ █ █
        -- █ ▉ ▊ ▋ ▌ ▍ ▏ ▕
        
        -- log "▸ #{kseg.str line}"
        
        local chunks = kseg.chunks(line)
        for chunk in chunks do 
            if (chunk.segl[0] == '█') then 
                local x = (chunk.index - self.state.s.view[0])
                local ch = '▎'
                local fg = theme.syntax[(clss + ' highlight')]
                local bg = theme.syntax[clss]
                self.cells.set(x, row, ch, fg, bg)
                
                if (#chunk.segl > 1) then 
                    x = x + ((#chunk.segl - 1))
                    ch = '▋'
                    fg = theme.syntax[clss]
                    bg = theme.syntax[(clss + ' shadow')]
                    self.cells.set(x, row, ch, fg, bg)
                end
            end
        end
    end

return draw