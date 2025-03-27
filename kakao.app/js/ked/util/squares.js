var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var squares

import nfs from "../../kxk/nfs.js"

import png from "./png.js"


squares = (function ()
{
    function squares ()
    {}

    squares["pixlArr"] = (new Uint32Array(new ArrayBuffer(4)))
    squares["tileArr"] = null
    squares["csz"] = []
    squares["cache"] = {}
    squares["tileRect"] = function (px, py, pw, ph)
    {
        var th, tw, tx, ty

        tw = this.csz[0]
        th = this.csz[1]
        tx = Math.floor(px / tw)
        ty = Math.floor(py / th)
        return [tx,ty,tw,th]
    }

    squares["tileImg"] = function (tw, th, fg)
    {
        var c, img, r, _39_64_

        if (fg.length < 4)
        {
            fg.push(255)
        }
        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_39_64_=fg[3]) != null ? _39_64_ : 255)) << 24])
        img = {w:tw,h:th,z:2000}
        for (var _a_ = c = 0, _b_ = tw; (_a_ <= _b_ ? c < tw : c > tw); (_a_ <= _b_ ? ++c : --c))
        {
            this.tileArr.set(this.pixlArr,c)
        }
        for (var _c_ = r = 1, _d_ = th; (_c_ <= _d_ ? r < th : r > th); (_c_ <= _d_ ? ++r : --r))
        {
            this.tileArr.copyWithin(r * tw,(r - 1) * tw,r * tw)
        }
        img.png = Buffer.from(png.encode([this.tileArr.buffer],img.w,img.h,2))
        return img
    }

    squares["place"] = function (sx, sy, sw, sh, fg)
    {
        var img, ox, oy, t

        if (_k_.empty(this.csz))
        {
            return
        }
        t = this.tileRect(sx,sy,sw,sh)
        img = this.cache[fg]
        if (_k_.empty(img))
        {
            img = this.tileImg(t[2],t[3],fg)
            this.cache[fg] = img
        }
        ox = sx - t[0] * this.csz[0]
        oy = sy - t[1] * this.csz[1]
        return ked_ttio.placeImg(img,t[0],t[1],ox,oy,sw,sh)
    }

    squares["onResize"] = function (cols, rows, pixels, cellsz)
    {
        var bytes

        this.csz = cellsz
        this.cache = {}
        bytes = this.csz[0] * this.csz[1] * 4
        return this.tileArr = new Uint32Array(new ArrayBuffer(bytes))
    }

    return squares
})()

export default squares;