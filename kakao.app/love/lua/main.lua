kxk = require "kxk.kxk"
ked = require "ked"


function love.load() 
    _G.fontWidth = 12
    _G.fontSize = (fontWidth * 2)
    _G.fontStep = (fontWidth + 2)
    _G.font = love.graphics.setNewFont("font.ttf", fontSize)
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
    
    love.graphics.setColor(0.1, 0.1, 0.1)
    
    local ox = math.ceil(((w - (math.floor((w / fontStep)) * fontStep)) / 2))
    local oy = math.floor(((h - (math.floor((h / fontSize)) * fontSize)) / 4))
    
    local cols = math.floor((w / fontStep))
    local rows = math.floor((h / fontSize))
    
    love.graphics.setColor(0.2, 0.2, 0.2)
    love.graphics.print("" .. tostring(cols) .. " " .. tostring(rows) .. " " .. tostring(w) .. " " .. tostring(h) .. " " .. tostring(scale) .. " " .. tostring(count) .. " " .. tostring(love.timer.getFPS()) .. " ◂", (2 * fontStep), (h - (fontSize * 2)))
    
    ked:draw(cols, rows, ox, oy, fontStep, fontSize)
    
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
    
    if (love.keyboard.isDown('lshift') or love.keyboard.isDown('rshift')) then 
        mods = mods .. "shift+"
    end
    
    if (love.keyboard.isDown('lctrl') or love.keyboard.isDown('rctrl')) then 
        mods = mods .. "ctrl+"
    end
    
    if (love.keyboard.isDown('lalt') or love.keyboard.isDown('ralt')) then 
        mods = mods .. "alt+"
    end
    
    if (love.keyboard.isDown('lgui') or love.keyboard.isDown('rgui')) then 
        mods = mods .. "cmd+"
    end
    
    -- log 'keypressed ' mods, key
    local combo = mods .. key
    local char = ""
    if (key == "return") then char = "\n"
    elseif (key == "space") then char = " "
    end
    
    local event = {["repeat"] = isrepeat, combo = combo, char = char}
    ked:onKey(combo, event)
    return true
end

-- love.keyreleased = key scancode ->
-- 
--     log 'keyreleased ' key, " " scancode