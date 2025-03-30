var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var sircels

import png from "./png.js"


sircels = (function ()
{
    function sircels ()
    {}

    sircels["pixlArr"] = new Uint32Array(new ArrayBuffer(4))
    sircels["sircArr"] = null
    sircels["csz"] = []
    sircels["cache"] = {}
    sircels["sircImg"] = function (sd, fg)
    {
        var dx, dy, img, offset, rsq, sr, x, y, _20_64_

        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_20_64_=fg[3]) != null ? _20_64_ : 255)) << 24])
        img = {w:sd,h:sd}
        sr = Math.floor(sd / 2)
        rsq = sr * sr
        offset = ((sd % 2 === 0) ? 0.5 : 0)
        for (var _a_ = x = -sr, _b_ = sr; (_a_ <= _b_ ? x <= sr : x >= sr); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = -sr, _d_ = sr; (_c_ <= _d_ ? y <= sr : y >= sr); (_c_ <= _d_ ? ++y : --y))
            {
                dx = x + offset
                dy = y + offset
                if (dx ** 2 + dy ** 2 <= rsq)
                {
                    this.sircArr.set(this.pixlArr,(x + sr) + (y + sr) * sd)
                }
            }
        }
        img.png = Buffer.from(png.encode([this.sircArr.buffer],img.w,img.h,2))
        return img
    }

    sircels["place"] = function (sx, sy, sd, fg, z)
    {
        var img, ox, oy, tx, ty

        if (_k_.empty(this.csz))
        {
            return
        }
        img = this.cache[fg]
        if (_k_.empty(img))
        {
            img = this.sircImg(sd,fg)
            this.cache[fg] = img
        }
        ty = Math.floor(sy / this.csz[1])
        tx = Math.floor(sx / this.csz[0])
        oy = sy - ty * this.csz[1]
        ox = sx - tx * this.csz[0]
        return ked_ttio.placeImg(img,tx,ty,ox,oy,sd,sd,z)
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