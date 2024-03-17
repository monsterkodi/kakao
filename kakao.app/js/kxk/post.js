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
        return this.dispatchEvent(out)
    }

    dispose ()
    {
        this.removeEventListener(POST,this.onPostEvent)
        return window.removeEventListener('beforeunload',this.dispose)
    }

    post (event, args)
    {
        var e

        e = new Event(POST)
        e.event = event
        e.args = args
        return this.dispatchEvent(e)
    }
}

poster = new Poster
export default {poster:poster,emit:function (event, ...args)
{
    return poster.post(event,args)
},toWins:function (event, ...args)
{
    return kakao.send('window.post',event,args)
},on:function (event, cb)
{
    return poster.addEventListener(event,function (e)
    {
        return cb.apply(cb,e.args)
    })
},removeListener:function (event, cb)
{
    return poster.removeEventListener(event,cb)
}}