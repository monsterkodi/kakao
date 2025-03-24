
              crumbs  file      tabs          status
            ┏━━━━━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━━┓
            ┣━━━━━━━━╋━━━━┻━━━━┻━━━━┻━━━━┻━━┳━┻━━━━━┫
            ┃        ┃             ▴        ┃       ┃
            ┃ dirtee ┃    editor   search   ┃ funcs ┃
            ┃        ┃             results  ┃       ┃
            ┃        ┃                      ┃       ┃
            ┃        ┃                      ┃       ┃
            ┃        ┃                      ┃       ┃
            ┃        ┃                      ┃       ┃
            ┃        ┃                      ┃       ┃
            ┃        ┣━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━┫
            ┃        ┃ help+log+keys                ┃
            ┗━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

# todo
## todo
### todo
#### todo
##### todo

- index use files
- git changes in gutter
- unsaved changes 'tabs'
- dirtree 
    - add modified icon on closed folders

- macro
    - class
    - set prefs
    - unicode palette
        
- completion
    - fix
        - no completion when converting string delimiters
        - turd missing completions
        - completions with leading turd
        - unicode completions

- searcher
    - add statistics somewhere: number of lines | number of files
    - clicking on crumbs or searcherfile should filter the result list accordingly
    - add ability to load search results into a new 'tab' 
    - fix stalls when too many search results are found
    - cmd+up|down: jump to prev|next file
    
- funclist
    - autohighlight function at main cursor
        - use that information to jump to correct counterpart positions!
    - swap with mapscr when the fileeditor hasn't many columns?
    - searchable?
    - should list md headings
    - should list c cpp mm and js functions

- salter mode
    - fix delete and other issues

- dirtree
    - git status
    - searchable?
    - set hover highlight to editor file when loosing focus

- quicky
    - prefs mode
        - set preview_on_hover false
    - make relative to prjcts dir again?
    - fix prjcts files
        - clamp long relative parent dirs
    - click in mapview to jump to line
    
- status
    - move dirty and redo into statusfile 
    - relative crumbs when dirtree is open?
    - add number of lines in editor file

- editing 
    - fix
        - insert after wide unicode segments
        - shift+cursor selection should be able to shrink
        - syntax highlight cache invalidation on multiline editing actions
    - add
        - multicursor delete|backspace over multiple lines? (alt+cmd+delete in ko)
        - alt+cmd+e add word at cursor to highlights
        - alt+cmd+d should work inside selection: highlight word at cursor inside
        - shift+ctrl+left|right|up|down rectangular selection
    - more tests

- unicode mode
    - quicky
        - ~w+ julia search
        - ~d+ single character
        - ~... n times
        
- md mode
    - activates on md file load
    - switches italic and bold fonts
    - handle new kitty font size protocol?

- mapscroll 
    - make scrollbar handle not jump and unblurred
    - update on line changes
    - fix scrolling to bottom for long files
    - show cursors and selections
    
- session
    - clean recent files (check for existence)
    - clean file positions (by age?)?)
    
- config | prefs
    - similar to a global session
        - watches, loads and merges (to handle multiple instances)
    - lists of extensions
        - index      (parsed for completion)
        - source     (included in prjct files)
        - text-files (editable)
    - index files per project?
    
### nice to have
    
    - tabs
    
    - unicode replacement mode ~[n][a-Z]
        - insert n characters if provided 
        
    - syntax highlighting 
        - style for certain unicode characters?
        
    - ansi mode
        - store ansi color in cells
        - color palette
        
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
            
    - finder & searcher
        - cmd+f opens finder if not open
        - cmd+f in finder opens searcher
    
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
    - ffmpeg -i ~/Desktop/ked.mov -r 24 -f gif ~/Desktop/ked.gif    
    - gifski -W 1080 --repeat 0 -Q 100 --fps 30 --extra -o ~/Desktop/ked.gif ~/Desktop/ked.mov

#### creatures

    (';')  {'�'}  [0 0]  '"("'
    