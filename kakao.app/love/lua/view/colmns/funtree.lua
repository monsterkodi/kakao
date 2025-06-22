--    ████████  ███   ███  ███   ███  █████████  ████████   ████████  ████████  
--    ███       ███   ███  ████  ███     ███     ███   ███  ███       ███       
--    ██████    ███   ███  ███ █ ███     ███     ███████    ███████   ███████   
--    ███       ███   ███  ███  ████     ███     ███   ███  ███       ███       
--    ███        ███████   ███   ███     ███     ███   ███  ████████  ████████  

-- use ../../../kxk    ▪ post slash
-- use ../../../kxk    ◆ nfs
-- use ../../theme     ◆ color theme icons
-- use ../../edit/tool ◆ belt
-- use ../menu         ◆ choices 

--[[
     ███████  ███   ███  ███   ███  █████████   ███████   ███   ███
    ███        ███ ███   ████  ███     ███     ███   ███   ███ ███ 
    ███████     █████    ███ █ ███     ███     █████████    █████  
         ███     ███     ███  ████     ███     ███   ███   ███ ███ 
    ███████      ███     ███   ███     ███     ███   ███  ███   ███
--]]

local SYMBOL = {
    clss = '■', -- '■' , 
    unbound = '->', -- '▸', 
    bound = '->', -- '▸', 
    async_unbound = '○→', -- '○', 
    async_bound = '●→', -- '●' 
    }


local funSyntax = class("funSyntax")
    


function funSyntax:init(tree) 
        self.tree = tree
        
        self.color = {
            class = theme.funtree.class, 
            async = theme.funtree.async, 
            bound = theme.funtree.bound, 
            bound_async = theme.funtree.bound_async, 
            func = theme.funtree.func, 
            func_async = theme.funtree.func_async, 
            test0 = theme.funtree.test0, 
            test1 = theme.funtree.test1, 
            test2 = theme.funtree.test2, 
            test3 = theme.funtree.test3
            }
        return self
    end


function funSyntax:clear() 
    
    end


function funSyntax:setLines(lines) 
    return print('setLines')
    end

function funSyntax:setSegls(segls) 
    
    end

--  ███████   ███████   ███       ███████   ████████ 
-- ███       ███   ███  ███      ███   ███  ███   ███
-- ███       ███   ███  ███      ███   ███  ███████  
-- ███       ███   ███  ███      ███   ███  ███   ███
--  ███████   ███████   ███████   ███████   ███   ███


function funSyntax:getClass(x, y) 
    return ''
    end

function funSyntax:getColor(x, y) 
        local item = self.tree.items[y]
        local name = item.name
        local char = name[x]
        if (char == ' ') then return array(0, 0, 0) end
        
        if item.clss then clr = self.color.class
        elseif item.test then clr = self.color[('test' + int((belt.numIndent(item.name) / 2)))]
        elseif item.async then clr = ((item.bound and self.color.bound_async) or self.color.func_async)
        elseif item.bound then clr = self.color.bound
        else clr = self.color.func
        end
        
        if item.static then clr = color.brighten(clr, 0.2)
        elseif ((char == '@') and empty(name[(x + 1)])) then 
                              local clr = self.color.class
        end
        
        if (char == '▸') then clr = color.darken(clr, 0.5)
        elseif (char == '@') then clr = color.darken(clr((((clr == self.color.class) and 0.75) or 0.5)))
        elseif (char == SYMBOL.clss) then clr = color.darken(clr, 0.2)
        end
        
        return clr
    end


function funSyntax:getChar(x, y, char) 
    return char
    end

--[[    
    ████████  ███   ███  ███   ███  █████████  ████████   ████████  ████████
    ███       ███   ███  ████  ███     ███     ███   ███  ███       ███     
    ██████    ███   ███  ███ █ ███     ███     ███████    ███████   ███████ 
    ███       ███   ███  ███  ████     ███     ███   ███  ███       ███     
    ███        ███████   ███   ███     ███     ███   ███  ████████  ████████
--]]


local funtree = class("funtree", choices)
    


function funtree:init(editor, name, features) 
        self.editor = editor
        
        choices.init(self, name, features)
        
        self.state.syntax = funSyntax(self)
        
        self.editor.state:on('cursorsSet', self.onCursorsSet, self)
        
        post:on('file.loaded', self.clear, self)
        post:on('file.indexed', self.onFileIndexed, self)
        return self
    end


function funtree:onCursorsSet() 
        return self:selectItemForLineIndex(self.editor.state:mainCursor()[1])
    end


function funtree:selectItemForLineIndex(li) 
        for idx, item in ipairs(self.items) do 
            if (((item.line - 1) <= li) and ((idx >= (#self.items - 1)) or ((self.items[(idx + 1)].line - 1) > li))) then 
                self.state:setSelections(array(belt.rangeOfLine(self.state.s.lines, idx)))
                self.state:setMainCursor(1, idx)
                return
            end
        end
    end


function funtree:nameOfCurrentFunc() 
    return self:current().name
    end

function funtree:lineIndexOfCurrentFunc() 
    return (self:current().line - 1)
    end

function funtree:lineIndexOfNextFunc() 
    return (self.items[(self:currentIndex() + 1)].line - 1)
    end

function funtree:lineIndexOfPrevFunc() 
    return (self.items[(self:currentIndex() - 1)].line - 1)
    end

-- ███      ███  ███   ███  ████████        ████████   ███████   ████████         ████████  ███   ███  ███   ███   ███████
-- ███      ███  ████  ███  ███             ███       ███   ███  ███   ███        ███       ███   ███  ████  ███  ███     
-- ███      ███  ███ █ ███  ███████         ██████    ███   ███  ███████          ██████    ███   ███  ███ █ ███  ███     
-- ███      ███  ███  ████  ███             ███       ███   ███  ███   ███        ███       ███   ███  ███  ████  ███     
-- ███████  ███  ███   ███  ████████        ███        ███████   ███   ███        ███        ███████   ███   ███   ███████


function funtree:lineIndexForFunc(func) 
        for _, item in ipairs(self.items) do 
            if ((item.name == func.name) and (item.class == func.class)) then 
                return (item.line - 1)
            end
        end
        
        local funcname = "   -> " .. tostring(func.class) .. ""
        if ((func.name == funcname) and func.line) then 
            return self:lineIndexForFunc({class = func.class, name = '   -> @'})
        end
        
        if ((func.name == "   -> @") and func.line) then 
            return self:lineIndexForFunc({class = func.class, name = funcname})
        end
        
        -- log "can't find func: items:" @items
        return print("can't find func:", function () end)
    end

--  ███████   ███   ███        ███  ███   ███  ███████    ████████  ███   ███
-- ███   ███  ████  ███        ███  ████  ███  ███   ███  ███        ███ ███ 
-- ███   ███  ███ █ ███        ███  ███ █ ███  ███   ███  ███████     █████  
-- ███   ███  ███  ████        ███  ███  ████  ███   ███  ███        ███ ███ 
--  ███████   ███   ███        ███  ███   ███  ███████    ████████  ███   ███


function funtree:onFileIndexed(path, info) 
        if (path ~= self.editor.currentFile) then return end
        if empty((info.classes and empty), info.funcs) then return end
        
        local clssl = clone(info.classes)
        local funcs = clone(info.funcs)
        
        for _, clss in ipairs(clssl) do 
            clss.file = clss.file or path
            clss.name = ' ' .. SYMBOL.clss .. (' ' + clss.name)
        end
        
        for _, func in ipairs(funcs) do 
            if func.test then 
                func.name = ' ' .. belt.reindent(4, 2, func.name)
            else 
                if func.async then 
                    if func.bound then 
                        local symbol = SYMBOL.async_bound
                    else 
                        local symbol = SYMBOL.async_unbound
                    end
                else 
                    if func.bound then 
                        local symbol = SYMBOL.bound
                    else 
                        local symbol = SYMBOL.unbound
                    end
                end
                
                local name = func.name
                if func.static then 
                    name = ('@' + name)
                end
                
                local indt = (function () 
    if func.class then 
    return '   ' else 
    return ' '
                       end
end)()
                func.name = indt .. symbol .. ' ' .. name
            end
        end
        
        local items = (clssl + funcs)
        items:sort(function (a, b) 
    return (a.line - b.line)
end)
        
        self:set(items, 'name')
        post:emit('funtree.loaded')
        self:onCursorsSet()
        return post:emit('redraw')
    end

--  0000000    0000000  000000000  000   0000000   000   000  
-- 000   000  000          000     000  000   000  0000  000  
-- 000000000  000          000     000  000   000  000 0 000  
-- 000   000  000          000     000  000   000  000  0000  
-- 000   000   0000000     000     000   0000000   000   000  


function funtree:emitAction(action, choice, event) 
        if empty(choice) then 
            error('funtree.emitAction -- empty choice ▸ action:', action)
            error('funtree.emitAction -- empty choice ▸ event:', event)
            return
        end
        
        if (action == 'right') then 
                post:emit('goto.line', (choice.line - 1), 'ind', 'topDelta')
                return
        elseif (action == 'click') or (action == 'return') then 
                post:emit('goto.line', (choice.line - 1), 'ind', 'topDelta')
                post:emit('focus', 'editor')
                return
        elseif (action == 'drag') then 
                post:emit('goto.line', (choice.line - 1), 'ind', 'topDelta')
                return
        end
        
        return choices.emitAction(self, action, choice, event)
    end

return funtree