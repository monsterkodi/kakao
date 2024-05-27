var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var R_DISK, R_LOAD, R_MEM, R_NET, SysDish

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let kermit = kxk.kermit
let sleep = kxk.sleep
let win = kxk.win
let deg2rad = kxk.deg2rad
let elem = kxk.elem
let post = kxk.post
let $ = kxk.$

import utils from "./utils.js"

R_DISK = 50
R_NET = 46
R_LOAD = 42
R_MEM = 20
class digger
{
    static ints (str, ...ints)
    {
        var idx, int, r, val

        r = {}
        var list = _k_.list(ints)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            int = list[_a_]
            idx = str.search(/\d+/)
            str = str.slice(idx)
            val = parseInt(str)
            r[int] = val
            idx = str.search(/[^\d]/)
            str = str.slice(idx)
        }
        return r
    }

    static floats (str, ...floats)
    {
        var float, idx, r, val

        r = {}
        var list = _k_.list(floats)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            float = list[_a_]
            idx = str.search(/\d+\.\d+/)
            str = str.slice(idx)
            val = parseFloat(str)
            r[float] = val
            idx = str.search(/[^\d\.]/)
            str = str.slice(idx)
        }
        return r
    }
}


SysDish = (function ()
{
    function SysDish ()
    {
        this["animDish"] = this["animDish"].bind(this)
        this.dataDelay = 500
        this.animFrames = 30
        this.div = elem({class:"sysmon",parent:document.body})
        this.dskrOld = this.dskrNow = this.dskrNew = 0
        this.dskwOld = this.dskwNow = this.dskwNew = 0
        this.netrOld = this.netrNow = this.netrNew = 0
        this.nettOld = this.nettNow = this.nettNew = 0
        this.sysOld = this.sysNow = this.sysNew = 0
        this.usrOld = this.usrNow = this.usrNew = 0
        this.memuOld = this.memuNow = this.memuNew = 0
        this.memaOld = this.memaNow = this.memaNew = 0
        this.netIn = this.maxNetIn = 0
        this.netOut = this.maxNetOut = 0
        this.dskIn = this.maxDskIn = 0
        this.dskOut = this.maxDskOut = 0
        this.data = {cpu:{sys:0,usr:0},mem:{used:0,active:0},dsk:{in:0,out:0},net:{in:0,out:0}}
        this.initDish()
    }

    SysDish.prototype["initDish"] = function ()
    {
        var svg

        this.div.innerHTML = ''
        svg = utils.svg(100,100,'dish')
        this.div.appendChild(svg)
        utils.circle(R_DISK,'sysdish_disk_bgr bgr',svg)
        this.dskrPie = utils.pie('sysdish_disk_read',svg)
        this.dskwPie = utils.pie('sysdish_disk_write',svg)
        utils.circle(R_NET,'sysdish_net_bgr bgr',svg)
        this.netrPie = utils.pie('sysdish_net_recv',svg)
        this.nettPie = utils.pie('sysdish_net_send',svg)
        utils.circle(R_LOAD,'sysdish_load_bgr bgr',svg)
        this.usrPie = utils.pie('sysdish_load_usr',svg)
        this.sysPie = utils.pie('sysdish_load_sys',svg)
        utils.circle(R_MEM,'sysdish_mem_bgr bgr',svg)
        this.memuPie = utils.pie('sysdish_mem_used',svg)
        return this.memaPie = utils.pie('sysdish_mem_active',svg)
    }

    SysDish.prototype["onWindowWillShow"] = function ()
    {
        this.updateDish()
        requestAnimationFrame(this.animDish)
        return this.requestData()
    }

    SysDish.prototype["requestData"] = async function ()
    {
        var active, cpu, dskstr, gb, ibytes, idiff, idx, linesplit, netlines, netstr, obytes, odiff, pages, pgb, top, toplines, total, used, vmstat

        vmstat = await kakao('app.sh','/usr/bin/vm_stat',{arg:'',cwd:kakao.bundle.path})
        pages = digger.ints(vmstat,'pagesize','free','active','inactive','speculative','throttled','wired','purgeable','faults','copy','zero','reactivated','purged','filebacked','anonymous','compressed','occupied')
        pages.app = pages.anonymous - pages.purgeable
        active = pages.app + pages.wired + pages.occupied
        used = active + pages.filebacked + pages.purgeable
        total = pages.free + pages.active + pages.inactive + pages.wired + pages.occupied + pages.throttled + pages.speculative
        gb = 1 / (1024 * 1024 * 1024)
        pgb = pages.pagesize * gb
        this.data.mem.active = active / total
        this.data.mem.used = used / total
        top = await kakao('app.sh','/usr/bin/top',{arg:"-l 1 -s 0 -n 0"})
        toplines = top.split('\n')
        cpu = digger.floats(toplines[3],'user','sys','idle')
        this.data.cpu.usr = cpu.user / 100
        this.data.cpu.sys = cpu.sys / 100
        netstr = await kakao('app.sh','/usr/sbin/netstat',{arg:'-bdI en0'})
        netlines = netstr.split('\n')
        linesplit = netlines[3].split(/\s+/g)
        ibytes = parseInt(linesplit[6])
        obytes = parseInt(linesplit[9])
        if (this.netIn > 0)
        {
            idiff = ibytes - this.netIn
            this.maxNetIn = _k_.max(this.maxNetIn,idiff)
            this.data.net.in = idiff / this.maxNetIn
        }
        if (this.netOut > 0)
        {
            odiff = obytes - this.netOut
            this.maxNetOut = _k_.max(this.maxNetOut,odiff)
            this.data.net.out = odiff / this.maxNetOut
        }
        this.netIn = ibytes
        this.netOut = obytes
        dskstr = await kakao('app.sh','/usr/sbin/ioreg',{arg:'-c IOBlockStorageDriver -k Statistics -r -w0'})
        if (0 < (idx = dskstr.indexOf('"Bytes (Read)"=')))
        {
            dskstr = dskstr.slice(idx + 15)
            idx = dskstr.indexOf('\n')
            dskstr = dskstr.slice(0, typeof idx === 'number' ? idx+1 : Infinity)
            ibytes = parseInt(dskstr)
            idx = dskstr.indexOf('"Bytes (Write)"=')
            dskstr = dskstr.slice(idx + 16)
            obytes = parseInt(dskstr)
            if (this.dskIn > 0)
            {
                idiff = ibytes - this.dskIn
                this.maxDskIn = _k_.max(this.maxDskIn,idiff)
                this.data.dsk.in = idiff / this.maxDskIn
            }
            if (this.dskOut > 0)
            {
                odiff = obytes - this.dskOut
                this.maxDskOut = _k_.max(this.maxDskOut,odiff)
                this.data.dsk.out = odiff / this.maxDskOut
            }
            this.dskIn = ibytes
            this.dskOut = obytes
        }
        this.updateDish()
        await sleep(this.dataDelay)
        return this.requestData()
    }

    SysDish.prototype["pie180"] = function (pie, radius, angle, start = 0)
    {
        var ex, ey, sx, sy

        angle = _k_.clamp(0,180,angle)
        sx = radius * Math.sin(deg2rad(start + angle))
        sy = -radius * Math.cos(deg2rad(start + angle))
        ex = radius * Math.sin(deg2rad(start))
        ey = -radius * Math.cos(deg2rad(start))
        return pie.setAttribute('d',`M 0 0 L ${sx} ${sy} A ${radius} ${radius} ${start} 0 0 ${ex} ${ey} z`)
    }

    SysDish.prototype["pie360"] = function (pie, radius, angle)
    {
        var ex, ey, f, sx, sy

        angle = _k_.clamp(0,359,angle)
        sx = radius * Math.sin(deg2rad(angle))
        sy = -radius * Math.cos(deg2rad(angle))
        ex = 0
        ey = -radius
        f = angle <= 180 && '0 0' || '1 0'
        return pie.setAttribute('d',`M 0 0 L ${sx} ${sy} A ${radius} ${radius} 0 ${f} ${ex} ${ey} z`)
    }

    SysDish.prototype["updateDish"] = function ()
    {
        this.animCount = 0
        this.dskrOld = this.dskrNow
        this.dskwOld = this.dskwNow
        this.dskrNew = 180 * this.data.dsk.in
        this.dskwNew = 180 * this.data.dsk.out
        this.netrOld = this.netrNow
        this.nettOld = this.nettNow
        this.netrNew = 180 * this.data.net.in
        this.nettNew = 180 * this.data.net.out
        this.sysOld = this.sysNow
        this.usrOld = this.usrNow
        this.sysNew = 360 * this.data.cpu.sys
        this.usrNew = 360 * (this.data.cpu.sys + this.data.cpu.usr)
        this.memuOld = this.memuNow
        this.memaOld = this.memaNow
        this.memuNew = 360 * this.data.mem.used
        return this.memaNew = 360 * this.data.mem.active
    }

    SysDish.prototype["animDish"] = function ()
    {
        var steps

        steps = this.animFrames
        this.animCount += 1
        if (this.animCount <= steps)
        {
            this.dskrNow += (this.dskrNew - this.dskrOld) / steps
            this.dskwNow += (this.dskwNew - this.dskwOld) / steps
            this.pie180(this.dskrPie,R_DISK,this.dskrNow)
            this.pie180(this.dskwPie,R_DISK,this.dskwNow,180)
            this.netrNow += (this.netrNew - this.netrOld) / steps
            this.nettNow += (this.nettNew - this.nettOld) / steps
            this.pie180(this.netrPie,R_NET,this.netrNow)
            this.pie180(this.nettPie,R_NET,this.nettNow,180)
            this.sysNow += (this.sysNew - this.sysOld) / steps
            this.usrNow += (this.usrNew - this.usrOld) / steps
            this.pie360(this.usrPie,R_LOAD,this.usrNow)
            this.pie360(this.sysPie,R_LOAD,this.sysNow)
            this.memuNow += (this.memuNew - this.memuOld) / steps
            this.memaNow += (this.memaNew - this.memaOld) / steps
            this.pie360(this.memuPie,R_MEM,this.memuNow)
            this.pie360(this.memaPie,R_MEM,this.memaNow)
        }
        return requestAnimationFrame(this.animDish)
    }

    return SysDish
})()

export default SysDish;