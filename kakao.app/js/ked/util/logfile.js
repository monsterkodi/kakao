var logfile

import fs from "fs"


logfile = (function ()
{
    function logfile ()
    {
        this.stream = fs.createWriteStream('ked.log',{flags:'a'})
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
        return this.stream.write(txt + '\n')
    }

    return logfile
})()

export default logfile;