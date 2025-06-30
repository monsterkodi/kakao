--[[
000000000  000   000  00000000  00     00  00000000  
   000     000   000  000       000   000  000       
   000     000000000  0000000   000000000  0000000   
   000     000   000  000       000 0 000  000       
   000     000   000  00000000  000   000  00000000  
--]]

color = require "theme.color"

local theme = {
hover = {
    bg = "#44a", 
    blur = "#222"
    }, 
editor = {
    bg = "#000", 
    empty = "#000", 
    mapscr = "#060606"
    }, 
cursor = {
    multi = "#f00", 
    blur = "#666", 
    main = "#ff0", 
    fg = "#000"
    }, 
selection = {
    line = "#222", 
    span = "#44a", 
    map = "#66a", 
    mapfully = "#444"
    }, 
highlight = {
    bg = "#030", 
    map = "#060", 
    ul = "#0a0", 
    bracket = "#339", 
    bracket_ul = "#44a", 
    string = "#040", 
    string_ul = "#050"
    }, 
dirtree = {
    bg = "#111"
    }, 
funtree = {
    bg = "#0a0a0a", 
    class = "#ff6", 
    func = "#aaf", 
    func_async = "#66f", 
    bound = "#f88", 
    bound_async = "#c44", 
    test0 = "#0f0", 
    test1 = "#0a0", 
    test2 = "#080", 
    test3 = "#060"
    }, 
knob = {
    fg = "#222", 
    bg = "#111"
    }, 
gutter = {
    fg = "#1a1a1a", 
    bg = "#0a0a0a", 
    bg_fully_selected = "#161616", 
    bg_selected = "#228", 
    bg_git_mod = "#030", 
    bg_git_add = "#001a00", 
    bg_git_del = "#400"
    }, 
status = {
    bg = "#222", 
    col = "#111", 
    col_zero = "#000", 
    col_empty = "#770", 
    empty = "#151515", 
    dark = "#1a1a1a", 
    fg = "#888", 
    filepos = "#666", 
    dirty = "#fa0", 
    redo = "#0d0", 
    cur = "#f00", 
    sel = "#88f", 
    hil = "#0a0"
    }, 
scroll = {
    knob = "#1a1a1a", 
    hover = "#44a", 
    dot = "#88f"
    }, 
finder = {
    bg = "#111", 
    frame = "#222"
    }, 
quicky = {
    bg = "#111", 
    frame = "#000"
    }, 
droop = {
    bg = "#222"
    }, 
crumbs = {
    fg = "#88f", 
    bg = "#222"
    }, 
context = {
    fg = "#88f", 
    bg = "#222"
    }, 
complete = {
    bg = "#006", 
    scroll = "#22a", 
    selection = "#44f"
    }, 
syntax = {
    text = "#fff", 
    ["text file"] = "#eee", 
    punct = "#555", 
    template = "#555", 
    file = "#aaa", 
    ext = "#444", 
    dir_leaf = "#aaf", 
    ["text dir"] = "#88f", 
    dir = "#66d", 
    ["punct dir"] = "#55a", 
    dir_punct = "#226", 
    file_log = "#bbf", 
    file_txt = "#aaf", 
    file_text = "#aaf", 
    file_styl = "#f08", 
    file_mov = "#b05", 
    file_css = "#a04", 
    file_pug = "#a5a", 
    file_html = "#838", 
    file_md = "#f4f", 
    file_py = "#e0e", 
    file_json = "#d0d", 
    file_plist = "#c0c", 
    file_cast = "#b0b", 
    file_js = "#a0a", 
    file_toml = "#909", 
    file_kode = "#dc0", 
    file_noon = "#f3a", 
    file_cpp = "#cbb", 
    file_nim = "#cbb", 
    file_lua = "#baa", 
    file_kim = "#0e0", 
    file_kua = "#0e0", 
    file_mm = "#0d0", 
    file_h = "#090", 
    file_png = "#0a0", 
    file_gif = "#070", 
    file_jpg = "#060", 
    file_icns = "#060", 
    file_jpeg = "#060", 
    file_bmp = "#050", 
    file_tiff = "#040", 
    file_image = "#030"
    }
}

for key, val in pairs(theme) do 
    if is(val, "string") then 
        theme[key] = color.values(val)
    else 
        for k, v in pairs(val) do 
            if is(v, "string") then 
                val[k] = color.values(v)
            end
        end
    end
end

-- for key value in pairs theme.syntax
--     if kstr.startsWith key 'file_'
--         ext = string.sub key 6
--         theme.syntax['file_ext_'+ext]   = color.darken value 0.4
--         theme.syntax['file_icon_'+ext]  = color.darken value 0.6
--         theme.syntax['file_punct_'+ext] = color.darken value 0.3

-- ███   ███  ███  ███████    ████████    ███████   ███   ███  █████████
-- ███   ███  ███  ███   ███  ███   ███  ███   ███  ████  ███     ███   
--  ███ ███   ███  ███████    ███████    █████████  ███ █ ███     ███   
--    ███     ███  ███   ███  ███   ███  ███   ███  ███  ████     ███   
--     █      ███  ███████    ███   ███  ███   ███  ███   ███     ███   

-- full_vibrant = clone theme
local full_vibrant = theme


function setVibrant(vf, lf) 
    lf = lf or 1.0
    
    vf = clamp(0, 1, vf)
    for key, val in ipairs(full_vibrant) do 
        if is(val, array) then 
            local c = color.saturate(val, vf, lf)
            theme[key][0] = c[0]
            theme[key][1] = c[1]
            theme[key][2] = c[2]
        else 
            for k, v in pairs(val) do 
                local c = color.saturate(v, vf, lf)
                theme[key][k][0] = c[0]
                theme[key][k][1] = c[1]
                theme[key][k][2] = c[2]
            end
        end
    end
end

-- post.on 'theme.vibrant' setVibrant

return theme