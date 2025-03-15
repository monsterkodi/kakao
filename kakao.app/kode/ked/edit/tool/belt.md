```
    █████████   ███████    ███████   ███            ███████    ████████  ███      █████████
       ███     ███   ███  ███   ███  ███            ███   ███  ███       ███         ███   
       ███     ███   ███  ███   ███  ███            ███████    ███████   ███         ███   
       ███     ███   ███  ███   ███  ███            ███   ███  ███       ███         ███   
       ███      ███████    ███████   ███████        ███████    ████████  ███████     ███   
```

# edit ▸ tool ▸ belt

    collection of text editing functions
    
    belt            ranges, postions, etc 
        - edit            complex editing
        - text            string operations
        - salt            salter utilities

## rules
    
    - static, not state, no side-effects
    - operate on plain old data-structures only
    - don't modify arguments (at least i hope that is the case ;)

### glossary

    range     [x1 y1 x2 y2]     x1 & x2 grapheme indices or cell cols y1 & y2 lines or cell rows
    span      [x1 y x2]         as above for a single line or row
    position  [x y]             almost always cell coordinates
    
    word      word characters
    turd      non-whitespace and non-word-characters (punctuation)
    chunk     non-whitespace-characters (turd or word)
    
    line      either a string or a grapheme list
    lines     list of strings or grapheme lists (segls)
    
    bol       begin of line
    eol       end of line
    
    ind_eol   indent or end of line
    ind_bol   indent or begin of line

    bof       begin of file
    eof       end of file
    
    bos       begin of selections
    eos       end of selections
    
    screen    the whole area of the terminal buffer
              consists of cells
    
    cell      single terminal character slot
    cells     2 dimensional area of cells, list of rows
              - x y         offset in screen cells
              - cols rows   number of cells in x and y direction

    col       x coordinate, mostly used in the context of cells and strings
    row       y coordinate, mostly used in the context of cells and lines
    
    grapheme  string that is displayed as a single symbol but may occupy multiple cells
              
    width     how many cells a grapheme occupies
              - ascii: always 1 
              - unicode: between 1 and 2
                                
    length    number of graphemes for grapheme lists
              number of bytes for strings
    
    list      array    
    
    