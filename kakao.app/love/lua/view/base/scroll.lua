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
        view.init(self, screen, self.state:owner() .. '_scroll')
        
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
        
        view.onMouse(self, event)
        
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
        local csz = self.screen:size()
        
        local view = self.state.s.view --.asMutable()
        
        local rowf = ((pixel[2] / csz[2]) - self.cells.y)
        view[2] = floor(((rowf * ((#self.state.s.lines - self.cells.rows) + 1)) / (self.cells.rows - 1)))
        
        local maxY = (#self.state.s.lines - self.cells.rows)
        
        if (maxY > 1) then 
            view[2] = min(maxY, view[2])
        end
        
        view[2] = max(1, view[2])
        
        if (view == self.state.s.view) then return true end
        
        self.state:setView(view)
        
        return {redraw = true}
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function scroll:draw() 
        -- csz = @screen.t.cellsz
        -- ⮐  if empty csz
        local csz = self.screen:size()
        
        local rows = self.cells.rows
        
        self.cells:fill_col(1, 1, rows, ' ', nil, self.color.bg)
        
        -- lnum = @state.s.lines.len
        -- 
        -- ⮐  if lnum <= rows
        -- 
        -- kh = ((rows*rows) / lnum) * csz[2]
        -- ky = ((rows*csz[2]-kh) * @state.s.view[2] / (lnum-rows)) 
        
        -- fg = if @hover ➜ @color.hover ➜ @color.knob
        
        -- x  = @cells.x*csz[1]
        -- y  = int @cells.y*csz[2]+ky
        -- w  = int csz[1]/2
        -- h  = int kh
        
        -- squares∙place x int(y+w/2) w h-w fg
        -- 
        -- sircels∙place x y     w (ky or {fg: @color.dot}) 1111
        return -- sircels∙place x y+h-w w ((y+h < (@cells.y+rows)*csz[1]-1) or {fg: @color.dot}) 1111
    end

return scroll