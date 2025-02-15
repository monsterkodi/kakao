var key, value

import color from "./util/color.js"

class theme
{
    static selection_line = '#222'

    static selection = '#22a'

    static highlight = '#222'

    static cursor = '#ff0'

    static linenr = '#1a1a1a'

    static gutter_fully_selected = '#161616'

    static gutter_selected = '#118'

    static gutter = '#0a0a0a'

    static column = '#222'

    static column_fg = '#000'

    static status = '#222'

    static status_dark = '#1a1a1a'

    static scroll = '#1a1a1a'

    static scroll_dot = '#222'

    static scroll_knob = '#44f'

    static scroll_doth = '#88f'

    static status_fg = '#888'

    static status_dirty = '#fa0'

    static status_redo = '#0d0'

    static status_empty = '#f84'

    static status_sel = '#88f'

    static status_hil = '#888'

    static status_cur = '#f00'

    static file = '#ff0'

    static dir = '#88f'

    static status_fg_dim = '#333'

    static quicky = '#333'

    static quicky_input = '#338'

    static quicky_frame_fg = '#222'

    static quicky_frame_bg = '#000'

    static editor = '#000'

    static editor_empty = '#000'

    static editor_cursor_main = '#101010'

    static editor_cursor_empty = '#000'

    static editor_cursor_multi = '#f00'

    static editor_cursor_blur = '#666'

    static editor_cursor_bg = '#ff0'

    static editor_cursor_fg = '#000'

    static konsole = '#000'

    static konsole_empty = '#000'

    static konsole_cursor_main = '#101010'

    static konsole_cursor_empty = '#000'

    static konsole_cursor_blur = '#666'

    static konsole_cursor_bg = '#ff0'

    static konsole_cursor_fg = '#000'

    static text = '#fff'

    static syntax = {'text':'#fff','punct':'#555','template':'#555','define':'#555','text require':'#555','comment triple':'#555','text unicode':'#555','keyword require':'#444','comment':'#444','comment triple ligature':'#444','punct require':'#3a3a3a','punct template':'#3a3a3a','comment ligature':'#333','punct minor':'#333','punct define':'#333','punct comment triple':'#222','punct comment':'#222','section':'#ccf','keyword':'#99f','number':'#88f','punct compare':'#77f','punct compare ligature':'#66f','punct ligature':'#55f','punct function tail ligature':'#55e','keyword type':'#55d','punct keyword return':'#44c','punct keyword':'#33b','punct range ligature':'#22a','nil':'#f04','punct function bound tail ligature':'#f88','text this':'#fa6','punct obj':'#aa4','punct this':'#884','punct method class':'#663','method class':'#ff8','dictionary key':'#ff7','method':'#ff6','class':'#ff4','property':'#ff2','function call':'#fe0','obj':'#fc0','module':'#fc0','function':'#fa0','punct method':'#a60','punct function':'#840','punct property':'#640','punct string double triple':'#0d0','comment triple header':'#0c0','module require string':'#0c0','string double triple':'#0c0','string double':'#0b0','string single':'#0a0','punct dictionary':'#090','function argument':'#080','require':'#080','text require string':'#070','comment header':'#060','module require':'#050','punct string interpolation start':'#050','punct string interpolation end':'#050','punct string double':'#040','punct string single':'#030','text unicode li1':'#aaa','text unicode li2':'#888','text unicode li3':'#666','text li1':'#99f','text li2':'#66a','punct li1 marker':'#66a','text li3':'#447','punct li1':'#448','punct li2 marker':'#448','punct li2':'#336','punct li3 marker':'#336','punct li3':'#224','text dir':'#aaf','punct dir':'#55a','js file':'#0a0','js ext':'#060','noon file':'#0a0','noon ext':'#060','punct js':'#040','json file':'#d0d','json ext':'#808','punct json':'#505','kode file':'#fa0','kode ext':'#d80','punct kode':'#b60','text file':'#ddd','text ext':'#888','punct text':'#444','file':'#aaa','ext':'#444','dir_leaf':'#aaf','dir':'#66f','dir_punct':'#226','.text':'#aaf','.kode':'#ff0','.js':'#0a0','.noon':'#0a0','.json':'#d0d','.md':'#f4f'}
}

for (key in theme.syntax)
{
    value = theme.syntax[key]
    if (key[0] === '.')
    {
        theme.syntax[key + '_ext'] = color.darken(value,0.2)
    }
}
export default theme;