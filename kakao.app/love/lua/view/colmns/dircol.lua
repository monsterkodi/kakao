--[[
    ███████    ███  ████████    ███████   ███████   ███      
    ███   ███  ███  ███   ███  ███       ███   ███  ███      
    ███   ███  ███  ███████    ███       ███   ███  ███      
    ███   ███  ███  ███   ███  ███       ███   ███  ███      
    ███████    ███  ███   ███   ███████   ███████   ███████  
--]]

-- use ../../../kxk    ▪ post slash
-- use ../../edit/tool ◆ belt
-- use ../../theme     ◆ color theme
-- use ../base         ◆ view knob crumbs input
-- use ../menu         ◆ context
-- use                 ◆ dirtree

knob = require "view.base.knob"
view = require "view.base.view"
dirtree = require "view.colmns.dirtree"


local dircol = class("dircol", view)
    


function dircol:init(screen, editor, features) 
        self.editor = editor
        
        view.init(self, screen, 'dircol', features)
        
        self.isVisible = false
        self.active = true
        
        self.pointerType = 'pointer'
        
        self.knob = knob(screen, "" .. tostring(self.name) .. "_knob")
        self.crumbs = crumbs(screen, "" .. tostring(self.name) .. "_crumbs")
        self.dirtree = dirtree(screen, "" .. tostring(self.name) .. "_dirtree", array('scroll'))
        
        self.crumbs:on('action', self.onCrumbsAction)
        
        local bg = theme.dirtree.bg
        
        self.dirtree:setColor('bg', bg)
        self.dirtree:setColor('empty', bg)
        self.dirtree:setColor('cursor_main', bg)
        self.dirtree:setColor('cursor_empty', bg)
        
        self.dirtree.scroll:setColor('bg', bg)
        
        self.knob:setColor('bg', bg)
        
        self.crumbs:setColor('empty', theme.gutter.bg)
        
        post:on('dircol.reveal', self.onReveal)
        post:on('dircol.resize', self.onResize)
        post:on('dircol.toggle', self.onToggle)
        post:on('dircol.root', self.setRoot)
        
        post:on('session.merge', self.onSessionMerge)
        
        local root = ked_session:get('dircol▸root', slash.cwd())
        
        self:setRoot(root)
        return self
    end


function dircol:onCrumbsAction(action, path) 
        if (action == 'click') then 
            return self:setRoot(path)
        end
    end


function dircol:onSessionMerge(recent) 
        if empty(recent.dircol) then return end
        
        local args = ked_session.get('ked▸args', {})
        if valid(args.options) then 
            print("dircol.onSessionMerge - use first options dir " .. tostring(slash.dir(args.options[0])) .. "")
            local root = slash.dir(args.options[0])
        else 
            print("dircol.onSessionMerge - use last session dir " .. tostring(recent.dircol.root) .. "")
            local root = recent.dircol.root
        end
        
        if root then 
            self:setRoot(root)
        end
        
        if recent.funcol.active then 
            self.active = true
            self:show()
        end
        
        return ked_session.set('dircol', recent.dircol)
    end


function dircol:setRoot(path) 
        if empty(path) then return end
        
        path = slash.tilde(path)
        self.crumbs:set(path)
        self.dirtree:setRoot(path, {redraw = true})
        
        return ked_session:set('dircol▸root', path)
    end


function dircol:layout(x, y, w, h) 
        self.crumbs:layout(x, y, w, 1)
        self.dirtree:layout(x, (y + 1), w, (h - 1))
        self.knob:layout(((x + w) - 1), (y + 1), 1, (h - 1))
        
        view:layout(self, x, y, w, h)
        return self
    end


function dircol:draw() 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        
        self.cells:fill_rect(0, 1, -1, -1, ' ', null, self.dirtree.color.bg)
        self.cells:fill_rect(0, 0, -1, 0, ' ', null, self.crumbs.color.empty)
        
        self.crumbs:draw()
        self.dirtree:draw()
        self.knob:draw()
        
        return super()
    end

--  ███████   ███████   ███   ███  █████████  ████████  ███   ███  █████████
-- ███       ███   ███  ████  ███     ███     ███        ███ ███      ███   
-- ███       ███   ███  ███ █ ███     ███     ███████     █████       ███   
-- ███       ███   ███  ███  ████     ███     ███        ███ ███      ███   
--  ███████   ███████   ███   ███     ███     ████████  ███   ███     ███   


function dircol:onContext(event) 
        return context:show(event.cell, self.onContextChoice, array(" ", " ", " "))
    end


function dircol:onContextChoice(choice) 
        local current = self.dirtree:current()
        if current then 
            if (choice == '') then 
                    return self:rename()
            elseif (choice == '') then 
                    local dir = current.path
                    if (current.type == 'file') then 
                        dir = slash.dir(dir)
                    end
                    
                    return post:emit('file.new_folder', dir)
            elseif (choice == '') then 
                    return post:emit('file.trash', current.path)
            end
        end
    end


function dircol:onReveal(p) 
        if self.dirtree:itemForPath(p) then return end
        local d = self.dirtree:itemForPath(slash.dir(p))
        if d then 
            if not d.open then 
                return self.dirtree:openDir(d, {redraw = true})
            else 
                return error("dircol.onReveal already open? " .. tostring(d) .. "")
            end
        else 
            local dd = self.dirtree:itemForPath(slash.dir(slash.dir(p)))
            if dd then 
                if not dd.open then 
                    self.dirtree:openDir(dd)
                    return self.dirtree:openDir(d, {redraw = true})
                else 
                    return error("dircol.onReveal already open dd? " .. tostring(d) .. "")
                end
            else 
                return self:setRoot(d)
            end
        end
    end

-- ████████   ████████  ███   ███   ███████   ██     ██  ████████
-- ███   ███  ███       ████  ███  ███   ███  ███   ███  ███     
-- ███████    ███████   ███ █ ███  █████████  █████████  ███████ 
-- ███   ███  ███       ███  ████  ███   ███  ███ █ ███  ███     
-- ███   ███  ████████  ███   ███  ███   ███  ███   ███  ████████


function dircol:rename() 
        local current = self.dirtree:current()
        local ox = (belt.numIndent(current.tilde) + 2)
        local x = (self.dirtree.cells.x + ox)
        local y = (self.dirtree.cells.y + self.dirtree:currentIndex())
        local w = (self.dirtree.cells.cols - ox)
        local fileName = slash.file(current.path)
        
        function cb(res) 
            if self.hover then self.dirtree:grabFocus() end
            if (res ~= fileName) then 
                return post.emit('file.rename', current.path, slash.path(slash.dir(current.path), res))
            end
        end
        
        return post:emit('input.popup', {text = fileName, x = x, y = y, w = w, cb = cb})
    end

-- █████████   ███████    ███████    ███████   ███      ████████
--    ███     ███   ███  ███        ███        ███      ███     
--    ███     ███   ███  ███  ████  ███  ████  ███      ███████ 
--    ███     ███   ███  ███   ███  ███   ███  ███      ███     
--    ███      ███████    ███████    ███████   ███████  ████████


function dircol:onResize() 
    self.knob.doDrag = true
    return self.knob.doDrag
    end

function dircol:onToggle() 
        if not (self:visible() and self:collapsed()) then self:toggle() end
        self.active = self:visible()
        ked_session:set('dircol▸active', self.active)
        local cols = max(16, int((self.cells.screen.cols / 6)))
        return -- post∙emit 'view.size' @name 'right' (@hidden() ? -@cells.cols : cols-@cells.cols )
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function dircol:onMouse(event) 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        
        if view.onMouse(self, event) then return true end
        if self.knob:onMouse(event) then return true end
        if self.crumbs:onMouse(event) then return true end
        if self.dirtree:onMouse(event) then 
    return true
        end
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function dircol:onWheel(event) 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        
        return self.dirtree:onWheel(event)
    end

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function dircol:onKey(key, event) 
        if not self.dirtree:hasFocus() then return end
        
        if (key == 'f2') then return self:rename()
        elseif (key == 'cmd+left') or (key == 'ctrl+left') then return self:setRoot(slash.dir(self.dirtree.currentRoot))
        end
        
        return self.dirtree:onKey(key, event)
    end

return dircol