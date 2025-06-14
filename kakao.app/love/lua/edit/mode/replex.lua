-- ████████   ████████  ████████   ███      ████████  ███   ███
-- ███   ███  ███       ███   ███  ███      ███        ███ ███ 
-- ███████    ███████   ████████   ███      ███████     █████  
-- ███   ███  ███       ███        ███      ███        ███ ███ 
-- ███   ███  ████████  ███        ███████  ████████  ███   ███


local replex = class("replex")
    replex.static.autoStart = true


function replex:init(state) 
        self.state = state
        self.name = 'replex'
        return self
    end

-- ███  ███   ███   ███████  ████████  ████████   █████████
-- ███  ████  ███  ███       ███       ███   ███     ███   
-- ███  ███ █ ███  ███████   ███████   ███████       ███   
-- ███  ███  ████       ███  ███       ███   ███     ███   
-- ███  ███   ███  ███████   ████████  ███   ███     ███   


function replex:postInsert() 
        local chunks = self.state:chunksBeforeCursors()
        local repls = array()
        
        for _, chunk in ipairs(chunks) do 
            if is(chunk, array) then 
                local ende = chunk:slice(-2, -1)
                local repl = specs.replex[ende]
                if repl then 
                    repls:push(repl)
                end
            end
        end
        
        if (#repls == #self.state.s.cursors) then 
            self.state:delete('back')
            self.state:delete('back')
            return self.state:insert(repls:join('\n'))
        end
    end

return replex