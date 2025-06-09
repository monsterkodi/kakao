--[[
     ███████  ████████  ███      ███       ███████  
    ███       ███       ███      ███      ███       
    ███       ███████   ███      ███      ███████   
    ███       ███       ███      ███           ███  
     ███████  ████████  ███████  ███████  ███████   

    represents a rectangular subset of screen cells
    wraps screen cell manipulation functions with transformed coordinates
    provides some utilities to quickly fill cells
--]]

belt = require "edit.tool.belt"
color = require "theme.color"
theme = require "theme.theme"
-- use util.img.rounded


local cells = class("cells")
    


function cells:init(screen) 
        self.screen = screen
        self.x = 1
        self.y = 1
        self.cols = 0
        self.rows = 0
        return self
    end


function cells:rect() 
    return array(self.x, self.y, ((self.x + self.cols) - 1), ((self.y + self.rows) - 1))
    end


function cells:layout(x, y, cols, rows) 
        self.x = x
        self.y = y
        self.cols = cols
        self.rows = rows
        return self.rows
    end

--  0000000  00000000  000000000  
-- 000       000          000     
-- 0000000   0000000      000     
--      000  000          000     
-- 0000000   00000000     000     


function cells:wx(x) 
    if (x < 0) then 
    return ((self.x + self.cols) + x) else 
    return (self.x + x)
             end
    end

function cells:wy(y) 
    if (y < 0) then 
    return ((self.y + self.rows) + y) else 
    return (self.y + y)
             end
    end


function cells:inside(x, y) 
    return ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows))
    end

function cells:outside(x, y) 
    return not self:inside(x, y)
    end


function cells:add(x, y, char, fg, bg) 
    if self:inside(x, y) then 
    return self.screen:add(self:wx(x), self:wy(y), char, fg, bg) else 
    return 0xffffffffff
                                  end
    end

function cells:set(x, y, char, fg, bg) 
    if self:inside(x, y) then 
    return self.screen:set(self:wx(x), self:wy(y), char, fg, bg)
                                  end
    end

function cells:set_unsafe(x, y, char, fg, bg) 
    return self.screen:set((self.x + x), (self.y + y), char, fg, bg)
    end

function cells:set_char(x, y, char) 
    if self:inside(x, y) then 
    return self.screen:set_char(self:wx(x), self:wy(y), char)
                                  end
    end

function cells:set_ch_fg(x, y, char, fg) 
    if self:inside(x, y) then 
    return self.screen:set_ch_fg(self:wx(x), self:wy(y), char, fg)
                                  end
    end

function cells:set_bg(x, y, bg) 
    if self:inside(x, y) then 
    return self.screen:set_bg(self:wx(x), self:wy(y), bg)
                                  end
    end

function cells:set_fg(x, y, fg) 
    if self:inside(x, y) then 
    return self.screen:set_fg(self:wx(x), self:wy(y), fg)
                                  end
    end

function cells:set_fg_bg(x, y, fg, bg) 
    if self:inside(x, y) then 
    return self.screen:set_fg_bg(self:wx(x), self:wy(y), fg, bg)
                                  end
    end


function cells:meta_clear() 
    return delete(self.m)
    end

function cells:meta_pre(x, y, p) 
    if self:inside(x, y) then self.m = self.m or (belt.metas(self.cols, self.rows)) ; return self.m[y][x].pre:push(p) end
    end

function cells:meta_pst(x, y, p) 
    if self:inside(x, y) then self.m = self.m or (belt.metas(self.cols, self.rows)) ; return self.m[y][x].pst:push(p) end
    end

function cells:meta_clone(x, y) 
        if empty(self.m) then return end
        -- log "clone #{x} #{y} #{@m[y][x].pre} #{@m[y][x].pst}" @m[y][x]
        return self.screen:meta_set(self:wx(x), self:wy(y), self.m[y][x])
    end

--  0000000   00000000  000000000  
-- 000        000          000     
-- 000  0000  0000000      000     
-- 000   000  000          000     
--  0000000   00000000     000     


function cells:get_char(x, y) 
    return self.screen:get_char(self:wx(x), self:wy(y))
    end

function cells:get_bg(x, y) 
    return self.screen:get_bg(self:wx(x), self:wy(y))
    end

function cells:get_fg(x, y) 
    return self.screen:get_fg(self:wx(x), self:wy(y))
    end

-- 00000000    0000000    0000000  
-- 000   000  000   000  000       
-- 00000000   000   000  0000000   
-- 000        000   000       000  
-- 000         0000000   0000000   


function cells:isInsidePos(x, y) 
                     local x, y = belt.pos(x, y) ; return (((0 <= x) < self.cols) and ((0 <= y) < self.rows))
    end

function cells:isOutsidePos(x, y) 
                     local x, y = belt.pos(x, y) ; return ((((x < 0) or (x >= self.cols)) or (y < 0)) or (y >= self.rows))
    end


function cells:isInsideScreen(x, y) 
    return self:isInsidePos(self:posForScreen(x, y))
    end

function cells:isOutsideScreen(x, y) 
    return self:isOutsidePos(self:posForScreen(x, y))
    end


function cells:isInsideEvent(evt) 
    return self:isInsidePos(self:posForEvent(evt))
    end

function cells:isOutsideEvent(evt) 
    return self:isOutsidePos(self:posForEvent(evt))
    end


function cells:posForScreen(x, y) 
                     local x, y = belt.pos(x, y) ; return array((x - self.x), (y - self.y))
    end

function cells:screenForPos(x, y) 
                     local x, y = belt.pos(x, y) ; return array((x + self.x), (y + self.y))
    end

function cells:posForEvent(evt) 
    return self:posForScreen(evt.cell)
    end

-- 0000000     0000000           00000000   00000000   0000000  000000000  
-- 000   000  000                000   000  000       000          000     
-- 0000000    000  0000          0000000    0000000   000          000     
-- 000   000  000   000          000   000  000       000          000     
-- 0000000     0000000   000000  000   000  00000000   0000000     000     


function cells:bg_rect(x1, y1, x2, y2, bg) 
        if (x1 < 0) then x1 = (self.cols + x1) end
        if (x2 < 0) then x2 = (self.cols + x2) end
        
        if (y1 < 0) then y1 = (self.rows + y1) end
        if (y2 < 0) then y2 = (self.rows + y2) end
        
        for row in iter(y1, y2) do 
            if (row < self.rows) then 
                for col in iter(x1, x2) do 
                    if (col < self.cols) then 
                        self:set_bg(col, row, bg)
                    end
                end
            end
        end
    end

-- ████████  ███  ███      ███    
-- ███       ███  ███      ███    
-- ██████    ███  ███      ███    
-- ███       ███  ███      ███    
-- ███       ███  ███████  ███████


function cells:bg_fill(x1, y1, x2, y2, bg) 
        if (x1 < 0) then x1 = (self.cols + x1) end
        if (x2 < 0) then x2 = (self.cols + x2) end
        
        if (y1 < 0) then y1 = (self.rows + y1) end
        if (y2 < 0) then y2 = (self.rows + y2) end
        
        if (x1 > x2) then return end
        
        for row in iter(y1, y2) do 
            if (row < self.rows) then 
                for col in iter(x1, x2) do 
                    if (col < self.cols) then 
                        self:set_bg(col, row, bg)
                        self:set_char(col, row, ' ')
                    end
                end
            end
        end
    end


function cells:fill_rect(x1, y1, x2, y2, char, fg, bg) 
        x1 = clamp(0, (self.cols - 1), x1)
        y1 = clamp(0, (self.rows - 1), y1)
        if (x2 < 0) then x2 = (self.cols + x2) end
        if (y2 < 0) then y2 = (self.rows + y2) end
        
        for row in iter(y1, y2) do 
            for col in iter(x1, x2) do 
                self:set(col, row, char, fg, bg)
            end
        end
    end


function cells:fill_row(row, x1, x2, char, fg, bg) 
        if ((x1 < 0) and (x2 < 0)) then return end
        
        x1 = clamp(0, (self.cols - 1), x1)
        x2 = clamp(0, (self.cols - 1), x2)
        
        if (x2 < x1) then return end
        
        for col in iter(x1, x2) do 
            self:set(col, row, char, fg, bg)
        end
    end


function cells:fill_col(col, y1, y2, char, fg, bg) 
        if ((y1 < 0) and (y2 < 0)) then return end
        
        y1 = clamp(0, (self.rows - 1), y1)
        y2 = clamp(0, (self.rows - 1), y2)
        
        if (y2 < y1) then return end
        
        for row in iter(y1, y2) do 
            self:set(col, row, char, fg, bg)
        end
    end

-- ████████  ████████    ███████   ██     ██  ████████
-- ███       ███   ███  ███   ███  ███   ███  ███     
-- ██████    ███████    █████████  █████████  ███████ 
-- ███       ███   ███  ███   ███  ███ █ ███  ███     
-- ███       ███   ███  ███   ███  ███   ███  ████████


function cells:draw_frame(x1, y1, x2, y2, opt) 
        if ((x1 < 0) and (x2 < 0)) then return end
        if ((y1 < 0) and (y2 < 0)) then return end
        
        if (x2 < 0) then x2 = ((self.cols + 1) + x2) end
        if (y2 < 0) then y2 = ((self.rows + 1) + y2) end
        
        opt = opt or ({})
        opt.pad = opt.pad or (array(1, 0)) -- padding at left and right edge by default
        
        -- ╭─┬─╮
        -- │ │ │
        -- ├─┼─┤ 
        -- │ │ │
        -- ╰─┴─╯
        
        local fg = (opt.fg or array(100, 100, 100))
        local bg = (opt.bg or nil)
        
        self:set(x1, y1, '╭', fg, bg)
        self:set(x2, y1, '╮', fg, bg)
        self:set(x1, y2, '╰', fg, bg)
        self:set(x2, y2, '╯', fg, bg)
        
        self:fill_row(y1, (x1 + 1), (x2 - 1), '─', fg, bg)
        self:fill_row(y2, (x1 + 1), (x2 - 1), '─', fg, bg)
        self:fill_col(x1, (y1 + 1), (y2 - 1), '│', fg, bg)
        self:fill_col(x2, (y1 + 1), (y2 - 1), '│', fg, bg)
        
        for x = 1, (opt.pad[1] + 1)-1 do 
            self:fill_col(((x1 + 1) + x), (y1 + 1), (y2 - 1), ' ', fg, bg)
            self:fill_col(((x2 - 1) - x), (y1 + 1), (y2 - 1), ' ', fg, bg)
        end
        
        -- for y in opt.hdiv
        --     @set  x1  y '' fg bg
        --     @set  x2  y '' fg bg
        return --     @fill_row y x1+1 x2-1 '─' fg bg
    end

-- ████████    ███████   ███   ███  ███   ███  ███████    ████████  ███████  
-- ███   ███  ███   ███  ███   ███  ████  ███  ███   ███  ███       ███   ███
-- ███████    ███   ███  ███   ███  ███ █ ███  ███   ███  ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███  ████  ███   ███  ███       ███   ███
-- ███   ███   ███████    ███████   ███   ███  ███████    ████████  ███████  


function cells:draw_rounded_border(x1, y1, x2, y2, opt) 
        -- ⮐  if x1 < 0 and x2 < 0
        -- ⮐  if y1 < 0 and y2 < 0
        -- 
        -- if x2 < 0 ➜ x2 = @cols + x2 
        -- if y2 < 0 ➜ y2 = @rows + y2 
        -- 
        -- opt ?= {}
        -- fg     = opt.fg or '#888'
        -- zLayer = opt.zLayer or 1000
        
        self:draw_frame(x1, y1, x2, y2, opt)
        
        -- log "HROGLS"
        -- 
        -- @img x1 y1 'rounded.border.tl' fg zLayer  
        -- @img x2 y1 'rounded.border.tr' fg zLayer  
        -- @img x1 y2 'rounded.border.bl' fg zLayer  
        -- @img x2 y2 'rounded.border.br' fg zLayer  
        -- 
        -- @img x1+1 y1 'rounded.border.t'  fg zLayer x2-1 
        -- if y1+1 < y2 ➜ @img x1 y1+1 'rounded.border.l'  fg zLayer x1 y2-1  
        -- if x1+1 < x2 ➜ @img x1+1 y2 'rounded.border.lb' fg zLayer          
        -- @img x1+2 y2 'rounded.border.b'  fg zLayer x2-1
        -- if y1+1 < y2 ➜ @img x2 y1+1 'rounded.border.rt' fg zLayer x2       
        return -- if y1+2 < y2 ➜ @img x2 y1+2 'rounded.border.r'  fg zLayer x2 y2-1  
    end


function cells:draw_vertical_padding(x, y, fg, bg, zLayer) 
        zLayer = zLayer or 1000
        
        return rounded.place(self:wx(x), self:wy(y), 'rounded.vertical', fg, nil, nil, zLayer, bg)
    end


function cells:draw_horizontal_padding(x, y, fg, bg, zLayer) 
        zLayer = zLayer or 1000
        
        return rounded.place(self:wx(x), self:wy(y), 'rounded.horizontal', fg, nil, nil, zLayer, bg)
    end

--  ███████  ███   ███  ████████    ███████   ███████   ████████ 
-- ███       ███   ███  ███   ███  ███       ███   ███  ███   ███
-- ███       ███   ███  ███████    ███████   ███   ███  ███████  
-- ███       ███   ███  ███   ███       ███  ███   ███  ███   ███
--  ███████   ███████   ███   ███  ███████    ███████   ███   ███


function cells:draw_rounded_cursor(x, y, fg) 
        return self:img(x, y, "rounded.cursor", fg)
    end


function cells:draw_rounded_multi_cursor(x, y, fg) 
        return self:img(x, y, "rounded.multi", fg)
    end


function cells:img(x, y, name, fg, zLayer, xe, ye) 
        zLayer = zLayer or 1000
        
        if self:outside(x, y) then return end
        
        return -- rounded.place @wx(x) @wy(y) name fg @wx(xe) @wy(ye) zLayer
    end

--  0000000   0000000          000         0000000   0000000   000   000  000000000  00000000    0000000    0000000  000000000  
-- 000   000  000   000        000        000       000   000  0000  000     000     000   000  000   000  000          000     
-- 000000000  000   000        000        000       000   000  000 0 000     000     0000000    000000000  0000000      000     
-- 000   000  000   000  000   000        000       000   000  000  0000     000     000   000  000   000       000     000     
-- 000   000  0000000     0000000          0000000   0000000   000   000     000     000   000  000   000  0000000      000     


function cells:adjustContrastForHighlight(x, y, highlightColor) 
        local ofg = self:get_fg(x, y)
        return self:set_fg(x, y, color.adjustForBackground(ofg, highlightColor))
    end

return cells