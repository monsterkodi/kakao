var logfile

import fs from "fs"


logfile = (function ()
{
    function logfile ()
    {
        this.stream = fs.createWriteStream("log.txt",{flags:'a'})
    }

    logfile.prototype["write"] = function (txt)
    {
        return this.stream.write(txt + '\n')
    }

    return logfile
})()

export default logfile;