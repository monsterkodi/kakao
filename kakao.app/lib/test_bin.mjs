import { pug, stylus } from './bin.mjs'

var css = stylus(`
fun()
  border 1px
#main
  fun()
`)

console.log(css)

var html = pug(`
doctype html
html(lang="en")
    head
        meta(charset='utf-8')
        title konrad
        link(rel='stylesheet' href='css/style.css' type='text/css')
        link(rel='stylesheet' href='css/dark.css'  type='text/css' id='style-link')
    body
        #titlebar
        #main(tabindex="0")
    script.
        require('./window')
`)

console.log(html)
