--[[
     ███████  ████████   ███████   ████████    ███████  ███   ███  ████████  ████████   ████████  ███  ███      ████████  
    ███       ███       ███   ███  ███   ███  ███       ███   ███  ███       ███   ███  ███       ███  ███      ███       
    ███████   ███████   █████████  ███████    ███       █████████  ███████   ███████    ██████    ███  ███      ███████   
         ███  ███       ███   ███  ███   ███  ███       ███   ███  ███       ███   ███  ███       ███  ███      ███       
    ███████   ████████  ███   ███  ███   ███   ███████  ███   ███  ████████  ███   ███  ███       ███  ███████  ████████  

    clickable file headings used by searcher
--]]

kxk = require "../../../kxk"
theme = require "../../theme"
base = require "../base"


local searcherfile = class("searcherfile", view)
    searcherfile.onMouse = event(method () 
        if hidden().init() then return end
        
        ret = @crumbs.onMouse event
        if ret.redraw then return ret end
        ret = @bubble.onMouse event
        if ret.redraw then return ret end
        
        super event
    end)
    
    searcherfile.onCrumbsAction = action(path, method () 
        print("" .. @name .. " onCrumbsAction " .. action .. " " .. path .. "")
    end)


function searcherfile:init(@screen, @name) 
        discard procCall init(view(self), self.screen, self.name)
        
        self.crumbs = new(crumbs, self.screen, "" .. self.name .. "_crumbs")
        self.bubble = new(bubble, self.screen, "" .. self.name .. "_bubble")
        
        self:setColor('bg', theme.finder.bg)
        self:setColor('frame', theme.finder.frame)
        
        self.crumbs.setColor('empty', self.color.bg)
        self.bubble.setColor('empty', self.color.bg)
        
        self.crumbs.dotlessRelative = true
        self.crumbs.on('action', self.onCrumbsAction)
        return self
    end

--  ███████  ████████  █████████
-- ███       ███          ███   
-- ███████   ███████      ███   
--      ███  ███          ███   
-- ███████   ████████     ███   


function searcherfile:set(file) 
        self.crumbs.set(slash.dir(file))
        
        local name = slash.file(file)
        
        return self.bubble.set(tilde:name, path:file, segls:kseg.segls(('/' + name)))
    end

-- ███       ███████   ███   ███   ███████   ███   ███  █████████
-- ███      ███   ███   ███ ███   ███   ███  ███   ███     ███   
-- ███      █████████    █████    ███   ███  ███   ███     ███   
-- ███      ███   ███     ███     ███   ███  ███   ███     ███   
-- ███████  ███   ███     ███      ███████    ███████      ███   


function searcherfile:layout(x, y, w, h) 
        local cw = #self.crumbs.rounded
        local bw = #self.bubble.rounded
        
        if true then 
            self.crumbs.layout((((x + w) - bw) - cw), y, cw, 1)
            self.bubble.layout(((x + w) - bw), y, bw, 1)
        else 
            self.crumbs.layout(x, y, cw, 1)
            self.bubble.layout((x + cw), y, bw, 1)
        end
        
        return self.cells.layout(x, y, w, 1)
    end

-- ███████    ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███████    █████████  █████████
-- ███   ███  ███   ███  ███   ███  ███   ███
-- ███████    ███   ███  ███   ███  ██     ██


function searcherfile:draw() 
        if self:hidden() then return end
        
        super()
        
        self.crumbs.draw()
        self.bubble.draw()
        
        if true then 
            return self.cells.fill_row(0, 0, (((self.cells.cols - #self.crumbs.rounded) - #self.bubble.rounded) - 1), '─', self.color.frame, self.color.bg)
        else 
            local xs = (#self.crumbs.rounded + #self.bubble.rounded)
            local xe = (self.cells.x + self.cells.cols)
            return self.cells.fill_row(0, xs, xe, '─', self.color.frame, self.color.bg)
        end
    end

-- ██     ██   ███████   ███   ███   ███████  ████████
-- ███   ███  ███   ███  ███   ███  ███       ███     
-- █████████  ███   ███  ███   ███  ███████   ███████ 
-- ███ █ ███  ███   ███  ███   ███       ███  ███     
-- ███   ███   ███████    ███████   ███████   ████████

--  ███████  ████████   ███   ███  ██     ██  ███████     ███████      ███████    ███████  █████████  ███   ███████   ███   ███
-- ███       ███   ███  ███   ███  ███   ███  ███   ███  ███          ███   ███  ███          ███     ███  ███   ███  ████  ███
-- ███       ███████    ███   ███  █████████  ███████    ███████      █████████  ███          ███     ███  ███   ███  ███ █ ███
-- ███       ███   ███  ███   ███  ███ █ ███  ███   ███       ███     ███   ███  ███          ███     ███  ███   ███  ███  ████
--  ███████  ███   ███   ███████   ███   ███  ███████    ███████      ███   ███   ███████     ███     ███   ███████   ███   ███

export searcherfile