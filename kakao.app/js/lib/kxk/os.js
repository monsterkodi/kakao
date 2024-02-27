// monsterkodi/kode 0.256.0

var _k_

class OS
{
    static loaded = false

    static platform = 'Darwin'

    static isMac = true

    static homedir = null
}

try
{
    ;(async function ()
    {
        var os

        os = await import('os')
        OS.homedir = os.homedir()
        OS.platform = os.platform()
        OS.isMac = OS.platform === 'Darwin'
        return OS.loaded = true
    })()
}
catch (err)
{
    console.error(err)
    OS.loaded = 'not available!'
    err
}
export default OS;