var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var squares

import png from "./png.js"


squares = (function ()
{
    function squares ()
    {}

    squares["pixlArr"] = new Uint32Array(new ArrayBuffer(4))
    squares["tileArr"] = null
    squares["csz"] = []
    squares["cache"] = {}
    squares["tilesInRect"] = function (px, py, pw, ph)
    {
        var boty, cx, cy, ox, oy, rgtx, sh, sw, tiles, tx, ty

        tiles = []
        rgtx = px + pw
        boty = py + ph
        cy = py
        while (cy < boty)
        {
            cx = px
            ty = Math.floor(cy / this.csz[1])
            oy = cy - ty * this.csz[1]
            sh = _k_.clamp(0,this.csz[1],this.csz[1] - oy)
            sh = _k_.min(sh,boty - cy)
            while (cx < rgtx)
            {
                tx = Math.floor(cx / this.csz[0])
                ox = cx - tx * this.csz[0]
                sw = _k_.clamp(0,this.csz[0],this.csz[0] - ox)
                sw = _k_.min(sw,rgtx - cx)
                tiles.push([tx,ty,ox,oy,sw,sh])
                cx += sw
            }
            cy += sh
        }
        return tiles
    }

    squares["tileImg"] = function (tw, th, fg)
    {
        var c, img, r, _56_64_

        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_56_64_=fg[3]) != null ? _56_64_ : 255)) << 24])
        img = {w:tw,h:th}
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

    squares["place"] = function (sx, sy, sw, sh, fg, z)
    {
        var img, t

        if (_k_.empty(this.csz))
        {
            return
        }
        img = this.cache[fg]
        if (_k_.empty(img))
        {
            img = this.tileImg(this.csz[0],this.csz[1],fg)
            this.cache[fg] = img
        }
        var list = _k_.list(this.tilesInRect(sx,sy,sw,sh))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            t = list[_a_]
            ked_ttio.placeImg(img,t[0],t[1],t[2],t[3],t[4],t[5],z)
        }
    }

    squares["onResize"] = function (cols, rows, pixels, cellsz)
    {
        this.csz = cellsz
        this.cache = {}
        return this.tileArr = new Uint32Array(new ArrayBuffer(this.csz[0] * this.csz[1] * 4))
    }

    return squares
})()

export default squares;