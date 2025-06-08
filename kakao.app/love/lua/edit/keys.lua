--[[
    ███   ███  ████████  ███   ███   ███████  
    ███  ███   ███        ███ ███   ███       
    ███████    ███████     █████    ███████   
    ███  ███   ███          ███          ███  
    ███   ███  ████████     ███     ███████   

    maps keyboard input to text manipulation
    functions of edit▸state
--]]

 = require ""


function handleKey(key, event) 
    return -- will be bound to state
end


    if ('unhandled' ~= mode.handleKey(@, key, event)) then return end
    
    if (key == 'up') then return moveCursors().init('up')
    elseif (key == 'down') then return moveCursors().init('down')
    elseif (key == 'left') then return moveCursors().init('left')
    elseif (key == 'right') then return moveCursors().init('right')
    elseif (key == 'ctrl+alt+up') then return singleCursorPage().init('up')
    elseif (key == 'ctrl+alt+down') then return singleCursorPage().init('down')
    elseif (key == 'shift+ctrl+alt+up') then return moveCursors().init('up', count:16)
    elseif (key == 'shift+ctrl+alt+down') then return moveCursors().init('down', count:16)
    elseif (key == 'cmd+left') or (key == 'ctrl+left') then return moveCursors().init(array('bos', 'ind_bol'))
    elseif (key == 'cmd+right') or (key == 'ctrl+right') then return moveCursors().init(array('eos', 'ind_eol'))
    elseif (key == 'alt+left') then return moveCursors().init('left', jump:array('ws', 'word', 'empty', 'punct'))
    elseif (key == 'alt+right') then return moveCursors().init('right', jump:array('ws', 'word', 'empty', 'punct'))
    elseif (key == 'shift+alt+right') then return moveCursorsAndSelect().init('right', jump:array('ws', 'word', 'empty', 'punct'))
    elseif (key == 'shift+alt+left') then return moveCursorsAndSelect().init('left', jump:array('ws', 'word', 'empty', 'punct'))
    elseif (key == 'shift+up') then return moveCursorsAndSelect().init('up')
    elseif (key == 'shift+down') then return moveCursorsAndSelect().init('down')
    elseif (key == 'shift+left') then return moveCursorsAndSelect().init('left')
    elseif (key == 'shift+right') then return moveCursorsAndSelect().init('right')
    elseif (key == 'shift+cmd+right') then return moveCursorsAndSelect().init('ind_eol')
    elseif (key == 'shift+cmd+left') then return moveCursorsAndSelect().init('ind_bol')
    elseif (key == 'shift+ctrl+h') then return moveCursorsAndSelect().init('bof')
    elseif (key == 'shift+ctrl+j') then return moveCursorsAndSelect().init('eof')
    elseif (key == 'shift+alt+cmd+up') then return moveMainCursorInDirection().init('up', keep:true) ; -- 'paint' cursors
    elseif (key == 'shift+alt+cmd+down') then return moveMainCursorInDirection().init('down', keep:true) ; -- 'paint' cursors
    elseif (key == 'shift+alt+cmd+left') then return moveMainCursorInDirection().init('left', keep:true) ; -- 'paint' cursors
    elseif (key == 'shift+alt+cmd+right') then return moveMainCursorInDirection().init('right', keep:true) ; -- 'paint' cursors
    elseif (key == 'alt+up') then return moveSelectionOrCursorLines().init('up')
    elseif (key == 'alt+down') then return moveSelectionOrCursorLines().init('down')
    elseif (key == 'shift+alt+up') then return cloneSelectionAndCursorLines().init('up')
    elseif (key == 'shift+alt+down') then return cloneSelectionAndCursorLines().init('down')
    elseif (key == 'cmd+up') or (key == 'ctrl+up') then return expandCursors().init('up')
    elseif (key == 'cmd+down') or (key == 'ctrl+down') then return expandCursors().init('down')
    elseif (key == 'shift+cmd+up') or (key == 'shift+ctrl+up') then return contractCursors().init('up')
    elseif (key == 'shift+cmd+down') or (key == 'shift+ctrl+down') then return contractCursors().init('down')
    elseif (key == 'pageup') then return singleCursorPage().init('up')
    elseif (key == 'pagedown') then return singleCursorPage().init('down')
    elseif (key == 'home') then return singleCursorAtIndentOrStartOfLine().init()
    elseif (key == 'end') then return singleCursorAtEndOfLine().init()
    elseif (key == 'ctrl+h') then return setMainCursor().init(0, 0)
    elseif (key == 'ctrl+j') then return setMainCursor().init(#@s.lines[(#@s.lines - 1)], (#@s.lines - 1))
    elseif (key == 'alt+d') then return delete().init('next', true)
    elseif (key == 'shift+ctrl+k') or (key == 'entf') then return delete().init('next')
    elseif (key == 'ctrl+k') then return delete().init('eol')
    elseif (key == 'delete') then return delete().init('back')
    elseif (key == 'ctrl+delete') then return delete().init('back', true)
    elseif (key == 'cmd+delete') then return delete().init('back', true)
    elseif (key == 'shift+tab') then return deindentSelectedOrCursorLines().init()
    elseif (key == 'tab') then return insert().init('\t')
    elseif (key == 'alt+x') or (key == 'cmd+x') or (key == 'ctrl+x') then return cut().init()
    elseif (key == 'alt+c') or (key == 'cmd+c') or (key == 'ctrl+c') then return copy().init()
    elseif (key == 'alt+v') or (key == 'cmd+v') or (key == 'ctrl+v') then return paste().init()
    elseif (key == 'cmd+z') or (key == 'ctrl+z') then return undo().init()
    elseif (key == 'shift+cmd+z') or (key == 'cmd+y') or (key == 'ctrl+y') then return redo().init()
    elseif (key == 'cmd+a') or (key == 'ctrl+a') then return selectAllLines().init()
    elseif (key == 'cmd+j') or (key == 'ctrl+j') then return joinLines().init()
    elseif (key == 'cmd+l') or (key == 'ctrl+l') then return selectMoreLines().init()
    elseif (key == 'shift+cmd+l') or (key == 'shift+ctrl+l') then return selectLessLines().init()
    elseif (key == 'cmd+e') or (key == 'ctrl+e') then return highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight().init()
    elseif (key == 'cmd+d') or (key == 'ctrl+d') then return selectWordAtCursor_highlightSelection_addNextHighlightToSelection().init()
    elseif (key == 'cmd+g') or (key == 'ctrl+g') then return selectWordAtCursor_highlightSelection_selectNextHighlight().init()
    elseif (key == 'shift+cmd+e') or (key == 'shift+ctrl+e') then return highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight().init()
    elseif (key == 'shift+cmd+d') or (key == 'shift+ctrl+d') then return selectWordAtCursor_highlightSelection_addPrevHighlightToSelection().init()
    elseif (key == 'shift+cmd+g') or (key == 'shift+ctrl+g') then return selectWordAtCursor_highlightSelection_selectPrevHighlight().init()
    elseif (key == 'alt+y') then return toggleMode().init('unype')
    elseif (key == 'alt+r') then return toggleMode().init('record')
    elseif (key == 'alt+u') then return toggleMode().init('uniko')
    elseif (key == 'alt+;') then return toggleMode().init('vimple')
    elseif (key == 'alt+3') then return toggleMode().init('salter')
    elseif (key == 'cmd+3') or (key == 'ctrl+3') then return insertAsciiHeaderForSelectionOrWordAtCursor().init()
    elseif (key == 'alt+cmd+d') or (key == 'alt+ctrl+d') then return selectWordAtCursor_highlightSelection_selectAllHighlights().init()
    elseif (key == 'cmd+/') or (key == 'ctrl+/') then return toggleCommentAtSelectionOrCursorLines().init()
    elseif (key == 'alt+cmd+/') or (key == 'ctrl+alt+/') then return toggleCommentTypeAtSelectionOrCursorLines().init()
    elseif (key == 'esc') then return clearCursorsHighlightsAndSelections().init()
    end
    
    'unhandled'

export handleKey