--[[
     ███████   ███████  ████████    ███████   ███      ███      
    ███       ███       ███   ███  ███   ███  ███      ███      
    ███████   ███       ███████    ███   ███  ███      ███      
         ███  ███       ███   ███  ███   ███  ███      ███      
    ███████    ███████  ███   ███   ███████   ███████  ███████  

    scrolls a view
    used by any multiline editor
--]]

view = require "view.base.view"


local scroll = class("scroll", view)
    


function scroll:init(state, side) 
        side = side or 'left'
        
        self.state = state
        self.side = side
        view.init(self, self.state:owner() .. '_scroll')
        
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
                    post:emit('pointer', 'grabbing')
                    return self:scrollToPixel(event.pixel)
                end
        elseif (event.type == 'drag') then 
                if self.doDrag then 
                    self.hover = true
                    post:emit('pointer', 'grab')
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
        
        local view = self.state.s.view:arr()
        
        local rowf = ((pixel[2] / csz[2]) - self.cells.y)
        view[2] = floor(((rowf * ((self.state.s.lines:len() - self.cells.rows) + 1)) / (self.cells.rows - 1)))
        
        local maxY = (self.state.s.lines:len() - self.cells.rows)
        
        if (maxY > 1) then 
            view[2] = min(maxY, view[2])
        end
        
        view[2] = max(1, view[2])
        
        if view:eql(self.state.s.view) then return true end
        
        self.state:setView(view)
        
        return true
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function scroll:draw() 
        local cw = _G.screen.cw
        local ch = _G.screen.ch
        
        local rows = self.cells.rows
        -- log "DRAW" @cells.cols, rows
        -- @cells∙fill_col 1 1 rows ' ' nil @color.bg
        self.cells:fill_col(1, 1, rows, 'x', array(55, 0, 0), array(255, 0, 0))
        
        -- lnum = @state.s.lines.len
        -- 
        -- ⮐  if lnum <= rows
        -- 
        -- kh = ((rows*rows) / lnum) * ch
        -- ky = ((rows*ch-kh) * @state.s.view[2] / (lnum-rows)) 
        
        -- fg = if @hover ➜ @color.hover ➜ @color.knob
        
        -- x  = @cells.x*cw
        -- y  = int @cells.y*ch+ky
        -- w  = int cw/2
        -- h  = int kh
        
        -- squares∙place x int(y+w/2) w h-w fg
        -- 
        -- sircels∙place x y     w (ky or {fg: @color.dot}) 1111
        -- sircels∙place x y+h-w w ((y+h < (@cells.y+rows)*cw-1) or {fg: @color.dot}) 1111
        
        return self:render()
    end

return scroll