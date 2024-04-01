var toExport = {}
var _k_

import styl from "../kxk/styl.js"

toExport["styl"] = function ()
{
    compare(styl(`//  0000000  000000000  000   000  000    
// 000          000      000 000   000    
// 0000000      000       00000    000    
//      000     000        000     000    
// 0000000      000        000     0000000

frameWidth          = 6px
titlebarHeight      = 30px

@font-face 
    font-family     titlebarFont
    font-weight     normal
    font-style      normal
    src             url("../../Contents/Resources/font/Bahnschrift.woff")`),`
@font-face
{
    font-family: titlebarFont;
    font-weight: normal;
    font-style: normal;
    src: url("../../Contents/Resources/font/Bahnschrift.woff");
}
`)
    compare(styl(`*
    outline-width       0
    outline-style       none
    
.test
    font-size       40px
    font-family     fontMono
    color           #88f
    text-align      center
    width           100%`),`
*
{
    outline-width: 0;
    outline-style: none;
}

.test
{
    font-size: 40px;
    font-family: fontMono;
    color: #88f;
    text-align: center;
    width: 100%;
}
`)
    compare(styl(`frameWidth = 6px
::-webkit-scrollbar
    width                   frameWidth
::-webkit-scrollbar
    height                  frameWidth  
    background-color        transparent
::-webkit-scrollbar-track
    background-color        transparent`),`
::-webkit-scrollbar
{
    width: 6px;
}

::-webkit-scrollbar
{
    height: 6px;
    background-color: transparent;
}

::-webkit-scrollbar-track
{
    background-color: transparent;
}
`)
    compare(styl(`@keyframes fadeIn
    0%
        opacity         0
    100%  
        opacity         1`),`
@keyframes fadeIn
{
    0%
    {
        opacity: 0;
    }

    100%
    {
        opacity: 1;
    }

}
`)
    compare(styl(`frameWidth = 6px
.popupCombo
    right               2 * frameWidth`),`
.popupCombo
{
    right: 12px;
}
`)
    compare(styl(`frameWidth = 6px
.popupCombo
    padding-right       2 * frameWidth + 70px`),`
.popupCombo
{
    padding-right: 82px;
}
`)
    compare(styl(`frameRadius         = 10px
contentRadius       = frameRadius - 2px

.test
    margin       contentRadius`),`
.test
{
    margin: 8px;
}
`)
    compare(styl(`fill-abs()
    position            absolute
    bottom              0
    right               0
    left                0
    top                 0
body
    fill-abs()`),`
body
{
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
}
`)
    compare(styl(`#titlebar .winbutton
    text-align          center
    &.minimize
        padding-top     3px
    &.maximize
        padding-right   1px`),`
#titlebar .winbutton
{
    text-align: center;
}

#titlebar .winbutton.minimize
{
    padding-top: 3px;
}

#titlebar .winbutton.maximize
{
    padding-right: 1px;
}
`)
    compare(styl(`#titlebar .winbutton
    color #00f
    &:active
        color #ff0
        &.gray
            color #f00`),`
#titlebar .winbutton
{
    color: #00f;
}

#titlebar .winbutton:active
{
    color: #ff0;
}

#titlebar .winbutton:active.gray
{
    color: #f00;
}
`)
    compare(styl(`selectionRadiusCursor = 6px
.highlight
    margin-right        - selectionRadiusCursor`),`
.highlight
{
    margin-right: -6px;
}
`)
    compare(styl(`radius = 666px
.highlight
    margin-right        -radius`),`
.highlight
{
    margin-right: -666px;
}
`)
    compare(styl(`octicon(char)
    font-family         octicons
    content             char

awesome(char)
    font-family         FontAwesome
    content             char
    
.git-added-icon:before
    awesome('\\f067')
    
.file-icon:before
    octicon('\\f011')`),`
.git-added-icon:before
{
    font-family: FontAwesome;
    content: '\\f067';
}

.file-icon:before
{
    font-family: octicons;
    content: '\\f011';
}
`)
}
toExport["styl"]._section_ = true
toExport._test_ = true
export default toExport
