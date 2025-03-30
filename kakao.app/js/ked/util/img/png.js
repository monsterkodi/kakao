var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var addErr, compress, compressPNG, concatRGBA, copyTile, crcLib, D, dist, dither, encode, estats, filterLine, filterZero, findNearest, framize, getBPP, getKDtree, getNearest, kmeans, M4, N, paeth, planeDst, prepareDiff, quantize, remap, splitPixels, stats, updateFrame, updatePalette, vecDot

import zlib from "zlib"


getBPP = function (out)
{
    var noc

    noc = [1,null,3,1,2,null,4][out.ctype]
    return noc * out.depth
}

filterZero = function (data, out, off, w, h)
{
    var bpl, bpp, di, i, type, x, y

    bpp = getBPP(out)
    bpl = Math.ceil(w * bpp / 8)
    bpp = Math.ceil(bpp / 8)
    type = data[off]
    x = 0
    if (type > 1)
    {
        data[off] = [0,0,1][type - 2]
    }
    if (type === 3)
    {
        for (var _a_ = x = bpp, _b_ = bpl; (_a_ <= _b_ ? x < bpl : x > bpl); (_a_ <= _b_ ? ++x : --x))
        {
            data[x + 1] = (data[x + 1] + (data[x + 1 - bpp] >>> 1)) & 255
        }
    }
    for (var _c_ = y = 0, _d_ = h; (_c_ <= _d_ ? y < h : y > h); (_c_ <= _d_ ? ++y : --y))
    {
        i = off + y * bpl
        di = i + y + 1
        type = data[di - 1]
        x = 0
        if (type === 0)
        {
            while (x < bpl)
            {
                data[i + x] = data[di + x]
                x++
            }
        }
        else if (type === 1)
        {
            while (x < bpp)
            {
                data[i + x] = data[di + x]
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + data[i + x - bpp])
                x++
            }
        }
        else if (type === 2)
        {
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + data[i + x - bpl])
                x++
            }
        }
        else if (type === 3)
        {
            while (x < bpp)
            {
                data[i + x] = (data[di + x] + (data[i + x - bpl] >>> 1))
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + ((data[i + x - bpl] + data[i + x - bpp]) >>> 1))
                x++
            }
        }
        else
        {
            while (x < bpp)
            {
                data[i + x] = (data[di + x] + paeth(0,data[i + x - bpl],0))
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + paeth(data[i + x - bpp],data[i + x - bpl],data[i + x - bpp - bpl]))
                x++
            }
        }
    }
    return data
}

paeth = function (a, b, c)
{
    var p, pa, pb, pc

    p = a + b - c
    pa = (p - a)
    pb = (p - b)
    pc = (p - c)
    if (pa * pa <= pb * pb && pa * pa <= pc * pc)
    {
        return a
    }
    if (pb * pb <= pc * pc)
    {
        return b
    }
    return c
}

copyTile = function (sb, sw, sh, tb, tw, th, xoff, yoff, mode)
{
    var ba, bb, bg, br, fa, fb, fg, fr, h, ifa, ioa, oa, si, ti, w, x, y

    w = _k_.min(sw,tw)
    h = _k_.min(sh,th)
    si = ti = 0
    for (var _e_ = y = 0, _f_ = h; (_e_ <= _f_ ? y < h : y > h); (_e_ <= _f_ ? ++y : --y))
    {
        for (var _10_ = x = 0, _11_ = w; (_10_ <= _11_ ? x < w : x > w); (_10_ <= _11_ ? ++x : --x))
        {
            if (xoff >= 0 && yoff >= 0)
            {
                si = (y * sw + x) << 2
                ti = ((yoff + y) * tw + xoff + x) << 2
            }
            else
            {
                si = ((-yoff + y) * sw - xoff + x) << 2
                ti = (y * tw + x) << 2
            }
            switch (mode)
            {
                case 0:
                    tb[ti] = sb[si]
                    tb[ti + 1] = sb[si + 1]
                    tb[ti + 2] = sb[si + 2]
                    tb[ti + 3] = sb[si + 3]
                    break
                case 1:
                    fa = sb[si + 3] * (1 / 255)
                    fr = sb[si] * fa
                    fg = sb[si + 1] * fa
                    fb = sb[si + 2] * fa
                    ba = tb[ti + 3] * (1 / 255)
                    br = tb[ti] * ba
                    bg = tb[ti + 1] * ba
                    bb = tb[ti + 2] * ba
                    ifa = 1 - fa
                    oa = fa + ba * ifa
                    ioa = ((oa === 0 ? 0 : 1 / oa))
                    tb[ti + 3] = 255 * oa
                    tb[ti + 0] = (fr + br * ifa) * ioa
                    tb[ti + 1] = (fg + bg * ifa) * ioa
                    tb[ti + 2] = (fb + bb * ifa) * ioa
                    break
                case 2:
                    fa = sb[si + 3]
                    fr = sb[si]
                    fg = sb[si + 1]
                    fb = sb[si + 2]
                    ba = tb[ti + 3]
                    br = tb[ti]
                    bg = tb[ti + 1]
                    bb = tb[ti + 2]
                    if (fa === ba && fr === br && fg === bg && fb === bb)
                    {
                        tb[ti] = 0
                        tb[ti + 1] = 0
                        tb[ti + 2] = 0
                        tb[ti + 3] = 0
                    }
                    else
                    {
                        tb[ti] = fr
                        tb[ti + 1] = fg
                        tb[ti + 2] = fb
                        tb[ti + 3] = fa
                    }
                    break
                case 3:
                    fa = sb[si + 3]
                    fr = sb[si]
                    fg = sb[si + 1]
                    fb = sb[si + 2]
                    ba = tb[ti + 3]
                    br = tb[ti]
                    bg = tb[ti + 1]
                    bb = tb[ti + 2]
                    if (fa === ba && fr === br && fg === bg && fb === bb)
                    {
                        continue
                    }
                    if (fa < 220 && ba > 20)
                    {
                        return false
                    }
                    break
            }

        }
    }
    return true
}
crcLib = {table:(function ()
{
    var c, k, n, tab

    tab = new Uint32Array(256)
    for (n = 0; n < 256; n++)
    {
        c = n
        for (k = 0; k < 8; k++)
        {
            if (c & 1)
            {
                c = 0xedb88320 ^ (c >>> 1)
            }
            else
            {
                c = c >>> 1
            }
        }
        tab[n] = c
    }
    return tab
})(),update:function (c, buf, off, len)
{
    var i

    for (var _12_ = i = 0, _13_ = len; (_12_ <= _13_ ? i < len : i > len); (_12_ <= _13_ ? ++i : --i))
    {
        c = crcLib.table[(c ^ buf[off + i]) & 0xff] ^ (c >>> 8)
    }
    return c
},crc:function (b, o, l)
{
    return crcLib.update(0xffffffff,b,o,l) ^ 0xffffffff
}}

addErr = function (er, tg, ti, f)
{
    tg[ti] += (er[0] * f) >> 4
    tg[ti + 1] += (er[1] * f) >> 4
    tg[ti + 2] += (er[2] * f) >> 4
    return tg[ti + 3] += (er[3] * f) >> 4
}

N = function (x)
{
    return _k_.max(0,_k_.min(255,x))
}

D = function (a, b)
{
    var da, db, dg, dr

    dr = a[0] - b[0]
    dg = a[1] - b[1]
    db = a[2] - b[2]
    da = a[3] - b[3]
    return dr * dr + dg * dg + db * db + da * da
}

dither = function (sb, w, h, plte, tb, oind, MTD)
{
    var c, cc, cd, ce, er, err, hd, i, j, M, nc, nd, ne, ni, nplt, pc, rads, S, tb32, x, y

    MTD = (MTD != null ? MTD : 1)
    pc = plte.length
    nplt = []
    rads = []
    for (var _14_ = i = 0, _15_ = pc; (_14_ <= _15_ ? i < pc : i > pc); (_14_ <= _15_ ? ++i : --i))
    {
        c = plte[i]
        nplt.push([((c >>> 0) & 255),((c >>> 8) & 255),((c >>> 16) & 255),((c >>> 24) & 255)])
    }
    for (var _16_ = i = 0, _17_ = pc; (_16_ <= _17_ ? i < pc : i > pc); (_16_ <= _17_ ? ++i : --i))
    {
        ne = 0xffffffff
        ni = 0
        for (var _18_ = j = 0, _19_ = pc; (_18_ <= _19_ ? j < pc : j > pc); (_18_ <= _19_ ? ++j : --j))
        {
            ce = D(nplt[i],nplt[j])
            if (j !== i && ce < ne)
            {
                ne = ce
                ni = j
            }
        }
        hd = Math.sqrt(ne) / 2
        rads[i] = ~ ~ (hd * hd)
    }
    tb32 = new Uint32Array(tb.buffer)
    err = new Int16Array(w * h * 4)
    S = 4
    M = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5]
    for (var _1a_ = i = 0, _1b_ = M.length; (_1a_ <= _1b_ ? i < M.length : i > M.length); (_1a_ <= _1b_ ? ++i : --i))
    {
        M[i] = 255 * (-0.5 + (M[i] + 0.5) / (S * S))
    }
    for (var _1c_ = y = 0, _1d_ = h; (_1c_ <= _1d_ ? y < h : y > h); (_1c_ <= _1d_ ? ++y : --y))
    {
        for (var _1e_ = x = 0, _1f_ = w; (_1e_ <= _1f_ ? x < w : x > w); (_1e_ <= _1f_ ? ++x : --x))
        {
            i = (y * w + x) * 4
            if (MTD !== 2)
            {
                cc = [N(sb[i] + err[i]),N(sb[i + 1] + err[i + 1]),N(sb[i + 2] + err[i + 2]),N(sb[i + 3] + err[i + 3])]
            }
            else
            {
                ce = M[(y & (S - 1)) * S + (x & (S - 1))]
                cc = [N(sb[i] + ce),N(sb[i + 1] + ce),N(sb[i + 2] + ce),N(sb[i + 3] + ce)]
            }
            ni = 0
            nd = 0xffffff
            for (var _20_ = j = 0, _21_ = pc; (_20_ <= _21_ ? j < pc : j > pc); (_20_ <= _21_ ? ++j : --j))
            {
                cd = D(cc,nplt[j])
                if (cd < nd)
                {
                    nd = cd
                    ni = j
                }
            }
            nc = nplt[ni]
            er = [cc[0] - nc[0],cc[1] - nc[1],cc[2] - nc[2],cc[3] - nc[3]]
            if (MTD === 1)
            {
                if (x !== w - 1)
                {
                }
                addErr(er,err,i + 4,7)
                if (y !== h - 1)
                {
                    if (x !== 0)
                    {
                        addErr(er,err,i + 4 * w - 4,3)
                        addErr(er,err,i + 4 * w,5)
                    }
                    if (x !== w - 1)
                    {
                        addErr(er,err,i + 4 * w + 4,1)
                    }
                }
            }
            oind[i >> 2] = ni
            tb32[i >> 2] = plte[ni]
        }
    }
}

encode = function (bufs, w, h, ps, dels, tabs, forbidPlte)
{
    var anim, b, c, cicc, crc, data, dl, fi, fr, g, i, imgd, ioff, j, leng, nimg, offset, pltAlpha, r, sl, ti, wAs, wr, wUi, wUs, _308_38_

    ps = (ps != null ? ps : 0)
    forbidPlte = (forbidPlte != null ? forbidPlte : false)
    dither = false
    nimg = compress(bufs,w,h,ps,dither)
    compressPNG(nimg,-1)
    tabs = (tabs != null ? tabs : {})
    crc = crcLib.crc
    wUs = function (buff, p, n)
    {
        buff[p] = (n >> 8) & 255
        return buff[p + 1] = n & 255
    }
    wUi = function (buff, p, n)
    {
        buff[p] = (n >> 24) & 255
        buff[p + 1] = (n >> 16) & 255
        buff[p + 2] = (n >> 8) & 255
        return buff[p + 3] = n & 255
    }
    wAs = function (data, p, s)
    {
        var i

        for (var _22_ = i = 0, _23_ = s.length; (_22_ <= _23_ ? i < s.length : i > s.length); (_22_ <= _23_ ? ++i : --i))
        {
            data[p + i] = s.charCodeAt(i)
        }
    }
    offset = 8
    anim = nimg.frames.length > 1
    pltAlpha = false
    leng = 8 + (16 + 5 + 4) + ((anim ? 20 : 0))
    if ((typeof tabs["sRGB"] === "function" ? tabs["sRGB"](leng += 8 + 1 + 4) : undefined))
    {
    }
    if ((typeof tabs["pHYs"] === "function" ? tabs["pHYs"](leng += 8 + 9 + 4) : undefined))
    {
    }
    if ((tabs["iCCP"] != null))
    {
        cicc = zlib.deflateSync(tabs["iCCP"])
        leng += 8 + 11 + 2 + cicc.length + 4
    }
    if (nimg.ctype === 3)
    {
        dl = nimg.plte.length
        for (var _24_ = i = 0, _25_ = dl; (_24_ <= _25_ ? i < dl : i > dl); (_24_ <= _25_ ? ++i : --i))
        {
            if ((nimg.plte[i] >>> 24) !== 255)
            {
                pltAlpha = true
            }
        }
        leng += (8 + dl * 3 + 4) + ((pltAlpha ? (8 + dl * 1 + 4) : 0))
    }
    for (var _26_ = j = 0, _27_ = nimg.frames.length; (_26_ <= _27_ ? j < nimg.frames.length : j > nimg.frames.length); (_26_ <= _27_ ? ++j : --j))
    {
        fr = nimg.frames[j]
        if (anim)
        {
            leng += 38
        }
        leng += fr.cimg.length + 12
        if (j !== 0)
        {
            leng += 4
        }
    }
    leng += 12
    data = new Uint8Array(leng)
    wr = [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]
    for (i = 0; i < 8; i++)
    {
        data[i] = wr[i]
    }
    wUi(data,offset,13)
    offset += 4
    wAs(data,offset,"IHDR")
    offset += 4
    wUi(data,offset,w)
    offset += 4
    wUi(data,offset,h)
    offset += 4
    data[offset] = nimg.depth
    offset++
    data[offset] = nimg.ctype
    offset++
    data[offset] = 0
    offset++
    data[offset] = 0
    offset++
    data[offset] = 0
    offset++
    wUi(data,offset,crc(data,offset - 17,17))
    offset += 4
    if ((tabs["sRGB"] != null))
    {
        wUi(data,offset,1)
        offset += 4
        wAs(data,offset,"sRGB")
        offset += 4
        data[offset] = tabs["sRGB"]
        offset += 1
        wUi(data,offset,crc(data,offset - 5,5))
        offset += 4
    }
    if ((tabs["iCCP"] != null))
    {
        sl = 11 + 2 + cicc.length
        wUi(data,offset,sl)
        offset += 4
        wAs(data,offset,"iCCP")
        offset += 4
        wAs(data,offset,"ICC profile")
        offset += 13
        data.set(cicc,offset)
        offset += cicc.length
        wUi(data,offset,crc(data,offset - (sl + 4),sl + 4))
        offset += 4
    }
    if ((tabs["pHYs"] != null))
    {
        wUi(data,offset,9)
        offset += 4
        wAs(data,offset,"pHYs")
        offset += 4
        wUi(data,offset,tabs["pHYs"][0])
        offset += 4
        wUi(data,offset,tabs["pHYs"][1])
        offset += 4
        data[offset] = tabs["pHYs"][2]
        offset += 1
        wUi(data,offset,crc(data,offset - 13,13))
        offset += 4
    }
    if (anim)
    {
        wUi(data,offset,8)
        offset += 4
        wAs(data,offset,"acTL")
        offset += 4
        wUi(data,offset,nimg.frames.length)
        offset += 4
        wUi(data,offset,(((_308_38_=tabs["loop"]) != null ? _308_38_ : 0)))
        offset += 4
        wUi(data,offset,crc(data,offset - 12,12))
        offset += 4
    }
    if (nimg.ctype === 3)
    {
        dl = nimg.plte.length
        wUi(data,offset,dl * 3)
        offset += 4
        wAs(data,offset,"PLTE")
        offset += 4
        for (var _28_ = i = 0, _29_ = dl; (_28_ <= _29_ ? i < dl : i > dl); (_28_ <= _29_ ? ++i : --i))
        {
            ti = i * 3
            c = nimg.plte[i]
            r = (c) & 255
            g = (c >>> 8) & 255
            b = (c >>> 16) & 255
            data[offset + ti + 0] = r
            data[offset + ti + 1] = g
            data[offset + ti + 2] = b
        }
        offset += dl * 3
        wUi(data,offset,crc(data,offset - dl * 3 - 4,dl * 3 + 4))
        offset += 4
        if (pltAlpha)
        {
            wUi(data,offset,dl)
            offset += 4
            wAs(data,offset,"tRNS")
            offset += 4
            for (var _2a_ = i = 0, _2b_ = dl; (_2a_ <= _2b_ ? i < dl : i > dl); (_2a_ <= _2b_ ? ++i : --i))
            {
                data[offset + i] = (nimg.plte[i] >>> 24) & 255
            }
            offset += dl
            wUi(data,offset,crc(data,offset - dl - 4,dl + 4))
            offset += 4
        }
    }
    fi = 0
    for (var _2c_ = j = 0, _2d_ = nimg.frames.length; (_2c_ <= _2d_ ? j < nimg.frames.length : j > nimg.frames.length); (_2c_ <= _2d_ ? ++j : --j))
    {
        fr = nimg.frames[j]
        if (anim)
        {
            wUi(data,offset,26)
            offset += 4
            wAs(data,offset,"fcTL")
            offset += 4
            wUi(data,offset,fi++)
            offset += 4
            wUi(data,offset,fr.rect.width)
            offset += 4
            wUi(data,offset,fr.rect.height)
            offset += 4
            wUi(data,offset,fr.rect.x)
            offset += 4
            wUi(data,offset,fr.rect.y)
            offset += 4
            wUs(data,offset,dels[j])
            offset += 2
            wUs(data,offset,1000)
            offset += 2
            data[offset] = fr.dispose
            offset += 1
            data[offset] = fr.blend
            offset += 1
            wUi(data,offset,crc(data,offset - 30,30))
            offset += 4
        }
        imgd = fr.cimg
        dl = imgd.length
        wUi(data,offset,dl + ((j === 0 ? 0 : 4)))
        offset += 4
        ioff = offset
        wAs(data,offset,((j === 0 ? "IDAT" : "fdAT")))
        offset += 4
        if (j !== 0)
        {
            wUi(data,offset,fi++)
            offset += 4
        }
        data.set(imgd,offset)
        offset += dl
        wUi(data,offset,crc(data,ioff,offset - ioff))
        offset += 4
    }
    wUi(data,offset,0)
    offset += 4
    wAs(data,offset,"IEND")
    offset += 4
    wUi(data,offset,crc(data,offset - 4,4))
    offset += 4
    return data.buffer
}

compressPNG = function (out, filter, levelZero)
{
    var fdata, frm, i, nh, nw

    for (var _2e_ = i = 0, _2f_ = out.frames.length; (_2e_ <= _2f_ ? i < out.frames.length : i > out.frames.length); (_2e_ <= _2f_ ? ++i : --i))
    {
        frm = out.frames[i]
        nw = frm.rect.width
        nh = frm.rect.height
        fdata = new Uint8Array(nh * frm.bpl + nh)
        frm.cimg = filterZero(frm.img,nh,frm.bpp,frm.bpl,fdata,filter,levelZero)
    }
}

compress = function (bufs, w, h, ps, dith)
{
    var abuf, alphaAnd, area, bb, bln, bpl, bpp, c, cc, cimg, cimg32, cmap, cmc, cof, ctype, depth, evenCrd, forbidPlte, forbidPrev, frm, frms, gotAlpha, i, ii, ilen, img, img32, ind, inds, inj, j, nbufs, nh, nimg, nw, nx, ny, onlyBlend, plte, qi, qres, ti, x, y

    onlyBlend = false
    evenCrd = false
    forbidPrev = false
    forbidPlte = false
    ctype = 6
    depth = 8
    alphaAnd = 255
    for (var _30_ = j = 0, _31_ = bufs.length; (_30_ <= _31_ ? j < bufs.length : j > bufs.length); (_30_ <= _31_ ? ++j : --j))
    {
        img = new Uint8Array(bufs[j])
        ilen = img.length
        i = 0
        while (i < ilen)
        {
            alphaAnd &= img[i + 3]
            i += 4
        }
    }
    gotAlpha = alphaAnd !== 255
    frms = framize(bufs,w,h,onlyBlend,evenCrd,forbidPrev)
    cmap = {}
    plte = []
    inds = []
    if (ps !== 0)
    {
        nbufs = []
        for (var _32_ = i = 0, _33_ = frms.length; (_32_ <= _33_ ? i < frms.length : i > frms.length); (_32_ <= _33_ ? ++i : --i))
        {
            nbufs.push(frms[i].img.buffer)
        }
        abuf = concatRGBA(nbufs)
        qres = quantize(abuf,ps)
        for (var _34_ = i = 0, _35_ = qres.plte.length; (_34_ <= _35_ ? i < qres.plte.length : i > qres.plte.length); (_34_ <= _35_ ? ++i : --i))
        {
            plte.push(qres.plte[i].est.rgba)
        }
        cof = 0
        for (var _36_ = i = 0, _37_ = frms.length; (_36_ <= _37_ ? i < frms.length : i > frms.length); (_36_ <= _37_ ? ++i : --i))
        {
            frm = frms[i]
            bln = frm.img.length
            ind = new Uint8Array(qres.inds.buffer,cof >> 2,bln >> 2)
            inds.push(ind)
            bb = new Uint8Array(qres.abuf,cof,bln)
            if (dith)
            {
                dither(frm.img,frm.rect.width,frm.rect.height,plte,bb,ind)
            }
            frm.img.set(bb)
            cof += bln
        }
    }
    else
    {
        for (var _38_ = j = 0, _39_ = frms.length; (_38_ <= _39_ ? j < frms.length : j > frms.length); (_38_ <= _39_ ? ++j : --j))
        {
            frm = frms[j]
            img32 = new Uint32Array(frm.img.buffer)
            nw = frm.rect.width
            ilen = img32.length
            ind = new Uint8Array(ilen)
            inds.push(ind)
            for (var _3a_ = i = 0, _3b_ = ilen; (_3a_ <= _3b_ ? i < ilen : i > ilen); (_3a_ <= _3b_ ? ++i : --i))
            {
                c = img32[i]
                if (i !== 0 && c === img32[i - 1])
                {
                    ind[i] = ind[i - 1]
                }
                else if (i > nw && c === img32[i - nw])
                {
                    ind[i] = ind[i - nw]
                }
                else
                {
                    cmc = cmap[c]
                    if (cmc === null)
                    {
                        cmap[c] = cmc = plte.length
                        plte.push(c)
                        if (plte.length >= 300)
                        {
                            break
                        }
                    }
                    ind[i] = cmc
                }
            }
        }
    }
    cc = plte.length
    if (cc <= 256 && forbidPlte === false)
    {
        if (cc <= 2)
        {
            depth = 1
        }
        else if (cc <= 4)
        {
            depth = 2
        }
        else if (cc <= 16)
        {
            depth = 4
        }
        else
        {
            depth = 8
        }
        depth = _k_.max(depth,0)
    }
    for (var _3c_ = j = 0, _3d_ = frms.length; (_3c_ <= _3d_ ? j < frms.length : j > frms.length); (_3c_ <= _3d_ ? ++j : --j))
    {
        frm = frms[j]
        nx = frm.rect.x
        ny = frm.rect.y
        nw = frm.rect.width
        nh = frm.rect.height
        cimg = frm.img
        cimg32 = new Uint32Array(cimg.buffer)
        bpl = 4 * nw
        bpp = 4
        if (cc <= 256 && forbidPlte === false)
        {
            bpl = Math.ceil(depth * nw / 8)
            nimg = new Uint8Array(bpl * nh)
            inj = inds[j]
            for (var _3e_ = y = 0, _3f_ = nh; (_3e_ <= _3f_ ? y < nh : y > nh); (_3e_ <= _3f_ ? ++y : --y))
            {
                i = y * bpl
                ii = y * nw
                if (depth === 8)
                {
                    for (var _40_ = x = 0, _41_ = nw; (_40_ <= _41_ ? x < nw : x > nw); (_40_ <= _41_ ? ++x : --x))
                    {
                        nimg[i + (x)] = (inj[ii + x])
                    }
                }
                else if (depth === 4)
                {
                    for (var _42_ = x = 0, _43_ = nw; (_42_ <= _43_ ? x < nw : x > nw); (_42_ <= _43_ ? ++x : --x))
                    {
                        nimg[i + (x >> 1)] |= (inj[ii + x] << (4 - (x & 1) * 4))
                    }
                }
                else if (depth === 2)
                {
                    for (var _44_ = x = 0, _45_ = nw; (_44_ <= _45_ ? x < nw : x > nw); (_44_ <= _45_ ? ++x : --x))
                    {
                        nimg[i + (x >> 2)] |= (inj[ii + x] << (6 - (x & 3) * 2))
                    }
                }
                else if (depth === 1)
                {
                    for (var _46_ = x = 0, _47_ = nw; (_46_ <= _47_ ? x < nw : x > nw); (_46_ <= _47_ ? ++x : --x))
                    {
                        nimg[i + (x >> 3)] |= (inj[ii + x] << (7 - (x & 7) * 1))
                    }
                }
            }
            cimg = nimg
            ctype = 3
            bpp = 1
        }
        else if (gotAlpha === false && frms.length === 1)
        {
            nimg = new Uint8Array(nw * nh * 3)
            area = nw * nh
            for (var _48_ = i = 0, _49_ = area; (_48_ <= _49_ ? i < area : i > area); (_48_ <= _49_ ? ++i : --i))
            {
                ti = i * 3
                qi = i * 4
                nimg[ti] = cimg[qi]
                nimg[ti + 1] = cimg[qi + 1]
                nimg[ti + 2] = cimg[qi + 2]
            }
            cimg = nimg
            ctype = 2
            bpp = 3
            bpl = 3 * nw
        }
        frm.img = cimg
        frm.bpl = bpl
        frm.bpp = bpp
    }
    return {ctype:ctype,depth:depth,plte:plte,frames:frms}
}

framize = function (bufs, w, h, alwaysBlend, evenCrd, forbidPrev)
{
    var area, blend, cimg, cimg32, frm, frms, i, it, j, maX, maY, mix, miX, miy, miY, mx, my, nh, nimg, nw, nx, ny, p32, pimg, r, r0, r1, sarea, tarea, tlim, tstp, x, y

    frms = []
    for (var _4a_ = j = 0, _4b_ = bufs.length; (_4a_ <= _4b_ ? j < bufs.length : j > bufs.length); (_4a_ <= _4b_ ? ++j : --j))
    {
        cimg = new Uint8Array(bufs[j])
        cimg32 = new Uint32Array(cimg.buffer)
        nx = ny = 0
        nw = w
        nh = h
        blend = (alwaysBlend ? 1 : 0)
        if (j !== 0)
        {
            tlim = ((forbidPrev || alwaysBlend || j === 1 || frms[j - 2].dispose !== 0) ? 1 : 2)
            tstp = 0
            tarea = 1e9
            for (var _4c_ = it = 0, _4d_ = tlim; (_4c_ <= _4d_ ? it < tlim : it > tlim); (_4c_ <= _4d_ ? ++it : --it))
            {
                pimg = new Uint8Array(bufs[j - 1 - it])
                p32 = new Uint32Array(bufs[j - 1 - it])
                mix = w
                miy = h
                mx = -1
                my = -1
                for (var _4e_ = y = 0, _4f_ = h; (_4e_ <= _4f_ ? y < h : y > h); (_4e_ <= _4f_ ? ++y : --y))
                {
                    for (var _50_ = x = 0, _51_ = w; (_50_ <= _51_ ? x < w : x > w); (_50_ <= _51_ ? ++x : --x))
                    {
                        i = y * w + x
                        if (cimg32[i] !== p32[i])
                        {
                            if (x < mix)
                            {
                                mix = x
                            }
                            if (x > mx)
                            {
                                mx = x
                            }
                            if (y < miy)
                            {
                                miy = y
                            }
                            if (y > my)
                            {
                                my = y
                            }
                        }
                    }
                }
                if (mx === -1)
                {
                    mix = miy = mx = my = 0
                }
                if (evenCrd)
                {
                    if ((mix & 1) === 1)
                    {
                        mix--
                    }
                    if ((miy & 1) === 1)
                    {
                        miy--
                    }
                }
                sarea = (mx - mix + 1) * (my - miy + 1)
                if (sarea < tarea)
                {
                    tarea = sarea
                    tstp = it
                    nx = mix
                    ny = miy
                    nw = mx - mix + 1
                    nh = my - miy + 1
                }
            }
            pimg = new Uint8Array(bufs[j - 1 - tstp])
            if (tstp === 1)
            {
                frms[j - 1].dispose = 2
            }
            nimg = new Uint8Array(nw * nh * 4)
            copyTile(pimg,w,h,nimg,nw,nh,-nx,-ny,0)
            blend = (copyTile(cimg,w,h,nimg,nw,nh,-nx,-ny,3) ? 1 : 0)
            if (blend === 1)
            {
                prepareDiff(cimg,w,h,nimg,{x:nx,y:ny,width:nw,height:nh})
            }
            else
            {
                copyTile(cimg,w,h,nimg,nw,nh,-nx,-ny,0)
            }
        }
        else
        {
            nimg = cimg.slice(0)
        }
        frms.push({rect:{x:nx,y:ny,width:nw,height:nh},img:nimg,blend:blend,dispose:0})
    }
    if (alwaysBlend)
    {
        for (var _52_ = j = 0, _53_ = frms.length; (_52_ <= _53_ ? j < frms.length : j > frms.length); (_52_ <= _53_ ? ++j : --j))
        {
            frm = frms[j]
            if (frm.blend === 1)
            {
                continue
            }
            r0 = frm.rect
            r1 = frms[j - 1].rect
            miX = _k_.min(r0.x,r1.x)
            miY = _k_.min(r0.y,r1.y)
            maX = _k_.max(r0.x + r0.width,r1.x + r1.width)
            maY = _k_.max(r0.y + r0.height,r1.y + r1.height)
            r = {x:miX,y:miY,width:maX - miX,height:maY - miY}
            frms[j - 1].dispose = 1
            if (j - 1 !== 0)
            {
                updateFrame(bufs,w,h,frms,j - 1,r,evenCrd)
                updateFrame(bufs,w,h,frms,j,r,evenCrd)
            }
        }
    }
    area = 0
    if (bufs.length !== 1)
    {
        for (var _54_ = i = 0, _55_ = frms.length; (_54_ <= _55_ ? i < frms.length : i > frms.length); (_54_ <= _55_ ? ++i : --i))
        {
            frm = frms[i]
            area += frm.rect.width * frm.rect.height
        }
    }
    return frms
}

updateFrame = function (bufs, w, h, frms, i, r, evenCrd)
{
    var cc, cimg, cimg32, cx, cy, fr, j, mix, miy, mxx, mxy, nimg, pimg, pimg32, U32, U8, x, y

    U8 = Uint8Array
    U32 = Uint32Array
    pimg = new U8(bufs[i - 1])
    pimg32 = new U32(bufs[i - 1])
    nimg = ((i + 1 < bufs.length) ? new U8(bufs[i + 1]) : null)
    cimg = new U8(bufs[i])
    cimg32 = new U32(cimg.buffer)
    mix = w
    miy = h
    mxx = -1
    mxy = -1
    for (var _56_ = y = 0, _57_ = r.height; (_56_ <= _57_ ? y < r.height : y > r.height); (_56_ <= _57_ ? ++y : --y))
    {
        for (var _58_ = x = 0, _59_ = r.width; (_58_ <= _59_ ? x < r.width : x > r.width); (_58_ <= _59_ ? ++x : --x))
        {
            cx = r.x + x
            cy = r.y + y
            j = cy * w + cx
            cc = cimg32[j]
            if (cc === 0 || (frms[i - 1].dispose === 0 && pimg32[j] === cc && (nimg === null || nimg[j * 4 + 3] !== 0)))
            {
                true
            }
            else
            {
                if (cx < mix)
                {
                    mix = cx
                }
                if (cx > mxx)
                {
                    mxx = cx
                }
                if (cy < miy)
                {
                    miy = cy
                }
                if (cy > mxy)
                {
                    mxy = cy
                }
            }
        }
    }
    if (mxx === -1)
    {
        mix = miy = mxx = mxy = 0
    }
    if (evenCrd)
    {
        if ((mix & 1) === 1)
        {
            mix--
        }
        if ((miy & 1) === 1)
        {
            miy--
        }
    }
    r = {x:mix,y:miy,width:mxx - mix + 1,height:mxy - miy + 1}
    fr = frms[i]
    fr.rect = r
    fr.blend = 1
    fr.img = new Uint8Array(r.width * r.height * 4)
    if (frms[i - 1].dispose === 0)
    {
        copyTile(pimg,w,h,fr.img,r.width,r.height,-r.x,-r.y,0)
        return prepareDiff(cimg,w,h,fr.img,r)
    }
    else
    {
        return copyTile(cimg,w,h,fr.img,r.width,r.height,-r.x,-r.y,0)
    }
}

prepareDiff = function (cimg, w, h, nimg, rec)
{
    return copyTile(cimg,w,h,nimg,rec.width,rec.height,-rec.x,-rec.y,2)
}

filterZero = function (img, h, bpp, bpl, data, filter, levelZero)
{
    var fls, ftry, i, opts, ti, tsize, y

    fls = []
    ftry = [0,1,2,3,4]
    if (filter !== -1)
    {
        ftry = [filter]
    }
    else if (h * bpl > 500000 || bpp === 1)
    {
        ftry = [0]
    }
    if (levelZero)
    {
        opts = {level:0}
    }
    for (var _5a_ = i = 0, _5b_ = ftry.length; (_5a_ <= _5b_ ? i < ftry.length : i > ftry.length); (_5a_ <= _5b_ ? ++i : --i))
    {
        for (var _5c_ = y = 0, _5d_ = h; (_5c_ <= _5d_ ? y < h : y > h); (_5c_ <= _5d_ ? ++y : --y))
        {
            filterLine(data,img,y,bpl,bpp,ftry[i])
        }
        fls.push(zlib.deflateSync(data,opts))
    }
    tsize = 1e9
    for (var _5e_ = i = 0, _5f_ = fls.length; (_5e_ <= _5f_ ? i < fls.length : i > fls.length); (_5e_ <= _5f_ ? ++i : --i))
    {
        if (fls[i].length < tsize)
        {
            ti = i
            tsize = fls[i].length
        }
    }
    return fls[ti]
}

filterLine = function (data, img, y, bpl, bpp, type)
{
    var di, i, x

    i = y * bpl
    di = i + y
    data[di] = type
    di++
    if (type === 0)
    {
        if (bpl < 500)
        {
            for (var _60_ = x = 0, _61_ = bpl; (_60_ <= _61_ ? x < bpl : x > bpl); (_60_ <= _61_ ? ++x : --x))
            {
                data[di + x] = img[i + x]
            }
        }
        else
        {
            return data.set(new Uint8Array(img.buffer,i,bpl)(di))
        }
    }
    else if (type === 1)
    {
        for (var _62_ = x = 0, _63_ = bpp; (_62_ <= _63_ ? x < bpp : x > bpp); (_62_ <= _63_ ? ++x : --x))
        {
            data[di + x] = img[i + x]
        }
        for (var _64_ = x = bpp, _65_ = bpl; (_64_ <= _65_ ? x < bpl : x > bpl); (_64_ <= _65_ ? ++x : --x))
        {
            data[di + x] = (img[i + x] - img[i + x - bpp] + 256) & 255
        }
    }
    else if (y === 0)
    {
        for (var _66_ = x = 0, _67_ = bpp; (_66_ <= _67_ ? x < bpp : x > bpp); (_66_ <= _67_ ? ++x : --x))
        {
            data[di + x] = img[i + x]
        }
        if (type === 2)
        {
            for (var _68_ = x = bpp, _69_ = bpl; (_68_ <= _69_ ? x < bpl : x > bpl); (_68_ <= _69_ ? ++x : --x))
            {
                data[di + x] = img[i + x]
            }
        }
        if (type === 3)
        {
            for (var _6a_ = x = bpp, _6b_ = bpl; (_6a_ <= _6b_ ? x < bpl : x > bpl); (_6a_ <= _6b_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] - (img[i + x - bpp] >> 1) + 256) & 255
            }
        }
        if (type === 4)
        {
            for (var _6c_ = x = bpp, _6d_ = bpl; (_6c_ <= _6d_ ? x < bpl : x > bpl); (_6c_ <= _6d_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] - paeth(img[i + x - bpp],0,0) + 256) & 255
            }
        }
    }
    else
    {
        if (type === 2)
        {
            for (var _6e_ = x = 0, _6f_ = bpl; (_6e_ <= _6f_ ? x < bpl : x > bpl); (_6e_ <= _6f_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - img[i + x - bpl]) & 255
            }
        }
        if (type === 3)
        {
            for (var _70_ = x = 0, _71_ = bpp; (_70_ <= _71_ ? x < bpp : x > bpp); (_70_ <= _71_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - (img[i + x - bpl] >> 1)) & 255
            }
            for (var _72_ = x = bpp, _73_ = bpl; (_72_ <= _73_ ? x < bpl : x > bpl); (_72_ <= _73_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - ((img[i + x - bpl] + img[i + x - bpp]) >> 1)) & 255
            }
        }
        if (type === 4)
        {
            for (var _74_ = x = 0, _75_ = bpp; (_74_ <= _75_ ? x < bpp : x > bpp); (_74_ <= _75_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - paeth(0,img[i + x - bpl],0)) & 255
            }
            for (var _76_ = x = bpp, _77_ = bpl; (_76_ <= _77_ ? x < bpl : x > bpl); (_76_ <= _77_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - paeth(img[i + x - bpp],img[i + x - bpl],img[i + x - bpp - bpl])) & 255
            }
        }
    }
}

quantize = function (abuf, ps, doKmeans)
{
    var a, b, ce, cl32, clr8, g, i, inds, K, KD, le, leafs, len, nd, r, root, sb, tb, tb32

    sb = new Uint8Array(abuf)
    tb = sb.slice(0)
    tb32 = new Uint32Array(tb.buffer)
    KD = getKDtree(tb,ps)
    root = KD[0]
    leafs = KD[1]
    K = leafs.length
    cl32 = new Uint32Array(K)
    clr8 = new Uint8Array(cl32.buffer)
    for (var _78_ = i = 0, _79_ = K; (_78_ <= _79_ ? i < K : i > K); (_78_ <= _79_ ? ++i : --i))
    {
        cl32[i] = leafs[i].est.rgba
    }
    len = sb.length
    inds = new Uint8Array(len >> 2)
    if (K <= 60)
    {
        findNearest(sb,inds,clr8)
        remap(inds,tb32,cl32)
    }
    else if (sb.length < 32e6)
    {
        i = 0
        while (i < len)
        {
            r = sb[i] * (1 / 255)
            g = sb[i + 1] * (1 / 255)
            b = sb[i + 2] * (1 / 255)
            a = sb[i + 3] * (1 / 255)
            nd = getNearest(root,r,g,b,a)
            inds[i >> 2] = nd.ind
            tb32[i >> 2] = nd.est.rgba
            i += 4
        }
    }
    else
    {
        i = 0
        while (i < len)
        {
            r = sb[i] * (1 / 255)
            g = sb[i + 1] * (1 / 255)
            b = sb[i + 2] * (1 / 255)
            a = sb[i + 3] * (1 / 255)
            nd = root
            while (nd.left)
            {
                nd = ((planeDst(nd.est,r,g,b,a) <= 0) ? nd.left : nd.right)
            }
            inds[i >> 2] = nd.ind
            tb32[i >> 2] = nd.est.rgba
            i += 4
        }
    }
    if (doKmeans || sb.length * K < 4e7)
    {
        le = 1e9
        for (i = 0; i < 10; i++)
        {
            ce = kmeans(sb,inds,clr8)
            if (ce / le > 0.997)
            {
                break
            }
            le = ce
        }
        for (var _7a_ = i = 0, _7b_ = K; (_7a_ <= _7b_ ? i < K : i > K); (_7a_ <= _7b_ ? ++i : --i))
        {
            leafs[i].est.rgba = cl32[i]
        }
        remap(inds,tb32,cl32)
    }
    return {abuf:tb.buffer,inds:inds,plte:leafs}
}

remap = function (inds, tb32, pl32)
{
    var i

    for (var _7c_ = i = 0, _7d_ = inds.length; (_7c_ <= _7d_ ? i < inds.length : i > inds.length); (_7c_ <= _7d_ ? ++i : --i))
    {
        tb32[i] = pl32[inds[i]]
    }
}

kmeans = function (sb, inds, plte)
{
    updatePalette(sb,inds,plte)
    return findNearest(sb,inds,plte)
}

updatePalette = function (sb, inds, plte)
{
    var cnts, i, ind, K, qi, sums

    K = plte.length >>> 2
    sums = new Uint32Array(K * 4)
    cnts = new Uint32Array(K)
    i = 0
    while (i < sb.length)
    {
        ind = inds[i >>> 2]
        qi = ind * 4
        cnts[ind]++
        sums[qi] += sb[i]
        sums[qi + 1] += sb[i + 1]
        sums[qi + 2] += sb[i + 2]
        sums[qi + 3] += sb[i + 3]
        i += 4
    }
    for (var _7e_ = i = 0, _7f_ = plte.length; (_7e_ <= _7f_ ? i < plte.length : i > plte.length); (_7e_ <= _7f_ ? ++i : --i))
    {
        plte[i] = Math.round(sums[i] / cnts[i >>> 2])
    }
}

findNearest = function (sb, inds, plte)
{
    var a, b, da, db, dg, dr, err, g, i, j, K, nd, qi, qj, r, te, terr, ti

    terr = 0
    K = plte.length >>> 2
    nd = []
    for (var _80_ = i = 0, _81_ = K; (_80_ <= _81_ ? i < K : i > K); (_80_ <= _81_ ? ++i : --i))
    {
        qi = i * 4
        r = plte[qi]
        g = plte[qi + 1]
        b = plte[qi + 2]
        a = plte[qi + 3]
        ti = 0
        te = 1e9
        for (var _82_ = j = 0, _83_ = K; (_82_ <= _83_ ? j < K : j > K); (_82_ <= _83_ ? ++j : --j))
        {
            if (i === j)
            {
                continue
            }
            qj = j * 4
            dr = r - plte[qj]
            dg = g - plte[qj + 1]
            db = b - plte[qj + 2]
            da = a - plte[qj + 3]
            err = dr * dr + dg * dg + db * db + da * da
            if (err < te)
            {
                te = err
                ti = j
            }
        }
        nd[i] = Math.sqrt(te) * 0.5
        nd[i] = nd[i] * nd[i]
    }
    i = 0
    while (i < sb.length)
    {
        r = sb[i]
        g = sb[i + 1]
        b = sb[i + 2]
        a = sb[i + 3]
        ti = inds[i >>> 2]
        qi = ti * 4
        dr = r - plte[qi]
        dg = g - plte[qi + 1]
        db = b - plte[qi + 2]
        da = a - plte[qi + 3]
        te = dr * dr + dg * dg + db * db + da * da
        if (te > nd[ti])
        {
            for (var _84_ = j = 0, _85_ = K; (_84_ <= _85_ ? j < K : j > K); (_84_ <= _85_ ? ++j : --j))
            {
                qi = j * 4
                dr = r - plte[qi]
                dg = g - plte[qi + 1]
                db = b - plte[qi + 2]
                da = a - plte[qi + 3]
                err = dr * dr + dg * dg + db * db + da * da
                if (err < te)
                {
                    te = err
                    ti = j
                    if (te < nd[j])
                    {
                        break
                    }
                }
            }
        }
        inds[i >>> 2] = ti
        terr += te
        i += 4
    }
    return terr / (sb.length >>> 2)
}

getKDtree = function (nimg, ps, err)
{
    var i, leafs, ln, maxL, mi, nimg32, node, rn, root, s0, s0wrong

    err = (err != null ? err : 0.0001)
    nimg32 = new Uint32Array(nimg.buffer)
    root = {i0:0,i1:nimg.length,bst:null,est:null,tdst:0,left:null,right:null}
    root.bst = stats(nimg,root.i0,root.i1)
    root.est = estats(root.bst)
    leafs = [root]
    while (leafs.length < ps)
    {
        maxL = 0
        mi = 0
        for (var _86_ = i = 0, _87_ = leafs.length; (_86_ <= _87_ ? i < leafs.length : i > leafs.length); (_86_ <= _87_ ? ++i : --i))
        {
            if (leafs[i].est.L > maxL)
            {
                maxL = leafs[i].est.L
                mi = i
            }
        }
        if (maxL < err)
        {
            break
        }
        node = leafs[mi]
        s0 = splitPixels(nimg,nimg32,node.i0,node.i1,node.est.e,node.est.eMq255)
        s0wrong = node.i0 >= s0 || node.i1 <= s0
        if (s0wrong)
        {
            node.est.L = 0
            continue
        }
        ln = {i0:node.i0,i1:s0,bst:null,est:null,tdst:0,left:null,right:null}
        ln.bst = stats(nimg,ln.i0,ln.i1)
        ln.est = estats(ln.bst)
        rn = {i0:s0,i1:node.i1,bst:null,est:null,tdst:0,left:null,right:null}
        rn.bst = {R:[],m:[],N:node.bst.N - ln.bst.N}
        for (i = 0; i < 16; i++)
        {
            rn.bst.R[i] = node.bst.R[i] - ln.bst.R[i]
        }
        for (i = 0; i < 4; i++)
        {
            rn.bst.m[i] = node.bst.m[i] - ln.bst.m[i]
        }
        rn.est = estats(rn.bst)
        node.left = ln
        node.right = rn
        leafs[mi] = ln
        leafs.push(rn)
    }
    leafs.sort(function (a, b)
    {
        return b.bst.N - a.bst.N
    })
    for (var _88_ = i = 0, _89_ = leafs.length; (_88_ <= _89_ ? i < leafs.length : i > leafs.length); (_88_ <= _89_ ? ++i : --i))
    {
        leafs[i].ind = i
    }
    return [root,leafs]
}

getNearest = function (nd, r, g, b, a)
{
    var ln, node0, node1, pd, rn

    if (nd.left === null)
    {
        nd.tdst = dist(nd.est.q,r,g,b,a)
        return nd
    }
    pd = planeDst(nd.est,r,g,b,a)
    node0 = nd.left
    node1 = nd.right
    if (pd > 0)
    {
        node0 = nd.right
        node1 = nd.left
    }
    ln = getNearest(node0,r,g,b,a)
    if (ln.tdst <= pd * pd)
    {
        return ln
    }
    rn = getNearest(node1,r,g,b,a)
    return ((rn.tdst < ln.tdst) ? rn : ln)
}

planeDst = function (est, r, g, b, a)
{
    var e

    e = est.e
    return e[0] * r + e[1] * g + e[2] * b + e[3] * a - est.eMq
}

dist = function (q, r, g, b, a)
{
    var d0, d1, d2, d3

    d0 = r - q[0]
    d1 = g - q[1]
    d2 = b - q[2]
    d3 = a - q[3]
    return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3
}

splitPixels = function (nimg, nimg32, i0, i1, e, eMq)
{
    var shfs, t

    i1 -= 4
    shfs = 0
    while (i0 < i1)
    {
        while (vecDot(nimg,i0,e) <= eMq)
        {
            i0 += 4
        }
        while (vecDot(nimg,i1,e) > eMq)
        {
            i1 -= 4
        }
        if (i0 >= i1)
        {
            break
        }
        t = nimg32[i0 >> 2]
        nimg32[i0 >> 2] = nimg32[i1 >> 2]
        nimg32[i1 >> 2] = t
        i0 += 4
        i1 -= 4
    }
    while (vecDot(nimg,i0,e) > eMq)
    {
        i0 -= 4
    }
    return i0 + 4
}

vecDot = function (nimg, i, e)
{
    return nimg[i] * e[0] + nimg[i + 1] * e[1] + nimg[i + 2] * e[2] + nimg[i + 3] * e[3]
}

stats = function (nimg, i0, i1)
{
    var a, b, g, i, m, r, R

    R = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    m = [0,0,0,0]
    N = (i1 - i0) >> 2
    i = i0
    while (i < i1)
    {
        r = nimg[i] * (1 / 255)
        g = nimg[i + 1] * (1 / 255)
        b = nimg[i + 2] * (1 / 255)
        a = nimg[i + 3] * (1 / 255)
        m[0] += r
        m[1] += g
        m[2] += b
        m[3] += a
        R[0] += r * r
        R[1] += r * g
        R[2] += r * b
        R[3] += r * a
        R[5] += g * g
        R[6] += g * b
        R[7] += g * a
        R[10] += b * b
        R[11] += b * a
        R[15] += a * a
        i += 4
    }
    R[4] = R[1]
    R[8] = R[2]
    R[9] = R[6]
    R[12] = R[3]
    R[13] = R[7]
    R[14] = R[11]
    return {R:R,m:m,N:N}
}

estats = function (stats)
{
    var A, b, eMq255, i, iN, m, M, m0, m1, m2, m3, mi, q, R, Rj, tmi

    R = stats.R
    m = stats.m
    N = stats.N
    m0 = m[0]
    m1 = m[1]
    m2 = m[2]
    m3 = m[3]
    iN = ((N === 0 ? 0 : 1 / N))
    Rj = [R[0] - m0 * m0 * iN,R[1] - m0 * m1 * iN,R[2] - m0 * m2 * iN,R[3] - m0 * m3 * iN,R[4] - m1 * m0 * iN,R[5] - m1 * m1 * iN,R[6] - m1 * m2 * iN,R[7] - m1 * m3 * iN,R[8] - m2 * m0 * iN,R[9] - m2 * m1 * iN,R[10] - m2 * m2 * iN,R[11] - m2 * m3 * iN,R[12] - m3 * m0 * iN,R[13] - m3 * m1 * iN,R[14] - m3 * m2 * iN,R[15] - m3 * m3 * iN]
    A = Rj
    M = M4
    b = [Math.random(),Math.random(),Math.random(),Math.random()]
    mi = tmi = 0
    if (N !== 0)
    {
        for (i = 0; i < 16; i++)
        {
            b = M.multVec(A,b)
            tmi = Math.sqrt(M.dot(b,b))
            b = M.sml(1 / tmi,b)
            if (i !== 0 && Math.abs(tmi - mi) < 1e-9)
            {
                break
            }
            mi = tmi
        }
    }
    q = [m0 * iN,m1 * iN,m2 * iN,m3 * iN]
    eMq255 = M.dot(M.sml(255,q),b)
    return {Cov:Rj,q:q,e:b,L:mi,eMq255:eMq255,eMq:M.dot(b,q),rgba:(((Math.round(255 * q[3]) << 24) | (Math.round(255 * q[2]) << 16) | (Math.round(255 * q[1]) << 8) | (Math.round(255 * q[0]) << 0)) >>> 0)}
}
M4 = {multVec:function (m, v)
{
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]]
},dot:function (x, y)
{
    return x[0] * y[0] + x[1] * y[1] + x[2] * y[2] + x[3] * y[3]
},sml:function (a, y)
{
    return [a * y[0],a * y[1],a * y[2],a * y[3]]
}}

concatRGBA = function (bufs)
{
    var a, b, g, i, il, img, j, nimg, noff, r, tlen

    tlen = 0
    for (var _8a_ = i = 0, _8b_ = bufs.length; (_8a_ <= _8b_ ? i < bufs.length : i > bufs.length); (_8a_ <= _8b_ ? ++i : --i))
    {
        tlen += bufs[i].byteLength
    }
    nimg = new Uint8Array(tlen)
    noff = 0
    for (var _8c_ = i = 0, _8d_ = bufs.length; (_8c_ <= _8d_ ? i < bufs.length : i > bufs.length); (_8c_ <= _8d_ ? ++i : --i))
    {
        img = new Uint8Array(bufs[i])
        il = img.length
        j = 0
        while (j < il)
        {
            r = img[j]
            g = img[j + 1]
            b = img[j + 2]
            a = img[j + 3]
            if (a === 0)
            {
                r = g = b = 0
            }
            nimg[noff + j] = r
            nimg[noff + j + 1] = g
            nimg[noff + j + 2] = b
            nimg[noff + j + 3] = a
            j += 4
        }
        noff += il
    }
    return nimg.buffer
}
export default {encode:encode};