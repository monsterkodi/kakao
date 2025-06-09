kxk = require "kxk.kxk"
ked = require "ked"


function love.load() 
    _G.fontWidth = 12
    _G.fontSize = (fontWidth * 2)
    _G.fontStep = (fontWidth + 2)
    _G.font = love.graphics.setNewFont("font.ttf", fontSize)
    _G.count = 0
    --love.window.maximize()
    
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
    love.graphics.print("" .. cols .. " " .. rows .. " " .. w .. " " .. h .. " " .. scale .. " " .. count .. " " .. love.timer.getFPS() .. " ◂", (2 * fontStep), (h - (fontSize * 2)))
    
    ked:draw(cols, rows, ox, oy, fontStep, fontSize)
    
    return nil
end


function love.quit() 
    ked:quit()
    return false
end