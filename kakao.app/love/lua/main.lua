kxk = require "kxk.kxk"
ked = require "ked"


function love.load() 
    _G.fontWidth = 12
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
    
    local scale = love.window.getDPIScale()
    local lg = love.graphics
    
    lg.setColor(0.1, 0.1, 0.1)
    local cw = fontWidth
    local ch = (fontWidth * 2)
    
    local cols = math.floor((w / cw))
    local rows = math.floor((h / ch))
    
    lg.setColor(0.2, 0.2, 0.2)
    lg.print("" .. tostring(cols) .. " " .. tostring(rows) .. " " .. tostring(w) .. " " .. tostring(h) .. " " .. tostring(scale) .. " " .. tostring(count) .. " " .. tostring(love.timer.getFPS()) .. " ◂", (2 * cw), (h - (ch * 2)))
    
    ked:draw(cols, rows, cw, ch)
    
    return nil
end


function love.quit() 
    ked:quit()
    return false
end


function love.keypressed(key, scancode, isrepeat) 
    local mods = ""
    if (key == "escape") then key = "esc"
    elseif (key == "lshift") or (key == "rshift") or (key == "lctrl") or (key == "rctrl") or (key == "lalt") or (key == "ralt") or (key == "lgui") or (key == "rgui") then 
            return
    end
    
    local lk = love.keyboard
    
    if (lk.isDown('lshift') or lk.isDown('rshift')) then mods = mods .. "shift+" end
    if (lk.isDown('lctrl') or lk.isDown('rctrl')) then mods = mods .. "ctrl+" end
    if (lk.isDown('lalt') or lk.isDown('ralt')) then mods = mods .. "alt+" end
    if (lk.isDown('lgui') or lk.isDown('rgui')) then mods = mods .. "cmd+" end
    -- log 'keypressed ' mods, key
    local combo = mods .. key
    local char = (function () 
    if (key == "return") then 
    return "\n"
           elseif (key == "space") then 
    return " "
           else 
    return ""
           end
end)()
    
    local event = {["repeat"] = isrepeat, combo = combo, char = char}
    ked:onKey(combo, event)
    return true
end

-- love.keyreleased = key scancode ->
-- 
--     log 'keyreleased ' key, " " scancode