if (process.stdin.isTTY)
{
    process.stdin.setRawMode(true)
}
process.stdout.write('\x1b[?1000h')
process.stdout.write('\x1b[?1002h')
process.stdout.write('\x1b[?1003h')
process.stdout.write('\x1b[?1004h')
process.stdout.write('\x1b[?1006h')
process.stdout.write('\x1b[?1049h')
process.stdout.write('\x1b[?2004h')
process.stdout.write('\x1b[>1s')
process.stdout.write('\x1b[>1u')
process.stdout.write('\x1b[=31;1u')
process.stdout.write('\x1b[14t')
process.stdin.on('data',data,function ()
{
    console.log('data',data.slice(1))
})