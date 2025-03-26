var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var rounded

import nfs from "../../kxk/nfs.js"

import png from "./png.js"


rounded = (function ()
{
    function rounded ()
    {}

    rounded["cache"] = {}
    rounded["img"] = function (w, h)
    {
        var buff, view

        buff = new ArrayBuffer(w * h * 4)
        view = new DataView(buff)
        return {w:w,h:h,buff:buff,view:view}
    }

    rounded["set"] = function (img, x, y, rgba)
    {
        var i

        if (x < 0 || y < 0)
        {
            return
        }
        if (x >= img.w)
        {
            return
        }
        if (y >= img.h)
        {
            return
        }
        for (i = 0; i < 4; i++)
        {
            img.view.setUint8(((x + y * img.w) * 4) + i,rgba[i])
        }
    }

    rounded["encode"] = function (img)
    {
        img.png = Buffer.from(png.encode([img.buff],img.w,img.h,2))
        img.b64 = img.png.toString('base64')
        return img
    }

    rounded["circle"] = function (img, cx, cy, r, fg)
    {
        var rsq, x, y

        rsq = r * r
        for (var _a_ = x = cx - r, _b_ = cx + r; (_a_ <= _b_ ? x <= cx + r : x >= cx + r); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = cy - r, _d_ = cy + r; (_c_ <= _d_ ? y <= cy + r : y >= cy + r); (_c_ <= _d_ ? ++y : --y))
            {
                if ((cx - x) ** 2 + (cy - y) ** 2 <= rsq)
                {
                    this.set(img,x,y,fg)
                }
            }
        }
    }

    rounded["fill"] = function (img, x, y, w, h, fg)
    {
        var c, r

        for (var _a_ = r = x, _b_ = x + w; (_a_ <= _b_ ? r <= x + w : r >= x + w); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = y, _d_ = y + h; (_c_ <= _d_ ? c <= y + h : c >= y + h); (_c_ <= _d_ ? ++c : --c))
            {
                this.set(img,r,c,fg)
            }
        }
    }

    rounded["rect"] = function (w, h, r, fg)
    {
        var img, rh, rw, rx, ry

        img = this.img(w,h)
        rx = r
        ry = r
        rw = w - 2 * r
        rh = h - 2 * r
        this.fill(img,rx,ry,rw,rh,fg)
        return this.encode(img)
    }

    rounded["topLeft"] = function (w, h, fg)
    {
        var img, r

        img = this.img(w,h)
        r = _k_.min(w,h)
        this.circle(img,r,r,r,fg)
        this.fill(img,0,r,w,h,fg)
        return this.encode(img)
    }

    rounded["place"] = function (x, y, name, fg, bg)
    {
        var csz, img, key

        console.log(`rounded.place ${x} ${y} ${name} ${fg} ${bg}`)
        key = name + fg + bg
        img = this.cache[key]
        csz = ked_ttio.cellsz
        if (_k_.empty(img))
        {
            img = this.topLeft(csz[0],csz[1],fg)
            this.cache[key] = img
        }
        return ked_ttio.placeImg(img,x,y)
    }

    return rounded
})()

export default rounded;