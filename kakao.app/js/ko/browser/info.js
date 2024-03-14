var _k_

var file, image

import dom from "../../kxk/dom.js"
let $ = dom.$

import ffs from "../../kxk/ffs.js"

import elem from "../../kxk/elem.js"

import slash from "../../kxk/slash.js"

import lib_ko from "../../../lib/lib_ko.js"
let moment = lib_ko.moment
let pbytes = lib_ko.pbytes

import File from "../tools/file.js"


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
        var age, br, height, html, info, num, range, size, width, x

        img = $('.browserImage')
        br = img.getBoundingClientRect()
        x = img.clientX
        width = parseInt(br.right - br.left - 2)
        height = parseInt(br.bottom - br.top - 2)
        img.style.opacity = '1'
        img.style.maxWidth = '100%'
        info = await ffs.info(file)
        size = pbytes(info.size).split(' ')
        age = moment().to(moment(info.modified),true)
        var _46_21_ = age.split(' '); num = _46_21_[0]; range = _46_21_[1]

        if (num[0] === 'a')
        {
            num = '1'
        }
        html = `<tr><th colspan=2>${width}<span class='punct'>x</span>${height}</th></tr>`
        html += `<tr><th>${size[0]}</th><td>${size[1]}</td></tr>`
        html += `<tr><th>${num}</th><td>${range}</td></tr>`
        return table.innerHTML = html
    }
    info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),table]})
    cnt = $('.browserImageContainer')
    cnt.appendChild(info)
    return cnt
}

file = function (file)
{
    var info, table

    table = elem('table',{class:"fileInfoData"})
    ffs.fileExists(file).then(async function (stat)
    {
        var age, info, num, range, size, t

        if (!stat)
        {
            return console.error(`file ${file} doesn't exist?`)
        }
        info = await ffs.info(file)
        size = pbytes(info.size).split(' ')
        t = moment(info.modified)
        age = moment().to(t,true)
        var _84_21_ = age.split(' '); num = _84_21_[0]; range = _84_21_[1]

        if (num[0] === 'a')
        {
            num = '1'
        }
        if (range === 'few')
        {
            num = moment().diff(t,'seconds')
            range = 'seconds'
        }
        return table.innerHTML = `<tr><th>${size[0]}</th><td>${size[1]}</td></tr><tr><th>${num}</th><td>${range}</td></tr>`
    })
    info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoIcon ${slash.ext(file)} ${File.iconClassName(file)}`}),elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),table]})
    return info
}
export default {file:file,image:image}