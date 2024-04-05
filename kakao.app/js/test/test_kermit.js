var toExport = {}
var _k_

import kermit from "../kxk/kermit.js"

toExport["kermit"] = function ()
{
    section("git log", function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,`commit 5255e93531d91abee2583fded9c13559f2445489
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Thu Apr 4 00:15:12 2024 +0200

    misc

M   kakao.app/kode/ko/tools/Git.kode

commit 85cfa741ce4e17f142c06d02a857b6646a26d34a
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Wed Apr 3 01:10:28 2024 +0200

    git status

M   kakao.app/kode/ko/tools/Git.kode

commit 2e499f993f76a86d6fb1bf80d7a00283c0a30d5c
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Tue Apr 2 23:18:40 2024 +0200`),[{commit:'5255e93531d91abee2583fded9c13559f2445489',author:'monsterkodi <monsterkodi@gmx.net>',date:'Thu Apr 4 00:15:12 2024 +0200',msg:'misc',files:[{type:'M',path:'kakao.app/kode/ko/tools/Git.kode'}]},{commit:'85cfa741ce4e17f142c06d02a857b6646a26d34a',author:'monsterkodi <monsterkodi@gmx.net>',date:'Wed Apr 3 01:10:28 2024 +0200',msg:'git status',files:[{type:'M',path:'kakao.app/kode/ko/tools/Git.kode'}]}])
    })
}
toExport["kermit"]._section_ = true
toExport._test_ = true
export default toExport
