
000   000  000000000  000  000      
000   000     000     000  000      
000   000     000     000  000      
000   000     000     000  000      
 0000000      000     000  0000000  
 
# util

## glossary

    range     [x1 y1 x2 y2]
    span      [x1 y x2]
    position  [x y]
    
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
    
    