--[[
    ███   ███  ███  ████████  ███   ███ 
    ███   ███  ███  ███       ███ █ ███ 
     ███ ███   ███  ███████   █████████ 
       ███     ███  ███       ███   ███ 
        █      ███  ████████  ██     ██ 

    keeps track of
        ▪ screen cells
        ▪ visibility
        ▪ theme colors
        ▪ view features
        ▪ mouse enter and leave
        ▪ current popup
--]]

-- use ../../../kxk ▪ events post
-- use ../../theme  ◆ color
-- use ../screen    ◆ cells 
cells = require "view.screen.cells"


local view = class("view", events)
    view.static.currentPopup = nil


function view:init(screen, name, features) 
        self.screen = screen
        self.name = name
        self.cells = cells(self.screen)
        self.color = {}
        self.feats = {}
        if features then 
            for _, f in ipairs(features) do 
                self.feats[f] = true
            end
        end
        
        self.isVisible = true
        self.focusable = false
        return self
    end


function view:setColor(key, clr) 
    self.color[key] = color.values(clr)
    return self.color[key]
    end

-- 000   000  000   0000000  000  0000000    000  000      000  000000000  000   000  
-- 000   000  000  000       000  000   000  000  000      000     000      000 000   
--  000 000   000  0000000   000  0000000    000  000      000     000       00000    
--    000     000       000  000  000   000  000  000      000     000        000     
--     0      000  0000000   000  0000000    000  0000000  000     000        000     


function view:show() 
        self.isVisible = true
        
        if self.isPopup then 
            if (view.currentPopup and (view.currentPopup ~= self)) then 
                local popup = view.currentPopup
                view.currentPopup = nil
                popu:hide()
            end
            
            view.currentPopup = self
            -- log "view popup.show #{@name}" 
            post:emit('popup.show', self.name)
        end
        
        self:arrange()
        return {redraw = true}
    end


function view:hide() 
        self.isVisible = false
        
        if self.isPopup then 
            if (self == view.currentPopup) then 
                view.currentPopup = nil
                -- log "view popup.hide #{@name}" 
                post.emit('popup.hide', self.name)
            end
        end
        
        return {redraw = true}
    end


function view:arrange() 
    
    end

function view:hidden() 
    return not self:visible()
    end

function view:visible() 
    return self.isVisible
    end

function view:toggle() 
    if self:hidden() then 
    return self:show() else 
    return self:hide()
                end
    end


function view:collapsed() 
    return ((self.cells.rows <= 0) or (self.cells.cols <= 0))
    end


function view:eventPos(event) 
    return self.cells.posForEvent(event)
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function view:onMouse(event) 
    return self:handleHover(event)
    end

function view:onWheel(event) 
    return print("view.onWheel " .. self.name .. "")
    end


function view:onMouseLeave(event) 
    return post.emit('redraw')
    end

function view:onMouseEnter(event) 
        if (self.focusable and is(self.grabFocus, function () 
            self:grabFocus()
        end)) then 
        if self.pointerType then 
            post.emit('pointer', self.pointerType)
            return post.emit('redraw')
        end
        end
    end


function view:handleHover(event) 
        local inside = (not event.handled and self.cells.isInsideEvent(event))
        if (self.hover and not inside) then 
            self.hover = false
            self:onMouseLeave(event)
        else if (inside and not self.hover) then 
            self.hover = true
            self:onMouseEnter(event)
             end
        end
        
        return self.hover
    end


function view:onKey(key, event) 
    return print("view.onKey " .. self.name .. "")
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function view:layout(x, y, w, h) 
    return self.cells:layout(x, y, w, h)
    end


function view:draw() 
    
    end

return view