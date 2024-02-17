// monsterkodi/kode 0.249.0

var _k_

var POST, poster

POST = "__POST__"
class Poster extends EventTarget
{
    constructor ()
    {
        super()
    
        this.dispose = this.dispose.bind(this)
        this.addEventListener(POST,this.onPostEvent)
        window.addEventListener('beforeunload',this.dispose)
    }

    onPostEvent (event)
    {
        var out

        out = new Event(event.event)
        out.args = event.args
        out.senderID = event.senderID
        out.receivers = event.receivers
        return this.dispatchEvent(out)
    }

    dispose ()
    {
        this.removeEventListener(POST,this.onPostEvent)
        return window.removeEventListener('beforeunload',this.dispose)
    }

    toAll (type, args)
    {
        return this.send('toAll',type,args)
    }

    toWins (type, args)
    {
        return this.send('toWins',type,args)
    }

    toMain (type, args)
    {
        return this.send('toMain',type,args)
    }

    send (receivers, type, args, id)
    {
        var event

        event = new Event(POST)
        event.event = type
        event.args = args
        event.senderID = id
        event.receivers = receivers
        return this.dispatchEvent(event)
    }
}

poster = new Poster
export default {poster:poster,emit:function (event, ...args)
{
    return poster.toAll(event,args)
},on:function (event, cb)
{
    return poster.addEventListener(event,function (e)
    {
        return cb.apply(cb,e.args)
    })
}};