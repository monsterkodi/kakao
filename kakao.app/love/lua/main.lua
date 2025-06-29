kxk = require "kxk.kxk"
ked = require "ked"


local ScrollWheel = class("ScrollWheel")
    ScrollWheel.vel_x = 0
    ScrollWheel.vel_y = 0
    ScrollWheel.inert_x = 0
    ScrollWheel.inert_y = 0
    ScrollWheel.damp = 0.95


function ScrollWheel:update(dt) 
        if ((((self.vel_x == 0) and (self.vel_y == 0)) and (self.inert_x == 0)) and (self.inert_y == 0)) then 
            return
        end
        
        if ((self.vel_y * self.inert_y) < 0) then 
            self:stop()
        end
        
        if (self.vel_y == 0) then 
            self.vel_y = clamp(-3, 3, int(self.inert_y))
            self.inert_y = self.inert_y * (self.damp)
            if (abs(self.inert_y) < 1) then 
                self.inert_y = 0
            end
        end
        
        if (self.vel_x == 0) then 
            self.vel_x = clamp(-6, 6, int(self.inert_x))
            self.inert_x = self.inert_x * (self.damp)
            if (abs(self.inert_x) < 1) then 
                self.inert_x = 0
            end
        end
        
        local mx = clamp(-6, 6, int(self.vel_x))
        local my = clamp(-3, 3, int(self.vel_y))
        local ax = abs(mx)
        local ay = abs(my)
        
        local dir = ''
        if ((abs(my) >= abs(mx)) and (my > 0)) then dir = 'up' ; ax = 0
        elseif ((abs(my) >= abs(mx)) and (my < 0)) then dir = 'down' ; ax = 0
        elseif ((abs(mx) > abs(my)) and (mx < 0)) then dir = 'left'
        elseif ((abs(mx) > abs(my)) and (mx > 0)) then dir = 'right'
        end
        
        if (dir ~= '') then 
            local event = {x = ax, y = ay, type = "wheel", cell = mouseCell, dir = dir}
            ked:onMouse(event)
        end
        
        self.vel_x = self.vel_x - mx
        self.vel_y = self.vel_y - my
        
        self.inert_x = self.inert_x + (self.vel_x)
        self.inert_y = self.inert_y + (self.vel_y)
        
        self.vel_x = 0
        self.vel_y = 0
        return self.vel_y
    end


function ScrollWheel:stop() 
        self.vel_x = 0
        self.vel_y = 0
        self.inert_x = 0
        self.inert_y = 0
        return self.inert_y
    end


function ScrollWheel:impulse(x, y) 
        self.vel_x = x
        self.vel_y = y
        return self.vel_y
    end


function setFontWidth(fw) 
    _G.fontWidth = fw
    _G.font = love.graphics.setNewFont("fonts/Twilio.ttf", (fontWidth * 2))
    local fb1 = love.graphics.newFont("fonts/Meslo.ttf", (fontWidth * 2))
    local fb2 = love.graphics.newFont("fonts/Helvetica.ttf", (fontWidth * 2))
    return _G.font:setFallbacks(fb1, fb2)
end


function screenCell(x, y) 
    return array((int((x / _G.screen.cw)) + 1), (int((y / _G.screen.ch)) + 1))
end


function love.load() 
    local width, height = love.window.getDesktopDimensions()
    
    love.window.setMode((width / 2), height, {
        highdpi = true, 
        usedpiscale = false, 
        resizable = true
        })
    
    love.window.setPosition(0, 0)
    
    love.graphics.setDefaultFilter("nearest", "nearest")
    
    setFontWidth(20)
    
    _G.count = 0
    _G.mouseClick = array()
    
    _G.scrollWheel = ScrollWheel()
    
    --love.window.maximize()
    love.keyboard.setKeyRepeat(true)
    
    _G.ked = ked()
    
    return nil
end


function love.draw() 
    count = count + 1
    local _, _, w, h = love.window.getSafeArea()
    
    local lg = love.graphics
    
    local tth = lg.newText(_G.font, "Xg")
    local ttw = lg.newText(_G.font, "W")
    
    tw, th = ttw:getDimensions() ; local cw = tw
    tw, th = tth:getDimensions() ; local ch = th
    
    local cols = floor((w / cw))
    local rows = floor((h / ch))
    
    ked:draw(cols, rows, cw, ch)
    
    lg.setColor(0.2, 0.2, 0.2)
    
    -- lg.print "#{cols} #{rows} #{w} #{h} #{cw} #{ch} #{love.timer.getFPS()} #{floor(scrollWheel.vel_y)} #{floor(scrollWheel.inert_y)} ◂" 16*cw 0
    
    -- log "hasGlyphs", _G.font∙hasGlyphs("⮐➜▸∙◌○◇□✔✘●◆▪◼■△┬")
    
    return nil
end


function love.update(dt) 
    return scrollWheel:update(dt)
end


function love.quit() 
    ked:quit()
    return false
end


function love.keypressed(key, scancode, isrepeat) 
    local mods = ""
    if (key == "escape") then key = "esc"
    elseif (key == "backspace") then key = "delete"
    elseif (key == "lshift") or (key == "rshift") or (key == "lctrl") or (key == "rctrl") or (key == "lalt") or (key == "ralt") or (key == "lgui") or (key == "rgui") then 
            return
    end
    
    local lk = love.keyboard
    
    if (lk.isDown('lshift') or lk.isDown('rshift')) then mods = mods .. "shift+" end
    if (lk.isDown('lctrl') or lk.isDown('rctrl')) then mods = mods .. "ctrl+" end
    if (lk.isDown('lalt') or lk.isDown('ralt')) then mods = mods .. "alt+" end
    if (lk.isDown('lgui') or lk.isDown('rgui')) then mods = mods .. "cmd+" end
    
    local combo = mods .. key
    local char = (function () 
    if (key == "return") then 
    return "\n"
           elseif (key == "tab") then 
    return "\t"
           elseif (key == "space") then 
    return " "
           elseif (key == "up") or (key == "down") or (key == "right") or (key == "esc") or (key == "delete") or (key == "left") then 
    return ""
           else 
                    if (#mods == 0) then 
                        return key
                    elseif (mods == "shift+") then 
                        if (key == "1") then 
    return "!"
                        elseif (key == "2") then 
    return "@"
                        elseif (key == "3") then 
    return "#"
                        elseif (key == "4") then 
    return "$"
                        elseif (key == "5") then 
    return "%"
                        elseif (key == "6") then 
    return "^"
                        elseif (key == "7") then 
    return "&"
                        elseif (key == "8") then 
    return "*"
                        elseif (key == "9") then 
    return "("
                        elseif (key == "0") then 
    return ")"
                        elseif (key == "-") then 
    return "_"
                        elseif (key == "=") then 
    return "+"
                        elseif (key == "[") then 
    return "{"
                        elseif (key == "]") then 
    return "}"
                        elseif (key == "\\") then 
    return "|"
                        elseif (key == ";") then 
    return ":"
                        elseif (key == "'") then 
    return '"'
                        elseif (key == ",") then 
    return "<"
                        elseif (key == ".") then 
    return ">"
                        elseif (key == "/") then 
    return "?"
                        elseif (key == '`') then 
    return "~"
                        else 
    return string.upper(key)
                        end
                    else 
                        return ""
                    end
           end
end)()
    
    if (combo == "cmd+-") then setFontWidth(max(14, (fontWidth - 1)))
    elseif (combo == "cmd+=") then setFontWidth(min(128, (fontWidth + 1)))
    elseif (combo == "cmd+0") then setFontWidth()
    else 
                    local event = {["repeat"] = isrepeat, combo = combo, char = char}
                    -- log "key", dict.str(event), ◌b, scancode
                    ked:onKey(combo, event)
    end
    
    return true
end


function love.mousepressed(x, y, button, istouch, presses) 
    button = (function () 
    if (button == 1) then 
    return "left" else 
    return "right"
             end
end)()
    _G.mouseCell = screenCell(x, y)
    
    scrollWheel:stop()
    
    local count = 1
    if _G.mouseClick[button] then 
        local click = _G.mouseClick[button]
        if ((abs((x - click.x)) < 10) and (abs((y - click.y)) < 10)) then 
            if ((love.timer.getTime() - click.time) < 300) then 
                count = (click.count + 1)
            end
        end
    end
    
    _G.mouseClick[button] = {
        x = x, 
        y = y, 
        count = count, 
        time = love.timer.getTime()
        }
    
    local event = {x = x, y = y, type = "press", button = button, count = mouseClick[button].count, cell = mouseCell}
    -- log "EVENT" noon(event)
    return ked:onMouse(event)
end


function love.mousereleased(x, y, button, istouch, presses) 
    button = (function () 
    if (button == 1) then 
    return "left" else 
    return "right"
             end
end)()
    _G.mouseCell = screenCell(x, y)
    local event = {x = x, y = y, type = "release", button = button, count = 1, cell = mouseCell}
    -- log "EVENT" noon(event)
    return ked:onMouse(event)
end


function love.touchpressed(id, x, y) 
    return print("TOUCH DOWN", x, y)
end


function love.touchreleased(id, x, y) 
    return print("TOUCH UP", x, y)
end


function love.mousemoved(x, y) 
    local button = ""
    _G.mouseCell = screenCell(x, y)
    local typ = "move"
    if love.mouse.isDown(1) then 
        button = "right"
        typ = "drag"
    end
    
    local event = {x = x, y = y, type = typ, button = button, cell = mouseCell}
    return ked:onMouse(event)
end


function love.wheelmoved(x, y) 
    return scrollWheel:impulse(x, y)
end

-- love.keyreleased = key scancode ->
-- 
--     log 'keyreleased ' key, " " scancode