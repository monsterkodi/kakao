var keys


keys = function (key, event)
{
    if (this.s.cursors.length === 1)
    {
        switch (key)
        {
            case 'ctrl+alt+up':
                return this.moveCursors('up',{count:8})

            case 'ctrl+alt+down':
                return this.moveCursors('down',{count:8})

            case 'ctrl+alt+left':
                return this.moveCursors('left',{count:8})

            case 'ctrl+alt+right':
                return this.moveCursors('right',{count:8})

            case 'shift+ctrl+alt+up':
                return this.moveCursors('up',{count:16})

            case 'shift+ctrl+alt+down':
                return this.moveCursors('down',{count:16})

            case 'shift+ctrl+alt+left':
                return this.moveCursors('left',{count:16})

            case 'shift+ctrl+alt+right':
                return this.moveCursors('right',{count:16})

        }

    }
    switch (key)
    {
        case 'up':
            return this.moveCursors('up')

        case 'down':
            return this.moveCursors('down')

        case 'left':
            return this.moveCursors('left')

        case 'right':
            return this.moveCursors('right')

        case 'cmd+left':
        case 'ctrl+left':
            return this.moveCursors(['bos','ind_bol'])

        case 'cmd+right':
        case 'ctrl+right':
            return this.moveCursors(['eos','ind_eol'])

        case 'alt+left':
            return this.moveCursors('left',{jump:['ws','word','empty','punct']})

        case 'alt+right':
            return this.moveCursors('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+right':
            return this.moveCursorsAndSelect('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+left':
            return this.moveCursorsAndSelect('left',{jump:['ws','word','empty','punct']})

        case 'shift+up':
            return this.moveCursorsAndSelect('up')

        case 'shift+down':
            return this.moveCursorsAndSelect('down')

        case 'shift+left':
            return this.moveCursorsAndSelect('left')

        case 'shift+right':
            return this.moveCursorsAndSelect('right')

        case 'shift+cmd+right':
            return this.moveCursorsAndSelect('ind_eol')

        case 'shift+cmd+left':
            return this.moveCursorsAndSelect('ind_bol')

        case 'shift+ctrl+h':
            return this.moveCursorsAndSelect('bof')

        case 'shift+ctrl+j':
            return this.moveCursorsAndSelect('eof')

        case 'shift+alt+cmd+up':
            return this.moveMainCursorInDirection('up',{keep:true})

        case 'shift+alt+cmd+down':
            return this.moveMainCursorInDirection('down',{keep:true})

        case 'shift+alt+cmd+left':
            return this.moveMainCursorInDirection('left',{keep:true})

        case 'shift+alt+cmd+right':
            return this.moveMainCursorInDirection('right',{keep:true})

        case 'alt+up':
            return this.moveSelectionOrCursorLines('up')

        case 'alt+down':
            return this.moveSelectionOrCursorLines('down')

        case 'shift+alt+up':
            return this.cloneSelectionAndCursorLines('up')

        case 'shift+alt+down':
            return this.cloneSelectionAndCursorLines('down')

        case 'cmd+up':
        case 'ctrl+up':
            return this.expandCursors('up')

        case 'cmd+down':
        case 'ctrl+down':
            return this.expandCursors('down')

        case 'shift+cmd+up':
        case 'shift+ctrl+up':
            return this.contractCursors('up')

        case 'shift+cmd+down':
        case 'shift+ctrl+down':
            return this.contractCursors('down')

        case 'pageup':
            return this.singleCursorPage('up')

        case 'pagedown':
            return this.singleCursorPage('down')

        case 'home':
            return this.singleCursorAtIndentOrStartOfLine()

        case 'end':
            return this.singleCursorAtEndOfLine()

        case 'ctrl+h':
            return this.setMainCursor(0,0)

        case 'ctrl+j':
            return this.setMainCursor(this.s.lines[this.s.lines.length - 1].length,this.s.lines.length - 1)

        case 'alt+d':
            return this.delete('next',true)

        case 'shift+ctrl+k':
        case 'entf':
            return this.delete('next')

        case 'ctrl+k':
            return this.delete('eol')

        case 'delete':
            return this.delete('back')

        case 'ctrl+delete':
            return this.delete('back',true)

        case 'cmd+delete':
            return this.delete('back',true)

        case 'shift+tab':
            return this.deindentSelectedOrCursorLines()

        case 'tab':
            return this.insert('\t')

        case 'alt+x':
        case 'cmd+x':
        case 'ctrl+x':
            return this.cut()

        case 'alt+c':
        case 'cmd+c':
        case 'ctrl+c':
            return this.copy()

        case 'alt+v':
        case 'cmd+v':
        case 'ctrl+v':
            return this.paste()

        case 'cmd+z':
        case 'ctrl+z':
            return this.undo()

        case 'shift+cmd+z':
        case 'cmd+y':
        case 'ctrl+y':
            return this.redo()

        case 'cmd+a':
        case 'ctrl+a':
            return this.selectAllLines()

        case 'cmd+j':
        case 'ctrl+j':
            return this.joinLines()

        case 'cmd+l':
        case 'ctrl+l':
            return this.selectMoreLines()

        case 'shift+cmd+l':
        case 'shift+ctrl+l':
            return this.selectLessLines()

        case 'cmd+e':
        case 'ctrl+e':
            return this.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

        case 'cmd+d':
        case 'ctrl+d':
            return this.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

        case 'cmd+g':
        case 'ctrl+g':
            return this.selectWordAtCursor_highlightSelection_selectNextHighlight()

        case 'shift+cmd+e':
        case 'shift+ctrl+e':
            return this.highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight()

        case 'shift+cmd+d':
        case 'shift+ctrl+d':
            return this.selectWordAtCursor_highlightSelection_addPrevHighlightToSelection()

        case 'shift+cmd+g':
        case 'shift+ctrl+g':
            return this.selectWordAtCursor_highlightSelection_selectPrevHighlight()

        case 'alt+cmd+d':
        case 'alt+ctrl+d':
            return this.selectWordAtCursor_highlightSelection_selectAllHighlights()

        case 'cmd+/':
        case 'ctrl+/':
            return this.toggleCommentAtSelectionOrCursorLines()

        case 'esc':
            return this.clearCursorsHighlightsAndSelections()

    }

    return 'unhandled'
}
export default keys;