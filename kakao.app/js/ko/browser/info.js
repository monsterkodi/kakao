var _k_

var file, image

import kxk from "../../kxk.js"
let ffs = kxk.ffs
let elem = kxk.elem
let slash = kxk.slash
let $ = kxk.$

import File from "../tools/File.js"


image = function (file)
{
    var cnt, img, info, table

    img = elem('img',{class:'browserImage',src:slash.fileUrl(file)})
    cnt = elem({class:'browserImageContainer',child:img})
    cnt.addEventListener('dblclick',function ()
    {
        return open(file)
    })
    table = elem('table',{class:"fileInfoData"})
    img.onload = async function ()
    {
        var br, height, html, info, width, x

        img = $('.browserImage')
        br = img.getBoundingClientRect()
        x = img.clientX
        width = parseInt(br.right - br.left - 2)
        height = parseInt(br.bottom - br.top - 2)
        img.style.opacity = '1'
        img.style.maxWidth = '100%'
        info = await ffs.info(file)
        html = `<tr><th colspan=2>${width}<span class='punct'>x</span>${height}</th></tr>`
        html += `<tr><th>${info.size}</th><td>bytes</td></tr>`
        html += `<tr><th>${info.modified}</th><td>time</td></tr>`
        return table.innerHTML = html
    }
    info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),table]})
    cnt.appendChild(info)
    return cnt
}

file = function (file)
{
    var info, table

    table = elem('table',{class:"fileInfoData"})
    ffs.fileExists(file).then(async function (stat)
    {
        var info

        if (!stat)
        {
            return console.error(`file ${file} doesn't exist?`)
        }
        info = await ffs.info(file)
        return table.innerHTML = `<tr><th>${info.size}</th><td>bytes</td></tr><tr><th>${info.modified}</th><td>time</td></tr>`
    })
    info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoIcon ${slash.ext(file)} ${File.iconClassName(file)}`}),elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),table]})
    return info
}
export default {file:file,image:image}