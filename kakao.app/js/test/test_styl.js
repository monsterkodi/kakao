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
}
toExport["styl"]._section_ = true
toExport._test_ = true
export default toExport
