--[[
     ███████   ███████  ████████   ████████  ████████  ███   ███
    ███       ███       ███   ███  ███       ███       ████  ███
    ███████   ███       ███████    ███████   ███████   ███ █ ███
         ███  ███       ███   ███  ███       ███       ███  ████
    ███████    ███████  ███   ███  ████████  ████████  ███   ███
--]]


local screen = class("screen")
    


function screen:init(cols, rows, cw, ch) 
        self.rows = rows
        self.cols = cols
        self.cw = cw
        self.ch = ch
        self.areas = array()
        return self
    end


function screen:__tostring() 
    return "[screen sw " .. tostring(self.sw) .. " sh " .. tostring(self.sh) .. " cols " .. tostring(self.cols) .. " rows " .. tostring(self.rows) .. " cw " .. tostring(self.cw) .. " ch " .. tostring(self.ch) .. "]"
    end


function screen:layout(node) 
        local children = array()
        if node.hbox then 
            print("HBOX")
            node.width = 0
            node.height = 0
            node.dir = "horz"
            children = node.hbox
        elseif node.vbox then 
            print("VBOX")
            node.width = 0
            node.height = 0
            node.dir = "vert"
            children = node.vbox
        elseif node.view then 
            print("VIEW", node.view.name)
            if (type(node.w) == "number") then 
                node.width = node.w
                if (node.parent.dir == "horz") then 
                    node.parent.width = node.parent.width + (node.w)
                else 
                    node.parent.width = max(node.parent.width, node.w)
                end
            end
            
            if (type(node.h) == "number") then 
                node.height = node.h
                if (node.parent.dir == "vert") then 
                    node.parent.height = node.parent.height + (node.h)
                else 
                    node.parent.height = max(node.parent.height, node.h)
                end
            end
        end
        
        for _, child in ipairs(children) do 
            child.parent = node
            self:layout(child)
        end
        
        return print(node.width, node.height)
    end


function screen:area(w, h, dir, pad, gap) 
        return self.areas:push({w = w, h = h, dir = dir, pad = pad, gap = gap})
    end

return screen