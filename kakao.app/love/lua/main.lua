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
    lg.print("" .. tostring(cols) .. " " .. tostring(rows) .. " " .. tostring(w) .. " " .. tostring(h) .. " " .. tostring(cw) .. " " .. tostring(ch) .. " " .. tostring(count) .. " " .. tostring(love.timer.getFPS()) .. " ◂", (2 * cw), (h - (ch * 2)))
    
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
                        return string.upper(key)
                    else 
                        return ""
                    end
           end
end)()
    
    local event = {["repeat"] = isrepeat, combo = combo, char = char}
    write("\x1b[0m\x1b[33m", " ", dict.str(event), "\x1b[0m\x1b[34m", scancode)
    ked:onKey(combo, event)
    return true
end


function love.mousepressed(x, y, button, istouch, presses) 
    button = (function () 
    if (button == 1) then 
    return "left" else 
    return "right"
             end
end)()
    local cell = array(int((x / _G.screen.cw)), int((y / _G.screen.ch)))
    local event = {x = x, y = y, type = "press", button = button, count = 1, cell = cell}
    return ked:onMouse(event)
end


function love.mousemoved(x, y) 
    local button = "right"
    local event = {x = x, y = y, type = "move", button = button}
    return ked:onMouse(event)
end

-- love.keyreleased = key scancode ->
-- 
--     log 'keyreleased ' key, " " scancode