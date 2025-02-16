

            ┏━━━━━━━┳━━━━━┳━━━━━━━━━┳━━━━━━━━━━┓
            ┃       ┃     ┃         ┃          ┃
            ┃ shelf ┃     ┃ browser ┃          ┃
            ┃       ┃     ┃         ┃          ┃
            ┣━━━━┳━━┻━┳━━━┻┳━━━━┳━━━┻┳━━━━┳━━━━┫
            ┃    ┃    ┃    ┃tabs┃    ┃    ┃    ┃
            ┣━━━━┻━━┳━┻━━━━┻━━━━┻━━┳━┻┳━━━┻━━━━┫
            ┃       ┃              ┃  ┃        ┃
            ┃ fscol ┃    editor    ┃  ┃ search ┃
            ┃ funcs ┃              ┃  ┃        ┃
            ┃       ┃              ┃  ┃        ┃
            ┃       ┃              ┃  ┃        ┃
            ┃       ┃              ┃  ┃        ┃
            ┃       ┃              ┃  ┃        ┃
            ┃       ┃              ┃  ┃        ┃
            ┣━━━━━━━┻━━━━━━━━━━━━━━┻━━┻━━━━━━━━┫
            ┃          help+log+keys           ┃
            ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
            ┗━━━━━━━━━━━━ status ━━━━━━━━━━━━━━┛

#### todo
### todo
## todo
# todo

- greeter 
    - recent files
    
- session
    - save main cursor positions per file and apply on load
    - load last session by default?  
    - global session for recent files?
    
- config

    - similar to session, but loads and merges (to handle multiple instances)

- quick open cmd+p
    - cmd+. to open in browser mode for now?
    - add cwd in browser mode
    - merge with macro?
    - fix layout issues for larger repositories with longer file names

- find and search
    - each multiline editor has its own knobbed finder at bottom
    - heach finder has a search toggle, which searches in in all files
        - opens the search result panel, if not open already
        - the finder of the search result panel is set to the search parameters:
            - if executed via shortcut: selected or cursor word
            - if executed from a finder: the finder's setting 
                - original finder can be closed and thus 'moves' to the search result pane
                
- mapscroll
    - add scrollbar handle
    - update on line changes
    - fix scrolling to bottom for long files
    - show cursors and selections
    - split image into chunks

- multicursor delete/backspace over multiple lines? (alt+cmd+delete in ko)

- prefs 
    - file positions

▸ completion

▸ macro
    - unicode palette
    
- fscol
    ▸ funclist
    
- ascii header mode
    - switch automatically if cursor inside
    - change 0 to █ or ░
    
- file watcher

- nice to have
    
    - tabs
    - git
    
    - unicode replacement mode ~[n][a-Z]
        - insert n characters if provided 
        
    - syntax highlighting 
        - remove ligature?
        - style for certain unicode characters?
        
    - ansi mode
        - store ansi color in cells
        - color palette
        
    - theme 
        - color vibrancy?      
        
    - help 
        - interactive-keyboard-shortcuts
        - multicursor tutorial game?
    
- todo
    - state tests
    - undo fixes
    
agg ked01.cast ked01.gif --font-family "LiterationMono Nerd Font" --idle-time-limit 0.2 --speed 4 --theme 000000,ffffff,272822,f92672,a6e22e,f4bf75,66d9ef,ae81ff,a1efe4,f8f8f2 --line-height 1.3    
gifsicle ked01.gif -o ked01o.gif -O=3 --colors 256 
    