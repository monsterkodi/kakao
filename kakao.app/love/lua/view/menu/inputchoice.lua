--[[
    ███  ███   ███  ████████   ███   ███  █████████   ███████  ███   ███   ███████   ███   ███████  ████████  
    ███  ████  ███  ███   ███  ███   ███     ███     ███       ███   ███  ███   ███  ███  ███       ███       
    ███  ███ █ ███  ████████   ███   ███     ███     ███       █████████  ███   ███  ███  ███       ███████   
    ███  ███  ████  ███        ███   ███     ███     ███       ███   ███  ███   ███  ███  ███       ███       
    ███  ███   ███  ███         ███████      ███      ███████  ███   ███   ███████   ███   ███████  ████████  

    a combination of input and choices
    the input is usually hidden and only shown when user types text to filter the choices
--]]

-- use ../../../kxk ▪ post
-- use ../../theme  ◆ color theme
-- use ../base      ◆ view input
-- use ../menu      ◆ choices

view = require "view.base.view"
input = require "view.base.input"


local inputchoice = class("inputchoice", view)
    


function inputchoice:init(screen, name, features) 
        self.screen = screen
        self.name = name
        
        -- super @screen @name features
        view.init(self, screen, name, features)
        
        self.autoHideInput = true
        self.isVisible = false
        self.isPopup = true
        
        self.input = input(self.screen, "" .. self.name .. "_input")
        self.choices = choices(self.screen, "" .. self.name .. "_choices", features)
        
        self:setColor('bg', theme.quicky.bg)
        self:setColor('frame', theme.quicky.frame)
        
        if self.choices.mapscr then 
            self.choices.mapscr:hide()
        end
        
        self.input:hide()
        self.choices:show()
        
        self.input:on('action', self.onInputAction)
        self.choices:on('action', self.onChoicesAction)
        return self
    end


function inputchoice:setColor(key, clr) 
        -- super key clr
        
        if (key == 'bg') then 
            self.input:setColor('bg_blur', self.color.bg)
            return self.choices:setColor('bg', self.color.bg)
        end
    end


function inputchoice:inputIsActive() 
    return (self.input:hasFocus() or (#self.input:current() > 0))
    end

--  ███████   ████████   ████████    ███████   ███   ███   ███████   ████████
-- ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███        ███     
-- █████████  ███████    ███████    █████████  ███ █ ███  ███  ████  ███████ 
-- ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███   ███  ███   ███  ███   ███  ███   ███  ███   ███   ███████   ████████


function inputchoice:arrange() 
        local x = int((self.screen.cols / 4))
        local y = int((self.screen.rows / 4))
        local w = int((self.screen.cols / 2))
        local h = int(((self.screen.rows / 2) - 4))
        
        local cs = min(h, self.choices.numFiltered())
        
        self.input.layout((x + 2), (y + 1), (w - 4), 1)
        self.choices.layout((x + 2), (y + 3), (w - 3), cs)
        return self.cells.layout(x, y, w, (cs + 4))
    end

--  0000000  000   000   0000000   000   000
-- 000       000   000  000   000  000 0 000
-- 0000000   000000000  000   000  000000000
--      000  000   000  000   000  000   000
-- 0000000   000   000   0000000   00     00


function inputchoice:show() 
        view.show(self)
        
        if self.choices:numFiltered() then 
            self.choices:grabFocus()
        elseif self.input:visible() then 
            self.input:grabFocus()
        end
        
        return {redraw = true}
    end


function inputchoice:hide() 
        self.choices.mapscr.hide()
        return -- super()
    end

-- 000  000   000  00000000   000   000  000000000  
-- 000  0000  000  000   000  000   000     000     
-- 000  000 0 000  00000000   000   000     000     
-- 000  000  0000  000        000   000     000     
-- 000  000   000  000         0000000      000     


function inputchoice:onInputChange(text) 
        if (text == self.choices.filterText) then return end
        
        self.choices.filter(text)
        self.choices.state.selectLine(0)
        
        self.choices.state.setMainCursor(0, 0)
        self:choicesFiltered()
        return self:arrange()
    end


function inputchoice:onInputAction(action, text) 
        if (action == 'submit') then 
    return self:applyChoice(self.choices.current())
        elseif (action == 'change') then 
    return self:onInputChange(text)
        elseif (action == 'up') or (action == 'down') then 
    return self.choices.moveSelection(action)
        end
    end


function inputchoice:autoHide() 
    if (self.autoHideInput and not self:inputIsActive()) then 
    return self.input.hide()
                               end
    end

--  0000000  000   000   0000000   000   0000000  00000000   0000000  
-- 000       000   000  000   000  000  000       000       000       
-- 000       000000000  000   000  000  000       0000000   0000000   
-- 000       000   000  000   000  000  000       000            000  
--  0000000  000   000   0000000   000   0000000  00000000  0000000   


function inputchoice:onChoicesAction(action, choice) 
        if (action == 'click') or (action == 'right') or (action == 'space') or (action == 'return') then 
    return self:applyChoice(self.choices.current())
        elseif (action == 'hover') then 
    return self:autoHide()
        elseif (action == 'boundary') or (action == 'left') then 
                if self.input.visible() then 
                    self.input.grabFocus()
                    return true
                end
        end
    end


function inputchoice:choicesFiltered() 
    
    end


function inputchoice:currentChoice() 
        local choice = (self.choices.current() or self.input.current())
        choice = (function () 
    if is(choice, str) then 
    return trim(choice)
                              end
end)()
        return choice
    end

-- 0000000    00000000    0000000   000   000
-- 000   000  000   000  000   000  000 0 000
-- 000   000  0000000    000000000  000000000
-- 000   000  000   000  000   000  000   000
-- 0000000    000   000  000   000  00     00


function inputchoice:draw() 
        if self:hidden() then return end
        
        self:arrange()
        self:drawFrame()
        return self:drawChoices()
    end


function inputchoice:drawChoices() 
        self.input:draw()
        return self.choices:draw()
    end


function inputchoice:drawFrame() 
        local sy = 0
        
        if self.input:visible() then 
            local outer = (function () 
    if self.input:hasFocus() then 
    return color.brighten(self.color.bg) else 
    return self.color.bg
                    end
end)()
            local inner = (function () 
    if self.input:hasFocus() then 
    return self.input.color.bg_focus else 
    return self.input.color.bg_blur
                    end
end)()
            
            self.cells:draw_rounded_border(0, 0, -1, 2, {fg = outer})
            
            -- add left and right half-width padding to input
            self.cells:draw_vertical_padding(1, 1, outer, inner)
            self.cells:draw_vertical_padding((self.cells.cols - 2), 1, inner, outer)
            
            sy = 2
        end
        
        return self.cells:draw_rounded_border(0, sy, -1, -1, {fg = self.color.bg, zLayer = 1001})
    end


function inputchoice:moveFocus() 
        if self.choices:hasFocus() then 
            self.input:grabFocus()
            return self.input:selectAll()
        else 
            self.choices:grabFocus()
            return self:autoHide()
        end
    end

-- 000   000  00000000  000   000
-- 000  000   000        000 000
-- 0000000    0000000     00000
-- 000  000   000          000
-- 000   000  00000000     000


function inputchoice:onKey(key, event) 
        if self:hidden() then return end
        
        if (event.combo == 'tab') then 
                return self:moveFocus()
        elseif (event.combo == 'esc') then 
                post.emit('focus', 'editor')
                return self:hide()
        end
        
        if self.input:hasFocus() then 
            local result = self.input:onKey(key, event)
            if result then 
                self:autoHide()
                return result
            end
            
            print("focused input didn't handle key " .. key .. "?")
        end
        
        local result = self.choices:onKey(key, event)
        if result then 
            if ((event.char and (event.char ~= ' ')) and (event.char ~= '\n')) then 
                self.input:grabFocus()
                result = self.input:onKey(key, event)
                if result then 
                    self:autoHide()
                    return result
                end
            else 
                if (key == 'down') then self.choices:grabFocus() end
                self:autoHide()
                return result
            end
        end
        
        return true
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function inputchoice:onMouse(event) 
        if self:hidden() then return end
        
        local ret = self.input:onMouse(event) ; if ret.redraw then return ret end
        local ret = self:choices▸onMouse(event) ; if ret.redraw then return ret end
        local ret = super(event) ; if ret.redraw then return ret end
        
        if ((event.type == 'press') and not self.hover) then 
            post:emit('focus', 'editor')
            self:hide()
            return -- give other views a chance to handle the closing click
        end
        
        return self.hover
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function inputchoice:onWheel(event) 
        if self:hidden() then return end
        local ret = self.input:onWheel(event)
        if ret.redraw then return ret end
        ret = self.choices:onWheel(event)
        if ret.redraw then return ret end
        
        local inside = self.cells:isInsideEvent(event)
        if inside then 
    return {redraw = false}
        end
    end

return inputchoice