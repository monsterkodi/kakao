var ext, key, value

import color from "./color.js"

class theme
{
    static editor = '#000'

    static editor_empty = '#000'

    static editor_cursor_main = '#101010'

    static editor_cursor_empty = '#000'

    static editor_cursor_multi = '#f00'

    static editor_cursor_blur = '#666'

    static editor_cursor_bg = '#ff0'

    static editor_cursor_fg = '#000'

    static editor_selection_line = '#222'

    static editor_selection = '#22a'

    static editor_highlight = '#222'

    static linenr = '#1a1a1a'

    static gutter_fully_selected = '#161616'

    static gutter_selected = '#118'

    static gutter = '#0a0a0a'

    static column = '#222'

    static column_fg = '#000'

    static status = '#222'

    static status_col = '#111'

    static status_dark = '#1a1a1a'

    static status_fg = '#888'

    static status_fg_dim = '#333'

    static status_dirty = '#fa0'

    static status_redo = '#0d0'

    static status_empty = '#f84'

    static status_sel = '#88f'

    static status_hil = '#888'

    static status_cur = '#f00'

    static scroll = '#1a1a1a'

    static scroll_empty = '#000'

    static scroll_dot = '#222'

    static scroll_knob = '#44f'

    static scroll_doth = '#88f'

    static file = '#ff0'

    static dir = '#88f'

    static quicky = '#333'

    static quicky_input = '#338'

    static quicky_frame_fg = '#222'

    static quicky_frame_bg = '#000'

    static quicky_crumbs = '#222'

    static quicky_crumbs_empty = '#222'

    static quicky_crumbs_cursor_main = '#222'

    static quicky_crumbs_cursor_empty = '#222'

    static editor_complete_choices = '#006'

    static editor_complete_choices_empty = '#006'

    static editor_complete_choices_selection_line = '#44f'

    static editor_complete_choices_cursor_blur = '#88f'

    static text = '#fff'

    static syntax = {'text':'#fff','punct':'#555','template':'#555','define':'#555','text require':'#555','comment triple':'#555','text unicode':'#555','keyword require':'#444','comment':'#444','comment triple ligature':'#444','punct require':'#3a3a3a','punct template':'#3a3a3a','comment ligature':'#333','punct minor':'#333','punct define':'#333','punct comment triple':'#222','punct comment':'#222','section':'#ccf','keyword':'#99f','number':'#88f','punct compare':'#77f','punct function':'#55e','punct function bound':'#c48','keyword type':'#55d','punct keyword return':'#44c','punct keyword':'#33b','punct range':'#22a','nil':'#f04','text this':'#f88','property':'#fa8','punct obj':'#aa4','punct method class':'#663','punct this':'#744','method class':'#ff8','obj':'#ff8','dictionary key':'#ff7','method':'#ff6','class':'#ff4','module':'#fc0','function':'#fa0','function call':'#f80','punct method':'#a60','punct function':'#840','punct property':'#640','punct string double triple':'#0d0','module require string':'#0c0','string double triple':'#0c0','string double':'#0b0','string single':'#0a0','punct dictionary':'#090','function argument':'#080','require':'#080','text require string':'#070','comment triple header':'#060','module require':'#050','punct string interpolation start':'#050','punct string interpolation end':'#050','comment header':'#040','punct string double':'#040','punct string single':'#030','text h1':'#0f0','text h2':'#0a0','text h3':'#080','text h4':'#aaf','text h5':'#88f','punct h1':'#050','punct h2':'#040','punct h3':'#030','punct h4':'#336','punct h5':'#224','text bold':'#ff8','text unicode li1':'#aaa','text unicode li2':'#888','text unicode li3':'#666','text li1':'#99f','text li2':'#66a','text li3':'#447','text li4':'#336','text li5':'#225','punct li1':'#448','punct li2':'#336','punct li3':'#224','punct li4':'#113','punct li5':'#113','punct minor li1':'#448','punct minor li2':'#336','punct minor li3':'#224','punct minor li4':'#113','punct minor li5':'#113','punct li1 marker':'#66a','punct li2 marker':'#448','punct li3 marker':'#337','punct li4 marker':'#226','punct li5 marker':'#114','file':'#aaa','ext':'#444','dir_leaf':'#aaf','text dir':'#88f','dir':'#66d','punct dir':'#55a','dir_punct':'#226','.text':'#aaf','.md':'#f4f','.json':'#d0d','.cast':'#b0b','.js':'#a0a','.toml':'#909','.kode':'#ff0','.noon':'#0a0','.png':'#080','.gif':'#070','.jpg':'#060','.jpeg':'#060','.bmp':'#050','.tiff':'#040','.image':'#030'}
}

for (key in theme.syntax)
{
    value = theme.syntax[key]
    if (key[0] === '.')
    {
        theme.syntax[key + '_ext'] = color.darken(value,0.2)
        ext = key.slice(1)
        theme.syntax[ext + ' file'] = value
        theme.syntax[ext + ' ext'] = color.darken(value,0.6)
        theme.syntax['punct ' + ext] = color.darken(value,0.3)
    }
}
export default theme;