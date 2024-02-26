// monsterkodi/kode 0.256.0

var _k_

var homedir, os

homedir = ''
import('os')
.
then
(function (os)
{
    return homedir = os.homedir()
})

os = (function ()
{
    function os ()
    {}

    os["homedir"] = function ()
    {
        return homedir
    }

    os["platform"] = 'Darwin'
    os["isMac"] = os.platform === 'Darwin'
    return os
})()

export default os;