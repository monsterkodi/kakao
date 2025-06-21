kxk = require "kxk.kxk"
ked = require "ked"


function love.load() 
    local width, height = love.window.getDesktopDimensions()
    
    love.window.setMode((width / 2), height, {
        highdpi = true, 
        usedpiscale = false, 
        resizable = true
        })
    
    love.window.setPosition(0, 0)
    
    love.graphics.setDefaultFilter("nearest", "nearest")
    
    _G.fontWidth = 24
    _G.font = love.graphics.setNewFont("font.ttf", (fontWidth * 2))
    _G.count = 0
    _G.mouseClick = array()
    
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
    lg.print("" .. tostring(cols) .. " " .. tostring(rows) .. " " .. tostring(w) .. " " .. tostring(h) .. " " .. tostring(cw) .. " " .. tostring(ch) .. " " .. tostring(count) .. " " .. tostring(love.timer.getFPS()) .. " ◂", (6 * cw), 0)
    
    return nil
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
    
    
    function setFontWidth(fw) 
        fw = fw or 24
        
        _G.fontWidth = fw
        _G.font = love.graphics.setNewFont("font.ttf", (fontWidth * 2))
        return _G.font
    end
    
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
    _G.mouseCell = array(int((x / _G.screen.cw)), int((y / _G.screen.ch)))
    
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
    _G.mouseCell = array(int((x / _G.screen.cw)), int((y / _G.screen.ch)))
    local event = {x = x, y = y, type = "release", button = button, count = 1, cell = mouseCell}
    return ked:onMouse(event)
end


function love.mousemoved(x, y) 
    local button = ""
    _G.mouseCell = array(int((x / _G.screen.cw)), int((y / _G.screen.ch)))
    local typ = "move"
    if love.mouse.isDown(1) then 
        button = "right"
        typ = "drag"
    end
    
    local event = {x = x, y = y, type = typ, button = button, cell = mouseCell}
    return ked:onMouse(event)
end


function love.wheelmoved(x, y) 
    local dir = ''
    if (y > 0) then dir = 'up'
    elseif (y < 0) then dir = 'down'
    elseif (x < 0) then dir = 'left'
    elseif (x > 0) then dir = 'right'
    end
    
    local event = {x = x, y = y, type = "wheel", cell = mouseCell, dir = dir}
    print("WHEEL", noon(event))
    return ked:onMouse(event)
end

-- love.keyreleased = key scancode ->
-- 
--     log 'keyreleased ' key, " " scancode