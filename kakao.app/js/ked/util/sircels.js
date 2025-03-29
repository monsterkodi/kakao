var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var sircels

import nfs from "../../kxk/nfs.js"

import png from "./png.js"


sircels = (function ()
{
    function sircels ()
    {}

    sircels["pixlArr"] = new Uint32Array(new ArrayBuffer(4))
    sircels["sircArr"] = null
    sircels["csz"] = []
    sircels["cache"] = {}
    sircels["sircImg"] = function (cr, fg)
    {
        var img, rsq, x, y, _21_64_

        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_21_64_=fg[3]) != null ? _21_64_ : 255)) << 24])
        img = {w:cr * 2,h:cr * 2}
        rsq = cr * cr
        for (var _a_ = x = -cr, _b_ = cr; (_a_ <= _b_ ? x <= cr : x >= cr); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = -cr, _d_ = cr; (_c_ <= _d_ ? y <= cr : y >= cr); (_c_ <= _d_ ? ++y : --y))
            {
                if (x ** 2 + y ** 2 <= rsq)
                {
                    this.sircArr.set(this.pixlArr,(x + cr) + (y + cr) * (cr + cr))
                }
            }
        }
        img.png = Buffer.from(png.encode([this.sircArr.buffer],img.w,img.h,2))
        return img
    }

    sircels["tileRect"] = function (px, py, pw, ph)
    {
        var ox, oy, sh, sw, tx, ty

        ty = Math.floor(py / this.csz[1])
        oy = py - ty * this.csz[1]
        sh = _k_.min(ph,_k_.clamp(0,this.csz[1],this.csz[1] - oy))
        tx = Math.floor(px / this.csz[0])
        ox = px - tx * this.csz[0]
        sw = _k_.min(pw,_k_.clamp(0,this.csz[0],this.csz[0] - ox))
        return [tx,ty,ox,oy,sw,sh]
    }

    sircels["place"] = function (sx, sy, sr, fg, z)
    {
        var img, t

        if (_k_.empty(this.csz))
        {
            return
        }
        img = this.cache[fg]
        if (_k_.empty(img))
        {
            img = this.sircImg(sr,fg)
            this.cache[fg] = img
            nfs.write('~/Desktop/sircle.png',img.png)
        }
        t = this.tileRect(sx,sy,sr * 2,sr * 2)
        return ked_ttio.placeImg(img,t[0],t[1],t[2],t[3],t[4],t[5],z)
    }

    sircels["onResize"] = function (cols, rows, pixels, cellsz)
    {
        this.csz = cellsz
        this.cache = {}
        return this.sircArr = new Uint32Array(new ArrayBuffer(this.csz[0] * this.csz[0] * 4))
    }

    return sircels
})()

export default sircels;