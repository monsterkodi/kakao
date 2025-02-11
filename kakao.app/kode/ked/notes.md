

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

*** todo ***
** todo
* todo

- quick open cmd+p
    - merge with macro?

- mapscroll
    - add scrollbar handle
    - show cursors and selections
    - fix scrolling to bottom for long files
    - split image into chunks
    - update on changes

- find and search
    - each multiline editor has its own knobbed finder at bottom
    - heach finder has a search toggle, which searches in in all files
        - opens the search result panel, if not open already
        - the finder of the search result panel is set to the search parameters:
            - if executed via shortcut: selected or cursor word
            - if executed from a finder: the finder's setting 
                - original finder can be closed and thus 'moves' to the search result pane

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
    
    