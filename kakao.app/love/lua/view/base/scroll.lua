--[[
     ███████   ███████  ████████    ███████   ███      ███      
    ███       ███       ███   ███  ███   ███  ███      ███      
    ███████   ███       ███████    ███   ███  ███      ███      
         ███  ███       ███   ███  ███   ███  ███      ███      
    ███████    ███████  ███   ███   ███████   ███████  ███████  

    scrolls a view
    used by any multiline editor
--]]

-- use ../../../kxk   ▪ post
-- use ../../theme    ◆ theme
-- use ../../util/img ◆ squares sircels
-- use                ◆ view
view = require "view.base.view"


local scroll = class("scroll", view)
    


function scroll:init(screen, state, side) 
        side = side or 'left'
        
        self.state = state
        self.side = side
        print("----state ", self.state.name)
        -- view.init @ screen (@state∙owner() & '_scroll')
        view.init(self, screen, self.state.name .. '_scroll')
        
        self.pointerType = 'pointer'
        
        self:setColor('bg', theme.gutter.bg)
        self:setColor('dot', theme.scroll.dot)
        self:setColor('knob', theme.scroll.knob)
        self:setColor('hover', theme.scroll.hover)
        return self
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function scroll:onMouse(event) 
        local col, row = self:eventPos(event)
        
        -- super event
        
        if (event.type == 'press') then 
                if self.hover then 
                    self.doDrag = true
                    post.emit('pointer', 'grabbing')
                    return self:scrollToPixel(event.pixel)
                end
        elseif (event.type == 'drag') then 
                if self.doDrag then 
                    self.hover = true
                    post.emit('pointer', 'grab')
                    return self:scrollToPixel(event.pixel)
                end
                
                self.hover = false
        elseif (event.type == 'release') then 
                if self.doDrag then 
                    if self.hover then 
                        post:emit('pointer', 'pointer')
                    end
                    
                    self.doDrag = nil
                    return true
                end
        end
        
        return self.hover
    end


function scroll:isActive() 
        return (#self.state.s.lines > self.cells.rows)
    end

--  0000000   0000000  00000000    0000000   000      000      000000000   0000000   
-- 000       000       000   000  000   000  000      000         000     000   000  
-- 0000000   000       0000000    000   000  000      000         000     000   000  
--      000  000       000   000  000   000  000      000         000     000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000     000      0000000   


function scroll:scrollToPixel(pixel) 
        local csz = self.screen.t.cellsz
        if empty(csz) then return end
        
        local view = self.state.s.view.asMutable()
        
        local rowf = ((pixel[1] / csz[1]) - self.cells.y)
        view[1] = math.floor(((rowf * ((#self.state.s.lines - self.cells.rows) + 1)) / (self.cells.rows - 1)))
        
        local maxY = (#self.state.s.lines - self.cells.rows)
        
        if (maxY > 0) then 
            view[1] = math.min(maxY, view[1])
        end
        
        view[1] = math.max(0, view[1])
        
        if view(eql, self.state.s.view) then return true end
        
        self.state.setView(view)
        
        return {redraw = true}
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function scroll:draw() 
        local csz = self.screen.t.cellsz
        if empty(csz) then return end
        
        local rows = self.cells.rows
        
        self.cells.fill_col(0, 0, rows, ' ', null, self.color.bg)
        
        local lnum = #self.state.s.lines
        
        if (lnum <= rows) then return end
        
        local kh = (((rows * rows) / lnum) * csz[1])
        local ky = ((((rows * csz[1]) - kh) * self.state.s.view[1]) / (lnum - rows))
        
        local fg = (function () 
    if self.hover then 
    return self.color.hover else 
    return self.color.knob
             end
end)()
        
        local x = (self.cells.x * csz[0])
        local y = int(((self.cells.y * csz[1]) + ky))
        local w = int((csz[0] / 2))
        local h = int(kh)
        
        squares.place(x, int((y + (w / 2))), w, (h - w), fg)
        
        sircels.place(x, y, w((ky or {fg = self.color.dot})), 1111)
        return sircels.place(x, ((y + h) - w), w((((y + h) < (((self.cells.y + rows) * csz[1]) - 1)) or {fg = self.color.dot})), 1111)
    end

return scroll