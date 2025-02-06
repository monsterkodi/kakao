var logfile

import fs from "fs"


logfile = (function ()
{
    function logfile ()
    {
        this.stream = fs.createWriteStream('ked.log',{flags:'a',autoClose:false})
        global.lf = (function (...args)
        {
            return this.write(args.map(function (a)
            {
                return `${a}`
            }).join(' '))
        }).bind(this)
    }

    logfile.prototype["write"] = function (txt)
    {
        if (this.stream.closed || !this.stream.writable)
        {
            return
        }
        return this.stream.write(txt + '\n')
    }

    logfile.prototype["close"] = function (cb)
    {
        this.stream.end('◂◂◂')
        return this.stream.close(cb)
    }

    return logfile
})()

export default logfile;