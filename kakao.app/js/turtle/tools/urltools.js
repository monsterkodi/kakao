var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var containsLink, extractDomain, extractSite, re, shortenLink, toplevelDomains

re = /(^|\s|(?:http[s]?:\/\/))(?:[\w-]+\.)+\w[\w-]+(?::[1-9]\d+)?(?:\/[\w\.-~]*)*[\?\w\d\+\-\.,;=&\/#%\$]*(?:\s|$)/

extractSite = function (str)
{
    var r, s

    r = /(^|\s|(?:http[s]?:\/\/))((?:[\w-]+\.)+\w[\w-]+)(?::[1-9]\d+)?(?:\/[\w\.-~]*)*[\?\w\d\+\-\.,;=&\/#%\$]*(?:\s|$)/
    s = str.match(r)[2]
    if (s.startsWith('www.'))
    {
        s = s.substr(4)
    }
    return s
}

containsLink = function (str)
{
    return str.search(re) >= 0
}

shortenLink = function (str, len)
{
    var host, s

    len = len || 10
    if (((s = str.indexOf('://')) > -1))
    {
        str = str.substr(s + 3)
    }
    if ((str.indexOf('www.') === 0))
    {
        str = str.substr(4)
    }
    if (((s = str.lastIndexOf('?')) > -1))
    {
        str = str.substr(0,s)
    }
    if (((s = str.lastIndexOf('.htm')) > -1))
    {
        str = str.substr(0,s)
    }
    if (((s = str.lastIndexOf('/')) === str.length - 1))
    {
        str = str.substr(0,s)
    }
    if ((str.length > len))
    {
        s = str.split('/')
        host = s.splice(0,1)[0].split('.')
        str = [host[host.length - 2]].concat(s).join('/')
    }
    if ((str.length > len))
    {
        s = str.split('/')
        if ((s.length > 2))
        {
            str = s[0] + "..." + s[s.length - 1]
        }
    }
    return str
}
toplevelDomains = ['abb','abbott','abogado','ac','academy','accenture','accountant','accountants','active','actor','ad','ads','adult','ae','aero','af','afl','ag','agency','ai','aig','airforce','al','allfinanz','alsace','am','amsterdam','an','android','ao','apartments','aq','aquarelle','ar','archi','army','arpa','as','asia','associates','at','attorney','au','auction','audio','auto','autos','aw','ax','axa','az','azure','ba','band','bank','bar','barclaycard','barclays','bargains','bauhaus','bayern','bb','bbc','bbva','bd','be','beer','berlin','best','bf','bg','bh','bharti','bi','bible','bid','bike','bing','bingo','bio','biz','bj','bl','black','blackfriday','bloomberg','blue','bm','bmw','bn','bnpparibas','bo','boats','bond','boo','boutique','bq','br','bridgestone','broker','brother','brussels','bs','bt','budapest','build','builders','business','buzz','bv','bw','by','bz','bzh','ca','cab','cafe','cal','camera','camp','cancerresearch','canon','capetown','capital','caravan','cards','care','career','careers','cars','cartier','casa','cash','casino','cat','catering','cbn','cc','cd','center','ceo','cern','cf','cfa','cfd','cg','ch','channel','chat','cheap','chloe','christmas','chrome','church','ci','cisco','citic','city','ck','cl','claims','cleaning','click','clinic','clothing','club','cm','cn','co','coach','codes','coffee','college','cologne','com','community','company','computer','condos','construction','consulting','contractors','cooking','cool','coop','corsica','country','coupons','courses','cr','credit','creditcard','cricket','crs','cruises','cu','cuisinella','cv','cw','cx','cy','cymru','cyou','cz','dabur','dad','dance','date','dating','datsun','day','dclk','de','deals','degree','delivery','democrat','dental','dentist','desi','design','dev','diamonds','diet','digital','direct','directory','discount','dj','dk','dm','dnp','do','docs','dog','doha','domains','doosan','download','durban','dvag','dz','earth','eat','ec','edu','education','ee','eg','eh','email','emerck','energy','engineer','engineering','enterprises','epson','equipment','er','erni','es','esq','estate','et','eu','eurovision','eus','events','everbank','exchange','expert','exposed','express','fail','faith','fan','fans','farm','fashion','feedback','fi','film','finance','financial','firmdale','fish','fishing','fit','fitness','fj','fk','flights','florist','flowers','flsmidth','fly','fm','fo','foo','football','forex','forsale','foundation','fr','frl','frogans','fund','furniture','futbol','fyi','ga','gal','gallery','garden','gb','gbiz','gd','gdn','ge','gent','gf','gg','ggee','gh','gi','gift','gifts','gives','gl','glass','gle','global','globo','gm','gmail','gmo','gmx','gn','gold','goldpoint','golf','goo','goog','google','gop','gov','gp','gq','gr','graphics','gratis','green','gripe','gs','gt','gu','guge','guide','guitars','guru','gw','gy','hamburg','hangout','haus','healthcare','help','here','hermes','hiphop','hitachi','hiv','hk','hm','hn','hockey','holdings','holiday','homedepot','homes','honda','horse','host','hosting','hotmail','house','how','hr','ht','hu','ibm','icbc','icu','id','ie','ifm','il','im','immo','immobilien','in','industries','infiniti','info','ing','ink','institute','insure','int','international','investments','io','iq','ir','irish','is','it','iwc','java','jcb','je','jetzt','jewelry','jlc','jll','jm','jo','jobs','joburg','jp','juegos','kaufen','kddi','ke','kg','kh','ki','kim','kitchen','kiwi','km','kn','koeln','komatsu','kp','kr','krd','kred','kw','ky','kyoto','kz','la','lacaixa','land','lasalle','lat','latrobe','lawyer','lb','lc','lds','lease','leclerc','legal','lgbt','li','liaison','lidl','life','lighting','limited','limo','link','lk','loan','loans','lol','london','lotte','lotto','love','lr','ls','lt','ltda','lu','lupin','luxe','luxury','lv','ly','ma','madrid','maif','maison','management','mango','market','marketing','markets','marriott','mba','mc','md','me','media','meet','melbourne','meme','memorial','men','menu','mf','mg','mh','miami','microsoft','mil','mini','mk','ml','mm','mma','mn','mo','mobi','moda','moe','monash','money','montblanc','mormon','mortgage','moscow','motorcycles','mov','movie','mp','mq','mr','ms','mt','mtn','mtpc','mu','museum','mv','mw','mx','my','mz','na','nadex','nagoya','name','navy','nc','ne','nec','net','network','neustar','new','news','nexus','nf','ng','ngo','nhk','ni','nico','ninja','nissan','nl','no','np','nr','nra','nrw','ntt','nu','nyc','nz','okinawa','om','one','ong','onl','online','ooo','org','organic','osaka','otsuka','ovh','pa','page','panerai','paris','partners','parts','party','pe','pf','pg','ph','pharmacy','philips','photo','photography','photos','physio','piaget','pics','pictet','pictures','pink','pizza','pk','pl','place','plumbing','plus','pm','pn','pohl','poker','porn','post','pr','praxi','press','pro','prod','productions','prof','properties','property','ps','pt','pub','pw','py','qa','qpon','quebec','racing','re','realtor','recipes','red','redstone','rehab','reise','reisen','reit','ren','rent','rentals','repair','report','republican','rest','restaurant','review','reviews','rich','rio','rip','ro','rocks','rodeo','rs','rsvp','ru','ruhr','run','rw','ryukyu','sa','saarland','sale','samsung','sandvik','sandvikcoromant','sap','sarl','saxo','sb','sc','sca','scb','schmidt','scholarships','school','schule','schwarz','science','scot','sd','se','seat','sener','services','sew','sex','sexy','sg','sh','shiksha','shoes','show','shriram','si','singles','site','sj','sk','ski','sky','sl','sm','sn','sncf','so','soccer','social','software','sohu','solar','solutions','sony','soy','space','spiegel','spreadbetting','sr','ss','st','study','style','su','sucks','supplies','supply','support','surf','surgery','suzuki','sv','swiss','sx','sy','sydney','systems','sz','taipei','tatar','tattoo','tax','taxi','tc','td','team','tech','technology','tel','temasek','tennis','tf','tg','th','thd','theater','tickets','tienda','tips','tires','tirol','tj','tk','tl','tm','tn','to','today','tokyo','tools','top','toray','toshiba','tours','town','toys','tp','tr','trade','trading','training','travel','trust','tt','tui','tv','tw','tz','ua','ug','uk','um','university','uno','uol','us','uy','uz','va','vacations','vc','ve','vegas','ventures','versicherung','vet','vg','vi','viajes','video','villas','vision','vlaanderen','vn','vodka','vote','voting','voto','voyage','vu','wales','walter','wang','watch','webcam','website','wed','wedding','weir','wf','whoswho','wien','wiki','williamhill','win','windows','wme','work','works','world','ws','wtc','wtf','xbox','xerox','xin','测试','परीक्षा','佛山','慈善','集团','在线','한국','ভারত','八卦','موقع','বাংলা','公益','公司','移动','我爱你','москва','испытание','қаз','онлайн','сайт','срб','бел','时尚','테스트','淡马锡','орг','삼성','சிங்கப்பூர்','商标','商店','商城','дети','мкд','טעסט','工行','中文网','中信','中国','中國','娱乐','谷歌','భారత్','ලංකා','測試','ભારત','भारत','آزمایشی','பரிட்சை','网店','संगठन','餐厅','网络','укр','香港','δοκιμή','飞利浦','إختبار','台湾','台灣','手机','мон','الجزائر','عمان','ایران','امارات','بازار','پاکستان','الاردن','بھارت','المغرب','السعودية','سودان','عراق','مليسيا','澳門','政府','شبكة','გე','机构','组织机构','健康','ไทย','سورية','рус','рф','تونس','みんな','グーグル','ελ','世界','ਭਾਰਤ','网址','游戏','vermögensberater','vermögensberatung','企业','信息','مصر','قطر','广东','இலங்கை','இந்தியா','հայ','新加坡','فلسطين','テスト','政务','xxx','xyz','yachts','yandex','ye','yodobashi','yoga','yokohama','youtube','yt','za','zip','zm','zone','zuerich','zw']

extractDomain = function (str)
{
    var m, r, s, split, tl

    if (_k_.empty(str))
    {
        return
    }
    if (!(_k_.isStr(str)))
    {
        return
    }
    r = /(^|\s|(?:http[s]?:\/\/))((?:[\w-]+\.)+\w[\w-]+)(?::[1-9]\d+)?(?:\/[\w\.-~]*)*[\?\w\d\+\-\.,;=&\/#%\$]*(?:\s|$)/
    m = str.match(r)
    if ((m != null) && m.length > 2)
    {
        s = m[2]
        if (s.startsWith('www.'))
        {
            s = s.substr(4)
        }
        split = s.split('.')
        tl = _k_.last(split)
        if (_k_.in(tl,toplevelDomains))
        {
            return split.slice(split.length - 2).join('.')
        }
        else
        {
            console.log('not in toplevelDomains:',tl)
        }
    }
    return undefined
}
export default {
    extractDomain:extractDomain,
    shortenLink:shortenLink,
    extractSite:extractSite,
    containsLink:containsLink
}