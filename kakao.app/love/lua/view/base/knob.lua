--[[
    000   000  000   000   0000000   0000000  
    000  000   0000  000  000   000  000   000
    0000000    000 0 000  000   000  0000000  
    000  000   000  0000  000   000  000   000
    000   000  000   000   0000000   0000000  

    handles view resizing
    used by dircol and funcol
--]]


local knob = class("knob", view)
    


function knob:init(name) 
        view.init(self, name)
        
        self:setColor('fg', theme.knob.fg)
        self:setColor('bg', theme.knob.bg)
        
        self.parentName = string.sub(self.name, 1, -6)
        self.frameSide = 'right'
        self.maxWidth = 68
        self.pointerType = 'ew-resize'
        return self
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function knob:onMouse(event) 
        view.onMouse(self, event)
        
        if (event.type == 'press') then 
                if self.hover then 
                    post:emit('pointer', 'grabbing')
                    self.doDrag = true
                    return true
                end
        elseif (event.type == 'drag') then 
                if self.doDrag then 
                    self.hover = true
                    
                    local col, row = unpack(self:eventPos(event))
                    
                    local delta = (function () 
    if (self.frameSide == 'left') then 
    return -col
                            elseif (self.frameSide == 'right') then 
    return col
                            end
end)()
                    
                    post:emit('pointer', 'grabbing')
                    if delta then 
                        post:emit('view.size', self.parentName, self.frameSide, delta)
                    end
                    
                    return true
                end
                
                self.hover = false
        elseif (event.type == 'release') then 
                if self.doDrag then 
                    if self.hover then 
                        post:emit('pointer', self.pointerType)
                    end
                    
                    self.doDrag = nil
                    return true
                end
        end
        
        return self.hover
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function knob:draw() 
        if not self.hover then return end
        
        self.cells:fill_col(1, 1, self.cells.rows, '|', self.color.fg, self.color.bg)
        -- log "DRAW" @name
        
        return self.cells:render()
    end

return knob