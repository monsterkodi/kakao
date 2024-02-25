var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toCommonJS = (from) => {
  const moduleCache = __toCommonJS.moduleCache ??= new WeakMap;
  var cached = moduleCache.get(from);
  if (cached)
    return cached;
  var to = __defProp({}, "__esModule", { value: true });
  var desc = { enumerable: false };
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  moduleCache.set(from, to);
  return to;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// js/lib/kxk/os.js
var os, os_default;
var init_os = __esm(() => {
  os = function() {
    function os2() {
    }
    os2["homedir"] = function() {
      return "/Users/kodi";
    };
    os2["platform"] = "Darwin";
    os2["isMac"] = os2.platform === "Darwin";
    return os2;
  }();
  os_default = os;
});

// node:path
var exports_path = {};
__export(exports_path, {
  default: () => {
    {
      return q;
    }
  }
});
var L, b, z, D, T, R, _, E, C, A, y, h, m, q;
var init_path = __esm(() => {
  L = Object.create;
  b = Object.defineProperty;
  z = Object.getOwnPropertyDescriptor;
  D = Object.getOwnPropertyNames;
  T = Object.getPrototypeOf;
  R = Object.prototype.hasOwnProperty;
  _ = (f, e) => () => (e || f((e = { exports: {} }).exports, e), e.exports);
  E = (f, e) => {
    for (var r in e)
      b(f, r, { get: e[r], enumerable: true });
  };
  C = (f, e, r, l) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let i of D(e))
        !R.call(f, i) && i !== r && b(f, i, { get: () => e[i], enumerable: !(l = z(e, i)) || l.enumerable });
    return f;
  };
  A = (f, e, r) => (C(f, e, "default"), r && C(r, e, "default"));
  y = (f, e, r) => (r = f != null ? L(T(f)) : {}, C(e || !f || !f.__esModule ? b(r, "default", { value: f, enumerable: true }) : r, f));
  h = _((F, S) => {
    function c(f) {
      if (typeof f != "string")
        throw new TypeError("Path must be a string. Received " + JSON.stringify(f));
    }
    function w(f, e) {
      for (var r = "", l = 0, i = -1, s = 0, n, t = 0;t <= f.length; ++t) {
        if (t < f.length)
          n = f.charCodeAt(t);
        else {
          if (n === 47)
            break;
          n = 47;
        }
        if (n === 47) {
          if (!(i === t - 1 || s === 1))
            if (i !== t - 1 && s === 2) {
              if (r.length < 2 || l !== 2 || r.charCodeAt(r.length - 1) !== 46 || r.charCodeAt(r.length - 2) !== 46) {
                if (r.length > 2) {
                  var a = r.lastIndexOf("/");
                  if (a !== r.length - 1) {
                    a === -1 ? (r = "", l = 0) : (r = r.slice(0, a), l = r.length - 1 - r.lastIndexOf("/")), i = t, s = 0;
                    continue;
                  }
                } else if (r.length === 2 || r.length === 1) {
                  r = "", l = 0, i = t, s = 0;
                  continue;
                }
              }
              e && (r.length > 0 ? r += "/.." : r = "..", l = 2);
            } else
              r.length > 0 ? r += "/" + f.slice(i + 1, t) : r = f.slice(i + 1, t), l = t - i - 1;
          i = t, s = 0;
        } else
          n === 46 && s !== -1 ? ++s : s = -1;
      }
      return r;
    }
    function J(f, e) {
      var r = e.dir || e.root, l = e.base || (e.name || "") + (e.ext || "");
      return r ? r === e.root ? r + l : r + f + l : l;
    }
    var g = { resolve: function() {
      for (var e = "", r = false, l, i = arguments.length - 1;i >= -1 && !r; i--) {
        var s;
        i >= 0 ? s = arguments[i] : (l === undefined && (l = process.cwd()), s = l), c(s), s.length !== 0 && (e = s + "/" + e, r = s.charCodeAt(0) === 47);
      }
      return e = w(e, !r), r ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    }, normalize: function(e) {
      if (c(e), e.length === 0)
        return ".";
      var r = e.charCodeAt(0) === 47, l = e.charCodeAt(e.length - 1) === 47;
      return e = w(e, !r), e.length === 0 && !r && (e = "."), e.length > 0 && l && (e += "/"), r ? "/" + e : e;
    }, isAbsolute: function(e) {
      return c(e), e.length > 0 && e.charCodeAt(0) === 47;
    }, join: function() {
      if (arguments.length === 0)
        return ".";
      for (var e, r = 0;r < arguments.length; ++r) {
        var l = arguments[r];
        c(l), l.length > 0 && (e === undefined ? e = l : e += "/" + l);
      }
      return e === undefined ? "." : g.normalize(e);
    }, relative: function(e, r) {
      if (c(e), c(r), e === r || (e = g.resolve(e), r = g.resolve(r), e === r))
        return "";
      for (var l = 1;l < e.length && e.charCodeAt(l) === 47; ++l)
        ;
      for (var i = e.length, s = i - l, n = 1;n < r.length && r.charCodeAt(n) === 47; ++n)
        ;
      for (var t = r.length, a = t - n, v = s < a ? s : a, u = -1, o = 0;o <= v; ++o) {
        if (o === v) {
          if (a > v) {
            if (r.charCodeAt(n + o) === 47)
              return r.slice(n + o + 1);
            if (o === 0)
              return r.slice(n + o);
          } else
            s > v && (e.charCodeAt(l + o) === 47 ? u = o : o === 0 && (u = 0));
          break;
        }
        var k = e.charCodeAt(l + o), P = r.charCodeAt(n + o);
        if (k !== P)
          break;
        k === 47 && (u = o);
      }
      var d = "";
      for (o = l + u + 1;o <= i; ++o)
        (o === i || e.charCodeAt(o) === 47) && (d.length === 0 ? d += ".." : d += "/..");
      return d.length > 0 ? d + r.slice(n + u) : (n += u, r.charCodeAt(n) === 47 && ++n, r.slice(n));
    }, _makeLong: function(e) {
      return e;
    }, dirname: function(e) {
      if (c(e), e.length === 0)
        return ".";
      for (var r = e.charCodeAt(0), l = r === 47, i = -1, s = true, n = e.length - 1;n >= 1; --n)
        if (r = e.charCodeAt(n), r === 47) {
          if (!s) {
            i = n;
            break;
          }
        } else
          s = false;
      return i === -1 ? l ? "/" : "." : l && i === 1 ? "//" : e.slice(0, i);
    }, basename: function(e, r) {
      if (r !== undefined && typeof r != "string")
        throw new TypeError('"ext" argument must be a string');
      c(e);
      var l = 0, i = -1, s = true, n;
      if (r !== undefined && r.length > 0 && r.length <= e.length) {
        if (r.length === e.length && r === e)
          return "";
        var t = r.length - 1, a = -1;
        for (n = e.length - 1;n >= 0; --n) {
          var v = e.charCodeAt(n);
          if (v === 47) {
            if (!s) {
              l = n + 1;
              break;
            }
          } else
            a === -1 && (s = false, a = n + 1), t >= 0 && (v === r.charCodeAt(t) ? --t === -1 && (i = n) : (t = -1, i = a));
        }
        return l === i ? i = a : i === -1 && (i = e.length), e.slice(l, i);
      } else {
        for (n = e.length - 1;n >= 0; --n)
          if (e.charCodeAt(n) === 47) {
            if (!s) {
              l = n + 1;
              break;
            }
          } else
            i === -1 && (s = false, i = n + 1);
        return i === -1 ? "" : e.slice(l, i);
      }
    }, extname: function(e) {
      c(e);
      for (var r = -1, l = 0, i = -1, s = true, n = 0, t = e.length - 1;t >= 0; --t) {
        var a = e.charCodeAt(t);
        if (a === 47) {
          if (!s) {
            l = t + 1;
            break;
          }
          continue;
        }
        i === -1 && (s = false, i = t + 1), a === 46 ? r === -1 ? r = t : n !== 1 && (n = 1) : r !== -1 && (n = -1);
      }
      return r === -1 || i === -1 || n === 0 || n === 1 && r === i - 1 && r === l + 1 ? "" : e.slice(r, i);
    }, format: function(e) {
      if (e === null || typeof e != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
      return J("/", e);
    }, parse: function(e) {
      c(e);
      var r = { root: "", dir: "", base: "", ext: "", name: "" };
      if (e.length === 0)
        return r;
      var l = e.charCodeAt(0), i = l === 47, s;
      i ? (r.root = "/", s = 1) : s = 0;
      for (var n = -1, t = 0, a = -1, v = true, u = e.length - 1, o = 0;u >= s; --u) {
        if (l = e.charCodeAt(u), l === 47) {
          if (!v) {
            t = u + 1;
            break;
          }
          continue;
        }
        a === -1 && (v = false, a = u + 1), l === 46 ? n === -1 ? n = u : o !== 1 && (o = 1) : n !== -1 && (o = -1);
      }
      return n === -1 || a === -1 || o === 0 || o === 1 && n === a - 1 && n === t + 1 ? a !== -1 && (t === 0 && i ? r.base = r.name = e.slice(1, a) : r.base = r.name = e.slice(t, a)) : (t === 0 && i ? (r.name = e.slice(1, n), r.base = e.slice(1, a)) : (r.name = e.slice(t, n), r.base = e.slice(t, a)), r.ext = e.slice(n, a)), t > 0 ? r.dir = e.slice(0, t - 1) : i && (r.dir = "/"), r;
    }, sep: "/", delimiter: ":", win32: null, posix: null };
    g.posix = g;
    S.exports = g;
  });
  m = {};
  E(m, { default: () => q });
  A(m, y(h()));
  q = y(h());
});

// js/lib/kxk/path.js
var toExport, path_default;
var init_path2 = __esm(() => {
  init_path();
  toExport = q;
  if (false) {
  }
  path_default = toExport;
});

// js/lib/kxk/dirlist.js
var exports_dirlist = {};
__export(exports_dirlist, {
  default: () => {
    {
      return dirlist_default;
    }
  }
});
var { default: fs2} = (()=>({}));
var _k_5, dirlist, listdir, dirlist_default;
var init_dirlist = __esm(() => {
  init_slash();
  _k_5 = { list: function(l) {
    return l != null ? typeof l.length === "number" ? l : [] : [];
  } };
  listdir = async function(dir, found) {
    var absPath, file, files, isDir, stat;
    files = await fs2.readdir(dir);
    var list = _k_5.list(files);
    for (var _24_13_ = 0;_24_13_ < list.length; _24_13_++) {
      file = list[_24_13_];
      stat = await fs2.stat(slash_default.join(dir, file));
      isDir = stat.mode & 16384;
      absPath = dir + "/" + file;
      found.push({ type: isDir ? "dir" : "file", name: file, path: absPath });
      if (isDir) {
        await listdir(absPath, found);
      }
    }
    return found;
  };
  dirlist = async function(dirPath) {
    return await listdir(dirPath, []);
  };
  dirlist_default = dirlist;
});

// js/lib/kxk/slash.js
var _k_6, Slash, slash_default;
var init_slash = __esm(() => {
  init_path2();
  init_os();
  _k_6 = { in: function(a, l) {
    return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
  }, list: function(l) {
    return l != null ? typeof l.length === "number" ? l : [] : [];
  }, isFunc: function(o) {
    return typeof o === "function";
  } };
  Slash = function() {
    function Slash2() {
    }
    Slash2["logErrors"] = true;
    Slash2["path"] = function(p) {
      if (!p) {
        return p;
      }
      p = path_default.normalize(p);
      if (!p) {
        console.log("no pee?", p);
        return p;
      }
      if (p.endsWith(":.") && p.length === 3) {
        p = p.slice(0, 2);
      }
      if (p.endsWith(":") && p.length === 2) {
        p = p + "/";
      }
      return p;
    };
    Slash2["unslash"] = function(p) {
      var reg;
      p = Slash2.path(p);
      if (Slash2.win()) {
        if (p.length >= 3 && (p[0] === "/" && p[2] === "/")) {
          p = p[1] + ":" + p.slice(2);
        }
        reg = new RegExp("/", "g");
        p = p.replace(reg, "\\");
        if (p[1] === ":") {
          p = p[0].toUpperCase() + p.slice(1);
        }
      }
      return p;
    };
    Slash2["resolve"] = function(p) {
      if (!(p != null ? p.length : undefined)) {
        p = process.cwd();
      }
      if (arguments.length > 1) {
        p = Slash2.join.apply(0, arguments);
      }
      p = Slash2.unenv(Slash2.untilde(p));
      if (Slash2.isRelative(p)) {
        p = Slash2.path(path_default.resolve(p));
      } else {
        p = Slash2.path(p);
      }
      return p;
    };
    Slash2["split"] = function(p) {
      return Slash2.path(p).split("/").filter(function(e) {
        return e.length;
      });
    };
    Slash2["splitDrive"] = function(p) {
      var filePath, parsed, root;
      p = Slash2.path(p);
      parsed = Slash2.parse(p);
      root = parsed.root;
      if (root.length > 1) {
        if (p.length > root.length) {
          filePath = p.slice(root.length - 1);
        } else {
          filePath = "/";
        }
        return [filePath, root.slice(0, root.length - 2)];
      } else if (parsed.dir.length > 1) {
        if (parsed.dir[1] === ":") {
          return [p.slice(2), parsed.dir[0]];
        }
      } else if (parsed.base.length === 2) {
        if (parsed.base[1] === ":") {
          return ["/", parsed.base[0]];
        }
      }
      return [Slash2.path(p), ""];
    };
    Slash2["removeDrive"] = function(p) {
      return Slash2.splitDrive(p)[0];
    };
    Slash2["isRoot"] = function(p) {
      return Slash2.removeDrive(p) === "/";
    };
    Slash2["splitFileLine"] = function(p) {
      var c, clmn, d, f, l, line, split;
      var _106_14_ = Slash2.splitDrive(p);
      f = _106_14_[0];
      d = _106_14_[1];
      split = String(f).split(":");
      if (split.length > 1) {
        line = parseInt(split[1]);
      }
      if (split.length > 2) {
        clmn = parseInt(split[2]);
      }
      l = c = 0;
      if (Number.isInteger(line)) {
        l = line;
      }
      if (Number.isInteger(clmn)) {
        c = clmn;
      }
      if (d !== "") {
        d = d + ":";
      }
      return [d + split[0], Math.max(l, 1), Math.max(c, 0)];
    };
    Slash2["splitFilePos"] = function(p) {
      var c, f, l;
      var _118_16_ = Slash2.splitFileLine(p);
      f = _118_16_[0];
      l = _118_16_[1];
      c = _118_16_[2];
      return [f, [c, l - 1]];
    };
    Slash2["removeLinePos"] = function(p) {
      return Slash2.splitFileLine(p)[0];
    };
    Slash2["removeColumn"] = function(p) {
      var f, l;
      var _123_14_ = Slash2.splitFileLine(p);
      f = _123_14_[0];
      l = _123_14_[1];
      if (l > 1) {
        return f + ":" + l;
      } else {
        return f;
      }
    };
    Slash2["ext"] = function(p) {
      return path_default.extname(p).slice(1);
    };
    Slash2["splitExt"] = function(p) {
      return [Slash2.removeExt(p), Slash2.ext(p)];
    };
    Slash2["removeExt"] = function(p) {
      return Slash2.join(Slash2.dir(p), Slash2.base(p));
    };
    Slash2["swapExt"] = function(p, ext) {
      return Slash2.removeExt(p) + (ext.startsWith(".") && ext || `.${ext}`);
    };
    Slash2["join"] = function() {
      return Slash2.path([].map.call(arguments, Slash2.path).join("/"));
    };
    Slash2["joinFilePos"] = function(file, pos) {
      file = Slash2.removeLinePos(file);
      if (!(pos != null) || !(pos[0] != null) || pos[0] === pos[1] && pos[1] === 0) {
        return file;
      } else if (pos[0]) {
        return file + `:${pos[1] + 1}:${pos[0]}`;
      } else {
        return file + `:${pos[1] + 1}`;
      }
    };
    Slash2["joinFileLine"] = function(file, line, col) {
      file = Slash2.removeLinePos(file);
      if (!line) {
        return file;
      }
      if (!col) {
        return `${file}:${line}`;
      }
      return `${file}:${line}:${col}`;
    };
    Slash2["dirlist"] = function(p, opt, cb) {
      return this.list(p, opt, cb);
    };
    Slash2["list"] = function(p, opt, cb) {
      return (init_dirlist(), __toCommonJS(exports_dirlist))(p, opt, cb);
    };
    Slash2["pathlist"] = function(p) {
      var list;
      if (!(p != null ? p.length : undefined)) {
        Slash2.error("Slash.pathlist -- no path?");
        return [];
      }
      p = Slash2.normalize(p);
      if (p.length > 1 && p[p.length - 1] === "/" && p[p.length - 2] !== ":") {
        p = p.slice(0, p.length - 1);
      }
      list = [p];
      while (Slash2.dir(p) !== "") {
        list.unshift(Slash2.dir(p));
        p = Slash2.dir(p);
      }
      return list;
    };
    Slash2["base"] = function(p) {
      return path_default.basename(Slash2.sanitize(p), path_default.extname(Slash2.sanitize(p)));
    };
    Slash2["file"] = function(p) {
      return path_default.basename(Slash2.sanitize(p));
    };
    Slash2["extname"] = function(p) {
      return path_default.extname(Slash2.sanitize(p));
    };
    Slash2["basename"] = function(p, e) {
      return path_default.basename(Slash2.sanitize(p), e);
    };
    Slash2["isAbsolute"] = function(p) {
      p = Slash2.sanitize(p);
      return p[1] === ":" || path_default.isAbsolute(p);
    };
    Slash2["isRelative"] = function(p) {
      return !Slash2.isAbsolute(p);
    };
    Slash2["dirname"] = function(p) {
      return Slash2.path(path_default.dirname(Slash2.sanitize(p)));
    };
    Slash2["normalize"] = function(p) {
      return Slash2.path(Slash2.sanitize(p));
    };
    Slash2["dir"] = function(p) {
      p = Slash2.normalize(p);
      if (Slash2.isRoot(p)) {
        return "";
      }
      p = path_default.dirname(p);
      if (p === ".") {
        return "";
      }
      p = Slash2.path(p);
      if (p.endsWith(":") && p.length === 2) {
        p += "/";
      }
      return p;
    };
    Slash2["sanitize"] = function(p) {
      if (!(p != null ? p.length : undefined)) {
        return Slash2.error("Slash.sanitize -- no path?");
      }
      if (p[0] === "\n") {
        Slash2.error(`leading newline in path! '${p}'`);
        return Slash2.sanitize(p.substr(1));
      }
      if (p.endsWith("\n")) {
        Slash2.error(`trailing newline in path! '${p}'`);
        return Slash2.sanitize(p.substr(0, p.length - 1));
      }
      return p;
    };
    Slash2["parse"] = function(p) {
      var dict;
      dict = path_default.parse(p);
      if (dict.dir.length === 2 && dict.dir[1] === ":") {
        dict.dir += "/";
      }
      if (dict.root.length === 2 && dict.root[1] === ":") {
        dict.root += "/";
      }
      return dict;
    };
    Slash2["home"] = function() {
      return Slash2.path(os_default.homedir());
    };
    Slash2["tilde"] = function(p) {
      var _249_36_;
      return Slash2.path(p) != null ? Slash2.path(p).replace(Slash2.home(), "~") : undefined;
    };
    Slash2["untilde"] = function(p) {
      var _250_36_;
      return Slash2.path(p) != null ? Slash2.path(p).replace(/^\~/, Slash2.home()) : undefined;
    };
    Slash2["unenv"] = function(p) {
      var i, k, v;
      i = p.indexOf("$", 0);
      while (i >= 0) {
        for (k in process.env) {
          v = process.env[k];
          if (k === p.slice(i + 1, i + 1 + k.length)) {
            p = p.slice(0, i) + v + p.slice(i + k.length + 1);
            break;
          }
        }
        i = p.indexOf("$", i + 1);
      }
      return Slash2.path(p);
    };
    Slash2["relative"] = function(rel, to) {
      var rd, rl, td, tl;
      if (!(to != null ? to.length : undefined)) {
        to = process.cwd();
      }
      rel = Slash2.resolve(rel);
      if (!Slash2.isAbsolute(rel)) {
        return rel;
      }
      if (Slash2.resolve(to) === rel) {
        return ".";
      }
      var _271_17_ = Slash2.splitDrive(rel);
      rl = _271_17_[0];
      rd = _271_17_[1];
      var _272_17_ = Slash2.splitDrive(Slash2.resolve(to));
      tl = _272_17_[0];
      td = _272_17_[1];
      if (rd && td && rd !== td) {
        return rel;
      }
      return Slash2.path(path_default.relative(tl, rl));
    };
    Slash2["fileUrl"] = function(p) {
      return `file:///${Slash2.encode(p)}`;
    };
    Slash2["samePath"] = function(a, b2) {
      return Slash2.resolve(a) === Slash2.resolve(b2);
    };
    Slash2["escape"] = function(p) {
      return p.replace(/([\`\"])/g, "\\$1");
    };
    Slash2["encode"] = function(p) {
      p = encodeURI(p);
      p = p.replace(/\#/g, "%23");
      p = p.replace(/\&/g, "%26");
      return p = p.replace(/\'/g, "%27");
    };
    Slash2["pkg"] = function(p) {
      var _297_20_;
      if ((p != null ? p.length : undefined) != null) {
        while (p.length && !_k_6.in(Slash2.removeDrive(p), [".", "/", ""])) {
          if (Slash2.dirExists(Slash2.join(p, ".git"))) {
            return Slash2.resolve(p);
          }
          p = Slash2.dir(p);
        }
      }
      return null;
    };
    Slash2["git"] = function(p, cb) {
      var _309_20_;
      if ((p != null ? p.length : undefined) != null) {
        if (typeof cb === "function") {
          Slash2.dirExists(Slash2.join(p, ".git"), function(stat) {
            if (stat) {
              return cb(Slash2.resolve(p));
            } else if (!_k_6.in(Slash2.removeDrive(p), [".", "/", ""])) {
              return Slash2.git(Slash2.dir(p), cb);
            }
          });
        } else {
          while (p.length && !_k_6.in(Slash2.removeDrive(p), [".", "/", ""])) {
            if (Slash2.dirExists(Slash2.join(p, ".git"))) {
              return Slash2.resolve(p);
            }
            p = Slash2.dir(p);
          }
        }
      }
      return null;
    };
    Slash2["exists"] = function(p, cb) {
      var stat;
      if (typeof cb === "function") {
        try {
          if (!(p != null)) {
            cb();
            return;
          }
          p = Slash2.resolve(Slash2.removeLinePos(p));
          fs.access(p, fs.R_OK | fs.F_OK, function(err) {
            if (err != null) {
              return cb();
            } else {
              return fs.stat(p, function(err2, stat2) {
                if (err2 != null) {
                  return cb();
                } else {
                  return cb(stat2);
                }
              });
            }
          });
        } catch (err) {
          Slash2.error("Slash.exists -- " + String(err));
        }
      } else {
        if (p != null) {
          try {
            p = Slash2.resolve(Slash2.removeLinePos(p));
            if (stat = fs.statSync(p)) {
              fs.accessSync(p, fs.R_OK);
              return stat;
            }
          } catch (err) {
            if (_k_6.in(err.code, ["ENOENT", "ENOTDIR"])) {
              return null;
            }
            Slash2.error("Slash.exists -- " + String(err));
          }
        }
      }
      return null;
    };
    Slash2["fileExists"] = function(p, cb) {
      console.error("slash.fileExists without callback");
    };
    Slash2["dirExists"] = function(p, cb) {
      console.error("slash.fileExists without callback");
    };
    Slash2["touch"] = function(p) {
      var dir;
      try {
        dir = Slash2.dir(p);
        if (!Slash2.isDir(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        if (!Slash2.fileExists(p)) {
          fs.writeFileSync(p, "");
        }
        return p;
      } catch (err) {
        Slash2.error("Slash.touch -- " + String(err));
        return false;
      }
    };
    Slash2["unused"] = function(p, cb) {
      var dir, ext, i, name, test;
      name = Slash2.base(p);
      dir = Slash2.dir(p);
      ext = Slash2.ext(p);
      ext = ext && "." + ext || "";
      if (/\d\d$/.test(name)) {
        name = name.slice(0, name.length - 2);
      }
      if (typeof cb === "function") {
        return Slash2.exists(p, function(stat) {
          var check, i2, test2;
          if (!stat) {
            cb(Slash2.resolve(p));
            return;
          }
          i2 = 1;
          test2 = "";
          check = function() {
            test2 = `${name}${`${i2}`.padStart(2, "0")}${ext}`;
            if (dir) {
              test2 = Slash2.join(dir, test2);
            }
            return Slash2.exists(test2, function(stat2) {
              if (stat2) {
                i2 += 1;
                return check();
              } else {
                return cb(Slash2.resolve(test2));
              }
            });
          };
          return check();
        });
      } else {
        if (!Slash2.exists(p)) {
          return Slash2.resolve(p);
        }
        for (i = 1;i <= 1000; i++) {
          test = `${name}${`${i}`.padStart(2, "0")}${ext}`;
          if (dir) {
            test = Slash2.join(dir, test);
          }
          if (!Slash2.exists(test)) {
            return Slash2.resolve(test);
          }
        }
      }
    };
    Slash2["isDir"] = function(p, cb) {
      return Slash2.dirExists(p, cb);
    };
    Slash2["isFile"] = function(p, cb) {
      return Slash2.fileExists(p, cb);
    };
    Slash2["isWritable"] = function(p, cb) {
      if (typeof cb === "function") {
        try {
          return fs.access(Slash2.resolve(p), fs.constants.R_OK | fs.constants.W_OK, function(err) {
            return cb(!err);
          });
        } catch (err) {
          Slash2.error("Slash.isWritable -- " + String(err));
          return cb(false);
        }
      } else {
        try {
          fs.accessSync(Slash2.resolve(p), fs.constants.R_OK | fs.constants.W_OK);
          return true;
        } catch (err) {
          return false;
        }
      }
    };
    Slash2["textext"] = null;
    Slash2["textbase"] = { profile: 1, license: 1, ".gitignore": 1, ".npmignore": 1 };
    Slash2["isText"] = function(p) {
      var ext, isBinary;
      try {
        if (!Slash2.textext) {
          Slash2.textext = {};
          var list = _k_6.list((()=>{throw new Error(`Cannot require module "textextensions"`);})());
          for (var _490_24_ = 0;_490_24_ < list.length; _490_24_++) {
            ext = list[_490_24_];
            Slash2.textext[ext] = true;
          }
          Slash2.textext["crypt"] = true;
        }
        ext = Slash2.ext(p);
        if (ext && Slash2.textext[ext] != null) {
          return true;
        }
        if (Slash2.textbase[Slash2.basename(p).toLowerCase()]) {
          return true;
        }
        p = Slash2.resolve(p);
        if (!Slash2.isFile(p)) {
          return false;
        }
        isBinary = (()=>{throw new Error(`Cannot require module "isbinaryfile"`);})();
        return !isBinary.isBinaryFileSync(p);
      } catch (err) {
        Slash2.error("Slash.isText -- " + String(err));
        return false;
      }
    };
    Slash2["readText"] = function(p, cb) {
      if (!_k_6.isFunc(cb)) {
        return Bun.file(p).text();
      }
      return kakao.request("fs.readText", p).then(function(text, err) {
        if (!err) {
          return cb(text);
        } else {
          console.error(err);
        }
      });
    };
    Slash2["writeText"] = function(p, text, cb) {
      Slash2.error("Slash.writeText -- no callback!");
      return "";
    };
    Slash2["remove"] = function(p, cb) {
      if (cb) {
        return fs.remove(p, cb);
      } else {
        return fs.removeSync(p);
      }
    };
    Slash2["reg"] = new RegExp("\\\\", "g");
    Slash2["win"] = function() {
      return path_default.sep === "\\";
    };
    Slash2["error"] = function(msg) {
      if (this.logErrors) {
        console.error(msg);
      }
      return "";
    };
    return Slash2;
  }();
  slash_default = Slash;
});

// js/lib/bundle.js
var Bundle;
Bundle = function() {
  function Bundle2() {
  }
  Bundle2["path"] = "?";
  Bundle2["app"] = function(p) {
    return Bundle2.path + "/" + p;
  };
  Bundle2["js"] = function(p) {
    return Bundle2.path + "/js/" + p;
  };
  Bundle2["mac"] = function(p) {
    return Bundle2.path + "/Contents/MacOS/" + p;
  };
  Bundle2["res"] = function(p) {
    return Bundle2.path + "/Contents/Resources/" + p;
  };
  Bundle2["img"] = function(p) {
    return Bundle2.path + "/Contents/Resources/img/" + p;
  };
  return Bundle2;
}();
var bundle_default = Bundle;

// js/lib/kxk/elem.js
var _k_ = { isObj: function(o) {
  return !(o == null || typeof o != "object" || o.constructor.name !== "Object");
}, isStr: function(o) {
  return typeof o === "string" || o instanceof String;
}, isNum: function(o) {
  return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === (-Infinity));
}, list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
} };
var elem;
var isElement;
isElement = function(value) {
  return (value != null ? value.nodeType : undefined) === 1 && !_k_.isObj(value);
};
elem = function(typ, opt) {
  var c, e, event, k, _26_15_, _30_16_, _34_19_, _39_17_;
  if (typ && typeof typ === "object") {
    opt = typ;
    typ = opt.typ;
  }
  opt = opt != null ? opt : {};
  typ = typ != null ? typ : "div";
  e = document.createElement(typ);
  if (_k_.isStr(opt.text) || _k_.isNum(opt.text)) {
    e.textContent = opt.text;
    delete opt.text;
  }
  if (opt.html != null && _k_.isStr(opt.html)) {
    e.innerHTML = opt.html;
    delete opt.html;
  }
  if (opt.child != null && isElement(opt.child)) {
    e.appendChild(opt.child);
    delete opt.child;
  }
  if (opt.children != null && opt.children instanceof Array) {
    var list = _k_.list(opt.children);
    for (var _35_14_ = 0;_35_14_ < list.length; _35_14_++) {
      c = list[_35_14_];
      if (isElement(c)) {
        e.appendChild(c);
      }
    }
    delete opt.children;
  }
  if (opt.parent != null && isElement(opt.parent)) {
    opt.parent.appendChild(e);
    delete opt.parent;
  }
  var list1 = ["mousedown", "mousemove", "mouseup", "click", "dblclick"];
  for (var _43_14_ = 0;_43_14_ < list1.length; _43_14_++) {
    event = list1[_43_14_];
    if (opt[event] && typeof opt[event] === "function") {
      e.addEventListener(event, opt[event]);
      delete opt[event];
    }
  }
  var list2 = _k_.list(Object.keys(opt));
  for (var _48_10_ = 0;_48_10_ < list2.length; _48_10_++) {
    k = list2[_48_10_];
    e.setAttribute(k, opt[k]);
  }
  return e;
};
elem.containsPos = function(div, pos) {
  var br;
  br = div.getBoundingClientRect();
  return br.left <= pos.x && pos.x <= br.left + br.width && (br.top <= pos.y && pos.y <= br.top + br.height);
};
elem.childIndex = function(e) {
  return Array.prototype.indexOf.call(e.parentNode.childNodes, e);
};
elem.upAttr = function(element, attr) {
  var a, _62_28_;
  if (!(element != null)) {
    return null;
  }
  a = typeof element.getAttribute === "function" ? element.getAttribute(attr) : undefined;
  if (a !== null && a !== "") {
    return a;
  }
  return elem.upAttr(element.parentNode, attr);
};
elem.upProp = function(element, prop) {
  if (!(element != null)) {
    return null;
  }
  if (element[prop] != null) {
    return element[prop];
  }
  return elem.upProp(element.parentNode, prop);
};
elem.upElem = function(element, opt) {
  var _75_30_, _76_31_, _77_31_, _77_57_, _77_68_, _78_32_, _78_55_;
  if (!(element != null)) {
    return null;
  }
  if ((opt != null ? opt.tag : undefined) != null && opt.tag === element.tagName) {
    return element;
  }
  if ((opt != null ? opt.prop : undefined) != null && element[opt.prop] != null) {
    return element;
  }
  if ((opt != null ? opt.attr : undefined) != null && (typeof element.getAttribute === "function" ? element.getAttribute(opt.attr) : undefined) != null) {
    return element;
  }
  if ((opt != null ? opt.class : undefined) != null && (element.classList != null ? element.classList.contains(opt.class) : undefined)) {
    return element;
  }
  return elem.upElem(element.parentNode, opt);
};
elem.downElem = function(element, opt) {
  var child, found, _84_30_, _85_16_, _86_40_, _87_16_, _87_42_, _87_53_, _88_40_;
  if (!(element != null)) {
    return null;
  }
  if ((opt != null ? opt.tag : undefined) != null && opt.tag === element.tagName) {
    return element;
  }
  if ((opt != null ? opt.prop : undefined) != null && element[opt.prop] != null) {
    if (!((opt != null ? opt.value : undefined) != null) || element[opt.prop] === opt.value) {
      return element;
    }
  }
  if ((opt != null ? opt.attr : undefined) != null && (typeof element.getAttribute === "function" ? element.getAttribute(opt.attr) : undefined) != null) {
    if (!((opt != null ? opt.value : undefined) != null) || element.getAttribute(opt.attr) === opt.value) {
      return element;
    }
  }
  var list = _k_.list(element.children);
  for (var _89_14_ = 0;_89_14_ < list.length; _89_14_++) {
    child = list[_89_14_];
    if (found = elem.downElem(child, opt)) {
      return found;
    }
  }
};
elem.isElement = isElement;
var elem_default = elem;

// js/lib/kxk/dom.js
var _k_2 = { isStr: function(o) {
  return typeof o === "string" || o instanceof String;
}, in: function(a, l) {
  return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
}, list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
} };
var dom_default = { elem: elem_default, $: function(idOrQueryOrElement, queryOrElement = document) {
  if (_k_2.isStr(idOrQueryOrElement)) {
    if (_k_2.in(idOrQueryOrElement[0], [".", "#"]) || queryOrElement !== document) {
      return queryOrElement.querySelector(idOrQueryOrElement);
    } else {
      return document.getElementById(idOrQueryOrElement);
    }
  } else if (elem_default.isElement(idOrQueryOrElement) && _k_2.isStr(queryOrElement)) {
    return idOrQueryOrElement.querySelector(queryOrElement);
  } else {
    return idOrQueryOrElement;
  }
}, childIndex: function(e) {
  return Array.prototype.indexOf.call(e.parentNode.childNodes, e);
}, sw: function() {
  return document.body.clientWidth;
}, sh: function() {
  return document.body.clientHeight;
}, stopEvent: function(event) {
  if (event != null && typeof event.preventDefault === "function" && typeof event.stopPropagation === "function") {
    event.preventDefault();
    event.stopPropagation();
  }
  return event;
}, setStyle: function(selector, key, value, ssid = 0) {
  var rule;
  var list = _k_2.list(document.styleSheets[ssid].cssRules);
  for (var _45_17_ = 0;_45_17_ < list.length; _45_17_++) {
    rule = list[_45_17_];
    if (rule.selectorText === selector) {
      rule.style[key] = value;
      return;
    }
  }
  document.styleSheets[ssid].insertRule(`${selector} { ${key}: ${value} }`, document.styleSheets[ssid].cssRules.length);
  return;
}, getStyle: function(selector, key, value, ssid = 0) {
  var rule;
  var list = _k_2.list(document.styleSheets[ssid].cssRules);
  for (var _53_17_ = 0;_53_17_ < list.length; _53_17_++) {
    rule = list[_53_17_];
    if (rule.selectorText === selector) {
      if (rule.style[key] != null ? rule.style[key].length : undefined) {
        return rule.style[key];
      }
    }
  }
  return value;
} };

// js/lib/kxk/post.js
var POST;
var poster;
POST = "__POST__";

class Poster extends EventTarget {
  constructor() {
    super();
    this.dispose = this.dispose.bind(this);
    this.addEventListener(POST, this.onPostEvent);
    window.addEventListener("beforeunload", this.dispose);
  }
  onPostEvent(event) {
    var out;
    out = new Event(event.event);
    out.args = event.args;
    out.senderID = event.senderID;
    out.receivers = event.receivers;
    return this.dispatchEvent(out);
  }
  dispose() {
    this.removeEventListener(POST, this.onPostEvent);
    return window.removeEventListener("beforeunload", this.dispose);
  }
  toAll(type, args) {
    return this.send("toAll", type, args);
  }
  toWins(type, args) {
    return this.send("toWins", type, args);
  }
  toMain(type, args) {
    return this.send("toMain", type, args);
  }
  send(receivers, type, args, id) {
    var event;
    event = new Event(POST);
    event.event = type;
    event.args = args;
    event.senderID = id;
    event.receivers = receivers;
    return this.dispatchEvent(event);
  }
}
poster = new Poster;
var post_default = { poster, emit: function(event, ...args) {
  return poster.toAll(event, args);
}, on: function(event, cb) {
  return poster.addEventListener(event, function(e) {
    return cb.apply(cb, e.args);
  });
} };

// js/lib/kxk/keyinfo.js
init_os();
var _k_3 = { list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
}, in: function(a, l) {
  return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
} };

class Keyinfo {
  static forEvent(event) {
    var combo, info;
    combo = this.comboForEvent(event);
    info = { mod: this.modifiersForEvent(event), key: this.keynameForEvent(event), char: this.characterForEvent(event), combo, short: this.short(combo) };
    return info;
  }
  static modifierNames = ["shift", "ctrl", "alt", "command"];
  static modifierChars = ["\u2302", "\u2303", "\u2325", "\u2318"];
  static iconKeyNames = ["shift", "ctrl", "alt", "command", "backspace", "delete", "home", "end", "page up", "page down", "return", "enter", "up", "down", "left", "right", "tab", "space", "click"];
  static iconKeyChars = ["\u2302", "\u2303", "\u2325", "\u2318", "\u232B", "\u2326", "\u2196", "\u2198", "\u21DE", "\u21DF", "\u21A9", "\u21A9", "\u2191", "\u2193", "\u2190", "\u2192", "\u2920", "\u2423", "\u235D"];
  static forCombo(combo) {
    var c, char, key, mods;
    mods = [];
    char = null;
    var list = _k_3.list(combo.split("+"));
    for (var _34_14_ = 0;_34_14_ < list.length; _34_14_++) {
      c = list[_34_14_];
      if (this.isModifier(c)) {
        mods.push(c);
      } else {
        key = c;
        if (c.length === 1) {
          char = c;
        }
      }
    }
    return { mod: mods.join("+"), key, combo, char };
  }
  static isModifier(keyname) {
    return _k_3.in(keyname, this.modifierNames);
  }
  static modifiersForEvent(event) {
    var mods;
    mods = [];
    if (event.metaKey || event.key === "Meta") {
      mods.push("command");
    }
    if (event.altKey || event.key === "Alt") {
      mods.push("alt");
    }
    if (event.ctrlKey || event.key === "Control") {
      mods.push("ctrl");
    }
    if (event.shiftKey || event.key === "Shift") {
      mods.push("shift");
    }
    return mods.join("+");
  }
  static comboForEvent(event) {
    var join, key;
    join = function() {
      var args;
      args = [].slice.call(arguments, 0);
      args = args.filter(function(e) {
        return e != null ? e.length : undefined;
      });
      return args.join("+");
    };
    key = this.keynameForEvent(event);
    if (!_k_3.in(key, this.modifierNames)) {
      return join(this.modifiersForEvent(event), key);
    }
    return "";
  }
  static convertCmdCtrl(combo) {
    var index;
    index = combo.indexOf("cmdctrl");
    if (index >= 0) {
      if (os_default.isMac) {
        combo = combo.replace("cmdctrl", "command");
        combo = combo.replace("alt+command", "command+alt");
      } else {
        combo = combo.replace("cmdctrl", "ctrl");
      }
    }
    return combo;
  }
  static keynameForEvent(event) {
    var _108_45_, _99_33_;
    switch (event.code) {
      case "IntlBackslash":
      case "Backslash":
        return "\\";
      case "Equal":
        return "=";
      case "Minus":
        return "-";
      case "Plus":
        return "+";
      case "Slash":
        return "/";
      case "Quote":
        return "'";
      case "Comma":
        return ",";
      case "Period":
        return ".";
      case "Space":
        return "space";
      case "Escape":
        return "esc";
      case "Semicolon":
        return ";";
      case "BracketLeft":
        return "[";
      case "BracketRight":
        return "]";
      case "Backquote":
        return "`";
      default:
        if (!(event.key != null)) {
          return "";
        } else if (event.key.startsWith("Arrow")) {
          return event.key.slice(5).toLowerCase();
        } else if (event.code.startsWith("Key")) {
          return event.code.slice(3).toLowerCase();
        } else if (event.code.startsWith("Digit")) {
          return event.code.slice(5);
        } else if (_k_3.in(event.key, ["Delete", "Insert", "Enter", "Backspace", "Home", "End"])) {
          return event.key.toLowerCase();
        } else if (event.key === "PageUp") {
          return "page up";
        } else if (event.key === "PageDown") {
          return "page down";
        } else if (event.key === "Control") {
          return "ctrl";
        } else if (event.key === "Meta") {
          return "command";
        } else if ((this.characterForEvent(event) != null ? this.characterForEvent(event).length : undefined) === 1) {
          return this.characterForEvent(event).toLowerCase();
        } else {
          return event.key.toLowerCase();
        }
    }
  }
  static characterForEvent(event) {
    var _113_20_;
    if ((event.key != null ? event.key.length : undefined) === 1) {
      return event.key;
    } else if (event.code === "NumpadEqual") {
      return "=";
    }
  }
  static short(combo) {
    var i;
    combo = this.convertCmdCtrl(combo.toLowerCase());
    for (var _121_18_ = i = 0, _121_22_ = this.iconKeyNames.length;_121_18_ <= _121_22_ ? i < this.iconKeyNames.length : i > this.iconKeyNames.length; _121_18_ <= _121_22_ ? ++i : --i) {
      combo = combo.replace(new RegExp(this.iconKeyNames[i], "gi"), this.iconKeyChars[i]);
    }
    combo = combo.replace(/\+/g, "");
    return combo.toUpperCase();
  }
}
var keyinfo_default = Keyinfo;

// js/lib/kxk/sds.js
var _k_4 = { in: function(a, l) {
  return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
} };
var collect;
var find;
var get;
var regexp;
regexp = function(s) {
  s = String(s);
  s = s.replace(/([^.]+\|[^.]+)/g, "($1)");
  s = s.replace(/\./g, "\\.");
  s = s.replace(/\^/g, "\\^");
  s = s.replace(/\?/g, "[^.]");
  s = s.replace(/\*\*/g, "####");
  s = s.replace(/\*/g, "[^.]*");
  s = s.replace(/####/g, ".*");
  return new RegExp("^" + s + "$");
};
collect = function(object, filter, map, count = -1, keyPath = [], result = []) {
  var i, k, v;
  filter = filter != null ? filter : function(p, k2, v2) {
    return true;
  };
  map = map != null ? map : function(p, v2) {
    return [p, v2];
  };
  switch (object.constructor.name) {
    case "Array":
      for (var _49_22_ = i = 0, _49_26_ = object.length;_49_22_ <= _49_26_ ? i < object.length : i > object.length; _49_22_ <= _49_26_ ? ++i : --i) {
        v = object[i];
        keyPath.push(i);
        if (filter(keyPath, i, v)) {
          result.push(map([].concat(keyPath), v));
          if (count > 0 && result.length >= count) {
            return result;
          }
        }
        if (_k_4.in(v != null ? v.constructor.name : undefined, ["Array", "Object"])) {
          collect(v, filter, map, count, keyPath, result);
        }
        keyPath.pop();
      }
      break;
    case "Object":
      for (k in object) {
        v = object[k];
        keyPath.push(k);
        if (filter(keyPath, k, v)) {
          result.push(map([].concat(keyPath), v));
          if (count > 0 && result.length >= count) {
            return result;
          }
        }
        if (_k_4.in(v != null ? v.constructor.name : undefined, ["Array", "Object"])) {
          collect(v, filter, map, count, keyPath, result);
        }
        keyPath.pop();
      }
      break;
  }
  return result;
};
find = function() {
  function find2() {
  }
  find2["key"] = function(object, key) {
    var keyReg;
    keyReg = this.reg(key);
    return this.traverse(object, function(p, k, v) {
      return this.match(k, keyReg);
    }.bind(this));
  };
  find2["path"] = function(object, path) {
    var pthReg;
    pthReg = this.reg(path);
    return this.traverse(object, function(p, k, v) {
      return this.matchPath(p, pthReg);
    }.bind(this));
  };
  find2["value"] = function(object, val) {
    var valReg;
    valReg = this.reg(val);
    return this.traverse(object, function(p, k, v) {
      return this.match(v, valReg);
    }.bind(this));
  };
  find2["keyValue"] = function(object, key, val) {
    var keyReg, valReg;
    keyReg = this.reg(key);
    valReg = this.reg(val);
    return this.traverse(object, function(p, k, v) {
      return this.match(k, keyReg) && this.match(v, valReg);
    }.bind(this));
  };
  find2["pathValue"] = function(object, path, val) {
    var pthReg, valReg;
    pthReg = this.reg(path);
    valReg = this.reg(val);
    return this.traverse(object, function(p, k, v) {
      return this.matchPath(p, pthReg) && this.match(v, valReg);
    }.bind(this));
  };
  find2["traverse"] = function(object, func) {
    return collect(object, func, function(p, v) {
      return p;
    });
  };
  find2["matchPath"] = function(a, r) {
    return this.match(a.join("."), r);
  };
  find2["match"] = function(a, r) {
    var _118_30_;
    if (!(a instanceof Array)) {
      return String(a).match(r) != null ? String(a).match(r).length : undefined;
    } else {
      return false;
    }
  };
  find2["reg"] = function(s) {
    return regexp(s);
  };
  return find2;
}();
get = function(object, keypath, defaultValue) {
  var kp;
  if (!object) {
    return;
  }
  if (!(keypath != null ? keypath.length : undefined)) {
    return;
  }
  if (typeof keypath === "string") {
    keypath = keypath.split(".");
  }
  kp = [].concat(keypath);
  while (kp.length) {
    object = object[kp.shift()];
    if (!(object != null)) {
      return defaultValue;
    }
  }
  return object;
};
var sds_default = { find, get };

// js/lib/kxk/popup.js
init_os();
init_slash();
var _k_7 = { list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
}, empty: function(l) {
  return l === "" || l === null || l === undefined || l !== l || typeof l === "object" && Object.keys(l).length === 0;
} };
var elem3;
var Popup;
var stopEvent;
elem3 = dom_default.elem;
stopEvent = dom_default.stopEvent;
Popup = function() {
  function Popup2(opt) {
    var br, child, div, item, text, _47_30_, _48_64_, _48_92_;
    this["onKeyDown"] = this["onKeyDown"].bind(this);
    this["onFocusOut"] = this["onFocusOut"].bind(this);
    this["onContextMenu"] = this["onContextMenu"].bind(this);
    this["onClick"] = this["onClick"].bind(this);
    this["onHover"] = this["onHover"].bind(this);
    this["activate"] = this["activate"].bind(this);
    this["close"] = this["close"].bind(this);
    this.focusElem = document.activeElement;
    this.items = elem3({ class: "popup", tabindex: 0 });
    this.parent = opt.parent;
    this.onClose = opt.onClose;
    if (opt.class) {
      this.items.classList.add(opt.class);
    }
    var list = _k_7.list(opt.items);
    for (var _29_17_ = 0;_29_17_ < list.length; _29_17_++) {
      item = list[_29_17_];
      if (item.hide) {
        continue;
      }
      if (_k_7.empty(item.text) && _k_7.empty(item.html) && _k_7.empty(item.child) && _k_7.empty(item.children) && _k_7.empty(item.img)) {
        div = elem3("hr", { class: "popupItem separator" });
      } else {
        div = elem3({ class: "popupItem", text: item.text });
        if (!_k_7.empty(item.html)) {
          div.innerHTML = item.html;
        } else {
          if (item.img) {
            div.appendChild(elem3("img", { class: "popupImage", src: slash_default.fileUrl(item.img) }));
          }
          if (item.child) {
            div.appendChild(item.child);
          }
          if (item.children) {
            var list1 = _k_7.list(item.children);
            for (var _43_34_ = 0;_43_34_ < list1.length; _43_34_++) {
              child = list1[_43_34_];
              div.appendChild(child);
            }
          }
        }
        div.item = item;
        div.addEventListener("click", this.onClick);
        if ((_47_30_ = item.combo) != null ? _47_30_ : item.accel) {
          text = keyinfo_default.short(os_default.isMac ? (_48_64_ = item.combo) != null ? _48_64_ : item.accel : (_48_92_ = item.accel) != null ? _48_92_ : item.combo);
          div.appendChild(elem3("span", { class: "popupCombo", text }));
        } else if (item.menu) {
          div.appendChild(elem3("span", { class: "popupCombo", text: "\u25B6" }));
        }
      }
      this.items.appendChild(div);
    }
    document.body.appendChild(this.items);
    this.items.addEventListener("contextmenu", this.onContextMenu);
    this.items.addEventListener("keydown", this.onKeyDown);
    this.items.addEventListener("focusout", this.onFocusOut);
    this.items.addEventListener("mouseover", this.onHover);
    br = this.items.getBoundingClientRect();
    if (opt.x + br.width > document.body.clientWidth) {
      this.items.style.left = `${document.body.clientWidth - br.width}px`;
    } else {
      this.items.style.left = `${opt.x}px`;
    }
    if (opt.y + br.height > document.body.clientHeight) {
      this.items.style.top = `${document.body.clientHeight - br.height}px`;
    } else {
      this.items.style.top = `${opt.y}px`;
    }
    if (opt.selectFirstItem !== false) {
      this.select(this.items.firstChild, { selectFirstItem: false });
    }
  }
  Popup2.prototype["close"] = function(opt = {}) {
    var _102_22_, _106_22_, _85_42_, _85_48_, _86_33_, _90_14_, _93_14_, _94_14_, _95_14_, _96_14_, _99_15_;
    if (_k_7.empty(this.parent) || ((_85_42_ = this.parentMenu()) != null ? (_85_48_ = _85_42_.elem) != null ? _85_48_.classList.contains("menu") : undefined : undefined)) {
      if ((typeof this.onClose === "function" ? this.onClose() : undefined) === "skip") {
        return;
      }
    }
    this.popup != null && this.popup.close({ focus: false });
    delete this.popup;
    this.items != null && this.items.removeEventListener("keydown", this.onKeyDown);
    this.items != null && this.items.removeEventListener("focusout", this.onFocusOut);
    this.items != null && this.items.removeEventListener("mouseover", this.onHover);
    this.items != null && this.items.remove();
    delete this.items;
    this.parent != null && this.parent.childClosed(this, opt);
    if (opt.all) {
      if (this.parent != null) {
        this.parent.close(opt);
      }
    }
    if (opt.focus !== false && !this.parent) {
      return this.focusElem != null ? this.focusElem.focus() : undefined;
    }
  };
  Popup2.prototype["childClosed"] = function(child, opt) {
    if (child === this.popup) {
      delete this.popup;
      if (opt.focus !== false) {
        return this.focus();
      }
    }
  };
  Popup2.prototype["select"] = function(item, opt = {}) {
    var _125_17_, _128_17_, _132_20_;
    if (!(item != null)) {
      return;
    }
    if (this.popup != null) {
      this.popup.close({ focus: false });
    }
    this.selected != null && this.selected.classList.remove("selected");
    this.selected = item;
    this.selected.classList.add("selected");
    if ((item.item != null ? item.item.menu : undefined) && opt.open !== false) {
      delete this.popup;
      this.popupChild(item, opt);
    }
    return this.focus();
  };
  Popup2.prototype["popupChild"] = function(item, opt = {}) {
    var br, items;
    if (items = item.item.menu) {
      if (this.popup) {
        return this.closePopup();
      } else {
        br = item.getBoundingClientRect();
        return this.popup = new Popup2({ items, parent: this, x: br.left + br.width, y: br.top, selectFirstItem: opt != null ? opt.selectFirstItem : undefined });
      }
    }
  };
  Popup2.prototype["closePopup"] = function() {
    var _155_14_;
    this.popup != null && this.popup.close({ focus: false });
    return delete this.popup;
  };
  Popup2.prototype["navigateLeft"] = function() {
    var m2;
    if (this.popup) {
      return this.closePopup();
    } else if (m2 = this.parentMenu()) {
      return m2.navigateLeft();
    } else if (this.parent) {
      return this.close({ focus: false });
    }
  };
  Popup2.prototype["activateOrNavigateRight"] = function() {
    var _175_20_;
    if (this.selected != null) {
      if (!this.selected.item.menu) {
        return this.activate(this.selected);
      } else {
        return this.navigateRight();
      }
    }
  };
  Popup2.prototype["navigateRight"] = function() {
    var _184_25_, _187_25_;
    if (this.popup) {
      return this.popup.select(this.popup.items.firstChild);
    } else if (this.selected != null ? this.selected.item.menu : undefined) {
      return this.select(this.selected, { selectFirstItem: true });
    } else {
      return this.parentMenu() != null ? this.parentMenu().navigateRight() : undefined;
    }
  };
  Popup2.prototype["parentMenu"] = function() {
    var _190_18_;
    if (this.parent != null && !this.parent.parent) {
      return this.parent;
    }
  };
  Popup2.prototype["nextItem"] = function() {
    var next, _202_38_;
    if (next = this.selected) {
      while (next = next.nextSibling) {
        if (!_k_7.empty(next.item != null ? next.item.text : undefined)) {
          return next;
        }
      }
    }
  };
  Popup2.prototype["prevItem"] = function() {
    var prev, _208_38_;
    if (prev = this.selected) {
      while (prev = prev.previousSibling) {
        if (!_k_7.empty(prev.item != null ? prev.item.text : undefined)) {
          return prev;
        }
      }
    }
  };
  Popup2.prototype["activate"] = function(item) {
    var _219_20_, _219_24_, _221_39_, _224_52_;
    if ((item.item != null ? item.item.cb : undefined) != null) {
      this.close({ all: true });
      return item.item.cb((_221_39_ = item.item.arg) != null ? _221_39_ : item.item.text);
    } else if (!item.item.menu) {
      this.close({ all: true });
      return post_default.emit("menuAction", (_224_52_ = item.item.action) != null ? _224_52_ : item.item.text);
    }
  };
  Popup2.prototype["toggle"] = function(item) {
    if (this.popup) {
      this.popup.close({ focus: false });
      return delete this.popup;
    } else {
      return this.select(item, { selectFirstItem: false });
    }
  };
  Popup2.prototype["onHover"] = function(event) {
    var item;
    item = elem3.upElem(event.target, { prop: "item" });
    if (item) {
      return this.select(item, { selectFirstItem: false });
    }
  };
  Popup2.prototype["onClick"] = function(event) {
    var item;
    stopEvent(event);
    item = elem3.upElem(event.target, { prop: "item" });
    if (item) {
      if (item.item.menu) {
        return this.toggle(item);
      } else {
        return this.activate(item);
      }
    }
  };
  Popup2.prototype["onContextMenu"] = function(event) {
    return stopEvent(event);
  };
  Popup2.prototype["focus"] = function() {
    var _265_20_;
    return this.items != null ? this.items.focus() : undefined;
  };
  Popup2.prototype["onFocusOut"] = function(event) {
    var _269_34_;
    if (!(event.relatedTarget != null ? event.relatedTarget.classList.contains("popup") : undefined)) {
      return this.close({ all: true, focus: false });
    }
  };
  Popup2.prototype["onKeyDown"] = function(event) {
    var combo, key, mod;
    mod = keyinfo_default.forEvent(event).mod;
    key = keyinfo_default.forEvent(event).key;
    combo = keyinfo_default.forEvent(event).combo;
    switch (combo) {
      case "end":
      case "page down":
        return stopEvent(event, this.select(this.items.lastChild, { selectFirstItem: false }));
      case "home":
      case "page up":
        return stopEvent(event, this.select(this.items.firstChild, { selectFirstItem: false }));
      case "esc":
        return stopEvent(event, this.close());
      case "down":
        return stopEvent(event, this.select(this.nextItem(), { selectFirstItem: false }));
      case "up":
        return stopEvent(event, this.select(this.prevItem(), { selectFirstItem: false }));
      case "enter":
      case "space":
        return stopEvent(event, this.activateOrNavigateRight());
      case "left":
        return stopEvent(event, this.navigateLeft());
      case "right":
        return stopEvent(event, this.navigateRight());
    }
  };
  return Popup2;
}();
var popup_default = { menu: function(opt) {
  return new Popup(opt);
} };

// js/lib/kxk/menu.js
var _k_8 = { list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
} };
var elem4;
var Menu;
var stopEvent2;
elem4 = dom_default.elem;
stopEvent2 = dom_default.stopEvent;
Menu = function() {
  function Menu2(opt) {
    var combo, div, item, _26_25_;
    this["onClick"] = this["onClick"].bind(this);
    this["onKeyDown"] = this["onKeyDown"].bind(this);
    this["close"] = this["close"].bind(this);
    this["onFocusOut"] = this["onFocusOut"].bind(this);
    this["onHover"] = this["onHover"].bind(this);
    this["blur"] = this["blur"].bind(this);
    this["focus"] = this["focus"].bind(this);
    this.elem = elem4({ class: "menu", tabindex: 0 });
    var list = _k_8.list(opt.items);
    for (var _21_17_ = 0;_21_17_ < list.length; _21_17_++) {
      item = list[_21_17_];
      if (item.hide) {
        continue;
      }
      div = elem4({ class: "menuItem", text: item.text });
      div.item = item;
      div.addEventListener("click", this.onClick);
      if (item.combo != null) {
        combo = elem4("span", { class: "popupCombo", text: keyinfo_default.short(item.combo) });
        div.appendChild(combo);
      }
      this.elem.appendChild(div);
    }
    this.select(this.elem.firstChild);
    this.elem.addEventListener("keydown", this.onKeyDown);
    this.elem.addEventListener("focusout", this.onFocusOut);
    this.elem.addEventListener("mouseover", this.onHover);
  }
  Menu2.prototype["del"] = function() {
    var _40_13_;
    this.close();
    this.elem != null && this.elem.remove();
    return this.elem = null;
  };
  Menu2.prototype["focus"] = function() {
    this.focusElem = document.activeElement;
    return this.elem.focus();
  };
  Menu2.prototype["blur"] = function() {
    var _54_33_, _54_40_;
    this.close();
    return (_54_33_ = this.focusElem) != null ? typeof (_54_40_ = _54_33_.focus) === "function" ? _54_40_() : undefined : undefined;
  };
  Menu2.prototype["onHover"] = function(event) {
    return this.select(event.target, { selectFirstItem: false });
  };
  Menu2.prototype["onFocusOut"] = function(event) {
    var _60_45_;
    if (this.popup && !(event.relatedTarget != null ? event.relatedTarget.classList.contains("popup") : undefined)) {
      this.popup.close({ focus: false });
      return delete this.popup;
    }
  };
  Menu2.prototype["open"] = function() {
    return this.select(this.elem.firstChild, { activate: true });
  };
  Menu2.prototype["close"] = function(opt = {}) {
    var _80_17_;
    if (this.popup != null) {
      this.popup.close({ focus: false });
      delete this.popup;
      if (opt.focus !== false) {
        this.elem.focus();
      }
    } else {
      if (opt.focus !== false) {
        if (this.focusElem && typeof this.focusElem.focus === "function") {
          this.focusElem.focus();
        }
      }
    }
    return null;
  };
  Menu2.prototype["childClosed"] = function(child, opt) {
    if (child === this.popup) {
      delete this.popup;
      if (opt.focus !== false) {
        this.elem.focus();
      }
    }
    return null;
  };
  Menu2.prototype["select"] = function(item, opt = {}) {
    var hadPopup, _109_17_, _113_17_;
    if (!(item != null)) {
      return;
    }
    if (this.popup != null) {
      hadPopup = true;
      this.popup.close({ focus: false });
    }
    this.selected != null && this.selected.classList.remove("selected");
    this.selected = item;
    this.selected.classList.add("selected");
    if (hadPopup || opt.activate) {
      delete this.popup;
      return this.activate(item, opt);
    }
  };
  Menu2.prototype["activate"] = function(item, opt = {}) {
    var br, items, pr;
    items = item.item.menu;
    if (items) {
      if (this.popup) {
        this.popup.close({ focus: false });
        delete this.popup;
      }
      br = item.getBoundingClientRect();
      pr = item.parentNode.getBoundingClientRect();
      opt.items = items;
      opt.parent = this;
      opt.x = br.left;
      opt.y = pr.top + pr.height;
      opt.class = "titlemenu";
      this.popup = popup_default.menu(opt);
      if (opt.selectFirstItem === false) {
        return this.elem.focus();
      }
    }
  };
  Menu2.prototype["toggle"] = function(item) {
    if (this.popup) {
      this.popup.close({ focus: false });
      return delete this.popup;
    } else {
      return this.activate(item, { selectFirstItem: false });
    }
  };
  Menu2.prototype["itemSelected"] = function(item, elem5) {
  };
  Menu2.prototype["deactivate"] = function(item) {
  };
  Menu2.prototype["navigateLeft"] = function() {
    var _160_39_;
    return this.select(this.selected != null ? this.selected.previousSibling : undefined, { activate: true, selectFirstItem: false });
  };
  Menu2.prototype["navigateRight"] = function() {
    var _161_39_;
    return this.select(this.selected != null ? this.selected.nextSibling : undefined, { activate: true, selectFirstItem: false });
  };
  Menu2.prototype["onKeyDown"] = function(event) {
    var combo, key, mod;
    mod = keyinfo_default.forEvent(event).mod;
    key = keyinfo_default.forEvent(event).key;
    combo = keyinfo_default.forEvent(event).combo;
    switch (combo) {
      case "end":
      case "page down":
        return stopEvent2(event, this.select(this.elem.lastChild, { activate: true, selectFirstItem: false }));
      case "home":
      case "page up":
        return stopEvent2(event, this.select(this.elem.firstChild, { activate: true, selectFirstItem: false }));
      case "enter":
      case "down":
      case "space":
        return stopEvent2(event, this.activate(this.selected));
      case "esc":
        return stopEvent2(event, this.close());
      case "right":
        return stopEvent2(event, this.navigateRight());
      case "left":
        return stopEvent2(event, this.navigateLeft());
    }
  };
  Menu2.prototype["onClick"] = function(e) {
    return this.toggle(e.target);
  };
  return Menu2;
}();
var menu_default = Menu;

// js/lib/kxk/noon.js
init_slash();
init_path2();
var _k_9 = { list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
}, last: function(o) {
  return o != null ? o.length ? o[o.length - 1] : undefined : o;
}, in: function(a, l) {
  return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
}, isFunc: function(o) {
  return typeof o === "function";
}, empty: function(l) {
  return l === "" || l === null || l === undefined || l !== l || typeof l === "object" && Object.keys(l).length === 0;
} };
var defaults;
var load;
var pad;
var parse;
var parseStr;
var regs;
var save;
var stringify;
parse = function(s) {
  var addLine, d, dd, dk, dv, e, EMPTY, FLOAT, i, indent, insert, inspect, INT, isArray, k, key, l, last, leadingSpaces, line, lineFail, lines, makeObject, NEWLINE, oi, p, r, stack, ud, undense, v, value, values, vl;
  if (!s) {
    return "";
  }
  if (s === "") {
    return "";
  }
  EMPTY = /^\s*$/;
  NEWLINE = /\r?\n/;
  FLOAT = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;
  INT = /^(\-|\+)?([0-9]+|Infinity)$/;
  last = function(a) {
    return a != null ? a[a.length - 1] : undefined;
  };
  isArray = function(a) {
    return a != null && typeof a === "object" && a.constructor.name === "Array";
  };
  undense = function(d2, s2) {
    var esc, i2, key2, l2, ld, p2, pp, sd, sl, t;
    sl = s2.length;
    sd = d2;
    p2 = 0;
    while (p2 < sl && s2[p2] === ".") {
      d2 += 1;
      p2 += 1;
    }
    while (p2 < sl && s2[p2] === " ") {
      p2 += 1;
    }
    l2 = "";
    key2 = true;
    esc = false;
    while (p2 < sl) {
      if (l2 !== "" && s2[p2] === " " && s2[p2 + 1] === ".") {
        pp = p2 + 2;
        while (pp < sl && s2[pp] === ".") {
          pp += 1;
        }
        if (s2[pp] === " ") {
          p2 += 1;
          break;
        }
      }
      esc |= s2[p2] === "|";
      l2 += s2[p2];
      if (!esc && key2 && s2[p2] === " ") {
        if (p2 < sl + 1 && s2[p2 + 1] !== " ") {
          l2 += " ";
        }
        key2 = false;
      }
      p2 += 1;
      esc ^= s2[p2] === "|";
    }
    ld = "";
    for (var _72_18_ = i2 = 0, _72_22_ = d2;_72_18_ <= _72_22_ ? i2 < d2 : i2 > d2; _72_18_ <= _72_22_ ? ++i2 : --i2) {
      ld += " ";
    }
    ld += l2;
    if (p2 < sl) {
      t = undense(sd, s2.substring(p2));
      t.unshift(ld);
      return t;
    } else {
      return [ld];
    }
  };
  leadingSpaces = 0;
  lines = s.split(NEWLINE).filter(function(l2) {
    return !EMPTY.test(l2);
  });
  if (lines.length === 0) {
    return "";
  } else if (lines.length === 1) {
    lines = [lines[0].trim()];
  } else {
    while (lines[0][leadingSpaces] === " ") {
      leadingSpaces += 1;
    }
  }
  stack = [{ o: [], d: leadingSpaces }];
  makeObject = function(t) {
    var b2, i2, o;
    o = {};
    var list2 = _k_9.list(t.o);
    for (var _114_14_ = 0;_114_14_ < list2.length; _114_14_++) {
      i2 = list2[_114_14_];
      o[i2] = null;
    }
    t.l = _k_9.last(t.o);
    t.o = o;
    if (stack.length > 1) {
      b2 = stack[stack.length - 2];
      if (isArray(b2.o)) {
        b2.o.pop();
        b2.o.push(o);
      } else {
        b2.o[b2.l] = o;
      }
    }
    return o;
  };
  key = function(k2) {
    if ((k2 != null ? k2[0] : undefined) === "|") {
      if (k2[k2.length - 1] === "|") {
        return k2.substr(1, k2.length - 2);
      }
      return k2.substr(1).trimRight();
    }
    return k2;
  };
  values = { null: null, true: true, false: false };
  value = function(v2) {
    if (values[v2] !== undefined) {
      return values[v2];
    }
    if ((v2 != null ? v2[0] : undefined) === "|") {
      return key(v2);
    } else if ((v2 != null ? v2[v2.length - 1] : undefined) === "|") {
      return v2.substr(0, v2.length - 1);
    }
    if (FLOAT.test(v2)) {
      return parseFloat(v2);
    }
    if (INT.test(v2)) {
      return parseInt(v2);
    }
    return v2;
  };
  insert = function(t, k2, v2) {
    if (isArray(t.o)) {
      if (!(v2 != null)) {
        if (_k_9.last(t.o) === "." && k2 === ".") {
          t.o.pop();
          t.o.push([]);
        }
        return t.o.push(value(k2));
      } else {
        return makeObject(t)[key(k2)] = value(v2);
      }
    } else {
      t.o[key(k2)] = value(v2);
      return t.l = key(k2);
    }
  };
  indent = function(t, k2, v2) {
    var l2, o;
    o = [];
    if (v2 != null) {
      o = {};
    }
    if (isArray(t.o)) {
      if (_k_9.last(t.o) === ".") {
        t.o.pop();
        t.o.push(o);
      } else {
        l2 = _k_9.last(t.o);
        makeObject(t);
        t.o[l2] = o;
      }
    } else {
      t.o[t.l] = o;
    }
    if (v2 != null) {
      o[key(k2)] = value(v2);
    } else {
      o.push(value(k2));
    }
    return o;
  };
  addLine = function(d2, k2, v2) {
    var t, undensed;
    if (k2 != null) {
      t = _k_9.last(stack);
      undensed = t.undensed;
      t.undensed = false;
      if (d2 > t.d && !undensed) {
        return stack.push({ o: indent(t, k2, v2), d: d2 });
      } else if (d2 < t.d) {
        if (isArray(t.o) && _k_9.last(t.o) === ".") {
          t.o.pop();
          t.o.push([]);
        }
        while ((t != null ? t.d : undefined) > d2) {
          stack.pop();
          t = _k_9.last(stack);
        }
        return insert(t, k2, v2);
      } else {
        if (undensed) {
          t.d = d2;
        }
        return insert(t, k2, v2);
      }
    }
  };
  inspect = function(l2) {
    var d2, escl, escr, k2, p2, v2;
    p2 = 0;
    while (l2[p2] === " ") {
      p2 += 1;
    }
    if (!(l2[p2] != null)) {
      return [0, null, null, false];
    }
    d2 = p2;
    k2 = "";
    if (l2[p2] === "#") {
      return [0, null, null, false];
    }
    escl = false;
    escr = false;
    if (l2[p2] === "|") {
      escl = true;
      k2 += "|";
      p2 += 1;
    }
    while (l2[p2] != null) {
      if (l2[p2] === " " && l2[p2 + 1] === " " && !escl) {
        break;
      }
      k2 += l2[p2];
      p2 += 1;
      if (escl && l2[p2 - 1] === "|") {
        break;
      }
    }
    if (!escl) {
      k2 = k2.trimRight();
    }
    while (l2[p2] === " ") {
      p2 += 1;
    }
    v2 = "";
    if (l2[p2] === "|") {
      escr = true;
      v2 += "|";
      p2 += 1;
    }
    while (l2[p2] != null) {
      v2 += l2[p2];
      p2 += 1;
      if (escr && l2[p2 - 1] === "|" && l2.trimRight().length === p2) {
        break;
      }
    }
    if (l2[p2 - 1] === " " && !escr) {
      if (v2 != null) {
        v2 = v2.trimRight();
      }
    }
    if (k2 === "") {
      k2 = null;
    }
    if (v2 === "") {
      v2 = null;
    }
    return [d2, k2, v2, escl];
  };
  if (lines.length === 1) {
    if (0 < lines[0].indexOf(":: ")) {
      lines = lines[0].split(":: ").map(function(l2) {
        var p2;
        p2 = 0;
        while (l2[p2] === " ") {
          p2 += 1;
        }
        while (l2[p2] != null && l2[p2] !== " ") {
          p2 += 1;
        }
        if (l2[p2] === " ") {
          return l2.slice(0, p2) + " " + l2.slice(p2);
        } else {
          return l2;
        }
      });
    }
    p = lines[0].indexOf(" . ");
    e = lines[0].indexOf("|");
    if (p > 0 && p === lines[0].indexOf(" ") && (e < 0 || p < e)) {
      lines = [lines[0].slice(0, p) + " " + lines[0].slice(p)];
    }
  }
  i = 0;
  while (i < lines.length) {
    line = lines[i];
    var _330_18_ = inspect(line);
    d = _330_18_[0];
    k = _330_18_[1];
    v = _330_18_[2];
    e = _330_18_[3];
    if (k != null) {
      if (v != null && !e && v.substr(0, 2) === ". ") {
        addLine(d, k);
        ud = _k_9.last(stack).d;
        var list = _k_9.list(undense(d, v));
        for (var _338_22_ = 0;_338_22_ < list.length; _338_22_++) {
          e = list[_338_22_];
          var _339_31_ = inspect(e);
          dd = _339_31_[0];
          dk = _339_31_[1];
          dv = _339_31_[2];
          addLine(dd, dk, dv);
        }
        while (_k_9.last(stack).d > ud + 1) {
          stack.pop();
        }
        _k_9.last(stack).undensed = true;
      } else {
        oi = i;
        lineFail = function() {
          if (i >= lines.length) {
            console.error(`unmatched multiline string in line ${oi + 1}`);
            return 1;
          }
        };
        if (k === "..." && !(v != null)) {
          i += 1;
          vl = [];
          if (lineFail()) {
            return;
          }
          while (lines[i].trimLeft().substr(0, 3) !== "...") {
            l = lines[i].trim();
            if (l[0] === "|") {
              l = l.substr(1);
            }
            if (l[l.length - 1] === "|") {
              l = l.substr(0, l.length - 1);
            }
            vl.push(l);
            i += 1;
            if (lineFail()) {
              return;
            }
          }
          k = vl.join("\n");
          r = lines[i].trimLeft().substr(3).trim();
          if (r.length) {
            v = r;
          }
        }
        if (v === "...") {
          i += 1;
          if (lineFail()) {
            return;
          }
          vl = [];
          while (lines[i].trim() !== "...") {
            l = lines[i].trim();
            if (l[0] === "|") {
              l = l.substr(1);
            }
            if (l[l.length - 1] === "|") {
              l = l.substr(0, l.length - 1);
            }
            vl.push(l);
            i += 1;
            if (lineFail()) {
              return;
            }
          }
          v = vl.join("\n");
        }
        addLine(d, k, v);
      }
    }
    i += 1;
  }
  return stack[0].o;
};
defaults = { ext: ".noon", indent: 4, align: true, maxalign: 32, sort: false, circular: false, null: false, colors: false };
regs = { url: new RegExp("^(https?|git|file)(://)(\\S+)$"), path: new RegExp("^([\\.\\/\\S]+)(\\/\\S+)$"), semver: new RegExp("\\d+\\.\\d+\\.\\d+") };
pad = function(s, l) {
  while (s.length < l) {
    s += " ";
  }
  return s;
};
stringify = function(obj, options = {}) {
  var def, escape, indstr, opt, pretty, toStr;
  def = function(o, d) {
    var k, r, v;
    r = {};
    for (k in o) {
      v = o[k];
      r[k] = v;
    }
    for (k in d) {
      v = d[k];
      if (!(r[k] != null)) {
        r[k] = v;
      }
    }
    return r;
  };
  opt = def(options, defaults);
  if (opt.ext === ".json") {
    return JSON.stringify(obj, null, opt.indent);
  }
  if (typeof opt.indent === "string") {
    opt.indent = opt.indent.length;
  }
  indstr = pad("", opt.indent);
  escape = function(k, arry) {
    var es, sp;
    if (0 <= k.indexOf("\n")) {
      sp = k.split("\n");
      es = sp.map(function(s) {
        return escape(s, arry);
      });
      es.unshift("...");
      es.push("...");
      return es.join("\n");
    }
    if (k === "" || k === "..." || _k_9.in(k[0], [" ", "#", "|"]) || _k_9.in(k[k.length - 1], [" ", "#", "|"])) {
      k = "|" + k + "|";
    } else if (arry && /\s\s/.test(k)) {
      k = "|" + k + "|";
    }
    return k;
  };
  pretty = function(o, ind, visited) {
    var k, keyValue, kl, l, maxKey, v;
    if (opt.align) {
      maxKey = opt.indent;
      if (Object.keys(o).length > 1) {
        for (k in o) {
          v = o[k];
          if (o.hasOwnProperty(k)) {
            kl = parseInt(Math.ceil((k.length + 2) / opt.indent) * opt.indent);
            maxKey = Math.max(maxKey, kl);
            if (opt.maxalign && maxKey > opt.maxalign) {
              maxKey = opt.maxalign;
              break;
            }
          }
        }
      }
    }
    l = [];
    keyValue = function(k2, v2) {
      var i, ks, s, vs;
      s = ind;
      k2 = escape(k2, true);
      if (k2.indexOf("  ") > 0 && k2[0] !== "|") {
        k2 = `|${k2}|`;
      } else if (k2[0] !== "|" && k2[k2.length - 1] === "|") {
        k2 = "|" + k2;
      } else if (k2[0] === "|" && k2[k2.length - 1] !== "|") {
        k2 += "|";
      }
      if (opt.align) {
        ks = pad(k2, Math.max(maxKey, k2.length + 2));
        i = pad(ind + indstr, maxKey);
      } else {
        ks = pad(k2, k2.length + 2);
        i = ind + indstr;
      }
      s += ks;
      vs = toStr(v2, i, false, visited);
      if (vs[0] === "\n") {
        while (s[s.length - 1] === " ") {
          s = s.substr(0, s.length - 1);
        }
      }
      s += vs;
      while (s[s.length - 1] === " ") {
        s = s.substr(0, s.length - 1);
      }
      return s;
    };
    if (opt.sort) {
      var list = _k_9.list(Object.keys(o).sort());
      for (var _503_18_ = 0;_503_18_ < list.length; _503_18_++) {
        k = list[_503_18_];
        l.push(keyValue(k, o[k]));
      }
    } else {
      for (k in o) {
        v = o[k];
        if (o.hasOwnProperty(k)) {
          l.push(keyValue(k, v));
        }
      }
    }
    return l.join("\n");
  };
  toStr = function(o, ind = "", arry = false, visited = []) {
    var s, t, v, _538_32_, _542_37_;
    if (!(o != null)) {
      if (o === null) {
        return opt.null || arry && "null" || "";
      }
      if (o === undefined) {
        return "undefined";
      }
      return "<?>";
    }
    switch (t = typeof o) {
      case "string":
        return escape(o, arry);
      case "object":
        if (opt.circular) {
          if (_k_9.in(o, visited)) {
            return "<v>";
          }
          visited.push(o);
        }
        if ((o.constructor != null ? o.constructor.name : undefined) === "Array") {
          s = ind !== "" && arry && "." || "";
          if (o.length && ind !== "") {
            s += "\n";
          }
          s += function() {
            var r_541_69_ = [];
            var list = _k_9.list(o);
            for (var _541_69_ = 0;_541_69_ < list.length; _541_69_++) {
              v = list[_541_69_];
              r_541_69_.push(ind + toStr(v, ind + indstr, true, visited));
            }
            return r_541_69_;
          }.bind(this)().join("\n");
        } else if ((o.constructor != null ? o.constructor.name : undefined) === "RegExp") {
          return o.source;
        } else {
          s = arry && ".\n" || (ind !== "" && "\n" || "");
          s += pretty(o, ind, visited);
        }
        return s;
      default:
        return String(o);
    }
    return "<???>";
  };
  return toStr(obj);
};
parseStr = function(str, p, ext) {
  if (str.length <= 0) {
    return null;
  }
  switch (ext != null ? ext : (init_path(), __toCommonJS(exports_path)).extname(p)) {
    case ".json":
      return JSON.parse(str);
    default:
      return parse(str);
  }
};
load = function(p, ext, cb) {
  var str;
  if (_k_9.isFunc(ext)) {
    cb = ext;
  }
  if (_k_9.isFunc(cb)) {
    try {
      return slash_default.readText(p, function(str2) {
        if (!_k_9.empty(str2)) {
          return cb(parseStr(str2, p, ext));
        } else {
          console.error(`noon.load - empty file: ${p}`);
          return cb(null);
        }
      });
    } catch (err) {
      console.error(`noon.load - can't read file: ${p}`, err);
      return cb(null);
    }
  } else {
    try {
      str = (()=>{throw new Error(`Cannot require module "fs"`);})().readFileSync(p, "utf8");
      return parseStr(str, p, ext);
    } catch (err) {
      console.error("noon.load - " + String(err) + " " + p);
    }
  }
};
save = function(p, data, strOpt, cb) {
  var str;
  if (typeof strOpt === "function") {
    cb = strOpt;
    strOpt = {};
  } else {
    strOpt = strOpt != null ? strOpt : {};
  }
  str = stringify(data, Object.assign({ ext: path_default.extname(p), strOpt }));
  if (_k_9.isFunc(cb)) {
    return slash_default.writeText(p, str, cb);
  } else {
    console.error("noon.save - no callback!");
  }
};
var noon_default = { extnames: [".json", ".noon"], extensions: ["json", "noon"], save, load, parse, stringify };

// js/lib/kxk/title.js
init_slash();
var _k_10 = { in: function(a, l) {
  return (typeof l === "string" && typeof a === "string" && a.length ? "" : []).indexOf.call(l, a) >= 0;
}, empty: function(l) {
  return l === "" || l === null || l === undefined || l !== l || typeof l === "object" && Object.keys(l).length === 0;
}, isFunc: function(o) {
  return typeof o === "function";
}, isNum: function(o) {
  return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === (-Infinity));
}, isStr: function(o) {
  return typeof o === "string" || o instanceof String;
}, clone: function(o, v) {
  v ??= new Map;
  if (Array.isArray(o)) {
    if (!v.has(o)) {
      var r = [];
      v.set(o, r);
      for (var i = 0;i < o.length; i++) {
        if (!v.has(o[i])) {
          v.set(o[i], _k_10.clone(o[i], v));
        }
        r.push(v.get(o[i]));
      }
    }
    return v.get(o);
  } else if (typeof o == "string") {
    if (!v.has(o)) {
      v.set(o, "" + o);
    }
    return v.get(o);
  } else if (o != null && typeof o == "object" && o.constructor.name == "Object") {
    if (!v.has(o)) {
      var k, r = {};
      v.set(o, r);
      for (k in o) {
        if (!v.has(o[k])) {
          v.set(o[k], _k_10.clone(o[k], v));
        }
        r[k] = v.get(o[k]);
      }
    }
    return v.get(o);
  } else {
    return o;
  }
}, list: function(l) {
  return l != null ? typeof l.length === "number" ? l : [] : [];
} };
var $;
var elem5;
var stopEvent3;
var Title;
$ = dom_default.$;
stopEvent3 = dom_default.stopEvent;
elem5 = dom_default.elem;
Title = function() {
  function Title2(opt) {
    var imgSrc, pkg, _23_13_, _27_27_;
    this.opt = opt;
    this["openMenu"] = this["openMenu"].bind(this);
    this["toggleMenu"] = this["toggleMenu"].bind(this);
    this["hideMenu"] = this["hideMenu"].bind(this);
    this["showMenu"] = this["showMenu"].bind(this);
    this["menuVisible"] = this["menuVisible"].bind(this);
    this["onMenuAction"] = this["onMenuAction"].bind(this);
    this["onTitlebar"] = this["onTitlebar"].bind(this);
    this["onWindowBlur"] = this["onWindowBlur"].bind(this);
    this["onWindowFocus"] = this["onWindowFocus"].bind(this);
    this.opt = (_23_13_ = this.opt) != null ? _23_13_ : {};
    pkg = this.opt.pkg;
    this.elem = $((_27_27_ = this.opt.elem) != null ? _27_27_ : "#titlebar");
    this.elem.classList.add("focus");
    if (!this.elem) {
      return;
    }
    post_default.on("titlebar", this.onTitlebar);
    post_default.on("menuAction", this.onMenuAction);
    post_default.on("window.blur", this.onWindowBlur);
    post_default.on("window.focus", this.onWindowFocus);
    this.elem.addEventListener("dblclick", function(event) {
      stopEvent3(event);
      return post_default.emit("menuAction", "Maximize");
    });
    this.winicon = elem5({ class: "winicon" });
    if (this.opt.icon) {
      imgSrc = slash_default.join(this.opt.dir, this.opt.icon);
      this.winicon.appendChild(elem5("img", { src: imgSrc }));
    }
    this.elem.appendChild(this.winicon);
    this.winicon.addEventListener("click", function() {
      return post_default.emit("menuAction", "Open Menu");
    });
    this.title = elem5({ class: "titlebar-title app-drag-region", id: "title" });
    this.elem.appendChild(this.title);
    this.setTitle(this.opt);
    this.minimize = elem5({ class: "winbutton minimize gray" });
    this.minimize.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -8 30 30">
    <line x1="-1" y1="5" x2="11" y2="5"></line>
</svg>`;
    this.elem.appendChild(this.minimize);
    this.minimize.addEventListener("click", function() {
      return post_default.emit("menuAction", "Minimize");
    });
    this.maximize = elem5({ class: "winbutton maximize gray" });
    this.maximize.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -9 30 30">
  <rect width="11" height="11" style="fill-opacity: 0;"></rect>
</svg>`;
    this.elem.appendChild(this.maximize);
    this.maximize.addEventListener("click", function() {
      return post_default.emit("menuAction", "Maximize");
    });
    this.close = elem5({ class: "winbutton close" });
    this.close.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -9 30 30">
    <line x1="0" y1="0" x2="10" y2="11"></line>
    <line x1="10" y1="0" x2="0" y2="11"></line>
</svg>`;
    this.elem.appendChild(this.close);
    this.close.addEventListener("click", function() {
      return post_default.emit("menuAction", "Close");
    });
    this.topframe = elem5({ class: "topframe" });
    this.elem.appendChild(this.topframe);
    this.initMenu();
  }
  Title2.prototype["pushElem"] = function(elem6) {
    return this.elem.insertBefore(elem6, this.minimize);
  };
  Title2.prototype["showTitle"] = function() {
    return this.title.style.display = "initial";
  };
  Title2.prototype["hideTitle"] = function() {
    return this.title.style.display = "none";
  };
  Title2.prototype["onWindowFocus"] = function() {
    this.elem.classList.remove("blur");
    return this.elem.classList.add("focus");
  };
  Title2.prototype["onWindowBlur"] = function() {
    this.elem.classList.remove("focus");
    return this.elem.classList.add("blur");
  };
  Title2.prototype["setTitle"] = function(opt) {
    var html, parts, _123_26_;
    html = "";
    parts = (_123_26_ = opt.title) != null ? _123_26_ : [];
    if (opt.pkg) {
      if (opt.pkg.name && _k_10.in("name", parts)) {
        html += `<span class='titlebar-name'>${opt.pkg.name}</span>`;
      }
      if (opt.pkg.version && _k_10.in("version", parts)) {
        html += `<span class='titlebar-dot'>${opt.pkg.version}</span>`;
      }
      if (opt.pkg.path && _k_10.in("path", parts)) {
        html += "<span class='titlebar-dot'> \u25BA </span>";
        html += `<span class='titlebar-name'>${opt.pkg.path}</span>`;
      }
    }
    return this.title.innerHTML = html;
  };
  Title2.prototype["onTitlebar"] = function(action) {
    switch (action) {
      case "showTitle":
        return this.showTitle();
      case "hideTitle":
        return this.hideTitle();
      case "showMenu":
        return this.showMenu();
      case "hideMenu":
        return this.hideMenu();
      case "toggleMenu":
        return this.toggleMenu();
    }
  };
  Title2.prototype["onMenuAction"] = function(action) {
    switch (action.toLowerCase()) {
      case "toggle menu":
        return this.toggleMenu();
      case "open menu":
        return this.openMenu();
      case "show menu":
        return this.showMenu();
      case "hide menu":
        return this.hideMenu();
    }
  };
  Title2.prototype["initMenu"] = function() {
    if (!this.opt.menu) {
      return [];
    }
    if (_k_10.empty(this.templateCache)) {
      return noon_default.load(this.opt.menu, function(tc) {
        var _176_40_;
        if (!_k_10.empty(tc)) {
          this.templateCache = this.makeTemplate(tc);
          if (this.opt.menuTemplate != null && _k_10.isFunc(this.opt.menuTemplate)) {
            this.templateCache = this.opt.menuTemplate(this.templateCache);
          }
          return this.initFromCache();
        } else {
          console.error("title.initMenu - empty template?", this.opt.menu);
        }
      }.bind(this));
    } else {
      return this.initFromCache();
    }
  };
  Title2.prototype["initFromCache"] = function() {
    this.menu = new menu_default({ items: this.templateCache });
    return this.elem.insertBefore(this.menu.elem, this.elem.firstChild.nextSibling);
  };
  Title2.prototype["makeTemplate"] = function(obj) {
    var menuOrAccel, text, tmpl;
    tmpl = [];
    for (text in obj) {
      menuOrAccel = obj[text];
      tmpl.push(function() {
        var item, _206_33_, _206_57_;
        if (_k_10.empty(menuOrAccel) && text.startsWith("-")) {
          return { text: "" };
        } else if (_k_10.isNum(menuOrAccel)) {
          return { text, accel: kstr(menuOrAccel) };
        } else if (_k_10.isStr(menuOrAccel)) {
          return { text, accel: keyinfo_default.convertCmdCtrl(menuOrAccel) };
        } else if (_k_10.empty(menuOrAccel)) {
          return { text, accel: "" };
        } else if (menuOrAccel.accel != null || menuOrAccel.command != null) {
          item = _k_10.clone(menuOrAccel);
          item.text = text;
          return item;
        } else {
          return { text, menu: this.makeTemplate(menuOrAccel) };
        }
      }.bind(this)());
    }
    return tmpl;
  };
  Title2.prototype["refreshMenu"] = function() {
    this.menu.del();
    return this.initMenu();
  };
  Title2.prototype["menuVisible"] = function() {
    return this.menu.elem.style.display !== "none";
  };
  Title2.prototype["showMenu"] = function() {
    var _221_68_, _221_75_;
    this.menu.elem.style.display = "inline-block";
    return (_221_68_ = this.menu) != null ? typeof (_221_75_ = _221_68_.focus) === "function" ? _221_75_() : undefined : undefined;
  };
  Title2.prototype["hideMenu"] = function() {
    var _222_25_;
    this.menu != null && this.menu.close();
    return this.menu.elem.style.display = "none";
  };
  Title2.prototype["toggleMenu"] = function() {
    if (this.menuVisible()) {
      return this.hideMenu();
    } else {
      return this.showMenu();
    }
  };
  Title2.prototype["openMenu"] = function() {
    if (this.menuVisible()) {
      return this.hideMenu();
    } else {
      this.showMenu();
      return this.menu.open();
    }
  };
  Title2.prototype["handleKeyInfo"] = function(modKeyComboEvent) {
    var accels, action, combo, combos, event, item, key, keypath, menu2, mod, _257_37_;
    mod = modKeyComboEvent.mod;
    key = modKeyComboEvent.key;
    combo = modKeyComboEvent.combo;
    event = modKeyComboEvent.event;
    if (_k_10.empty(combo)) {
      return "unhandled";
    }
    menu2 = this.templateCache;
    if (_k_10.empty(menu2)) {
      console.log("no menu");
      return "unhandled";
    }
    accels = sds_default.find.key(menu2, "accel");
    combos = sds_default.find.key(menu2, "combo");
    var list = _k_10.list(combos.concat(accels));
    for (var _251_20_ = 0;_251_20_ < list.length; _251_20_++) {
      keypath = list[_251_20_];
      combos = sds_default.get(menu2, keypath).split(" ");
      combos = combos.map(function(c) {
        return keyinfo_default.convertCmdCtrl(c);
      });
      if (_k_10.in(combo, combos)) {
        keypath.pop();
        item = sds_default.get(menu2, keypath);
        action = (_257_37_ = item.action) != null ? _257_37_ : item.text;
        post_default.emit("menuAction", action);
        return action;
      }
    }
    return "unhandled";
  };
  return Title2;
}();
var title_default = Title;

// js/lib/kxk/win.js
var $2;
var stopEvent4;
var Window;
$2 = dom_default.$;
stopEvent4 = dom_default.stopEvent;
Window = function() {
  function Window2() {
    var main;
    this["onKeyUp"] = this["onKeyUp"].bind(this);
    this["onKeyDown"] = this["onKeyDown"].bind(this);
    this["onMenuAction"] = this["onMenuAction"].bind(this);
    this["onWindowBlur"] = this["onWindowBlur"].bind(this);
    this["onWindowFocus"] = this["onWindowFocus"].bind(this);
    this["onResize"] = this["onResize"].bind(this);
    this["animate"] = this["animate"].bind(this);
    post_default.on("menuAction", this.onMenuAction);
    post_default.on("window.blur", this.onWindowBlur);
    post_default.on("window.focusd", this.onWindowFocus);
    window.titlebar = new title_default({ icon: kakao.bundle.img("menu.png"), menu: kakao.bundle.res("menu.noon") });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);
    window.requestAnimationFrame(this.animate);
    main = $2("main");
    main.focus();
    kakao.request("window.id").then(function(id) {
      return elem_default({ class: "test", text: `window.id ${id}`, parent: main });
    }.bind(this));
  }
  Window2.prototype["animate"] = function() {
    var delta, fps, now;
    window.requestAnimationFrame(this.animate);
    now = window.performance.now();
    delta = now - this.lastAnimationTime;
    this.lastAnimationTime = now;
    fps = parseInt(1000 / delta);
    if (fps < 20) {
      return kakao.send("window.framerateDrop", fps);
    }
  };
  Window2.prototype["createWindow"] = function() {
  };
  Window2.prototype["onResize"] = function(event) {
  };
  Window2.prototype["onWindowFocus"] = function() {
  };
  Window2.prototype["onWindowBlur"] = function() {
  };
  Window2.prototype["onMenuAction"] = function(action) {
    console.log("menuAction", action);
    switch (action.toLowerCase()) {
      case "focus next":
        kakao.send("window.focusNext");
        break;
      case "focus previous":
        kakao.send("window.focusPrev");
        break;
      case "new window":
        kakao.send("window.new");
        break;
      case "maximize":
        kakao.send("window.maximize");
        break;
      case "minimize":
        kakao.send("window.minimize");
        break;
      case "screenshot":
        kakao.send("window.snapshot");
        break;
      case "close":
        kakao.send("window.close");
        break;
      case "reload":
        kakao.send("window.reload");
        break;
      case "quit":
        kakao.send("app.quit");
        break;
      case "about":
        kakao.send("window.new", "about.html");
        break;
    }
    return 0;
  };
  Window2.prototype["onKeyDown"] = function(event) {
    var info;
    stopEvent4(event);
    info = keyinfo_default.forEvent(event);
    info.event = event;
    if (window.titlebar.handleKeyInfo(info) === "unhandled") {
      console.log("keydown", info);
    }
  };
  Window2.prototype["onKeyUp"] = function(event) {
    var info;
    info = keyinfo_default.forEvent(event);
    return info.event = event;
  };
  return Window2;
}();
var win_default = Window;

// js/lib/kxk/kxk.js
var kxk_default = { win: win_default, dom: dom_default, elem: elem_default, post: post_default };

// js/lib/kakao.js
var Kakao;
Kakao = function() {
  function Kakao2() {
  }
  Kakao2["init"] = function(cb) {
    return Kakao2.request("bundle.path").then(function(bundlePath) {
      bundle_default.path = bundlePath;
      return cb(bundlePath);
    });
  };
  Kakao2["send"] = function(route, ...args) {
    return window.webkit.messageHandlers.kakao.postMessage({ route, args });
  };
  Kakao2["request"] = function(route, ...args) {
    return window.webkit.messageHandlers.kakao_request.postMessage({ route, args });
  };
  Kakao2["receive"] = function(msg) {
    return kxk_default.post.emit(msg);
  };
  Kakao2["bundle"] = bundle_default;
  Kakao2["window"] = kxk_default.win;
  Kakao2["dom"] = kxk_default.dom;
  Kakao2["post"] = kxk_default.post;
  return Kakao2;
}();
window.kakao = Kakao;
var kakao_default = Kakao;

// js/main.js
kakao_default.init(function() {
  return new kakao_default.window;
});

//# debugId=0933A37E563FDED364756e2164756e21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsianMvbGliL2t4ay9vcy5qcyIsICJub2RlOnBhdGgiLCAianMvbGliL2t4ay9wYXRoLmpzIiwgImpzL2xpYi9reGsvZGlybGlzdC5qcyIsICJqcy9saWIva3hrL3NsYXNoLmpzIiwgImpzL2xpYi9idW5kbGUuanMiLCAianMvbGliL2t4ay9lbGVtLmpzIiwgImpzL2xpYi9reGsvZG9tLmpzIiwgImpzL2xpYi9reGsvcG9zdC5qcyIsICJqcy9saWIva3hrL2tleWluZm8uanMiLCAianMvbGliL2t4ay9zZHMuanMiLCAianMvbGliL2t4ay9wb3B1cC5qcyIsICJqcy9saWIva3hrL3BvcHVwLmpzIiwgImpzL2xpYi9reGsvcG9wdXAuanMiLCAianMvbGliL2t4ay9tZW51LmpzIiwgImpzL2xpYi9reGsvbm9vbi5qcyIsICJqcy9saWIva3hrL3RpdGxlLmpzIiwgImpzL2xpYi9reGsvdGl0bGUuanMiLCAianMvbGliL2t4ay93aW4uanMiLCAianMvbGliL2t4ay9reGsuanMiLCAianMvbGliL2tha2FvLmpzIiwgImpzL21haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gbW9uc3RlcmtvZGkva29kZSAwLjI1Ni4wXG5cbnZhciBfa19cblxudmFyIG9zXG5cblxub3MgPSAoZnVuY3Rpb24gKClcbntcbiAgICBmdW5jdGlvbiBvcyAoKVxuICAgIHt9XG5cbiAgICBvc1tcImhvbWVkaXJcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICcvVXNlcnMva29kaSdcbiAgICB9XG5cbiAgICBvc1tcInBsYXRmb3JtXCJdID0gJ0RhcndpbidcbiAgICBvc1tcImlzTWFjXCJdID0gb3MucGxhdGZvcm0gPT09ICdEYXJ3aW4nXG4gICAgcmV0dXJuIG9zXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IG9zOyIsCiAgInZhciBMPU9iamVjdC5jcmVhdGU7dmFyIGI9T2JqZWN0LmRlZmluZVByb3BlcnR5O3ZhciB6PU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7dmFyIEQ9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7dmFyIFQ9T2JqZWN0LmdldFByb3RvdHlwZU9mLFI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTt2YXIgXz0oZixlKT0+KCk9PihlfHxmKChlPXtleHBvcnRzOnt9fSkuZXhwb3J0cyxlKSxlLmV4cG9ydHMpLEU9KGYsZSk9Pntmb3IodmFyIHIgaW4gZSliKGYscix7Z2V0OmVbcl0sZW51bWVyYWJsZTohMH0pfSxDPShmLGUscixsKT0+e2lmKGUmJnR5cGVvZiBlPT1cIm9iamVjdFwifHx0eXBlb2YgZT09XCJmdW5jdGlvblwiKWZvcihsZXQgaSBvZiBEKGUpKSFSLmNhbGwoZixpKSYmaSE9PXImJmIoZixpLHtnZXQ6KCk9PmVbaV0sZW51bWVyYWJsZTohKGw9eihlLGkpKXx8bC5lbnVtZXJhYmxlfSk7cmV0dXJuIGZ9LEE9KGYsZSxyKT0+KEMoZixlLFwiZGVmYXVsdFwiKSxyJiZDKHIsZSxcImRlZmF1bHRcIikpLHk9KGYsZSxyKT0+KHI9ZiE9bnVsbD9MKFQoZikpOnt9LEMoZXx8IWZ8fCFmLl9fZXNNb2R1bGU/YihyLFwiZGVmYXVsdFwiLHt2YWx1ZTpmLGVudW1lcmFibGU6ITB9KTpyLGYpKTt2YXIgaD1fKChGLFMpPT57XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYyhmKXtpZih0eXBlb2YgZiE9XCJzdHJpbmdcIil0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCBcIitKU09OLnN0cmluZ2lmeShmKSl9ZnVuY3Rpb24gdyhmLGUpe2Zvcih2YXIgcj1cIlwiLGw9MCxpPS0xLHM9MCxuLHQ9MDt0PD1mLmxlbmd0aDsrK3Qpe2lmKHQ8Zi5sZW5ndGgpbj1mLmNoYXJDb2RlQXQodCk7ZWxzZXtpZihuPT09NDcpYnJlYWs7bj00N31pZihuPT09NDcpe2lmKCEoaT09PXQtMXx8cz09PTEpKWlmKGkhPT10LTEmJnM9PT0yKXtpZihyLmxlbmd0aDwyfHxsIT09Mnx8ci5jaGFyQ29kZUF0KHIubGVuZ3RoLTEpIT09NDZ8fHIuY2hhckNvZGVBdChyLmxlbmd0aC0yKSE9PTQ2KXtpZihyLmxlbmd0aD4yKXt2YXIgYT1yLmxhc3RJbmRleE9mKFwiL1wiKTtpZihhIT09ci5sZW5ndGgtMSl7YT09PS0xPyhyPVwiXCIsbD0wKToocj1yLnNsaWNlKDAsYSksbD1yLmxlbmd0aC0xLXIubGFzdEluZGV4T2YoXCIvXCIpKSxpPXQscz0wO2NvbnRpbnVlfX1lbHNlIGlmKHIubGVuZ3RoPT09Mnx8ci5sZW5ndGg9PT0xKXtyPVwiXCIsbD0wLGk9dCxzPTA7Y29udGludWV9fWUmJihyLmxlbmd0aD4wP3IrPVwiLy4uXCI6cj1cIi4uXCIsbD0yKX1lbHNlIHIubGVuZ3RoPjA/cis9XCIvXCIrZi5zbGljZShpKzEsdCk6cj1mLnNsaWNlKGkrMSx0KSxsPXQtaS0xO2k9dCxzPTB9ZWxzZSBuPT09NDYmJnMhPT0tMT8rK3M6cz0tMX1yZXR1cm4gcn1mdW5jdGlvbiBKKGYsZSl7dmFyIHI9ZS5kaXJ8fGUucm9vdCxsPWUuYmFzZXx8KGUubmFtZXx8XCJcIikrKGUuZXh0fHxcIlwiKTtyZXR1cm4gcj9yPT09ZS5yb290P3IrbDpyK2YrbDpsfXZhciBnPXtyZXNvbHZlOmZ1bmN0aW9uKCl7Zm9yKHZhciBlPVwiXCIscj0hMSxsLGk9YXJndW1lbnRzLmxlbmd0aC0xO2k+PS0xJiYhcjtpLS0pe3ZhciBzO2k+PTA/cz1hcmd1bWVudHNbaV06KGw9PT12b2lkIDAmJihsPXByb2Nlc3MuY3dkKCkpLHM9bCksYyhzKSxzLmxlbmd0aCE9PTAmJihlPXMrXCIvXCIrZSxyPXMuY2hhckNvZGVBdCgwKT09PTQ3KX1yZXR1cm4gZT13KGUsIXIpLHI/ZS5sZW5ndGg+MD9cIi9cIitlOlwiL1wiOmUubGVuZ3RoPjA/ZTpcIi5cIn0sbm9ybWFsaXplOmZ1bmN0aW9uKGUpe2lmKGMoZSksZS5sZW5ndGg9PT0wKXJldHVyblwiLlwiO3ZhciByPWUuY2hhckNvZGVBdCgwKT09PTQ3LGw9ZS5jaGFyQ29kZUF0KGUubGVuZ3RoLTEpPT09NDc7cmV0dXJuIGU9dyhlLCFyKSxlLmxlbmd0aD09PTAmJiFyJiYoZT1cIi5cIiksZS5sZW5ndGg+MCYmbCYmKGUrPVwiL1wiKSxyP1wiL1wiK2U6ZX0saXNBYnNvbHV0ZTpmdW5jdGlvbihlKXtyZXR1cm4gYyhlKSxlLmxlbmd0aD4wJiZlLmNoYXJDb2RlQXQoMCk9PT00N30sam9pbjpmdW5jdGlvbigpe2lmKGFyZ3VtZW50cy5sZW5ndGg9PT0wKXJldHVyblwiLlwiO2Zvcih2YXIgZSxyPTA7cjxhcmd1bWVudHMubGVuZ3RoOysrcil7dmFyIGw9YXJndW1lbnRzW3JdO2MobCksbC5sZW5ndGg+MCYmKGU9PT12b2lkIDA/ZT1sOmUrPVwiL1wiK2wpfXJldHVybiBlPT09dm9pZCAwP1wiLlwiOmcubm9ybWFsaXplKGUpfSxyZWxhdGl2ZTpmdW5jdGlvbihlLHIpe2lmKGMoZSksYyhyKSxlPT09cnx8KGU9Zy5yZXNvbHZlKGUpLHI9Zy5yZXNvbHZlKHIpLGU9PT1yKSlyZXR1cm5cIlwiO2Zvcih2YXIgbD0xO2w8ZS5sZW5ndGgmJmUuY2hhckNvZGVBdChsKT09PTQ3OysrbCk7Zm9yKHZhciBpPWUubGVuZ3RoLHM9aS1sLG49MTtuPHIubGVuZ3RoJiZyLmNoYXJDb2RlQXQobik9PT00NzsrK24pO2Zvcih2YXIgdD1yLmxlbmd0aCxhPXQtbix2PXM8YT9zOmEsdT0tMSxvPTA7bzw9djsrK28pe2lmKG89PT12KXtpZihhPnYpe2lmKHIuY2hhckNvZGVBdChuK28pPT09NDcpcmV0dXJuIHIuc2xpY2UobitvKzEpO2lmKG89PT0wKXJldHVybiByLnNsaWNlKG4rbyl9ZWxzZSBzPnYmJihlLmNoYXJDb2RlQXQobCtvKT09PTQ3P3U9bzpvPT09MCYmKHU9MCkpO2JyZWFrfXZhciBrPWUuY2hhckNvZGVBdChsK28pLFA9ci5jaGFyQ29kZUF0KG4rbyk7aWYoayE9PVApYnJlYWs7az09PTQ3JiYodT1vKX12YXIgZD1cIlwiO2ZvcihvPWwrdSsxO288PWk7KytvKShvPT09aXx8ZS5jaGFyQ29kZUF0KG8pPT09NDcpJiYoZC5sZW5ndGg9PT0wP2QrPVwiLi5cIjpkKz1cIi8uLlwiKTtyZXR1cm4gZC5sZW5ndGg+MD9kK3Iuc2xpY2Uobit1KToobis9dSxyLmNoYXJDb2RlQXQobik9PT00NyYmKytuLHIuc2xpY2UobikpfSxfbWFrZUxvbmc6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LGRpcm5hbWU6ZnVuY3Rpb24oZSl7aWYoYyhlKSxlLmxlbmd0aD09PTApcmV0dXJuXCIuXCI7Zm9yKHZhciByPWUuY2hhckNvZGVBdCgwKSxsPXI9PT00NyxpPS0xLHM9ITAsbj1lLmxlbmd0aC0xO24+PTE7LS1uKWlmKHI9ZS5jaGFyQ29kZUF0KG4pLHI9PT00Nyl7aWYoIXMpe2k9bjticmVha319ZWxzZSBzPSExO3JldHVybiBpPT09LTE/bD9cIi9cIjpcIi5cIjpsJiZpPT09MT9cIi8vXCI6ZS5zbGljZSgwLGkpfSxiYXNlbmFtZTpmdW5jdGlvbihlLHIpe2lmKHIhPT12b2lkIDAmJnR5cGVvZiByIT1cInN0cmluZ1wiKXRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZXh0XCIgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO2MoZSk7dmFyIGw9MCxpPS0xLHM9ITAsbjtpZihyIT09dm9pZCAwJiZyLmxlbmd0aD4wJiZyLmxlbmd0aDw9ZS5sZW5ndGgpe2lmKHIubGVuZ3RoPT09ZS5sZW5ndGgmJnI9PT1lKXJldHVyblwiXCI7dmFyIHQ9ci5sZW5ndGgtMSxhPS0xO2ZvcihuPWUubGVuZ3RoLTE7bj49MDstLW4pe3ZhciB2PWUuY2hhckNvZGVBdChuKTtpZih2PT09NDcpe2lmKCFzKXtsPW4rMTticmVha319ZWxzZSBhPT09LTEmJihzPSExLGE9bisxKSx0Pj0wJiYodj09PXIuY2hhckNvZGVBdCh0KT8tLXQ9PT0tMSYmKGk9bik6KHQ9LTEsaT1hKSl9cmV0dXJuIGw9PT1pP2k9YTppPT09LTEmJihpPWUubGVuZ3RoKSxlLnNsaWNlKGwsaSl9ZWxzZXtmb3Iobj1lLmxlbmd0aC0xO24+PTA7LS1uKWlmKGUuY2hhckNvZGVBdChuKT09PTQ3KXtpZighcyl7bD1uKzE7YnJlYWt9fWVsc2UgaT09PS0xJiYocz0hMSxpPW4rMSk7cmV0dXJuIGk9PT0tMT9cIlwiOmUuc2xpY2UobCxpKX19LGV4dG5hbWU6ZnVuY3Rpb24oZSl7YyhlKTtmb3IodmFyIHI9LTEsbD0wLGk9LTEscz0hMCxuPTAsdD1lLmxlbmd0aC0xO3Q+PTA7LS10KXt2YXIgYT1lLmNoYXJDb2RlQXQodCk7aWYoYT09PTQ3KXtpZighcyl7bD10KzE7YnJlYWt9Y29udGludWV9aT09PS0xJiYocz0hMSxpPXQrMSksYT09PTQ2P3I9PT0tMT9yPXQ6biE9PTEmJihuPTEpOnIhPT0tMSYmKG49LTEpfXJldHVybiByPT09LTF8fGk9PT0tMXx8bj09PTB8fG49PT0xJiZyPT09aS0xJiZyPT09bCsxP1wiXCI6ZS5zbGljZShyLGkpfSxmb3JtYXQ6ZnVuY3Rpb24oZSl7aWYoZT09PW51bGx8fHR5cGVvZiBlIT1cIm9iamVjdFwiKXRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInBhdGhPYmplY3RcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcrdHlwZW9mIGUpO3JldHVybiBKKFwiL1wiLGUpfSxwYXJzZTpmdW5jdGlvbihlKXtjKGUpO3ZhciByPXtyb290OlwiXCIsZGlyOlwiXCIsYmFzZTpcIlwiLGV4dDpcIlwiLG5hbWU6XCJcIn07aWYoZS5sZW5ndGg9PT0wKXJldHVybiByO3ZhciBsPWUuY2hhckNvZGVBdCgwKSxpPWw9PT00NyxzO2k/KHIucm9vdD1cIi9cIixzPTEpOnM9MDtmb3IodmFyIG49LTEsdD0wLGE9LTEsdj0hMCx1PWUubGVuZ3RoLTEsbz0wO3U+PXM7LS11KXtpZihsPWUuY2hhckNvZGVBdCh1KSxsPT09NDcpe2lmKCF2KXt0PXUrMTticmVha31jb250aW51ZX1hPT09LTEmJih2PSExLGE9dSsxKSxsPT09NDY/bj09PS0xP249dTpvIT09MSYmKG89MSk6biE9PS0xJiYobz0tMSl9cmV0dXJuIG49PT0tMXx8YT09PS0xfHxvPT09MHx8bz09PTEmJm49PT1hLTEmJm49PT10KzE/YSE9PS0xJiYodD09PTAmJmk/ci5iYXNlPXIubmFtZT1lLnNsaWNlKDEsYSk6ci5iYXNlPXIubmFtZT1lLnNsaWNlKHQsYSkpOih0PT09MCYmaT8oci5uYW1lPWUuc2xpY2UoMSxuKSxyLmJhc2U9ZS5zbGljZSgxLGEpKTooci5uYW1lPWUuc2xpY2UodCxuKSxyLmJhc2U9ZS5zbGljZSh0LGEpKSxyLmV4dD1lLnNsaWNlKG4sYSkpLHQ+MD9yLmRpcj1lLnNsaWNlKDAsdC0xKTppJiYoci5kaXI9XCIvXCIpLHJ9LHNlcDpcIi9cIixkZWxpbWl0ZXI6XCI6XCIsd2luMzI6bnVsbCxwb3NpeDpudWxsfTtnLnBvc2l4PWc7Uy5leHBvcnRzPWd9KTt2YXIgbT17fTtFKG0se2RlZmF1bHQ6KCk9PnF9KTtBKG0seShoKCkpKTt2YXIgcT15KGgoKSk7ZXhwb3J0e3EgYXMgZGVmYXVsdH07XG4iLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rXyA9IHtpc1N0cjogZnVuY3Rpb24gKG8pIHtyZXR1cm4gdHlwZW9mIG8gPT09ICdzdHJpbmcnIHx8IG8gaW5zdGFuY2VvZiBTdHJpbmd9fVxuXG52YXIgQ0hBUl9CQUNLV0FSRF9TTEFTSCwgQ0hBUl9ET1QsIENIQVJfRk9SV0FSRF9TTEFTSCwgaXNQYXRoU2VwYXJhdG9yLCBpc1Bvc2l4UGF0aFNlcGFyYXRvciwgam9pbiwgbm9ybWFsaXplU3RyaW5nLCBzZXAsIHRvRXhwb3J0XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG50b0V4cG9ydCA9IHBhdGhcbmlmIChmYWxzZSlcbntcbiAgICBDSEFSX0ZPUldBUkRfU0xBU0ggPSAnLycuY2hhckNvZGVBdCgwKVxuICAgIENIQVJfQkFDS1dBUkRfU0xBU0ggPSAnXFxcXCcuY2hhckNvZGVBdCgwKVxuICAgIENIQVJfRE9UID0gJy4nLmNoYXJDb2RlQXQoMClcbiAgICBpc1Bvc2l4UGF0aFNlcGFyYXRvciA9IGZ1bmN0aW9uIChjKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGMgPT09IENIQVJfRk9SV0FSRF9TTEFTSFxuICAgIH1cbiAgICBpc1BhdGhTZXBhcmF0b3IgPSBmdW5jdGlvbiAoYylcbiAgICB7XG4gICAgICAgIHJldHVybiBjID09PSBDSEFSX0ZPUldBUkRfU0xBU0ggfHwgYyA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSFxuICAgIH1cbiAgICBub3JtYWxpemVTdHJpbmcgPSBmdW5jdGlvbiAocGF0aCwgaXNBYnNvbHV0ZSwgc2VwYXJhdG9yLCBpc1BhdGhTZXBhcmF0b3IpXG4gICAge1xuICAgICAgICB2YXIgY29kZSwgZG90cywgaSwgbGFzdFNlZ21lbnRMZW5ndGgsIGxhc3RTbGFzaCwgbGFzdFNsYXNoSW5kZXgsIHJlc1xuXG4gICAgICAgIHJlcyA9ICcnXG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMFxuICAgICAgICBsYXN0U2xhc2ggPSAtMVxuICAgICAgICBkb3RzID0gMFxuICAgICAgICBjb2RlID0gMFxuICAgICAgICBmb3IgKHZhciBfMzhfMTdfID0gaSA9IDAsIF8zOF8yMF8gPSBwYXRoLmxlbmd0aDsgKF8zOF8xN18gPD0gXzM4XzIwXyA/IGkgPD0gcGF0aC5sZW5ndGggOiBpID49IHBhdGgubGVuZ3RoKTsgKF8zOF8xN18gPD0gXzM4XzIwXyA/ICsraSA6IC0taSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChpIDwgcGF0aC5sZW5ndGgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNQYXRoU2VwYXJhdG9yKGNvZGUpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29kZSA9IENIQVJfRk9SV0FSRF9TTEFTSFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzUGF0aFNlcGFyYXRvcihjb2RlKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFNsYXNoID09PSBpIC0gMSB8fCBkb3RzID09PSAxKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChkb3RzID09PSAyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChyZXMubGVuZ3RoIDwgMiB8fCBsYXN0U2VnbWVudExlbmd0aCAhPT0gMiB8fCByZXMuY2hhckNvZGVBdChyZXMubGVuZ3RoIC0gMSkgIT09IENIQVJfRE9UIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAyKSAhPT0gQ0hBUl9ET1QpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDIpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNsYXNoSW5kZXggPSByZXMubGFzdEluZGV4T2Yoc2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLnNsaWNlKDAsbGFzdFNsYXNoSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gcmVzLmxlbmd0aCAtIDEgLSByZXMubGFzdEluZGV4T2Yoc2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2xhc2ggPSBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90cyA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzLmxlbmd0aCAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Fic29sdXRlKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gKHJlcy5sZW5ndGggPiAwID8gYCR7c2VwYXJhdG9yfS4uYCA6ICcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSBgJHtzZXBhcmF0b3J9JHtwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsaSl9YFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLGkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSBpIC0gbGFzdFNsYXNoIC0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0U2xhc2ggPSBpXG4gICAgICAgICAgICAgICAgZG90cyA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IENIQVJfRE9UICYmIGRvdHMgIT09IC0xKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRvdHMrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRvdHMgPSAtMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgam9pbiA9IGZ1bmN0aW9uIChsaXN0KVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2pvaW4nLGxpc3QpXG4gICAgfVxuICAgIHNlcCA9ICcvJ1xuICAgIHRvRXhwb3J0ID0ge3NlcDpzZXAsaXNBYnNvbHV0ZTpmdW5jdGlvbiAocGF0aClcbiAgICB7XG4gICAgICAgIHJldHVybiBwYXRoWzBdID09PSBzZXBcbiAgICB9LGpvaW46ZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHJldHVybiBqb2luKGFyZ3VtZW50cylcbiAgICB9LG5vcm1hbGl6ZTpmdW5jdGlvbiAocGF0aClcbiAgICB7XG4gICAgICAgIHZhciBpc0Fic29sdXRlLCB0cmFpbGluZ1NlcGFyYXRvclxuXG4gICAgICAgIGlmICghKF9rXy5pc1N0cihwYXRoKSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgfVxuICAgICAgICBpc0Fic29sdXRlID0gaXNQYXRoU2VwYXJhdG9yKHBhdGguY2hhckNvZGVBdCgwKSlcbiAgICAgICAgdHJhaWxpbmdTZXBhcmF0b3IgPSBpc1BhdGhTZXBhcmF0b3IocGF0aC5jaGFyQ29kZUF0KHBhdGgubGVuZ3RoIC0gMSkpXG4gICAgICAgIHBhdGggPSBub3JtYWxpemVTdHJpbmcocGF0aCxpc0Fic29sdXRlLCcvJyxpc1BhdGhTZXBhcmF0b3IpXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGlzQWJzb2x1dGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcvJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICh0cmFpbGluZ1NlcGFyYXRvciA/ICcuLycgOiAnLicpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYWlsaW5nU2VwYXJhdG9yKVxuICAgICAgICB7XG4gICAgICAgICAgICBwYXRoICs9ICcvJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoaXNBYnNvbHV0ZSA/IGAvJHtwYXRofWAgOiBwYXRoKVxuICAgIH19XG59XG5leHBvcnQgZGVmYXVsdCB0b0V4cG9ydDsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rXyA9IHtsaXN0OiBmdW5jdGlvbiAobCkge3JldHVybiBsICE9IG51bGwgPyB0eXBlb2YgbC5sZW5ndGggPT09ICdudW1iZXInID8gbCA6IFtdIDogW119fVxuXG52YXIgZGlybGlzdCwgbGlzdGRpclxuXG5pbXBvcnQgc2xhc2ggZnJvbSAnLi9zbGFzaC5qcydcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcydcblxubGlzdGRpciA9IGFzeW5jIGZ1bmN0aW9uIChkaXIsIGZvdW5kKVxue1xuICAgIHZhciBhYnNQYXRoLCBmaWxlLCBmaWxlcywgaXNEaXIsIHN0YXRcblxuICAgIGZpbGVzID0gYXdhaXQgZnMucmVhZGRpcihkaXIpXG4gICAgdmFyIGxpc3QgPSBfa18ubGlzdChmaWxlcylcbiAgICBmb3IgKHZhciBfMjRfMTNfID0gMDsgXzI0XzEzXyA8IGxpc3QubGVuZ3RoOyBfMjRfMTNfKyspXG4gICAge1xuICAgICAgICBmaWxlID0gbGlzdFtfMjRfMTNfXVxuICAgICAgICBzdGF0ID0gYXdhaXQgZnMuc3RhdChzbGFzaC5qb2luKGRpcixmaWxlKSlcbiAgICAgICAgaXNEaXIgPSBzdGF0Lm1vZGUgJiAwbzA0MDAwMFxuICAgICAgICBhYnNQYXRoID0gZGlyICsgJy8nICsgZmlsZVxuICAgICAgICBmb3VuZC5wdXNoKHt0eXBlOihpc0RpciA/ICdkaXInIDogJ2ZpbGUnKSxuYW1lOmZpbGUscGF0aDphYnNQYXRofSlcbiAgICAgICAgaWYgKGlzRGlyKVxuICAgICAgICB7XG4gICAgICAgICAgICBhd2FpdCBsaXN0ZGlyKGFic1BhdGgsZm91bmQpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG59XG5cbmRpcmxpc3QgPSBhc3luYyBmdW5jdGlvbiAoZGlyUGF0aClcbntcbiAgICByZXR1cm4gYXdhaXQgbGlzdGRpcihkaXJQYXRoLFtdKVxufVxuZXhwb3J0IGRlZmF1bHQgZGlybGlzdDsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rXyA9IHtpbjogZnVuY3Rpb24gKGEsbCkge3JldHVybiAodHlwZW9mIGwgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBhID09PSAnc3RyaW5nJyAmJiBhLmxlbmd0aCA/ICcnIDogW10pLmluZGV4T2YuY2FsbChsLGEpID49IDB9LCBsaXN0OiBmdW5jdGlvbiAobCkge3JldHVybiBsICE9IG51bGwgPyB0eXBlb2YgbC5sZW5ndGggPT09ICdudW1iZXInID8gbCA6IFtdIDogW119LCBpc0Z1bmM6IGZ1bmN0aW9uIChvKSB7cmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nfX1cblxudmFyIFNsYXNoXG5cbmltcG9ydCBwYXRoIGZyb20gJy4vcGF0aC5qcydcbmltcG9ydCBvcyBmcm9tICcuL29zLmpzJ1xuXG5TbGFzaCA9IChmdW5jdGlvbiAoKVxue1xuICAgIGZ1bmN0aW9uIFNsYXNoICgpXG4gICAge31cblxuICAgIFNsYXNoW1wibG9nRXJyb3JzXCJdID0gdHJ1ZVxuICAgIFNsYXNoW1wicGF0aFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgaWYgKCFwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcFxuICAgICAgICB9XG4gICAgICAgIHAgPSBwYXRoLm5vcm1hbGl6ZShwKVxuICAgICAgICBpZiAoIXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBwZWU/JyxwKVxuICAgICAgICAgICAgcmV0dXJuIHBcbiAgICAgICAgfVxuICAgICAgICBpZiAocC5lbmRzV2l0aCgnOi4nKSAmJiBwLmxlbmd0aCA9PT0gMylcbiAgICAgICAge1xuICAgICAgICAgICAgcCA9IHAuc2xpY2UoMCwgMilcbiAgICAgICAgfVxuICAgICAgICBpZiAocC5lbmRzV2l0aCgnOicpICYmIHAubGVuZ3RoID09PSAyKVxuICAgICAgICB7XG4gICAgICAgICAgICBwID0gcCArICcvJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwXG4gICAgfVxuXG4gICAgU2xhc2hbXCJ1bnNsYXNoXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICB2YXIgcmVnXG5cbiAgICAgICAgcCA9IFNsYXNoLnBhdGgocClcbiAgICAgICAgaWYgKFNsYXNoLndpbigpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPj0gMyAmJiAocFswXSA9PT0gJy8nICYmICcvJyA9PT0gcFsyXSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcCA9IHBbMV0gKyAnOicgKyBwLnNsaWNlKDIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWcgPSBuZXcgUmVnRXhwKFwiL1wiLCdnJylcbiAgICAgICAgICAgIHAgPSBwLnJlcGxhY2UocmVnLCdcXFxcJylcbiAgICAgICAgICAgIGlmIChwWzFdID09PSAnOicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcCA9IHBbMF0udG9VcHBlckNhc2UoKSArIHAuc2xpY2UoMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcFxuICAgIH1cblxuICAgIFNsYXNoW1wicmVzb2x2ZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgaWYgKCEocCAhPSBudWxsID8gcC5sZW5ndGggOiB1bmRlZmluZWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICBwID0gcHJvY2Vzcy5jd2QoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgcCA9IFNsYXNoLmpvaW4uYXBwbHkoMCxhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgICAgcCA9IFNsYXNoLnVuZW52KFNsYXNoLnVudGlsZGUocCkpXG4gICAgICAgIGlmIChTbGFzaC5pc1JlbGF0aXZlKHApKVxuICAgICAgICB7XG4gICAgICAgICAgICBwID0gU2xhc2gucGF0aChwYXRoLnJlc29sdmUocCkpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBwID0gU2xhc2gucGF0aChwKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwXG4gICAgfVxuXG4gICAgU2xhc2hbXCJzcGxpdFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLnBhdGgocCkuc3BsaXQoJy8nKS5maWx0ZXIoZnVuY3Rpb24gKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBlLmxlbmd0aFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIFNsYXNoW1wic3BsaXREcml2ZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgdmFyIGZpbGVQYXRoLCBwYXJzZWQsIHJvb3RcblxuICAgICAgICBwID0gU2xhc2gucGF0aChwKVxuICAgICAgICBwYXJzZWQgPSBTbGFzaC5wYXJzZShwKVxuICAgICAgICByb290ID0gcGFyc2VkLnJvb3RcbiAgICAgICAgaWYgKHJvb3QubGVuZ3RoID4gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHAubGVuZ3RoID4gcm9vdC5sZW5ndGgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSBwLnNsaWNlKHJvb3QubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCA9ICcvJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtmaWxlUGF0aCxyb290LnNsaWNlKDAscm9vdC5sZW5ndGggLSAyKV1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYXJzZWQuZGlyLmxlbmd0aCA+IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChwYXJzZWQuZGlyWzFdID09PSAnOicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwLnNsaWNlKDIpLHBhcnNlZC5kaXJbMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFyc2VkLmJhc2UubGVuZ3RoID09PSAyKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocGFyc2VkLmJhc2VbMV0gPT09ICc6JylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWycvJyxwYXJzZWQuYmFzZVswXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1NsYXNoLnBhdGgocCksJyddXG4gICAgfVxuXG4gICAgU2xhc2hbXCJyZW1vdmVEcml2ZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLnNwbGl0RHJpdmUocClbMF1cbiAgICB9XG5cbiAgICBTbGFzaFtcImlzUm9vdFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLnJlbW92ZURyaXZlKHApID09PSAnLydcbiAgICB9XG5cbiAgICBTbGFzaFtcInNwbGl0RmlsZUxpbmVcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBjLCBjbG1uLCBkLCBmLCBsLCBsaW5lLCBzcGxpdFxuXG4gICAgICAgIHZhciBfMTA2XzE0XyA9IFNsYXNoLnNwbGl0RHJpdmUocCk7IGYgPSBfMTA2XzE0X1swXTsgZCA9IF8xMDZfMTRfWzFdXG5cbiAgICAgICAgc3BsaXQgPSBTdHJpbmcoZikuc3BsaXQoJzonKVxuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGluZSA9IHBhcnNlSW50KHNwbGl0WzFdKVxuICAgICAgICB9XG4gICAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAyKVxuICAgICAgICB7XG4gICAgICAgICAgICBjbG1uID0gcGFyc2VJbnQoc3BsaXRbMl0pXG4gICAgICAgIH1cbiAgICAgICAgbCA9IGMgPSAwXG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGxpbmUpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsID0gbGluZVxuICAgICAgICB9XG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGNsbW4pKVxuICAgICAgICB7XG4gICAgICAgICAgICBjID0gY2xtblxuICAgICAgICB9XG4gICAgICAgIGlmIChkICE9PSAnJylcbiAgICAgICAge1xuICAgICAgICAgICAgZCA9IGQgKyAnOidcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2QgKyBzcGxpdFswXSxNYXRoLm1heChsLDEpLE1hdGgubWF4KGMsMCldXG4gICAgfVxuXG4gICAgU2xhc2hbXCJzcGxpdEZpbGVQb3NcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBjLCBmLCBsXG5cbiAgICAgICAgdmFyIF8xMThfMTZfID0gU2xhc2guc3BsaXRGaWxlTGluZShwKTsgZiA9IF8xMThfMTZfWzBdOyBsID0gXzExOF8xNl9bMV07IGMgPSBfMTE4XzE2X1syXVxuXG4gICAgICAgIHJldHVybiBbZixbYyxsIC0gMV1dXG4gICAgfVxuXG4gICAgU2xhc2hbXCJyZW1vdmVMaW5lUG9zXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICByZXR1cm4gU2xhc2guc3BsaXRGaWxlTGluZShwKVswXVxuICAgIH1cblxuICAgIFNsYXNoW1wicmVtb3ZlQ29sdW1uXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICB2YXIgZiwgbFxuXG4gICAgICAgIHZhciBfMTIzXzE0XyA9IFNsYXNoLnNwbGl0RmlsZUxpbmUocCk7IGYgPSBfMTIzXzE0X1swXTsgbCA9IF8xMjNfMTRfWzFdXG5cbiAgICAgICAgaWYgKGwgPiAxKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZiArICc6JyArIGxcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTbGFzaFtcImV4dFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHBhdGguZXh0bmFtZShwKS5zbGljZSgxKVxuICAgIH1cblxuICAgIFNsYXNoW1wic3BsaXRFeHRcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBbU2xhc2gucmVtb3ZlRXh0KHApLFNsYXNoLmV4dChwKV1cbiAgICB9XG5cbiAgICBTbGFzaFtcInJlbW92ZUV4dFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLmpvaW4oU2xhc2guZGlyKHApLFNsYXNoLmJhc2UocCkpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJzd2FwRXh0XCJdID0gZnVuY3Rpb24gKHAsIGV4dClcbiAgICB7XG4gICAgICAgIHJldHVybiBTbGFzaC5yZW1vdmVFeHQocCkgKyAoZXh0LnN0YXJ0c1dpdGgoJy4nKSAmJiBleHQgfHwgYC4ke2V4dH1gKVxuICAgIH1cblxuICAgIFNsYXNoW1wiam9pblwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICByZXR1cm4gU2xhc2gucGF0aChbXS5tYXAuY2FsbChhcmd1bWVudHMsU2xhc2gucGF0aCkuam9pbignLycpKVxuICAgIH1cblxuICAgIFNsYXNoW1wiam9pbkZpbGVQb3NcIl0gPSBmdW5jdGlvbiAoZmlsZSwgcG9zKVxuICAgIHtcbiAgICAgICAgZmlsZSA9IFNsYXNoLnJlbW92ZUxpbmVQb3MoZmlsZSlcbiAgICAgICAgaWYgKCEocG9zICE9IG51bGwpIHx8ICEocG9zWzBdICE9IG51bGwpIHx8IChwb3NbMF0gPT09IHBvc1sxXSAmJiBwb3NbMV0gPT09IDApKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBvc1swXSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgKyBgOiR7cG9zWzFdICsgMX06JHtwb3NbMF19YFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgKyBgOiR7cG9zWzFdICsgMX1gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTbGFzaFtcImpvaW5GaWxlTGluZVwiXSA9IGZ1bmN0aW9uIChmaWxlLCBsaW5lLCBjb2wpXG4gICAge1xuICAgICAgICBmaWxlID0gU2xhc2gucmVtb3ZlTGluZVBvcyhmaWxlKVxuICAgICAgICBpZiAoIWxpbmUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb2wpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtmaWxlfToke2xpbmV9YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHtmaWxlfToke2xpbmV9OiR7Y29sfWBcbiAgICB9XG5cbiAgICBTbGFzaFtcImRpcmxpc3RcIl0gPSBmdW5jdGlvbiAocCwgb3B0LCBjYilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QocCxvcHQsY2IpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJsaXN0XCJdID0gZnVuY3Rpb24gKHAsIG9wdCwgY2IpXG4gICAge1xuICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9kaXJsaXN0JykocCxvcHQsY2IpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJwYXRobGlzdFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgdmFyIGxpc3RcblxuICAgICAgICBpZiAoIShwICE9IG51bGwgPyBwLmxlbmd0aCA6IHVuZGVmaW5lZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFNsYXNoLmVycm9yKFwiU2xhc2gucGF0aGxpc3QgLS0gbm8gcGF0aD9cIilcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG4gICAgICAgIHAgPSBTbGFzaC5ub3JtYWxpemUocClcbiAgICAgICAgaWYgKHAubGVuZ3RoID4gMSAmJiBwW3AubGVuZ3RoIC0gMV0gPT09ICcvJyAmJiBwW3AubGVuZ3RoIC0gMl0gIT09ICc6JylcbiAgICAgICAge1xuICAgICAgICAgICAgcCA9IHAuc2xpY2UoMCwgcC5sZW5ndGggLSAxKVxuICAgICAgICB9XG4gICAgICAgIGxpc3QgPSBbcF1cbiAgICAgICAgd2hpbGUgKFNsYXNoLmRpcihwKSAhPT0gJycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3QudW5zaGlmdChTbGFzaC5kaXIocCkpXG4gICAgICAgICAgICBwID0gU2xhc2guZGlyKHApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpc3RcbiAgICB9XG5cbiAgICBTbGFzaFtcImJhc2VcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKFNsYXNoLnNhbml0aXplKHApLHBhdGguZXh0bmFtZShTbGFzaC5zYW5pdGl6ZShwKSkpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJmaWxlXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICByZXR1cm4gcGF0aC5iYXNlbmFtZShTbGFzaC5zYW5pdGl6ZShwKSlcbiAgICB9XG5cbiAgICBTbGFzaFtcImV4dG5hbWVcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBwYXRoLmV4dG5hbWUoU2xhc2guc2FuaXRpemUocCkpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJiYXNlbmFtZVwiXSA9IGZ1bmN0aW9uIChwLCBlKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUoU2xhc2guc2FuaXRpemUocCksZSlcbiAgICB9XG5cbiAgICBTbGFzaFtcImlzQWJzb2x1dGVcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHAgPSBTbGFzaC5zYW5pdGl6ZShwKVxuICAgICAgICByZXR1cm4gcFsxXSA9PT0gJzonIHx8IHBhdGguaXNBYnNvbHV0ZShwKVxuICAgIH1cblxuICAgIFNsYXNoW1wiaXNSZWxhdGl2ZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICFTbGFzaC5pc0Fic29sdXRlKHApXG4gICAgfVxuXG4gICAgU2xhc2hbXCJkaXJuYW1lXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICByZXR1cm4gU2xhc2gucGF0aChwYXRoLmRpcm5hbWUoU2xhc2guc2FuaXRpemUocCkpKVxuICAgIH1cblxuICAgIFNsYXNoW1wibm9ybWFsaXplXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICByZXR1cm4gU2xhc2gucGF0aChTbGFzaC5zYW5pdGl6ZShwKSlcbiAgICB9XG5cbiAgICBTbGFzaFtcImRpclwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcCA9IFNsYXNoLm5vcm1hbGl6ZShwKVxuICAgICAgICBpZiAoU2xhc2guaXNSb290KHApKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgfVxuICAgICAgICBwID0gcGF0aC5kaXJuYW1lKHApXG4gICAgICAgIGlmIChwID09PSAnLicpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG4gICAgICAgIHAgPSBTbGFzaC5wYXRoKHApXG4gICAgICAgIGlmIChwLmVuZHNXaXRoKCc6JykgJiYgcC5sZW5ndGggPT09IDIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHAgKz0gJy8nXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBcbiAgICB9XG5cbiAgICBTbGFzaFtcInNhbml0aXplXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICBpZiAoIShwICE9IG51bGwgPyBwLmxlbmd0aCA6IHVuZGVmaW5lZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBTbGFzaC5lcnJvcihcIlNsYXNoLnNhbml0aXplIC0tIG5vIHBhdGg/XCIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBbMF0gPT09ICdcXG4nKVxuICAgICAgICB7XG4gICAgICAgICAgICBTbGFzaC5lcnJvcihgbGVhZGluZyBuZXdsaW5lIGluIHBhdGghICcke3B9J2ApXG4gICAgICAgICAgICByZXR1cm4gU2xhc2guc2FuaXRpemUocC5zdWJzdHIoMSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHAuZW5kc1dpdGgoJ1xcbicpKVxuICAgICAgICB7XG4gICAgICAgICAgICBTbGFzaC5lcnJvcihgdHJhaWxpbmcgbmV3bGluZSBpbiBwYXRoISAnJHtwfSdgKVxuICAgICAgICAgICAgcmV0dXJuIFNsYXNoLnNhbml0aXplKHAuc3Vic3RyKDAscC5sZW5ndGggLSAxKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcFxuICAgIH1cblxuICAgIFNsYXNoW1wicGFyc2VcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBkaWN0XG5cbiAgICAgICAgZGljdCA9IHBhdGgucGFyc2UocClcbiAgICAgICAgaWYgKGRpY3QuZGlyLmxlbmd0aCA9PT0gMiAmJiBkaWN0LmRpclsxXSA9PT0gJzonKVxuICAgICAgICB7XG4gICAgICAgICAgICBkaWN0LmRpciArPSAnLydcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGljdC5yb290Lmxlbmd0aCA9PT0gMiAmJiBkaWN0LnJvb3RbMV0gPT09ICc6JylcbiAgICAgICAge1xuICAgICAgICAgICAgZGljdC5yb290ICs9ICcvJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWN0XG4gICAgfVxuXG4gICAgU2xhc2hbXCJob21lXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHJldHVybiBTbGFzaC5wYXRoKG9zLmhvbWVkaXIoKSlcbiAgICB9XG5cbiAgICBTbGFzaFtcInRpbGRlXCJdID0gZnVuY3Rpb24gKHApXG4gICAge1xuICAgICAgICB2YXIgXzI0OV8zNl9cblxuICAgICAgICByZXR1cm4gKFNsYXNoLnBhdGgocCkgIT0gbnVsbCA/IFNsYXNoLnBhdGgocCkucmVwbGFjZShTbGFzaC5ob21lKCksJ34nKSA6IHVuZGVmaW5lZClcbiAgICB9XG5cbiAgICBTbGFzaFtcInVudGlsZGVcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBfMjUwXzM2X1xuXG4gICAgICAgIHJldHVybiAoU2xhc2gucGF0aChwKSAhPSBudWxsID8gU2xhc2gucGF0aChwKS5yZXBsYWNlKC9eXFx+LyxTbGFzaC5ob21lKCkpIDogdW5kZWZpbmVkKVxuICAgIH1cblxuICAgIFNsYXNoW1widW5lbnZcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBpLCBrLCB2XG5cbiAgICAgICAgaSA9IHAuaW5kZXhPZignJCcsMClcbiAgICAgICAgd2hpbGUgKGkgPj0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChrIGluIHByb2Nlc3MuZW52KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHYgPSBwcm9jZXNzLmVudltrXVxuICAgICAgICAgICAgICAgIGlmIChrID09PSBwLnNsaWNlKGkgKyAxLGkgKyAxICsgay5sZW5ndGgpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IHAuc2xpY2UoMCxpKSArIHYgKyBwLnNsaWNlKGkgKyBrLmxlbmd0aCArIDEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSA9IHAuaW5kZXhPZignJCcsaSArIDEpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNsYXNoLnBhdGgocClcbiAgICB9XG5cbiAgICBTbGFzaFtcInJlbGF0aXZlXCJdID0gZnVuY3Rpb24gKHJlbCwgdG8pXG4gICAge1xuICAgICAgICB2YXIgcmQsIHJsLCB0ZCwgdGxcblxuICAgICAgICBpZiAoISh0byAhPSBudWxsID8gdG8ubGVuZ3RoIDogdW5kZWZpbmVkKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdG8gPSBwcm9jZXNzLmN3ZCgpXG4gICAgICAgIH1cbiAgICAgICAgcmVsID0gU2xhc2gucmVzb2x2ZShyZWwpXG4gICAgICAgIGlmICghU2xhc2guaXNBYnNvbHV0ZShyZWwpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcmVsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKFNsYXNoLnJlc29sdmUodG8pID09PSByZWwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnLidcbiAgICAgICAgfVxuICAgICAgICB2YXIgXzI3MV8xN18gPSBTbGFzaC5zcGxpdERyaXZlKHJlbCk7IHJsID0gXzI3MV8xN19bMF07IHJkID0gXzI3MV8xN19bMV1cblxuICAgICAgICB2YXIgXzI3Ml8xN18gPSBTbGFzaC5zcGxpdERyaXZlKFNsYXNoLnJlc29sdmUodG8pKTsgdGwgPSBfMjcyXzE3X1swXTsgdGQgPSBfMjcyXzE3X1sxXVxuXG4gICAgICAgIGlmIChyZCAmJiB0ZCAmJiByZCAhPT0gdGQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiByZWxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2xhc2gucGF0aChwYXRoLnJlbGF0aXZlKHRsLHJsKSlcbiAgICB9XG5cbiAgICBTbGFzaFtcImZpbGVVcmxcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBgZmlsZTovLy8ke1NsYXNoLmVuY29kZShwKX1gXG4gICAgfVxuXG4gICAgU2xhc2hbXCJzYW1lUGF0aFwiXSA9IGZ1bmN0aW9uIChhLCBiKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLnJlc29sdmUoYSkgPT09IFNsYXNoLnJlc29sdmUoYilcbiAgICB9XG5cbiAgICBTbGFzaFtcImVzY2FwZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHAucmVwbGFjZSgvKFtcXGBcXFwiXSkvZywnXFxcXCQxJylcbiAgICB9XG5cbiAgICBTbGFzaFtcImVuY29kZVwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcCA9IGVuY29kZVVSSShwKVxuICAgICAgICBwID0gcC5yZXBsYWNlKC9cXCMvZyxcIiUyM1wiKVxuICAgICAgICBwID0gcC5yZXBsYWNlKC9cXCYvZyxcIiUyNlwiKVxuICAgICAgICByZXR1cm4gcCA9IHAucmVwbGFjZSgvXFwnL2csXCIlMjdcIilcbiAgICB9XG5cbiAgICBTbGFzaFtcInBrZ1wiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgdmFyIF8yOTdfMjBfXG5cbiAgICAgICAgaWYgKCgocCAhPSBudWxsID8gcC5sZW5ndGggOiB1bmRlZmluZWQpICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAocC5sZW5ndGggJiYgIShfa18uaW4oU2xhc2gucmVtb3ZlRHJpdmUocCksWycuJywnLycsJyddKSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKFNsYXNoLmRpckV4aXN0cyhTbGFzaC5qb2luKHAsJy5naXQnIHx8IFNsYXNoLmZpbGVFeGlzdHMoU2xhc2guam9pbihwLCdwYWNrYWdlLm5vb24nIHx8IFNsYXNoLmZpbGVFeGlzdHMoU2xhc2guam9pbihwLCdwYWNrYWdlLmpzb24nKSkpKSkpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNsYXNoLnJlc29sdmUocClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcCA9IFNsYXNoLmRpcihwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgU2xhc2hbXCJnaXRcIl0gPSBmdW5jdGlvbiAocCwgY2IpXG4gICAge1xuICAgICAgICB2YXIgXzMwOV8yMF9cblxuICAgICAgICBpZiAoKChwICE9IG51bGwgPyBwLmxlbmd0aCA6IHVuZGVmaW5lZCkgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoY2IpID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNsYXNoLmRpckV4aXN0cyhTbGFzaC5qb2luKHAsJy5naXQnKSxmdW5jdGlvbiAoc3RhdClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0KVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoU2xhc2gucmVzb2x2ZShwKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghKF9rXy5pbihTbGFzaC5yZW1vdmVEcml2ZShwKSxbJy4nLCcvJywnJ10pKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNsYXNoLmdpdChTbGFzaC5kaXIocCksY2IpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdoaWxlIChwLmxlbmd0aCAmJiAhKF9rXy5pbihTbGFzaC5yZW1vdmVEcml2ZShwKSxbJy4nLCcvJywnJ10pKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTbGFzaC5kaXJFeGlzdHMoU2xhc2guam9pbihwLCcuZ2l0JykpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2xhc2gucmVzb2x2ZShwKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHAgPSBTbGFzaC5kaXIocClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBTbGFzaFtcImV4aXN0c1wiXSA9IGZ1bmN0aW9uIChwLCBjYilcbiAgICB7XG4gICAgICAgIHZhciBzdGF0XG5cbiAgICAgICAgaWYgKHR5cGVvZihjYikgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghKHAgIT0gbnVsbCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwID0gU2xhc2gucmVzb2x2ZShTbGFzaC5yZW1vdmVMaW5lUG9zKHApKVxuICAgICAgICAgICAgICAgIGZzLmFjY2VzcyhwLChmcy5SX09LIHwgZnMuRl9PSyksZnVuY3Rpb24gKGVycilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoZXJyICE9IG51bGwpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLnN0YXQocCxmdW5jdGlvbiAoZXJyLCBzdGF0KVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXJyICE9IG51bGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKHN0YXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNsYXNoLmVycm9yKFwiU2xhc2guZXhpc3RzIC0tIFwiICsgU3RyaW5nKGVycikpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoKHAgIT0gbnVsbCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwID0gU2xhc2gucmVzb2x2ZShTbGFzaC5yZW1vdmVMaW5lUG9zKHApKVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdCA9IGZzLnN0YXRTeW5jKHApKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5hY2Nlc3NTeW5jKHAsZnMuUl9PSylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfa18uaW4oZXJyLmNvZGUsWydFTk9FTlQnLCdFTk9URElSJ10pKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFNsYXNoLmVycm9yKFwiU2xhc2guZXhpc3RzIC0tIFwiICsgU3RyaW5nKGVycikpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgU2xhc2hbXCJmaWxlRXhpc3RzXCJdID0gZnVuY3Rpb24gKHAsIGNiKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignc2xhc2guZmlsZUV4aXN0cyB3aXRob3V0IGNhbGxiYWNrJylcbiAgICB9XG5cbiAgICBTbGFzaFtcImRpckV4aXN0c1wiXSA9IGZ1bmN0aW9uIChwLCBjYilcbiAgICB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3NsYXNoLmZpbGVFeGlzdHMgd2l0aG91dCBjYWxsYmFjaycpXG4gICAgfVxuXG4gICAgU2xhc2hbXCJ0b3VjaFwiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgdmFyIGRpclxuXG4gICAgICAgIHRyeVxuICAgICAgICB7XG4gICAgICAgICAgICBkaXIgPSBTbGFzaC5kaXIocClcbiAgICAgICAgICAgIGlmICghU2xhc2guaXNEaXIoZGlyKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoZGlyLHtyZWN1cnNpdmU6dHJ1ZX0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIVNsYXNoLmZpbGVFeGlzdHMocCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhwLCcnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKVxuICAgICAgICB7XG4gICAgICAgICAgICBTbGFzaC5lcnJvcihcIlNsYXNoLnRvdWNoIC0tIFwiICsgU3RyaW5nKGVycikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFNsYXNoW1widW51c2VkXCJdID0gZnVuY3Rpb24gKHAsIGNiKVxuICAgIHtcbiAgICAgICAgdmFyIGRpciwgZXh0LCBpLCBuYW1lLCB0ZXN0XG5cbiAgICAgICAgbmFtZSA9IFNsYXNoLmJhc2UocClcbiAgICAgICAgZGlyID0gU2xhc2guZGlyKHApXG4gICAgICAgIGV4dCA9IFNsYXNoLmV4dChwKVxuICAgICAgICBleHQgPSBleHQgJiYgJy4nICsgZXh0IHx8ICcnXG4gICAgICAgIGlmICgvXFxkXFxkJC8udGVzdChuYW1lKSlcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoMCxuYW1lLmxlbmd0aCAtIDIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZihjYikgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBTbGFzaC5leGlzdHMocCxmdW5jdGlvbiAoc3RhdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hlY2ssIGksIHRlc3RcblxuICAgICAgICAgICAgICAgIGlmICghc3RhdClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNiKFNsYXNoLnJlc29sdmUocCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpID0gMVxuICAgICAgICAgICAgICAgIHRlc3QgPSAnJ1xuICAgICAgICAgICAgICAgIGNoZWNrID0gZnVuY3Rpb24gKClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3QgPSBgJHtuYW1lfSR7YCR7aX1gLnBhZFN0YXJ0KDIsJzAnKX0ke2V4dH1gXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXIpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3QgPSBTbGFzaC5qb2luKGRpcix0ZXN0KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTbGFzaC5leGlzdHModGVzdCxmdW5jdGlvbiAoc3RhdClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoU2xhc2gucmVzb2x2ZSh0ZXN0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIVNsYXNoLmV4aXN0cyhwKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU2xhc2gucmVzb2x2ZShwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8PSAxMDAwOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGVzdCA9IGAke25hbWV9JHtgJHtpfWAucGFkU3RhcnQoMiwnMCcpfSR7ZXh0fWBcbiAgICAgICAgICAgICAgICBpZiAoZGlyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdCA9IFNsYXNoLmpvaW4oZGlyLHRlc3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghU2xhc2guZXhpc3RzKHRlc3QpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNsYXNoLnJlc29sdmUodGVzdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTbGFzaFtcImlzRGlyXCJdID0gZnVuY3Rpb24gKHAsIGNiKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLmRpckV4aXN0cyhwLGNiKVxuICAgIH1cblxuICAgIFNsYXNoW1wiaXNGaWxlXCJdID0gZnVuY3Rpb24gKHAsIGNiKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFNsYXNoLmZpbGVFeGlzdHMocCxjYilcbiAgICB9XG5cbiAgICBTbGFzaFtcImlzV3JpdGFibGVcIl0gPSBmdW5jdGlvbiAocCwgY2IpXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKGNiKSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAge1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZzLmFjY2VzcyhTbGFzaC5yZXNvbHZlKHApLChmcy5jb25zdGFudHMuUl9PSyB8IGZzLmNvbnN0YW50cy5XX09LKSxmdW5jdGlvbiAoZXJyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCFlcnIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgU2xhc2guZXJyb3IoXCJTbGFzaC5pc1dyaXRhYmxlIC0tIFwiICsgU3RyaW5nKGVycikpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnMuYWNjZXNzU3luYyhTbGFzaC5yZXNvbHZlKHApLChmcy5jb25zdGFudHMuUl9PSyB8IGZzLmNvbnN0YW50cy5XX09LKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFNsYXNoW1widGV4dGV4dFwiXSA9IG51bGxcbiAgICBTbGFzaFtcInRleHRiYXNlXCJdID0ge3Byb2ZpbGU6MSxsaWNlbnNlOjEsJy5naXRpZ25vcmUnOjEsJy5ucG1pZ25vcmUnOjF9XG4gICAgU2xhc2hbXCJpc1RleHRcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHZhciBleHQsIGlzQmluYXJ5XG5cbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghU2xhc2gudGV4dGV4dClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBTbGFzaC50ZXh0ZXh0ID0ge31cbiAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IF9rXy5saXN0KHJlcXVpcmUoJ3RleHRleHRlbnNpb25zJykpXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgXzQ5MF8yNF8gPSAwOyBfNDkwXzI0XyA8IGxpc3QubGVuZ3RoOyBfNDkwXzI0XysrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ID0gbGlzdFtfNDkwXzI0X11cbiAgICAgICAgICAgICAgICAgICAgU2xhc2gudGV4dGV4dFtleHRdID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBTbGFzaC50ZXh0ZXh0WydjcnlwdCddID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXh0ID0gU2xhc2guZXh0KHApXG4gICAgICAgICAgICBpZiAoZXh0ICYmIChTbGFzaC50ZXh0ZXh0W2V4dF0gIT0gbnVsbCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChTbGFzaC50ZXh0YmFzZVtTbGFzaC5iYXNlbmFtZShwKS50b0xvd2VyQ2FzZSgpXSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IFNsYXNoLnJlc29sdmUocClcbiAgICAgICAgICAgIGlmICghU2xhc2guaXNGaWxlKHApKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNCaW5hcnkgPSByZXF1aXJlKCdpc2JpbmFyeWZpbGUnKVxuICAgICAgICAgICAgcmV0dXJuICFpc0JpbmFyeS5pc0JpbmFyeUZpbGVTeW5jKHApXG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycilcbiAgICAgICAge1xuICAgICAgICAgICAgU2xhc2guZXJyb3IoXCJTbGFzaC5pc1RleHQgLS0gXCIgKyBTdHJpbmcoZXJyKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgU2xhc2hbXCJyZWFkVGV4dFwiXSA9IGZ1bmN0aW9uIChwLCBjYilcbiAgICB7XG4gICAgICAgIGlmICghKF9rXy5pc0Z1bmMoY2IpKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEJ1bi5maWxlKHApLnRleHQoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrYWthby5yZXF1ZXN0KCdmcy5yZWFkVGV4dCcscCkudGhlbihmdW5jdGlvbiAodGV4dCwgZXJyKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIWVycilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IodGV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBTbGFzaFtcIndyaXRlVGV4dFwiXSA9IGZ1bmN0aW9uIChwLCB0ZXh0LCBjYilcbiAgICB7XG4gICAgICAgIFNsYXNoLmVycm9yKFwiU2xhc2gud3JpdGVUZXh0IC0tIG5vIGNhbGxiYWNrIVwiKVxuICAgICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICBTbGFzaFtcInJlbW92ZVwiXSA9IGZ1bmN0aW9uIChwLCBjYilcbiAgICB7XG4gICAgICAgIGlmIChjYilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZzLnJlbW92ZShwLGNiKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZzLnJlbW92ZVN5bmMocClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFNsYXNoW1wicmVnXCJdID0gbmV3IFJlZ0V4cChcIlxcXFxcXFxcXCIsJ2cnKVxuICAgIFNsYXNoW1wid2luXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHJldHVybiBwYXRoLnNlcCA9PT0gJ1xcXFwnXG4gICAgfVxuXG4gICAgU2xhc2hbXCJlcnJvclwiXSA9IGZ1bmN0aW9uIChtc2cpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5sb2dFcnJvcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHJldHVybiBTbGFzaFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBTbGFzaDsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rX1xuXG52YXIgQnVuZGxlXG5cblxuQnVuZGxlID0gKGZ1bmN0aW9uICgpXG57XG4gICAgZnVuY3Rpb24gQnVuZGxlICgpXG4gICAge31cblxuICAgIEJ1bmRsZVtcInBhdGhcIl0gPSAnPydcbiAgICBCdW5kbGVbXCJhcHBcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBCdW5kbGUucGF0aCArICcvJyArIHBcbiAgICB9XG5cbiAgICBCdW5kbGVbXCJqc1wiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJ1bmRsZS5wYXRoICsgJy9qcy8nICsgcFxuICAgIH1cblxuICAgIEJ1bmRsZVtcIm1hY1wiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJ1bmRsZS5wYXRoICsgJy9Db250ZW50cy9NYWNPUy8nICsgcFxuICAgIH1cblxuICAgIEJ1bmRsZVtcInJlc1wiXSA9IGZ1bmN0aW9uIChwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJ1bmRsZS5wYXRoICsgJy9Db250ZW50cy9SZXNvdXJjZXMvJyArIHBcbiAgICB9XG5cbiAgICBCdW5kbGVbXCJpbWdcIl0gPSBmdW5jdGlvbiAocClcbiAgICB7XG4gICAgICAgIHJldHVybiBCdW5kbGUucGF0aCArICcvQ29udGVudHMvUmVzb3VyY2VzL2ltZy8nICsgcFxuICAgIH1cblxuICAgIHJldHVybiBCdW5kbGVcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQnVuZGxlOyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2lzT2JqOiBmdW5jdGlvbiAobykge3JldHVybiAhKG8gPT0gbnVsbCB8fCB0eXBlb2YgbyAhPSAnb2JqZWN0JyB8fCBvLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdPYmplY3QnKX0sIGlzU3RyOiBmdW5jdGlvbiAobykge3JldHVybiB0eXBlb2YgbyA9PT0gJ3N0cmluZycgfHwgbyBpbnN0YW5jZW9mIFN0cmluZ30sIGlzTnVtOiBmdW5jdGlvbiAobykge3JldHVybiAhaXNOYU4obykgJiYgIWlzTmFOKHBhcnNlRmxvYXQobykpICYmIChpc0Zpbml0ZShvKSB8fCBvID09PSBJbmZpbml0eSB8fCBvID09PSAtSW5maW5pdHkpfSwgbGlzdDogZnVuY3Rpb24gKGwpIHtyZXR1cm4gbCAhPSBudWxsID8gdHlwZW9mIGwubGVuZ3RoID09PSAnbnVtYmVyJyA/IGwgOiBbXSA6IFtdfX1cblxudmFyIGVsZW0sIGlzRWxlbWVudFxuXG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uICh2YWx1ZSlcbntcbiAgICByZXR1cm4gKHZhbHVlICE9IG51bGwgPyB2YWx1ZS5ub2RlVHlwZSA6IHVuZGVmaW5lZCkgPT09IDEgJiYgIShfa18uaXNPYmoodmFsdWUpKVxufVxuXG5lbGVtID0gZnVuY3Rpb24gKHR5cCwgb3B0KVxue1xuICAgIHZhciBjLCBlLCBldmVudCwgaywgXzI2XzE1XywgXzMwXzE2XywgXzM0XzE5XywgXzM5XzE3X1xuXG4gICAgaWYgKHR5cCAmJiB0eXBlb2YodHlwKSA9PT0gJ29iamVjdCcpXG4gICAge1xuICAgICAgICBvcHQgPSB0eXBcbiAgICAgICAgdHlwID0gb3B0LnR5cFxuICAgIH1cbiAgICBvcHQgPSAob3B0ICE9IG51bGwgPyBvcHQgOiB7fSlcbiAgICB0eXAgPSAodHlwICE9IG51bGwgPyB0eXAgOiAnZGl2JylcbiAgICBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXApXG4gICAgaWYgKF9rXy5pc1N0cihvcHQudGV4dCkgfHwgX2tfLmlzTnVtKG9wdC50ZXh0KSlcbiAgICB7XG4gICAgICAgIGUudGV4dENvbnRlbnQgPSBvcHQudGV4dFxuICAgICAgICBkZWxldGUgb3B0LnRleHRcbiAgICB9XG4gICAgaWYgKChvcHQuaHRtbCAhPSBudWxsKSAmJiBfa18uaXNTdHIob3B0Lmh0bWwpKVxuICAgIHtcbiAgICAgICAgZS5pbm5lckhUTUwgPSBvcHQuaHRtbFxuICAgICAgICBkZWxldGUgb3B0Lmh0bWxcbiAgICB9XG4gICAgaWYgKChvcHQuY2hpbGQgIT0gbnVsbCkgJiYgaXNFbGVtZW50KG9wdC5jaGlsZCkpXG4gICAge1xuICAgICAgICBlLmFwcGVuZENoaWxkKG9wdC5jaGlsZClcbiAgICAgICAgZGVsZXRlIG9wdC5jaGlsZFxuICAgIH1cbiAgICBpZiAoKG9wdC5jaGlsZHJlbiAhPSBudWxsKSAmJiBvcHQuY2hpbGRyZW4gaW5zdGFuY2VvZiBBcnJheSlcbiAgICB7XG4gICAgICAgIHZhciBsaXN0ID0gX2tfLmxpc3Qob3B0LmNoaWxkcmVuKVxuICAgICAgICBmb3IgKHZhciBfMzVfMTRfID0gMDsgXzM1XzE0XyA8IGxpc3QubGVuZ3RoOyBfMzVfMTRfKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGMgPSBsaXN0W18zNV8xNF9dXG4gICAgICAgICAgICBpZiAoaXNFbGVtZW50KGMpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGUuYXBwZW5kQ2hpbGQoYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgb3B0LmNoaWxkcmVuXG4gICAgfVxuICAgIGlmICgob3B0LnBhcmVudCAhPSBudWxsKSAmJiBpc0VsZW1lbnQob3B0LnBhcmVudCkpXG4gICAge1xuICAgICAgICBvcHQucGFyZW50LmFwcGVuZENoaWxkKGUpXG4gICAgICAgIGRlbGV0ZSBvcHQucGFyZW50XG4gICAgfVxuICAgIHZhciBsaXN0MSA9IFsnbW91c2Vkb3duJywnbW91c2Vtb3ZlJywnbW91c2V1cCcsJ2NsaWNrJywnZGJsY2xpY2snXVxuICAgIGZvciAodmFyIF80M18xNF8gPSAwOyBfNDNfMTRfIDwgbGlzdDEubGVuZ3RoOyBfNDNfMTRfKyspXG4gICAge1xuICAgICAgICBldmVudCA9IGxpc3QxW180M18xNF9dXG4gICAgICAgIGlmIChvcHRbZXZlbnRdICYmIHR5cGVvZihvcHRbZXZlbnRdKSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAge1xuICAgICAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LG9wdFtldmVudF0pXG4gICAgICAgICAgICBkZWxldGUgb3B0W2V2ZW50XVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBsaXN0MiA9IF9rXy5saXN0KE9iamVjdC5rZXlzKG9wdCkpXG4gICAgZm9yICh2YXIgXzQ4XzEwXyA9IDA7IF80OF8xMF8gPCBsaXN0Mi5sZW5ndGg7IF80OF8xMF8rKylcbiAgICB7XG4gICAgICAgIGsgPSBsaXN0MltfNDhfMTBfXVxuICAgICAgICBlLnNldEF0dHJpYnV0ZShrLG9wdFtrXSlcbiAgICB9XG4gICAgcmV0dXJuIGVcbn1cblxuZWxlbS5jb250YWluc1BvcyA9IGZ1bmN0aW9uIChkaXYsIHBvcylcbntcbiAgICB2YXIgYnJcblxuICAgIGJyID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgcmV0dXJuIChici5sZWZ0IDw9IHBvcy54ICYmIHBvcy54IDw9IGJyLmxlZnQgKyBici53aWR0aCkgJiYgKGJyLnRvcCA8PSBwb3MueSAmJiBwb3MueSA8PSBici50b3AgKyBici5oZWlnaHQpXG59XG5cbmVsZW0uY2hpbGRJbmRleCA9IGZ1bmN0aW9uIChlKVxue1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGUucGFyZW50Tm9kZS5jaGlsZE5vZGVzLGUpXG59XG5cbmVsZW0udXBBdHRyID0gZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHIpXG57XG4gICAgdmFyIGEsIF82Ml8yOF9cblxuICAgIGlmICghKGVsZW1lbnQgIT0gbnVsbCkpXG4gICAge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBhID0gKHR5cGVvZiBlbGVtZW50LmdldEF0dHJpYnV0ZSA9PT0gXCJmdW5jdGlvblwiID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikgOiB1bmRlZmluZWQpXG4gICAgaWYgKGEgIT09IG51bGwgJiYgYSAhPT0gJycpXG4gICAge1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cbiAgICByZXR1cm4gZWxlbS51cEF0dHIoZWxlbWVudC5wYXJlbnROb2RlLGF0dHIpXG59XG5cbmVsZW0udXBQcm9wID0gZnVuY3Rpb24gKGVsZW1lbnQsIHByb3ApXG57XG4gICAgaWYgKCEoZWxlbWVudCAhPSBudWxsKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIGlmICgoZWxlbWVudFtwcm9wXSAhPSBudWxsKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBlbGVtZW50W3Byb3BdXG4gICAgfVxuICAgIHJldHVybiBlbGVtLnVwUHJvcChlbGVtZW50LnBhcmVudE5vZGUscHJvcClcbn1cblxuZWxlbS51cEVsZW0gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0KVxue1xuICAgIHZhciBfNzVfMzBfLCBfNzZfMzFfLCBfNzdfMzFfLCBfNzdfNTdfLCBfNzdfNjhfLCBfNzhfMzJfLCBfNzhfNTVfXG5cbiAgICBpZiAoIShlbGVtZW50ICE9IG51bGwpKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgaWYgKCgob3B0ICE9IG51bGwgPyBvcHQudGFnIDogdW5kZWZpbmVkKSAhPSBudWxsKSAmJiBvcHQudGFnID09PSBlbGVtZW50LnRhZ05hbWUpXG4gICAge1xuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgIH1cbiAgICBpZiAoKChvcHQgIT0gbnVsbCA/IG9wdC5wcm9wIDogdW5kZWZpbmVkKSAhPSBudWxsKSAmJiAoZWxlbWVudFtvcHQucHJvcF0gIT0gbnVsbCkpXG4gICAge1xuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgIH1cbiAgICBpZiAoKChvcHQgIT0gbnVsbCA/IG9wdC5hdHRyIDogdW5kZWZpbmVkKSAhPSBudWxsKSAmJiAoKHR5cGVvZiBlbGVtZW50LmdldEF0dHJpYnV0ZSA9PT0gXCJmdW5jdGlvblwiID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUob3B0LmF0dHIpIDogdW5kZWZpbmVkKSAhPSBudWxsKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfVxuICAgIGlmICgoKG9wdCAhPSBudWxsID8gb3B0LmNsYXNzIDogdW5kZWZpbmVkKSAhPSBudWxsKSAmJiAoZWxlbWVudC5jbGFzc0xpc3QgIT0gbnVsbCA/IGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKG9wdC5jbGFzcykgOiB1bmRlZmluZWQpKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICB9XG4gICAgcmV0dXJuIGVsZW0udXBFbGVtKGVsZW1lbnQucGFyZW50Tm9kZSxvcHQpXG59XG5cbmVsZW0uZG93bkVsZW0gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0KVxue1xuICAgIHZhciBjaGlsZCwgZm91bmQsIF84NF8zMF8sIF84NV8xNl8sIF84Nl80MF8sIF84N18xNl8sIF84N180Ml8sIF84N181M18sIF84OF80MF9cblxuICAgIGlmICghKGVsZW1lbnQgIT0gbnVsbCkpXG4gICAge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBpZiAoKChvcHQgIT0gbnVsbCA/IG9wdC50YWcgOiB1bmRlZmluZWQpICE9IG51bGwpICYmIG9wdC50YWcgPT09IGVsZW1lbnQudGFnTmFtZSlcbiAgICB7XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfVxuICAgIGlmICgoKG9wdCAhPSBudWxsID8gb3B0LnByb3AgOiB1bmRlZmluZWQpICE9IG51bGwpICYmIChlbGVtZW50W29wdC5wcm9wXSAhPSBudWxsKSlcbiAgICB7XG4gICAgICAgIGlmICghKChvcHQgIT0gbnVsbCA/IG9wdC52YWx1ZSA6IHVuZGVmaW5lZCkgIT0gbnVsbCkgfHwgZWxlbWVudFtvcHQucHJvcF0gPT09IG9wdC52YWx1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoKChvcHQgIT0gbnVsbCA/IG9wdC5hdHRyIDogdW5kZWZpbmVkKSAhPSBudWxsKSAmJiAoKHR5cGVvZiBlbGVtZW50LmdldEF0dHJpYnV0ZSA9PT0gXCJmdW5jdGlvblwiID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUob3B0LmF0dHIpIDogdW5kZWZpbmVkKSAhPSBudWxsKSlcbiAgICB7XG4gICAgICAgIGlmICghKChvcHQgIT0gbnVsbCA/IG9wdC52YWx1ZSA6IHVuZGVmaW5lZCkgIT0gbnVsbCkgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUob3B0LmF0dHIpID09PSBvcHQudmFsdWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpc3QgPSBfa18ubGlzdChlbGVtZW50LmNoaWxkcmVuKVxuICAgIGZvciAodmFyIF84OV8xNF8gPSAwOyBfODlfMTRfIDwgbGlzdC5sZW5ndGg7IF84OV8xNF8rKylcbiAgICB7XG4gICAgICAgIGNoaWxkID0gbGlzdFtfODlfMTRfXVxuICAgICAgICBpZiAoZm91bmQgPSBlbGVtLmRvd25FbGVtKGNoaWxkLG9wdCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmb3VuZFxuICAgICAgICB9XG4gICAgfVxufVxuZWxlbS5pc0VsZW1lbnQgPSBpc0VsZW1lbnRcbmV4cG9ydCBkZWZhdWx0IGVsZW07IiwKICAiLy8gbW9uc3RlcmtvZGkva29kZSAwLjI1Ni4wXG5cbnZhciBfa18gPSB7aXNTdHI6IGZ1bmN0aW9uIChvKSB7cmV0dXJuIHR5cGVvZiBvID09PSAnc3RyaW5nJyB8fCBvIGluc3RhbmNlb2YgU3RyaW5nfSwgaW46IGZ1bmN0aW9uIChhLGwpIHtyZXR1cm4gKHR5cGVvZiBsID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgJiYgYS5sZW5ndGggPyAnJyA6IFtdKS5pbmRleE9mLmNhbGwobCxhKSA+PSAwfSwgbGlzdDogZnVuY3Rpb24gKGwpIHtyZXR1cm4gbCAhPSBudWxsID8gdHlwZW9mIGwubGVuZ3RoID09PSAnbnVtYmVyJyA/IGwgOiBbXSA6IFtdfX1cblxuaW1wb3J0IGVsZW0gZnJvbSAnLi9lbGVtLmpzJ1xuZXhwb3J0IGRlZmF1bHQge2VsZW06ZWxlbSwkOmZ1bmN0aW9uIChpZE9yUXVlcnlPckVsZW1lbnQsIHF1ZXJ5T3JFbGVtZW50ID0gZG9jdW1lbnQpXG57XG4gICAgaWYgKF9rXy5pc1N0cihpZE9yUXVlcnlPckVsZW1lbnQpKVxuICAgIHtcbiAgICAgICAgaWYgKF9rXy5pbihpZE9yUXVlcnlPckVsZW1lbnRbMF0sWycuJyxcIiNcIl0pIHx8IHF1ZXJ5T3JFbGVtZW50ICE9PSBkb2N1bWVudClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5T3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoaWRPclF1ZXJ5T3JFbGVtZW50KVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkT3JRdWVyeU9yRWxlbWVudClcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChlbGVtLmlzRWxlbWVudChpZE9yUXVlcnlPckVsZW1lbnQpICYmIF9rXy5pc1N0cihxdWVyeU9yRWxlbWVudCkpXG4gICAge1xuICAgICAgICByZXR1cm4gaWRPclF1ZXJ5T3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnlPckVsZW1lbnQpXG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBpZE9yUXVlcnlPckVsZW1lbnRcbiAgICB9XG59LGNoaWxkSW5kZXg6ZnVuY3Rpb24gKGUpXG57XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZS5wYXJlbnROb2RlLmNoaWxkTm9kZXMsZSlcbn0sc3c6ZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxufSxzaDpmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxufSxzdG9wRXZlbnQ6ZnVuY3Rpb24gKGV2ZW50KVxue1xuICAgIGlmICgoZXZlbnQgIT0gbnVsbCkgJiYgdHlwZW9mKGV2ZW50LnByZXZlbnREZWZhdWx0KSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSA9PT0gJ2Z1bmN0aW9uJylcbiAgICB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50XG59LHNldFN0eWxlOmZ1bmN0aW9uIChzZWxlY3Rvciwga2V5LCB2YWx1ZSwgc3NpZCA9IDApXG57XG4gICAgdmFyIHJ1bGVcblxuICAgIHZhciBsaXN0ID0gX2tfLmxpc3QoZG9jdW1lbnQuc3R5bGVTaGVldHNbc3NpZF0uY3NzUnVsZXMpXG4gICAgZm9yICh2YXIgXzQ1XzE3XyA9IDA7IF80NV8xN18gPCBsaXN0Lmxlbmd0aDsgXzQ1XzE3XysrKVxuICAgIHtcbiAgICAgICAgcnVsZSA9IGxpc3RbXzQ1XzE3X11cbiAgICAgICAgaWYgKHJ1bGUuc2VsZWN0b3JUZXh0ID09PSBzZWxlY3RvcilcbiAgICAgICAge1xuICAgICAgICAgICAgcnVsZS5zdHlsZVtrZXldID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuICAgIGRvY3VtZW50LnN0eWxlU2hlZXRzW3NzaWRdLmluc2VydFJ1bGUoYCR7c2VsZWN0b3J9IHsgJHtrZXl9OiAke3ZhbHVlfSB9YCxkb2N1bWVudC5zdHlsZVNoZWV0c1tzc2lkXS5jc3NSdWxlcy5sZW5ndGgpXG4gICAgcmV0dXJuXG59LGdldFN0eWxlOmZ1bmN0aW9uIChzZWxlY3Rvciwga2V5LCB2YWx1ZSwgc3NpZCA9IDApXG57XG4gICAgdmFyIHJ1bGVcblxuICAgIHZhciBsaXN0ID0gX2tfLmxpc3QoZG9jdW1lbnQuc3R5bGVTaGVldHNbc3NpZF0uY3NzUnVsZXMpXG4gICAgZm9yICh2YXIgXzUzXzE3XyA9IDA7IF81M18xN18gPCBsaXN0Lmxlbmd0aDsgXzUzXzE3XysrKVxuICAgIHtcbiAgICAgICAgcnVsZSA9IGxpc3RbXzUzXzE3X11cbiAgICAgICAgaWYgKHJ1bGUuc2VsZWN0b3JUZXh0ID09PSBzZWxlY3RvcilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKChydWxlLnN0eWxlW2tleV0gIT0gbnVsbCA/IHJ1bGUuc3R5bGVba2V5XS5sZW5ndGggOiB1bmRlZmluZWQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBydWxlLnN0eWxlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbn19OyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfXG5cbnZhciBQT1NULCBwb3N0ZXJcblxuUE9TVCA9IFwiX19QT1NUX19cIlxuY2xhc3MgUG9zdGVyIGV4dGVuZHMgRXZlbnRUYXJnZXRcbntcbiAgICBjb25zdHJ1Y3RvciAoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKVxuICAgIFxuICAgICAgICB0aGlzLmRpc3Bvc2UgPSB0aGlzLmRpc3Bvc2UuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoUE9TVCx0aGlzLm9uUG9zdEV2ZW50KVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJyx0aGlzLmRpc3Bvc2UpXG4gICAgfVxuXG4gICAgb25Qb3N0RXZlbnQgKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIG91dFxuXG4gICAgICAgIG91dCA9IG5ldyBFdmVudChldmVudC5ldmVudClcbiAgICAgICAgb3V0LmFyZ3MgPSBldmVudC5hcmdzXG4gICAgICAgIG91dC5zZW5kZXJJRCA9IGV2ZW50LnNlbmRlcklEXG4gICAgICAgIG91dC5yZWNlaXZlcnMgPSBldmVudC5yZWNlaXZlcnNcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hFdmVudChvdXQpXG4gICAgfVxuXG4gICAgZGlzcG9zZSAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKFBPU1QsdGhpcy5vblBvc3RFdmVudClcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLHRoaXMuZGlzcG9zZSlcbiAgICB9XG5cbiAgICB0b0FsbCAodHlwZSwgYXJncylcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ3RvQWxsJyx0eXBlLGFyZ3MpXG4gICAgfVxuXG4gICAgdG9XaW5zICh0eXBlLCBhcmdzKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgndG9XaW5zJyx0eXBlLGFyZ3MpXG4gICAgfVxuXG4gICAgdG9NYWluICh0eXBlLCBhcmdzKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgndG9NYWluJyx0eXBlLGFyZ3MpXG4gICAgfVxuXG4gICAgc2VuZCAocmVjZWl2ZXJzLCB0eXBlLCBhcmdzLCBpZClcbiAgICB7XG4gICAgICAgIHZhciBldmVudFxuXG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KFBPU1QpXG4gICAgICAgIGV2ZW50LmV2ZW50ID0gdHlwZVxuICAgICAgICBldmVudC5hcmdzID0gYXJnc1xuICAgICAgICBldmVudC5zZW5kZXJJRCA9IGlkXG4gICAgICAgIGV2ZW50LnJlY2VpdmVycyA9IHJlY2VpdmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH1cbn1cblxucG9zdGVyID0gbmV3IFBvc3RlclxuZXhwb3J0IGRlZmF1bHQge3Bvc3Rlcjpwb3N0ZXIsZW1pdDpmdW5jdGlvbiAoZXZlbnQsIC4uLmFyZ3MpXG57XG4gICAgcmV0dXJuIHBvc3Rlci50b0FsbChldmVudCxhcmdzKVxufSxvbjpmdW5jdGlvbiAoZXZlbnQsIGNiKVxue1xuICAgIHJldHVybiBwb3N0ZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudCxmdW5jdGlvbiAoZSlcbiAgICB7XG4gICAgICAgIHJldHVybiBjYi5hcHBseShjYixlLmFyZ3MpXG4gICAgfSlcbn19OyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2xpc3Q6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGwgIT0gbnVsbCA/IHR5cGVvZiBsLmxlbmd0aCA9PT0gJ251bWJlcicgPyBsIDogW10gOiBbXX0sIGluOiBmdW5jdGlvbiAoYSxsKSB7cmV0dXJuICh0eXBlb2YgbCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGEgPT09ICdzdHJpbmcnICYmIGEubGVuZ3RoID8gJycgOiBbXSkuaW5kZXhPZi5jYWxsKGwsYSkgPj0gMH19XG5cbmltcG9ydCBvcyBmcm9tICcuL29zLmpzJ1xuY2xhc3MgS2V5aW5mb1xue1xuICAgIHN0YXRpYyBmb3JFdmVudCAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgY29tYm8sIGluZm9cblxuICAgICAgICBjb21ibyA9IHRoaXMuY29tYm9Gb3JFdmVudChldmVudClcbiAgICAgICAgaW5mbyA9IHttb2Q6dGhpcy5tb2RpZmllcnNGb3JFdmVudChldmVudCksa2V5OnRoaXMua2V5bmFtZUZvckV2ZW50KGV2ZW50KSxjaGFyOnRoaXMuY2hhcmFjdGVyRm9yRXZlbnQoZXZlbnQpLGNvbWJvOmNvbWJvLHNob3J0OnRoaXMuc2hvcnQoY29tYm8pfVxuICAgICAgICByZXR1cm4gaW5mb1xuICAgIH1cblxuICAgIHN0YXRpYyBtb2RpZmllck5hbWVzID0gWydzaGlmdCcsJ2N0cmwnLCdhbHQnLCdjb21tYW5kJ11cblxuICAgIHN0YXRpYyBtb2RpZmllckNoYXJzID0gWyfijIInLCfijIMnLCfijKUnLCfijJgnXVxuXG4gICAgc3RhdGljIGljb25LZXlOYW1lcyA9IFsnc2hpZnQnLCdjdHJsJywnYWx0JywnY29tbWFuZCcsJ2JhY2tzcGFjZScsJ2RlbGV0ZScsJ2hvbWUnLCdlbmQnLCdwYWdlIHVwJywncGFnZSBkb3duJywncmV0dXJuJywnZW50ZXInLCd1cCcsJ2Rvd24nLCdsZWZ0JywncmlnaHQnLCd0YWInLCdzcGFjZScsJ2NsaWNrJ11cblxuICAgIHN0YXRpYyBpY29uS2V5Q2hhcnMgPSBbJ+KMgicsJ+KMgycsJ+KMpScsJ+KMmCcsJ+KMqycsJ+KMpicsJ+KGlicsJ+KGmCcsJ+KHnicsJ+KHnycsJ+KGqScsJ+KGqScsJ+KGkScsJ+KGkycsJ+KGkCcsJ+KGkicsJ+KkoCcsJ+KQoycsJ+KNnSddXG5cbiAgICBzdGF0aWMgZm9yQ29tYm8gKGNvbWJvKVxuICAgIHtcbiAgICAgICAgdmFyIGMsIGNoYXIsIGtleSwgbW9kc1xuXG4gICAgICAgIG1vZHMgPSBbXVxuICAgICAgICBjaGFyID0gbnVsbFxuICAgICAgICB2YXIgbGlzdCA9IF9rXy5saXN0KGNvbWJvLnNwbGl0KCcrJykpXG4gICAgICAgIGZvciAodmFyIF8zNF8xNF8gPSAwOyBfMzRfMTRfIDwgbGlzdC5sZW5ndGg7IF8zNF8xNF8rKylcbiAgICAgICAge1xuICAgICAgICAgICAgYyA9IGxpc3RbXzM0XzE0X11cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW9kaWZpZXIoYykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kcy5wdXNoKGMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5ID0gY1xuICAgICAgICAgICAgICAgIGlmIChjLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXIgPSBjXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7bW9kOm1vZHMuam9pbignKycpLGtleTprZXksY29tYm86Y29tYm8sY2hhcjpjaGFyfVxuICAgIH1cblxuICAgIHN0YXRpYyBpc01vZGlmaWVyIChrZXluYW1lKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9rXy5pbihrZXluYW1lLHRoaXMubW9kaWZpZXJOYW1lcylcbiAgICB9XG5cbiAgICBzdGF0aWMgbW9kaWZpZXJzRm9yRXZlbnQgKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIG1vZHNcblxuICAgICAgICBtb2RzID0gW11cbiAgICAgICAgaWYgKGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQua2V5ID09PSAnTWV0YScpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vZHMucHVzaCgnY29tbWFuZCcpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmFsdEtleSB8fCBldmVudC5rZXkgPT09ICdBbHQnKVxuICAgICAgICB7XG4gICAgICAgICAgICBtb2RzLnB1c2goJ2FsdCcpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQua2V5ID09PSAnQ29udHJvbCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vZHMucHVzaCgnY3RybCcpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmtleSA9PT0gJ1NoaWZ0JylcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kcy5wdXNoKCdzaGlmdCcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZHMuam9pbignKycpXG4gICAgfVxuXG4gICAgc3RhdGljIGNvbWJvRm9yRXZlbnQgKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGpvaW4sIGtleVxuXG4gICAgICAgIGpvaW4gPSBmdW5jdGlvbiAoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgYXJnc1xuXG4gICAgICAgICAgICBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsMClcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLmZpbHRlcihmdW5jdGlvbiAoZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGUgIT0gbnVsbCA/IGUubGVuZ3RoIDogdW5kZWZpbmVkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBhcmdzLmpvaW4oJysnKVxuICAgICAgICB9XG4gICAgICAgIGtleSA9IHRoaXMua2V5bmFtZUZvckV2ZW50KGV2ZW50KVxuICAgICAgICBpZiAoIShfa18uaW4oa2V5LHRoaXMubW9kaWZpZXJOYW1lcykpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gam9pbih0aGlzLm1vZGlmaWVyc0ZvckV2ZW50KGV2ZW50KSxrZXkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgc3RhdGljIGNvbnZlcnRDbWRDdHJsIChjb21ibylcbiAgICB7XG4gICAgICAgIHZhciBpbmRleFxuXG4gICAgICAgIGluZGV4ID0gY29tYm8uaW5kZXhPZignY21kY3RybCcpXG4gICAgICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAob3MuaXNNYWMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29tYm8gPSBjb21iby5yZXBsYWNlKCdjbWRjdHJsJywnY29tbWFuZCcpXG4gICAgICAgICAgICAgICAgY29tYm8gPSBjb21iby5yZXBsYWNlKCdhbHQrY29tbWFuZCcsJ2NvbW1hbmQrYWx0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb21ibyA9IGNvbWJvLnJlcGxhY2UoJ2NtZGN0cmwnLCdjdHJsJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tYm9cbiAgICB9XG5cbiAgICBzdGF0aWMga2V5bmFtZUZvckV2ZW50IChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBfMTA4XzQ1XywgXzk5XzMzX1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnSW50bEJhY2tzbGFzaCc6XG4gICAgICAgICAgICBjYXNlICdCYWNrc2xhc2gnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXCdcblxuICAgICAgICAgICAgY2FzZSAnRXF1YWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnPSdcblxuICAgICAgICAgICAgY2FzZSAnTWludXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnLSdcblxuICAgICAgICAgICAgY2FzZSAnUGx1cyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcrJ1xuXG4gICAgICAgICAgICBjYXNlICdTbGFzaCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcvJ1xuXG4gICAgICAgICAgICBjYXNlICdRdW90ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiJ1wiXG5cbiAgICAgICAgICAgIGNhc2UgJ0NvbW1hJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJywnXG5cbiAgICAgICAgICAgIGNhc2UgJ1BlcmlvZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcuJ1xuXG4gICAgICAgICAgICBjYXNlICdTcGFjZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdzcGFjZSdcblxuICAgICAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2VzYydcblxuICAgICAgICAgICAgY2FzZSAnU2VtaWNvbG9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzsnXG5cbiAgICAgICAgICAgIGNhc2UgJ0JyYWNrZXRMZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1snXG5cbiAgICAgICAgICAgIGNhc2UgJ0JyYWNrZXRSaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICddJ1xuXG4gICAgICAgICAgICBjYXNlICdCYWNrcXVvdGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnYCdcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAoIShldmVudC5rZXkgIT0gbnVsbCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkuc3RhcnRzV2l0aCgnQXJyb3cnKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5LnNsaWNlKDUpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmNvZGUuc3RhcnRzV2l0aCgnS2V5JykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmNvZGUuc2xpY2UoMykudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQuY29kZS5zdGFydHNXaXRoKCdEaWdpdCcpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudC5jb2RlLnNsaWNlKDUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChfa18uaW4oZXZlbnQua2V5LFsnRGVsZXRlJywnSW5zZXJ0JywnRW50ZXInLCdCYWNrc3BhY2UnLCdIb21lJywnRW5kJ10pKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudC5rZXkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnUGFnZVVwJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3BhZ2UgdXAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT09ICdQYWdlRG93bicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwYWdlIGRvd24nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT09ICdDb250cm9sJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2N0cmwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT09ICdNZXRhJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbW1hbmQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgodGhpcy5jaGFyYWN0ZXJGb3JFdmVudChldmVudCkgIT0gbnVsbCA/IHRoaXMuY2hhcmFjdGVyRm9yRXZlbnQoZXZlbnQpLmxlbmd0aCA6IHVuZGVmaW5lZCkgPT09IDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyRm9yRXZlbnQoZXZlbnQpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgc3RhdGljIGNoYXJhY3RlckZvckV2ZW50IChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBfMTEzXzIwX1xuXG4gICAgICAgIGlmICgoZXZlbnQua2V5ICE9IG51bGwgPyBldmVudC5rZXkubGVuZ3RoIDogdW5kZWZpbmVkKSA9PT0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmtleVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09ICdOdW1wYWRFcXVhbCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnPSdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzaG9ydCAoY29tYm8pXG4gICAge1xuICAgICAgICB2YXIgaVxuXG4gICAgICAgIGNvbWJvID0gdGhpcy5jb252ZXJ0Q21kQ3RybChjb21iby50b0xvd2VyQ2FzZSgpKVxuICAgICAgICBmb3IgKHZhciBfMTIxXzE4XyA9IGkgPSAwLCBfMTIxXzIyXyA9IHRoaXMuaWNvbktleU5hbWVzLmxlbmd0aDsgKF8xMjFfMThfIDw9IF8xMjFfMjJfID8gaSA8IHRoaXMuaWNvbktleU5hbWVzLmxlbmd0aCA6IGkgPiB0aGlzLmljb25LZXlOYW1lcy5sZW5ndGgpOyAoXzEyMV8xOF8gPD0gXzEyMV8yMl8gPyArK2kgOiAtLWkpKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb21ibyA9IGNvbWJvLnJlcGxhY2UobmV3IFJlZ0V4cCh0aGlzLmljb25LZXlOYW1lc1tpXSwnZ2knKSx0aGlzLmljb25LZXlDaGFyc1tpXSlcbiAgICAgICAgfVxuICAgICAgICBjb21ibyA9IGNvbWJvLnJlcGxhY2UoL1xcKy9nLCcnKVxuICAgICAgICByZXR1cm4gY29tYm8udG9VcHBlckNhc2UoKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5aW5mbzsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rXyA9IHtpbjogZnVuY3Rpb24gKGEsbCkge3JldHVybiAodHlwZW9mIGwgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBhID09PSAnc3RyaW5nJyAmJiBhLmxlbmd0aCA/ICcnIDogW10pLmluZGV4T2YuY2FsbChsLGEpID49IDB9fVxuXG52YXIgY29sbGVjdCwgZmluZCwgZ2V0LCByZWdleHBcblxuXG5yZWdleHAgPSBmdW5jdGlvbiAocylcbntcbiAgICBzID0gU3RyaW5nKHMpXG4gICAgcyA9IHMucmVwbGFjZSgvKFteLl0rXFx8W14uXSspL2csJygkMSknKVxuICAgIHMgPSBzLnJlcGxhY2UoL1xcLi9nLCdcXFxcLicpXG4gICAgcyA9IHMucmVwbGFjZSgvXFxeL2csJ1xcXFxeJylcbiAgICBzID0gcy5yZXBsYWNlKC9cXD8vZywnW14uXScpXG4gICAgcyA9IHMucmVwbGFjZSgvXFwqXFwqL2csJyMjIyMnKVxuICAgIHMgPSBzLnJlcGxhY2UoL1xcKi9nLCdbXi5dKicpXG4gICAgcyA9IHMucmVwbGFjZSgvIyMjIy9nLCcuKicpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeXCIgKyBzICsgXCIkXCIpXG59XG5cbmNvbGxlY3QgPSBmdW5jdGlvbiAob2JqZWN0LCBmaWx0ZXIsIG1hcCwgY291bnQgPSAtMSwga2V5UGF0aCA9IFtdLCByZXN1bHQgPSBbXSlcbntcbiAgICB2YXIgaSwgaywgdlxuXG4gICAgZmlsdGVyID0gKGZpbHRlciAhPSBudWxsID8gZmlsdGVyIDogZnVuY3Rpb24gKHAsIGssIHYpXG4gICAge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gICAgbWFwID0gKG1hcCAhPSBudWxsID8gbWFwIDogZnVuY3Rpb24gKHAsIHYpXG4gICAge1xuICAgICAgICByZXR1cm4gW3Asdl1cbiAgICB9KVxuICAgIHN3aXRjaCAob2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUpXG4gICAge1xuICAgICAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgICAgICAgIGZvciAodmFyIF80OV8yMl8gPSBpID0gMCwgXzQ5XzI2XyA9IG9iamVjdC5sZW5ndGg7IChfNDlfMjJfIDw9IF80OV8yNl8gPyBpIDwgb2JqZWN0Lmxlbmd0aCA6IGkgPiBvYmplY3QubGVuZ3RoKTsgKF80OV8yMl8gPD0gXzQ5XzI2XyA/ICsraSA6IC0taSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdiA9IG9iamVjdFtpXVxuICAgICAgICAgICAgICAgIGtleVBhdGgucHVzaChpKVxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIoa2V5UGF0aCxpLHYpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobWFwKFtdLmNvbmNhdChrZXlQYXRoKSx2KSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCAmJiByZXN1bHQubGVuZ3RoID49IGNvdW50KVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9rXy5pbigodiAhPSBudWxsID8gdi5jb25zdHJ1Y3Rvci5uYW1lIDogdW5kZWZpbmVkKSxbXCJBcnJheVwiLFwiT2JqZWN0XCJdKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3QodixmaWx0ZXIsbWFwLGNvdW50LGtleVBhdGgscmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZXlQYXRoLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwiT2JqZWN0XCI6XG4gICAgICAgICAgICBmb3IgKGsgaW4gb2JqZWN0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHYgPSBvYmplY3Rba11cbiAgICAgICAgICAgICAgICBrZXlQYXRoLnB1c2goaylcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGtleVBhdGgsayx2KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1hcChbXS5jb25jYXQoa2V5UGF0aCksdikpXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDAgJiYgcmVzdWx0Lmxlbmd0aCA+PSBjb3VudClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfa18uaW4oKHYgIT0gbnVsbCA/IHYuY29uc3RydWN0b3IubmFtZSA6IHVuZGVmaW5lZCksW1wiQXJyYXlcIixcIk9iamVjdFwiXSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0KHYsZmlsdGVyLG1hcCxjb3VudCxrZXlQYXRoLHJlc3VsdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5UGF0aC5wb3AoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmZpbmQgPSAoZnVuY3Rpb24gKClcbntcbiAgICBmdW5jdGlvbiBmaW5kICgpXG4gICAge31cblxuICAgIGZpbmRbXCJrZXlcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBrZXkpXG4gICAge1xuICAgICAgICB2YXIga2V5UmVnXG5cbiAgICAgICAga2V5UmVnID0gdGhpcy5yZWcoa2V5KVxuICAgICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZShvYmplY3QsKGZ1bmN0aW9uIChwLCBrLCB2KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChrLGtleVJlZylcbiAgICAgICAgfSkuYmluZCh0aGlzKSlcbiAgICB9XG5cbiAgICBmaW5kW1wicGF0aFwiXSA9IGZ1bmN0aW9uIChvYmplY3QsIHBhdGgpXG4gICAge1xuICAgICAgICB2YXIgcHRoUmVnXG5cbiAgICAgICAgcHRoUmVnID0gdGhpcy5yZWcocGF0aClcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2Uob2JqZWN0LChmdW5jdGlvbiAocCwgaywgdilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hQYXRoKHAscHRoUmVnKVxuICAgICAgICB9KS5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIGZpbmRbXCJ2YWx1ZVwiXSA9IGZ1bmN0aW9uIChvYmplY3QsIHZhbClcbiAgICB7XG4gICAgICAgIHZhciB2YWxSZWdcblxuICAgICAgICB2YWxSZWcgPSB0aGlzLnJlZyh2YWwpXG4gICAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKG9iamVjdCwoZnVuY3Rpb24gKHAsIGssIHYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoKHYsdmFsUmVnKVxuICAgICAgICB9KS5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIGZpbmRbXCJrZXlWYWx1ZVwiXSA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsKVxuICAgIHtcbiAgICAgICAgdmFyIGtleVJlZywgdmFsUmVnXG5cbiAgICAgICAga2V5UmVnID0gdGhpcy5yZWcoa2V5KVxuICAgICAgICB2YWxSZWcgPSB0aGlzLnJlZyh2YWwpXG4gICAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKG9iamVjdCwoZnVuY3Rpb24gKHAsIGssIHYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoKGssa2V5UmVnKSAmJiB0aGlzLm1hdGNoKHYsdmFsUmVnKVxuICAgICAgICB9KS5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIGZpbmRbXCJwYXRoVmFsdWVcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBwYXRoLCB2YWwpXG4gICAge1xuICAgICAgICB2YXIgcHRoUmVnLCB2YWxSZWdcblxuICAgICAgICBwdGhSZWcgPSB0aGlzLnJlZyhwYXRoKVxuICAgICAgICB2YWxSZWcgPSB0aGlzLnJlZyh2YWwpXG4gICAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKG9iamVjdCwoZnVuY3Rpb24gKHAsIGssIHYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoUGF0aChwLHB0aFJlZykgJiYgdGhpcy5tYXRjaCh2LHZhbFJlZylcbiAgICAgICAgfSkuYmluZCh0aGlzKSlcbiAgICB9XG5cbiAgICBmaW5kW1widHJhdmVyc2VcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBmdW5jKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Qob2JqZWN0LGZ1bmMsZnVuY3Rpb24gKHAsIHYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZmluZFtcIm1hdGNoUGF0aFwiXSA9IGZ1bmN0aW9uIChhLCByKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goYS5qb2luKCcuJykscilcbiAgICB9XG5cbiAgICBmaW5kW1wibWF0Y2hcIl0gPSBmdW5jdGlvbiAoYSwgcilcbiAgICB7XG4gICAgICAgIHZhciBfMTE4XzMwX1xuXG4gICAgICAgIGlmICghKGEgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoU3RyaW5nKGEpLm1hdGNoKHIpICE9IG51bGwgPyBTdHJpbmcoYSkubWF0Y2gocikubGVuZ3RoIDogdW5kZWZpbmVkKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kW1wicmVnXCJdID0gZnVuY3Rpb24gKHMpXG4gICAge1xuICAgICAgICByZXR1cm4gcmVnZXhwKHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmRcbn0pKClcblxuXG5nZXQgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXlwYXRoLCBkZWZhdWx0VmFsdWUpXG57XG4gICAgdmFyIGtwXG5cbiAgICBpZiAoIW9iamVjdClcbiAgICB7XG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIShrZXlwYXRoICE9IG51bGwgPyBrZXlwYXRoLmxlbmd0aCA6IHVuZGVmaW5lZCkpXG4gICAge1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHR5cGVvZihrZXlwYXRoKSA9PT0gJ3N0cmluZycpXG4gICAge1xuICAgICAgICBrZXlwYXRoID0ga2V5cGF0aC5zcGxpdCgnLicpXG4gICAgfVxuICAgIGtwID0gW10uY29uY2F0KGtleXBhdGgpXG4gICAgd2hpbGUgKGtwLmxlbmd0aClcbiAgICB7XG4gICAgICAgIG9iamVjdCA9IG9iamVjdFtrcC5zaGlmdCgpXVxuICAgICAgICBpZiAoIShvYmplY3QgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0XG59XG5leHBvcnQgZGVmYXVsdCB7ZmluZDpmaW5kLGdldDpnZXR9OyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2xpc3Q6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGwgIT0gbnVsbCA/IHR5cGVvZiBsLmxlbmd0aCA9PT0gJ251bWJlcicgPyBsIDogW10gOiBbXX0sIGVtcHR5OiBmdW5jdGlvbiAobCkge3JldHVybiBsPT09JycgfHwgbD09PW51bGwgfHwgbD09PXVuZGVmaW5lZCB8fCBsIT09bCB8fCB0eXBlb2YobCkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGwpLmxlbmd0aCA9PT0gMH19XG5cbnZhciBlbGVtLCBQb3B1cCwgc3RvcEV2ZW50XG5cbmltcG9ydCBvcyBmcm9tICcuL29zLmpzJ1xuaW1wb3J0IGRvbSBmcm9tICcuL2RvbS5qcydcbmltcG9ydCBwb3N0IGZyb20gJy4vcG9zdC5qcydcbmltcG9ydCBzbGFzaCBmcm9tICcuL3NsYXNoLmpzJ1xuaW1wb3J0IGtleWluZm8gZnJvbSAnLi9rZXlpbmZvLmpzJ1xuaW1wb3J0IHBvcHVwIGZyb20gJy4vcG9wdXAuanMnXG5lbGVtID0gZG9tLmVsZW1cbnN0b3BFdmVudCA9IGRvbS5zdG9wRXZlbnRcblxuXG5Qb3B1cCA9IChmdW5jdGlvbiAoKVxue1xuICAgIGZ1bmN0aW9uIFBvcHVwIChvcHQpXG4gICAge1xuICAgICAgICB2YXIgYnIsIGNoaWxkLCBkaXYsIGl0ZW0sIHRleHQsIF80N18zMF8sIF80OF82NF8sIF80OF85Ml9cblxuICAgICAgICB0aGlzW1wib25LZXlEb3duXCJdID0gdGhpc1tcIm9uS2V5RG93blwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbkZvY3VzT3V0XCJdID0gdGhpc1tcIm9uRm9jdXNPdXRcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25Db250ZXh0TWVudVwiXSA9IHRoaXNbXCJvbkNvbnRleHRNZW51XCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uQ2xpY2tcIl0gPSB0aGlzW1wib25DbGlja1wiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbkhvdmVyXCJdID0gdGhpc1tcIm9uSG92ZXJcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wiYWN0aXZhdGVcIl0gPSB0aGlzW1wiYWN0aXZhdGVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wiY2xvc2VcIl0gPSB0aGlzW1wiY2xvc2VcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmZvY3VzRWxlbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgdGhpcy5pdGVtcyA9IGVsZW0oe2NsYXNzOidwb3B1cCcsdGFiaW5kZXg6MH0pXG4gICAgICAgIHRoaXMucGFyZW50ID0gb3B0LnBhcmVudFxuICAgICAgICB0aGlzLm9uQ2xvc2UgPSBvcHQub25DbG9zZVxuICAgICAgICBpZiAob3B0LmNsYXNzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLmNsYXNzTGlzdC5hZGQob3B0LmNsYXNzKVxuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ID0gX2tfLmxpc3Qob3B0Lml0ZW1zKVxuICAgICAgICBmb3IgKHZhciBfMjlfMTdfID0gMDsgXzI5XzE3XyA8IGxpc3QubGVuZ3RoOyBfMjlfMTdfKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGl0ZW0gPSBsaXN0W18yOV8xN19dXG4gICAgICAgICAgICBpZiAoaXRlbS5oaWRlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2tfLmVtcHR5KChpdGVtLnRleHQpKSAmJiBfa18uZW1wdHkoKGl0ZW0uaHRtbCkpICYmIF9rXy5lbXB0eSgoaXRlbS5jaGlsZCkpICYmIF9rXy5lbXB0eSgoaXRlbS5jaGlsZHJlbikpICYmIF9rXy5lbXB0eSgoaXRlbS5pbWcpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXYgPSBlbGVtKCdocicse2NsYXNzOidwb3B1cEl0ZW0gc2VwYXJhdG9yJ30pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGl2ID0gZWxlbSh7Y2xhc3M6J3BvcHVwSXRlbScsdGV4dDppdGVtLnRleHR9KVxuICAgICAgICAgICAgICAgIGlmICghX2tfLmVtcHR5KGl0ZW0uaHRtbCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gaXRlbS5odG1sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmltZylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW0oJ2ltZycse2NsYXNzOidwb3B1cEltYWdlJyxzcmM6c2xhc2guZmlsZVVybChpdGVtLmltZyl9KSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jaGlsZClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGl0ZW0uY2hpbGQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0MSA9IF9rXy5saXN0KGl0ZW0uY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfNDNfMzRfID0gMDsgXzQzXzM0XyA8IGxpc3QxLmxlbmd0aDsgXzQzXzM0XysrKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gbGlzdDFbXzQzXzM0X11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGl2Lml0ZW0gPSBpdGVtXG4gICAgICAgICAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyx0aGlzLm9uQ2xpY2spXG4gICAgICAgICAgICAgICAgaWYgKCgoXzQ3XzMwXz1pdGVtLmNvbWJvKSAhPSBudWxsID8gXzQ3XzMwXyA6IGl0ZW0uYWNjZWwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGtleWluZm8uc2hvcnQoKG9zLmlzTWFjID8gKCgoXzQ4XzY0Xz1pdGVtLmNvbWJvKSAhPSBudWxsID8gXzQ4XzY0XyA6IGl0ZW0uYWNjZWwpKSA6ICgoKF80OF85Ml89aXRlbS5hY2NlbCkgIT0gbnVsbCA/IF80OF85Ml8gOiBpdGVtLmNvbWJvKSkpKVxuICAgICAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbSgnc3Bhbicse2NsYXNzOidwb3B1cENvbWJvJyx0ZXh0OnRleHR9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXRlbS5tZW51KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW0oJ3NwYW4nLHtjbGFzczoncG9wdXBDb21ibycsdGV4dDon4pa2J30pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXRlbXMuYXBwZW5kQ2hpbGQoZGl2KVxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5pdGVtcylcbiAgICAgICAgdGhpcy5pdGVtcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsdGhpcy5vbkNvbnRleHRNZW51KVxuICAgICAgICB0aGlzLml0ZW1zLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMub25LZXlEb3duKVxuICAgICAgICB0aGlzLml0ZW1zLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jyx0aGlzLm9uRm9jdXNPdXQpXG4gICAgICAgIHRoaXMuaXRlbXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJyx0aGlzLm9uSG92ZXIpXG4gICAgICAgIGJyID0gdGhpcy5pdGVtcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBpZiAob3B0LnggKyBici53aWR0aCA+IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3R5bGUubGVmdCA9IGAke2RvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSBici53aWR0aH1weGBcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3R5bGUubGVmdCA9IGAke29wdC54fXB4YFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHQueSArIGJyLmhlaWdodCA+IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnN0eWxlLnRvcCA9IGAke2RvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gYnIuaGVpZ2h0fXB4YFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zdHlsZS50b3AgPSBgJHtvcHQueX1weGBcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LnNlbGVjdEZpcnN0SXRlbSAhPT0gZmFsc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KHRoaXMuaXRlbXMuZmlyc3RDaGlsZCx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImNsb3NlXCJdID0gZnVuY3Rpb24gKG9wdCA9IHt9KVxuICAgIHtcbiAgICAgICAgdmFyIF8xMDJfMjJfLCBfMTA2XzIyXywgXzg1XzQyXywgXzg1XzQ4XywgXzg2XzMzXywgXzkwXzE0XywgXzkzXzE0XywgXzk0XzE0XywgXzk1XzE0XywgXzk2XzE0XywgXzk5XzE1X1xuXG4gICAgICAgIGlmIChfa18uZW1wdHkoKHRoaXMucGFyZW50KSkgfHwgKChfODVfNDJfPXRoaXMucGFyZW50TWVudSgpKSAhPSBudWxsID8gKF84NV80OF89Xzg1XzQyXy5lbGVtKSAhPSBudWxsID8gXzg1XzQ4Xy5jbGFzc0xpc3QuY29udGFpbnMoJ21lbnUnKSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgnc2tpcCcgPT09ICh0eXBlb2YgdGhpcy5vbkNsb3NlID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLm9uQ2xvc2UoKSA6IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgOyh0aGlzLnBvcHVwICE9IG51bGwgPyB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pIDogdW5kZWZpbmVkKVxuICAgICAgICBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICA7KHRoaXMuaXRlbXMgIT0gbnVsbCA/IHRoaXMuaXRlbXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcy5vbktleURvd24pIDogdW5kZWZpbmVkKVxuICAgICAgICA7KHRoaXMuaXRlbXMgIT0gbnVsbCA/IHRoaXMuaXRlbXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLHRoaXMub25Gb2N1c091dCkgOiB1bmRlZmluZWQpXG4gICAgICAgIDsodGhpcy5pdGVtcyAhPSBudWxsID8gdGhpcy5pdGVtcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLHRoaXMub25Ib3ZlcikgOiB1bmRlZmluZWQpXG4gICAgICAgIDsodGhpcy5pdGVtcyAhPSBudWxsID8gdGhpcy5pdGVtcy5yZW1vdmUoKSA6IHVuZGVmaW5lZClcbiAgICAgICAgZGVsZXRlIHRoaXMuaXRlbXNcbiAgICAgICAgOyh0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQuY2hpbGRDbG9zZWQodGhpcyxvcHQpIDogdW5kZWZpbmVkKVxuICAgICAgICBpZiAob3B0LmFsbClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5jbG9zZShvcHQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdC5mb2N1cyAhPT0gZmFsc2UgJiYgIXRoaXMucGFyZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZm9jdXNFbGVtICE9IG51bGwgPyB0aGlzLmZvY3VzRWxlbS5mb2N1cygpIDogdW5kZWZpbmVkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiY2hpbGRDbG9zZWRcIl0gPSBmdW5jdGlvbiAoY2hpbGQsIG9wdClcbiAgICB7XG4gICAgICAgIGlmIChjaGlsZCA9PT0gdGhpcy5wb3B1cClcbiAgICAgICAge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgICAgIGlmIChvcHQuZm9jdXMgIT09IGZhbHNlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcInNlbGVjdFwiXSA9IGZ1bmN0aW9uIChpdGVtLCBvcHQgPSB7fSlcbiAgICB7XG4gICAgICAgIHZhciBfMTI1XzE3XywgXzEyOF8xN18sIF8xMzJfMjBfXG5cbiAgICAgICAgaWYgKCEoaXRlbSAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0aGlzLnBvcHVwICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pXG4gICAgICAgIH1cbiAgICAgICAgOyh0aGlzLnNlbGVjdGVkICE9IG51bGwgPyB0aGlzLnNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykgOiB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBpdGVtXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICBpZiAoKGl0ZW0uaXRlbSAhPSBudWxsID8gaXRlbS5pdGVtLm1lbnUgOiB1bmRlZmluZWQpICYmIG9wdC5vcGVuICE9PSBmYWxzZSlcbiAgICAgICAge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgICAgIHRoaXMucG9wdXBDaGlsZChpdGVtLG9wdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mb2N1cygpXG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wicG9wdXBDaGlsZFwiXSA9IGZ1bmN0aW9uIChpdGVtLCBvcHQgPSB7fSlcbiAgICB7XG4gICAgICAgIHZhciBiciwgaXRlbXNcblxuICAgICAgICBpZiAoaXRlbXMgPSBpdGVtLml0ZW0ubWVudSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VQb3B1cCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnIgPSBpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9wdXAgPSBuZXcgUG9wdXAoe2l0ZW1zOml0ZW1zLHBhcmVudDp0aGlzLHg6YnIubGVmdCArIGJyLndpZHRoLHk6YnIudG9wLHNlbGVjdEZpcnN0SXRlbToob3B0ICE9IG51bGwgPyBvcHQuc2VsZWN0Rmlyc3RJdGVtIDogdW5kZWZpbmVkKX0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJjbG9zZVBvcHVwXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMTU1XzE0X1xuXG4gICAgICAgIDsodGhpcy5wb3B1cCAhPSBudWxsID8gdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KSA6IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wibmF2aWdhdGVMZWZ0XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBtXG5cbiAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlUG9wdXAoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG0gPSB0aGlzLnBhcmVudE1lbnUoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIG0ubmF2aWdhdGVMZWZ0KClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2Uoe2ZvY3VzOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImFjdGl2YXRlT3JOYXZpZ2F0ZVJpZ2h0XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMTc1XzIwX1xuXG4gICAgICAgIGlmICgodGhpcy5zZWxlY3RlZCAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkLml0ZW0ubWVudSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZSh0aGlzLnNlbGVjdGVkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5hdmlnYXRlUmlnaHQoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wibmF2aWdhdGVSaWdodFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE4NF8yNV8sIF8xODdfMjVfXG5cbiAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvcHVwLnNlbGVjdCh0aGlzLnBvcHVwLml0ZW1zLmZpcnN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKHRoaXMuc2VsZWN0ZWQgIT0gbnVsbCA/IHRoaXMuc2VsZWN0ZWQuaXRlbS5tZW51IDogdW5kZWZpbmVkKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuc2VsZWN0ZWQse3NlbGVjdEZpcnN0SXRlbTp0cnVlfSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wYXJlbnRNZW51KCkgIT0gbnVsbCA/IHRoaXMucGFyZW50TWVudSgpLm5hdmlnYXRlUmlnaHQoKSA6IHVuZGVmaW5lZClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcInBhcmVudE1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8xOTBfMThfXG5cbiAgICAgICAgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiAhdGhpcy5wYXJlbnQucGFyZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm5leHRJdGVtXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBuZXh0LCBfMjAyXzM4X1xuXG4gICAgICAgIGlmIChuZXh0ID0gdGhpcy5zZWxlY3RlZClcbiAgICAgICAge1xuICAgICAgICAgICAgd2hpbGUgKG5leHQgPSBuZXh0Lm5leHRTaWJsaW5nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghX2tfLmVtcHR5KChuZXh0Lml0ZW0gIT0gbnVsbCA/IG5leHQuaXRlbS50ZXh0IDogdW5kZWZpbmVkKSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcInByZXZJdGVtXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBwcmV2LCBfMjA4XzM4X1xuXG4gICAgICAgIGlmIChwcmV2ID0gdGhpcy5zZWxlY3RlZClcbiAgICAgICAge1xuICAgICAgICAgICAgd2hpbGUgKHByZXYgPSBwcmV2LnByZXZpb3VzU2libGluZylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9rXy5lbXB0eSgocHJldi5pdGVtICE9IG51bGwgPyBwcmV2Lml0ZW0udGV4dCA6IHVuZGVmaW5lZCkpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJhY3RpdmF0ZVwiXSA9IGZ1bmN0aW9uIChpdGVtKVxuICAgIHtcbiAgICAgICAgdmFyIF8yMTlfMjBfLCBfMjE5XzI0XywgXzIyMV8zOV8sIF8yMjRfNTJfXG5cbiAgICAgICAgaWYgKCgoaXRlbS5pdGVtICE9IG51bGwgPyBpdGVtLml0ZW0uY2IgOiB1bmRlZmluZWQpICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKHthbGw6dHJ1ZX0pXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5pdGVtLmNiKCgoXzIyMV8zOV89aXRlbS5pdGVtLmFyZykgIT0gbnVsbCA/IF8yMjFfMzlfIDogaXRlbS5pdGVtLnRleHQpKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFpdGVtLml0ZW0ubWVudSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSh7YWxsOnRydWV9KVxuICAgICAgICAgICAgcmV0dXJuIHBvc3QuZW1pdCgnbWVudUFjdGlvbicsKChfMjI0XzUyXz1pdGVtLml0ZW0uYWN0aW9uKSAhPSBudWxsID8gXzIyNF81Ml8gOiBpdGVtLml0ZW0udGV4dCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJ0b2dnbGVcIl0gPSBmdW5jdGlvbiAoaXRlbSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnBvcHVwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pXG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdChpdGVtLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wib25Ib3ZlclwiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBpdGVtXG5cbiAgICAgICAgaXRlbSA9IGVsZW0udXBFbGVtKGV2ZW50LnRhcmdldCx7cHJvcDonaXRlbSd9KVxuICAgICAgICBpZiAoaXRlbSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KGl0ZW0se3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJvbkNsaWNrXCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGl0ZW1cblxuICAgICAgICBzdG9wRXZlbnQoZXZlbnQpXG4gICAgICAgIGl0ZW0gPSBlbGVtLnVwRWxlbShldmVudC50YXJnZXQse3Byb3A6J2l0ZW0nfSlcbiAgICAgICAgaWYgKGl0ZW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChpdGVtLml0ZW0ubWVudSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2dnbGUoaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZShpdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wib25Db250ZXh0TWVudVwiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQpXG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiZm9jdXNcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8yNjVfMjBfXG5cbiAgICAgICAgcmV0dXJuICh0aGlzLml0ZW1zICE9IG51bGwgPyB0aGlzLml0ZW1zLmZvY3VzKCkgOiB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wib25Gb2N1c091dFwiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBfMjY5XzM0X1xuXG4gICAgICAgIGlmICghKGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT0gbnVsbCA/IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cCcpIDogdW5kZWZpbmVkKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2Uoe2FsbDp0cnVlLGZvY3VzOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm9uS2V5RG93blwiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBjb21ibywga2V5LCBtb2RcblxuICAgICAgICBtb2QgPSBrZXlpbmZvLmZvckV2ZW50KGV2ZW50KS5tb2RcbiAgICAgICAga2V5ID0ga2V5aW5mby5mb3JFdmVudChldmVudCkua2V5XG4gICAgICAgIGNvbWJvID0ga2V5aW5mby5mb3JFdmVudChldmVudCkuY29tYm9cblxuICAgICAgICBzd2l0Y2ggKGNvbWJvKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgY2FzZSAncGFnZSBkb3duJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuc2VsZWN0KHRoaXMuaXRlbXMubGFzdENoaWxkLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KSlcblxuICAgICAgICAgICAgY2FzZSAnaG9tZSc6XG4gICAgICAgICAgICBjYXNlICdwYWdlIHVwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuc2VsZWN0KHRoaXMuaXRlbXMuZmlyc3RDaGlsZCx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2VzYyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLmNsb3NlKCkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5zZWxlY3QodGhpcy5uZXh0SXRlbSgpLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KSlcblxuICAgICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5zZWxlY3QodGhpcy5wcmV2SXRlbSgpLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KSlcblxuICAgICAgICAgICAgY2FzZSAnZW50ZXInOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5hY3RpdmF0ZU9yTmF2aWdhdGVSaWdodCgpKVxuXG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMubmF2aWdhdGVMZWZ0KCkpXG5cbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMubmF2aWdhdGVSaWdodCgpKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBQb3B1cFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCB7bWVudTpmdW5jdGlvbiAob3B0KVxue1xuICAgIHJldHVybiBuZXcgUG9wdXAob3B0KVxufX07IiwKICAiLy8gbW9uc3RlcmtvZGkva29kZSAwLjI1Ni4wXG5cbnZhciBfa18gPSB7bGlzdDogZnVuY3Rpb24gKGwpIHtyZXR1cm4gbCAhPSBudWxsID8gdHlwZW9mIGwubGVuZ3RoID09PSAnbnVtYmVyJyA/IGwgOiBbXSA6IFtdfSwgZW1wdHk6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGw9PT0nJyB8fCBsPT09bnVsbCB8fCBsPT09dW5kZWZpbmVkIHx8IGwhPT1sIHx8IHR5cGVvZihsKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMobCkubGVuZ3RoID09PSAwfX1cblxudmFyIGVsZW0sIFBvcHVwLCBzdG9wRXZlbnRcblxuaW1wb3J0IG9zIGZyb20gJy4vb3MuanMnXG5pbXBvcnQgZG9tIGZyb20gJy4vZG9tLmpzJ1xuaW1wb3J0IHBvc3QgZnJvbSAnLi9wb3N0LmpzJ1xuaW1wb3J0IHNsYXNoIGZyb20gJy4vc2xhc2guanMnXG5pbXBvcnQga2V5aW5mbyBmcm9tICcuL2tleWluZm8uanMnXG5pbXBvcnQgcG9wdXAgZnJvbSAnLi9wb3B1cC5qcydcbmVsZW0gPSBkb20uZWxlbVxuc3RvcEV2ZW50ID0gZG9tLnN0b3BFdmVudFxuXG5cblBvcHVwID0gKGZ1bmN0aW9uICgpXG57XG4gICAgZnVuY3Rpb24gUG9wdXAgKG9wdClcbiAgICB7XG4gICAgICAgIHZhciBiciwgY2hpbGQsIGRpdiwgaXRlbSwgdGV4dCwgXzQ3XzMwXywgXzQ4XzY0XywgXzQ4XzkyX1xuXG4gICAgICAgIHRoaXNbXCJvbktleURvd25cIl0gPSB0aGlzW1wib25LZXlEb3duXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uRm9jdXNPdXRcIl0gPSB0aGlzW1wib25Gb2N1c091dFwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbkNvbnRleHRNZW51XCJdID0gdGhpc1tcIm9uQ29udGV4dE1lbnVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25DbGlja1wiXSA9IHRoaXNbXCJvbkNsaWNrXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uSG92ZXJcIl0gPSB0aGlzW1wib25Ib3ZlclwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJhY3RpdmF0ZVwiXSA9IHRoaXNbXCJhY3RpdmF0ZVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJjbG9zZVwiXSA9IHRoaXNbXCJjbG9zZVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuZm9jdXNFbGVtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICB0aGlzLml0ZW1zID0gZWxlbSh7Y2xhc3M6J3BvcHVwJyx0YWJpbmRleDowfSlcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBvcHQucGFyZW50XG4gICAgICAgIHRoaXMub25DbG9zZSA9IG9wdC5vbkNsb3NlXG4gICAgICAgIGlmIChvcHQuY2xhc3MpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuY2xhc3NMaXN0LmFkZChvcHQuY2xhc3MpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpc3QgPSBfa18ubGlzdChvcHQuaXRlbXMpXG4gICAgICAgIGZvciAodmFyIF8yOV8xN18gPSAwOyBfMjlfMTdfIDwgbGlzdC5sZW5ndGg7IF8yOV8xN18rKylcbiAgICAgICAge1xuICAgICAgICAgICAgaXRlbSA9IGxpc3RbXzI5XzE3X11cbiAgICAgICAgICAgIGlmIChpdGVtLmhpZGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfa18uZW1wdHkoKGl0ZW0udGV4dCkpICYmIF9rXy5lbXB0eSgoaXRlbS5odG1sKSkgJiYgX2tfLmVtcHR5KChpdGVtLmNoaWxkKSkgJiYgX2tfLmVtcHR5KChpdGVtLmNoaWxkcmVuKSkgJiYgX2tfLmVtcHR5KChpdGVtLmltZykpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpdiA9IGVsZW0oJ2hyJyx7Y2xhc3M6J3BvcHVwSXRlbSBzZXBhcmF0b3InfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXYgPSBlbGVtKHtjbGFzczoncG9wdXBJdGVtJyx0ZXh0Oml0ZW0udGV4dH0pXG4gICAgICAgICAgICAgICAgaWYgKCFfa18uZW1wdHkoaXRlbS5odG1sKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBpdGVtLmh0bWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaW1nKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbSgnaW1nJyx7Y2xhc3M6J3BvcHVwSW1hZ2UnLHNyYzpzbGFzaC5maWxlVXJsKGl0ZW0uaW1nKX0pKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaXRlbS5jaGlsZClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbilcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QxID0gX2tfLmxpc3QoaXRlbS5jaGlsZHJlbilcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF80M18zNF8gPSAwOyBfNDNfMzRfIDwgbGlzdDEubGVuZ3RoOyBfNDNfMzRfKyspXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBsaXN0MVtfNDNfMzRfXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaXYuaXRlbSA9IGl0ZW1cbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMub25DbGljaylcbiAgICAgICAgICAgICAgICBpZiAoKChfNDdfMzBfPWl0ZW0uY29tYm8pICE9IG51bGwgPyBfNDdfMzBfIDogaXRlbS5hY2NlbCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0ga2V5aW5mby5zaG9ydCgob3MuaXNNYWMgPyAoKChfNDhfNjRfPWl0ZW0uY29tYm8pICE9IG51bGwgPyBfNDhfNjRfIDogaXRlbS5hY2NlbCkpIDogKCgoXzQ4XzkyXz1pdGVtLmFjY2VsKSAhPSBudWxsID8gXzQ4XzkyXyA6IGl0ZW0uY29tYm8pKSkpXG4gICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtKCdzcGFuJyx7Y2xhc3M6J3BvcHVwQ29tYm8nLHRleHQ6dGV4dH0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpdGVtLm1lbnUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbSgnc3Bhbicse2NsYXNzOidwb3B1cENvbWJvJyx0ZXh0OifilrYnfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pdGVtcy5hcHBlbmRDaGlsZChkaXYpXG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1zKVxuICAgICAgICB0aGlzLml0ZW1zLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51Jyx0aGlzLm9uQ29udGV4dE1lbnUpXG4gICAgICAgIHRoaXMuaXRlbXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcy5vbktleURvd24pXG4gICAgICAgIHRoaXMuaXRlbXMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLHRoaXMub25Gb2N1c091dClcbiAgICAgICAgdGhpcy5pdGVtcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLHRoaXMub25Ib3ZlcilcbiAgICAgICAgYnIgPSB0aGlzLml0ZW1zLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGlmIChvcHQueCArIGJyLndpZHRoID4gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zdHlsZS5sZWZ0ID0gYCR7ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIGJyLndpZHRofXB4YFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zdHlsZS5sZWZ0ID0gYCR7b3B0Lnh9cHhgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdC55ICsgYnIuaGVpZ2h0ID4gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3R5bGUudG9wID0gYCR7ZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSBici5oZWlnaHR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnN0eWxlLnRvcCA9IGAke29wdC55fXB4YFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHQuc2VsZWN0Rmlyc3RJdGVtICE9PSBmYWxzZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5pdGVtcy5maXJzdENoaWxkLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiY2xvc2VcIl0gPSBmdW5jdGlvbiAob3B0ID0ge30pXG4gICAge1xuICAgICAgICB2YXIgXzEwMl8yMl8sIF8xMDZfMjJfLCBfODVfNDJfLCBfODVfNDhfLCBfODZfMzNfLCBfOTBfMTRfLCBfOTNfMTRfLCBfOTRfMTRfLCBfOTVfMTRfLCBfOTZfMTRfLCBfOTlfMTVfXG5cbiAgICAgICAgaWYgKF9rXy5lbXB0eSgodGhpcy5wYXJlbnQpKSB8fCAoKF84NV80Ml89dGhpcy5wYXJlbnRNZW51KCkpICE9IG51bGwgPyAoXzg1XzQ4Xz1fODVfNDJfLmVsZW0pICE9IG51bGwgPyBfODVfNDhfLmNsYXNzTGlzdC5jb250YWlucygnbWVudScpIDogdW5kZWZpbmVkIDogdW5kZWZpbmVkKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCdza2lwJyA9PT0gKHR5cGVvZiB0aGlzLm9uQ2xvc2UgPT09IFwiZnVuY3Rpb25cIiA/IHRoaXMub25DbG9zZSgpIDogdW5kZWZpbmVkKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7KHRoaXMucG9wdXAgIT0gbnVsbCA/IHRoaXMucG9wdXAuY2xvc2Uoe2ZvY3VzOmZhbHNlfSkgOiB1bmRlZmluZWQpXG4gICAgICAgIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgIDsodGhpcy5pdGVtcyAhPSBudWxsID8gdGhpcy5pdGVtcy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLm9uS2V5RG93bikgOiB1bmRlZmluZWQpXG4gICAgICAgIDsodGhpcy5pdGVtcyAhPSBudWxsID8gdGhpcy5pdGVtcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c291dCcsdGhpcy5vbkZvY3VzT3V0KSA6IHVuZGVmaW5lZClcbiAgICAgICAgOyh0aGlzLml0ZW1zICE9IG51bGwgPyB0aGlzLml0ZW1zLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsdGhpcy5vbkhvdmVyKSA6IHVuZGVmaW5lZClcbiAgICAgICAgOyh0aGlzLml0ZW1zICE9IG51bGwgPyB0aGlzLml0ZW1zLnJlbW92ZSgpIDogdW5kZWZpbmVkKVxuICAgICAgICBkZWxldGUgdGhpcy5pdGVtc1xuICAgICAgICA7KHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5jaGlsZENsb3NlZCh0aGlzLG9wdCkgOiB1bmRlZmluZWQpXG4gICAgICAgIGlmIChvcHQuYWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmNsb3NlKG9wdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LmZvY3VzICE9PSBmYWxzZSAmJiAhdGhpcy5wYXJlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5mb2N1c0VsZW0gIT0gbnVsbCA/IHRoaXMuZm9jdXNFbGVtLmZvY3VzKCkgOiB1bmRlZmluZWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJjaGlsZENsb3NlZFwiXSA9IGZ1bmN0aW9uIChjaGlsZCwgb3B0KVxuICAgIHtcbiAgICAgICAgaWYgKGNoaWxkID09PSB0aGlzLnBvcHVwKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICAgICAgaWYgKG9wdC5mb2N1cyAhPT0gZmFsc2UpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9jdXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wic2VsZWN0XCJdID0gZnVuY3Rpb24gKGl0ZW0sIG9wdCA9IHt9KVxuICAgIHtcbiAgICAgICAgdmFyIF8xMjVfMTdfLCBfMTI4XzE3XywgXzEzMl8yMF9cblxuICAgICAgICBpZiAoIShpdGVtICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHRoaXMucG9wdXAgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuY2xvc2Uoe2ZvY3VzOmZhbHNlfSlcbiAgICAgICAgfVxuICAgICAgICA7KHRoaXMuc2VsZWN0ZWQgIT0gbnVsbCA/IHRoaXMuc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSA6IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGl0ZW1cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgIGlmICgoaXRlbS5pdGVtICE9IG51bGwgPyBpdGVtLml0ZW0ubWVudSA6IHVuZGVmaW5lZCkgJiYgb3B0Lm9wZW4gIT09IGZhbHNlKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICAgICAgdGhpcy5wb3B1cENoaWxkKGl0ZW0sb3B0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZvY3VzKClcbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJwb3B1cENoaWxkXCJdID0gZnVuY3Rpb24gKGl0ZW0sIG9wdCA9IHt9KVxuICAgIHtcbiAgICAgICAgdmFyIGJyLCBpdGVtc1xuXG4gICAgICAgIGlmIChpdGVtcyA9IGl0ZW0uaXRlbS5tZW51KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5wb3B1cClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZVBvcHVwKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiciA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3B1cCA9IG5ldyBQb3B1cCh7aXRlbXM6aXRlbXMscGFyZW50OnRoaXMseDpici5sZWZ0ICsgYnIud2lkdGgseTpici50b3Asc2VsZWN0Rmlyc3RJdGVtOihvcHQgIT0gbnVsbCA/IG9wdC5zZWxlY3RGaXJzdEl0ZW0gOiB1bmRlZmluZWQpfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImNsb3NlUG9wdXBcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8xNTVfMTRfXG5cbiAgICAgICAgOyh0aGlzLnBvcHVwICE9IG51bGwgPyB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pIDogdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMucG9wdXBcbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJuYXZpZ2F0ZUxlZnRcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIG1cblxuICAgICAgICBpZiAodGhpcy5wb3B1cClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VQb3B1cCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobSA9IHRoaXMucGFyZW50TWVudSgpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gbS5uYXZpZ2F0ZUxlZnQoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGFyZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSh7Zm9jdXM6ZmFsc2V9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiYWN0aXZhdGVPck5hdmlnYXRlUmlnaHRcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8xNzVfMjBfXG5cbiAgICAgICAgaWYgKCh0aGlzLnNlbGVjdGVkICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQuaXRlbS5tZW51KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKHRoaXMuc2VsZWN0ZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGVSaWdodCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJuYXZpZ2F0ZVJpZ2h0XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMTg0XzI1XywgXzE4N18yNV9cblxuICAgICAgICBpZiAodGhpcy5wb3B1cClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9wdXAuc2VsZWN0KHRoaXMucG9wdXAuaXRlbXMuZmlyc3RDaGlsZClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgodGhpcy5zZWxlY3RlZCAhPSBudWxsID8gdGhpcy5zZWxlY3RlZC5pdGVtLm1lbnUgOiB1bmRlZmluZWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5zZWxlY3RlZCx7c2VsZWN0Rmlyc3RJdGVtOnRydWV9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnBhcmVudE1lbnUoKSAhPSBudWxsID8gdGhpcy5wYXJlbnRNZW51KCkubmF2aWdhdGVSaWdodCgpIDogdW5kZWZpbmVkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wicGFyZW50TWVudVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE5MF8xOF9cblxuICAgICAgICBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmICF0aGlzLnBhcmVudC5wYXJlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wibmV4dEl0ZW1cIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIG5leHQsIF8yMDJfMzhfXG5cbiAgICAgICAgaWYgKG5leHQgPSB0aGlzLnNlbGVjdGVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAobmV4dCA9IG5leHQubmV4dFNpYmxpbmcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCFfa18uZW1wdHkoKG5leHQuaXRlbSAhPSBudWxsID8gbmV4dC5pdGVtLnRleHQgOiB1bmRlZmluZWQpKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wicHJldkl0ZW1cIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIHByZXYsIF8yMDhfMzhfXG5cbiAgICAgICAgaWYgKHByZXYgPSB0aGlzLnNlbGVjdGVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAocHJldiA9IHByZXYucHJldmlvdXNTaWJsaW5nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghX2tfLmVtcHR5KChwcmV2Lml0ZW0gIT0gbnVsbCA/IHByZXYuaXRlbS50ZXh0IDogdW5kZWZpbmVkKSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImFjdGl2YXRlXCJdID0gZnVuY3Rpb24gKGl0ZW0pXG4gICAge1xuICAgICAgICB2YXIgXzIxOV8yMF8sIF8yMTlfMjRfLCBfMjIxXzM5XywgXzIyNF81Ml9cblxuICAgICAgICBpZiAoKChpdGVtLml0ZW0gIT0gbnVsbCA/IGl0ZW0uaXRlbS5jYiA6IHVuZGVmaW5lZCkgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2Uoe2FsbDp0cnVlfSlcbiAgICAgICAgICAgIHJldHVybiBpdGVtLml0ZW0uY2IoKChfMjIxXzM5Xz1pdGVtLml0ZW0uYXJnKSAhPSBudWxsID8gXzIyMV8zOV8gOiBpdGVtLml0ZW0udGV4dCkpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWl0ZW0uaXRlbS5tZW51KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKHthbGw6dHJ1ZX0pXG4gICAgICAgICAgICByZXR1cm4gcG9zdC5lbWl0KCdtZW51QWN0aW9uJywoKF8yMjRfNTJfPWl0ZW0uaXRlbS5hY3Rpb24pICE9IG51bGwgPyBfMjI0XzUyXyA6IGl0ZW0uaXRlbS50ZXh0KSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcInRvZ2dsZVwiXSA9IGZ1bmN0aW9uIChpdGVtKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuY2xvc2Uoe2ZvY3VzOmZhbHNlfSlcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KGl0ZW0se3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJvbkhvdmVyXCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGl0ZW1cblxuICAgICAgICBpdGVtID0gZWxlbS51cEVsZW0oZXZlbnQudGFyZ2V0LHtwcm9wOidpdGVtJ30pXG4gICAgICAgIGlmIChpdGVtKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QoaXRlbSx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm9uQ2xpY2tcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgaXRlbVxuXG4gICAgICAgIHN0b3BFdmVudChldmVudClcbiAgICAgICAgaXRlbSA9IGVsZW0udXBFbGVtKGV2ZW50LnRhcmdldCx7cHJvcDonaXRlbSd9KVxuICAgICAgICBpZiAoaXRlbSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaXRlbS5tZW51KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZShpdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKGl0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJvbkNvbnRleHRNZW51XCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudClcbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJmb2N1c1wiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzI2NV8yMF9cblxuICAgICAgICByZXR1cm4gKHRoaXMuaXRlbXMgIT0gbnVsbCA/IHRoaXMuaXRlbXMuZm9jdXMoKSA6IHVuZGVmaW5lZClcbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJvbkZvY3VzT3V0XCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIF8yNjlfMzRfXG5cbiAgICAgICAgaWYgKCEoZXZlbnQucmVsYXRlZFRhcmdldCAhPSBudWxsID8gZXZlbnQucmVsYXRlZFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwJykgOiB1bmRlZmluZWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSh7YWxsOnRydWUsZm9jdXM6ZmFsc2V9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wib25LZXlEb3duXCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGNvbWJvLCBrZXksIG1vZFxuXG4gICAgICAgIG1vZCA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpLm1vZFxuICAgICAgICBrZXkgPSBrZXlpbmZvLmZvckV2ZW50KGV2ZW50KS5rZXlcbiAgICAgICAgY29tYm8gPSBrZXlpbmZvLmZvckV2ZW50KGV2ZW50KS5jb21ib1xuXG4gICAgICAgIHN3aXRjaCAoY29tYm8pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICBjYXNlICdwYWdlIGRvd24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5zZWxlY3QodGhpcy5pdGVtcy5sYXN0Q2hpbGQse3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pKVxuXG4gICAgICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2UgdXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5zZWxlY3QodGhpcy5pdGVtcy5maXJzdENoaWxkLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KSlcblxuICAgICAgICAgICAgY2FzZSAnZXNjJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuY2xvc2UoKSlcblxuICAgICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLnNlbGVjdCh0aGlzLm5leHRJdGVtKCkse3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pKVxuXG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLnNlbGVjdCh0aGlzLnByZXZJdGVtKCkse3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pKVxuXG4gICAgICAgICAgICBjYXNlICdlbnRlcic6XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLmFjdGl2YXRlT3JOYXZpZ2F0ZVJpZ2h0KCkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5uYXZpZ2F0ZUxlZnQoKSlcblxuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5uYXZpZ2F0ZVJpZ2h0KCkpXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFBvcHVwXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IHttZW51OmZ1bmN0aW9uIChvcHQpXG57XG4gICAgcmV0dXJuIG5ldyBQb3B1cChvcHQpXG59fTsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rXyA9IHtsaXN0OiBmdW5jdGlvbiAobCkge3JldHVybiBsICE9IG51bGwgPyB0eXBlb2YgbC5sZW5ndGggPT09ICdudW1iZXInID8gbCA6IFtdIDogW119LCBlbXB0eTogZnVuY3Rpb24gKGwpIHtyZXR1cm4gbD09PScnIHx8IGw9PT1udWxsIHx8IGw9PT11bmRlZmluZWQgfHwgbCE9PWwgfHwgdHlwZW9mKGwpID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhsKS5sZW5ndGggPT09IDB9fVxuXG52YXIgZWxlbSwgUG9wdXAsIHN0b3BFdmVudFxuXG5pbXBvcnQgb3MgZnJvbSAnLi9vcy5qcydcbmltcG9ydCBkb20gZnJvbSAnLi9kb20uanMnXG5pbXBvcnQgcG9zdCBmcm9tICcuL3Bvc3QuanMnXG5pbXBvcnQgc2xhc2ggZnJvbSAnLi9zbGFzaC5qcydcbmltcG9ydCBrZXlpbmZvIGZyb20gJy4va2V5aW5mby5qcydcbmltcG9ydCBwb3B1cCBmcm9tICcuL3BvcHVwLmpzJ1xuZWxlbSA9IGRvbS5lbGVtXG5zdG9wRXZlbnQgPSBkb20uc3RvcEV2ZW50XG5cblxuUG9wdXAgPSAoZnVuY3Rpb24gKClcbntcbiAgICBmdW5jdGlvbiBQb3B1cCAob3B0KVxuICAgIHtcbiAgICAgICAgdmFyIGJyLCBjaGlsZCwgZGl2LCBpdGVtLCB0ZXh0LCBfNDdfMzBfLCBfNDhfNjRfLCBfNDhfOTJfXG5cbiAgICAgICAgdGhpc1tcIm9uS2V5RG93blwiXSA9IHRoaXNbXCJvbktleURvd25cIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25Gb2N1c091dFwiXSA9IHRoaXNbXCJvbkZvY3VzT3V0XCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uQ29udGV4dE1lbnVcIl0gPSB0aGlzW1wib25Db250ZXh0TWVudVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbkNsaWNrXCJdID0gdGhpc1tcIm9uQ2xpY2tcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25Ib3ZlclwiXSA9IHRoaXNbXCJvbkhvdmVyXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcImFjdGl2YXRlXCJdID0gdGhpc1tcImFjdGl2YXRlXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcImNsb3NlXCJdID0gdGhpc1tcImNsb3NlXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5mb2N1c0VsZW0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgIHRoaXMuaXRlbXMgPSBlbGVtKHtjbGFzczoncG9wdXAnLHRhYmluZGV4OjB9KVxuICAgICAgICB0aGlzLnBhcmVudCA9IG9wdC5wYXJlbnRcbiAgICAgICAgdGhpcy5vbkNsb3NlID0gb3B0Lm9uQ2xvc2VcbiAgICAgICAgaWYgKG9wdC5jbGFzcylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5jbGFzc0xpc3QuYWRkKG9wdC5jbGFzcylcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlzdCA9IF9rXy5saXN0KG9wdC5pdGVtcylcbiAgICAgICAgZm9yICh2YXIgXzI5XzE3XyA9IDA7IF8yOV8xN18gPCBsaXN0Lmxlbmd0aDsgXzI5XzE3XysrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpdGVtID0gbGlzdFtfMjlfMTdfXVxuICAgICAgICAgICAgaWYgKGl0ZW0uaGlkZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9rXy5lbXB0eSgoaXRlbS50ZXh0KSkgJiYgX2tfLmVtcHR5KChpdGVtLmh0bWwpKSAmJiBfa18uZW1wdHkoKGl0ZW0uY2hpbGQpKSAmJiBfa18uZW1wdHkoKGl0ZW0uY2hpbGRyZW4pKSAmJiBfa18uZW1wdHkoKGl0ZW0uaW1nKSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGl2ID0gZWxlbSgnaHInLHtjbGFzczoncG9wdXBJdGVtIHNlcGFyYXRvcid9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpdiA9IGVsZW0oe2NsYXNzOidwb3B1cEl0ZW0nLHRleHQ6aXRlbS50ZXh0fSlcbiAgICAgICAgICAgICAgICBpZiAoIV9rXy5lbXB0eShpdGVtLmh0bWwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGl0ZW0uaHRtbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pbWcpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtKCdpbWcnLHtjbGFzczoncG9wdXBJbWFnZScsc3JjOnNsYXNoLmZpbGVVcmwoaXRlbS5pbWcpfSkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2hpbGQpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpdGVtLmNoaWxkKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdDEgPSBfa18ubGlzdChpdGVtLmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgXzQzXzM0XyA9IDA7IF80M18zNF8gPCBsaXN0MS5sZW5ndGg7IF80M18zNF8rKylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGxpc3QxW180M18zNF9dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRpdi5pdGVtID0gaXRlbVxuICAgICAgICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsdGhpcy5vbkNsaWNrKVxuICAgICAgICAgICAgICAgIGlmICgoKF80N18zMF89aXRlbS5jb21ibykgIT0gbnVsbCA/IF80N18zMF8gOiBpdGVtLmFjY2VsKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBrZXlpbmZvLnNob3J0KChvcy5pc01hYyA/ICgoKF80OF82NF89aXRlbS5jb21ibykgIT0gbnVsbCA/IF80OF82NF8gOiBpdGVtLmFjY2VsKSkgOiAoKChfNDhfOTJfPWl0ZW0uYWNjZWwpICE9IG51bGwgPyBfNDhfOTJfIDogaXRlbS5jb21ibykpKSlcbiAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW0oJ3NwYW4nLHtjbGFzczoncG9wdXBDb21ibycsdGV4dDp0ZXh0fSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0ZW0ubWVudSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtKCdzcGFuJyx7Y2xhc3M6J3BvcHVwQ29tYm8nLHRleHQ6J+KWtid9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLml0ZW1zLmFwcGVuZENoaWxkKGRpdilcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaXRlbXMpXG4gICAgICAgIHRoaXMuaXRlbXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLHRoaXMub25Db250ZXh0TWVudSlcbiAgICAgICAgdGhpcy5pdGVtcy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLm9uS2V5RG93bilcbiAgICAgICAgdGhpcy5pdGVtcy5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsdGhpcy5vbkZvY3VzT3V0KVxuICAgICAgICB0aGlzLml0ZW1zLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsdGhpcy5vbkhvdmVyKVxuICAgICAgICBiciA9IHRoaXMuaXRlbXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgaWYgKG9wdC54ICsgYnIud2lkdGggPiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnN0eWxlLmxlZnQgPSBgJHtkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gYnIud2lkdGh9cHhgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnN0eWxlLmxlZnQgPSBgJHtvcHQueH1weGBcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LnkgKyBici5oZWlnaHQgPiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zdHlsZS50b3AgPSBgJHtkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIGJyLmhlaWdodH1weGBcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3R5bGUudG9wID0gYCR7b3B0Lnl9cHhgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdC5zZWxlY3RGaXJzdEl0ZW0gIT09IGZhbHNlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLml0ZW1zLmZpcnN0Q2hpbGQse3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJjbG9zZVwiXSA9IGZ1bmN0aW9uIChvcHQgPSB7fSlcbiAgICB7XG4gICAgICAgIHZhciBfMTAyXzIyXywgXzEwNl8yMl8sIF84NV80Ml8sIF84NV80OF8sIF84Nl8zM18sIF85MF8xNF8sIF85M18xNF8sIF85NF8xNF8sIF85NV8xNF8sIF85Nl8xNF8sIF85OV8xNV9cblxuICAgICAgICBpZiAoX2tfLmVtcHR5KCh0aGlzLnBhcmVudCkpIHx8ICgoXzg1XzQyXz10aGlzLnBhcmVudE1lbnUoKSkgIT0gbnVsbCA/IChfODVfNDhfPV84NV80Ml8uZWxlbSkgIT0gbnVsbCA/IF84NV80OF8uY2xhc3NMaXN0LmNvbnRhaW5zKCdtZW51JykgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoJ3NraXAnID09PSAodHlwZW9mIHRoaXMub25DbG9zZSA9PT0gXCJmdW5jdGlvblwiID8gdGhpcy5vbkNsb3NlKCkgOiB1bmRlZmluZWQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDsodGhpcy5wb3B1cCAhPSBudWxsID8gdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KSA6IHVuZGVmaW5lZClcbiAgICAgICAgZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgOyh0aGlzLml0ZW1zICE9IG51bGwgPyB0aGlzLml0ZW1zLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMub25LZXlEb3duKSA6IHVuZGVmaW5lZClcbiAgICAgICAgOyh0aGlzLml0ZW1zICE9IG51bGwgPyB0aGlzLml0ZW1zLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jyx0aGlzLm9uRm9jdXNPdXQpIDogdW5kZWZpbmVkKVxuICAgICAgICA7KHRoaXMuaXRlbXMgIT0gbnVsbCA/IHRoaXMuaXRlbXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJyx0aGlzLm9uSG92ZXIpIDogdW5kZWZpbmVkKVxuICAgICAgICA7KHRoaXMuaXRlbXMgIT0gbnVsbCA/IHRoaXMuaXRlbXMucmVtb3ZlKCkgOiB1bmRlZmluZWQpXG4gICAgICAgIGRlbGV0ZSB0aGlzLml0ZW1zXG4gICAgICAgIDsodGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LmNoaWxkQ2xvc2VkKHRoaXMsb3B0KSA6IHVuZGVmaW5lZClcbiAgICAgICAgaWYgKG9wdC5hbGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuY2xvc2Uob3B0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHQuZm9jdXMgIT09IGZhbHNlICYmICF0aGlzLnBhcmVudClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmZvY3VzRWxlbSAhPSBudWxsID8gdGhpcy5mb2N1c0VsZW0uZm9jdXMoKSA6IHVuZGVmaW5lZClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImNoaWxkQ2xvc2VkXCJdID0gZnVuY3Rpb24gKGNoaWxkLCBvcHQpXG4gICAge1xuICAgICAgICBpZiAoY2hpbGQgPT09IHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgICAgICBpZiAob3B0LmZvY3VzICE9PSBmYWxzZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mb2N1cygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJzZWxlY3RcIl0gPSBmdW5jdGlvbiAoaXRlbSwgb3B0ID0ge30pXG4gICAge1xuICAgICAgICB2YXIgXzEyNV8xN18sIF8xMjhfMTdfLCBfMTMyXzIwX1xuXG4gICAgICAgIGlmICghKGl0ZW0gIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICgodGhpcy5wb3B1cCAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KVxuICAgICAgICB9XG4gICAgICAgIDsodGhpcy5zZWxlY3RlZCAhPSBudWxsID8gdGhpcy5zZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpIDogdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gaXRlbVxuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgICAgaWYgKChpdGVtLml0ZW0gIT0gbnVsbCA/IGl0ZW0uaXRlbS5tZW51IDogdW5kZWZpbmVkKSAmJiBvcHQub3BlbiAhPT0gZmFsc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgICAgICB0aGlzLnBvcHVwQ2hpbGQoaXRlbSxvcHQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9jdXMoKVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcInBvcHVwQ2hpbGRcIl0gPSBmdW5jdGlvbiAoaXRlbSwgb3B0ID0ge30pXG4gICAge1xuICAgICAgICB2YXIgYnIsIGl0ZW1zXG5cbiAgICAgICAgaWYgKGl0ZW1zID0gaXRlbS5pdGVtLm1lbnUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBvcHVwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlUG9wdXAoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvcHVwID0gbmV3IFBvcHVwKHtpdGVtczppdGVtcyxwYXJlbnQ6dGhpcyx4OmJyLmxlZnQgKyBici53aWR0aCx5OmJyLnRvcCxzZWxlY3RGaXJzdEl0ZW06KG9wdCAhPSBudWxsID8gb3B0LnNlbGVjdEZpcnN0SXRlbSA6IHVuZGVmaW5lZCl9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiY2xvc2VQb3B1cFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE1NV8xNF9cblxuICAgICAgICA7KHRoaXMucG9wdXAgIT0gbnVsbCA/IHRoaXMucG9wdXAuY2xvc2Uoe2ZvY3VzOmZhbHNlfSkgOiB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5wb3B1cFxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm5hdmlnYXRlTGVmdFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgbVxuXG4gICAgICAgIGlmICh0aGlzLnBvcHVwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZVBvcHVwKClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtID0gdGhpcy5wYXJlbnRNZW51KCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBtLm5hdmlnYXRlTGVmdCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKHtmb2N1czpmYWxzZX0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJhY3RpdmF0ZU9yTmF2aWdhdGVSaWdodFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE3NV8yMF9cblxuICAgICAgICBpZiAoKHRoaXMuc2VsZWN0ZWQgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZC5pdGVtLm1lbnUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUodGhpcy5zZWxlY3RlZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uYXZpZ2F0ZVJpZ2h0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm5hdmlnYXRlUmlnaHRcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8xODRfMjVfLCBfMTg3XzI1X1xuXG4gICAgICAgIGlmICh0aGlzLnBvcHVwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3B1cC5zZWxlY3QodGhpcy5wb3B1cC5pdGVtcy5maXJzdENoaWxkKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCh0aGlzLnNlbGVjdGVkICE9IG51bGwgPyB0aGlzLnNlbGVjdGVkLml0ZW0ubWVudSA6IHVuZGVmaW5lZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLnNlbGVjdGVkLHtzZWxlY3RGaXJzdEl0ZW06dHJ1ZX0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMucGFyZW50TWVudSgpICE9IG51bGwgPyB0aGlzLnBhcmVudE1lbnUoKS5uYXZpZ2F0ZVJpZ2h0KCkgOiB1bmRlZmluZWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJwYXJlbnRNZW51XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMTkwXzE4X1xuXG4gICAgICAgIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYgIXRoaXMucGFyZW50LnBhcmVudClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJuZXh0SXRlbVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgbmV4dCwgXzIwMl8zOF9cblxuICAgICAgICBpZiAobmV4dCA9IHRoaXMuc2VsZWN0ZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0ID0gbmV4dC5uZXh0U2libGluZylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9rXy5lbXB0eSgobmV4dC5pdGVtICE9IG51bGwgPyBuZXh0Lml0ZW0udGV4dCA6IHVuZGVmaW5lZCkpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJwcmV2SXRlbVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgcHJldiwgXzIwOF8zOF9cblxuICAgICAgICBpZiAocHJldiA9IHRoaXMuc2VsZWN0ZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHdoaWxlIChwcmV2ID0gcHJldi5wcmV2aW91c1NpYmxpbmcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCFfa18uZW1wdHkoKHByZXYuaXRlbSAhPSBudWxsID8gcHJldi5pdGVtLnRleHQgOiB1bmRlZmluZWQpKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wiYWN0aXZhdGVcIl0gPSBmdW5jdGlvbiAoaXRlbSlcbiAgICB7XG4gICAgICAgIHZhciBfMjE5XzIwXywgXzIxOV8yNF8sIF8yMjFfMzlfLCBfMjI0XzUyX1xuXG4gICAgICAgIGlmICgoKGl0ZW0uaXRlbSAhPSBudWxsID8gaXRlbS5pdGVtLmNiIDogdW5kZWZpbmVkKSAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSh7YWxsOnRydWV9KVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXRlbS5jYigoKF8yMjFfMzlfPWl0ZW0uaXRlbS5hcmcpICE9IG51bGwgPyBfMjIxXzM5XyA6IGl0ZW0uaXRlbS50ZXh0KSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghaXRlbS5pdGVtLm1lbnUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2Uoe2FsbDp0cnVlfSlcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCgoXzIyNF81Ml89aXRlbS5pdGVtLmFjdGlvbikgIT0gbnVsbCA/IF8yMjRfNTJfIDogaXRlbS5pdGVtLnRleHQpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1widG9nZ2xlXCJdID0gZnVuY3Rpb24gKGl0ZW0pXG4gICAge1xuICAgICAgICBpZiAodGhpcy5wb3B1cClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KVxuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QoaXRlbSx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm9uSG92ZXJcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgaXRlbVxuXG4gICAgICAgIGl0ZW0gPSBlbGVtLnVwRWxlbShldmVudC50YXJnZXQse3Byb3A6J2l0ZW0nfSlcbiAgICAgICAgaWYgKGl0ZW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdChpdGVtLHtzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUG9wdXAucHJvdG90eXBlW1wib25DbGlja1wiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBpdGVtXG5cbiAgICAgICAgc3RvcEV2ZW50KGV2ZW50KVxuICAgICAgICBpdGVtID0gZWxlbS51cEVsZW0oZXZlbnQudGFyZ2V0LHtwcm9wOidpdGVtJ30pXG4gICAgICAgIGlmIChpdGVtKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoaXRlbS5pdGVtLm1lbnUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlKGl0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm9uQ29udGV4dE1lbnVcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50KVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcImZvY3VzXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMjY1XzIwX1xuXG4gICAgICAgIHJldHVybiAodGhpcy5pdGVtcyAhPSBudWxsID8gdGhpcy5pdGVtcy5mb2N1cygpIDogdW5kZWZpbmVkKVxuICAgIH1cblxuICAgIFBvcHVwLnByb3RvdHlwZVtcIm9uRm9jdXNPdXRcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgXzI2OV8zNF9cblxuICAgICAgICBpZiAoIShldmVudC5yZWxhdGVkVGFyZ2V0ICE9IG51bGwgPyBldmVudC5yZWxhdGVkVGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncG9wdXAnKSA6IHVuZGVmaW5lZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKHthbGw6dHJ1ZSxmb2N1czpmYWxzZX0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQb3B1cC5wcm90b3R5cGVbXCJvbktleURvd25cIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgY29tYm8sIGtleSwgbW9kXG5cbiAgICAgICAgbW9kID0ga2V5aW5mby5mb3JFdmVudChldmVudCkubW9kXG4gICAgICAgIGtleSA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpLmtleVxuICAgICAgICBjb21ibyA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpLmNvbWJvXG5cbiAgICAgICAgc3dpdGNoIChjb21ibylcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2UgZG93bic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLnNlbGVjdCh0aGlzLml0ZW1zLmxhc3RDaGlsZCx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgICAgY2FzZSAncGFnZSB1cCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLnNlbGVjdCh0aGlzLml0ZW1zLmZpcnN0Q2hpbGQse3NlbGVjdEZpcnN0SXRlbTpmYWxzZX0pKVxuXG4gICAgICAgICAgICBjYXNlICdlc2MnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5jbG9zZSgpKVxuXG4gICAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuc2VsZWN0KHRoaXMubmV4dEl0ZW0oKSx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSkpXG5cbiAgICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuc2VsZWN0KHRoaXMucHJldkl0ZW0oKSx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2VudGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuYWN0aXZhdGVPck5hdmlnYXRlUmlnaHQoKSlcblxuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLm5hdmlnYXRlTGVmdCgpKVxuXG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLm5hdmlnYXRlUmlnaHQoKSlcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUG9wdXBcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQge21lbnU6ZnVuY3Rpb24gKG9wdClcbntcbiAgICByZXR1cm4gbmV3IFBvcHVwKG9wdClcbn19OyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2xpc3Q6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGwgIT0gbnVsbCA/IHR5cGVvZiBsLmxlbmd0aCA9PT0gJ251bWJlcicgPyBsIDogW10gOiBbXX19XG5cbnZhciBlbGVtLCBNZW51LCBzdG9wRXZlbnRcblxuaW1wb3J0IGRvbSBmcm9tICcuL2RvbS5qcydcbmltcG9ydCBrZXlpbmZvIGZyb20gJy4va2V5aW5mby5qcydcbmltcG9ydCBwb3B1cCBmcm9tICcuL3BvcHVwLmpzJ1xuZWxlbSA9IGRvbS5lbGVtXG5zdG9wRXZlbnQgPSBkb20uc3RvcEV2ZW50XG5cblxuTWVudSA9IChmdW5jdGlvbiAoKVxue1xuICAgIGZ1bmN0aW9uIE1lbnUgKG9wdClcbiAgICB7XG4gICAgICAgIHZhciBjb21ibywgZGl2LCBpdGVtLCBfMjZfMjVfXG5cbiAgICAgICAgdGhpc1tcIm9uQ2xpY2tcIl0gPSB0aGlzW1wib25DbGlja1wiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbktleURvd25cIl0gPSB0aGlzW1wib25LZXlEb3duXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcImNsb3NlXCJdID0gdGhpc1tcImNsb3NlXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uRm9jdXNPdXRcIl0gPSB0aGlzW1wib25Gb2N1c091dFwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbkhvdmVyXCJdID0gdGhpc1tcIm9uSG92ZXJcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wiYmx1clwiXSA9IHRoaXNbXCJibHVyXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcImZvY3VzXCJdID0gdGhpc1tcImZvY3VzXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5lbGVtID0gZWxlbSh7Y2xhc3M6J21lbnUnLHRhYmluZGV4OjB9KVxuICAgICAgICB2YXIgbGlzdCA9IF9rXy5saXN0KG9wdC5pdGVtcylcbiAgICAgICAgZm9yICh2YXIgXzIxXzE3XyA9IDA7IF8yMV8xN18gPCBsaXN0Lmxlbmd0aDsgXzIxXzE3XysrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpdGVtID0gbGlzdFtfMjFfMTdfXVxuICAgICAgICAgICAgaWYgKGl0ZW0uaGlkZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2ID0gZWxlbSh7Y2xhc3M6J21lbnVJdGVtJyx0ZXh0Oml0ZW0udGV4dH0pXG4gICAgICAgICAgICBkaXYuaXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsdGhpcy5vbkNsaWNrKVxuICAgICAgICAgICAgaWYgKChpdGVtLmNvbWJvICE9IG51bGwpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbWJvID0gZWxlbSgnc3Bhbicse2NsYXNzOidwb3B1cENvbWJvJyx0ZXh0OmtleWluZm8uc2hvcnQoaXRlbS5jb21ibyl9KVxuICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChjb21ibylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChkaXYpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5lbGVtLmZpcnN0Q2hpbGQpXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLm9uS2V5RG93bilcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jyx0aGlzLm9uRm9jdXNPdXQpXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLHRoaXMub25Ib3ZlcilcbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcImRlbFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzQwXzEzX1xuXG4gICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICA7KHRoaXMuZWxlbSAhPSBudWxsID8gdGhpcy5lbGVtLnJlbW92ZSgpIDogdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtID0gbnVsbFxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wiZm9jdXNcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5mb2N1c0VsZW0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW0uZm9jdXMoKVxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wiYmx1clwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzU0XzMzXywgXzU0XzQwX1xuXG4gICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICByZXR1cm4gKChfNTRfMzNfPXRoaXMuZm9jdXNFbGVtKSAhPSBudWxsID8gdHlwZW9mIChfNTRfNDBfPV81NF8zM18uZm9jdXMpID09PSBcImZ1bmN0aW9uXCIgPyBfNTRfNDBfKCkgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgTWVudS5wcm90b3R5cGVbXCJvbkhvdmVyXCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KGV2ZW50LnRhcmdldCx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSlcbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcIm9uRm9jdXNPdXRcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgXzYwXzQ1X1xuXG4gICAgICAgIGlmICh0aGlzLnBvcHVwICYmICEoZXZlbnQucmVsYXRlZFRhcmdldCAhPSBudWxsID8gZXZlbnQucmVsYXRlZFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwJykgOiB1bmRlZmluZWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pXG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wib3BlblwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5lbGVtLmZpcnN0Q2hpbGQse2FjdGl2YXRlOnRydWV9KVxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wiY2xvc2VcIl0gPSBmdW5jdGlvbiAob3B0ID0ge30pXG4gICAge1xuICAgICAgICB2YXIgXzgwXzE3X1xuXG4gICAgICAgIGlmICgodGhpcy5wb3B1cCAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KVxuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9wdXBcbiAgICAgICAgICAgIGlmIChvcHQuZm9jdXMgIT09IGZhbHNlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5mb2N1cygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAob3B0LmZvY3VzICE9PSBmYWxzZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb2N1c0VsZW0gJiYgdHlwZW9mKHRoaXMuZm9jdXNFbGVtLmZvY3VzKSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNFbGVtLmZvY3VzKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcImNoaWxkQ2xvc2VkXCJdID0gZnVuY3Rpb24gKGNoaWxkLCBvcHQpXG4gICAge1xuICAgICAgICBpZiAoY2hpbGQgPT09IHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgICAgICBpZiAob3B0LmZvY3VzICE9PSBmYWxzZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW0uZm9jdXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgTWVudS5wcm90b3R5cGVbXCJzZWxlY3RcIl0gPSBmdW5jdGlvbiAoaXRlbSwgb3B0ID0ge30pXG4gICAge1xuICAgICAgICB2YXIgaGFkUG9wdXAsIF8xMDlfMTdfLCBfMTEzXzE3X1xuXG4gICAgICAgIGlmICghKGl0ZW0gIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICgodGhpcy5wb3B1cCAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaGFkUG9wdXAgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLnBvcHVwLmNsb3NlKHtmb2N1czpmYWxzZX0pXG4gICAgICAgIH1cbiAgICAgICAgOyh0aGlzLnNlbGVjdGVkICE9IG51bGwgPyB0aGlzLnNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykgOiB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBpdGVtXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICBpZiAoaGFkUG9wdXAgfHwgb3B0LmFjdGl2YXRlKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoaXRlbSxvcHQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcImFjdGl2YXRlXCJdID0gZnVuY3Rpb24gKGl0ZW0sIG9wdCA9IHt9KVxuICAgIHtcbiAgICAgICAgdmFyIGJyLCBpdGVtcywgcHJcblxuICAgICAgICBpdGVtcyA9IGl0ZW0uaXRlbS5tZW51XG4gICAgICAgIGlmIChpdGVtcylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1cC5jbG9zZSh7Zm9jdXM6ZmFsc2V9KVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcHVwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiciA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgIHByID0gaXRlbS5wYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICBvcHQuaXRlbXMgPSBpdGVtc1xuICAgICAgICAgICAgb3B0LnBhcmVudCA9IHRoaXNcbiAgICAgICAgICAgIG9wdC54ID0gYnIubGVmdFxuICAgICAgICAgICAgb3B0LnkgPSBwci50b3AgKyBwci5oZWlnaHRcbiAgICAgICAgICAgIG9wdC5jbGFzcyA9ICd0aXRsZW1lbnUnXG4gICAgICAgICAgICB0aGlzLnBvcHVwID0gcG9wdXAubWVudShvcHQpXG4gICAgICAgICAgICBpZiAob3B0LnNlbGVjdEZpcnN0SXRlbSA9PT0gZmFsc2UpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5mb2N1cygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcInRvZ2dsZVwiXSA9IGZ1bmN0aW9uIChpdGVtKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMucG9wdXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuY2xvc2Uoe2ZvY3VzOmZhbHNlfSlcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5wb3B1cFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGUoaXRlbSx7c2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wiaXRlbVNlbGVjdGVkXCJdID0gZnVuY3Rpb24gKGl0ZW0sIGVsZW0pXG4gICAge31cblxuICAgIE1lbnUucHJvdG90eXBlW1wiZGVhY3RpdmF0ZVwiXSA9IGZ1bmN0aW9uIChpdGVtKVxuICAgIHt9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcIm5hdmlnYXRlTGVmdFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE2MF8zOV9cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QoKHRoaXMuc2VsZWN0ZWQgIT0gbnVsbCA/IHRoaXMuc2VsZWN0ZWQucHJldmlvdXNTaWJsaW5nIDogdW5kZWZpbmVkKSx7YWN0aXZhdGU6dHJ1ZSxzZWxlY3RGaXJzdEl0ZW06ZmFsc2V9KVxuICAgIH1cblxuICAgIE1lbnUucHJvdG90eXBlW1wibmF2aWdhdGVSaWdodFwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzE2MV8zOV9cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QoKHRoaXMuc2VsZWN0ZWQgIT0gbnVsbCA/IHRoaXMuc2VsZWN0ZWQubmV4dFNpYmxpbmcgOiB1bmRlZmluZWQpLHthY3RpdmF0ZTp0cnVlLHNlbGVjdEZpcnN0SXRlbTpmYWxzZX0pXG4gICAgfVxuXG4gICAgTWVudS5wcm90b3R5cGVbXCJvbktleURvd25cIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgY29tYm8sIGtleSwgbW9kXG5cbiAgICAgICAgbW9kID0ga2V5aW5mby5mb3JFdmVudChldmVudCkubW9kXG4gICAgICAgIGtleSA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpLmtleVxuICAgICAgICBjb21ibyA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpLmNvbWJvXG5cbiAgICAgICAgc3dpdGNoIChjb21ibylcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2UgZG93bic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldmVudCx0aGlzLnNlbGVjdCh0aGlzLmVsZW0ubGFzdENoaWxkLHthY3RpdmF0ZTp0cnVlLHNlbGVjdEZpcnN0SXRlbTpmYWxzZX0pKVxuXG4gICAgICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2UgdXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5zZWxlY3QodGhpcy5lbGVtLmZpcnN0Q2hpbGQse2FjdGl2YXRlOnRydWUsc2VsZWN0Rmlyc3RJdGVtOmZhbHNlfSkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2VudGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5hY3RpdmF0ZSh0aGlzLnNlbGVjdGVkKSlcblxuICAgICAgICAgICAgY2FzZSAnZXNjJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2ZW50LHRoaXMuY2xvc2UoKSlcblxuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5uYXZpZ2F0ZVJpZ2h0KCkpXG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXZlbnQsdGhpcy5uYXZpZ2F0ZUxlZnQoKSlcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBNZW51LnByb3RvdHlwZVtcIm9uQ2xpY2tcIl0gPSBmdW5jdGlvbiAoZSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZShlLnRhcmdldClcbiAgICB9XG5cbiAgICByZXR1cm4gTWVudVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBNZW51OyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2xpc3Q6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGwgIT0gbnVsbCA/IHR5cGVvZiBsLmxlbmd0aCA9PT0gJ251bWJlcicgPyBsIDogW10gOiBbXX0sIGxhc3Q6IGZ1bmN0aW9uIChvKSB7cmV0dXJuIG8gIT0gbnVsbCA/IG8ubGVuZ3RoID8gb1tvLmxlbmd0aC0xXSA6IHVuZGVmaW5lZCA6IG99LCBpbjogZnVuY3Rpb24gKGEsbCkge3JldHVybiAodHlwZW9mIGwgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBhID09PSAnc3RyaW5nJyAmJiBhLmxlbmd0aCA/ICcnIDogW10pLmluZGV4T2YuY2FsbChsLGEpID49IDB9LCBpc0Z1bmM6IGZ1bmN0aW9uIChvKSB7cmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nfSwgZW1wdHk6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGw9PT0nJyB8fCBsPT09bnVsbCB8fCBsPT09dW5kZWZpbmVkIHx8IGwhPT1sIHx8IHR5cGVvZihsKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMobCkubGVuZ3RoID09PSAwfX1cblxudmFyIGRlZmF1bHRzLCBsb2FkLCBwYWQsIHBhcnNlLCBwYXJzZVN0ciwgcmVncywgc2F2ZSwgc3RyaW5naWZ5XG5cbmltcG9ydCBzbGFzaCBmcm9tICcuL3NsYXNoLmpzJ1xuaW1wb3J0IHBhdGggZnJvbSAnLi9wYXRoLmpzJ1xuXG5wYXJzZSA9IGZ1bmN0aW9uIChzKVxue1xuICAgIHZhciBhZGRMaW5lLCBkLCBkZCwgZGssIGR2LCBlLCBFTVBUWSwgRkxPQVQsIGksIGluZGVudCwgaW5zZXJ0LCBpbnNwZWN0LCBJTlQsIGlzQXJyYXksIGssIGtleSwgbCwgbGFzdCwgbGVhZGluZ1NwYWNlcywgbGluZSwgbGluZUZhaWwsIGxpbmVzLCBtYWtlT2JqZWN0LCBORVdMSU5FLCBvaSwgcCwgciwgc3RhY2ssIHVkLCB1bmRlbnNlLCB2LCB2YWx1ZSwgdmFsdWVzLCB2bFxuXG4gICAgaWYgKCFzKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuICAgIGlmIChzID09PSAnJylcbiAgICB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgICBFTVBUWSA9IC9eXFxzKiQvXG4gICAgTkVXTElORSA9IC9cXHI/XFxuL1xuICAgIEZMT0FUID0gL14oXFwtfFxcKyk/KFswLTldKyhcXC5bMC05XSspP3xJbmZpbml0eSkkL1xuICAgIElOVCA9IC9eKFxcLXxcXCspPyhbMC05XSt8SW5maW5pdHkpJC9cbiAgICBsYXN0ID0gZnVuY3Rpb24gKGEpXG4gICAge1xuICAgICAgICByZXR1cm4gKGEgIT0gbnVsbCA/IGFbYS5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZClcbiAgICB9XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChhKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIChhICE9IG51bGwpICYmIHR5cGVvZihhKSA9PT0gJ29iamVjdCcgJiYgYS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXJyYXknXG4gICAgfVxuICAgIHVuZGVuc2UgPSBmdW5jdGlvbiAoZCwgcylcbiAgICB7XG4gICAgICAgIHZhciBlc2MsIGksIGtleSwgbCwgbGQsIHAsIHBwLCBzZCwgc2wsIHRcblxuICAgICAgICBzbCA9IHMubGVuZ3RoXG4gICAgICAgIHNkID0gZFxuICAgICAgICBwID0gMFxuICAgICAgICB3aGlsZSAocCA8IHNsICYmIHNbcF0gPT09ICcuJylcbiAgICAgICAge1xuICAgICAgICAgICAgZCArPSAxXG4gICAgICAgICAgICBwICs9IDFcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocCA8IHNsICYmIHNbcF0gPT09ICcgJylcbiAgICAgICAge1xuICAgICAgICAgICAgcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgbCA9ICcnXG4gICAgICAgIGtleSA9IHRydWVcbiAgICAgICAgZXNjID0gZmFsc2VcbiAgICAgICAgd2hpbGUgKHAgPCBzbClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGwgIT09ICcnICYmIHNbcF0gPT09ICcgJyAmJiBzW3AgKyAxXSA9PT0gJy4nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBwID0gcCArIDJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHAgPCBzbCAmJiBzW3BwXSA9PT0gJy4nKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc1twcF0gPT09ICcgJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHAgKz0gMVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVzYyB8PSBzW3BdID09PSAnfCdcbiAgICAgICAgICAgIGwgKz0gc1twXVxuICAgICAgICAgICAgaWYgKCFlc2MgJiYga2V5ICYmIHNbcF0gPT09ICcgJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAocCA8IHNsICsgMSAmJiBzW3AgKyAxXSAhPT0gJyAnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbCArPSAnICdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5ID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAgKz0gMVxuICAgICAgICAgICAgZXNjIF49IHNbcF0gPT09ICd8J1xuICAgICAgICB9XG4gICAgICAgIGxkID0gJydcbiAgICAgICAgZm9yICh2YXIgXzcyXzE4XyA9IGkgPSAwLCBfNzJfMjJfID0gZDsgKF83Ml8xOF8gPD0gXzcyXzIyXyA/IGkgPCBkIDogaSA+IGQpOyAoXzcyXzE4XyA8PSBfNzJfMjJfID8gKytpIDogLS1pKSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGQgKz0gJyAnXG4gICAgICAgIH1cbiAgICAgICAgbGQgKz0gbFxuICAgICAgICBpZiAocCA8IHNsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0ID0gdW5kZW5zZShzZCxzLnN1YnN0cmluZyhwKSlcbiAgICAgICAgICAgIHQudW5zaGlmdChsZClcbiAgICAgICAgICAgIHJldHVybiB0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gW2xkXVxuICAgICAgICB9XG4gICAgfVxuICAgIGxlYWRpbmdTcGFjZXMgPSAwXG4gICAgbGluZXMgPSBzLnNwbGl0KE5FV0xJTkUpLmZpbHRlcihmdW5jdGlvbiAobClcbiAgICB7XG4gICAgICAgIHJldHVybiAhRU1QVFkudGVzdChsKVxuICAgIH0pXG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5lcy5sZW5ndGggPT09IDEpXG4gICAge1xuICAgICAgICBsaW5lcyA9IFtsaW5lc1swXS50cmltKCldXG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHdoaWxlIChsaW5lc1swXVtsZWFkaW5nU3BhY2VzXSA9PT0gJyAnKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZWFkaW5nU3BhY2VzICs9IDFcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGFjayA9IFt7bzpbXSxkOmxlYWRpbmdTcGFjZXN9XVxuICAgIG1ha2VPYmplY3QgPSBmdW5jdGlvbiAodClcbiAgICB7XG4gICAgICAgIHZhciBiLCBpLCBvXG5cbiAgICAgICAgbyA9IHt9XG4gICAgICAgIHZhciBsaXN0ID0gX2tfLmxpc3QodC5vKVxuICAgICAgICBmb3IgKHZhciBfMTE0XzE0XyA9IDA7IF8xMTRfMTRfIDwgbGlzdC5sZW5ndGg7IF8xMTRfMTRfKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGkgPSBsaXN0W18xMTRfMTRfXVxuICAgICAgICAgICAgb1tpXSA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICB0LmwgPSBfa18ubGFzdCh0Lm8pXG4gICAgICAgIHQubyA9IG9cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGIgPSBzdGFja1tzdGFjay5sZW5ndGggLSAyXVxuICAgICAgICAgICAgaWYgKGlzQXJyYXkoYi5vKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiLm8ucG9wKClcbiAgICAgICAgICAgICAgICBiLm8ucHVzaChvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGIub1tiLmxdID0gb1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvXG4gICAgfVxuICAgIGtleSA9IGZ1bmN0aW9uIChrKVxuICAgIHtcbiAgICAgICAgaWYgKChrICE9IG51bGwgPyBrWzBdIDogdW5kZWZpbmVkKSA9PT0gJ3wnKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoa1trLmxlbmd0aCAtIDFdID09PSAnfCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsuc3Vic3RyKDEsay5sZW5ndGggLSAyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGsuc3Vic3RyKDEpLnRyaW1SaWdodCgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtcbiAgICB9XG4gICAgdmFsdWVzID0geydudWxsJzpudWxsLCd0cnVlJzp0cnVlLCdmYWxzZSc6ZmFsc2V9XG4gICAgdmFsdWUgPSBmdW5jdGlvbiAodilcbiAgICB7XG4gICAgICAgIGlmICh2YWx1ZXNbdl0gIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t2XVxuICAgICAgICB9XG4gICAgICAgIGlmICgodiAhPSBudWxsID8gdlswXSA6IHVuZGVmaW5lZCkgPT09ICd8JylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGtleSh2KVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCh2ICE9IG51bGwgPyB2W3YubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQpID09PSAnfCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB2LnN1YnN0cigwLHYubGVuZ3RoIC0gMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoRkxPQVQudGVzdCh2KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodilcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU5ULnRlc3QodikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2XG4gICAgfVxuICAgIGluc2VydCA9IGZ1bmN0aW9uICh0LCBrLCB2KVxuICAgIHtcbiAgICAgICAgaWYgKGlzQXJyYXkodC5vKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCEodiAhPSBudWxsKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoKF9rXy5sYXN0KHQubykgPT09ICcuJyAmJiAnLicgPT09IGspKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdC5vLnBvcCgpXG4gICAgICAgICAgICAgICAgICAgIHQuby5wdXNoKFtdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdC5vLnB1c2godmFsdWUoaykpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VPYmplY3QodClba2V5KGspXSA9IHZhbHVlKHYpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0Lm9ba2V5KGspXSA9IHZhbHVlKHYpXG4gICAgICAgICAgICByZXR1cm4gdC5sID0ga2V5KGspXG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5kZW50ID0gZnVuY3Rpb24gKHQsIGssIHYpXG4gICAge1xuICAgICAgICB2YXIgbCwgb1xuXG4gICAgICAgIG8gPSBbXVxuICAgICAgICBpZiAoKHYgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG8gPSB7fVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHQubykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChfa18ubGFzdCh0Lm8pID09PSAnLicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdC5vLnBvcCgpXG4gICAgICAgICAgICAgICAgdC5vLnB1c2gobylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsID0gX2tfLmxhc3QodC5vKVxuICAgICAgICAgICAgICAgIG1ha2VPYmplY3QodClcbiAgICAgICAgICAgICAgICB0Lm9bbF0gPSBvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0Lm9bdC5sXSA9IG9cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHYgIT0gbnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ba2V5KGspXSA9IHZhbHVlKHYpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBvLnB1c2godmFsdWUoaykpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9cbiAgICB9XG4gICAgYWRkTGluZSA9IGZ1bmN0aW9uIChkLCBrLCB2KVxuICAgIHtcbiAgICAgICAgdmFyIHQsIHVuZGVuc2VkXG5cbiAgICAgICAgaWYgKChrICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0ID0gX2tfLmxhc3Qoc3RhY2spXG4gICAgICAgICAgICB1bmRlbnNlZCA9IHQudW5kZW5zZWRcbiAgICAgICAgICAgIHQudW5kZW5zZWQgPSBmYWxzZVxuICAgICAgICAgICAgaWYgKGQgPiB0LmQgJiYgIXVuZGVuc2VkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFjay5wdXNoKHtvOmluZGVudCh0LGssdiksZDpkfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGQgPCB0LmQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkodC5vKSAmJiBfa18ubGFzdCh0Lm8pID09PSAnLicpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0Lm8ucG9wKClcbiAgICAgICAgICAgICAgICAgICAgdC5vLnB1c2goW10pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlICgodCAhPSBudWxsID8gdC5kIDogdW5kZWZpbmVkKSA+IGQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgICAgICAgICAgICB0ID0gX2tfLmxhc3Qoc3RhY2spXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnNlcnQodCxrLHYpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKHVuZGVuc2VkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdC5kID0gZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zZXJ0KHQsayx2KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGluc3BlY3QgPSBmdW5jdGlvbiAobClcbiAgICB7XG4gICAgICAgIHZhciBkLCBlc2NsLCBlc2NyLCBrLCBwLCB2XG5cbiAgICAgICAgcCA9IDBcbiAgICAgICAgd2hpbGUgKGxbcF0gPT09ICcgJylcbiAgICAgICAge1xuICAgICAgICAgICAgcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEobFtwXSAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFswLG51bGwsbnVsbCxmYWxzZV1cbiAgICAgICAgfVxuICAgICAgICBkID0gcFxuICAgICAgICBrID0gJydcbiAgICAgICAgaWYgKGxbcF0gPT09ICcjJylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFswLG51bGwsbnVsbCxmYWxzZV1cbiAgICAgICAgfVxuICAgICAgICBlc2NsID0gZmFsc2VcbiAgICAgICAgZXNjciA9IGZhbHNlXG4gICAgICAgIGlmIChsW3BdID09PSAnfCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVzY2wgPSB0cnVlXG4gICAgICAgICAgICBrICs9ICd8J1xuICAgICAgICAgICAgcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKChsW3BdICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAobFtwXSA9PT0gJyAnICYmIGxbcCArIDFdID09PSAnICcgJiYgIWVzY2wpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGsgKz0gbFtwXVxuICAgICAgICAgICAgcCArPSAxXG4gICAgICAgICAgICBpZiAoZXNjbCAmJiBsW3AgLSAxXSA9PT0gJ3wnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlc2NsKVxuICAgICAgICB7XG4gICAgICAgICAgICBrID0gay50cmltUmlnaHQoKVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChsW3BdID09PSAnICcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHYgPSAnJ1xuICAgICAgICBpZiAobFtwXSA9PT0gJ3wnKVxuICAgICAgICB7XG4gICAgICAgICAgICBlc2NyID0gdHJ1ZVxuICAgICAgICAgICAgdiArPSAnfCdcbiAgICAgICAgICAgIHAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlICgobFtwXSAhPSBudWxsKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdiArPSBsW3BdXG4gICAgICAgICAgICBwICs9IDFcbiAgICAgICAgICAgIGlmIChlc2NyICYmIGxbcCAtIDFdID09PSAnfCcgJiYgbC50cmltUmlnaHQoKS5sZW5ndGggPT09IHApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobFtwIC0gMV0gPT09ICcgJyAmJiAhZXNjcilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCh2ICE9IG51bGwpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHYgPSB2LnRyaW1SaWdodCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGsgPT09ICcnKVxuICAgICAgICB7XG4gICAgICAgICAgICBrID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGlmICh2ID09PSAnJylcbiAgICAgICAge1xuICAgICAgICAgICAgdiA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2Qsayx2LGVzY2xdXG4gICAgfVxuICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDEpXG4gICAge1xuICAgICAgICBpZiAoMCA8IGxpbmVzWzBdLmluZGV4T2YoJzo6ICcpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsaW5lcyA9IGxpbmVzWzBdLnNwbGl0KCc6OiAnKS5tYXAoZnVuY3Rpb24gKGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHBcblxuICAgICAgICAgICAgICAgIHAgPSAwXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxbcF0gPT09ICcgJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAoKGxbcF0gIT0gbnVsbCkgJiYgKGxbcF0gIT09ICcgJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxbcF0gPT09ICcgJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsLnNsaWNlKDAscCkgKyAnICcgKyBsLnNsaWNlKHApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBwID0gbGluZXNbMF0uaW5kZXhPZignIC4gJylcbiAgICAgICAgZSA9IGxpbmVzWzBdLmluZGV4T2YoJ3wnKVxuICAgICAgICBpZiAocCA+IDAgJiYgKHAgPT09IGxpbmVzWzBdLmluZGV4T2YoJyAnKSkgJiYgKGUgPCAwIHx8IHAgPCBlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGluZXMgPSBbbGluZXNbMF0uc2xpY2UoMCxwKSArICcgJyArIGxpbmVzWzBdLnNsaWNlKHApXVxuICAgICAgICB9XG4gICAgfVxuICAgIGkgPSAwXG4gICAgd2hpbGUgKGkgPCBsaW5lcy5sZW5ndGgpXG4gICAge1xuICAgICAgICBsaW5lID0gbGluZXNbaV1cbiAgICAgICAgdmFyIF8zMzBfMThfID0gaW5zcGVjdChsaW5lKTsgZCA9IF8zMzBfMThfWzBdOyBrID0gXzMzMF8xOF9bMV07IHYgPSBfMzMwXzE4X1syXTsgZSA9IF8zMzBfMThfWzNdXG5cbiAgICAgICAgaWYgKChrICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoKHYgIT0gbnVsbCkgJiYgKCFlKSAmJiAodi5zdWJzdHIoMCwyKSA9PT0gJy4gJykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkTGluZShkLGspXG4gICAgICAgICAgICAgICAgdWQgPSBfa18ubGFzdChzdGFjaykuZFxuICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gX2tfLmxpc3QodW5kZW5zZShkLHYpKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIF8zMzhfMjJfID0gMDsgXzMzOF8yMl8gPCBsaXN0Lmxlbmd0aDsgXzMzOF8yMl8rKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBsaXN0W18zMzhfMjJfXVxuICAgICAgICAgICAgICAgICAgICB2YXIgXzMzOV8zMV8gPSBpbnNwZWN0KGUpOyBkZCA9IF8zMzlfMzFfWzBdOyBkayA9IF8zMzlfMzFfWzFdOyBkdiA9IF8zMzlfMzFfWzJdXG5cbiAgICAgICAgICAgICAgICAgICAgYWRkTGluZShkZCxkayxkdilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKF9rXy5sYXN0KHN0YWNrKS5kID4gdWQgKyAxKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2tfLmxhc3Qoc3RhY2spLnVuZGVuc2VkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9pID0gaVxuICAgICAgICAgICAgICAgIGxpbmVGYWlsID0gZnVuY3Rpb24gKClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID49IGxpbmVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgdW5tYXRjaGVkIG11bHRpbGluZSBzdHJpbmcgaW4gbGluZSAke29pICsgMX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoayA9PT0gJy4uLicgJiYgISh2ICE9IG51bGwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgICAgIHZsID0gW11cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVGYWlsKCkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChsaW5lc1tpXS50cmltTGVmdCgpLnN1YnN0cigwLDMpICE9PSAnLi4uJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxbMF0gPT09ICd8JylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsID0gbC5zdWJzdHIoMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsW2wubGVuZ3RoIC0gMV0gPT09ICd8JylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsID0gbC5zdWJzdHIoMCxsLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2bC5wdXNoKGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5lRmFpbCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGsgPSB2bC5qb2luKCdcXG4nKVxuICAgICAgICAgICAgICAgICAgICByID0gbGluZXNbaV0udHJpbUxlZnQoKS5zdWJzdHIoMykudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIGlmIChyLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodiA9PT0gJy4uLicpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVGYWlsKCkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZsID0gW11cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGxpbmVzW2ldLnRyaW0oKSAhPT0gJy4uLicpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBsaW5lc1tpXS50cmltKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsWzBdID09PSAnfCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGwuc3Vic3RyKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobFtsLmxlbmd0aCAtIDFdID09PSAnfCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGwuc3Vic3RyKDAsbC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmwucHVzaChsKVxuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluZUZhaWwoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2ID0gdmwuam9pbignXFxuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkTGluZShkLGssdilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpICs9IDFcbiAgICB9XG4gICAgcmV0dXJuIHN0YWNrWzBdLm9cbn1cbmRlZmF1bHRzID0ge2V4dDonLm5vb24nLGluZGVudDo0LGFsaWduOnRydWUsbWF4YWxpZ246MzIsc29ydDpmYWxzZSxjaXJjdWxhcjpmYWxzZSxudWxsOmZhbHNlLGNvbG9yczpmYWxzZX1cbnJlZ3MgPSB7dXJsOm5ldyBSZWdFeHAoJ14oaHR0cHM/fGdpdHxmaWxlKSg6Ly8pKFxcXFxTKykkJykscGF0aDpuZXcgUmVnRXhwKCdeKFtcXFxcLlxcXFwvXFxcXFNdKykoXFxcXC9cXFxcUyspJCcpLHNlbXZlcjpuZXcgUmVnRXhwKCdcXFxcZCtcXFxcLlxcXFxkK1xcXFwuXFxcXGQrJyl9XG5cbnBhZCA9IGZ1bmN0aW9uIChzLCBsKVxue1xuICAgIHdoaWxlIChzLmxlbmd0aCA8IGwpXG4gICAge1xuICAgICAgICBzICs9ICcgJ1xuICAgIH1cbiAgICByZXR1cm4gc1xufVxuXG5zdHJpbmdpZnkgPSBmdW5jdGlvbiAob2JqLCBvcHRpb25zID0ge30pXG57XG4gICAgdmFyIGRlZiwgZXNjYXBlLCBpbmRzdHIsIG9wdCwgcHJldHR5LCB0b1N0clxuXG4gICAgZGVmID0gZnVuY3Rpb24gKG8sIGQpXG4gICAge1xuICAgICAgICB2YXIgaywgciwgdlxuXG4gICAgICAgIHIgPSB7fVxuICAgICAgICBmb3IgKGsgaW4gbylcbiAgICAgICAge1xuICAgICAgICAgICAgdiA9IG9ba11cbiAgICAgICAgICAgIHJba10gPSB2XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrIGluIGQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHYgPSBkW2tdXG4gICAgICAgICAgICBpZiAoIShyW2tdICE9IG51bGwpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJba10gPSB2XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJcbiAgICB9XG4gICAgb3B0ID0gZGVmKG9wdGlvbnMsZGVmYXVsdHMpXG4gICAgaWYgKG9wdC5leHQgPT09ICcuanNvbicpXG4gICAge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLG51bGwsb3B0LmluZGVudClcbiAgICB9XG4gICAgaWYgKHR5cGVvZihvcHQuaW5kZW50KSA9PT0gJ3N0cmluZycpXG4gICAge1xuICAgICAgICBvcHQuaW5kZW50ID0gb3B0LmluZGVudC5sZW5ndGhcbiAgICB9XG4gICAgaW5kc3RyID0gcGFkKCcnLG9wdC5pbmRlbnQpXG4gICAgZXNjYXBlID0gZnVuY3Rpb24gKGssIGFycnkpXG4gICAge1xuICAgICAgICB2YXIgZXMsIHNwXG5cbiAgICAgICAgaWYgKDAgPD0gay5pbmRleE9mKCdcXG4nKSlcbiAgICAgICAge1xuICAgICAgICAgICAgc3AgPSBrLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgZXMgPSBzcC5tYXAoZnVuY3Rpb24gKHMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVzY2FwZShzLGFycnkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZXMudW5zaGlmdCgnLi4uJylcbiAgICAgICAgICAgIGVzLnB1c2goJy4uLicpXG4gICAgICAgICAgICByZXR1cm4gZXMuam9pbignXFxuJylcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PT0gJycgfHwgayA9PT0gJy4uLicgfHwgX2tfLmluKGtbMF0sWycgJywnIycsJ3wnXSkgfHwgX2tfLmluKGtbay5sZW5ndGggLSAxXSxbJyAnLCcjJywnfCddKSlcbiAgICAgICAge1xuICAgICAgICAgICAgayA9ICd8JyArIGsgKyAnfCdcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcnJ5ICYmIC9cXHNcXHMvLnRlc3QoaykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGsgPSAnfCcgKyBrICsgJ3wnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtcbiAgICB9XG4gICAgcHJldHR5ID0gZnVuY3Rpb24gKG8sIGluZCwgdmlzaXRlZClcbiAgICB7XG4gICAgICAgIHZhciBrLCBrZXlWYWx1ZSwga2wsIGwsIG1heEtleSwgdlxuXG4gICAgICAgIGlmIChvcHQuYWxpZ24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1heEtleSA9IG9wdC5pbmRlbnRcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhvKS5sZW5ndGggPiAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAoayBpbiBvKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdiA9IG9ba11cbiAgICAgICAgICAgICAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaykpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtsID0gcGFyc2VJbnQoTWF0aC5jZWlsKChrLmxlbmd0aCArIDIpIC8gb3B0LmluZGVudCkgKiBvcHQuaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4S2V5ID0gTWF0aC5tYXgobWF4S2V5LGtsKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5tYXhhbGlnbiAmJiAobWF4S2V5ID4gb3B0Lm1heGFsaWduKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhLZXkgPSBvcHQubWF4YWxpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGwgPSBbXVxuICAgICAgICBrZXlWYWx1ZSA9IGZ1bmN0aW9uIChrLCB2KVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgaSwga3MsIHMsIHZzXG5cbiAgICAgICAgICAgIHMgPSBpbmRcbiAgICAgICAgICAgIGsgPSBlc2NhcGUoayx0cnVlKVxuICAgICAgICAgICAgaWYgKGsuaW5kZXhPZignICAnKSA+IDAgJiYga1swXSAhPT0gJ3wnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGsgPSBgfCR7a318YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa1swXSAhPT0gJ3wnICYmIGtbay5sZW5ndGggLSAxXSA9PT0gJ3wnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGsgPSAnfCcgKyBrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrWzBdID09PSAnfCcgJiYga1trLmxlbmd0aCAtIDFdICE9PSAnfCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgayArPSAnfCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHQuYWxpZ24pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga3MgPSBwYWQoayxNYXRoLm1heChtYXhLZXksay5sZW5ndGggKyAyKSlcbiAgICAgICAgICAgICAgICBpID0gcGFkKGluZCArIGluZHN0cixtYXhLZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga3MgPSBwYWQoayxrLmxlbmd0aCArIDIpXG4gICAgICAgICAgICAgICAgaSA9IGluZCArIGluZHN0clxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcyArPSBrc1xuICAgICAgICAgICAgdnMgPSB0b1N0cih2LGksZmFsc2UsdmlzaXRlZClcbiAgICAgICAgICAgIGlmICh2c1swXSA9PT0gJ1xcbicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHNbcy5sZW5ndGggLSAxXSA9PT0gJyAnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcyA9IHMuc3Vic3RyKDAscy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMgKz0gdnNcbiAgICAgICAgICAgIHdoaWxlIChzW3MubGVuZ3RoIC0gMV0gPT09ICcgJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzID0gcy5zdWJzdHIoMCxzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHQuc29ydClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSBfa18ubGlzdChPYmplY3Qua2V5cyhvKS5zb3J0KCkpXG4gICAgICAgICAgICBmb3IgKHZhciBfNTAzXzE4XyA9IDA7IF81MDNfMThfIDwgbGlzdC5sZW5ndGg7IF81MDNfMThfKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgayA9IGxpc3RbXzUwM18xOF9dXG4gICAgICAgICAgICAgICAgbC5wdXNoKGtleVZhbHVlKGssb1trXSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGsgaW4gbylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ID0gb1trXVxuICAgICAgICAgICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KGspKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbC5wdXNoKGtleVZhbHVlKGssdikpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsLmpvaW4oJ1xcbicpXG4gICAgfVxuICAgIHRvU3RyID0gZnVuY3Rpb24gKG8sIGluZCA9ICcnLCBhcnJ5ID0gZmFsc2UsIHZpc2l0ZWQgPSBbXSlcbiAgICB7XG4gICAgICAgIHZhciBzLCB0LCB2LCBfNTM4XzMyXywgXzU0Ml8zN19cblxuICAgICAgICBpZiAoIShvICE9IG51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAobyA9PT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0Lm51bGwgfHwgYXJyeSAmJiBcIm51bGxcIiB8fCAnJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG8gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICc8Pz4nXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0ID0gdHlwZW9mKG8pKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlc2NhcGUobyxhcnJ5KVxuXG4gICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgIGlmIChvcHQuY2lyY3VsYXIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2tfLmluKG8sdmlzaXRlZCkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0ZWQucHVzaChvKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKG8uY29uc3RydWN0b3IgIT0gbnVsbCA/IG8uY29uc3RydWN0b3IubmFtZSA6IHVuZGVmaW5lZCkgPT09ICdBcnJheScpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzID0gaW5kICE9PSAnJyAmJiBhcnJ5ICYmICcuJyB8fCAnJ1xuICAgICAgICAgICAgICAgICAgICBpZiAoby5sZW5ndGggJiYgaW5kICE9PSAnJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyArPSAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHMgKz0gKGZ1bmN0aW9uICgpIHsgdmFyIHJfNTQxXzY5XyA9IFtdOyB2YXIgbGlzdCA9IF9rXy5saXN0KG8pOyBmb3IgKHZhciBfNTQxXzY5XyA9IDA7IF81NDFfNjlfIDwgbGlzdC5sZW5ndGg7IF81NDFfNjlfKyspICB7IHYgPSBsaXN0W181NDFfNjlfXTtyXzU0MV82OV8ucHVzaChpbmQgKyB0b1N0cih2LGluZCArIGluZHN0cix0cnVlLHZpc2l0ZWQpKSAgfSByZXR1cm4gcl81NDFfNjlfIH0pLmJpbmQodGhpcykoKS5qb2luKCdcXG4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoby5jb25zdHJ1Y3RvciAhPSBudWxsID8gby5jb25zdHJ1Y3Rvci5uYW1lIDogdW5kZWZpbmVkKSA9PT0gJ1JlZ0V4cCcpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5zb3VyY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcyA9IChhcnJ5ICYmICcuXFxuJykgfHwgKChpbmQgIT09ICcnKSAmJiAnXFxuJyB8fCAnJylcbiAgICAgICAgICAgICAgICAgICAgcyArPSBwcmV0dHkobyxpbmQsdmlzaXRlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG8pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJzw/Pz8+J1xuICAgIH1cbiAgICByZXR1cm4gdG9TdHIob2JqKVxufVxuXG5wYXJzZVN0ciA9IGZ1bmN0aW9uIChzdHIsIHAsIGV4dClcbntcbiAgICBpZiAoc3RyLmxlbmd0aCA8PSAwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgc3dpdGNoICgoZXh0ICE9IG51bGwgPyBleHQgOiByZXF1aXJlKCdwYXRoJykuZXh0bmFtZShwKSkpXG4gICAge1xuICAgICAgICBjYXNlICcuanNvbic6XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZShzdHIpXG4gICAgfVxuXG59XG5cbmxvYWQgPSBmdW5jdGlvbiAocCwgZXh0LCBjYilcbntcbiAgICB2YXIgc3RyXG5cbiAgICBpZiAoX2tfLmlzRnVuYyhleHQpKVxuICAgIHtcbiAgICAgICAgY2IgPSBleHRcbiAgICB9XG4gICAgaWYgKF9rXy5pc0Z1bmMoY2IpKVxuICAgIHtcbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBzbGFzaC5yZWFkVGV4dChwLGZ1bmN0aW9uIChzdHIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCFfa18uZW1wdHkoc3RyKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihwYXJzZVN0cihzdHIscCxleHQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBub29uLmxvYWQgLSBlbXB0eSBmaWxlOiAke3B9YClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBub29uLmxvYWQgLSBjYW4ndCByZWFkIGZpbGU6ICR7cH1gLGVycilcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsKVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHRyeVxuICAgICAgICB7XG4gICAgICAgICAgICBzdHIgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhwLCd1dGY4JylcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVN0cihzdHIscCxleHQpXG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycilcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5vb24ubG9hZCAtIFwiICsgU3RyaW5nKGVycikgKyAnICcgKyBwKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5zYXZlID0gZnVuY3Rpb24gKHAsIGRhdGEsIHN0ck9wdCwgY2IpXG57XG4gICAgdmFyIHN0clxuXG4gICAgaWYgKHR5cGVvZihzdHJPcHQpID09PSAnZnVuY3Rpb24nKVxuICAgIHtcbiAgICAgICAgY2IgPSBzdHJPcHRcbiAgICAgICAgc3RyT3B0ID0ge31cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgc3RyT3B0ID0gKHN0ck9wdCAhPSBudWxsID8gc3RyT3B0IDoge30pXG4gICAgfVxuICAgIHN0ciA9IHN0cmluZ2lmeShkYXRhLE9iamVjdC5hc3NpZ24oe2V4dDpwYXRoLmV4dG5hbWUocCksc3RyT3B0OnN0ck9wdH0pKVxuICAgIGlmIChfa18uaXNGdW5jKGNiKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBzbGFzaC53cml0ZVRleHQocCxzdHIsY2IpXG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vb24uc2F2ZSAtIG5vIGNhbGxiYWNrIScpXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQge2V4dG5hbWVzOlsnLmpzb24nLCcubm9vbiddLGV4dGVuc2lvbnM6Wydqc29uJywnbm9vbiddLHNhdmU6c2F2ZSxsb2FkOmxvYWQscGFyc2U6cGFyc2Usc3RyaW5naWZ5OnN0cmluZ2lmeX07IiwKICAiLy8gbW9uc3RlcmtvZGkva29kZSAwLjI1Ni4wXG5cbnZhciBfa18gPSB7aW46IGZ1bmN0aW9uIChhLGwpIHtyZXR1cm4gKHR5cGVvZiBsID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgJiYgYS5sZW5ndGggPyAnJyA6IFtdKS5pbmRleE9mLmNhbGwobCxhKSA+PSAwfSwgZW1wdHk6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGw9PT0nJyB8fCBsPT09bnVsbCB8fCBsPT09dW5kZWZpbmVkIHx8IGwhPT1sIHx8IHR5cGVvZihsKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMobCkubGVuZ3RoID09PSAwfSwgaXNGdW5jOiBmdW5jdGlvbiAobykge3JldHVybiB0eXBlb2YgbyA9PT0gJ2Z1bmN0aW9uJ30sIGlzTnVtOiBmdW5jdGlvbiAobykge3JldHVybiAhaXNOYU4obykgJiYgIWlzTmFOKHBhcnNlRmxvYXQobykpICYmIChpc0Zpbml0ZShvKSB8fCBvID09PSBJbmZpbml0eSB8fCBvID09PSAtSW5maW5pdHkpfSwgaXNTdHI6IGZ1bmN0aW9uIChvKSB7cmV0dXJuIHR5cGVvZiBvID09PSAnc3RyaW5nJyB8fCBvIGluc3RhbmNlb2YgU3RyaW5nfSwgY2xvbmU6IGZ1bmN0aW9uIChvLHYpIHsgdiA/Pz0gbmV3IE1hcCgpOyBpZiAoQXJyYXkuaXNBcnJheShvKSkgeyBpZiAoIXYuaGFzKG8pKSB7dmFyIHIgPSBbXTsgdi5zZXQobyxyKTsgZm9yICh2YXIgaT0wOyBpIDwgby5sZW5ndGg7IGkrKykge2lmICghdi5oYXMob1tpXSkpIHsgdi5zZXQob1tpXSxfa18uY2xvbmUob1tpXSx2KSkgfTsgci5wdXNoKHYuZ2V0KG9baV0pKX19OyByZXR1cm4gdi5nZXQobykgfSBlbHNlIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJykgeyBpZiAoIXYuaGFzKG8pKSB7di5zZXQobywnJytvKX07IHJldHVybiB2LmdldChvKSB9IGVsc2UgaWYgKG8gIT0gbnVsbCAmJiB0eXBlb2YgbyA9PSAnb2JqZWN0JyAmJiBvLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ09iamVjdCcpIHsgaWYgKCF2LmhhcyhvKSkgeyB2YXIgaywgciA9IHt9OyB2LnNldChvLHIpOyBmb3IgKGsgaW4gbykgeyBpZiAoIXYuaGFzKG9ba10pKSB7IHYuc2V0KG9ba10sX2tfLmNsb25lKG9ba10sdikpIH07IHJba10gPSB2LmdldChvW2tdKSB9OyB9OyByZXR1cm4gdi5nZXQobykgfSBlbHNlIHtyZXR1cm4gb30gfSwgbGlzdDogZnVuY3Rpb24gKGwpIHtyZXR1cm4gbCAhPSBudWxsID8gdHlwZW9mIGwubGVuZ3RoID09PSAnbnVtYmVyJyA/IGwgOiBbXSA6IFtdfX1cblxudmFyICQsIGVsZW0sIHN0b3BFdmVudCwgVGl0bGVcblxuaW1wb3J0IGRvbSBmcm9tICcuL2RvbS5qcydcbmltcG9ydCBzZHMgZnJvbSAnLi9zZHMuanMnXG5pbXBvcnQgbWVudSBmcm9tICcuL21lbnUuanMnXG5pbXBvcnQgbm9vbiBmcm9tICcuL25vb24uanMnXG5pbXBvcnQga2V5aW5mbyBmcm9tICcuL2tleWluZm8uanMnXG5pbXBvcnQgc2xhc2ggZnJvbSAnLi9zbGFzaC5qcydcbmltcG9ydCBwb3N0IGZyb20gJy4vcG9zdC5qcydcbiQgPSBkb20uJFxuc3RvcEV2ZW50ID0gZG9tLnN0b3BFdmVudFxuZWxlbSA9IGRvbS5lbGVtXG5cblxuVGl0bGUgPSAoZnVuY3Rpb24gKClcbntcbiAgICBmdW5jdGlvbiBUaXRsZSAob3B0KVxuICAgIHtcbiAgICAgICAgdmFyIGltZ1NyYywgcGtnLCBfMjNfMTNfLCBfMjdfMjdfXG5cbiAgICAgICAgdGhpcy5vcHQgPSBvcHRcbiAgICBcbiAgICAgICAgdGhpc1tcIm9wZW5NZW51XCJdID0gdGhpc1tcIm9wZW5NZW51XCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcInRvZ2dsZU1lbnVcIl0gPSB0aGlzW1widG9nZ2xlTWVudVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJoaWRlTWVudVwiXSA9IHRoaXNbXCJoaWRlTWVudVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJzaG93TWVudVwiXSA9IHRoaXNbXCJzaG93TWVudVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJtZW51VmlzaWJsZVwiXSA9IHRoaXNbXCJtZW51VmlzaWJsZVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbk1lbnVBY3Rpb25cIl0gPSB0aGlzW1wib25NZW51QWN0aW9uXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uVGl0bGViYXJcIl0gPSB0aGlzW1wib25UaXRsZWJhclwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbldpbmRvd0JsdXJcIl0gPSB0aGlzW1wib25XaW5kb3dCbHVyXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uV2luZG93Rm9jdXNcIl0gPSB0aGlzW1wib25XaW5kb3dGb2N1c1wiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMub3B0ID0gKChfMjNfMTNfPXRoaXMub3B0KSAhPSBudWxsID8gXzIzXzEzXyA6IHt9KVxuICAgICAgICBwa2cgPSB0aGlzLm9wdC5wa2dcbiAgICAgICAgdGhpcy5lbGVtID0gJCgoKF8yN18yN189dGhpcy5vcHQuZWxlbSkgIT0gbnVsbCA/IF8yN18yN18gOiBcIiN0aXRsZWJhclwiKSlcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJylcbiAgICAgICAgaWYgKCF0aGlzLmVsZW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHBvc3Qub24oJ3RpdGxlYmFyJyx0aGlzLm9uVGl0bGViYXIpXG4gICAgICAgIHBvc3Qub24oJ21lbnVBY3Rpb24nLHRoaXMub25NZW51QWN0aW9uKVxuICAgICAgICBwb3N0Lm9uKCd3aW5kb3cuYmx1cicsdGhpcy5vbldpbmRvd0JsdXIpXG4gICAgICAgIHBvc3Qub24oJ3dpbmRvdy5mb2N1cycsdGhpcy5vbldpbmRvd0ZvY3VzKVxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLGZ1bmN0aW9uIChldmVudClcbiAgICAgICAge1xuICAgICAgICAgICAgc3RvcEV2ZW50KGV2ZW50KVxuICAgICAgICAgICAgcmV0dXJuIHBvc3QuZW1pdCgnbWVudUFjdGlvbicsJ01heGltaXplJylcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy53aW5pY29uID0gZWxlbSh7Y2xhc3M6J3dpbmljb24nfSlcbiAgICAgICAgaWYgKHRoaXMub3B0Lmljb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGltZ1NyYyA9IHNsYXNoLmpvaW4odGhpcy5vcHQuZGlyLHRoaXMub3B0Lmljb24pXG4gICAgICAgICAgICB0aGlzLndpbmljb24uYXBwZW5kQ2hpbGQoZWxlbSgnaW1nJyx7c3JjOmltZ1NyY30pKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLndpbmljb24pXG4gICAgICAgIHRoaXMud2luaWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24gKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHBvc3QuZW1pdCgnbWVudUFjdGlvbicsJ09wZW4gTWVudScpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudGl0bGUgPSBlbGVtKHtjbGFzczondGl0bGViYXItdGl0bGUgYXBwLWRyYWctcmVnaW9uJyxpZDondGl0bGUnfSlcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpXG4gICAgICAgIHRoaXMuc2V0VGl0bGUodGhpcy5vcHQpXG4gICAgICAgIHRoaXMubWluaW1pemUgPSBlbGVtKHtjbGFzczond2luYnV0dG9uIG1pbmltaXplIGdyYXknfSlcbiAgICAgICAgdGhpcy5taW5pbWl6ZS5pbm5lckhUTUwgPSBgPHN2ZyB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIi0xMCAtOCAzMCAzMFwiPlxuICAgIDxsaW5lIHgxPVwiLTFcIiB5MT1cIjVcIiB4Mj1cIjExXCIgeTI9XCI1XCI+PC9saW5lPlxuPC9zdmc+YFxuICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy5taW5pbWl6ZSlcbiAgICAgICAgdGhpcy5taW5pbWl6ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24gKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHBvc3QuZW1pdCgnbWVudUFjdGlvbicsJ01pbmltaXplJylcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5tYXhpbWl6ZSA9IGVsZW0oe2NsYXNzOid3aW5idXR0b24gbWF4aW1pemUgZ3JheSd9KVxuICAgICAgICB0aGlzLm1heGltaXplLmlubmVySFRNTCA9IGA8c3ZnIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiLTEwIC05IDMwIDMwXCI+XG4gIDxyZWN0IHdpZHRoPVwiMTFcIiBoZWlnaHQ9XCIxMVwiIHN0eWxlPVwiZmlsbC1vcGFjaXR5OiAwO1wiPjwvcmVjdD5cbjwvc3ZnPmBcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMubWF4aW1pemUpXG4gICAgICAgIHRoaXMubWF4aW1pemUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCdNYXhpbWl6ZScpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuY2xvc2UgPSBlbGVtKHtjbGFzczond2luYnV0dG9uIGNsb3NlJ30pXG4gICAgICAgIHRoaXMuY2xvc2UuaW5uZXJIVE1MID0gYDxzdmcgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCItMTAgLTkgMzAgMzBcIj5cbiAgICA8bGluZSB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjEwXCIgeTI9XCIxMVwiPjwvbGluZT5cbiAgICA8bGluZSB4MT1cIjEwXCIgeTE9XCIwXCIgeDI9XCIwXCIgeTI9XCIxMVwiPjwvbGluZT5cbjwvc3ZnPmBcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMuY2xvc2UpXG4gICAgICAgIHRoaXMuY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCdDbG9zZScpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudG9wZnJhbWUgPSBlbGVtKHtjbGFzczondG9wZnJhbWUnfSlcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMudG9wZnJhbWUpXG4gICAgICAgIHRoaXMuaW5pdE1lbnUoKVxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcInB1c2hFbGVtXCJdID0gZnVuY3Rpb24gKGVsZW0pXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtLmluc2VydEJlZm9yZShlbGVtLHRoaXMubWluaW1pemUpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wic2hvd1RpdGxlXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpdGxlLnN0eWxlLmRpc3BsYXkgPSAnaW5pdGlhbCdcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJoaWRlVGl0bGVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGUuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcIm9uV2luZG93Rm9jdXNcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2JsdXInKVxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJylcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJvbldpbmRvd0JsdXJcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzJylcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdibHVyJylcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJzZXRUaXRsZVwiXSA9IGZ1bmN0aW9uIChvcHQpXG4gICAge1xuICAgICAgICB2YXIgaHRtbCwgcGFydHMsIF8xMjNfMjZfXG5cbiAgICAgICAgaHRtbCA9IFwiXCJcbiAgICAgICAgcGFydHMgPSAoKF8xMjNfMjZfPW9wdC50aXRsZSkgIT0gbnVsbCA/IF8xMjNfMjZfIDogW10pXG4gICAgICAgIGlmIChvcHQucGtnKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAob3B0LnBrZy5uYW1lICYmIF9rXy5pbignbmFtZScscGFydHMpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPSd0aXRsZWJhci1uYW1lJz4ke29wdC5wa2cubmFtZX08L3NwYW4+YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdC5wa2cudmVyc2lvbiAmJiBfa18uaW4oJ3ZlcnNpb24nLHBhcnRzKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz0ndGl0bGViYXItZG90Jz4ke29wdC5wa2cudmVyc2lvbn08L3NwYW4+YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdC5wa2cucGF0aCAmJiBfa18uaW4oJ3BhdGgnLHBhcnRzKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gY2xhc3M9J3RpdGxlYmFyLWRvdCc+IOKWuiA8L3NwYW4+XCJcbiAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz0ndGl0bGViYXItbmFtZSc+JHtvcHQucGtnLnBhdGh9PC9zcGFuPmBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50aXRsZS5pbm5lckhUTUwgPSBodG1sXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wib25UaXRsZWJhclwiXSA9IGZ1bmN0aW9uIChhY3Rpb24pXG4gICAge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbilcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnc2hvd1RpdGxlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93VGl0bGUoKVxuXG4gICAgICAgICAgICBjYXNlICdoaWRlVGl0bGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhpZGVUaXRsZSgpXG5cbiAgICAgICAgICAgIGNhc2UgJ3Nob3dNZW51JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93TWVudSgpXG5cbiAgICAgICAgICAgIGNhc2UgJ2hpZGVNZW51JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlTWVudSgpXG5cbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZU1lbnUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZU1lbnUoKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcIm9uTWVudUFjdGlvblwiXSA9IGZ1bmN0aW9uIChhY3Rpb24pXG4gICAge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbi50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlICd0b2dnbGUgbWVudSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlTWVudSgpXG5cbiAgICAgICAgICAgIGNhc2UgJ29wZW4gbWVudSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3Blbk1lbnUoKVxuXG4gICAgICAgICAgICBjYXNlICdzaG93IG1lbnUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3dNZW51KClcblxuICAgICAgICAgICAgY2FzZSAnaGlkZSBtZW51JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlTWVudSgpXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wiaW5pdE1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdC5tZW51KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuICAgICAgICBpZiAoX2tfLmVtcHR5KHRoaXMudGVtcGxhdGVDYWNoZSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBub29uLmxvYWQodGhpcy5vcHQubWVudSwoZnVuY3Rpb24gKHRjKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBfMTc2XzQwX1xuXG4gICAgICAgICAgICAgICAgaWYgKCFfa18uZW1wdHkodGMpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZUNhY2hlID0gdGhpcy5tYWtlVGVtcGxhdGUodGMpXG4gICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy5vcHQubWVudVRlbXBsYXRlICE9IG51bGwpICYmIF9rXy5pc0Z1bmModGhpcy5vcHQubWVudVRlbXBsYXRlKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZUNhY2hlID0gdGhpcy5vcHQubWVudVRlbXBsYXRlKHRoaXMudGVtcGxhdGVDYWNoZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0RnJvbUNhY2hlKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndGl0bGUuaW5pdE1lbnUgLSBlbXB0eSB0ZW1wbGF0ZT8nLHRoaXMub3B0Lm1lbnUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXRGcm9tQ2FjaGUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wiaW5pdEZyb21DYWNoZVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB0aGlzLm1lbnUgPSBuZXcgbWVudSh7aXRlbXM6dGhpcy50ZW1wbGF0ZUNhY2hlfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5pbnNlcnRCZWZvcmUodGhpcy5tZW51LmVsZW0sdGhpcy5lbGVtLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wibWFrZVRlbXBsYXRlXCJdID0gZnVuY3Rpb24gKG9iailcbiAgICB7XG4gICAgICAgIHZhciBtZW51T3JBY2NlbCwgdGV4dCwgdG1wbFxuXG4gICAgICAgIHRtcGwgPSBbXVxuICAgICAgICBmb3IgKHRleHQgaW4gb2JqKVxuICAgICAgICB7XG4gICAgICAgICAgICBtZW51T3JBY2NlbCA9IG9ialt0ZXh0XVxuICAgICAgICAgICAgdG1wbC5wdXNoKCgoZnVuY3Rpb24gKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSwgXzIwNl8zM18sIF8yMDZfNTdfXG5cbiAgICAgICAgICAgICAgICBpZiAoX2tfLmVtcHR5KG1lbnVPckFjY2VsKSAmJiB0ZXh0LnN0YXJ0c1dpdGgoJy0nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7dGV4dDonJ31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2tfLmlzTnVtKG1lbnVPckFjY2VsKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7dGV4dDp0ZXh0LGFjY2VsOmtzdHIobWVudU9yQWNjZWwpfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfa18uaXNTdHIobWVudU9yQWNjZWwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt0ZXh0OnRleHQsYWNjZWw6a2V5aW5mby5jb252ZXJ0Q21kQ3RybChtZW51T3JBY2NlbCl9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKF9rXy5lbXB0eShtZW51T3JBY2NlbCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3RleHQ6dGV4dCxhY2NlbDonJ31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKG1lbnVPckFjY2VsLmFjY2VsICE9IG51bGwpIHx8IChtZW51T3JBY2NlbC5jb21tYW5kICE9IG51bGwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IF9rXy5jbG9uZShtZW51T3JBY2NlbClcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdGV4dFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3RleHQ6dGV4dCxtZW51OnRoaXMubWFrZVRlbXBsYXRlKG1lbnVPckFjY2VsKX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpKSgpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0bXBsXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wicmVmcmVzaE1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5tZW51LmRlbCgpXG4gICAgICAgIHJldHVybiB0aGlzLmluaXRNZW51KClcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJtZW51VmlzaWJsZVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5tZW51LmVsZW0uc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wic2hvd01lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8yMjFfNjhfLCBfMjIxXzc1X1xuXG4gICAgICAgIHRoaXMubWVudS5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgICAgICByZXR1cm4gKChfMjIxXzY4Xz10aGlzLm1lbnUpICE9IG51bGwgPyB0eXBlb2YgKF8yMjFfNzVfPV8yMjFfNjhfLmZvY3VzKSA9PT0gXCJmdW5jdGlvblwiID8gXzIyMV83NV8oKSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZClcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJoaWRlTWVudVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICB2YXIgXzIyMl8yNV9cblxuICAgICAgICA7KHRoaXMubWVudSAhPSBudWxsID8gdGhpcy5tZW51LmNsb3NlKCkgOiB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzLm1lbnUuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1widG9nZ2xlTWVudVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5tZW51VmlzaWJsZSgpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlTWVudSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93TWVudSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJvcGVuTWVudVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5tZW51VmlzaWJsZSgpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlTWVudSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnNob3dNZW51KClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lbnUub3BlbigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJoYW5kbGVLZXlJbmZvXCJdID0gZnVuY3Rpb24gKG1vZEtleUNvbWJvRXZlbnQpXG4gICAge1xuICAgICAgICB2YXIgYWNjZWxzLCBhY3Rpb24sIGNvbWJvLCBjb21ib3MsIGV2ZW50LCBpdGVtLCBrZXksIGtleXBhdGgsIG1lbnUsIG1vZCwgXzI1N18zN19cblxuICAgICAgICBtb2QgPSBtb2RLZXlDb21ib0V2ZW50Lm1vZFxuICAgICAgICBrZXkgPSBtb2RLZXlDb21ib0V2ZW50LmtleVxuICAgICAgICBjb21ibyA9IG1vZEtleUNvbWJvRXZlbnQuY29tYm9cbiAgICAgICAgZXZlbnQgPSBtb2RLZXlDb21ib0V2ZW50LmV2ZW50XG5cbiAgICAgICAgaWYgKF9rXy5lbXB0eShjb21ibykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAndW5oYW5kbGVkJ1xuICAgICAgICB9XG4gICAgICAgIG1lbnUgPSB0aGlzLnRlbXBsYXRlQ2FjaGVcbiAgICAgICAgaWYgKF9rXy5lbXB0eShtZW51KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG1lbnUnKVxuICAgICAgICAgICAgcmV0dXJuICd1bmhhbmRsZWQnXG4gICAgICAgIH1cbiAgICAgICAgYWNjZWxzID0gc2RzLmZpbmQua2V5KG1lbnUsJ2FjY2VsJylcbiAgICAgICAgY29tYm9zID0gc2RzLmZpbmQua2V5KG1lbnUsJ2NvbWJvJylcbiAgICAgICAgdmFyIGxpc3QgPSBfa18ubGlzdChjb21ib3MuY29uY2F0KGFjY2VscykpXG4gICAgICAgIGZvciAodmFyIF8yNTFfMjBfID0gMDsgXzI1MV8yMF8gPCBsaXN0Lmxlbmd0aDsgXzI1MV8yMF8rKylcbiAgICAgICAge1xuICAgICAgICAgICAga2V5cGF0aCA9IGxpc3RbXzI1MV8yMF9dXG4gICAgICAgICAgICBjb21ib3MgPSBzZHMuZ2V0KG1lbnUsa2V5cGF0aCkuc3BsaXQoJyAnKVxuICAgICAgICAgICAgY29tYm9zID0gY29tYm9zLm1hcChmdW5jdGlvbiAoYylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5aW5mby5jb252ZXJ0Q21kQ3RybChjKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChfa18uaW4oY29tYm8sY29tYm9zKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXlwYXRoLnBvcCgpXG4gICAgICAgICAgICAgICAgaXRlbSA9IHNkcy5nZXQobWVudSxrZXlwYXRoKVxuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICgoXzI1N18zN189aXRlbS5hY3Rpb24pICE9IG51bGwgPyBfMjU3XzM3XyA6IGl0ZW0udGV4dClcbiAgICAgICAgICAgICAgICBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLGFjdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd1bmhhbmRsZWQnXG4gICAgfVxuXG4gICAgcmV0dXJuIFRpdGxlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFRpdGxlOyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfID0ge2luOiBmdW5jdGlvbiAoYSxsKSB7cmV0dXJuICh0eXBlb2YgbCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGEgPT09ICdzdHJpbmcnICYmIGEubGVuZ3RoID8gJycgOiBbXSkuaW5kZXhPZi5jYWxsKGwsYSkgPj0gMH0sIGVtcHR5OiBmdW5jdGlvbiAobCkge3JldHVybiBsPT09JycgfHwgbD09PW51bGwgfHwgbD09PXVuZGVmaW5lZCB8fCBsIT09bCB8fCB0eXBlb2YobCkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGwpLmxlbmd0aCA9PT0gMH0sIGlzRnVuYzogZnVuY3Rpb24gKG8pIHtyZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbid9LCBpc051bTogZnVuY3Rpb24gKG8pIHtyZXR1cm4gIWlzTmFOKG8pICYmICFpc05hTihwYXJzZUZsb2F0KG8pKSAmJiAoaXNGaW5pdGUobykgfHwgbyA9PT0gSW5maW5pdHkgfHwgbyA9PT0gLUluZmluaXR5KX0sIGlzU3RyOiBmdW5jdGlvbiAobykge3JldHVybiB0eXBlb2YgbyA9PT0gJ3N0cmluZycgfHwgbyBpbnN0YW5jZW9mIFN0cmluZ30sIGNsb25lOiBmdW5jdGlvbiAobyx2KSB7IHYgPz89IG5ldyBNYXAoKTsgaWYgKEFycmF5LmlzQXJyYXkobykpIHsgaWYgKCF2LmhhcyhvKSkge3ZhciByID0gW107IHYuc2V0KG8scik7IGZvciAodmFyIGk9MDsgaSA8IG8ubGVuZ3RoOyBpKyspIHtpZiAoIXYuaGFzKG9baV0pKSB7IHYuc2V0KG9baV0sX2tfLmNsb25lKG9baV0sdikpIH07IHIucHVzaCh2LmdldChvW2ldKSl9fTsgcmV0dXJuIHYuZ2V0KG8pIH0gZWxzZSBpZiAodHlwZW9mIG8gPT0gJ3N0cmluZycpIHsgaWYgKCF2LmhhcyhvKSkge3Yuc2V0KG8sJycrbyl9OyByZXR1cm4gdi5nZXQobykgfSBlbHNlIGlmIChvICE9IG51bGwgJiYgdHlwZW9mIG8gPT0gJ29iamVjdCcgJiYgby5jb25zdHJ1Y3Rvci5uYW1lID09ICdPYmplY3QnKSB7IGlmICghdi5oYXMobykpIHsgdmFyIGssIHIgPSB7fTsgdi5zZXQobyxyKTsgZm9yIChrIGluIG8pIHsgaWYgKCF2LmhhcyhvW2tdKSkgeyB2LnNldChvW2tdLF9rXy5jbG9uZShvW2tdLHYpKSB9OyByW2tdID0gdi5nZXQob1trXSkgfTsgfTsgcmV0dXJuIHYuZ2V0KG8pIH0gZWxzZSB7cmV0dXJuIG99IH0sIGxpc3Q6IGZ1bmN0aW9uIChsKSB7cmV0dXJuIGwgIT0gbnVsbCA/IHR5cGVvZiBsLmxlbmd0aCA9PT0gJ251bWJlcicgPyBsIDogW10gOiBbXX19XG5cbnZhciAkLCBlbGVtLCBzdG9wRXZlbnQsIFRpdGxlXG5cbmltcG9ydCBkb20gZnJvbSAnLi9kb20uanMnXG5pbXBvcnQgc2RzIGZyb20gJy4vc2RzLmpzJ1xuaW1wb3J0IG1lbnUgZnJvbSAnLi9tZW51LmpzJ1xuaW1wb3J0IG5vb24gZnJvbSAnLi9ub29uLmpzJ1xuaW1wb3J0IGtleWluZm8gZnJvbSAnLi9rZXlpbmZvLmpzJ1xuaW1wb3J0IHNsYXNoIGZyb20gJy4vc2xhc2guanMnXG5pbXBvcnQgcG9zdCBmcm9tICcuL3Bvc3QuanMnXG4kID0gZG9tLiRcbnN0b3BFdmVudCA9IGRvbS5zdG9wRXZlbnRcbmVsZW0gPSBkb20uZWxlbVxuXG5cblRpdGxlID0gKGZ1bmN0aW9uICgpXG57XG4gICAgZnVuY3Rpb24gVGl0bGUgKG9wdClcbiAgICB7XG4gICAgICAgIHZhciBpbWdTcmMsIHBrZywgXzIzXzEzXywgXzI3XzI3X1xuXG4gICAgICAgIHRoaXMub3B0ID0gb3B0XG4gICAgXG4gICAgICAgIHRoaXNbXCJvcGVuTWVudVwiXSA9IHRoaXNbXCJvcGVuTWVudVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJ0b2dnbGVNZW51XCJdID0gdGhpc1tcInRvZ2dsZU1lbnVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wiaGlkZU1lbnVcIl0gPSB0aGlzW1wiaGlkZU1lbnVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wic2hvd01lbnVcIl0gPSB0aGlzW1wic2hvd01lbnVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wibWVudVZpc2libGVcIl0gPSB0aGlzW1wibWVudVZpc2libGVcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25NZW51QWN0aW9uXCJdID0gdGhpc1tcIm9uTWVudUFjdGlvblwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvblRpdGxlYmFyXCJdID0gdGhpc1tcIm9uVGl0bGViYXJcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25XaW5kb3dCbHVyXCJdID0gdGhpc1tcIm9uV2luZG93Qmx1clwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbldpbmRvd0ZvY3VzXCJdID0gdGhpc1tcIm9uV2luZG93Rm9jdXNcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzLm9wdCA9ICgoXzIzXzEzXz10aGlzLm9wdCkgIT0gbnVsbCA/IF8yM18xM18gOiB7fSlcbiAgICAgICAgcGtnID0gdGhpcy5vcHQucGtnXG4gICAgICAgIHRoaXMuZWxlbSA9ICQoKChfMjdfMjdfPXRoaXMub3B0LmVsZW0pICE9IG51bGwgPyBfMjdfMjdfIDogXCIjdGl0bGViYXJcIikpXG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpXG4gICAgICAgIGlmICghdGhpcy5lbGVtKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBwb3N0Lm9uKCd0aXRsZWJhcicsdGhpcy5vblRpdGxlYmFyKVxuICAgICAgICBwb3N0Lm9uKCdtZW51QWN0aW9uJyx0aGlzLm9uTWVudUFjdGlvbilcbiAgICAgICAgcG9zdC5vbignd2luZG93LmJsdXInLHRoaXMub25XaW5kb3dCbHVyKVxuICAgICAgICBwb3N0Lm9uKCd3aW5kb3cuZm9jdXMnLHRoaXMub25XaW5kb3dGb2N1cylcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJyxmdW5jdGlvbiAoZXZlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN0b3BFdmVudChldmVudClcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCdNYXhpbWl6ZScpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMud2luaWNvbiA9IGVsZW0oe2NsYXNzOid3aW5pY29uJ30pXG4gICAgICAgIGlmICh0aGlzLm9wdC5pY29uKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbWdTcmMgPSBzbGFzaC5qb2luKHRoaXMub3B0LmRpcix0aGlzLm9wdC5pY29uKVxuICAgICAgICAgICAgdGhpcy53aW5pY29uLmFwcGVuZENoaWxkKGVsZW0oJ2ltZycse3NyYzppbWdTcmN9KSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy53aW5pY29uKVxuICAgICAgICB0aGlzLndpbmljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCdPcGVuIE1lbnUnKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRpdGxlID0gZWxlbSh7Y2xhc3M6J3RpdGxlYmFyLXRpdGxlIGFwcC1kcmFnLXJlZ2lvbicsaWQ6J3RpdGxlJ30pXG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlKVxuICAgICAgICB0aGlzLnNldFRpdGxlKHRoaXMub3B0KVxuICAgICAgICB0aGlzLm1pbmltaXplID0gZWxlbSh7Y2xhc3M6J3dpbmJ1dHRvbiBtaW5pbWl6ZSBncmF5J30pXG4gICAgICAgIHRoaXMubWluaW1pemUuaW5uZXJIVE1MID0gYDxzdmcgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCItMTAgLTggMzAgMzBcIj5cbiAgICA8bGluZSB4MT1cIi0xXCIgeTE9XCI1XCIgeDI9XCIxMVwiIHkyPVwiNVwiPjwvbGluZT5cbjwvc3ZnPmBcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMubWluaW1pemUpXG4gICAgICAgIHRoaXMubWluaW1pemUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwb3N0LmVtaXQoJ21lbnVBY3Rpb24nLCdNaW5pbWl6ZScpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubWF4aW1pemUgPSBlbGVtKHtjbGFzczond2luYnV0dG9uIG1heGltaXplIGdyYXknfSlcbiAgICAgICAgdGhpcy5tYXhpbWl6ZS5pbm5lckhUTUwgPSBgPHN2ZyB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIi0xMCAtOSAzMCAzMFwiPlxuICA8cmVjdCB3aWR0aD1cIjExXCIgaGVpZ2h0PVwiMTFcIiBzdHlsZT1cImZpbGwtb3BhY2l0eTogMDtcIj48L3JlY3Q+XG48L3N2Zz5gXG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLm1heGltaXplKVxuICAgICAgICB0aGlzLm1heGltaXplLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcG9zdC5lbWl0KCdtZW51QWN0aW9uJywnTWF4aW1pemUnKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNsb3NlID0gZWxlbSh7Y2xhc3M6J3dpbmJ1dHRvbiBjbG9zZSd9KVxuICAgICAgICB0aGlzLmNsb3NlLmlubmVySFRNTCA9IGA8c3ZnIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiLTEwIC05IDMwIDMwXCI+XG4gICAgPGxpbmUgeDE9XCIwXCIgeTE9XCIwXCIgeDI9XCIxMFwiIHkyPVwiMTFcIj48L2xpbmU+XG4gICAgPGxpbmUgeDE9XCIxMFwiIHkxPVwiMFwiIHgyPVwiMFwiIHkyPVwiMTFcIj48L2xpbmU+XG48L3N2Zz5gXG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlKVxuICAgICAgICB0aGlzLmNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcG9zdC5lbWl0KCdtZW51QWN0aW9uJywnQ2xvc2UnKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRvcGZyYW1lID0gZWxlbSh7Y2xhc3M6J3RvcGZyYW1lJ30pXG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLnRvcGZyYW1lKVxuICAgICAgICB0aGlzLmluaXRNZW51KClcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJwdXNoRWxlbVwiXSA9IGZ1bmN0aW9uIChlbGVtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5pbnNlcnRCZWZvcmUoZWxlbSx0aGlzLm1pbmltaXplKVxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcInNob3dUaXRsZVwiXSA9IGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy50aXRsZS5zdHlsZS5kaXNwbGF5ID0gJ2luaXRpYWwnXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wiaGlkZVRpdGxlXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpdGxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJvbldpbmRvd0ZvY3VzXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdibHVyJylcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wib25XaW5kb3dCbHVyXCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cycpXG4gICAgICAgIHJldHVybiB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnYmx1cicpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wic2V0VGl0bGVcIl0gPSBmdW5jdGlvbiAob3B0KVxuICAgIHtcbiAgICAgICAgdmFyIGh0bWwsIHBhcnRzLCBfMTIzXzI2X1xuXG4gICAgICAgIGh0bWwgPSBcIlwiXG4gICAgICAgIHBhcnRzID0gKChfMTIzXzI2Xz1vcHQudGl0bGUpICE9IG51bGwgPyBfMTIzXzI2XyA6IFtdKVxuICAgICAgICBpZiAob3B0LnBrZylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKG9wdC5wa2cubmFtZSAmJiBfa18uaW4oJ25hbWUnLHBhcnRzKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz0ndGl0bGViYXItbmFtZSc+JHtvcHQucGtnLm5hbWV9PC9zcGFuPmBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHQucGtnLnZlcnNpb24gJiYgX2tfLmluKCd2ZXJzaW9uJyxwYXJ0cykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9J3RpdGxlYmFyLWRvdCc+JHtvcHQucGtnLnZlcnNpb259PC9zcGFuPmBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHQucGtnLnBhdGggJiYgX2tfLmluKCdwYXRoJyxwYXJ0cykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzcGFuIGNsYXNzPSd0aXRsZWJhci1kb3QnPiDilrogPC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9J3RpdGxlYmFyLW5hbWUnPiR7b3B0LnBrZy5wYXRofTwvc3Bhbj5gXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcIm9uVGl0bGViYXJcIl0gPSBmdW5jdGlvbiAoYWN0aW9uKVxuICAgIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgJ3Nob3dUaXRsZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd1RpdGxlKClcblxuICAgICAgICAgICAgY2FzZSAnaGlkZVRpdGxlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlVGl0bGUoKVxuXG4gICAgICAgICAgICBjYXNlICdzaG93TWVudSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd01lbnUoKVxuXG4gICAgICAgICAgICBjYXNlICdoaWRlTWVudSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGlkZU1lbnUoKVxuXG4gICAgICAgICAgICBjYXNlICd0b2dnbGVNZW51JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVNZW51KClcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBUaXRsZS5wcm90b3R5cGVbXCJvbk1lbnVBY3Rpb25cIl0gPSBmdW5jdGlvbiAoYWN0aW9uKVxuICAgIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udG9Mb3dlckNhc2UoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAndG9nZ2xlIG1lbnUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZU1lbnUoKVxuXG4gICAgICAgICAgICBjYXNlICdvcGVuIG1lbnUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW5NZW51KClcblxuICAgICAgICAgICAgY2FzZSAnc2hvdyBtZW51JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93TWVudSgpXG5cbiAgICAgICAgICAgIGNhc2UgJ2hpZGUgbWVudSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGlkZU1lbnUoKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcImluaXRNZW51XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIGlmICghdGhpcy5vcHQubWVudSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9rXy5lbXB0eSh0aGlzLnRlbXBsYXRlQ2FjaGUpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gbm9vbi5sb2FkKHRoaXMub3B0Lm1lbnUsKGZ1bmN0aW9uICh0YylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgXzE3Nl80MF9cblxuICAgICAgICAgICAgICAgIGlmICghX2tfLmVtcHR5KHRjKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVDYWNoZSA9IHRoaXMubWFrZVRlbXBsYXRlKHRjKVxuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMub3B0Lm1lbnVUZW1wbGF0ZSAhPSBudWxsKSAmJiBfa18uaXNGdW5jKHRoaXMub3B0Lm1lbnVUZW1wbGF0ZSkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVDYWNoZSA9IHRoaXMub3B0Lm1lbnVUZW1wbGF0ZSh0aGlzLnRlbXBsYXRlQ2FjaGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdEZyb21DYWNoZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RpdGxlLmluaXRNZW51IC0gZW1wdHkgdGVtcGxhdGU/Jyx0aGlzLm9wdC5tZW51KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmJpbmQodGhpcykpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0RnJvbUNhY2hlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcImluaXRGcm9tQ2FjaGVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IG1lbnUoe2l0ZW1zOnRoaXMudGVtcGxhdGVDYWNoZX0pXG4gICAgICAgIHJldHVybiB0aGlzLmVsZW0uaW5zZXJ0QmVmb3JlKHRoaXMubWVudS5lbGVtLHRoaXMuZWxlbS5maXJzdENoaWxkLm5leHRTaWJsaW5nKVxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcIm1ha2VUZW1wbGF0ZVwiXSA9IGZ1bmN0aW9uIChvYmopXG4gICAge1xuICAgICAgICB2YXIgbWVudU9yQWNjZWwsIHRleHQsIHRtcGxcblxuICAgICAgICB0bXBsID0gW11cbiAgICAgICAgZm9yICh0ZXh0IGluIG9iailcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudU9yQWNjZWwgPSBvYmpbdGV4dF1cbiAgICAgICAgICAgIHRtcGwucHVzaCgoKGZ1bmN0aW9uICgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0sIF8yMDZfMzNfLCBfMjA2XzU3X1xuXG4gICAgICAgICAgICAgICAgaWYgKF9rXy5lbXB0eShtZW51T3JBY2NlbCkgJiYgdGV4dC5zdGFydHNXaXRoKCctJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3RleHQ6Jyd9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKF9rXy5pc051bShtZW51T3JBY2NlbCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3RleHQ6dGV4dCxhY2NlbDprc3RyKG1lbnVPckFjY2VsKX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2tfLmlzU3RyKG1lbnVPckFjY2VsKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7dGV4dDp0ZXh0LGFjY2VsOmtleWluZm8uY29udmVydENtZEN0cmwobWVudU9yQWNjZWwpfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfa18uZW1wdHkobWVudU9yQWNjZWwpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt0ZXh0OnRleHQsYWNjZWw6Jyd9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChtZW51T3JBY2NlbC5hY2NlbCAhPSBudWxsKSB8fCAobWVudU9yQWNjZWwuY29tbWFuZCAhPSBudWxsKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBfa18uY2xvbmUobWVudU9yQWNjZWwpXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt0ZXh0OnRleHQsbWVudTp0aGlzLm1ha2VUZW1wbGF0ZShtZW51T3JBY2NlbCl9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSkoKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG1wbFxuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcInJlZnJlc2hNZW51XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHRoaXMubWVudS5kZWwoKVxuICAgICAgICByZXR1cm4gdGhpcy5pbml0TWVudSgpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wibWVudVZpc2libGVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVudS5lbGVtLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJ1xuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcInNob3dNZW51XCJdID0gZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIHZhciBfMjIxXzY4XywgXzIyMV83NV9cblxuICAgICAgICB0aGlzLm1lbnUuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcbiAgICAgICAgcmV0dXJuICgoXzIyMV82OF89dGhpcy5tZW51KSAhPSBudWxsID8gdHlwZW9mIChfMjIxXzc1Xz1fMjIxXzY4Xy5mb2N1cykgPT09IFwiZnVuY3Rpb25cIiA/IF8yMjFfNzVfKCkgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wiaGlkZU1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIF8yMjJfMjVfXG5cbiAgICAgICAgOyh0aGlzLm1lbnUgIT0gbnVsbCA/IHRoaXMubWVudS5jbG9zZSgpIDogdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcy5tZW51LmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cblxuICAgIFRpdGxlLnByb3RvdHlwZVtcInRvZ2dsZU1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMubWVudVZpc2libGUoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGlkZU1lbnUoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd01lbnUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wib3Blbk1lbnVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMubWVudVZpc2libGUoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGlkZU1lbnUoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5zaG93TWVudSgpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZW51Lm9wZW4oKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgVGl0bGUucHJvdG90eXBlW1wiaGFuZGxlS2V5SW5mb1wiXSA9IGZ1bmN0aW9uIChtb2RLZXlDb21ib0V2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGFjY2VscywgYWN0aW9uLCBjb21ibywgY29tYm9zLCBldmVudCwgaXRlbSwga2V5LCBrZXlwYXRoLCBtZW51LCBtb2QsIF8yNTdfMzdfXG5cbiAgICAgICAgbW9kID0gbW9kS2V5Q29tYm9FdmVudC5tb2RcbiAgICAgICAga2V5ID0gbW9kS2V5Q29tYm9FdmVudC5rZXlcbiAgICAgICAgY29tYm8gPSBtb2RLZXlDb21ib0V2ZW50LmNvbWJvXG4gICAgICAgIGV2ZW50ID0gbW9kS2V5Q29tYm9FdmVudC5ldmVudFxuXG4gICAgICAgIGlmIChfa18uZW1wdHkoY29tYm8pKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ3VuaGFuZGxlZCdcbiAgICAgICAgfVxuICAgICAgICBtZW51ID0gdGhpcy50ZW1wbGF0ZUNhY2hlXG4gICAgICAgIGlmIChfa18uZW1wdHkobWVudSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBtZW51JylcbiAgICAgICAgICAgIHJldHVybiAndW5oYW5kbGVkJ1xuICAgICAgICB9XG4gICAgICAgIGFjY2VscyA9IHNkcy5maW5kLmtleShtZW51LCdhY2NlbCcpXG4gICAgICAgIGNvbWJvcyA9IHNkcy5maW5kLmtleShtZW51LCdjb21ibycpXG4gICAgICAgIHZhciBsaXN0ID0gX2tfLmxpc3QoY29tYm9zLmNvbmNhdChhY2NlbHMpKVxuICAgICAgICBmb3IgKHZhciBfMjUxXzIwXyA9IDA7IF8yNTFfMjBfIDwgbGlzdC5sZW5ndGg7IF8yNTFfMjBfKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGtleXBhdGggPSBsaXN0W18yNTFfMjBfXVxuICAgICAgICAgICAgY29tYm9zID0gc2RzLmdldChtZW51LGtleXBhdGgpLnNwbGl0KCcgJylcbiAgICAgICAgICAgIGNvbWJvcyA9IGNvbWJvcy5tYXAoZnVuY3Rpb24gKGMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleWluZm8uY29udmVydENtZEN0cmwoYylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoX2tfLmluKGNvbWJvLGNvbWJvcykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5cGF0aC5wb3AoKVxuICAgICAgICAgICAgICAgIGl0ZW0gPSBzZHMuZ2V0KG1lbnUsa2V5cGF0aClcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAoKF8yNTdfMzdfPWl0ZW0uYWN0aW9uKSAhPSBudWxsID8gXzI1N18zN18gOiBpdGVtLnRleHQpXG4gICAgICAgICAgICAgICAgcG9zdC5lbWl0KCdtZW51QWN0aW9uJyxhY3Rpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndW5oYW5kbGVkJ1xuICAgIH1cblxuICAgIHJldHVybiBUaXRsZVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBUaXRsZTsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rX1xuXG52YXIgJCwgc3RvcEV2ZW50LCBXaW5kb3dcblxuaW1wb3J0IGRvbSBmcm9tICcuL2RvbS5qcydcbmltcG9ydCBlbGVtIGZyb20gJy4vZWxlbS5qcydcbmltcG9ydCBwb3N0IGZyb20gJy4vcG9zdC5qcydcbmltcG9ydCBrZXlpbmZvIGZyb20gJy4va2V5aW5mby5qcydcbmltcG9ydCBUaXRsZSBmcm9tICcuL3RpdGxlLmpzJ1xuJCA9IGRvbS4kXG5zdG9wRXZlbnQgPSBkb20uc3RvcEV2ZW50XG5cblxuV2luZG93ID0gKGZ1bmN0aW9uICgpXG57XG4gICAgZnVuY3Rpb24gV2luZG93ICgpXG4gICAge1xuICAgICAgICB2YXIgbWFpblxuXG4gICAgICAgIHRoaXNbXCJvbktleVVwXCJdID0gdGhpc1tcIm9uS2V5VXBcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25LZXlEb3duXCJdID0gdGhpc1tcIm9uS2V5RG93blwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXNbXCJvbk1lbnVBY3Rpb25cIl0gPSB0aGlzW1wib25NZW51QWN0aW9uXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uV2luZG93Qmx1clwiXSA9IHRoaXNbXCJvbldpbmRvd0JsdXJcIl0uYmluZCh0aGlzKVxuICAgICAgICB0aGlzW1wib25XaW5kb3dGb2N1c1wiXSA9IHRoaXNbXCJvbldpbmRvd0ZvY3VzXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcIm9uUmVzaXplXCJdID0gdGhpc1tcIm9uUmVzaXplXCJdLmJpbmQodGhpcylcbiAgICAgICAgdGhpc1tcImFuaW1hdGVcIl0gPSB0aGlzW1wiYW5pbWF0ZVwiXS5iaW5kKHRoaXMpXG4gICAgICAgIHBvc3Qub24oJ21lbnVBY3Rpb24nLHRoaXMub25NZW51QWN0aW9uKVxuICAgICAgICBwb3N0Lm9uKCd3aW5kb3cuYmx1cicsdGhpcy5vbldpbmRvd0JsdXIpXG4gICAgICAgIHBvc3Qub24oJ3dpbmRvdy5mb2N1c2QnLHRoaXMub25XaW5kb3dGb2N1cylcbiAgICAgICAgd2luZG93LnRpdGxlYmFyID0gbmV3IFRpdGxlKHtpY29uOmtha2FvLmJ1bmRsZS5pbWcoJ21lbnUucG5nJyksbWVudTprYWthby5idW5kbGUucmVzKCdtZW51Lm5vb24nKX0pXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLm9uS2V5RG93bilcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyx0aGlzLm9uS2V5VXApXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLHRoaXMub25SZXNpemUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlKVxuICAgICAgICBtYWluID0gJCgnbWFpbicpXG4gICAgICAgIG1haW4uZm9jdXMoKVxuICAgICAgICBrYWthby5yZXF1ZXN0KCd3aW5kb3cuaWQnKS50aGVuKChmdW5jdGlvbiAoaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtKHtjbGFzczondGVzdCcsdGV4dDpgd2luZG93LmlkICR7aWR9YCxwYXJlbnQ6bWFpbn0pXG4gICAgICAgIH0pLmJpbmQodGhpcykpXG4gICAgfVxuXG4gICAgV2luZG93LnByb3RvdHlwZVtcImFuaW1hdGVcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgdmFyIGRlbHRhLCBmcHMsIG5vd1xuXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlKVxuICAgICAgICBub3cgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICAgICAgZGVsdGEgPSAobm93IC0gdGhpcy5sYXN0QW5pbWF0aW9uVGltZSlcbiAgICAgICAgdGhpcy5sYXN0QW5pbWF0aW9uVGltZSA9IG5vd1xuICAgICAgICBmcHMgPSBwYXJzZUludCgxMDAwIC8gZGVsdGEpXG4gICAgICAgIGlmIChmcHMgPCAyMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGtha2FvLnNlbmQoXCJ3aW5kb3cuZnJhbWVyYXRlRHJvcFwiLGZwcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFdpbmRvdy5wcm90b3R5cGVbXCJjcmVhdGVXaW5kb3dcIl0gPSBmdW5jdGlvbiAoKVxuICAgIHt9XG5cbiAgICBXaW5kb3cucHJvdG90eXBlW1wib25SZXNpemVcIl0gPSBmdW5jdGlvbiAoZXZlbnQpXG4gICAge31cblxuICAgIFdpbmRvdy5wcm90b3R5cGVbXCJvbldpbmRvd0ZvY3VzXCJdID0gZnVuY3Rpb24gKClcbiAgICB7fVxuXG4gICAgV2luZG93LnByb3RvdHlwZVtcIm9uV2luZG93Qmx1clwiXSA9IGZ1bmN0aW9uICgpXG4gICAge31cblxuICAgIFdpbmRvdy5wcm90b3R5cGVbXCJvbk1lbnVBY3Rpb25cIl0gPSBmdW5jdGlvbiAoYWN0aW9uKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21lbnVBY3Rpb24nLGFjdGlvbilcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udG9Mb3dlckNhc2UoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnZm9jdXMgbmV4dCc6XG4gICAgICAgICAgICAgICAga2FrYW8uc2VuZCgnd2luZG93LmZvY3VzTmV4dCcpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzIHByZXZpb3VzJzpcbiAgICAgICAgICAgICAgICBrYWthby5zZW5kKCd3aW5kb3cuZm9jdXNQcmV2JylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnbmV3IHdpbmRvdyc6XG4gICAgICAgICAgICAgICAga2FrYW8uc2VuZCgnd2luZG93Lm5ldycpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ21heGltaXplJzpcbiAgICAgICAgICAgICAgICBrYWthby5zZW5kKCd3aW5kb3cubWF4aW1pemUnKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdtaW5pbWl6ZSc6XG4gICAgICAgICAgICAgICAga2FrYW8uc2VuZCgnd2luZG93Lm1pbmltaXplJylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NyZWVuc2hvdCc6XG4gICAgICAgICAgICAgICAga2FrYW8uc2VuZCgnd2luZG93LnNuYXBzaG90JylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICAgICAgICAgIGtha2FvLnNlbmQoJ3dpbmRvdy5jbG9zZScpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XG4gICAgICAgICAgICAgICAga2FrYW8uc2VuZCgnd2luZG93LnJlbG9hZCcpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3F1aXQnOlxuICAgICAgICAgICAgICAgIGtha2FvLnNlbmQoJ2FwcC5xdWl0JylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYWJvdXQnOlxuICAgICAgICAgICAgICAgIGtha2FvLnNlbmQoJ3dpbmRvdy5uZXcnLCdhYm91dC5odG1sJylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDBcbiAgICB9XG5cbiAgICBXaW5kb3cucHJvdG90eXBlW1wib25LZXlEb3duXCJdID0gZnVuY3Rpb24gKGV2ZW50KVxuICAgIHtcbiAgICAgICAgdmFyIGluZm9cblxuICAgICAgICBzdG9wRXZlbnQoZXZlbnQpXG4gICAgICAgIGluZm8gPSBrZXlpbmZvLmZvckV2ZW50KGV2ZW50KVxuICAgICAgICBpbmZvLmV2ZW50ID0gZXZlbnRcbiAgICAgICAgaWYgKCd1bmhhbmRsZWQnID09PSB3aW5kb3cudGl0bGViYXIuaGFuZGxlS2V5SW5mbyhpbmZvKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2tleWRvd24nLGluZm8pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXaW5kb3cucHJvdG90eXBlW1wib25LZXlVcFwiXSA9IGZ1bmN0aW9uIChldmVudClcbiAgICB7XG4gICAgICAgIHZhciBpbmZvXG5cbiAgICAgICAgaW5mbyA9IGtleWluZm8uZm9yRXZlbnQoZXZlbnQpXG4gICAgICAgIHJldHVybiBpbmZvLmV2ZW50ID0gZXZlbnRcbiAgICB9XG5cbiAgICByZXR1cm4gV2luZG93XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFdpbmRvdzsiLAogICIvLyBtb25zdGVya29kaS9rb2RlIDAuMjU2LjBcblxudmFyIF9rX1xuXG5pbXBvcnQgZG9tIGZyb20gJy4vZG9tLmpzJ1xuaW1wb3J0IGVsZW0gZnJvbSAnLi9lbGVtLmpzJ1xuaW1wb3J0IHBvc3QgZnJvbSAnLi9wb3N0LmpzJ1xuaW1wb3J0IHdpbiBmcm9tICcuL3dpbi5qcydcbmV4cG9ydCBkZWZhdWx0IHt3aW46d2luLGRvbTpkb20sZWxlbTplbGVtLHBvc3Q6cG9zdH07IiwKICAiLy8gbW9uc3RlcmtvZGkva29kZSAwLjI1Ni4wXG5cbnZhciBfa19cblxudmFyIEtha2FvXG5cbmltcG9ydCBidW5kbGUgZnJvbSAnLi9idW5kbGUuanMnXG5pbXBvcnQga3hrIGZyb20gJy4va3hrL2t4ay5qcydcblxuS2FrYW8gPSAoZnVuY3Rpb24gKClcbntcbiAgICBmdW5jdGlvbiBLYWthbyAoKVxuICAgIHt9XG5cbiAgICBLYWthb1tcImluaXRcIl0gPSBmdW5jdGlvbiAoY2IpXG4gICAge1xuICAgICAgICByZXR1cm4gS2FrYW8ucmVxdWVzdCgnYnVuZGxlLnBhdGgnKS50aGVuKGZ1bmN0aW9uIChidW5kbGVQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBidW5kbGUucGF0aCA9IGJ1bmRsZVBhdGhcbiAgICAgICAgICAgIHJldHVybiBjYihidW5kbGVQYXRoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIEtha2FvW1wic2VuZFwiXSA9IGZ1bmN0aW9uIChyb3V0ZSwgLi4uYXJncylcbiAgICB7XG4gICAgICAgIHJldHVybiB3aW5kb3cud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy5rYWthby5wb3N0TWVzc2FnZSh7cm91dGU6cm91dGUsYXJnczphcmdzfSlcbiAgICB9XG5cbiAgICBLYWthb1tcInJlcXVlc3RcIl0gPSBmdW5jdGlvbiAocm91dGUsIC4uLmFyZ3MpXG4gICAge1xuICAgICAgICByZXR1cm4gd2luZG93LndlYmtpdC5tZXNzYWdlSGFuZGxlcnMua2FrYW9fcmVxdWVzdC5wb3N0TWVzc2FnZSh7cm91dGU6cm91dGUsYXJnczphcmdzfSlcbiAgICB9XG5cbiAgICBLYWthb1tcInJlY2VpdmVcIl0gPSBmdW5jdGlvbiAobXNnKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGt4ay5wb3N0LmVtaXQobXNnKVxuICAgIH1cblxuICAgIEtha2FvW1wiYnVuZGxlXCJdID0gYnVuZGxlXG4gICAgS2FrYW9bXCJ3aW5kb3dcIl0gPSBreGsud2luXG4gICAgS2FrYW9bXCJkb21cIl0gPSBreGsuZG9tXG4gICAgS2FrYW9bXCJwb3N0XCJdID0ga3hrLnBvc3RcbiAgICByZXR1cm4gS2FrYW9cbn0pKClcblxud2luZG93Lmtha2FvID0gS2FrYW9cbmV4cG9ydCBkZWZhdWx0IEtha2FvOyIsCiAgIi8vIG1vbnN0ZXJrb2RpL2tvZGUgMC4yNTYuMFxuXG52YXIgX2tfXG5cbmltcG9ydCBrYWthbyBmcm9tICcuL2xpYi9rYWthby5qcydcbmtha2FvLmluaXQoZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gbmV3IGtha2FvLndpbmRvd1xufSkiCiAgXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlJLElBa0JXO0FBQUE7QUFmZixlQUFlLEdBQ2Y7QUFDSSxhQUFTLEdBQUcsR0FDWjtBQUFBO0FBRUEsUUFBRyxxQkFBc0IsR0FDekI7QUFDSSxhQUFPO0FBQUE7QUFHWCxRQUFHLGNBQWM7QUFDakIsUUFBRyxXQUFXLElBQUcsYUFBYTtBQUM5QixXQUFPO0FBQUEsSUFDUjtBQUVILEVBQWU7QUFBQTs7Ozs7Ozs7Ozs7SUN0QlgsR0FBb0IsR0FBNEIsR0FBc0MsR0FBaUMsR0FBd0IsR0FBc0MsR0FBMEQsR0FBMEQsR0FBeUssR0FBa0QsR0FBeUcsR0FBMmxJLEdBQTBDO0FBQUE7QUFBdHZKLEVBQUksSUFBRSxPQUFPO0FBQU8sRUFBSSxJQUFFLE9BQU87QUFBZSxFQUFJLElBQUUsT0FBTztBQUF5QixFQUFJLElBQUUsT0FBTztBQUFvQixFQUFJLElBQUUsT0FBTztBQUFiLEVBQTRCLElBQUUsT0FBTyxVQUFVO0FBQWUsRUFBSSxJQUFFLENBQUMsR0FBRSxNQUFJLE9BQUssS0FBRyxHQUFHLElBQUUsRUFBQyxTQUFRLENBQUMsRUFBQyxHQUFHLFNBQVEsQ0FBQyxHQUFFLEVBQUU7QUFBckQsRUFBOEQsSUFBRSxDQUFDLEdBQUUsTUFBSTtBQUFDLGFBQVEsS0FBSztBQUFFLFFBQUUsR0FBRSxHQUFFLEVBQUMsS0FBSSxFQUFFLElBQUcsWUFBVyxLQUFFLENBQUM7QUFBQTtBQUFySCxFQUF3SCxJQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsTUFBSTtBQUFDLFFBQUcs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LEdBQUUsR0FBRTtBQUFDLFVBQUcsRUFBRSxDQUFDLEdBQUUsRUFBRSxDQUFDLEdBQUUsTUFBSSxNQUFJLElBQUUsRUFBRSxRQUFRLENBQUMsR0FBRSxJQUFFLEVBQUUsUUFBUSxDQUFDLEdBQUUsTUFBSTtBQUFHLGVBQU07QUFBRyxlQUFRLElBQUUsRUFBRSxJQUFFLEVBQUUsVUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFJLE1BQUs7QUFBQTtBQUFHLGVBQVEsSUFBRSxFQUFFLFFBQU8sSUFBRSxJQUFFLEdBQUUsSUFBRSxFQUFFLElBQUUsRUFBRSxVQUFRLEVBQUUsV0FBVyxDQUFDLE1BQUksTUFBSztBQUFBO0FBQUcsZUFBUSxJQUFFLEVBQUUsUUFBTyxJQUFFLElBQUUsR0FBRSxJQUFFLElBQUUsSUFBRSxJQUFFLEdBQUUsS0FBRSxHQUFHLElBQUUsRUFBRSxLQUFHLEtBQUksR0FBRTtBQUFDLFlBQUcsTUFBSSxHQUFFO0FBQUMsY0FBRyxJQUFFLEdBQUU7QUFBQyxnQkFBRyxFQUFFLFdBQVcsSUFBRSxDQUFDLE1BQUk7QUFBRyxxQkFBTyxFQUFFLE1BQU0sSUFBRSxJQUFFLENBQUM7QUFBRSxnQkFBRyxNQUFJO0FBQUUscUJBQU8sRUFBRSxNQUFNLElBQUUsQ0FBQztBQUFBLFVBQUM7QUFBTSxnQkFBRSxNQUFJLEVBQUUsV0FBVyxJQUFFLENBQUMsTUFBSSxLQUFHLElBQUUsSUFBRSxNQUFJLE1BQUksSUFBRTtBQUFJO0FBQUEsUUFBSztBQUFDLFlBQUksSUFBRSxFQUFFLFdBQVcsSUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLFdBQVcsSUFBRSxDQUFDO0FBQUUsWUFBRyxNQUFJO0FBQUU7QUFBTSxjQUFJLE9BQUssSUFBRTtBQUFBLE1BQUU7QUFBQyxVQUFJLElBQUU7QUFBRyxXQUFJLElBQUUsSUFBRSxJQUFFLEVBQUUsS0FBRyxLQUFJO0FBQUUsU0FBQyxNQUFJLEtBQUcsRUFBRSxXQUFXLENBQUMsTUFBSSxRQUFNLEVBQUUsV0FBUyxJQUFFLEtBQUcsT0FBSyxLQUFHO0FBQU8sYUFBTyxFQUFF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LEdBQUUsQ0FBQztBQUFBLE9BQUcsZ0JBQWUsQ0FBQyxHQUFFO0FBQUMsVUFBRyxNQUFJLGVBQWEsS0FBRztBQUFTLGNBQU0sSUFBSSxVQUFVLDRFQUEwRSxDQUFDO0FBQUUsYUFBTyxFQUFFLEtBQUksQ0FBQztBQUFBLE9BQUcsZUFBYyxDQUFDLEdBQUU7QUFBQyxRQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsRUFBQyxNQUFLLElBQUcsS0FBSSxJQUFHLE1BQUssSUFBRyxLQUFJLElBQUcsTUFBSyxHQUFFO0FBQUUsVUFBRyxFQUFFLFdBQVM7QUFBRSxlQUFPO0FBQUUsVUFBSSxJQUFFLEVBQUUsV0FBVyxDQUFDLEdBQUUsSUFBRSxNQUFJLElBQUc7QUFBRSxXQUFHLEVBQUUsT0FBSyxLQUFJLElBQUUsS0FBRyxJQUFFO0FBQUUsZUFBUSxLQUFFLEdBQUcsSUFBRSxHQUFFLEtBQUUsR0FBRyxJQUFFLE1BQUcsSUFBRSxFQUFFLFNBQU8sR0FBRSxJQUFFLEVBQUUsS0FBRyxLQUFJLEdBQUU7QUFBQyxZQUFHLElBQUUsRUFBRSxXQUFXLENBQUMsR0FBRSxNQUFJLElBQUc7QUFBQyxlQUFJLEdBQUU7QUFBQyxnQkFBRSxJQUFFO0FBQUU7QUFBQSxVQUFLO0FBQUM7QUFBQSxRQUFRO0FBQUMsZUFBSSxNQUFLLElBQUUsT0FBRyxJQUFFLElBQUUsSUFBRyxNQUFJLEtBQUcsT0FBSSxJQUFHLElBQUUsSUFBRSxNQUFJLE1BQUksSUFBRSxLQUFHLE9BQUksTUFBSyxLQUFFO0FBQUEsTUFBRztBQUFDLGFBQU8sT0FBSSxLQUFJLE9BQUksS0FBSSxNQUFJLEtBQUcsTUFBSSxLQUFHLE1BQUksSUFBRSxLQUFHLE1BQUksSUFBRSxJQUFFLE9BQUksTUFBSyxNQUFJLEtBQUcsSUFBRSxFQUFFLE9BQUssRUFBRSxPQUFLLEVBQUUsTUFBTSxHQUFFLENBQUMsSUFBRSxFQUFFLE9BQUssRUFBRSxPQUFLLEVBQUUsTUFBTSxHQUFFLENBQUMsTUFBSSxNQUFJLEtBQUcsS0FBRyxFQUFFLE9BQUssRUFBRSxNQUFNLEdBQUUsQ0FBQyxHQUFFLEVBQUUsT0FBSyxFQUFFLE1BQU0sR0FBRSxDQUFDLE1BQUksRUFBRSxPQUFLLEVBQUUsTUFBTSxHQUFFLENBQUMsR0FBRSxFQUFFLE9BQUssRUFBRSxNQUFNLEdBQUUsQ0FBQyxJQUFHLEVBQUUsTUFBSSxFQUFFLE1BQU0sR0FBRSxDQUFDLElBQUcsSUFBRSxJQUFFLEVBQUUsTUFBSSxFQUFFLE1BQU0sR0FBRSxJQUFFLENBQUMsSUFBRSxNQUFJLEVBQUUsTUFBSSxNQUFLO0FBQUEsT0FBRyxLQUFJLEtBQUksV0FBVSxLQUFJLE9BQU0sTUFBSyxPQUFNLEtBQUk7QUFBRSxNQUFFLFFBQU07QUFBRSxNQUFFLFVBQVE7QUFBQSxHQUFFO0FBQUUsRUFBSSxJQUFFLENBQUM7QUFBRSxJQUFFLEdBQUUsRUFBQyxTQUFRLE1BQUksRUFBQyxDQUFDO0FBQUUsSUFBRSxHQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFBRSxFQUFJLElBQUUsRUFBRSxFQUFFLENBQUM7QUFBQTs7O0lDSW5vSixVQXFKM0c7QUFBQTtBQW5KZjtBQUNBLGFBQVc7QUFDWCxNQUFJLE9BQ0o7QUFBQSxFQStJQTtBQUNBLEVBQWU7QUFBQTs7Ozs7Ozs7Ozs7QUNsSmY7QUFBQSxJQUxJLE1BRUEsU0FBUyxTQThCRTtBQUFBO0FBNUJmO0FBSkEsRUFBSSxPQUFNLEVBQUMsY0FBZSxDQUFDLEdBQUc7QUFBQyxXQUFPLEtBQUssY0FBYyxFQUFFLFdBQVcsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQUEsSUFBRTtBQU83RixZQUFVLGNBQWUsQ0FBQyxLQUFLLE9BQy9CO0FBQ0ksUUFBSSxTQUFTLE1BQU0sT0FBTyxPQUFPO0FBRWpDLFlBQVEsTUFBTSxJQUFHLFFBQVEsR0FBRztBQUM1QixRQUFJLE9BQU8sS0FBSSxLQUFLLEtBQUs7QUFDekIsYUFBUyxVQUFVLEVBQUcsVUFBVSxLQUFLLFFBQVEsV0FDN0M7QUFDSSxhQUFPLEtBQUs7QUFDWixhQUFPLE1BQU0sSUFBRyxLQUFLLGNBQU0sS0FBSyxLQUFJLElBQUksQ0FBQztBQUN6QyxjQUFRLEtBQUssT0FBTztBQUNwQixnQkFBVSxNQUFNLE1BQU07QUFDdEIsWUFBTSxLQUFLLEVBQUMsTUFBTSxRQUFRLFFBQVEsUUFBUSxNQUFLLE1BQUssTUFBSyxRQUFPLENBQUM7QUFDakUsVUFBSSxPQUNKO0FBQ0ksY0FBTSxRQUFRLFNBQVEsS0FBSztBQUFBLE1BQy9CO0FBQUEsSUFDSjtBQUNBLFdBQU87QUFBQTtBQUdYLFlBQVUsY0FBZSxDQUFDLFNBQzFCO0FBQ0ksV0FBTyxNQUFNLFFBQVEsU0FBUSxDQUFDLENBQUM7QUFBQTtBQUVuQyxFQUFlO0FBQUE7OztJQ2hDWCxNQUVBLE9BOHpCVztBQUFBO0FBNXpCZjtBQUNBO0FBTEEsRUFBSSxPQUFNLEVBQUMsWUFBYSxDQUFDLEdBQUUsR0FBRztBQUFDLG1CQUFlLE1BQU0sbUJBQW1CLE1BQU0sWUFBWSxFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUUsQ0FBQyxLQUFLO0FBQUEsS0FBSSxjQUFlLENBQUMsR0FBRztBQUFDLFdBQU8sS0FBSyxjQUFjLEVBQUUsV0FBVyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7QUFBQSxLQUFJLGdCQUFpQixDQUFDLEdBQUc7QUFBQyxrQkFBYyxNQUFNO0FBQUEsSUFBVztBQU8vUSxrQkFBa0IsR0FDbEI7QUFDSSxhQUFTLE1BQU0sR0FDZjtBQUFBO0FBRUEsV0FBTSxlQUFlO0FBQ3JCLFdBQU0sa0JBQW1CLENBQUMsR0FDMUI7QUFDSSxXQUFLLEdBQ0w7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksYUFBSyxVQUFVLENBQUM7QUFDcEIsV0FBSyxHQUNMO0FBQ0ksZ0JBQVEsSUFBSSxXQUFVLENBQUM7QUFDdkIsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJLEVBQUUsU0FBUyxJQUFJLEtBQUssRUFBRSxXQUFXLEdBQ3JDO0FBQ0ksWUFBSSxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQUEsTUFDcEI7QUFDQSxVQUFJLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxXQUFXLEdBQ3BDO0FBQ0ksWUFBSSxJQUFJO0FBQUEsTUFDWjtBQUNBLGFBQU87QUFBQTtBQUdYLFdBQU0scUJBQXNCLENBQUMsR0FDN0I7QUFDSSxVQUFJO0FBRUosVUFBSSxPQUFNLEtBQUssQ0FBQztBQUNoQixVQUFJLE9BQU0sSUFBSSxHQUNkO0FBQ0ksWUFBSSxFQUFFLFVBQVUsTUFBTSxFQUFFLE9BQU8sT0FBZSxFQUFFLE9BQVYsTUFDdEM7QUFDSSxjQUFJLEVBQUUsS0FBSyxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQUEsUUFDOUI7QUFDQSxjQUFNLElBQUksT0FBTyxLQUFJLEdBQUc7QUFDeEIsWUFBSSxFQUFFLFFBQVEsS0FBSSxJQUFJO0FBQ3RCLFlBQUksRUFBRSxPQUFPLEtBQ2I7QUFDSSxjQUFJLEVBQUUsR0FBRyxZQUFZLElBQUksRUFBRSxNQUFNLENBQUM7QUFBQSxRQUN0QztBQUFBLE1BQ0o7QUFDQSxhQUFPO0FBQUE7QUFHWCxXQUFNLHFCQUFzQixDQUFDLEdBQzdCO0FBQ0ksWUFBTSxLQUFLLE9BQU8sRUFBRSxTQUFTLFlBQzdCO0FBQ0ksWUFBSSxRQUFRLElBQUk7QUFBQSxNQUNwQjtBQUNBLFVBQUksVUFBVSxTQUFTLEdBQ3ZCO0FBQ0ksWUFBSSxPQUFNLEtBQUssTUFBTSxHQUFFLFNBQVM7QUFBQSxNQUNwQztBQUNBLFVBQUksT0FBTSxNQUFNLE9BQU0sUUFBUSxDQUFDLENBQUM7QUFDaEMsVUFBSSxPQUFNLFdBQVcsQ0FBQyxHQUN0QjtBQUNJLFlBQUksT0FBTSxLQUFLLGFBQUssUUFBUSxDQUFDLENBQUM7QUFBQSxNQUNsQyxPQUVBO0FBQ0ksWUFBSSxPQUFNLEtBQUssQ0FBQztBQUFBO0FBRXBCLGFBQU87QUFBQTtBQUdYLFdBQU0sbUJBQW9CLENBQUMsR0FDM0I7QUFDSSxhQUFPLE9BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsZUFBZ0IsQ0FBQyxHQUNqRDtBQUNJLGVBQU8sRUFBRTtBQUFBLE9BQ1o7QUFBQTtBQUdMLFdBQU0sd0JBQXlCLENBQUMsR0FDaEM7QUFDSSxVQUFJLFVBQVUsUUFBUTtBQUV0QixVQUFJLE9BQU0sS0FBSyxDQUFDO0FBQ2hCLGVBQVMsT0FBTSxNQUFNLENBQUM7QUFDdEIsYUFBTyxPQUFPO0FBQ2QsVUFBSSxLQUFLLFNBQVMsR0FDbEI7QUFDSSxZQUFJLEVBQUUsU0FBUyxLQUFLLFFBQ3BCO0FBQ0kscUJBQVcsRUFBRSxNQUFNLEtBQUssU0FBUyxDQUFDO0FBQUEsUUFDdEMsT0FFQTtBQUNJLHFCQUFXO0FBQUE7QUFFZixlQUFPLENBQUMsVUFBUyxLQUFLLE1BQU0sR0FBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQUEsTUFDbEQsV0FDUyxPQUFPLElBQUksU0FBUyxHQUM3QjtBQUNJLFlBQUksT0FBTyxJQUFJLE9BQU8sS0FDdEI7QUFDSSxpQkFBTyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUUsT0FBTyxJQUFJLEVBQUU7QUFBQSxRQUNwQztBQUFBLE1BQ0osV0FDUyxPQUFPLEtBQUssV0FBVyxHQUNoQztBQUNJLFlBQUksT0FBTyxLQUFLLE9BQU8sS0FDdkI7QUFDSSxpQkFBTyxDQUFDLEtBQUksT0FBTyxLQUFLLEVBQUU7QUFBQSxRQUM5QjtBQUFBLE1BQ0o7QUFDQSxhQUFPLENBQUMsT0FBTSxLQUFLLENBQUMsR0FBRSxFQUFFO0FBQUE7QUFHNUIsV0FBTSx5QkFBMEIsQ0FBQyxHQUNqQztBQUNJLGFBQU8sT0FBTSxXQUFXLENBQUMsRUFBRTtBQUFBO0FBRy9CLFdBQU0sb0JBQXFCLENBQUMsR0FDNUI7QUFDSSxhQUFPLE9BQU0sWUFBWSxDQUFDLE1BQU07QUFBQTtBQUdwQyxXQUFNLDJCQUE0QixDQUFDLEdBQ25DO0FBQ0ksVUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTTtBQUU1QixVQUFJLFdBQVcsT0FBTSxXQUFXLENBQUM7QUFBRyxVQUFJLFNBQVM7QUFBSSxVQUFJLFNBQVM7QUFFbEUsY0FBUSxPQUFPLENBQUMsRUFBRSxNQUFNLEdBQUc7QUFDM0IsVUFBSSxNQUFNLFNBQVMsR0FDbkI7QUFDSSxlQUFPLFNBQVMsTUFBTSxFQUFFO0FBQUEsTUFDNUI7QUFDQSxVQUFJLE1BQU0sU0FBUyxHQUNuQjtBQUNJLGVBQU8sU0FBUyxNQUFNLEVBQUU7QUFBQSxNQUM1QjtBQUNBLFVBQUksSUFBSTtBQUNSLFVBQUksT0FBTyxVQUFVLElBQUksR0FDekI7QUFDSSxZQUFJO0FBQUEsTUFDUjtBQUNBLFVBQUksT0FBTyxVQUFVLElBQUksR0FDekI7QUFDSSxZQUFJO0FBQUEsTUFDUjtBQUNBLFVBQUksTUFBTSxJQUNWO0FBQ0ksWUFBSSxJQUFJO0FBQUEsTUFDWjtBQUNBLGFBQU8sQ0FBQyxJQUFJLE1BQU0sSUFBRyxLQUFLLElBQUksR0FBRSxDQUFDLEdBQUUsS0FBSyxJQUFJLEdBQUUsQ0FBQyxDQUFDO0FBQUE7QUFHcEQsV0FBTSwwQkFBMkIsQ0FBQyxHQUNsQztBQUNJLFVBQUksR0FBRyxHQUFHO0FBRVYsVUFBSSxXQUFXLE9BQU0sY0FBYyxDQUFDO0FBQUcsVUFBSSxTQUFTO0FBQUksVUFBSSxTQUFTO0FBQUksVUFBSSxTQUFTO0FBRXRGLGFBQU8sQ0FBQyxHQUFFLENBQUMsR0FBRSxJQUFJLENBQUMsQ0FBQztBQUFBO0FBR3ZCLFdBQU0sMkJBQTRCLENBQUMsR0FDbkM7QUFDSSxhQUFPLE9BQU0sY0FBYyxDQUFDLEVBQUU7QUFBQTtBQUdsQyxXQUFNLDBCQUEyQixDQUFDLEdBQ2xDO0FBQ0ksVUFBSSxHQUFHO0FBRVAsVUFBSSxXQUFXLE9BQU0sY0FBYyxDQUFDO0FBQUcsVUFBSSxTQUFTO0FBQUksVUFBSSxTQUFTO0FBRXJFLFVBQUksSUFBSSxHQUNSO0FBQ0ksZUFBTyxJQUFJLE1BQU07QUFBQSxNQUNyQixPQUVBO0FBQ0ksZUFBTztBQUFBO0FBQUE7QUFJZixXQUFNLGlCQUFrQixDQUFDLEdBQ3pCO0FBQ0ksYUFBTyxhQUFLLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUFBO0FBR2xDLFdBQU0sc0JBQXVCLENBQUMsR0FDOUI7QUFDSSxhQUFPLENBQUMsT0FBTSxVQUFVLENBQUMsR0FBRSxPQUFNLElBQUksQ0FBQyxDQUFDO0FBQUE7QUFHM0MsV0FBTSx1QkFBd0IsQ0FBQyxHQUMvQjtBQUNJLGFBQU8sT0FBTSxLQUFLLE9BQU0sSUFBSSxDQUFDLEdBQUUsT0FBTSxLQUFLLENBQUMsQ0FBQztBQUFBO0FBR2hELFdBQU0scUJBQXNCLENBQUMsR0FBRyxLQUNoQztBQUNJLGFBQU8sT0FBTSxVQUFVLENBQUMsS0FBSyxJQUFJLFdBQVcsR0FBRyxLQUFLLE9BQU8sSUFBSTtBQUFBO0FBR25FLFdBQU0sa0JBQW1CLEdBQ3pCO0FBQ0ksYUFBTyxPQUFNLEtBQUssQ0FBQyxFQUFFLElBQUksS0FBSyxXQUFVLE9BQU0sSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDO0FBQUE7QUFHakUsV0FBTSx5QkFBMEIsQ0FBQyxNQUFNLEtBQ3ZDO0FBQ0ksYUFBTyxPQUFNLGNBQWMsSUFBSTtBQUMvQixZQUFNLE9BQU8sV0FBVyxJQUFJLE1BQU0sU0FBVSxJQUFJLE9BQU8sSUFBSSxNQUFNLElBQUksT0FBTyxHQUM1RTtBQUNJLGVBQU87QUFBQSxNQUNYLFdBQ1MsSUFBSSxJQUNiO0FBQ0ksZUFBTyxPQUFPLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSTtBQUFBLE1BQ3hDLE9BRUE7QUFDSSxlQUFPLE9BQU8sSUFBSSxJQUFJLEtBQUs7QUFBQTtBQUFBO0FBSW5DLFdBQU0sMEJBQTJCLENBQUMsTUFBTSxNQUFNLEtBQzlDO0FBQ0ksYUFBTyxPQUFNLGNBQWMsSUFBSTtBQUMvQixXQUFLLE1BQ0w7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLFdBQUssS0FDTDtBQUNJLGVBQU8sR0FBRyxRQUFRO0FBQUEsTUFDdEI7QUFDQSxhQUFPLEdBQUcsUUFBUSxRQUFRO0FBQUE7QUFHOUIsV0FBTSxxQkFBc0IsQ0FBQyxHQUFHLEtBQUssSUFDckM7QUFDSSxhQUFPLEtBQUssS0FBSyxHQUFFLEtBQUksRUFBRTtBQUFBO0FBRzdCLFdBQU0sa0JBQW1CLENBQUMsR0FBRyxLQUFLLElBQ2xDO0FBQ0ksNkRBQTRCLEdBQUUsS0FBSSxFQUFFO0FBQUE7QUFHeEMsV0FBTSxzQkFBdUIsQ0FBQyxHQUM5QjtBQUNJLFVBQUk7QUFFSixZQUFNLEtBQUssT0FBTyxFQUFFLFNBQVMsWUFDN0I7QUFDSSxlQUFNLE1BQU0sNEJBQTRCO0FBQ3hDLGVBQU8sQ0FBQztBQUFBLE1BQ1o7QUFDQSxVQUFJLE9BQU0sVUFBVSxDQUFDO0FBQ3JCLFVBQUksRUFBRSxTQUFTLEtBQUssRUFBRSxFQUFFLFNBQVMsT0FBTyxPQUFPLEVBQUUsRUFBRSxTQUFTLE9BQU8sS0FDbkU7QUFDSSxZQUFJLEVBQUUsTUFBTSxHQUFHLEVBQUUsU0FBUyxDQUFDO0FBQUEsTUFDL0I7QUFDQSxhQUFPLENBQUMsQ0FBQztBQUNULGFBQU8sT0FBTSxJQUFJLENBQUMsTUFBTSxJQUN4QjtBQUNJLGFBQUssUUFBUSxPQUFNLElBQUksQ0FBQyxDQUFDO0FBQ3pCLFlBQUksT0FBTSxJQUFJLENBQUM7QUFBQSxNQUNuQjtBQUNBLGFBQU87QUFBQTtBQUdYLFdBQU0sa0JBQW1CLENBQUMsR0FDMUI7QUFDSSxhQUFPLGFBQUssU0FBUyxPQUFNLFNBQVMsQ0FBQyxHQUFFLGFBQUssUUFBUSxPQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFBQTtBQUcxRSxXQUFNLGtCQUFtQixDQUFDLEdBQzFCO0FBQ0ksYUFBTyxhQUFLLFNBQVMsT0FBTSxTQUFTLENBQUMsQ0FBQztBQUFBO0FBRzFDLFdBQU0scUJBQXNCLENBQUMsR0FDN0I7QUFDSSxhQUFPLGFBQUssUUFBUSxPQUFNLFNBQVMsQ0FBQyxDQUFDO0FBQUE7QUFHekMsV0FBTSxzQkFBdUIsQ0FBQyxHQUFHLEdBQ2pDO0FBQ0ksYUFBTyxhQUFLLFNBQVMsT0FBTSxTQUFTLENBQUMsR0FBRSxDQUFDO0FBQUE7QUFHNUMsV0FBTSx3QkFBeUIsQ0FBQyxHQUNoQztBQUNJLFVBQUksT0FBTSxTQUFTLENBQUM7QUFDcEIsYUFBTyxFQUFFLE9BQU8sT0FBTyxhQUFLLFdBQVcsQ0FBQztBQUFBO0FBRzVDLFdBQU0sd0JBQXlCLENBQUMsR0FDaEM7QUFDSSxjQUFRLE9BQU0sV0FBVyxDQUFDO0FBQUE7QUFHOUIsV0FBTSxxQkFBc0IsQ0FBQyxHQUM3QjtBQUNJLGFBQU8sT0FBTSxLQUFLLGFBQUssUUFBUSxPQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFBQTtBQUdyRCxXQUFNLHVCQUF3QixDQUFDLEdBQy9CO0FBQ0ksYUFBTyxPQUFNLEtBQUssT0FBTSxTQUFTLENBQUMsQ0FBQztBQUFBO0FBR3ZDLFdBQU0saUJBQWtCLENBQUMsR0FDekI7QUFDSSxVQUFJLE9BQU0sVUFBVSxDQUFDO0FBQ3JCLFVBQUksT0FBTSxPQUFPLENBQUMsR0FDbEI7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksYUFBSyxRQUFRLENBQUM7QUFDbEIsVUFBSSxNQUFNLEtBQ1Y7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksT0FBTSxLQUFLLENBQUM7QUFDaEIsVUFBSSxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQUUsV0FBVyxHQUNwQztBQUNJLGFBQUs7QUFBQSxNQUNUO0FBQ0EsYUFBTztBQUFBO0FBR1gsV0FBTSxzQkFBdUIsQ0FBQyxHQUM5QjtBQUNJLFlBQU0sS0FBSyxPQUFPLEVBQUUsU0FBUyxZQUM3QjtBQUNJLGVBQU8sT0FBTSxNQUFNLDRCQUE0QjtBQUFBLE1BQ25EO0FBQ0EsVUFBSSxFQUFFLE9BQU8sTUFDYjtBQUNJLGVBQU0sTUFBTSw2QkFBNkIsSUFBSTtBQUM3QyxlQUFPLE9BQU0sU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQUEsTUFDckM7QUFDQSxVQUFJLEVBQUUsU0FBUyxJQUFJLEdBQ25CO0FBQ0ksZUFBTSxNQUFNLDhCQUE4QixJQUFJO0FBQzlDLGVBQU8sT0FBTSxTQUFTLEVBQUUsT0FBTyxHQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFBQSxNQUNsRDtBQUNBLGFBQU87QUFBQTtBQUdYLFdBQU0sbUJBQW9CLENBQUMsR0FDM0I7QUFDSSxVQUFJO0FBRUosYUFBTyxhQUFLLE1BQU0sQ0FBQztBQUNuQixVQUFJLEtBQUssSUFBSSxXQUFXLEtBQUssS0FBSyxJQUFJLE9BQU8sS0FDN0M7QUFDSSxhQUFLLE9BQU87QUFBQSxNQUNoQjtBQUNBLFVBQUksS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLEtBQUssT0FBTyxLQUMvQztBQUNJLGFBQUssUUFBUTtBQUFBLE1BQ2pCO0FBQ0EsYUFBTztBQUFBO0FBR1gsV0FBTSxrQkFBbUIsR0FDekI7QUFDSSxhQUFPLE9BQU0sS0FBSyxXQUFHLFFBQVEsQ0FBQztBQUFBO0FBR2xDLFdBQU0sbUJBQW9CLENBQUMsR0FDM0I7QUFDSSxVQUFJO0FBRUosYUFBUSxPQUFNLEtBQUssQ0FBQyxLQUFLLE9BQU8sT0FBTSxLQUFLLENBQUMsRUFBRSxRQUFRLE9BQU0sS0FBSyxHQUFFLEdBQUcsSUFBSTtBQUFBO0FBRzlFLFdBQU0scUJBQXNCLENBQUMsR0FDN0I7QUFDSSxVQUFJO0FBRUosYUFBUSxPQUFNLEtBQUssQ0FBQyxLQUFLLE9BQU8sT0FBTSxLQUFLLENBQUMsRUFBRSxRQUFRLE9BQU0sT0FBTSxLQUFLLENBQUMsSUFBSTtBQUFBO0FBR2hGLFdBQU0sbUJBQW9CLENBQUMsR0FDM0I7QUFDSSxVQUFJLEdBQUcsR0FBRztBQUVWLFVBQUksRUFBRSxRQUFRLEtBQUksQ0FBQztBQUNuQixhQUFPLEtBQUssR0FDWjtBQUNJLGFBQUssS0FBSyxRQUFRLEtBQ2xCO0FBQ0ksY0FBSSxRQUFRLElBQUk7QUFDaEIsY0FBSSxNQUFNLEVBQUUsTUFBTSxJQUFJLEdBQUUsSUFBSSxJQUFJLEVBQUUsTUFBTSxHQUN4QztBQUNJLGdCQUFJLEVBQUUsTUFBTSxHQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsTUFBTSxJQUFJLEVBQUUsU0FBUyxDQUFDO0FBQy9DO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFDQSxZQUFJLEVBQUUsUUFBUSxLQUFJLElBQUksQ0FBQztBQUFBLE1BQzNCO0FBQ0EsYUFBTyxPQUFNLEtBQUssQ0FBQztBQUFBO0FBR3ZCLFdBQU0sc0JBQXVCLENBQUMsS0FBSyxJQUNuQztBQUNJLFVBQUksSUFBSSxJQUFJLElBQUk7QUFFaEIsWUFBTSxNQUFNLE9BQU8sR0FBRyxTQUFTLFlBQy9CO0FBQ0ksYUFBSyxRQUFRLElBQUk7QUFBQSxNQUNyQjtBQUNBLFlBQU0sT0FBTSxRQUFRLEdBQUc7QUFDdkIsV0FBSyxPQUFNLFdBQVcsR0FBRyxHQUN6QjtBQUNJLGVBQU87QUFBQSxNQUNYO0FBQ0EsVUFBSSxPQUFNLFFBQVEsRUFBRSxNQUFNLEtBQzFCO0FBQ0ksZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJLFdBQVcsT0FBTSxXQUFXLEdBQUc7QUFBRyxXQUFLLFNBQVM7QUFBSSxXQUFLLFNBQVM7QUFFdEUsVUFBSSxXQUFXLE9BQU0sV0FBVyxPQUFNLFFBQVEsRUFBRSxDQUFDO0FBQUcsV0FBSyxTQUFTO0FBQUksV0FBSyxTQUFTO0FBRXBGLFVBQUksTUFBTSxNQUFNLE9BQU8sSUFDdkI7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sT0FBTSxLQUFLLGFBQUssU0FBUyxJQUFHLEVBQUUsQ0FBQztBQUFBO0FBRzFDLFdBQU0scUJBQXNCLENBQUMsR0FDN0I7QUFDSSxhQUFPLFdBQVcsT0FBTSxPQUFPLENBQUM7QUFBQTtBQUdwQyxXQUFNLHNCQUF1QixDQUFDLEdBQUcsSUFDakM7QUFDSSxhQUFPLE9BQU0sUUFBUSxDQUFDLE1BQU0sT0FBTSxRQUFRLEVBQUM7QUFBQTtBQUcvQyxXQUFNLG9CQUFxQixDQUFDLEdBQzVCO0FBQ0ksYUFBTyxFQUFFLFFBQVEsYUFBWSxNQUFNO0FBQUE7QUFHdkMsV0FBTSxvQkFBcUIsQ0FBQyxHQUM1QjtBQUNJLFVBQUksVUFBVSxDQUFDO0FBQ2YsVUFBSSxFQUFFLFFBQVEsT0FBTSxLQUFLO0FBQ3pCLFVBQUksRUFBRSxRQUFRLE9BQU0sS0FBSztBQUN6QixhQUFPLElBQUksRUFBRSxRQUFRLE9BQU0sS0FBSztBQUFBO0FBR3BDLFdBQU0saUJBQWtCLENBQUMsR0FDekI7QUFDSSxVQUFJO0FBRUosV0FBTSxLQUFLLE9BQU8sRUFBRSxTQUFTLGNBQWMsTUFDM0M7QUFDSSxlQUFPLEVBQUUsV0FBWSxLQUFJLEdBQUcsT0FBTSxZQUFZLENBQUMsR0FBRSxDQUFDLEtBQUksS0FBSSxFQUFFLENBQUMsR0FDN0Q7QUFDSSxjQUFJLE9BQU0sVUFBVSxPQUFNLEtBQUssR0FBRSxNQUEwRyxDQUFDLEdBQzVJO0FBQ0ksbUJBQU8sT0FBTSxRQUFRLENBQUM7QUFBQSxVQUMxQjtBQUNBLGNBQUksT0FBTSxJQUFJLENBQUM7QUFBQSxRQUNuQjtBQUFBLE1BQ0o7QUFDQSxhQUFPO0FBQUE7QUFHWCxXQUFNLGlCQUFrQixDQUFDLEdBQUcsSUFDNUI7QUFDSSxVQUFJO0FBRUosV0FBTSxLQUFLLE9BQU8sRUFBRSxTQUFTLGNBQWMsTUFDM0M7QUFDSSxtQkFBVyxPQUFRLFlBQ25CO0FBQ0ksaUJBQU0sVUFBVSxPQUFNLEtBQUssR0FBRSxNQUFNLFdBQVcsQ0FBQyxNQUMvQztBQUNJLGdCQUFJLE1BQ0o7QUFDSSxxQkFBTyxHQUFHLE9BQU0sUUFBUSxDQUFDLENBQUM7QUFBQSxZQUM5QixZQUNXLEtBQUksR0FBRyxPQUFNLFlBQVksQ0FBQyxHQUFFLENBQUMsS0FBSSxLQUFJLEVBQUUsQ0FBQyxHQUNuRDtBQUNJLHFCQUFPLE9BQU0sSUFBSSxPQUFNLElBQUksQ0FBQyxHQUFFLEVBQUU7QUFBQSxZQUNwQztBQUFBLFdBQ0g7QUFBQSxRQUNMLE9BRUE7QUFDSSxpQkFBTyxFQUFFLFdBQVksS0FBSSxHQUFHLE9BQU0sWUFBWSxDQUFDLEdBQUUsQ0FBQyxLQUFJLEtBQUksRUFBRSxDQUFDLEdBQzdEO0FBQ0ksZ0JBQUksT0FBTSxVQUFVLE9BQU0sS0FBSyxHQUFFLE1BQU0sQ0FBQyxHQUN4QztBQUNJLHFCQUFPLE9BQU0sUUFBUSxDQUFDO0FBQUEsWUFDMUI7QUFDQSxnQkFBSSxPQUFNLElBQUksQ0FBQztBQUFBLFVBQ25CO0FBQUE7QUFBQSxNQUVSO0FBQ0EsYUFBTztBQUFBO0FBR1gsV0FBTSxvQkFBcUIsQ0FBQyxHQUFHLElBQy9CO0FBQ0ksVUFBSTtBQUVKLGlCQUFXLE9BQVEsWUFDbkI7QUFDSSxZQUNBO0FBQ0ksZ0JBQU0sS0FBSyxPQUNYO0FBQ0ksZUFBRztBQUNIO0FBQUEsVUFDSjtBQUNBLGNBQUksT0FBTSxRQUFRLE9BQU0sY0FBYyxDQUFDLENBQUM7QUFDeEMsYUFBRyxPQUFPLEdBQUcsR0FBRyxPQUFPLEdBQUcsY0FBZSxDQUFDLEtBQzFDO0FBQ0ksZ0JBQUssT0FBTyxNQUNaO0FBQ0kscUJBQU8sR0FBRztBQUFBLFlBQ2QsT0FFQTtBQUNJLHFCQUFPLEdBQUcsS0FBSyxXQUFXLENBQUMsTUFBSyxPQUNoQztBQUNJLG9CQUFLLFFBQU8sTUFDWjtBQUNJLHlCQUFPLEdBQUc7QUFBQSxnQkFDZCxPQUVBO0FBQ0kseUJBQU8sR0FBRyxLQUFJO0FBQUE7QUFBQSxlQUVyQjtBQUFBO0FBQUEsV0FFUjtBQUFBLGlCQUVFLEtBQVA7QUFFSSxpQkFBTSxNQUFNLHFCQUFxQixPQUFPLEdBQUcsQ0FBQztBQUFBO0FBQUEsTUFFcEQsT0FFQTtBQUNJLFlBQUssS0FBSyxNQUNWO0FBQ0ksY0FDQTtBQUNJLGdCQUFJLE9BQU0sUUFBUSxPQUFNLGNBQWMsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FDeEI7QUFDSSxpQkFBRyxXQUFXLEdBQUUsR0FBRyxJQUFJO0FBQ3ZCLHFCQUFPO0FBQUEsWUFDWDtBQUFBLG1CQUVHLEtBQVA7QUFFSSxnQkFBSSxLQUFJLEdBQUcsSUFBSSxNQUFLLENBQUMsVUFBUyxTQUFTLENBQUMsR0FDeEM7QUFDSSxxQkFBTztBQUFBLFlBQ1g7QUFDQSxtQkFBTSxNQUFNLHFCQUFxQixPQUFPLEdBQUcsQ0FBQztBQUFBO0FBQUEsUUFFcEQ7QUFBQTtBQUVKLGFBQU87QUFBQTtBQUdYLFdBQU0sd0JBQXlCLENBQUMsR0FBRyxJQUNuQztBQUNJLGNBQVEsTUFBTSxtQ0FBbUM7QUFBQTtBQUdyRCxXQUFNLHVCQUF3QixDQUFDLEdBQUcsSUFDbEM7QUFDSSxjQUFRLE1BQU0sbUNBQW1DO0FBQUE7QUFHckQsV0FBTSxtQkFBb0IsQ0FBQyxHQUMzQjtBQUNJLFVBQUk7QUFFSixVQUNBO0FBQ0ksY0FBTSxPQUFNLElBQUksQ0FBQztBQUNqQixhQUFLLE9BQU0sTUFBTSxHQUFHLEdBQ3BCO0FBQ0ksYUFBRyxVQUFVLEtBQUksRUFBQyxXQUFVLEtBQUksQ0FBQztBQUFBLFFBQ3JDO0FBQ0EsYUFBSyxPQUFNLFdBQVcsQ0FBQyxHQUN2QjtBQUNJLGFBQUcsY0FBYyxHQUFFLEVBQUU7QUFBQSxRQUN6QjtBQUNBLGVBQU87QUFBQSxlQUVKLEtBQVA7QUFFSSxlQUFNLE1BQU0sb0JBQW9CLE9BQU8sR0FBRyxDQUFDO0FBQzNDLGVBQU87QUFBQTtBQUFBO0FBSWYsV0FBTSxvQkFBcUIsQ0FBQyxHQUFHLElBQy9CO0FBQ0ksVUFBSSxLQUFLLEtBQUssR0FBRyxNQUFNO0FBRXZCLGFBQU8sT0FBTSxLQUFLLENBQUM7QUFDbkIsWUFBTSxPQUFNLElBQUksQ0FBQztBQUNqQixZQUFNLE9BQU0sSUFBSSxDQUFDO0FBQ2pCLFlBQU0sT0FBTyxNQUFNLE9BQU87QUFDMUIsVUFBSSxRQUFRLEtBQUssSUFBSSxHQUNyQjtBQUNJLGVBQU8sS0FBSyxNQUFNLEdBQUUsS0FBSyxTQUFTLENBQUM7QUFBQSxNQUN2QztBQUNBLGlCQUFXLE9BQVEsWUFDbkI7QUFDSSxlQUFPLE9BQU0sT0FBTyxXQUFXLENBQUMsTUFDaEM7QUFDSSxjQUFJLE9BQU8sSUFBRztBQUVkLGVBQUssTUFDTDtBQUNJLGVBQUcsT0FBTSxRQUFRLENBQUMsQ0FBQztBQUNuQjtBQUFBLFVBQ0o7QUFDQSxlQUFJO0FBQ0osa0JBQU87QUFDUCwwQkFBaUIsR0FDakI7QUFDSSxvQkFBTyxHQUFHLE9BQU8sR0FBRyxLQUFJLFNBQVMsR0FBRSxHQUFHLElBQUk7QUFDMUMsZ0JBQUksS0FDSjtBQUNJLHNCQUFPLE9BQU0sS0FBSyxLQUFJLEtBQUk7QUFBQSxZQUM5QjtBQUNBLG1CQUFPLE9BQU0sT0FBTyxlQUFjLENBQUMsT0FDbkM7QUFDSSxrQkFBSSxPQUNKO0FBQ0ksc0JBQUs7QUFDTCx1QkFBTyxNQUFNO0FBQUEsY0FDakIsT0FFQTtBQUNJLHVCQUFPLEdBQUcsT0FBTSxRQUFRLEtBQUksQ0FBQztBQUFBO0FBQUEsYUFFcEM7QUFBQTtBQUVMLGlCQUFPLE1BQU07QUFBQSxTQUNoQjtBQUFBLE1BQ0wsT0FFQTtBQUNJLGFBQUssT0FBTSxPQUFPLENBQUMsR0FDbkI7QUFDSSxpQkFBTyxPQUFNLFFBQVEsQ0FBQztBQUFBLFFBQzFCO0FBQ0EsYUFBSyxJQUFJLEVBQUcsS0FBSyxNQUFNLEtBQ3ZCO0FBQ0ksaUJBQU8sR0FBRyxPQUFPLEdBQUcsSUFBSSxTQUFTLEdBQUUsR0FBRyxJQUFJO0FBQzFDLGNBQUksS0FDSjtBQUNJLG1CQUFPLE9BQU0sS0FBSyxLQUFJLElBQUk7QUFBQSxVQUM5QjtBQUNBLGVBQUssT0FBTSxPQUFPLElBQUksR0FDdEI7QUFDSSxtQkFBTyxPQUFNLFFBQVEsSUFBSTtBQUFBLFVBQzdCO0FBQUEsUUFDSjtBQUFBO0FBQUE7QUFJUixXQUFNLG1CQUFvQixDQUFDLEdBQUcsSUFDOUI7QUFDSSxhQUFPLE9BQU0sVUFBVSxHQUFFLEVBQUU7QUFBQTtBQUcvQixXQUFNLG9CQUFxQixDQUFDLEdBQUcsSUFDL0I7QUFDSSxhQUFPLE9BQU0sV0FBVyxHQUFFLEVBQUU7QUFBQTtBQUdoQyxXQUFNLHdCQUF5QixDQUFDLEdBQUcsSUFDbkM7QUFDSSxpQkFBVyxPQUFRLFlBQ25CO0FBQ0ksWUFDQTtBQUNJLGlCQUFPLEdBQUcsT0FBTyxPQUFNLFFBQVEsQ0FBQyxHQUFHLEdBQUcsVUFBVSxPQUFPLEdBQUcsVUFBVSxjQUFlLENBQUMsS0FDcEY7QUFDSSxtQkFBTyxJQUFJLEdBQUc7QUFBQSxXQUNqQjtBQUFBLGlCQUVFLEtBQVA7QUFFSSxpQkFBTSxNQUFNLHlCQUF5QixPQUFPLEdBQUcsQ0FBQztBQUNoRCxpQkFBTyxHQUFHLEtBQUs7QUFBQTtBQUFBLE1BRXZCLE9BRUE7QUFDSSxZQUNBO0FBQ0ksYUFBRyxXQUFXLE9BQU0sUUFBUSxDQUFDLEdBQUcsR0FBRyxVQUFVLE9BQU8sR0FBRyxVQUFVLElBQUs7QUFDdEUsaUJBQU87QUFBQSxpQkFFSixLQUFQO0FBRUksaUJBQU87QUFBQTtBQUFBO0FBQUE7QUFLbkIsV0FBTSxhQUFhO0FBQ25CLFdBQU0sY0FBYyxFQUFDLFNBQVEsR0FBRSxTQUFRLEdBQUUsY0FBYSxHQUFFLGNBQWEsRUFBQztBQUN0RSxXQUFNLG9CQUFxQixDQUFDLEdBQzVCO0FBQ0ksVUFBSSxLQUFLO0FBRVQsVUFDQTtBQUNJLGFBQUssT0FBTSxTQUNYO0FBQ0ksaUJBQU0sVUFBVSxDQUFDO0FBQ2pCLGNBQUksT0FBTyxLQUFJLHlFQUE4QjtBQUM3QyxtQkFBUyxXQUFXLEVBQUcsV0FBVyxLQUFLLFFBQVEsWUFDL0M7QUFDSSxrQkFBTSxLQUFLO0FBQ1gsbUJBQU0sUUFBUSxPQUFPO0FBQUEsVUFDekI7QUFDQSxpQkFBTSxRQUFRLFdBQVc7QUFBQSxRQUM3QjtBQUNBLGNBQU0sT0FBTSxJQUFJLENBQUM7QUFDakIsWUFBSSxPQUFRLE9BQU0sUUFBUSxRQUFRLE1BQ2xDO0FBQ0ksaUJBQU87QUFBQSxRQUNYO0FBQ0EsWUFBSSxPQUFNLFNBQVMsT0FBTSxTQUFTLENBQUMsRUFBRSxZQUFZLElBQ2pEO0FBQ0ksaUJBQU87QUFBQSxRQUNYO0FBQ0EsWUFBSSxPQUFNLFFBQVEsQ0FBQztBQUNuQixhQUFLLE9BQU0sT0FBTyxDQUFDLEdBQ25CO0FBQ0ksaUJBQU87QUFBQSxRQUNYO0FBQ0E7QUFDQSxnQkFBUSxTQUFTLGlCQUFpQixDQUFDO0FBQUEsZUFFaEMsS0FBUDtBQUVJLGVBQU0sTUFBTSxxQkFBcUIsT0FBTyxHQUFHLENBQUM7QUFDNUMsZUFBTztBQUFBO0FBQUE7QUFJZixXQUFNLHNCQUF1QixDQUFDLEdBQUcsSUFDakM7QUFDSSxXQUFNLEtBQUksT0FBTyxFQUFFLEdBQ25CO0FBQ0ksZUFBTyxJQUFJLEtBQUssQ0FBQyxFQUFFLEtBQUs7QUFBQSxNQUM1QjtBQUNBLGFBQU8sTUFBTSxRQUFRLGVBQWMsQ0FBQyxFQUFFLGFBQWMsQ0FBQyxNQUFNLEtBQzNEO0FBQ0ksYUFBSyxLQUNMO0FBQ0ksaUJBQU8sR0FBRyxJQUFJO0FBQUEsUUFDbEIsT0FFQTtBQUNJLGtCQUFRLE1BQU0sR0FBRztBQUFBO0FBQUEsT0FFeEI7QUFBQTtBQUdMLFdBQU0sdUJBQXdCLENBQUMsR0FBRyxNQUFNLElBQ3hDO0FBQ0ksYUFBTSxNQUFNLGlDQUFpQztBQUM3QyxhQUFPO0FBQUE7QUFHWCxXQUFNLG9CQUFxQixDQUFDLEdBQUcsSUFDL0I7QUFDSSxVQUFJLElBQ0o7QUFDSSxlQUFPLEdBQUcsT0FBTyxHQUFFLEVBQUU7QUFBQSxNQUN6QixPQUVBO0FBQ0ksZUFBTyxHQUFHLFdBQVcsQ0FBQztBQUFBO0FBQUE7QUFJOUIsV0FBTSxTQUFTLElBQUksT0FBTyxRQUFPLEdBQUc7QUFDcEMsV0FBTSxpQkFBa0IsR0FDeEI7QUFDSSxhQUFPLGFBQUssUUFBUTtBQUFBO0FBR3hCLFdBQU0sbUJBQW9CLENBQUMsS0FDM0I7QUFDSSxVQUFJLEtBQUssV0FDVDtBQUNJLGdCQUFRLE1BQU0sR0FBRztBQUFBLE1BQ3JCO0FBQ0EsYUFBTztBQUFBO0FBR1gsV0FBTztBQUFBLElBQ1I7QUFFSCxFQUFlO0FBQUE7OztBQzl6QmYsSUFBSTtBQUdKLGlCQUFtQixHQUNuQjtBQUNJLFdBQVMsT0FBTyxHQUNoQjtBQUFBO0FBRUEsVUFBTyxVQUFVO0FBQ2pCLFVBQU8saUJBQWtCLENBQUMsR0FDMUI7QUFDSSxXQUFPLFFBQU8sT0FBTyxNQUFNO0FBQUE7QUFHL0IsVUFBTyxnQkFBaUIsQ0FBQyxHQUN6QjtBQUNJLFdBQU8sUUFBTyxPQUFPLFNBQVM7QUFBQTtBQUdsQyxVQUFPLGlCQUFrQixDQUFDLEdBQzFCO0FBQ0ksV0FBTyxRQUFPLE9BQU8scUJBQXFCO0FBQUE7QUFHOUMsVUFBTyxpQkFBa0IsQ0FBQyxHQUMxQjtBQUNJLFdBQU8sUUFBTyxPQUFPLHlCQUF5QjtBQUFBO0FBR2xELFVBQU8saUJBQWtCLENBQUMsR0FDMUI7QUFDSSxXQUFPLFFBQU8sT0FBTyw2QkFBNkI7QUFBQTtBQUd0RCxTQUFPO0FBQUEsRUFDUjtBQUVILElBQWU7OztBQ3ZDZixJQUFJLE1BQU0sRUFBQyxlQUFnQixDQUFDLEdBQUc7QUFBQyxXQUFTLEtBQUssZUFBZSxLQUFLLFlBQVksRUFBRSxZQUFZLFNBQVM7QUFBQSxHQUFZLGVBQWdCLENBQUMsR0FBRztBQUFDLGdCQUFjLE1BQU0sWUFBWSxhQUFhO0FBQUEsR0FBUyxlQUFnQixDQUFDLEdBQUc7QUFBQyxVQUFRLE1BQU0sQ0FBQyxNQUFNLE1BQU0sV0FBVyxDQUFDLENBQUMsTUFBTSxTQUFTLENBQUMsS0FBSyxNQUFNLFlBQVksTUFBTTtBQUFBLEdBQWEsY0FBZSxDQUFDLEdBQUc7QUFBQyxTQUFPLEtBQUssY0FBYyxFQUFFLFdBQVcsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFBRTtBQUVyWSxJQUFJO0FBQUosSUFBVTtBQUdWLG9CQUFxQixDQUFDLE9BQ3RCO0FBQ0ksVUFBUSxTQUFTLE9BQU8sTUFBTSxXQUFXLGVBQWUsTUFBTyxJQUFJLE1BQU0sS0FBSztBQUFBO0FBR2xGLGVBQWdCLENBQUMsS0FBSyxLQUN0QjtBQUNJLE1BQUksR0FBRyxHQUFHLE9BQU8sR0FBRyxTQUFTLFNBQVMsU0FBUztBQUUvQyxNQUFJLGNBQWMsUUFBUyxVQUMzQjtBQUNJLFVBQU07QUFDTixVQUFNLElBQUk7QUFBQSxFQUNkO0FBQ0EsUUFBTyxPQUFPLE9BQU8sTUFBTSxDQUFDO0FBQzVCLFFBQU8sT0FBTyxPQUFPLE1BQU07QUFDM0IsTUFBSSxTQUFTLGNBQWMsR0FBRztBQUM5QixNQUFJLElBQUksTUFBTSxJQUFJLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLEdBQzdDO0FBQ0ksTUFBRSxjQUFjLElBQUk7QUFDcEIsV0FBTyxJQUFJO0FBQUEsRUFDZjtBQUNBLE1BQUssSUFBSSxRQUFRLFFBQVMsSUFBSSxNQUFNLElBQUksSUFBSSxHQUM1QztBQUNJLE1BQUUsWUFBWSxJQUFJO0FBQ2xCLFdBQU8sSUFBSTtBQUFBLEVBQ2Y7QUFDQSxNQUFLLElBQUksU0FBUyxRQUFTLFVBQVUsSUFBSSxLQUFLLEdBQzlDO0FBQ0ksTUFBRSxZQUFZLElBQUksS0FBSztBQUN2QixXQUFPLElBQUk7QUFBQSxFQUNmO0FBQ0EsTUFBSyxJQUFJLFlBQVksUUFBUyxJQUFJLG9CQUFvQixPQUN0RDtBQUNJLFFBQUksT0FBTyxJQUFJLEtBQUssSUFBSSxRQUFRO0FBQ2hDLGFBQVMsVUFBVSxFQUFHLFVBQVUsS0FBSyxRQUFRLFdBQzdDO0FBQ0ksVUFBSSxLQUFLO0FBQ1QsVUFBSSxVQUFVLENBQUMsR0FDZjtBQUNJLFVBQUUsWUFBWSxDQUFDO0FBQUEsTUFDbkI7QUFBQSxJQUNKO0FBQ0EsV0FBTyxJQUFJO0FBQUEsRUFDZjtBQUNBLE1BQUssSUFBSSxVQUFVLFFBQVMsVUFBVSxJQUFJLE1BQU0sR0FDaEQ7QUFDSSxRQUFJLE9BQU8sWUFBWSxDQUFDO0FBQ3hCLFdBQU8sSUFBSTtBQUFBLEVBQ2Y7QUFDQSxNQUFJLFFBQVEsQ0FBQyxhQUFZLGFBQVksV0FBVSxTQUFRLFVBQVU7QUFDakUsV0FBUyxVQUFVLEVBQUcsVUFBVSxNQUFNLFFBQVEsV0FDOUM7QUFDSSxZQUFRLE1BQU07QUFDZCxRQUFJLElBQUksaUJBQWlCLElBQUksV0FBWSxZQUN6QztBQUNJLFFBQUUsaUJBQWlCLE9BQU0sSUFBSSxNQUFNO0FBQ25DLGFBQU8sSUFBSTtBQUFBLElBQ2Y7QUFBQSxFQUNKO0FBQ0EsTUFBSSxRQUFRLElBQUksS0FBSyxPQUFPLEtBQUssR0FBRyxDQUFDO0FBQ3JDLFdBQVMsVUFBVSxFQUFHLFVBQVUsTUFBTSxRQUFRLFdBQzlDO0FBQ0ksUUFBSSxNQUFNO0FBQ1YsTUFBRSxhQUFhLEdBQUUsSUFBSSxFQUFFO0FBQUEsRUFDM0I7QUFDQSxTQUFPO0FBQUE7QUFHWCxLQUFLLHNCQUF1QixDQUFDLEtBQUssS0FDbEM7QUFDSSxNQUFJO0FBRUosT0FBSyxJQUFJLHNCQUFzQjtBQUMvQixTQUFRLEdBQUcsUUFBUSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsT0FBTyxHQUFHLFVBQVcsR0FBRyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxNQUFNLEdBQUc7QUFBQTtBQUd6RyxLQUFLLHFCQUFzQixDQUFDLEdBQzVCO0FBQ0ksU0FBTyxNQUFNLFVBQVUsUUFBUSxLQUFLLEVBQUUsV0FBVyxZQUFXLENBQUM7QUFBQTtBQUdqRSxLQUFLLGlCQUFrQixDQUFDLFNBQVMsTUFDakM7QUFDSSxNQUFJLEdBQUc7QUFFUCxRQUFNLFdBQVcsT0FDakI7QUFDSSxXQUFPO0FBQUEsRUFDWDtBQUNBLGFBQVksUUFBUSxpQkFBaUIsYUFBYSxRQUFRLGFBQWEsSUFBSSxJQUFJO0FBQy9FLE1BQUksTUFBTSxRQUFRLE1BQU0sSUFDeEI7QUFDSSxXQUFPO0FBQUEsRUFDWDtBQUNBLFNBQU8sS0FBSyxPQUFPLFFBQVEsWUFBVyxJQUFJO0FBQUE7QUFHOUMsS0FBSyxpQkFBa0IsQ0FBQyxTQUFTLE1BQ2pDO0FBQ0ksUUFBTSxXQUFXLE9BQ2pCO0FBQ0ksV0FBTztBQUFBLEVBQ1g7QUFDQSxNQUFLLFFBQVEsU0FBUyxNQUN0QjtBQUNJLFdBQU8sUUFBUTtBQUFBLEVBQ25CO0FBQ0EsU0FBTyxLQUFLLE9BQU8sUUFBUSxZQUFXLElBQUk7QUFBQTtBQUc5QyxLQUFLLGlCQUFrQixDQUFDLFNBQVMsS0FDakM7QUFDSSxNQUFJLFNBQVMsU0FBUyxTQUFTLFNBQVMsU0FBUyxTQUFTO0FBRTFELFFBQU0sV0FBVyxPQUNqQjtBQUNJLFdBQU87QUFBQSxFQUNYO0FBQ0EsT0FBTSxPQUFPLE9BQU8sSUFBSSxNQUFNLGNBQWMsUUFBUyxJQUFJLFFBQVEsUUFBUSxTQUN6RTtBQUNJLFdBQU87QUFBQSxFQUNYO0FBQ0EsT0FBTSxPQUFPLE9BQU8sSUFBSSxPQUFPLGNBQWMsUUFBVSxRQUFRLElBQUksU0FBUyxNQUM1RTtBQUNJLFdBQU87QUFBQSxFQUNYO0FBQ0EsT0FBTSxPQUFPLE9BQU8sSUFBSSxPQUFPLGNBQWMsZ0JBQWtCLFFBQVEsaUJBQWlCLGFBQWEsUUFBUSxhQUFhLElBQUksSUFBSSxJQUFJLGNBQWMsTUFDcEo7QUFDSSxXQUFPO0FBQUEsRUFDWDtBQUNBLE9BQU0sT0FBTyxPQUFPLElBQUksUUFBUSxjQUFjLFNBQVUsUUFBUSxhQUFhLE9BQU8sUUFBUSxVQUFVLFNBQVMsSUFBSSxLQUFLLElBQUksWUFDNUg7QUFDSSxXQUFPO0FBQUEsRUFDWDtBQUNBLFNBQU8sS0FBSyxPQUFPLFFBQVEsWUFBVyxHQUFHO0FBQUE7QUFHN0MsS0FBSyxtQkFBb0IsQ0FBQyxTQUFTLEtBQ25DO0FBQ0ksTUFBSSxPQUFPLE9BQU8sU0FBUyxTQUFTLFNBQVMsU0FBUyxTQUFTLFNBQVM7QUFFeEUsUUFBTSxXQUFXLE9BQ2pCO0FBQ0ksV0FBTztBQUFBLEVBQ1g7QUFDQSxPQUFNLE9BQU8sT0FBTyxJQUFJLE1BQU0sY0FBYyxRQUFTLElBQUksUUFBUSxRQUFRLFNBQ3pFO0FBQ0ksV0FBTztBQUFBLEVBQ1g7QUFDQSxPQUFNLE9BQU8sT0FBTyxJQUFJLE9BQU8sY0FBYyxRQUFVLFFBQVEsSUFBSSxTQUFTLE1BQzVFO0FBQ0ksV0FBTyxPQUFPLE9BQU8sSUFBSSxRQUFRLGNBQWMsU0FBUyxRQUFRLElBQUksVUFBVSxJQUFJLE9BQ2xGO0FBQ0ksYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQ0EsT0FBTSxPQUFPLE9BQU8sSUFBSSxPQUFPLGNBQWMsZ0JBQWtCLFFBQVEsaUJBQWlCLGFBQWEsUUFBUSxhQUFhLElBQUksSUFBSSxJQUFJLGNBQWMsTUFDcEo7QUFDSSxXQUFPLE9BQU8sT0FBTyxJQUFJLFFBQVEsY0FBYyxTQUFTLFFBQVEsYUFBYSxJQUFJLElBQUksTUFBTSxJQUFJLE9BQy9GO0FBQ0ksYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQ0EsTUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLFFBQVE7QUFDcEMsV0FBUyxVQUFVLEVBQUcsVUFBVSxLQUFLLFFBQVEsV0FDN0M7QUFDSSxZQUFRLEtBQUs7QUFDYixRQUFJLFFBQVEsS0FBSyxTQUFTLE9BQU0sR0FBRyxHQUNuQztBQUNJLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBO0FBRUosS0FBSyxZQUFZO0FBQ2pCLElBQWU7OztBQ3BMZixJQUFJLE9BQU0sRUFBQyxlQUFnQixDQUFDLEdBQUc7QUFBQyxnQkFBYyxNQUFNLFlBQVksYUFBYTtBQUFBLEdBQVMsWUFBYSxDQUFDLEdBQUUsR0FBRztBQUFDLGlCQUFlLE1BQU0sbUJBQW1CLE1BQU0sWUFBWSxFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUUsQ0FBQyxLQUFLO0FBQUEsR0FBSSxjQUFlLENBQUMsR0FBRztBQUFDLFNBQU8sS0FBSyxjQUFjLEVBQUUsV0FBVyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUFFO0FBR25TLElBQWUsZ0JBQUMsTUFBSyxjQUFLLFdBQVcsQ0FBQyxvQkFBb0IsaUJBQWlCLFVBQzNFO0FBQ0ksTUFBSSxLQUFJLE1BQU0sa0JBQWtCLEdBQ2hDO0FBQ0ksUUFBSSxLQUFJLEdBQUcsbUJBQW1CLElBQUcsQ0FBQyxLQUFJLEdBQUcsQ0FBQyxLQUFLLG1CQUFtQixVQUNsRTtBQUNJLGFBQU8sZUFBZSxjQUFjLGtCQUFrQjtBQUFBLElBQzFELE9BRUE7QUFDSSxhQUFPLFNBQVMsZUFBZSxrQkFBa0I7QUFBQTtBQUFBLEVBRXpELFdBQ1MsYUFBSyxVQUFVLGtCQUFrQixLQUFLLEtBQUksTUFBTSxjQUFjLEdBQ3ZFO0FBQ0ksV0FBTyxtQkFBbUIsY0FBYyxjQUFjO0FBQUEsRUFDMUQsT0FFQTtBQUNJLFdBQU87QUFBQTtBQUFBLEdBRWIsb0JBQW9CLENBQUMsR0FDdkI7QUFDSSxTQUFPLE1BQU0sVUFBVSxRQUFRLEtBQUssRUFBRSxXQUFXLFlBQVcsQ0FBQztBQUFBLEdBQy9ELFlBQVksR0FDZDtBQUNJLFNBQU8sU0FBUyxLQUFLO0FBQUEsR0FDdkIsWUFBWSxHQUNkO0FBQ0ksU0FBTyxTQUFTLEtBQUs7QUFBQSxHQUN2QixtQkFBbUIsQ0FBQyxPQUN0QjtBQUNJLE1BQUssU0FBUyxlQUFnQixNQUFNLG1CQUFvQixxQkFBcUIsTUFBTSxvQkFBcUIsWUFDeEc7QUFDSSxVQUFNLGVBQWU7QUFDckIsVUFBTSxnQkFBZ0I7QUFBQSxFQUMxQjtBQUNBLFNBQU87QUFBQSxHQUNULGtCQUFrQixDQUFDLFVBQVUsS0FBSyxPQUFPLE9BQU8sR0FDbEQ7QUFDSSxNQUFJO0FBRUosTUFBSSxPQUFPLEtBQUksS0FBSyxTQUFTLFlBQVksTUFBTSxRQUFRO0FBQ3ZELFdBQVMsVUFBVSxFQUFHLFVBQVUsS0FBSyxRQUFRLFdBQzdDO0FBQ0ksV0FBTyxLQUFLO0FBQ1osUUFBSSxLQUFLLGlCQUFpQixVQUMxQjtBQUNJLFdBQUssTUFBTSxPQUFPO0FBQ2xCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDQSxXQUFTLFlBQVksTUFBTSxXQUFXLEdBQUcsY0FBYyxRQUFRLFdBQVUsU0FBUyxZQUFZLE1BQU0sU0FBUyxNQUFNO0FBQ25IO0FBQUEsR0FDRixrQkFBa0IsQ0FBQyxVQUFVLEtBQUssT0FBTyxPQUFPLEdBQ2xEO0FBQ0ksTUFBSTtBQUVKLE1BQUksT0FBTyxLQUFJLEtBQUssU0FBUyxZQUFZLE1BQU0sUUFBUTtBQUN2RCxXQUFTLFVBQVUsRUFBRyxVQUFVLEtBQUssUUFBUSxXQUM3QztBQUNJLFdBQU8sS0FBSztBQUNaLFFBQUksS0FBSyxpQkFBaUIsVUFDMUI7QUFDSSxVQUFLLEtBQUssTUFBTSxRQUFRLE9BQU8sS0FBSyxNQUFNLEtBQUssU0FBUyxXQUN4RDtBQUNJLGVBQU8sS0FBSyxNQUFNO0FBQUEsTUFDdEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNBLFNBQU87QUFBQSxFQUNWOzs7QUN4RUQsSUFBSTtBQUFKLElBQVU7QUFFVixPQUFPO0FBQ1A7QUFBQSxNQUFNLGVBQWUsWUFDckI7QUFBQSxFQUNJLFdBQVksR0FDWjtBQUNJLFVBQU07QUFFTixTQUFLLFVBQVUsS0FBSyxRQUFRLEtBQUssSUFBSTtBQUNyQyxTQUFLLGlCQUFpQixNQUFLLEtBQUssV0FBVztBQUMzQyxXQUFPLGlCQUFpQixnQkFBZSxLQUFLLE9BQU87QUFBQTtBQUFBLEVBR3ZELFdBQVksQ0FBQyxPQUNiO0FBQ0ksUUFBSTtBQUVKLFVBQU0sSUFBSSxNQUFNLE1BQU0sS0FBSztBQUMzQixRQUFJLE9BQU8sTUFBTTtBQUNqQixRQUFJLFdBQVcsTUFBTTtBQUNyQixRQUFJLFlBQVksTUFBTTtBQUN0QixXQUFPLEtBQUssY0FBYyxHQUFHO0FBQUE7QUFBQSxFQUdqQyxPQUFRLEdBQ1I7QUFDSSxTQUFLLG9CQUFvQixNQUFLLEtBQUssV0FBVztBQUM5QyxXQUFPLE9BQU8sb0JBQW9CLGdCQUFlLEtBQUssT0FBTztBQUFBO0FBQUEsRUFHakUsS0FBTSxDQUFDLE1BQU0sTUFDYjtBQUNJLFdBQU8sS0FBSyxLQUFLLFNBQVEsTUFBSyxJQUFJO0FBQUE7QUFBQSxFQUd0QyxNQUFPLENBQUMsTUFBTSxNQUNkO0FBQ0ksV0FBTyxLQUFLLEtBQUssVUFBUyxNQUFLLElBQUk7QUFBQTtBQUFBLEVBR3ZDLE1BQU8sQ0FBQyxNQUFNLE1BQ2Q7QUFDSSxXQUFPLEtBQUssS0FBSyxVQUFTLE1BQUssSUFBSTtBQUFBO0FBQUEsRUFHdkMsSUFBSyxDQUFDLFdBQVcsTUFBTSxNQUFNLElBQzdCO0FBQ0ksUUFBSTtBQUVKLFlBQVEsSUFBSSxNQUFNLElBQUk7QUFDdEIsVUFBTSxRQUFRO0FBQ2QsVUFBTSxPQUFPO0FBQ2IsVUFBTSxXQUFXO0FBQ2pCLFVBQU0sWUFBWTtBQUNsQixXQUFPLEtBQUssY0FBYyxLQUFLO0FBQUE7QUFFdkM7QUFFQSxTQUFTLElBQUk7QUFDYixJQUFlLGlCQUFDLFFBQWMsY0FBYyxDQUFDLFVBQVUsTUFDdkQ7QUFDSSxTQUFPLE9BQU8sTUFBTSxPQUFNLElBQUk7QUFBQSxHQUNoQyxZQUFZLENBQUMsT0FBTyxJQUN0QjtBQUNJLFNBQU8sT0FBTyxpQkFBaUIsZUFBZSxDQUFDLEdBQy9DO0FBQ0ksV0FBTyxHQUFHLE1BQU0sSUFBRyxFQUFFLElBQUk7QUFBQSxHQUM1QjtBQUFBLEVBQ0o7OztBQ3JFRDtBQUZBLElBQUksT0FBTSxFQUFDLGNBQWUsQ0FBQyxHQUFHO0FBQUMsU0FBTyxLQUFLLGNBQWMsRUFBRSxXQUFXLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUFBLEdBQUksWUFBYSxDQUFDLEdBQUUsR0FBRztBQUFDLGlCQUFlLE1BQU0sbUJBQW1CLE1BQU0sWUFBWSxFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUUsQ0FBQyxLQUFLO0FBQUEsRUFBRTtBQUd4TjtBQUFBLE1BQU0sUUFDTjtBQUFBLFNBQ1csUUFBUyxDQUFDLE9BQ2pCO0FBQ0ksUUFBSSxPQUFPO0FBRVgsWUFBUSxLQUFLLGNBQWMsS0FBSztBQUNoQyxXQUFPLEVBQUMsS0FBSSxLQUFLLGtCQUFrQixLQUFLLEdBQUUsS0FBSSxLQUFLLGdCQUFnQixLQUFLLEdBQUUsTUFBSyxLQUFLLGtCQUFrQixLQUFLLEdBQUUsT0FBWSxPQUFNLEtBQUssTUFBTSxLQUFLLEVBQUM7QUFDaEosV0FBTztBQUFBO0FBQUEsU0FHSixnQkFBZ0IsQ0FBQyxTQUFRLFFBQU8sT0FBTSxTQUFTO0FBQUEsU0FFL0MsZ0JBQWdCLENBQUMsVUFBRyxVQUFJLFVBQUksUUFBRztBQUFBLFNBRS9CLGVBQWUsQ0FBQyxTQUFRLFFBQU8sT0FBTSxXQUFVLGFBQVksVUFBUyxRQUFPLE9BQU0sV0FBVSxhQUFZLFVBQVMsU0FBUSxNQUFLLFFBQU8sUUFBTyxTQUFRLE9BQU0sU0FBUSxPQUFPO0FBQUEsU0FFeEssZUFBZSxDQUFDLFVBQUcsVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFFBQUc7QUFBQSxTQUUxRixRQUFTLENBQUMsT0FDakI7QUFDSSxRQUFJLEdBQUcsTUFBTSxLQUFLO0FBRWxCLFdBQU8sQ0FBQztBQUNSLFdBQU87QUFDUCxRQUFJLE9BQU8sS0FBSSxLQUFLLE1BQU0sTUFBTSxHQUFHLENBQUM7QUFDcEMsYUFBUyxVQUFVLEVBQUcsVUFBVSxLQUFLLFFBQVEsV0FDN0M7QUFDSSxVQUFJLEtBQUs7QUFDVCxVQUFJLEtBQUssV0FBVyxDQUFDLEdBQ3JCO0FBQ0ksYUFBSyxLQUFLLENBQUM7QUFBQSxNQUNmLE9BRUE7QUFDSSxjQUFNO0FBQ04sWUFBSSxFQUFFLFdBQVcsR0FDakI7QUFDSSxpQkFBTztBQUFBLFFBQ1g7QUFBQTtBQUFBLElBRVI7QUFDQSxXQUFPLEVBQUMsS0FBSSxLQUFLLEtBQUssR0FBRyxHQUFFLEtBQVEsT0FBWSxLQUFTO0FBQUE7QUFBQSxTQUdyRCxVQUFXLENBQUMsU0FDbkI7QUFDSSxXQUFPLEtBQUksR0FBRyxTQUFRLEtBQUssYUFBYTtBQUFBO0FBQUEsU0FHckMsaUJBQWtCLENBQUMsT0FDMUI7QUFDSSxRQUFJO0FBRUosV0FBTyxDQUFDO0FBQ1IsUUFBSSxNQUFNLFdBQVcsTUFBTSxRQUFRLFFBQ25DO0FBQ0ksV0FBSyxLQUFLLFNBQVM7QUFBQSxJQUN2QjtBQUNBLFFBQUksTUFBTSxVQUFVLE1BQU0sUUFBUSxPQUNsQztBQUNJLFdBQUssS0FBSyxLQUFLO0FBQUEsSUFDbkI7QUFDQSxRQUFJLE1BQU0sV0FBVyxNQUFNLFFBQVEsV0FDbkM7QUFDSSxXQUFLLEtBQUssTUFBTTtBQUFBLElBQ3BCO0FBQ0EsUUFBSSxNQUFNLFlBQVksTUFBTSxRQUFRLFNBQ3BDO0FBQ0ksV0FBSyxLQUFLLE9BQU87QUFBQSxJQUNyQjtBQUNBLFdBQU8sS0FBSyxLQUFLLEdBQUc7QUFBQTtBQUFBLFNBR2pCLGFBQWMsQ0FBQyxPQUN0QjtBQUNJLFFBQUksTUFBTTtBQUVWLG1CQUFnQixHQUNoQjtBQUNJLFVBQUk7QUFFSixhQUFPLENBQUMsRUFBRSxNQUFNLEtBQUssV0FBVSxDQUFDO0FBQ2hDLGFBQU8sS0FBSyxlQUFnQixDQUFDLEdBQzdCO0FBQ0ksZUFBUSxLQUFLLE9BQU8sRUFBRSxTQUFTO0FBQUEsT0FDbEM7QUFDRCxhQUFPLEtBQUssS0FBSyxHQUFHO0FBQUE7QUFFeEIsVUFBTSxLQUFLLGdCQUFnQixLQUFLO0FBQ2hDLFNBQU0sS0FBSSxHQUFHLEtBQUksS0FBSyxhQUFhLEdBQ25DO0FBQ0ksYUFBTyxLQUFLLEtBQUssa0JBQWtCLEtBQUssR0FBRSxHQUFHO0FBQUEsSUFDakQ7QUFDQSxXQUFPO0FBQUE7QUFBQSxTQUdKLGNBQWUsQ0FBQyxPQUN2QjtBQUNJLFFBQUk7QUFFSixZQUFRLE1BQU0sUUFBUSxTQUFTO0FBQy9CLFFBQUksU0FBUyxHQUNiO0FBQ0ksVUFBSSxXQUFHLE9BQ1A7QUFDSSxnQkFBUSxNQUFNLFFBQVEsV0FBVSxTQUFTO0FBQ3pDLGdCQUFRLE1BQU0sUUFBUSxlQUFjLGFBQWE7QUFBQSxNQUNyRCxPQUVBO0FBQ0ksZ0JBQVEsTUFBTSxRQUFRLFdBQVUsTUFBTTtBQUFBO0FBQUEsSUFFOUM7QUFDQSxXQUFPO0FBQUE7QUFBQSxTQUdKLGVBQWdCLENBQUMsT0FDeEI7QUFDSSxRQUFJLFVBQVU7QUFFZCxZQUFRLE1BQU07QUFBQSxXQUVMO0FBQUEsV0FDQTtBQUNELGVBQU87QUFBQSxXQUVOO0FBQ0QsZUFBTztBQUFBLFdBRU47QUFDRCxlQUFPO0FBQUEsV0FFTjtBQUNELGVBQU87QUFBQSxXQUVOO0FBQ0QsZUFBTztBQUFBLFdBRU47QUFDRCxlQUFPO0FBQUEsV0FFTjtBQUNELGVBQU87QUFBQSxXQUVOO0FBQ0QsZUFBTztBQUFBLFdBRU47QUFDRCxlQUFPO0FBQUEsV0FFTjtBQUNELGVBQU87QUFBQSxXQUVOO0FBQ0QsZUFBTztBQUFBLFdBRU47QUFDRCxlQUFPO0FBQUEsV0FFTjtBQUNELGVBQU87QUFBQSxXQUVOO0FBQ0QsZUFBTztBQUFBO0FBR1AsY0FBTSxNQUFNLE9BQU8sT0FDdkI7QUFDSSxpQkFBTztBQUFBLFFBQ1gsV0FDUyxNQUFNLElBQUksV0FBVyxPQUFPLEdBQ3JDO0FBQ0ksaUJBQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFLFlBQVk7QUFBQSxRQUMxQyxXQUNTLE1BQU0sS0FBSyxXQUFXLEtBQUssR0FDcEM7QUFDSSxpQkFBTyxNQUFNLEtBQUssTUFBTSxDQUFDLEVBQUUsWUFBWTtBQUFBLFFBQzNDLFdBQ1MsTUFBTSxLQUFLLFdBQVcsT0FBTyxHQUN0QztBQUNJLGlCQUFPLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFBQSxRQUM3QixXQUNTLEtBQUksR0FBRyxNQUFNLEtBQUksQ0FBQyxVQUFTLFVBQVMsU0FBUSxhQUFZLFFBQU8sS0FBSyxDQUFDLEdBQzlFO0FBQ0ksaUJBQU8sTUFBTSxJQUFJLFlBQVk7QUFBQSxRQUNqQyxXQUNTLE1BQU0sUUFBUSxVQUN2QjtBQUNJLGlCQUFPO0FBQUEsUUFDWCxXQUNTLE1BQU0sUUFBUSxZQUN2QjtBQUNJLGlCQUFPO0FBQUEsUUFDWCxXQUNTLE1BQU0sUUFBUSxXQUN2QjtBQUNJLGlCQUFPO0FBQUEsUUFDWCxXQUNTLE1BQU0sUUFBUSxRQUN2QjtBQUNJLGlCQUFPO0FBQUEsUUFDWCxZQUNVLEtBQUssa0JBQWtCLEtBQUssS0FBSyxPQUFPLEtBQUssa0JBQWtCLEtBQUssRUFBRSxTQUFTLGVBQWUsR0FDeEc7QUFDSSxpQkFBTyxLQUFLLGtCQUFrQixLQUFLLEVBQUUsWUFBWTtBQUFBLFFBQ3JELE9BRUE7QUFDSSxpQkFBTyxNQUFNLElBQUksWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBTWxDLGlCQUFrQixDQUFDLE9BQzFCO0FBQ0ksUUFBSTtBQUVKLFNBQUssTUFBTSxPQUFPLE9BQU8sTUFBTSxJQUFJLFNBQVMsZUFBZSxHQUMzRDtBQUNJLGFBQU8sTUFBTTtBQUFBLElBQ2pCLFdBQ1MsTUFBTSxTQUFTLGVBQ3hCO0FBQ0ksYUFBTztBQUFBLElBQ1g7QUFBQTtBQUFBLFNBR0csS0FBTSxDQUFDLE9BQ2Q7QUFDSSxRQUFJO0FBRUosWUFBUSxLQUFLLGVBQWUsTUFBTSxZQUFZLENBQUM7QUFDL0MsYUFBUyxXQUFXLElBQUksR0FBRyxXQUFXLEtBQUssYUFBYSxPQUFTLFlBQVksV0FBVyxJQUFJLEtBQUssYUFBYSxTQUFTLElBQUksS0FBSyxhQUFhLFFBQVUsWUFBWSxhQUFhLE1BQU0sR0FDdEw7QUFDSSxjQUFRLE1BQU0sUUFBUSxJQUFJLE9BQU8sS0FBSyxhQUFhLElBQUcsSUFBSSxHQUFFLEtBQUssYUFBYSxFQUFFO0FBQUEsSUFDcEY7QUFDQSxZQUFRLE1BQU0sUUFBUSxPQUFNLEVBQUU7QUFDOUIsV0FBTyxNQUFNLFlBQVk7QUFBQTtBQUVqQztBQUVBLElBQWU7OztBQ3RQZixJQUFJLE9BQU0sRUFBQyxZQUFhLENBQUMsR0FBRSxHQUFHO0FBQUMsaUJBQWUsTUFBTSxtQkFBbUIsTUFBTSxZQUFZLEVBQUUsU0FBUyxLQUFLLENBQUMsR0FBRyxRQUFRLEtBQUssR0FBRSxDQUFDLEtBQUs7QUFBQSxFQUFFO0FBRXBJLElBQUk7QUFBSixJQUFhO0FBQWIsSUFBbUI7QUFBbkIsSUFBd0I7QUFHeEIsaUJBQWtCLENBQUMsR0FDbkI7QUFDSSxNQUFJLE9BQU8sQ0FBQztBQUNaLE1BQUksRUFBRSxRQUFRLG1CQUFrQixNQUFNO0FBQ3RDLE1BQUksRUFBRSxRQUFRLE9BQU0sS0FBSztBQUN6QixNQUFJLEVBQUUsUUFBUSxPQUFNLEtBQUs7QUFDekIsTUFBSSxFQUFFLFFBQVEsT0FBTSxNQUFNO0FBQzFCLE1BQUksRUFBRSxRQUFRLFNBQVEsTUFBTTtBQUM1QixNQUFJLEVBQUUsUUFBUSxPQUFNLE9BQU87QUFDM0IsTUFBSSxFQUFFLFFBQVEsU0FBUSxJQUFJO0FBQzFCLFNBQU8sSUFBSSxPQUFPLE1BQU0sSUFBSSxHQUFHO0FBQUE7QUFHbkMsa0JBQW1CLENBQUMsUUFBUSxRQUFRLEtBQUssU0FBUSxHQUFJLFVBQVUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUM3RTtBQUNJLE1BQUksR0FBRyxHQUFHO0FBRVYsV0FBVSxVQUFVLE9BQU8saUJBQWtCLENBQUMsR0FBRyxJQUFHLElBQ3BEO0FBQ0ksV0FBTztBQUFBO0FBRVgsUUFBTyxPQUFPLE9BQU8sY0FBZSxDQUFDLEdBQUcsSUFDeEM7QUFDSSxXQUFPLENBQUMsR0FBRSxFQUFDO0FBQUE7QUFFZixVQUFRLE9BQU8sWUFBWTtBQUFBLFNBRWxCO0FBQ0QsZUFBUyxVQUFVLElBQUksR0FBRyxVQUFVLE9BQU8sT0FBUyxXQUFXLFVBQVUsSUFBSSxPQUFPLFNBQVMsSUFBSSxPQUFPLFFBQVUsV0FBVyxZQUFZLE1BQU0sR0FDL0k7QUFDSSxZQUFJLE9BQU87QUFDWCxnQkFBUSxLQUFLLENBQUM7QUFDZCxZQUFJLE9BQU8sU0FBUSxHQUFFLENBQUMsR0FDdEI7QUFDSSxpQkFBTyxLQUFLLElBQUksQ0FBQyxFQUFFLE9BQU8sT0FBTyxHQUFFLENBQUMsQ0FBQztBQUNyQyxjQUFJLFFBQVEsS0FBSyxPQUFPLFVBQVUsT0FDbEM7QUFDSSxtQkFBTztBQUFBLFVBQ1g7QUFBQSxRQUNKO0FBQ0EsWUFBSSxLQUFJLEdBQUksS0FBSyxPQUFPLEVBQUUsWUFBWSxPQUFPLFdBQVcsQ0FBQyxTQUFRLFFBQVEsQ0FBQyxHQUMxRTtBQUNJLGtCQUFRLEdBQUUsUUFBTyxLQUFJLE9BQU0sU0FBUSxNQUFNO0FBQUEsUUFDN0M7QUFDQSxnQkFBUSxJQUFJO0FBQUEsTUFDaEI7QUFDQTtBQUFBLFNBQ0M7QUFDRCxXQUFLLEtBQUssUUFDVjtBQUNJLFlBQUksT0FBTztBQUNYLGdCQUFRLEtBQUssQ0FBQztBQUNkLFlBQUksT0FBTyxTQUFRLEdBQUUsQ0FBQyxHQUN0QjtBQUNJLGlCQUFPLEtBQUssSUFBSSxDQUFDLEVBQUUsT0FBTyxPQUFPLEdBQUUsQ0FBQyxDQUFDO0FBQ3JDLGNBQUksUUFBUSxLQUFLLE9BQU8sVUFBVSxPQUNsQztBQUNJLG1CQUFPO0FBQUEsVUFDWDtBQUFBLFFBQ0o7QUFDQSxZQUFJLEtBQUksR0FBSSxLQUFLLE9BQU8sRUFBRSxZQUFZLE9BQU8sV0FBVyxDQUFDLFNBQVEsUUFBUSxDQUFDLEdBQzFFO0FBQ0ksa0JBQVEsR0FBRSxRQUFPLEtBQUksT0FBTSxTQUFRLE1BQU07QUFBQSxRQUM3QztBQUNBLGdCQUFRLElBQUk7QUFBQSxNQUNoQjtBQUNBO0FBQUE7QUFHUixTQUFPO0FBQUE7QUFHWCxlQUFpQixHQUNqQjtBQUNJLFdBQVMsS0FBSyxHQUNkO0FBQUE7QUFFQSxRQUFLLGlCQUFrQixDQUFDLFFBQVEsS0FDaEM7QUFDSSxRQUFJO0FBRUosYUFBUyxLQUFLLElBQUksR0FBRztBQUNyQixXQUFPLEtBQUssU0FBUyxnQkFBaUIsQ0FBQyxHQUFHLEdBQUcsR0FDN0M7QUFDSSxhQUFPLEtBQUssTUFBTSxHQUFFLE1BQU07QUFBQSxNQUMzQixLQUFLLElBQUksQ0FBQztBQUFBO0FBR2pCLFFBQUssa0JBQW1CLENBQUMsUUFBUSxNQUNqQztBQUNJLFFBQUk7QUFFSixhQUFTLEtBQUssSUFBSSxJQUFJO0FBQ3RCLFdBQU8sS0FBSyxTQUFTLGdCQUFpQixDQUFDLEdBQUcsR0FBRyxHQUM3QztBQUNJLGFBQU8sS0FBSyxVQUFVLEdBQUUsTUFBTTtBQUFBLE1BQy9CLEtBQUssSUFBSSxDQUFDO0FBQUE7QUFHakIsUUFBSyxtQkFBb0IsQ0FBQyxRQUFRLEtBQ2xDO0FBQ0ksUUFBSTtBQUVKLGFBQVMsS0FBSyxJQUFJLEdBQUc7QUFDckIsV0FBTyxLQUFLLFNBQVMsZ0JBQWlCLENBQUMsR0FBRyxHQUFHLEdBQzdDO0FBQ0ksYUFBTyxLQUFLLE1BQU0sR0FBRSxNQUFNO0FBQUEsTUFDM0IsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUdqQixRQUFLLHNCQUF1QixDQUFDLFFBQVEsS0FBSyxLQUMxQztBQUNJLFFBQUksUUFBUTtBQUVaLGFBQVMsS0FBSyxJQUFJLEdBQUc7QUFDckIsYUFBUyxLQUFLLElBQUksR0FBRztBQUNyQixXQUFPLEtBQUssU0FBUyxnQkFBaUIsQ0FBQyxHQUFHLEdBQUcsR0FDN0M7QUFDSSxhQUFPLEtBQUssTUFBTSxHQUFFLE1BQU0sS0FBSyxLQUFLLE1BQU0sR0FBRSxNQUFNO0FBQUEsTUFDbkQsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUdqQixRQUFLLHVCQUF3QixDQUFDLFFBQVEsTUFBTSxLQUM1QztBQUNJLFFBQUksUUFBUTtBQUVaLGFBQVMsS0FBSyxJQUFJLElBQUk7QUFDdEIsYUFBUyxLQUFLLElBQUksR0FBRztBQUNyQixXQUFPLEtBQUssU0FBUyxnQkFBaUIsQ0FBQyxHQUFHLEdBQUcsR0FDN0M7QUFDSSxhQUFPLEtBQUssVUFBVSxHQUFFLE1BQU0sS0FBSyxLQUFLLE1BQU0sR0FBRSxNQUFNO0FBQUEsTUFDdkQsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUdqQixRQUFLLHNCQUF1QixDQUFDLFFBQVEsTUFDckM7QUFDSSxXQUFPLFFBQVEsUUFBTyxjQUFjLENBQUMsR0FBRyxHQUN4QztBQUNJLGFBQU87QUFBQSxLQUNWO0FBQUE7QUFHTCxRQUFLLHVCQUF3QixDQUFDLEdBQUcsR0FDakM7QUFDSSxXQUFPLEtBQUssTUFBTSxFQUFFLEtBQUssR0FBRyxHQUFFLENBQUM7QUFBQTtBQUduQyxRQUFLLG1CQUFvQixDQUFDLEdBQUcsR0FDN0I7QUFDSSxRQUFJO0FBRUosVUFBTSxhQUFhLFFBQ25CO0FBQ0ksYUFBUSxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxPQUFPLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLFNBQVM7QUFBQSxJQUNyRSxPQUVBO0FBQ0ksYUFBTztBQUFBO0FBQUE7QUFJZixRQUFLLGlCQUFrQixDQUFDLEdBQ3hCO0FBQ0ksV0FBTyxPQUFPLENBQUM7QUFBQTtBQUduQixTQUFPO0FBQUEsRUFDUjtBQUdILGNBQWUsQ0FBQyxRQUFRLFNBQVMsY0FDakM7QUFDSSxNQUFJO0FBRUosT0FBSyxRQUNMO0FBQ0k7QUFBQSxFQUNKO0FBQ0EsUUFBTSxXQUFXLE9BQU8sUUFBUSxTQUFTLFlBQ3pDO0FBQ0k7QUFBQSxFQUNKO0FBQ0EsYUFBVyxZQUFhLFVBQ3hCO0FBQ0ksY0FBVSxRQUFRLE1BQU0sR0FBRztBQUFBLEVBQy9CO0FBQ0EsT0FBSyxDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQ3RCLFNBQU8sR0FBRyxRQUNWO0FBQ0ksYUFBUyxPQUFPLEdBQUcsTUFBTTtBQUN6QixVQUFNLFVBQVUsT0FDaEI7QUFDSSxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFDQSxTQUFPO0FBQUE7QUFFWCxJQUFlLGdCQUFDLE1BQVUsSUFBTzs7O0FDdE1qQzs7O0FDSkEsSUFBSSxPQUFNLEVBQUMsY0FBZSxDQUFDLEdBQUc7QUFBQyxTQUFPLEtBQUssY0FBYyxFQUFFLFdBQVcsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFBRTtBQUU3RixJQUFJO0FBQUosSUFBVTtBQUFWLElBQWdCO0FBS2hCLFFBQU8sWUFBSTtBQUNYLGFBQVksWUFBSTtBQUdoQixlQUFpQixHQUNqQjtBQUNJLFdBQVMsS0FBSyxDQUFDLEtBQ2Y7QUFDSSxRQUFJLE9BQU8sS0FBSyxNQUFNO0FBRXRCLFNBQUssYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJO0FBQzNDLFNBQUssZUFBZSxLQUFLLGFBQWEsS0FBSyxJQUFJO0FBQy9DLFNBQUssV0FBVyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBQ3ZDLFNBQUssZ0JBQWdCLEtBQUssY0FBYyxLQUFLLElBQUk7QUFDakQsU0FBSyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUk7QUFDM0MsU0FBSyxVQUFVLEtBQUssUUFBUSxLQUFLLElBQUk7QUFDckMsU0FBSyxXQUFXLEtBQUssU0FBUyxLQUFLLElBQUk7QUFDdkMsU0FBSyxPQUFPLE1BQUssRUFBQyxPQUFNLFFBQU8sVUFBUyxFQUFDLENBQUM7QUFDMUMsUUFBSSxPQUFPLEtBQUksS0FBSyxJQUFJLEtBQUs7QUFDN0IsYUFBUyxVQUFVLEVBQUcsVUFBVSxLQUFLLFFBQVEsV0FDN0M7QUFDSSxhQUFPLEtBQUs7QUFDWixVQUFJLEtBQUssTUFDVDtBQUNJO0FBQUEsTUFDSjtBQUNBLFlBQU0sTUFBSyxFQUFDLE9BQU0sWUFBVyxNQUFLLEtBQUssS0FBSSxDQUFDO0FBQzVDLFVBQUksT0FBTztBQUNYLFVBQUksaUJBQWlCLFNBQVEsS0FBSyxPQUFPO0FBQ3pDLFVBQUssS0FBSyxTQUFTLE1BQ25CO0FBQ0ksZ0JBQVEsTUFBSyxRQUFPLEVBQUMsT0FBTSxjQUFhLE1BQUssZ0JBQVEsTUFBTSxLQUFLLEtBQUssRUFBQyxDQUFDO0FBQ3ZFLFlBQUksWUFBWSxLQUFLO0FBQUEsTUFDekI7QUFDQSxXQUFLLEtBQUssWUFBWSxHQUFHO0FBQUEsSUFDN0I7QUFDQSxTQUFLLE9BQU8sS0FBSyxLQUFLLFVBQVU7QUFDaEMsU0FBSyxLQUFLLGlCQUFpQixXQUFVLEtBQUssU0FBUztBQUNuRCxTQUFLLEtBQUssaUJBQWlCLFlBQVcsS0FBSyxVQUFVO0FBQ3JELFNBQUssS0FBSyxpQkFBaUIsYUFBWSxLQUFLLE9BQU87QUFBQTtBQUd2RCxRQUFLLFVBQVUsaUJBQWtCLEdBQ2pDO0FBQ0ksUUFBSTtBQUVKLFNBQUssTUFBTTtBQUNWLElBQUMsS0FBSyxRQUFRLFFBQU8sS0FBSyxLQUFLLE9BQU87QUFDdkMsV0FBTyxLQUFLLE9BQU87QUFBQTtBQUd2QixRQUFLLFVBQVUsbUJBQW9CLEdBQ25DO0FBQ0ksU0FBSyxZQUFZLFNBQVM7QUFDMUIsV0FBTyxLQUFLLEtBQUssTUFBTTtBQUFBO0FBRzNCLFFBQUssVUFBVSxrQkFBbUIsR0FDbEM7QUFDSSxRQUFJLFNBQVM7QUFFYixTQUFLLE1BQU07QUFDWCxZQUFTLFVBQVEsS0FBSyxjQUFjLGVBQWUsVUFBUSxRQUFRLFdBQVcsYUFBYSxRQUFRLElBQUksWUFBWTtBQUFBO0FBR3ZILFFBQUssVUFBVSxxQkFBc0IsQ0FBQyxPQUN0QztBQUNJLFdBQU8sS0FBSyxPQUFPLE1BQU0sUUFBTyxFQUFDLGlCQUFnQixNQUFLLENBQUM7QUFBQTtBQUczRCxRQUFLLFVBQVUsd0JBQXlCLENBQUMsT0FDekM7QUFDSSxRQUFJO0FBRUosUUFBSSxLQUFLLFdBQVcsTUFBTSxpQkFBaUIsT0FBTyxNQUFNLGNBQWMsVUFBVSxTQUFTLE9BQU8sSUFBSSxZQUNwRztBQUNJLFdBQUssTUFBTSxNQUFNLEVBQUMsT0FBTSxNQUFLLENBQUM7QUFDOUIsb0JBQWMsS0FBSztBQUFBLElBQ3ZCO0FBQUE7QUFHSixRQUFLLFVBQVUsa0JBQW1CLEdBQ2xDO0FBQ0ksV0FBTyxLQUFLLE9BQU8sS0FBSyxLQUFLLFlBQVcsRUFBQyxVQUFTLEtBQUksQ0FBQztBQUFBO0FBRzNELFFBQUssVUFBVSxtQkFBb0IsQ0FBQyxNQUFNLENBQUMsR0FDM0M7QUFDSSxRQUFJO0FBRUosUUFBSyxLQUFLLFNBQVMsTUFDbkI7QUFDSSxXQUFLLE1BQU0sTUFBTSxFQUFDLE9BQU0sTUFBSyxDQUFDO0FBQzlCLGFBQU8sS0FBSztBQUNaLFVBQUksSUFBSSxVQUFVLE9BQ2xCO0FBQ0ksYUFBSyxLQUFLLE1BQU07QUFBQSxNQUNwQjtBQUFBLElBQ0osT0FFQTtBQUNJLFVBQUksSUFBSSxVQUFVLE9BQ2xCO0FBQ0ksWUFBSSxLQUFLLG9CQUFvQixLQUFLLFVBQVUsVUFBVyxZQUN2RDtBQUNJLGVBQUssVUFBVSxNQUFNO0FBQUEsUUFDekI7QUFBQSxNQUNKO0FBQUE7QUFFSixXQUFPO0FBQUE7QUFHWCxRQUFLLFVBQVUseUJBQTBCLENBQUMsT0FBTyxLQUNqRDtBQUNJLFFBQUksVUFBVSxLQUFLLE9BQ25CO0FBQ0ksYUFBTyxLQUFLO0FBQ1osVUFBSSxJQUFJLFVBQVUsT0FDbEI7QUFDSSxhQUFLLEtBQUssTUFBTTtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUNBLFdBQU87QUFBQTtBQUdYLFFBQUssVUFBVSxvQkFBcUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxHQUNsRDtBQUNJLFFBQUksVUFBVSxVQUFVO0FBRXhCLFVBQU0sUUFBUSxPQUNkO0FBQ0k7QUFBQSxJQUNKO0FBQ0EsUUFBSyxLQUFLLFNBQVMsTUFDbkI7QUFDSSxpQkFBVztBQUNYLFdBQUssTUFBTSxNQUFNLEVBQUMsT0FBTSxNQUFLLENBQUM7QUFBQSxJQUNsQztBQUNDLElBQUMsS0FBSyxZQUFZLFFBQU8sS0FBSyxTQUFTLFVBQVUsT0FBTyxVQUFVO0FBQ25FLFNBQUssV0FBVztBQUNoQixTQUFLLFNBQVMsVUFBVSxJQUFJLFVBQVU7QUFDdEMsUUFBSSxZQUFZLElBQUksVUFDcEI7QUFDSSxhQUFPLEtBQUs7QUFDWixhQUFPLEtBQUssU0FBUyxNQUFLLEdBQUc7QUFBQSxJQUNqQztBQUFBO0FBR0osUUFBSyxVQUFVLHNCQUF1QixDQUFDLE1BQU0sTUFBTSxDQUFDLEdBQ3BEO0FBQ0ksUUFBSSxJQUFJLE9BQU87QUFFZixZQUFRLEtBQUssS0FBSztBQUNsQixRQUFJLE9BQ0o7QUFDSSxVQUFJLEtBQUssT0FDVDtBQUNJLGFBQUssTUFBTSxNQUFNLEVBQUMsT0FBTSxNQUFLLENBQUM7QUFDOUIsZUFBTyxLQUFLO0FBQUEsTUFDaEI7QUFDQSxXQUFLLEtBQUssc0JBQXNCO0FBQ2hDLFdBQUssS0FBSyxXQUFXLHNCQUFzQjtBQUMzQyxVQUFJLFFBQVE7QUFDWixVQUFJLFNBQVM7QUFDYixVQUFJLElBQUksR0FBRztBQUNYLFVBQUksSUFBSSxHQUFHLE1BQU0sR0FBRztBQUNwQixVQUFJLFFBQVE7QUFDWixXQUFLLFFBQVEsY0FBTSxLQUFLLEdBQUc7QUFDM0IsVUFBSSxJQUFJLG9CQUFvQixPQUM1QjtBQUNJLGVBQU8sS0FBSyxLQUFLLE1BQU07QUFBQSxNQUMzQjtBQUFBLElBQ0o7QUFBQTtBQUdKLFFBQUssVUFBVSxvQkFBcUIsQ0FBQyxNQUNyQztBQUNJLFFBQUksS0FBSyxPQUNUO0FBQ0ksV0FBSyxNQUFNLE1BQU0sRUFBQyxPQUFNLE1BQUssQ0FBQztBQUM5QixvQkFBYyxLQUFLO0FBQUEsSUFDdkIsT0FFQTtBQUNJLGFBQU8sS0FBSyxTQUFTLE1BQUssRUFBQyxpQkFBZ0IsTUFBSyxDQUFDO0FBQUE7QUFBQTtBQUl6RCxRQUFLLFVBQVUsMEJBQTJCLENBQUMsTUFBTSxPQUNqRDtBQUFBO0FBRUEsUUFBSyxVQUFVLHdCQUF5QixDQUFDLE1BQ3pDO0FBQUE7QUFFQSxRQUFLLFVBQVUsMEJBQTJCLEdBQzFDO0FBQ0ksUUFBSTtBQUVKLFdBQU8sS0FBSyxPQUFRLEtBQUssWUFBWSxPQUFPLEtBQUssU0FBUyxrQkFBa0IsV0FBVyxFQUFDLFVBQVMsTUFBSyxpQkFBZ0IsTUFBSyxDQUFDO0FBQUE7QUFHaEksUUFBSyxVQUFVLDJCQUE0QixHQUMzQztBQUNJLFFBQUk7QUFFSixXQUFPLEtBQUssT0FBUSxLQUFLLFlBQVksT0FBTyxLQUFLLFNBQVMsY0FBYyxXQUFXLEVBQUMsVUFBUyxNQUFLLGlCQUFnQixNQUFLLENBQUM7QUFBQTtBQUc1SCxRQUFLLFVBQVUsdUJBQXdCLENBQUMsT0FDeEM7QUFDSSxRQUFJLE9BQU8sS0FBSztBQUVoQixVQUFNLGdCQUFRLFNBQVMsS0FBSyxFQUFFO0FBQzlCLFVBQU0sZ0JBQVEsU0FBUyxLQUFLLEVBQUU7QUFDOUIsWUFBUSxnQkFBUSxTQUFTLEtBQUssRUFBRTtBQUVoQyxZQUFRO0FBQUEsV0FFQztBQUFBLFdBQ0E7QUFDRCxlQUFPLFdBQVUsT0FBTSxLQUFLLE9BQU8sS0FBSyxLQUFLLFdBQVUsRUFBQyxVQUFTLE1BQUssaUJBQWdCLE1BQUssQ0FBQyxDQUFDO0FBQUEsV0FFNUY7QUFBQSxXQUNBO0FBQ0QsZUFBTyxXQUFVLE9BQU0sS0FBSyxPQUFPLEtBQUssS0FBSyxZQUFXLEVBQUMsVUFBUyxNQUFLLGlCQUFnQixNQUFLLENBQUMsQ0FBQztBQUFBLFdBRTdGO0FBQUEsV0FDQTtBQUFBLFdBQ0E7QUFDRCxlQUFPLFdBQVUsT0FBTSxLQUFLLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxXQUVsRDtBQUNELGVBQU8sV0FBVSxPQUFNLEtBQUssTUFBTSxDQUFDO0FBQUEsV0FFbEM7QUFDRCxlQUFPLFdBQVUsT0FBTSxLQUFLLGNBQWMsQ0FBQztBQUFBLFdBRTFDO0FBQ0QsZUFBTyxXQUFVLE9BQU0sS0FBSyxhQUFhLENBQUM7QUFBQTtBQUFBO0FBTXRELFFBQUssVUFBVSxxQkFBc0IsQ0FBQyxHQUN0QztBQUNJLFdBQU8sS0FBSyxPQUFPLEVBQUUsTUFBTTtBQUFBO0FBRy9CLFNBQU87QUFBQSxFQUNSO0FBRUgsSUFBZTs7O0FDL1BmO0FBQ0E7QUFMQSxJQUFJLE9BQU0sRUFBQyxjQUFlLENBQUMsR0FBRztBQUFDLFNBQU8sS0FBSyxjQUFjLEVBQUUsV0FBVyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7QUFBQSxHQUFJLGNBQWUsQ0FBQyxHQUFHO0FBQUMsU0FBTyxLQUFLLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxTQUFPLEtBQUssWUFBWTtBQUFBLEdBQUksWUFBYSxDQUFDLEdBQUUsR0FBRztBQUFDLGlCQUFlLE1BQU0sbUJBQW1CLE1BQU0sWUFBWSxFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUUsQ0FBQyxLQUFLO0FBQUEsR0FBSSxnQkFBaUIsQ0FBQyxHQUFHO0FBQUMsZ0JBQWMsTUFBTTtBQUFBLEdBQWEsZUFBZ0IsQ0FBQyxHQUFHO0FBQUMsU0FBTyxNQUFJLE1BQU0sTUFBSSxRQUFRLE1BQUksYUFBYSxNQUFJLFlBQVksTUFBTyxZQUFZLE9BQU8sS0FBSyxDQUFDLEVBQUUsV0FBVztBQUFBLEVBQUU7QUFFcmUsSUFBSTtBQUFKLElBQWM7QUFBZCxJQUFvQjtBQUFwQixJQUF5QjtBQUF6QixJQUFnQztBQUFoQyxJQUEwQztBQUExQyxJQUFnRDtBQUFoRCxJQUFzRDtBQUt0RCxnQkFBaUIsQ0FBQyxHQUNsQjtBQUNJLE1BQUksU0FBUyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsT0FBTyxPQUFPLEdBQUcsUUFBUSxRQUFRLFNBQVMsS0FBSyxTQUFTLEdBQUcsS0FBSyxHQUFHLE1BQU0sZUFBZSxNQUFNLFVBQVUsT0FBTyxZQUFZLFNBQVMsSUFBSSxHQUFHLEdBQUcsT0FBTyxJQUFJLFNBQVMsR0FBRyxPQUFPLFFBQVE7QUFFbk4sT0FBSyxHQUNMO0FBQ0ksV0FBTztBQUFBLEVBQ1g7QUFDQSxNQUFJLE1BQU0sSUFDVjtBQUNJLFdBQU87QUFBQSxFQUNYO0FBQ0EsVUFBUTtBQUNSLFlBQVU7QUFDVixVQUFRO0FBQ1IsUUFBTTtBQUNOLGlCQUFnQixDQUFDLEdBQ2pCO0FBQ0ksV0FBUSxLQUFLLE9BQU8sRUFBRSxFQUFFLFNBQVMsS0FBSztBQUFBO0FBRTFDLG9CQUFtQixDQUFDLEdBQ3BCO0FBQ0ksV0FBUSxLQUFLLGVBQWdCLE1BQU8sWUFBWSxFQUFFLFlBQVksU0FBUztBQUFBO0FBRTNFLG9CQUFtQixDQUFDLElBQUcsSUFDdkI7QUFDSSxRQUFJLEtBQUssSUFBRyxNQUFLLElBQUcsSUFBSSxJQUFHLElBQUksSUFBSSxJQUFJO0FBRXZDLFNBQUssR0FBRTtBQUNQLFNBQUs7QUFDTCxTQUFJO0FBQ0osV0FBTyxLQUFJLE1BQU0sR0FBRSxRQUFPLEtBQzFCO0FBQ0ksWUFBSztBQUNMLFlBQUs7QUFBQSxJQUNUO0FBQ0EsV0FBTyxLQUFJLE1BQU0sR0FBRSxRQUFPLEtBQzFCO0FBQ0ksWUFBSztBQUFBLElBQ1Q7QUFDQSxTQUFJO0FBQ0osV0FBTTtBQUNOLFVBQU07QUFDTixXQUFPLEtBQUksSUFDWDtBQUNJLFVBQUksT0FBTSxNQUFNLEdBQUUsUUFBTyxPQUFPLEdBQUUsS0FBSSxPQUFPLEtBQzdDO0FBQ0ksYUFBSyxLQUFJO0FBQ1QsZUFBTyxLQUFLLE1BQU0sR0FBRSxRQUFRLEtBQzVCO0FBQ0ksZ0JBQU07QUFBQSxRQUNWO0FBQ0EsWUFBSSxHQUFFLFFBQVEsS0FDZDtBQUNJLGdCQUFLO0FBQ0w7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUNBLGFBQU8sR0FBRSxRQUFPO0FBQ2hCLFlBQUssR0FBRTtBQUNQLFdBQUssT0FBTyxRQUFPLEdBQUUsUUFBTyxLQUM1QjtBQUNJLFlBQUksS0FBSSxLQUFLLEtBQUssR0FBRSxLQUFJLE9BQU8sS0FDL0I7QUFDSSxnQkFBSztBQUFBLFFBQ1Q7QUFDQSxlQUFNO0FBQUEsTUFDVjtBQUNBLFlBQUs7QUFDTCxhQUFPLEdBQUUsUUFBTztBQUFBLElBQ3BCO0FBQ0EsU0FBSztBQUNMLGFBQVMsVUFBVSxLQUFJLEdBQUcsVUFBVSxHQUFJLFdBQVcsVUFBVSxLQUFJLEtBQUksS0FBSSxJQUFLLFdBQVcsWUFBWSxPQUFNLElBQzNHO0FBQ0ksWUFBTTtBQUFBLElBQ1Y7QUFDQSxVQUFNO0FBQ04sUUFBSSxLQUFJLElBQ1I7QUFDSSxVQUFJLFFBQVEsSUFBRyxHQUFFLFVBQVUsRUFBQyxDQUFDO0FBQzdCLFFBQUUsUUFBUSxFQUFFO0FBQ1osYUFBTztBQUFBLElBQ1gsT0FFQTtBQUNJLGFBQU8sQ0FBQyxFQUFFO0FBQUE7QUFBQTtBQUdsQixrQkFBZ0I7QUFDaEIsVUFBUSxFQUFFLE1BQU0sT0FBTyxFQUFFLGVBQWdCLENBQUMsSUFDMUM7QUFDSSxZQUFRLE1BQU0sS0FBSyxFQUFDO0FBQUEsR0FDdkI7QUFDRCxNQUFJLE1BQU0sV0FBVyxHQUNyQjtBQUNJLFdBQU87QUFBQSxFQUNYLFdBQ1MsTUFBTSxXQUFXLEdBQzFCO0FBQ0ksWUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFBQSxFQUM1QixPQUVBO0FBQ0ksV0FBTyxNQUFNLEdBQUcsbUJBQW1CLEtBQ25DO0FBQ0ksdUJBQWlCO0FBQUEsSUFDckI7QUFBQTtBQUVKLFVBQVEsQ0FBQyxFQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsY0FBYSxDQUFDO0FBQy9CLHVCQUFzQixDQUFDLEdBQ3ZCO0FBQ0ksUUFBSSxJQUFHLElBQUc7QUFFVixRQUFJLENBQUM7QUFDTCxRQUFJLFFBQU8sS0FBSSxLQUFLLEVBQUUsQ0FBQztBQUN2QixhQUFTLFdBQVcsRUFBRyxXQUFXLE1BQUssUUFBUSxZQUMvQztBQUNJLFdBQUksTUFBSztBQUNULFFBQUUsTUFBSztBQUFBLElBQ1g7QUFDQSxNQUFFLElBQUksS0FBSSxLQUFLLEVBQUUsQ0FBQztBQUNsQixNQUFFLElBQUk7QUFDTixRQUFJLE1BQU0sU0FBUyxHQUNuQjtBQUNJLFdBQUksTUFBTSxNQUFNLFNBQVM7QUFDekIsVUFBSSxRQUFRLEdBQUUsQ0FBQyxHQUNmO0FBQ0ksV0FBRSxFQUFFLElBQUk7QUFDUixXQUFFLEVBQUUsS0FBSyxDQUFDO0FBQUEsTUFDZCxPQUVBO0FBQ0ksV0FBRSxFQUFFLEdBQUUsS0FBSztBQUFBO0FBQUEsSUFFbkI7QUFDQSxXQUFPO0FBQUE7QUFFWCxnQkFBZSxDQUFDLElBQ2hCO0FBQ0ksU0FBSyxNQUFLLE9BQU8sR0FBRSxLQUFLLGVBQWUsS0FDdkM7QUFDSSxVQUFJLEdBQUUsR0FBRSxTQUFTLE9BQU8sS0FDeEI7QUFDSSxlQUFPLEdBQUUsT0FBTyxHQUFFLEdBQUUsU0FBUyxDQUFDO0FBQUEsTUFDbEM7QUFDQSxhQUFPLEdBQUUsT0FBTyxDQUFDLEVBQUUsVUFBVTtBQUFBLElBQ2pDO0FBQ0EsV0FBTztBQUFBO0FBRVgsV0FBUyxFQUFDLE1BQU8sTUFBSyxNQUFPLE1BQUssT0FBUSxNQUFLO0FBQy9DLGtCQUFpQixDQUFDLElBQ2xCO0FBQ0ksUUFBSSxPQUFPLFFBQU8sV0FDbEI7QUFDSSxhQUFPLE9BQU87QUFBQSxJQUNsQjtBQUNBLFNBQUssTUFBSyxPQUFPLEdBQUUsS0FBSyxlQUFlLEtBQ3ZDO0FBQ0ksYUFBTyxJQUFJLEVBQUM7QUFBQSxJQUNoQixZQUNVLE1BQUssT0FBTyxHQUFFLEdBQUUsU0FBUyxLQUFLLGVBQWUsS0FDdkQ7QUFDSSxhQUFPLEdBQUUsT0FBTyxHQUFFLEdBQUUsU0FBUyxDQUFDO0FBQUEsSUFDbEM7QUFDQSxRQUFJLE1BQU0sS0FBSyxFQUFDLEdBQ2hCO0FBQ0ksYUFBTyxXQUFXLEVBQUM7QUFBQSxJQUN2QjtBQUNBLFFBQUksSUFBSSxLQUFLLEVBQUMsR0FDZDtBQUNJLGFBQU8sU0FBUyxFQUFDO0FBQUEsSUFDckI7QUFDQSxXQUFPO0FBQUE7QUFFWCxtQkFBa0IsQ0FBQyxHQUFHLElBQUcsSUFDekI7QUFDSSxRQUFJLFFBQVEsRUFBRSxDQUFDLEdBQ2Y7QUFDSSxZQUFNLE1BQUssT0FDWDtBQUNJLFlBQUssS0FBSSxLQUFLLEVBQUUsQ0FBQyxNQUFNLE9BQWUsT0FBUixLQUM5QjtBQUNJLFlBQUUsRUFBRSxJQUFJO0FBQ1IsWUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQUEsUUFDZjtBQUNBLGVBQU8sRUFBRSxFQUFFLEtBQUssTUFBTSxFQUFDLENBQUM7QUFBQSxNQUM1QixPQUVBO0FBQ0ksZUFBTyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUMsS0FBSyxNQUFNLEVBQUM7QUFBQTtBQUFBLElBRTlDLE9BRUE7QUFDSSxRQUFFLEVBQUUsSUFBSSxFQUFDLEtBQUssTUFBTSxFQUFDO0FBQ3JCLGFBQU8sRUFBRSxJQUFJLElBQUksRUFBQztBQUFBO0FBQUE7QUFHMUIsbUJBQWtCLENBQUMsR0FBRyxJQUFHLElBQ3pCO0FBQ0ksUUFBSSxJQUFHO0FBRVAsUUFBSSxDQUFDO0FBQ0wsUUFBSyxNQUFLLE1BQ1Y7QUFDSSxVQUFJLENBQUM7QUFBQSxJQUNUO0FBQ0EsUUFBSSxRQUFRLEVBQUUsQ0FBQyxHQUNmO0FBQ0ksVUFBSSxLQUFJLEtBQUssRUFBRSxDQUFDLE1BQU0sS0FDdEI7QUFDSSxVQUFFLEVBQUUsSUFBSTtBQUNSLFVBQUUsRUFBRSxLQUFLLENBQUM7QUFBQSxNQUNkLE9BRUE7QUFDSSxhQUFJLEtBQUksS0FBSyxFQUFFLENBQUM7QUFDaEIsbUJBQVcsQ0FBQztBQUNaLFVBQUUsRUFBRSxNQUFLO0FBQUE7QUFBQSxJQUVqQixPQUVBO0FBQ0ksUUFBRSxFQUFFLEVBQUUsS0FBSztBQUFBO0FBRWYsUUFBSyxNQUFLLE1BQ1Y7QUFDSSxRQUFFLElBQUksRUFBQyxLQUFLLE1BQU0sRUFBQztBQUFBLElBQ3ZCLE9BRUE7QUFDSSxRQUFFLEtBQUssTUFBTSxFQUFDLENBQUM7QUFBQTtBQUVuQixXQUFPO0FBQUE7QUFFWCxvQkFBbUIsQ0FBQyxJQUFHLElBQUcsSUFDMUI7QUFDSSxRQUFJLEdBQUc7QUFFUCxRQUFLLE1BQUssTUFDVjtBQUNJLFVBQUksS0FBSSxLQUFLLEtBQUs7QUFDbEIsaUJBQVcsRUFBRTtBQUNiLFFBQUUsV0FBVztBQUNiLFVBQUksS0FBSSxFQUFFLE1BQU0sVUFDaEI7QUFDSSxlQUFPLE1BQU0sS0FBSyxFQUFDLEdBQUUsT0FBTyxHQUFFLElBQUUsRUFBQyxHQUFFLEdBQUUsR0FBQyxDQUFDO0FBQUEsTUFDM0MsV0FDUyxLQUFJLEVBQUUsR0FDZjtBQUNJLFlBQUksUUFBUSxFQUFFLENBQUMsS0FBSyxLQUFJLEtBQUssRUFBRSxDQUFDLE1BQU0sS0FDdEM7QUFDSSxZQUFFLEVBQUUsSUFBSTtBQUNSLFlBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUFBLFFBQ2Y7QUFDQSxnQkFBUSxLQUFLLE9BQU8sRUFBRSxJQUFJLGFBQWEsSUFDdkM7QUFDSSxnQkFBTSxJQUFJO0FBQ1YsY0FBSSxLQUFJLEtBQUssS0FBSztBQUFBLFFBQ3RCO0FBQ0EsZUFBTyxPQUFPLEdBQUUsSUFBRSxFQUFDO0FBQUEsTUFDdkIsT0FFQTtBQUNJLFlBQUksVUFDSjtBQUNJLFlBQUUsSUFBSTtBQUFBLFFBQ1Y7QUFDQSxlQUFPLE9BQU8sR0FBRSxJQUFFLEVBQUM7QUFBQTtBQUFBLElBRTNCO0FBQUE7QUFFSixvQkFBbUIsQ0FBQyxJQUNwQjtBQUNJLFFBQUksSUFBRyxNQUFNLE1BQU0sSUFBRyxJQUFHO0FBRXpCLFNBQUk7QUFDSixXQUFPLEdBQUUsUUFBTyxLQUNoQjtBQUNJLFlBQUs7QUFBQSxJQUNUO0FBQ0EsVUFBTSxHQUFFLE9BQU0sT0FDZDtBQUNJLGFBQU8sQ0FBQyxHQUFFLE1BQUssTUFBSyxLQUFLO0FBQUEsSUFDN0I7QUFDQSxTQUFJO0FBQ0osU0FBSTtBQUNKLFFBQUksR0FBRSxRQUFPLEtBQ2I7QUFDSSxhQUFPLENBQUMsR0FBRSxNQUFLLE1BQUssS0FBSztBQUFBLElBQzdCO0FBQ0EsV0FBTztBQUNQLFdBQU87QUFDUCxRQUFJLEdBQUUsUUFBTyxLQUNiO0FBQ0ksYUFBTztBQUNQLFlBQUs7QUFDTCxZQUFLO0FBQUEsSUFDVDtBQUNBLFdBQVEsR0FBRSxPQUFNLE1BQ2hCO0FBQ0ksVUFBSSxHQUFFLFFBQU8sT0FBTyxHQUFFLEtBQUksT0FBTyxRQUFRLE1BQ3pDO0FBQ0k7QUFBQSxNQUNKO0FBQ0EsWUFBSyxHQUFFO0FBQ1AsWUFBSztBQUNMLFVBQUksUUFBUSxHQUFFLEtBQUksT0FBTyxLQUN6QjtBQUNJO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFDQSxTQUFLLE1BQ0w7QUFDSSxXQUFJLEdBQUUsVUFBVTtBQUFBLElBQ3BCO0FBQ0EsV0FBTyxHQUFFLFFBQU8sS0FDaEI7QUFDSSxZQUFLO0FBQUEsSUFDVDtBQUNBLFNBQUk7QUFDSixRQUFJLEdBQUUsUUFBTyxLQUNiO0FBQ0ksYUFBTztBQUNQLFlBQUs7QUFDTCxZQUFLO0FBQUEsSUFDVDtBQUNBLFdBQVEsR0FBRSxPQUFNLE1BQ2hCO0FBQ0ksWUFBSyxHQUFFO0FBQ1AsWUFBSztBQUNMLFVBQUksUUFBUSxHQUFFLEtBQUksT0FBTyxPQUFPLEdBQUUsVUFBVSxFQUFFLFdBQVcsSUFDekQ7QUFDSTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQ0EsUUFBSSxHQUFFLEtBQUksT0FBTyxRQUFRLE1BQ3pCO0FBQ0ksVUFBSyxNQUFLLE1BQ1Y7QUFDSSxhQUFJLEdBQUUsVUFBVTtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUNBLFFBQUksT0FBTSxJQUNWO0FBQ0ksV0FBSTtBQUFBLElBQ1I7QUFDQSxRQUFJLE9BQU0sSUFDVjtBQUNJLFdBQUk7QUFBQSxJQUNSO0FBQ0EsV0FBTyxDQUFDLElBQUUsSUFBRSxJQUFFLElBQUk7QUFBQTtBQUV0QixNQUFJLE1BQU0sV0FBVyxHQUNyQjtBQUNJLFFBQUksSUFBSSxNQUFNLEdBQUcsUUFBUSxLQUFLLEdBQzlCO0FBQ0ksY0FBUSxNQUFNLEdBQUcsTUFBTSxLQUFLLEVBQUUsWUFBYSxDQUFDLElBQzVDO0FBQ0ksWUFBSTtBQUVKLGFBQUk7QUFDSixlQUFPLEdBQUUsUUFBTyxLQUNoQjtBQUNJLGdCQUFLO0FBQUEsUUFDVDtBQUNBLGVBQVEsR0FBRSxPQUFNLFFBQVUsR0FBRSxRQUFPLEtBQ25DO0FBQ0ksZ0JBQUs7QUFBQSxRQUNUO0FBQ0EsWUFBSSxHQUFFLFFBQU8sS0FDYjtBQUNJLGlCQUFPLEdBQUUsTUFBTSxHQUFFLEVBQUMsSUFBSSxNQUFNLEdBQUUsTUFBTSxFQUFDO0FBQUEsUUFDekMsT0FFQTtBQUNJLGlCQUFPO0FBQUE7QUFBQSxPQUVkO0FBQUEsSUFDTDtBQUNBLFFBQUksTUFBTSxHQUFHLFFBQVEsS0FBSztBQUMxQixRQUFJLE1BQU0sR0FBRyxRQUFRLEdBQUc7QUFDeEIsUUFBSSxJQUFJLEtBQU0sTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLE1BQU8sSUFBSSxLQUFLLElBQUksSUFDNUQ7QUFDSSxjQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRSxDQUFDLElBQUksTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFBQSxJQUMxRDtBQUFBLEVBQ0o7QUFDQSxNQUFJO0FBQ0osU0FBTyxJQUFJLE1BQU0sUUFDakI7QUFDSSxXQUFPLE1BQU07QUFDYixRQUFJLFdBQVcsUUFBUSxJQUFJO0FBQUcsUUFBSSxTQUFTO0FBQUksUUFBSSxTQUFTO0FBQUksUUFBSSxTQUFTO0FBQUksUUFBSSxTQUFTO0FBRTlGLFFBQUssS0FBSyxNQUNWO0FBQ0ksVUFBSyxLQUFLLFNBQVcsS0FBTyxFQUFFLE9BQU8sR0FBRSxDQUFDLE1BQU0sTUFDOUM7QUFDSSxnQkFBUSxHQUFFLENBQUM7QUFDWCxhQUFLLEtBQUksS0FBSyxLQUFLLEVBQUU7QUFDckIsWUFBSSxPQUFPLEtBQUksS0FBSyxRQUFRLEdBQUUsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFTLFdBQVcsRUFBRyxXQUFXLEtBQUssUUFBUSxZQUMvQztBQUNJLGNBQUksS0FBSztBQUNULGNBQUksV0FBVyxRQUFRLENBQUM7QUFBRyxlQUFLLFNBQVM7QUFBSSxlQUFLLFNBQVM7QUFBSSxlQUFLLFNBQVM7QUFFN0Usa0JBQVEsSUFBRyxJQUFHLEVBQUU7QUFBQSxRQUNwQjtBQUNBLGVBQU8sS0FBSSxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssR0FDaEM7QUFDSSxnQkFBTSxJQUFJO0FBQUEsUUFDZDtBQUNBLGFBQUksS0FBSyxLQUFLLEVBQUUsV0FBVztBQUFBLE1BQy9CLE9BRUE7QUFDSSxhQUFLO0FBQ0wsMkJBQW9CLEdBQ3BCO0FBQ0ksY0FBSSxLQUFLLE1BQU0sUUFDZjtBQUNJLG9CQUFRLE1BQU0sc0NBQXNDLEtBQUssR0FBRztBQUM1RCxtQkFBTztBQUFBLFVBQ1g7QUFBQTtBQUVKLFlBQUksTUFBTSxXQUFXLEtBQUssT0FDMUI7QUFDSSxlQUFLO0FBQ0wsZUFBSyxDQUFDO0FBQ04sY0FBSSxTQUFTLEdBQ2I7QUFDSTtBQUFBLFVBQ0o7QUFDQSxpQkFBTyxNQUFNLEdBQUcsU0FBUyxFQUFFLE9BQU8sR0FBRSxDQUFDLE1BQU0sT0FDM0M7QUFDSSxnQkFBSSxNQUFNLEdBQUcsS0FBSztBQUNsQixnQkFBSSxFQUFFLE9BQU8sS0FDYjtBQUNJLGtCQUFJLEVBQUUsT0FBTyxDQUFDO0FBQUEsWUFDbEI7QUFDQSxnQkFBSSxFQUFFLEVBQUUsU0FBUyxPQUFPLEtBQ3hCO0FBQ0ksa0JBQUksRUFBRSxPQUFPLEdBQUUsRUFBRSxTQUFTLENBQUM7QUFBQSxZQUMvQjtBQUNBLGVBQUcsS0FBSyxDQUFDO0FBQ1QsaUJBQUs7QUFDTCxnQkFBSSxTQUFTLEdBQ2I7QUFDSTtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQ0EsY0FBSSxHQUFHLEtBQUssSUFBSTtBQUNoQixjQUFJLE1BQU0sR0FBRyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsS0FBSztBQUN2QyxjQUFJLEVBQUUsUUFDTjtBQUNJLGdCQUFJO0FBQUEsVUFDUjtBQUFBLFFBQ0o7QUFDQSxZQUFJLE1BQU0sT0FDVjtBQUNJLGVBQUs7QUFDTCxjQUFJLFNBQVMsR0FDYjtBQUNJO0FBQUEsVUFDSjtBQUNBLGVBQUssQ0FBQztBQUNOLGlCQUFPLE1BQU0sR0FBRyxLQUFLLE1BQU0sT0FDM0I7QUFDSSxnQkFBSSxNQUFNLEdBQUcsS0FBSztBQUNsQixnQkFBSSxFQUFFLE9BQU8sS0FDYjtBQUNJLGtCQUFJLEVBQUUsT0FBTyxDQUFDO0FBQUEsWUFDbEI7QUFDQSxnQkFBSSxFQUFFLEVBQUUsU0FBUyxPQUFPLEtBQ3hCO0FBQ0ksa0JBQUksRUFBRSxPQUFPLEdBQUUsRUFBRSxTQUFTLENBQUM7QUFBQSxZQUMvQjtBQUNBLGVBQUcsS0FBSyxDQUFDO0FBQ1QsaUJBQUs7QUFDTCxnQkFBSSxTQUFTLEdBQ2I7QUFDSTtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQ0EsY0FBSSxHQUFHLEtBQUssSUFBSTtBQUFBLFFBQ3BCO0FBQ0EsZ0JBQVEsR0FBRSxHQUFFLENBQUM7QUFBQTtBQUFBLElBRXJCO0FBQ0EsU0FBSztBQUFBLEVBQ1Q7QUFDQSxTQUFPLE1BQU0sR0FBRztBQUFBO0FBRXBCLFdBQVcsRUFBQyxLQUFJLFNBQVEsUUFBTyxHQUFFLE9BQU0sTUFBSyxVQUFTLElBQUcsTUFBSyxPQUFNLFVBQVMsT0FBTSxNQUFLLE9BQU0sUUFBTyxNQUFLO0FBQ3pHLE9BQU8sRUFBQyxLQUFJLElBQUksT0FBTyxnQ0FBZ0MsR0FBRSxNQUFLLElBQUksT0FBTywyQkFBMkIsR0FBRSxRQUFPLElBQUksT0FBTyxvQkFBb0IsRUFBQztBQUU3SSxjQUFlLENBQUMsR0FBRyxHQUNuQjtBQUNJLFNBQU8sRUFBRSxTQUFTLEdBQ2xCO0FBQ0ksU0FBSztBQUFBLEVBQ1Q7QUFDQSxTQUFPO0FBQUE7QUFHWCxvQkFBcUIsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxHQUN0QztBQUNJLE1BQUksS0FBSyxRQUFRLFFBQVEsS0FBSyxRQUFRO0FBRXRDLGdCQUFlLENBQUMsR0FBRyxHQUNuQjtBQUNJLFFBQUksR0FBRyxHQUFHO0FBRVYsUUFBSSxDQUFDO0FBQ0wsU0FBSyxLQUFLLEdBQ1Y7QUFDSSxVQUFJLEVBQUU7QUFDTixRQUFFLEtBQUs7QUFBQSxJQUNYO0FBQ0EsU0FBSyxLQUFLLEdBQ1Y7QUFDSSxVQUFJLEVBQUU7QUFDTixZQUFNLEVBQUUsTUFBTSxPQUNkO0FBQ0ksVUFBRSxLQUFLO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFDQSxXQUFPO0FBQUE7QUFFWCxRQUFNLElBQUksU0FBUSxRQUFRO0FBQzFCLE1BQUksSUFBSSxRQUFRLFNBQ2hCO0FBQ0ksV0FBTyxLQUFLLFVBQVUsS0FBSSxNQUFLLElBQUksTUFBTTtBQUFBLEVBQzdDO0FBQ0EsYUFBVyxJQUFJLFdBQVksVUFDM0I7QUFDSSxRQUFJLFNBQVMsSUFBSSxPQUFPO0FBQUEsRUFDNUI7QUFDQSxXQUFTLElBQUksSUFBRyxJQUFJLE1BQU07QUFDMUIsbUJBQWtCLENBQUMsR0FBRyxNQUN0QjtBQUNJLFFBQUksSUFBSTtBQUVSLFFBQUksS0FBSyxFQUFFLFFBQVEsSUFBSSxHQUN2QjtBQUNJLFdBQUssRUFBRSxNQUFNLElBQUk7QUFDakIsV0FBSyxHQUFHLFlBQWEsQ0FBQyxHQUN0QjtBQUNJLGVBQU8sT0FBTyxHQUFFLElBQUk7QUFBQSxPQUN2QjtBQUNELFNBQUcsUUFBUSxLQUFLO0FBQ2hCLFNBQUcsS0FBSyxLQUFLO0FBQ2IsYUFBTyxHQUFHLEtBQUssSUFBSTtBQUFBLElBQ3ZCO0FBQ0EsUUFBSSxNQUFNLE1BQU0sTUFBTSxTQUFTLEtBQUksR0FBRyxFQUFFLElBQUcsQ0FBQyxLQUFJLEtBQUksR0FBRyxDQUFDLEtBQUssS0FBSSxHQUFHLEVBQUUsRUFBRSxTQUFTLElBQUcsQ0FBQyxLQUFJLEtBQUksR0FBRyxDQUFDLEdBQ2pHO0FBQ0ksVUFBSSxNQUFNLElBQUk7QUFBQSxJQUNsQixXQUNTLFFBQVEsT0FBTyxLQUFLLENBQUMsR0FDOUI7QUFDSSxVQUFJLE1BQU0sSUFBSTtBQUFBLElBQ2xCO0FBQ0EsV0FBTztBQUFBO0FBRVgsbUJBQWtCLENBQUMsR0FBRyxLQUFLLFNBQzNCO0FBQ0ksUUFBSSxHQUFHLFVBQVUsSUFBSSxHQUFHLFFBQVE7QUFFaEMsUUFBSSxJQUFJLE9BQ1I7QUFDSSxlQUFTLElBQUk7QUFDYixVQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUUsU0FBUyxHQUM1QjtBQUNJLGFBQUssS0FBSyxHQUNWO0FBQ0ksY0FBSSxFQUFFO0FBQ04sY0FBSSxFQUFFLGVBQWUsQ0FBQyxHQUN0QjtBQUNJLGlCQUFLLFNBQVMsS0FBSyxNQUFNLEVBQUUsU0FBUyxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksTUFBTTtBQUNqRSxxQkFBUyxLQUFLLElBQUksUUFBTyxFQUFFO0FBQzNCLGdCQUFJLElBQUksWUFBYSxTQUFTLElBQUksVUFDbEM7QUFDSSx1QkFBUyxJQUFJO0FBQ2I7QUFBQSxZQUNKO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUNBLFFBQUksQ0FBQztBQUNMLHVCQUFvQixDQUFDLElBQUcsSUFDeEI7QUFDSSxVQUFJLEdBQUcsSUFBSSxHQUFHO0FBRWQsVUFBSTtBQUNKLFdBQUksT0FBTyxJQUFFLElBQUk7QUFDakIsVUFBSSxHQUFFLFFBQVEsSUFBSSxJQUFJLEtBQUssR0FBRSxPQUFPLEtBQ3BDO0FBQ0ksYUFBSSxJQUFJO0FBQUEsTUFDWixXQUNTLEdBQUUsT0FBTyxPQUFPLEdBQUUsR0FBRSxTQUFTLE9BQU8sS0FDN0M7QUFDSSxhQUFJLE1BQU07QUFBQSxNQUNkLFdBQ1MsR0FBRSxPQUFPLE9BQU8sR0FBRSxHQUFFLFNBQVMsT0FBTyxLQUM3QztBQUNJLGNBQUs7QUFBQSxNQUNUO0FBQ0EsVUFBSSxJQUFJLE9BQ1I7QUFDSSxhQUFLLElBQUksSUFBRSxLQUFLLElBQUksUUFBTyxHQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksSUFBSSxNQUFNLFFBQU8sTUFBTTtBQUFBLE1BQy9CLE9BRUE7QUFDSSxhQUFLLElBQUksSUFBRSxHQUFFLFNBQVMsQ0FBQztBQUN2QixZQUFJLE1BQU07QUFBQTtBQUVkLFdBQUs7QUFDTCxXQUFLLE1BQU0sSUFBRSxHQUFFLE9BQU0sT0FBTztBQUM1QixVQUFJLEdBQUcsT0FBTyxNQUNkO0FBQ0ksZUFBTyxFQUFFLEVBQUUsU0FBUyxPQUFPLEtBQzNCO0FBQ0ksY0FBSSxFQUFFLE9BQU8sR0FBRSxFQUFFLFNBQVMsQ0FBQztBQUFBLFFBQy9CO0FBQUEsTUFDSjtBQUNBLFdBQUs7QUFDTCxhQUFPLEVBQUUsRUFBRSxTQUFTLE9BQU8sS0FDM0I7QUFDSSxZQUFJLEVBQUUsT0FBTyxHQUFFLEVBQUUsU0FBUyxDQUFDO0FBQUEsTUFDL0I7QUFDQSxhQUFPO0FBQUE7QUFFWCxRQUFJLElBQUksTUFDUjtBQUNJLFVBQUksT0FBTyxLQUFJLEtBQUssT0FBTyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDekMsZUFBUyxXQUFXLEVBQUcsV0FBVyxLQUFLLFFBQVEsWUFDL0M7QUFDSSxZQUFJLEtBQUs7QUFDVCxVQUFFLEtBQUssU0FBUyxHQUFFLEVBQUUsRUFBRSxDQUFDO0FBQUEsTUFDM0I7QUFBQSxJQUNKLE9BRUE7QUFDSSxXQUFLLEtBQUssR0FDVjtBQUNJLFlBQUksRUFBRTtBQUNOLFlBQUksRUFBRSxlQUFlLENBQUMsR0FDdEI7QUFDSSxZQUFFLEtBQUssU0FBUyxHQUFFLENBQUMsQ0FBQztBQUFBLFFBQ3hCO0FBQUEsTUFDSjtBQUFBO0FBRUosV0FBTyxFQUFFLEtBQUssSUFBSTtBQUFBO0FBRXRCLGtCQUFpQixDQUFDLEdBQUcsTUFBTSxJQUFJLE9BQU8sT0FBTyxVQUFVLENBQUMsR0FDeEQ7QUFDSSxRQUFJLEdBQUcsR0FBRyxHQUFHLFVBQVU7QUFFdkIsVUFBTSxLQUFLLE9BQ1g7QUFDSSxVQUFJLE1BQU0sTUFDVjtBQUNJLGVBQU8sSUFBSSxRQUFRLFFBQVEsVUFBVTtBQUFBLE1BQ3pDO0FBQ0EsVUFBSSxNQUFNLFdBQ1Y7QUFDSSxlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQ0EsWUFBUSxXQUFXO0FBQUEsV0FFVjtBQUNELGVBQU8sT0FBTyxHQUFFLElBQUk7QUFBQSxXQUVuQjtBQUNELFlBQUksSUFBSSxVQUNSO0FBQ0ksY0FBSSxLQUFJLEdBQUcsR0FBRSxPQUFPLEdBQ3BCO0FBQ0ksbUJBQU87QUFBQSxVQUNYO0FBQ0Esa0JBQVEsS0FBSyxDQUFDO0FBQUEsUUFDbEI7QUFDQSxhQUFLLEVBQUUsZUFBZSxPQUFPLEVBQUUsWUFBWSxPQUFPLGVBQWUsU0FDakU7QUFDSSxjQUFJLFFBQVEsTUFBTSxRQUFRLE9BQU87QUFDakMsY0FBSSxFQUFFLFVBQVUsUUFBUSxJQUN4QjtBQUNJLGlCQUFLO0FBQUEsVUFDVDtBQUNBLHVCQUFlLEdBQUc7QUFBRSxnQkFBSSxZQUFZLENBQUM7QUFBRyxnQkFBSSxPQUFPLEtBQUksS0FBSyxDQUFDO0FBQUcscUJBQVMsV0FBVyxFQUFHLFdBQVcsS0FBSyxRQUFRLFlBQWE7QUFBRSxrQkFBSSxLQUFLO0FBQVUsd0JBQVUsS0FBSyxNQUFNLE1BQU0sR0FBRSxNQUFNLFFBQU8sTUFBSyxPQUFPLENBQUM7QUFBQSxZQUFHO0FBQUUsbUJBQU87QUFBQSxZQUFhLEtBQUssSUFBSSxFQUFFLEVBQUUsS0FBSyxJQUFJO0FBQUEsUUFDM1AsWUFDVSxFQUFFLGVBQWUsT0FBTyxFQUFFLFlBQVksT0FBTyxlQUFlLFVBQ3RFO0FBQ0ksaUJBQU8sRUFBRTtBQUFBLFFBQ2IsT0FFQTtBQUNJLGNBQUssUUFBUSxVQUFZLFFBQVEsTUFBTyxRQUFRO0FBQ2hELGVBQUssT0FBTyxHQUFFLEtBQUksT0FBTztBQUFBO0FBRTdCLGVBQU87QUFBQTtBQUdQLGVBQU8sT0FBTyxDQUFDO0FBQUE7QUFHdkIsV0FBTztBQUFBO0FBRVgsU0FBTyxNQUFNLEdBQUc7QUFBQTtBQUdwQixtQkFBb0IsQ0FBQyxLQUFLLEdBQUcsS0FDN0I7QUFDSSxNQUFJLElBQUksVUFBVSxHQUNsQjtBQUNJLFdBQU87QUFBQSxFQUNYO0FBQ0EsVUFBUyxPQUFPLE9BQU8sZ0RBQXNCLFFBQVEsQ0FBQztBQUFBLFNBRTdDO0FBQ0QsYUFBTyxLQUFLLE1BQU0sR0FBRztBQUFBO0FBR3JCLGFBQU8sTUFBTSxHQUFHO0FBQUE7QUFBQTtBQUs1QixlQUFnQixDQUFDLEdBQUcsS0FBSyxJQUN6QjtBQUNJLE1BQUk7QUFFSixNQUFJLEtBQUksT0FBTyxHQUFHLEdBQ2xCO0FBQ0ksU0FBSztBQUFBLEVBQ1Q7QUFDQSxNQUFJLEtBQUksT0FBTyxFQUFFLEdBQ2pCO0FBQ0ksUUFDQTtBQUNJLGFBQU8sY0FBTSxTQUFTLFdBQVcsQ0FBQyxNQUNsQztBQUNJLGFBQUssS0FBSSxNQUFNLElBQUcsR0FDbEI7QUFDSSxpQkFBTyxHQUFHLFNBQVMsTUFBSSxHQUFFLEdBQUcsQ0FBQztBQUFBLFFBQ2pDLE9BRUE7QUFDSSxrQkFBUSxNQUFNLDJCQUEyQixHQUFHO0FBQzVDLGlCQUFPLEdBQUcsSUFBSTtBQUFBO0FBQUEsT0FFckI7QUFBQSxhQUVFLEtBQVA7QUFFSSxjQUFRLE1BQU0sZ0NBQWdDLEtBQUksR0FBRztBQUNyRCxhQUFPLEdBQUcsSUFBSTtBQUFBO0FBQUEsRUFFdEIsT0FFQTtBQUNJLFFBQ0E7QUFDSSxxRUFBb0IsYUFBYSxHQUFFLE1BQU07QUFDekMsYUFBTyxTQUFTLEtBQUksR0FBRSxHQUFHO0FBQUEsYUFFdEIsS0FBUDtBQUVJLGNBQVEsTUFBTSxpQkFBaUIsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBS2hFLGVBQWdCLENBQUMsR0FBRyxNQUFNLFFBQVEsSUFDbEM7QUFDSSxNQUFJO0FBRUosYUFBVyxXQUFZLFlBQ3ZCO0FBQ0ksU0FBSztBQUNMLGFBQVMsQ0FBQztBQUFBLEVBQ2QsT0FFQTtBQUNJLGFBQVUsVUFBVSxPQUFPLFNBQVMsQ0FBQztBQUFBO0FBRXpDLFFBQU0sVUFBVSxNQUFLLE9BQU8sT0FBTyxFQUFDLEtBQUksYUFBSyxRQUFRLENBQUMsR0FBRSxPQUFhLENBQUMsQ0FBQztBQUN2RSxNQUFJLEtBQUksT0FBTyxFQUFFLEdBQ2pCO0FBQ0ksV0FBTyxjQUFNLFVBQVUsR0FBRSxLQUFJLEVBQUU7QUFBQSxFQUNuQyxPQUVBO0FBQ0ksWUFBUSxNQUFNLDBCQUEwQjtBQUFBO0FBQUE7QUFHaEQsSUFBZSxpQkFBQyxVQUFTLENBQUMsU0FBUSxPQUFPLEdBQUUsWUFBVyxDQUFDLFFBQU8sTUFBTSxHQUFFLE1BQVUsTUFBVSxPQUFZLFVBQW1COzs7QUM3eEJ6SDs7O0FDUEEsSUFBSTtBQUFKLElBQU87QUFBUCxJQUFrQjtBQU9sQixLQUFJLFlBQUk7QUFDUixhQUFZLFlBQUk7QUFHaEIsaUJBQW1CLEdBQ25CO0FBQ0ksV0FBUyxPQUFPLEdBQ2hCO0FBQ0ksUUFBSTtBQUVKLFNBQUssYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJO0FBQzNDLFNBQUssZUFBZSxLQUFLLGFBQWEsS0FBSyxJQUFJO0FBQy9DLFNBQUssa0JBQWtCLEtBQUssZ0JBQWdCLEtBQUssSUFBSTtBQUNyRCxTQUFLLGtCQUFrQixLQUFLLGdCQUFnQixLQUFLLElBQUk7QUFDckQsU0FBSyxtQkFBbUIsS0FBSyxpQkFBaUIsS0FBSyxJQUFJO0FBQ3ZELFNBQUssY0FBYyxLQUFLLFlBQVksS0FBSyxJQUFJO0FBQzdDLFNBQUssYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJO0FBQzNDLGlCQUFLLEdBQUcsY0FBYSxLQUFLLFlBQVk7QUFDdEMsaUJBQUssR0FBRyxlQUFjLEtBQUssWUFBWTtBQUN2QyxpQkFBSyxHQUFHLGlCQUFnQixLQUFLLGFBQWE7QUFDMUMsV0FBTyxXQUFXLElBQUksY0FBTSxFQUFDLE1BQUssTUFBTSxPQUFPLElBQUksVUFBVSxHQUFFLE1BQUssTUFBTSxPQUFPLElBQUksV0FBVyxFQUFDLENBQUM7QUFDbEcsV0FBTyxpQkFBaUIsV0FBVSxLQUFLLFNBQVM7QUFDaEQsV0FBTyxpQkFBaUIsU0FBUSxLQUFLLE9BQU87QUFDNUMsV0FBTyxpQkFBaUIsVUFBUyxLQUFLLFFBQVE7QUFDOUMsV0FBTyxzQkFBc0IsS0FBSyxPQUFPO0FBQ3pDLFdBQU8sR0FBRSxNQUFNO0FBQ2YsU0FBSyxNQUFNO0FBQ1gsVUFBTSxRQUFRLFdBQVcsRUFBRSxhQUFlLENBQUMsSUFDM0M7QUFDSSxhQUFPLGFBQUssRUFBQyxPQUFNLFFBQU8sTUFBSyxhQUFhLE1BQUssUUFBTyxLQUFJLENBQUM7QUFBQSxNQUM5RCxLQUFLLElBQUksQ0FBQztBQUFBO0FBR2pCLFVBQU8sVUFBVSxxQkFBc0IsR0FDdkM7QUFDSSxRQUFJLE9BQU8sS0FBSztBQUVoQixXQUFPLHNCQUFzQixLQUFLLE9BQU87QUFDekMsVUFBTSxPQUFPLFlBQVksSUFBSTtBQUM3QixZQUFTLE1BQU0sS0FBSztBQUNwQixTQUFLLG9CQUFvQjtBQUN6QixVQUFNLFNBQVMsT0FBTyxLQUFLO0FBQzNCLFFBQUksTUFBTSxJQUNWO0FBQ0ksYUFBTyxNQUFNLEtBQUssd0JBQXVCLEdBQUc7QUFBQSxJQUNoRDtBQUFBO0FBR0osVUFBTyxVQUFVLDBCQUEyQixHQUM1QztBQUFBO0FBRUEsVUFBTyxVQUFVLHNCQUF1QixDQUFDLE9BQ3pDO0FBQUE7QUFFQSxVQUFPLFVBQVUsMkJBQTRCLEdBQzdDO0FBQUE7QUFFQSxVQUFPLFVBQVUsMEJBQTJCLEdBQzVDO0FBQUE7QUFFQSxVQUFPLFVBQVUsMEJBQTJCLENBQUMsUUFDN0M7QUFDSSxZQUFRLElBQUksY0FBYSxNQUFNO0FBQy9CLFlBQVEsT0FBTyxZQUFZO0FBQUEsV0FFbEI7QUFDRCxjQUFNLEtBQUssa0JBQWtCO0FBQzdCO0FBQUEsV0FDQztBQUNELGNBQU0sS0FBSyxrQkFBa0I7QUFDN0I7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLFlBQVk7QUFDdkI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLGlCQUFpQjtBQUM1QjtBQUFBLFdBQ0M7QUFDRCxjQUFNLEtBQUssaUJBQWlCO0FBQzVCO0FBQUEsV0FDQztBQUNELGNBQU0sS0FBSyxpQkFBaUI7QUFDNUI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLGNBQWM7QUFDekI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLGVBQWU7QUFDMUI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLFVBQVU7QUFDckI7QUFBQSxXQUNDO0FBQ0QsY0FBTSxLQUFLLGNBQWEsWUFBWTtBQUNwQztBQUFBO0FBR1IsV0FBTztBQUFBO0FBR1gsVUFBTyxVQUFVLHVCQUF3QixDQUFDLE9BQzFDO0FBQ0ksUUFBSTtBQUVKLGVBQVUsS0FBSztBQUNmLFdBQU8sZ0JBQVEsU0FBUyxLQUFLO0FBQzdCLFNBQUssUUFBUTtBQUNiLFFBQW9CLE9BQU8sU0FBUyxjQUFjLElBQUksTUFBbEQsYUFDSjtBQUNJLGNBQVEsSUFBSSxXQUFVLElBQUk7QUFBQSxJQUM5QjtBQUFBO0FBR0osVUFBTyxVQUFVLHFCQUFzQixDQUFDLE9BQ3hDO0FBQ0ksUUFBSTtBQUVKLFdBQU8sZ0JBQVEsU0FBUyxLQUFLO0FBQzdCLFdBQU8sS0FBSyxRQUFRO0FBQUE7QUFHeEIsU0FBTztBQUFBLEVBQ1I7QUFFSCxJQUFlOzs7QUMvSGYsSUFBZSxnQkFBQyxLQUFJLGFBQUksS0FBSSxhQUFJLE1BQUssY0FBSyxNQUFLLGFBQUk7OztBQ0puRCxJQUFJO0FBS0osZ0JBQWtCLEdBQ2xCO0FBQ0ksV0FBUyxNQUFNLEdBQ2Y7QUFBQTtBQUVBLFNBQU0sa0JBQW1CLENBQUMsSUFDMUI7QUFDSSxXQUFPLE9BQU0sUUFBUSxhQUFhLEVBQUUsYUFBYyxDQUFDLFlBQ25EO0FBQ0kscUJBQU8sT0FBTztBQUNkLGFBQU8sR0FBRyxVQUFVO0FBQUEsS0FDdkI7QUFBQTtBQUdMLFNBQU0sa0JBQW1CLENBQUMsVUFBVSxNQUNwQztBQUNJLFdBQU8sT0FBTyxPQUFPLGdCQUFnQixNQUFNLFlBQVksRUFBQyxPQUFZLEtBQVMsQ0FBQztBQUFBO0FBR2xGLFNBQU0scUJBQXNCLENBQUMsVUFBVSxNQUN2QztBQUNJLFdBQU8sT0FBTyxPQUFPLGdCQUFnQixjQUFjLFlBQVksRUFBQyxPQUFZLEtBQVMsQ0FBQztBQUFBO0FBRzFGLFNBQU0scUJBQXNCLENBQUMsS0FDN0I7QUFDSSxXQUFPLFlBQUksS0FBSyxLQUFLLEdBQUc7QUFBQTtBQUc1QixTQUFNLFlBQVk7QUFDbEIsU0FBTSxZQUFZLFlBQUk7QUFDdEIsU0FBTSxTQUFTLFlBQUk7QUFDbkIsU0FBTSxVQUFVLFlBQUk7QUFDcEIsU0FBTztBQUFBLEVBQ1I7QUFFSCxPQUFPLFFBQVE7QUFDZixJQUFlOzs7QUN6Q2YsY0FBTSxhQUFjLEdBQ3BCO0FBQ0ksU0FBTyxJQUFJLGNBQU07QUFBQSxDQUNwQjsiLAogICJkZWJ1Z0lkIjogIjA5MzNBMzdFNTYzRkRFRDM2NDc1NmUyMTY0NzU2ZTIxIiwKICAibmFtZXMiOiBbXQp9
