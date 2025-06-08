--[[
    ███   ███  ████████  ███      ████████ 
    ███   ███  ███       ███      ███   ███
    █████████  ███████   ███      ████████ 
    ███   ███  ███       ███      ███      
    ███   ███  ████████  ███████  ███      
--]]

-- use ../theme     ◆ color
-- use ../edit/tool ◆ belt


local help = class("help")
    


function help.static.header() 
    return (('\n' + color.linesForCells(help.headerCells()).join('\n')) + '\n')
    end


function help.static.headerCells(f) 
        f = f or 1
        
        local h = [[
    


    ╭───╮                ╭───╮                ╭───╮     
    │○○○│                │○○○│                │○○○│     
    │○○○│                ╰───╯                │○○○│     
    │○○○│     ╭───╮    ╭───────╮       ╭──────╯○○○│     
    │○○○│   ╭─╯○○○│  ╭─╯○○○○○○○╰─╮   ╭─╯○○○○○○○○○○│     
    │○○○│ ╭─╯○○╭──╯ ╭╯○○╭─────╮○○╰╮ ╭╯○○╭─────╮○○○│     
    │○○○╰─╯○○╭─╯    │○○○│     │○○○│ │○○○│     │○○○│     
    │○○○○○○○○│      │○○○╰─────╯○○○│ │○○○│     │○○○│     
    │○○○╭─╮○○╰─╮    │○○○╭─────────╯ │○○○│     │○○○│     
    │○○○│ ╰─╮○○╰─╮  │○○○│     ╭───╮ │○○○│     │○○○│     
    │○○○│   ╰─╮○○╰╮ ╰╮○○╰─────╯○○╭╯ ╰╮○○╰─────╯○○╭╯     
    │○○○│     │○○○│  ╰─╮○○○○○○○╭─╯   ╰─╮○○○○○○○╭─╯      
    ╰───╯     ╰───╯    ╰───────╯       ╰───────╯        
    
    
    
    ]]
        
        -- cells = belt.cellsForLines belt.indentLines(belt.seglsForText(h) 5)
        
        -- profileStart "headerCells"
        
        local cells = belt.cellsForLines(belt.seglsForText(h))
        
        local color1 = array(0, 255, 0)
        local color2 = array(120, 120, 255)
        local color3 = array(255, 160, 0)
        
        local fc1 = color1:map(function (v) 
    return math.floor((v * f))
end)
        local fc2 = color2:map(function (v) 
    return math.floor((v * f))
end)
        local fc3 = color3:map(function (v) 
    return math.floor((v * f))
end)
        
        local kcells = belt.cellsInRect(cells, 1, 1, 20, #cells)
        for _, c in ipairs(kcells) do 
            if (c.cell.char == ' ') then c.cell.fg = array(0, 0, 0)
            else c.cell.fg = fc1
            end
        end
        
        local ecells = belt.cellsInRect(cells, 20, 1, 35, #cells)
        for _, c in ipairs(ecells) do 
            if (c.cell.char == ' ') then c.cell.fg = array(0, 0, 0)
            else c.cell.fg = fc2
            end
        end
        
        local dcells = belt.cellsInRect(cells, 36, 1, #cells[1], #cells)
        for _, c in ipairs(dcells) do 
            if (c.cell.char == ' ') then c.cell.fg = array(0, 0, 0)
            else c.cell.fg = fc3
            end
        end
        
        -- profileStart "glow"
        color.glowEffect(cells)
        -- profileStop "glow"
        color.dimCellsColor(belt.cellsWithChar(cells, '○'), 'fg', 0.26)
        color.variateCellsColor(belt.cellsWithChar(cells, '○'), 'fg', 0.15)
        
        fc1 = color1:map(function (v) 
    return math.floor((v * (0.5 + (0.5 * f))))
end)
        fc2 = color2:map(function (v) 
    return math.floor((v * (0.5 + (0.5 * f))))
end)
        fc3 = color3:map(function (v) 
    return math.floor((v * (0.5 + (0.5 * f))))
end)
        
        for _, c in ipairs(kcells) do 
            if ((c.cell.char ~= ' ') and (c.cell.char ~= '○')) then 
                c.cell.fg = fc1
            end
        end
        
        for _, c in ipairs(ecells) do 
            if ((c.cell.char ~= ' ') and (c.cell.char ~= '○')) then 
                c.cell.fg = fc2
            end
        end
        
        for _, c in ipairs(dcells) do 
            if ((c.cell.char ~= ' ') and (c.cell.char ~= '○')) then 
                c.cell.fg = fc3
            end
        end
        
        -- profileStop "headerCells"            
        return cells
    end

--[[
╭─┬─┬─╮ ╭─╮╭─╮╭─╮   ╭ ╮
│k│ė│d│ │k││ė││d│ ─  │ 
╰─┴─┴─╯ ╰─╯╰─╯╰─╯   ╰ ╯

            ╭───╮                 ╭───╮                 ╭───╮
            │   │                 │   │                 │   │
            │   │                 ╰───╯                 │   │
            │   │     ╭───╮     ╭───────╮        ╭──────╯   │
            │   │   ╭─╯   │   ╭─╯       ╰─╮    ╭─╯          │
            │   │ ╭─╯  ╭──╯  ╭╯  ╭─────╮  ╰╮  ╭╯  ╭─────╮   │
            │   ╰─╯  ╭─╯     │   │     │   │  │   │     │   │
            │        │       │   ╰─────╯   │  │   │     │   │
            │   ╭─╮  ╰─╮     │   ╭─────────╯  │   │     │   │
            │   │ ╰─╮  ╰─╮   │   │     ╭───╮  │   │     │   │
            │   │   ╰─╮  ╰╮  ╰╮  ╰─────╯  ╭╯  ╰╮  ╰─────╯  ╭╯
            │   │     │   │   ╰─╮       ╭─╯    ╰─╮       ╭─╯
            ╰───╯     ╰───╯     ╰───────╯        ╰───────╯  

            ████                  ████                  ████
            ████                  ████                  ████
            ████                                        ████
            ████      ████      ████████         ███████████
            ████    ██████    ████████████     █████████████
            ████  █████      ████      ████   ████      ████
            █████████        ████      ████   ████      ████
            █████████        ██████████████   ████      ████
            ████  █████      ████             ████      ████
            ████    █████    ████      ████   ████      ████
            ████      ████    ████████████     ████████████ 
            ████      ████      ████████         ████████   
                
    kėd
--]]

return help