

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

# todo
## todo
### todo
#### todo
##### todo

- darken text around popups?
- return with single cursor in empty should not append spaces
- key right in input should activate match
- crumbs
    - convert to editor
    - dissect path
    - make path chunks clickable

- unicode mode
    - ~ replacement
    - quicky
        - ~\w+ julia search
        - ~\d+ single character
        - ~\d+n multiple characters
        - ~...*n n times *

- mapscroll
    - add scrollbar handle
    - update on line changes
    - fix scrolling to bottom for long files
    - show cursors and selections
    
- session
    - save main cursor positions per file and apply on load
    - merge cursor positions from last session by default?  
    - clean recent files (check for existance)
    
- config
    - similar to session, but loads and merges (to handle multiple instances)
    - index & source & text files 
    - index files per project?

- quick open cmd+p
    - merge with macro?

- find and search
    - each multiline editor has its own knobbed finder at bottom
    - heach finder has a search toggle, which searches in in all files
        - opens the search result panel, if not open already
        - the finder of the search result panel is set to the search parameters:
            - if executed via shortcut: selected or cursor word
            - if executed from a finder: the finder's setting 
                - original finder can be closed and thus 'moves' to the search result pane

- cutting multiple lines with main cursor at start of next line 
    - moves it one down too much

- multicursor delete|backspace over multiple lines? (alt+cmd+delete in ko)
- alt+cmd+d should work inside selection: highlight word at cursor inside
- alt+cmd+e add word at cursor to highlights
- shift+ctrl+left|right|up|down rectangular selection

- status 
    - clamp file path to half screen width 

- nvim style min-distance from top and bottom of screen when moving main cursor?

- completion

- macro
    - unicode palette
    
- funclist
    
- ascii header mode
    - switch automatically if cursor inside
    - change 0 to █ or ░
    
- file watcher

### nice to have
    
    - tabs
    - git
    
    - unicode replacement mode ~[n][a-Z]
        - insert n characters if provided 
        
    - syntax highlighting 
        - style for certain unicode characters?
        
    - ansi mode
        - store ansi color in cells
        - color palette
        
    - theme  
        - color vibrancy?      
        
    - help 
        - interactive-keyboard-shortcuts
        - multicursor tutorial game?
    
### todo  

    - state tests
    - undo fixes

## design choices

- precious shortcut space

    - no deselect shortcut
        - esc does it most of the time
        - in the rare cases i want to deselect, but keep the multi cursors:
            - select all and select all again
    
    - select all
        - deselects when all lines are selected already 

    - auto-select word at cursor
        - if an action needs a selection and nothing is selected
            - the closest word to the cursor will be selected
    
- precious screen space

    - status at top
        - familiarity with desktop apps
        - potential merge with tabs
        - potential drop down menu (drop-up menus are just as ugly as they sound :)
  
### asciinema  

    - agg ked01.cast ked01.gif --font-family "LiterationMono Nerd Font" --idle-time-limit 0.2 --speed 4 --theme 000000,ffffff,272822,f92672,a6e22e,f4bf75,66d9ef,ae81ff,a1efe4,f8f8f2 --line-height 1.3    
    - gifsicle ked01.gif -o ked01o.gif -O=3 --colors 256 
    