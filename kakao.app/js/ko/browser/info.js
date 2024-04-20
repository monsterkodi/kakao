var _k_

var file, image

import kxk from "../../kxk.js"
let pretty = kxk.pretty
let ffs = kxk.ffs
let elem = kxk.elem
let slash = kxk.slash
let $ = kxk.$

import File from "../tools/File.js"


image = function (file)
{
    var cnt, img, imgdiv, table

    img = elem('img',{class:'browserImage',src:slash.fileUrl(file)})
    imgdiv = elem({class:'browserImageDiv',child:img})
    cnt = elem({class:'browserImageContainer',child:imgdiv})
    img.addEventListener('dblclick',function ()
    {
        return kore.set('view|file',file)
    })
    table = elem('table',{class:'imageInfoData'})
    img.onload = async function ()
    {
        var info, size, size_unit, time, time_unit

        img.style.opacity = '1'
        info = await ffs.info(file)
        var _34_26_ = pretty.bytes(info.size).split(' '); size = _34_26_[0]; size_unit = _34_26_[1]

        var _35_26_ = pretty.age(info.modified).split(' '); time = _35_26_[0]; time_unit = _35_26_[1]

        return table.innerHTML = `<tr><th colspan=2><div class='fileInfoFile ${slash.ext(file)}'>${File.span(file)}</div></th></tr><tr class='dataRow'><th>${size}</th><td>${size_unit}</td></tr><tr class='dataRow'><th>${time}</th><td>${time_unit}</td></tr>`
    }
    return elem({class:'browserImageInfo',children:[elem({class:'imageInfoSpacer'}),cnt,table,elem({class:'imageInfoSpacer'})]})
}

file = function (file)
{
    var info, table

    table = elem('table',{class:'fileInfoData'})
    ffs.fileExists(file).then(async function (stat)
    {
        var info, size, size_unit, time, time_unit

        if (!stat)
        {
            return console.error(`file ${file} doesn't exist?`)
        }
        info = await ffs.info(file)
        var _58_26_ = pretty.bytes(info.size).split(' '); size = _58_26_[0]; size_unit = _58_26_[1]

        var _59_26_ = pretty.age(info.modified).split(' '); time = _59_26_[0]; time_unit = _59_26_[1]

        return table.innerHTML = `<tr><th>${size}</th><td>${size_unit}</td></tr><tr><th>${time}</th><td>${time_unit}</td></tr>`
    })
    info = elem({class:'browserFileInfo',children:[elem({class:'fileInfoSpacer'}),elem({class:`fileInfoIcon ${slash.ext(file)} ${File.iconClassName(file)}`}),elem({class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),table,elem({class:'fileInfoSpacer'})]})
    return info
}
export default {file:file,image:image}