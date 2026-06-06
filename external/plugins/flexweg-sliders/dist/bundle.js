import { jsxs as k, jsx as m } from "react/jsx-runtime";
import R, { createRef as ir, memo as or, createElement as sr, createContext as tn, version as Mt, forwardRef as lr, useContext as ar, useState as cr } from "react";
import fr, { flushSync as ur } from "react-dom";
import { useTranslation as H } from "react-i18next";
import { pickMediaUrl as Ue, MediaPicker as dr } from "@flexweg/cms-runtime";
const he = {
  blocks: {
    image: { title: "Image slider" },
    hero: { title: "Hero slider" },
    card: { title: "Card slider" },
    logo: { title: "Logo carousel" }
  },
  inspector: {
    slides: "Slides",
    addSlide: "Add slide",
    removeSlide: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    duplicate: "Duplicate",
    pickImage: "Pick image",
    clearImage: "Clear",
    noImage: "No image",
    options: "Options",
    autoplay: "Autoplay",
    interval: "Interval (ms)",
    showDots: "Show dots",
    showArrows: "Show arrows",
    loop: "Loop",
    aspectRatio: "Aspect ratio",
    perView: "Slides per view",
    height: "Height",
    overlay: "Overlay",
    align: "Alignment",
    speed: "Speed",
    grayscale: "Grayscale",
    logoHeight: "Logo height (px)",
    fields: {
      alt: "Alt text",
      caption: "Caption",
      link: "Link URL",
      eyebrow: "Eyebrow",
      title: "Title",
      subtitle: "Subtitle",
      ctaLabel: "Button label",
      ctaHref: "Button URL",
      text: "Text",
      linkLabel: "Link label"
    }
  },
  options: {
    aspect: { "16/9": "16:9", "4/3": "4:3", "1/1": "1:1", "21/9": "21:9" },
    height: { short: "Short (50vh)", medium: "Medium (70vh)", tall: "Tall (100vh)" },
    overlay: { none: "None", light: "Light", dark: "Dark" },
    align: { left: "Left", center: "Center", right: "Right" },
    speed: { slow: "Slow", normal: "Normal", fast: "Fast" }
  },
  empty: {
    image: "Add at least one slide to display the image slider.",
    hero: "Add at least one slide to display the hero slider.",
    card: "Add at least one card to display the card slider.",
    logo: "Add at least one logo to display the carousel."
  },
  preview: {
    counter: "{{n}} slide(s)",
    blockLabel: "{{kind}} — {{n}} slide(s)"
  }
}, hr = {
  blocks: {
    image: { title: "Diaporama d'images" },
    hero: { title: "Diaporama hero" },
    card: { title: "Diaporama de cartes" },
    logo: { title: "Carrousel de logos" }
  },
  inspector: {
    slides: "Diapositives",
    addSlide: "Ajouter une diapositive",
    removeSlide: "Supprimer",
    moveUp: "Monter",
    moveDown: "Descendre",
    duplicate: "Dupliquer",
    pickImage: "Choisir une image",
    clearImage: "Effacer",
    noImage: "Aucune image",
    options: "Options",
    autoplay: "Lecture automatique",
    interval: "Intervalle (ms)",
    showDots: "Afficher les points",
    showArrows: "Afficher les flèches",
    loop: "Boucle",
    aspectRatio: "Format",
    perView: "Diapositives visibles",
    height: "Hauteur",
    overlay: "Voile",
    align: "Alignement",
    speed: "Vitesse",
    grayscale: "Niveaux de gris",
    logoHeight: "Hauteur des logos (px)",
    fields: {
      alt: "Texte alternatif",
      caption: "Légende",
      link: "URL du lien",
      eyebrow: "Surtitre",
      title: "Titre",
      subtitle: "Sous-titre",
      ctaLabel: "Texte du bouton",
      ctaHref: "URL du bouton",
      text: "Texte",
      linkLabel: "Libellé du lien"
    }
  },
  options: {
    aspect: { "16/9": "16:9", "4/3": "4:3", "1/1": "1:1", "21/9": "21:9" },
    height: { short: "Petite (50vh)", medium: "Moyenne (70vh)", tall: "Grande (100vh)" },
    overlay: { none: "Aucun", light: "Clair", dark: "Sombre" },
    align: { left: "Gauche", center: "Centré", right: "Droite" },
    speed: { slow: "Lente", normal: "Normale", fast: "Rapide" }
  },
  empty: {
    image: "Ajoutez au moins une diapositive pour afficher le diaporama.",
    hero: "Ajoutez au moins une diapositive pour afficher le hero.",
    card: "Ajoutez au moins une carte pour afficher le diaporama.",
    logo: "Ajoutez au moins un logo pour afficher le carrousel."
  },
  preview: {
    counter: "{{n}} diapositive(s)",
    blockLabel: "{{kind}} — {{n}} diapositive(s)"
  }
}, pr = he, mr = he, gr = he, wr = he, yr = he;
function T(r) {
  this.content = r;
}
T.prototype = {
  constructor: T,
  find: function(r) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === r) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(r) {
    var e = this.find(r);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(r, e, t) {
    var n = t && t != r ? this.remove(t) : this, i = n.find(r), o = n.content.slice();
    return i == -1 ? o.push(t || r, e) : (o[i + 1] = e, t && (o[i] = t)), new T(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(r) {
    var e = this.find(r);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new T(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(r, e) {
    return new T([r, e].concat(this.remove(r).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(r, e) {
    var t = this.remove(r).content.slice();
    return t.push(r, e), new T(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(r, e, t) {
    var n = this.remove(e), i = n.content.slice(), o = n.find(r);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new T(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(r) {
    for (var e = 0; e < this.content.length; e += 2)
      r(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(r) {
    return r = T.from(r), r.size ? new T(r.content.concat(this.subtract(r).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(r) {
    return r = T.from(r), r.size ? new T(this.subtract(r).content.concat(r.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(r) {
    var e = this;
    r = T.from(r);
    for (var t = 0; t < r.content.length; t += 2)
      e = e.remove(r.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var r = {};
    return this.forEach(function(e, t) {
      r[e] = t;
    }), r;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
T.from = function(r) {
  if (r instanceof T) return r;
  var e = [];
  if (r) for (var t in r) e.push(t, r[t]);
  return new T(e);
};
function nn(r, e, t) {
  for (let n = 0; ; n++) {
    if (n == r.childCount || n == e.childCount)
      return r.childCount == e.childCount ? null : t;
    let i = r.child(n), o = e.child(n);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o))
      return t;
    if (i.isText && i.text != o.text) {
      for (let s = 0; i.text[s] == o.text[s]; s++)
        t++;
      return t;
    }
    if (i.content.size || o.content.size) {
      let s = nn(i.content, o.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function rn(r, e, t, n) {
  for (let i = r.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0)
      return i == o ? null : { a: t, b: n };
    let s = r.child(--i), l = e.child(--o), a = s.nodeSize;
    if (s == l) {
      t -= a, n -= a;
      continue;
    }
    if (!s.sameMarkup(l))
      return { a: t, b: n };
    if (s.isText && s.text != l.text) {
      let c = 0, f = Math.min(s.text.length, l.text.length);
      for (; c < f && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, n--;
      return { a: t, b: n };
    }
    if (s.content.size || l.content.size) {
      let c = rn(s.content, l.content, t - 1, n - 1);
      if (c)
        return c;
    }
    t -= a, n -= a;
  }
}
class y {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let n = 0; n < e.length; n++)
        this.size += e[n].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, n, i = 0, o) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s], c = l + a.nodeSize;
      if (c > e && n(a, i + l, o || null, s) !== !1 && a.content.size) {
        let f = l + 1;
        a.nodesBetween(Math.max(0, e - f), Math.min(a.content.size, t - f), n, i + f);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, n, i) {
    let o = "", s = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? i ? typeof i == "function" ? i(l) : i : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && n && (s ? s = !1 : o += n), o += c;
    }, 0), o;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, n = e.firstChild, i = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(n) && (i[i.length - 1] = t.withText(t.text + n.text), o = 1); o < e.content.length; o++)
      i.push(e.content[o]);
    return new y(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let n = [], i = 0;
    if (t > e)
      for (let o = 0, s = 0; s < t; o++) {
        let l = this.content[o], a = s + l.nodeSize;
        a > e && ((s < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)) : l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1))), n.push(l), i += l.nodeSize), s = a;
      }
    return new y(n, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? y.empty : e == 0 && t == this.content.length ? this : new y(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let n = this.content[e];
    if (n == t)
      return this;
    let i = this.content.slice(), o = this.size + t.nodeSize - n.nodeSize;
    return i[e] = t, new y(i, o);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new y([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new y(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, n = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, n, t), n += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return nn(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, n = e.size) {
    return rn(this, e, t, n);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Ie(0, e);
    if (e == this.size)
      return Ie(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, n = 0; ; t++) {
      let i = this.child(t), o = n + i.nodeSize;
      if (o >= e)
        return o == e ? Ie(t + 1, o) : Ie(t, n);
      n = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return y.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new y(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return y.empty;
    let t, n = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      n += o.nodeSize, i && o.isText && e[i - 1].sameMarkup(o) ? (t || (t = e.slice(0, i)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
    }
    return new y(t || e, n);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return y.empty;
    if (e instanceof y)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new y([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
y.empty = new y([], 0);
const et = { index: 0, offset: 0 };
function Ie(r, e) {
  return et.index = r, et.offset = e, et;
}
function Le(r, e) {
  if (r === e)
    return !0;
  if (!(r && typeof r == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(r);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (r.length != e.length)
      return !1;
    for (let n = 0; n < r.length; n++)
      if (!Le(r[n], e[n]))
        return !1;
  } else {
    for (let n in r)
      if (!(n in e) || !Le(r[n], e[n]))
        return !1;
    for (let n in e)
      if (!(n in r))
        return !1;
  }
  return !0;
}
class C {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, n = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type))
          return e;
        !n && o.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), n = !0), t && t.push(o);
      }
    }
    return t || (t = e.slice()), n || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && Le(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let n = e.marks[t.type];
    if (!n)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = n.create(t.attrs);
    return n.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let n = 0; n < e.length; n++)
      if (!e[n].eq(t[n]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return C.none;
    if (e instanceof C)
      return [e];
    let t = e.slice();
    return t.sort((n, i) => n.type.rank - i.type.rank), t;
  }
}
C.none = [];
class Pe extends Error {
}
class v {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, n) {
    this.content = e, this.openStart = t, this.openEnd = n;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let n = sn(this.content, e + this.openStart, t);
    return n && new v(n, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new v(on(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return v.empty;
    let n = t.openStart || 0, i = t.openEnd || 0;
    if (typeof n != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new v(y.fromJSON(e, t.content), n, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let n = 0, i = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      n++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      i++;
    return new v(e, n, i);
  }
}
v.empty = new v(y.empty, 0, 0);
function on(r, e, t) {
  let { index: n, offset: i } = r.findIndex(e), o = r.maybeChild(n), { index: s, offset: l } = r.findIndex(t);
  if (i == e || o.isText) {
    if (l != t && !r.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return r.cut(0, e).append(r.cut(t));
  }
  if (n != s)
    throw new RangeError("Removing non-flat range");
  return r.replaceChild(n, o.copy(on(o.content, e - i - 1, t - i - 1)));
}
function sn(r, e, t, n) {
  let { index: i, offset: o } = r.findIndex(e), s = r.maybeChild(i);
  if (o == e || s.isText)
    return n && !n.canReplace(i, i, t) ? null : r.cut(0, e).append(t).append(r.cut(e));
  let l = sn(s.content, e - o - 1, t, s);
  return l && r.replaceChild(i, s.copy(l));
}
function xr(r, e, t) {
  if (t.openStart > r.depth)
    throw new Pe("Inserted content deeper than insertion position");
  if (r.depth - t.openStart != e.depth - t.openEnd)
    throw new Pe("Inconsistent open depths");
  return ln(r, e, t, 0);
}
function ln(r, e, t, n) {
  let i = r.index(n), o = r.node(n);
  if (i == e.index(n) && n < r.depth - t.openStart) {
    let s = ln(r, e, t, n + 1);
    return o.copy(o.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && r.depth == n && e.depth == n) {
      let s = r.parent, l = s.content;
      return re(s, l.cut(0, r.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: s, end: l } = vr(t, r);
      return re(o, cn(r, s, l, e, n));
    }
  else return re(o, $e(r, e, n));
}
function an(r, e) {
  if (!e.type.compatibleContent(r.type))
    throw new Pe("Cannot join " + e.type.name + " onto " + r.type.name);
}
function ft(r, e, t) {
  let n = r.node(t);
  return an(n, e.node(t)), n;
}
function ne(r, e) {
  let t = e.length - 1;
  t >= 0 && r.isText && r.sameMarkup(e[t]) ? e[t] = r.withText(e[t].text + r.text) : e.push(r);
}
function we(r, e, t, n) {
  let i = (e || r).node(t), o = 0, s = e ? e.index(t) : i.childCount;
  r && (o = r.index(t), r.depth > t ? o++ : r.textOffset && (ne(r.nodeAfter, n), o++));
  for (let l = o; l < s; l++)
    ne(i.child(l), n);
  e && e.depth == t && e.textOffset && ne(e.nodeBefore, n);
}
function re(r, e) {
  return r.type.checkContent(e), r.copy(e);
}
function cn(r, e, t, n, i) {
  let o = r.depth > i && ft(r, e, i + 1), s = n.depth > i && ft(t, n, i + 1), l = [];
  return we(null, r, i, l), o && s && e.index(i) == t.index(i) ? (an(o, s), ne(re(o, cn(r, e, t, n, i + 1)), l)) : (o && ne(re(o, $e(r, e, i + 1)), l), we(e, t, i, l), s && ne(re(s, $e(t, n, i + 1)), l)), we(n, null, i, l), new y(l);
}
function $e(r, e, t) {
  let n = [];
  if (we(null, r, t, n), r.depth > t) {
    let i = ft(r, e, t + 1);
    ne(re(i, $e(r, e, t + 1)), n);
  }
  return we(e, null, t, n), new y(n);
}
function vr(r, e) {
  let t = e.depth - r.openStart, i = e.node(t).copy(r.content);
  for (let o = t - 1; o >= 0; o--)
    i = e.node(o).copy(y.from(i));
  return {
    start: i.resolveNoCache(r.openStart + t),
    end: i.resolveNoCache(i.content.size - r.openEnd - t)
  };
}
class ke {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let n = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return n ? e.child(t).cut(n) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let n = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      i += n.child(o).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return C.none;
    if (this.textOffset)
      return e.child(t).marks;
    let n = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!n) {
      let l = n;
      n = i, i = l;
    }
    let o = n.marks;
    for (var s = 0; s < o.length; s++)
      o[s].type.spec.inclusive === !1 && (!i || !o[s].isInSet(i.marks)) && (o = o[s--].removeFromSet(o));
    return o;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let n = t.marks, i = e.parent.maybeChild(e.index());
    for (var o = 0; o < n.length; o++)
      n[o].type.spec.inclusive === !1 && (!i || !n[o].isInSet(i.marks)) && (n = n[o--].removeFromSet(n));
    return n;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--)
      if (e.pos <= this.end(n) && (!t || t(this.node(n))))
        return new Fe(this, e, n);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let n = [], i = 0, o = t;
    for (let s = e; ; ) {
      let { index: l, offset: a } = s.content.findIndex(o), c = o - a;
      if (n.push(s, l, i + a), !c || (s = s.child(l), s.isText))
        break;
      o = c - 1, i += a + 1;
    }
    return new ke(t, n, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let n = Nt.get(e);
    if (n)
      for (let o = 0; o < n.elts.length; o++) {
        let s = n.elts[o];
        if (s.pos == t)
          return s;
      }
    else
      Nt.set(e, n = new kr());
    let i = n.elts[n.i] = ke.resolve(e, t);
    return n.i = (n.i + 1) % br, i;
  }
}
class kr {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const br = 12, Nt = /* @__PURE__ */ new WeakMap();
class Fe {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, n) {
    this.$from = e, this.$to = t, this.depth = n;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const Sr = /* @__PURE__ */ Object.create(null);
let ie = class ut {
  /**
  @internal
  */
  constructor(e, t, n, i = C.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = n || y.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, n, i = 0) {
    this.content.nodesBetween(e, t, n, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, n, i) {
    return this.content.textBetween(e, t, n, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, n) {
    return this.type == e && Le(this.attrs, t || e.defaultAttrs || Sr) && C.sameSet(this.marks, n || C.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new ut(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new ut(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, n = !1) {
    if (e == t)
      return v.empty;
    let i = this.resolve(e), o = this.resolve(t), s = n ? 0 : i.sharedDepth(t), l = i.start(s), c = i.node(s).content.cut(i.pos - l, o.pos - l);
    return new v(c, i.depth - s, o.depth - s);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, n) {
    return xr(this.resolve(e), this.resolve(t), n);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: n, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(n), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: n } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: n };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: n } = this.content.findIndex(e);
    if (n < e)
      return { node: this.content.child(t), index: t, offset: n };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: n - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return ke.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return ke.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, n) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (o) => (n.isInSet(o.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), fn(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, n = y.empty, i = 0, o = n.childCount) {
    let s = this.contentMatchAt(e).matchFragment(n, i, o), l = s && s.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = i; a < o; a++)
      if (!this.type.allowsMarks(n.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, n, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let o = this.contentMatchAt(e).matchType(n), s = o && o.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = C.none;
    for (let t = 0; t < this.marks.length; t++) {
      let n = this.marks[t];
      n.type.checkAttrs(n.attrs), e = n.addToSet(e);
    }
    if (!C.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let n;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      n = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, n);
    }
    let i = y.fromJSON(e, t.content), o = e.nodeType(t.type).create(t.attrs, i, n);
    return o.type.checkAttrs(o.attrs), o;
  }
};
ie.prototype.text = void 0;
class je extends ie {
  /**
  @internal
  */
  constructor(e, t, n, i) {
    if (super(e, t, null, i), !n)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = n;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : fn(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new je(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new je(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function fn(r, e) {
  for (let t = r.length - 1; t >= 0; t--)
    e = r[t].type.name + "(" + e + ")";
  return e;
}
class oe {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let n = new Cr(e, t);
    if (n.next == null)
      return oe.empty;
    let i = un(n);
    n.next && n.err("Unexpected trailing text");
    let o = Tr(Or(i));
    return Rr(o, n), o;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, n = e.childCount) {
    let i = this;
    for (let o = t; i && o < n; o++)
      i = i.matchType(e.child(o).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let n = 0; n < e.next.length; n++)
        if (this.next[t].type == e.next[n].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, n = 0) {
    let i = [this];
    function o(s, l) {
      let a = s.matchFragment(e, n);
      if (a && (!t || a.validEnd))
        return y.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: f, next: u } = s.next[c];
        if (!(f.isText || f.hasRequiredAttrs()) && i.indexOf(u) == -1) {
          i.push(u);
          let h = o(u, l.concat(f));
          if (h)
            return h;
        }
      }
      return null;
    }
    return o(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let n = 0; n < this.wrapCache.length; n += 2)
      if (this.wrapCache[n] == e)
        return this.wrapCache[n + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), n = [{ match: this, type: null, via: null }];
    for (; n.length; ) {
      let i = n.shift(), o = i.match;
      if (o.matchType(e)) {
        let s = [];
        for (let l = i; l.type; l = l.via)
          s.push(l.type);
        return s.reverse();
      }
      for (let s = 0; s < o.next.length; s++) {
        let { type: l, next: a } = o.next[s];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!i.type || a.validEnd) && (n.push({ match: l.contentMatch, type: l, via: i }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(n) {
      e.push(n);
      for (let i = 0; i < n.next.length; i++)
        e.indexOf(n.next[i].next) == -1 && t(n.next[i].next);
    }
    return t(this), e.map((n, i) => {
      let o = i + (n.validEnd ? "*" : " ") + " ";
      for (let s = 0; s < n.next.length; s++)
        o += (s ? ", " : "") + n.next[s].type.name + "->" + e.indexOf(n.next[s].next);
      return o;
    }).join(`
`);
  }
}
oe.empty = new oe(!0);
class Cr {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function un(r) {
  let e = [];
  do
    e.push(Er(r));
  while (r.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Er(r) {
  let e = [];
  do
    e.push(Ar(r));
  while (r.next && r.next != ")" && r.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Ar(r) {
  let e = Nr(r);
  for (; ; )
    if (r.eat("+"))
      e = { type: "plus", expr: e };
    else if (r.eat("*"))
      e = { type: "star", expr: e };
    else if (r.eat("?"))
      e = { type: "opt", expr: e };
    else if (r.eat("{"))
      e = Ir(r, e);
    else
      break;
  return e;
}
function Ot(r) {
  /\D/.test(r.next) && r.err("Expected number, got '" + r.next + "'");
  let e = Number(r.next);
  return r.pos++, e;
}
function Ir(r, e) {
  let t = Ot(r), n = t;
  return r.eat(",") && (r.next != "}" ? n = Ot(r) : n = -1), r.eat("}") || r.err("Unclosed braced range"), { type: "range", min: t, max: n, expr: e };
}
function Mr(r, e) {
  let t = r.nodeTypes, n = t[e];
  if (n)
    return [n];
  let i = [];
  for (let o in t) {
    let s = t[o];
    s.isInGroup(e) && i.push(s);
  }
  return i.length == 0 && r.err("No node type or group '" + e + "' found"), i;
}
function Nr(r) {
  if (r.eat("(")) {
    let e = un(r);
    return r.eat(")") || r.err("Missing closing paren"), e;
  } else if (/\W/.test(r.next))
    r.err("Unexpected token '" + r.next + "'");
  else {
    let e = Mr(r, r.next).map((t) => (r.inline == null ? r.inline = t.isInline : r.inline != t.isInline && r.err("Mixing inline and block content"), { type: "name", value: t }));
    return r.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Or(r) {
  let e = [[]];
  return i(o(r, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function n(s, l, a) {
    let c = { term: a, to: l };
    return e[s].push(c), c;
  }
  function i(s, l) {
    s.forEach((a) => a.to = l);
  }
  function o(s, l) {
    if (s.type == "choice")
      return s.exprs.reduce((a, c) => a.concat(o(c, l)), []);
    if (s.type == "seq")
      for (let a = 0; ; a++) {
        let c = o(s.exprs[a], l);
        if (a == s.exprs.length - 1)
          return c;
        i(c, l = t());
      }
    else if (s.type == "star") {
      let a = t();
      return n(l, a), i(o(s.expr, a), a), [n(a)];
    } else if (s.type == "plus") {
      let a = t();
      return i(o(s.expr, l), a), i(o(s.expr, a), a), [n(a)];
    } else {
      if (s.type == "opt")
        return [n(l)].concat(o(s.expr, l));
      if (s.type == "range") {
        let a = l;
        for (let c = 0; c < s.min; c++) {
          let f = t();
          i(o(s.expr, a), f), a = f;
        }
        if (s.max == -1)
          i(o(s.expr, a), a);
        else
          for (let c = s.min; c < s.max; c++) {
            let f = t();
            n(a, f), i(o(s.expr, a), f), a = f;
          }
        return [n(a)];
      } else {
        if (s.type == "name")
          return [n(l, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function dn(r, e) {
  return e - r;
}
function Tt(r, e) {
  let t = [];
  return n(e), t.sort(dn);
  function n(i) {
    let o = r[i];
    if (o.length == 1 && !o[0].term)
      return n(o[0].to);
    t.push(i);
    for (let s = 0; s < o.length; s++) {
      let { term: l, to: a } = o[s];
      !l && t.indexOf(a) == -1 && n(a);
    }
  }
}
function Tr(r) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Tt(r, 0));
  function t(n) {
    let i = [];
    n.forEach((s) => {
      r[s].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let f = 0; f < i.length; f++)
          i[f][0] == l && (c = i[f][1]);
        Tt(r, a).forEach((f) => {
          c || i.push([l, c = []]), c.indexOf(f) == -1 && c.push(f);
        });
      });
    });
    let o = e[n.join(",")] = new oe(n.indexOf(r.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let l = i[s][1].sort(dn);
      o.next.push({ type: i[s][0], next: e[l.join(",")] || t(l) });
    }
    return o;
  }
}
function Rr(r, e) {
  for (let t = 0, n = [r]; t < n.length; t++) {
    let i = n[t], o = !i.validEnd, s = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      s.push(a.name), o && !(a.isText || a.hasRequiredAttrs()) && (o = !1), n.indexOf(c) == -1 && n.push(c);
    }
    o && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function hn(r) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in r) {
    let n = r[t];
    if (!n.hasDefault)
      return null;
    e[t] = n.default;
  }
  return e;
}
function pn(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let n in r) {
    let i = e && e[n];
    if (i === void 0) {
      let o = r[n];
      if (o.hasDefault)
        i = o.default;
      else
        throw new RangeError("No value supplied for attribute " + n);
    }
    t[n] = i;
  }
  return t;
}
function mn(r, e, t, n) {
  for (let i in e)
    if (!(i in r))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in r) {
    let o = r[i];
    o.validate && o.validate(e[i]);
  }
}
function gn(r, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let n in e)
      t[n] = new Br(r, n, e[n]);
  return t;
}
class Je {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = gn(e, n.attrs), this.defaultAttrs = hn(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == oe.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : pn(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, n) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new ie(this, this.computeAttrs(e), y.from(t), C.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, n) {
    return t = y.from(t), this.checkContent(t), new ie(this, this.computeAttrs(e), t, C.setFrom(n));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, n) {
    if (e = this.computeAttrs(e), t = y.from(t), t.size) {
      let s = this.contentMatch.fillBefore(t);
      if (!s)
        return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t), o = i && i.fillBefore(y.empty, !0);
    return o ? new ie(this, e, t.append(o), C.setFrom(n)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let n = 0; n < e.childCount; n++)
      if (!this.allowsMarks(e.child(n).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    mn(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let n = 0; n < e.length; n++)
      this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t || (t = e.slice(0, n));
    return t ? t.length ? t : C.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null);
    e.forEach((o, s) => n[o] = new Je(o, t, s));
    let i = t.spec.topNode || "doc";
    if (!n[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!n.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in n.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return n;
  }
}
function zr(r, e, t) {
  let n = t.split("|");
  return (i) => {
    let o = i === null ? "null" : typeof i;
    if (n.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${n} for attribute ${e} on type ${r}, got ${o}`);
  };
}
class Br {
  constructor(e, t, n) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? zr(e, t, n.validate) : n.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class mt {
  /**
  @internal
  */
  constructor(e, t, n, i) {
    this.name = e, this.rank = t, this.schema = n, this.spec = i, this.attrs = gn(e, i.attrs), this.excluded = null;
    let o = hn(this.attrs);
    this.instance = o ? new C(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new C(this, pn(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let n = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((o, s) => n[o] = new mt(o, i++, t, s)), n;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    mn(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Dr {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = T.from(e.nodes), t.marks = T.from(e.marks || {}), this.nodes = Je.compile(this.spec.nodes, this), this.marks = mt.compile(this.spec.marks, this);
    let n = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i], s = o.spec.content || "", l = o.spec.marks;
      if (o.contentMatch = n[s] || (n[s] = oe.parse(s, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = l == "_" ? null : l ? Rt(this, l.split(" ")) : l == "" || !o.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i], s = o.spec.excludes;
      o.excluded = s == null ? [o] : s == "" ? [] : Rt(this, s.split(" "));
    }
    this.nodeFromJSON = (i) => ie.fromJSON(this, i), this.markFromJSON = (i) => C.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, n, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Je) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, n, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let n = this.nodes.text;
    return new je(n, n.defaultAttrs, e, C.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Rt(r, e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let i = e[n], o = r.marks[i], s = o;
    if (o)
      t.push(o);
    else
      for (let l in r.marks) {
        let a = r.marks[l];
        (i == "_" || a.spec.group && a.spec.group.split(" ").indexOf(i) > -1) && t.push(s = a);
      }
    if (!s)
      throw new SyntaxError("Unknown mark type: '" + e[n] + "'");
  }
  return t;
}
function Lr(r) {
  return r.tag != null;
}
function Pr(r) {
  return r.style != null;
}
class fe {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let n = this.matchedStyles = [];
    t.forEach((i) => {
      if (Lr(i))
        this.tags.push(i);
      else if (Pr(i)) {
        let o = /[^=]*/.exec(i.style)[0];
        n.indexOf(o) < 0 && n.push(o), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let o = e.nodes[i.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let n = new Bt(this, t, !1);
    return n.addAll(e, C.none, t.from, t.to), n.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let n = new Bt(this, t, !0);
    return n.addAll(e, C.none, t.from, t.to), v.maxOpen(n.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, n) {
    for (let i = n ? this.tags.indexOf(n) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (jr(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let s = o.getAttrs(e);
          if (s === !1)
            continue;
          o.attrs = s || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, n, i) {
    for (let o = i ? this.styles.indexOf(i) + 1 : 0; o < this.styles.length; o++) {
      let s = this.styles[o], l = s.style;
      if (!(l.indexOf(e) != 0 || s.context && !n.matchesContext(s.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1)
            continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function n(i) {
      let o = i.priority == null ? 50 : i.priority, s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < o)
          break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o && o.forEach((s) => {
        n(s = Dt(s)), s.mark || s.ignore || s.clearMark || (s.mark = i);
      });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o && o.forEach((s) => {
        n(s = Dt(s)), s.node || s.ignore || s.mark || (s.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new fe(e, fe.schemaRules(e)));
  }
}
const wn = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, $r = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, yn = { ol: !0, ul: !0 }, be = 1, dt = 2, ye = 4;
function zt(r, e, t) {
  return e != null ? (e ? be : 0) | (e === "full" ? dt : 0) : r && r.whitespace == "pre" ? be | dt : t & ~ye;
}
class Me {
  constructor(e, t, n, i, o, s) {
    this.type = e, this.attrs = t, this.marks = n, this.solid = i, this.options = s, this.content = [], this.activeMarks = C.none, this.match = o || (s & ye ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(y.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let n = this.type.contentMatch, i;
        return (i = n.findWrapping(e.type)) ? (this.match = n, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & be)) {
      let n = this.content[this.content.length - 1], i;
      if (n && n.isText && (i = /[ \t\r\n\u000c]+$/.exec(n.text))) {
        let o = n;
        n.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - i[0].length));
      }
    }
    let t = y.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(y.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !wn.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Bt {
  constructor(e, t, n) {
    this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, o, s = zt(null, t.preserveWhitespace, 0) | (n ? ye : 0);
    i ? o = new Me(i.type, i.attrs, C.none, !0, t.topMatch || i.type.contentMatch, s) : n ? o = new Me(null, null, C.none, !0, null, s) : o = new Me(e.schema.topNodeType, null, C.none, !0, null, s), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let n = e.nodeValue, i = this.top, o = i.options & dt ? "full" : this.localPreserveWS || (i.options & be) > 0, { schema: s } = this.parser;
    if (o === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (o)
        if (o === "full")
          n = n.replace(/\r\n?/g, `
`);
        else if (s.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(s.linebreakReplacement.create())) {
          let l = n.split(/\r?\n|\r/);
          for (let a = 0; a < l.length; a++)
            a && this.insertNode(s.linebreakReplacement.create(), t, !0), l[a] && this.insertNode(s.text(l[a]), t, !/\S/.test(l[a]));
          n = "";
        } else
          n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let l = i.content[i.content.length - 1], a = e.previousSibling;
        (!l || a && a.nodeName == "BR" || l.isText && /[ \t\r\n\u000c]$/.test(l.text)) && (n = n.slice(1));
      }
      n && this.insertNode(s.text(n), t, !/\S/.test(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, n) {
    let i = this.localPreserveWS, o = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let s = e.nodeName.toLowerCase(), l;
    yn.hasOwnProperty(s) && this.parser.normalizeLists && Fr(e);
    let a = this.options.ruleFromNode && this.options.ruleFromNode(e) || (l = this.parser.matchTag(e, this, n));
    e: if (a ? a.ignore : $r.hasOwnProperty(s))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!a || a.skip || a.closeParent) {
      a && a.closeParent ? this.open = Math.max(0, this.open - 1) : a && a.skip.nodeType && (e = a.skip);
      let c, f = this.needsBlock;
      if (wn.hasOwnProperty(s))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), c = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let u = a && a.skip ? t : this.readStyles(e, t);
      u && this.addAll(e, u), c && this.sync(o), this.needsBlock = f;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, a, c, a.consuming === !1 ? l : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let n = e.style;
    if (n && n.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let o = this.parser.matchedStyles[i], s = n.getPropertyValue(o);
        if (s)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(o, s, this, l);
            if (!a)
              break;
            if (a.ignore)
              return null;
            if (a.clearMark ? t = t.filter((c) => !a.clearMark(c)) : t = t.concat(this.parser.schema.marks[a.mark].create(a.attrs)), a.consuming === !1)
              l = a;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, n, i) {
    let o, s;
    if (t.node)
      if (s = this.parser.schema.nodes[t.node], s.isLeaf)
        this.insertNode(s.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
      else {
        let a = this.enter(s, t.attrs || null, n, t.preserveWhitespace);
        a && (o = !0, n = a);
      }
    else {
      let a = this.parser.schema.marks[t.mark];
      n = n.concat(a.create(t.attrs));
    }
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, n, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a, n, !1));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a, n), this.findAround(e, a, !1);
    }
    o && this.sync(l) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, n, i) {
    let o = n || 0;
    for (let s = n ? e.childNodes[n] : e.firstChild, l = i == null ? null : e.childNodes[i]; s != l; s = s.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(s, t);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, n) {
    let i, o;
    for (let s = this.open, l = 0; s >= 0; s--) {
      let a = this.nodes[s], c = a.findWrapping(e);
      if (c && (!i || i.length > c.length + l) && (i = c, o = a, !c.length))
        break;
      if (a.solid) {
        if (n)
          break;
        l += 2;
      }
    }
    if (!i)
      return null;
    this.sync(o);
    for (let s = 0; s < i.length; s++)
      t = this.enterInner(i[s], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, n) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let o = this.textblockFromContext();
      o && (t = this.enterInner(o, null, t));
    }
    let i = this.findPlace(e, t, n);
    if (i) {
      this.closeExtra();
      let o = this.top;
      o.match && (o.match = o.match.matchType(e.type));
      let s = C.none;
      for (let l of i.concat(e.marks))
        (o.type ? o.type.allowsMarkType(l.type) : Lt(l.type, e.type)) && (s = l.addToSet(s));
      return o.content.push(e.mark(s)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, n, i) {
    let o = this.findPlace(e.create(t), n, !1);
    return o && (o = this.enterInner(e, t, n, !0, i)), o;
  }
  // Open a node of the given type
  enterInner(e, t, n, i = !1, o) {
    this.closeExtra();
    let s = this.top;
    s.match = s.match && s.match.matchType(e);
    let l = zt(e, o, s.options);
    s.options & ye && s.content.length == 0 && (l |= ye);
    let a = C.none;
    return n = n.filter((c) => (s.type ? s.type.allowsMarkType(c.type) : Lt(c.type, e)) ? (a = c.addToSet(a), !1) : !0), this.nodes.push(new Me(e, t, a, i, null, l)), this.open++, n;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= be);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let n = this.nodes[t].content;
      for (let i = n.length - 1; i >= 0; i--)
        e += n[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, n) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (n ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), n = this.options.context, i = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), o = -(n ? n.depth + 1 : 0) + (i ? 0 : 1), s = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= o; a--)
            if (s(l - 1, a))
              return !0;
          return !1;
        } else {
          let f = a > 0 || a == 0 && i ? this.nodes[a].type : n && a >= o ? n.node(a - o).type : null;
          if (!f || f.name != c && !f.isInGroup(c))
            return !1;
          a--;
        }
      }
      return !0;
    };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (n && n.isTextblock && n.defaultAttrs)
          return n;
      }
    for (let t in this.parser.schema.nodes) {
      let n = this.parser.schema.nodes[t];
      if (n.isTextblock && n.defaultAttrs)
        return n;
    }
  }
}
function Fr(r) {
  for (let e = r.firstChild, t = null; e; e = e.nextSibling) {
    let n = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    n && yn.hasOwnProperty(n) && t ? (t.appendChild(e), e = t) : n == "li" ? t = e : n && (t = null);
  }
}
function jr(r, e) {
  return (r.matches || r.msMatchesSelector || r.webkitMatchesSelector || r.mozMatchesSelector).call(r, e);
}
function Dt(r) {
  let e = {};
  for (let t in r)
    e[t] = r[t];
  return e;
}
function Lt(r, e) {
  let t = e.schema.nodes;
  for (let n in t) {
    let i = t[n];
    if (!i.allowsMarkType(r))
      continue;
    let o = [], s = (l) => {
      o.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: f } = l.edge(a);
        if (c == e || o.indexOf(f) < 0 && s(f))
          return !0;
      }
    };
    if (s(i.contentMatch))
      return !0;
  }
}
const xn = 65535, vn = Math.pow(2, 16);
function Jr(r, e) {
  return r + e * vn;
}
function Pt(r) {
  return r & xn;
}
function Vr(r) {
  return (r - (r & xn)) / vn;
}
const kn = 1, bn = 2, Be = 4, Sn = 8;
class $t {
  /**
  @internal
  */
  constructor(e, t, n) {
    this.pos = e, this.delInfo = t, this.recover = n;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Sn) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (kn | Be)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (bn | Be)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Be) > 0;
  }
}
class J {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && J.empty)
      return J.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, n = Pt(e);
    if (!this.inverted)
      for (let i = 0; i < n; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[n * 3] + t + Vr(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, n) {
    let i = 0, o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + o], f = this.ranges[l + s], u = a + c;
      if (e <= u) {
        let h = c ? e == a ? -1 : e == u ? 1 : t : t, d = a + i + (h < 0 ? 0 : f);
        if (n)
          return d;
        let g = e == (t < 0 ? a : u) ? null : Jr(l / 3, e - a), p = e == a ? bn : e == u ? kn : Be;
        return (t < 0 ? e != a : e != u) && (p |= Sn), new $t(d, p, g);
      }
      i += f - c;
    }
    return n ? e + i : new $t(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let n = 0, i = Pt(t), o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? n : 0);
      if (a > e)
        break;
      let c = this.ranges[l + o], f = a + c;
      if (e <= f && l == i * 3)
        return !0;
      n += this.ranges[l + s] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i], l = s - (this.inverted ? o : 0), a = s + (this.inverted ? 0 : o), c = this.ranges[i + t], f = this.ranges[i + n];
      e(l, l + c, a, a + f), o += f - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new J(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? J.empty : new J(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
J.empty = new J([]);
const tt = /* @__PURE__ */ Object.create(null);
class D {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return J.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let n = tt[t.stepType];
    if (!n)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return n.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in tt)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return tt[e] = t, t.prototype.jsonID = e, t;
  }
}
class N {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new N(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new N(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, n, i) {
    try {
      return N.ok(e.replace(t, n, i));
    } catch (o) {
      if (o instanceof Pe)
        return N.fail(o.message);
      throw o;
    }
  }
}
function gt(r, e, t) {
  let n = [];
  for (let i = 0; i < r.childCount; i++) {
    let o = r.child(i);
    o.content.size && (o = o.copy(gt(o.content, e, o))), o.isInline && (o = e(o, t, i)), n.push(o);
  }
  return y.fromArray(n);
}
class Q extends D {
  /**
  Create a mark step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = e.resolve(this.from), i = n.node(n.sharedDepth(this.to)), o = new v(gt(t.content, (s, l) => !s.isAtom || !l.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return N.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new Z(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new Q(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof Q && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Q(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Q(t.from, t.to, e.markFromJSON(t.mark));
  }
}
D.jsonID("addMark", Q);
class Z extends D {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, n) {
    super(), this.from = e, this.to = t, this.mark = n;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), n = new v(gt(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return N.fromReplace(e, this.from, this.to, n);
  }
  invert() {
    return new Q(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1);
    return t.deleted && n.deleted || t.pos >= n.pos ? null : new Z(t.pos, n.pos, this.mark);
  }
  merge(e) {
    return e instanceof Z && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Z(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Z(t.from, t.to, e.markFromJSON(t.mark));
  }
}
D.jsonID("removeMark", Z);
class ee extends D {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return N.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return N.fromReplace(e, this.pos, this.pos + 1, new v(y.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let n = this.mark.addToSet(t.marks);
      if (n.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(n))
            return new ee(this.pos, t.marks[i]);
        return new ee(this.pos, this.mark);
      }
    }
    return new Se(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new ee(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new ee(t.pos, e.markFromJSON(t.mark));
  }
}
D.jsonID("addNodeMark", ee);
class Se extends D {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return N.fail("No node at mark step's position");
    let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return N.fromReplace(e, this.pos, this.pos + 1, new v(y.from(n), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new ee(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Se(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Se(t.pos, e.markFromJSON(t.mark));
  }
}
D.jsonID("removeNodeMark", Se);
class P extends D {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, n, i = !1) {
    super(), this.from = e, this.to = t, this.slice = n, this.structure = i;
  }
  apply(e) {
    return this.structure && ht(e, this.from, this.to) ? N.fail("Structure replace would overwrite content") : N.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new J([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new P(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), n = this.from == this.to && P.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return n.deletedAcross && t.deletedAcross ? null : new P(n.pos, Math.max(n.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof P) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? v.empty : new v(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new P(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? v.empty : new v(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new P(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new P(t.from, t.to, v.fromJSON(e, t.slice), !!t.structure);
  }
}
P.MAP_BIAS = 1;
D.jsonID("replace", P);
class F extends D {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, n, i, o, s, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = i, this.slice = o, this.insert = s, this.structure = l;
  }
  apply(e) {
    if (this.structure && (ht(e, this.from, this.gapFrom) || ht(e, this.gapTo, this.to)))
      return N.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return N.fail("Gap is not a flat range");
    let n = this.slice.insertAt(this.insert, t.content);
    return n ? N.fromReplace(e, this.from, this.to, n) : N.fail("Content does not fit in gap");
  }
  getMap() {
    return new J([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new F(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), n = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? n.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && n.deletedAcross || i < t.pos || o > n.pos ? null : new F(t.pos, n.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new F(t.from, t.to, t.gapFrom, t.gapTo, v.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
D.jsonID("replaceAround", F);
function ht(r, e, t) {
  let n = r.resolve(e), i = t - e, o = n.depth;
  for (; i > 0 && o > 0 && n.indexAfter(o) == n.node(o).childCount; )
    o--, i--;
  if (i > 0) {
    let s = n.node(o).maybeChild(n.indexAfter(o));
    for (; i > 0; ) {
      if (!s || s.isLeaf)
        return !0;
      s = s.firstChild, i--;
    }
  }
  return !1;
}
function qr(r, e, t) {
  return (e == 0 || r.canReplace(e, r.childCount)) && (t == r.childCount || r.canReplace(0, t));
}
function pe(r) {
  let t = r.parent.content.cutByIndex(r.startIndex, r.endIndex);
  for (let n = r.depth, i = 0, o = 0; ; --n) {
    let s = r.$from.node(n), l = r.$from.index(n) + i, a = r.$to.indexAfter(n) - o;
    if (n < r.depth && s.canReplace(l, a, t))
      return n;
    if (n == 0 || s.type.spec.isolating || !qr(s, l, a))
      break;
    l && (i = 1), a < s.childCount && (o = 1);
  }
  return null;
}
function Cn(r, e, t = null, n = r) {
  let i = Hr(r, e), o = i && Wr(n, e);
  return o ? i.map(Ft).concat({ type: e, attrs: t }).concat(o.map(Ft)) : null;
}
function Ft(r) {
  return { type: r, attrs: null };
}
function Hr(r, e) {
  let { parent: t, startIndex: n, endIndex: i } = r, o = t.contentMatchAt(n).findWrapping(e);
  if (!o)
    return null;
  let s = o.length ? o[0] : e;
  return t.canReplaceWith(n, i, s) ? o : null;
}
function Wr(r, e) {
  let { parent: t, startIndex: n, endIndex: i } = r, o = t.child(n), s = e.contentMatch.findWrapping(o.type);
  if (!s)
    return null;
  let a = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let c = n; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : s;
}
function X(r, e, t = 1, n) {
  let i = r.resolve(e), o = i.depth - t, s = n && n[n.length - 1] || i.parent;
  if (o < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, f = t - 2; c > o; c--, f--) {
    let u = i.node(c), h = i.index(c);
    if (u.type.spec.isolating)
      return !1;
    let d = u.content.cutByIndex(h, u.childCount), g = n && n[f + 1];
    g && (d = d.replaceChild(0, g.type.create(g.attrs)));
    let p = n && n[f] || u;
    if (!u.canReplace(h + 1, u.childCount) || !p.type.validContent(d))
      return !1;
  }
  let l = i.indexAfter(o), a = n && n[0];
  return i.node(o).canReplaceWith(l, l, a ? a.type : i.node(o + 1).type);
}
function se(r, e) {
  let t = r.resolve(e), n = t.index();
  return En(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(n, n + 1);
}
function Ur(r, e) {
  e.content.size || r.type.compatibleContent(e.type);
  let t = r.contentMatchAt(r.childCount), { linebreakReplacement: n } = r.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let o = e.child(i), s = o.type == n ? r.type.schema.nodes.text : o.type;
    if (t = t.matchType(s), !t || !r.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function En(r, e) {
  return !!(r && e && !r.isLeaf && Ur(r, e));
}
function _e(r, e, t = -1) {
  let n = r.resolve(e);
  for (let i = n.depth; ; i--) {
    let o, s, l = n.index(i);
    if (i == n.depth ? (o = n.nodeBefore, s = n.nodeAfter) : t > 0 ? (o = n.node(i + 1), l++, s = n.node(i).maybeChild(l)) : (o = n.node(i).maybeChild(l - 1), s = n.node(i + 1)), o && !o.isTextblock && En(o, s) && n.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? n.before(i) : n.after(i);
  }
}
function wt(r, e, t = e, n = v.empty) {
  if (e == t && !n.size)
    return null;
  let i = r.resolve(e), o = r.resolve(t);
  return _r(i, o, n) ? new P(e, t, n) : new Kr(i, o, n).fit();
}
function _r(r, e, t) {
  return !t.openStart && !t.openEnd && r.start() == e.start() && r.parent.canReplace(r.index(), e.index(), t.content);
}
class Kr {
  constructor(e, t, n) {
    this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = y.empty;
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = y.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, i = this.close(e < 0 ? this.$to : n.doc.resolve(e));
    if (!i)
      return null;
    let o = this.placed, s = n.depth, l = i.depth;
    for (; s && l && o.childCount == 1; )
      o = o.firstChild.content, s--, l--;
    let a = new v(o, s, l);
    return e > -1 ? new F(n.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || n.pos != this.$to.pos ? new P(n.pos, i.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, n = 0, i = this.unplaced.openEnd; n < e; n++) {
      let o = t.firstChild;
      if (t.childCount > 1 && (i = 0), o.type.spec.isolating && i <= n) {
        e = n;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
        let i, o = null;
        n ? (o = nt(this.unplaced.content, n - 1).firstChild, i = o.content) : i = this.unplaced.content;
        let s = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], f, u = null;
          if (t == 1 && (s ? c.matchType(s.type) || (u = c.fillBefore(y.from(s), !1)) : o && a.compatibleContent(o.type)))
            return { sliceDepth: n, frontierDepth: l, parent: o, inject: u };
          if (t == 2 && s && (f = c.findWrapping(s.type)))
            return { sliceDepth: n, frontierDepth: l, parent: o, wrap: f };
          if (o && c.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, i = nt(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new v(e, t + 1, Math.max(n, i.size + t >= e.size - n ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: n } = this.unplaced, i = nt(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new v(me(e, t - 1, 1), t - 1, o ? t - 1 : n);
    } else
      this.unplaced = new v(me(e, t, 1), t, n);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: i, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let p = 0; p < o.length; p++)
        this.openFrontierNode(o[p]);
    let s = this.unplaced, l = n ? n.content : s.content, a = s.openStart - e, c = 0, f = [], { match: u, type: h } = this.frontier[t];
    if (i) {
      for (let p = 0; p < i.childCount; p++)
        f.push(i.child(p));
      u = u.matchFragment(i);
    }
    let d = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let p = l.child(c), w = u.matchType(p.type);
      if (!w)
        break;
      c++, (c > 1 || a == 0 || p.content.size) && (u = w, f.push(An(p.mark(h.allowedMarks(p.marks)), c == 1 ? a : 0, c == l.childCount ? d : -1)));
    }
    let g = c == l.childCount;
    g || (d = -1), this.placed = ge(this.placed, t, y.from(f)), this.frontier[t].match = u, g && d < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let p = 0, w = l; p < d; p++) {
      let x = w.lastChild;
      this.frontier.push({ type: x.type, match: x.contentMatchAt(x.childCount) }), w = x.content;
    }
    this.unplaced = g ? e == 0 ? v.empty : new v(me(s.content, e - 1, 1), e - 1, d < 0 ? s.openEnd : e - 1) : new v(me(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !rt(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: n } = this.$to, i = this.$to.after(n);
    for (; n > 1 && i == this.$to.end(--n); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: n, type: i } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = rt(e, t, i, n, o);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], f = rt(e, l, c, a, !0);
          if (!f || f.childCount)
            continue e;
        }
        return { depth: t, fit: s, move: o ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = ge(this.placed, t.depth, t.fit)), e = t.move;
    for (let n = t.depth + 1; n <= e.depth; n++) {
      let i = e.node(n), o = i.type.contentMatch.fillBefore(i.content, !0, e.index(n));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, n) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = ge(this.placed, this.depth, y.from(e.create(t, n))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(y.empty, !0);
    t.childCount && (this.placed = ge(this.placed, this.frontier.length, t));
  }
}
function me(r, e, t) {
  return e == 0 ? r.cutByIndex(t, r.childCount) : r.replaceChild(0, r.firstChild.copy(me(r.firstChild.content, e - 1, t)));
}
function ge(r, e, t) {
  return e == 0 ? r.append(t) : r.replaceChild(r.childCount - 1, r.lastChild.copy(ge(r.lastChild.content, e - 1, t)));
}
function nt(r, e) {
  for (let t = 0; t < e; t++)
    r = r.firstChild.content;
  return r;
}
function An(r, e, t) {
  if (e <= 0)
    return r;
  let n = r.content;
  return e > 1 && (n = n.replaceChild(0, An(n.firstChild, e - 1, n.childCount == 1 ? t - 1 : 0))), e > 0 && (n = r.type.contentMatch.fillBefore(n).append(n), t <= 0 && (n = n.append(r.type.contentMatch.matchFragment(n).fillBefore(y.empty, !0)))), r.copy(n);
}
function rt(r, e, t, n, i) {
  let o = r.node(e), s = i ? r.indexAfter(e) : r.index(e);
  if (s == o.childCount && !t.compatibleContent(o.type))
    return null;
  let l = n.fillBefore(o.content, !0, s);
  return l && !Gr(t, o.content, s) ? l : null;
}
function Gr(r, e, t) {
  for (let n = t; n < e.childCount; n++)
    if (!r.allowsMarks(e.child(n).marks))
      return !0;
  return !1;
}
class xe extends D {
  /**
  Construct an attribute step.
  */
  constructor(e, t, n) {
    super(), this.pos = e, this.attr = t, this.value = n;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return N.fail("No node at attribute step's position");
    let n = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      n[o] = t.attrs[o];
    n[this.attr] = this.value;
    let i = t.type.create(n, null, t.marks);
    return N.fromReplace(e, this.pos, this.pos + 1, new v(y.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return J.empty;
  }
  invert(e) {
    return new xe(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new xe(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new xe(t.pos, t.attr, t.value);
  }
}
D.jsonID("attr", xe);
class Ve extends D {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let n = e.type.create(t, e.content, e.marks);
    return N.ok(n);
  }
  getMap() {
    return J.empty;
  }
  invert(e) {
    return new Ve(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Ve(t.attr, t.value);
  }
}
D.jsonID("docAttr", Ve);
let Ce = class extends Error {
};
Ce = function r(e) {
  let t = Error.call(this, e);
  return t.__proto__ = r.prototype, t;
};
Ce.prototype = Object.create(Error.prototype);
Ce.prototype.constructor = Ce;
Ce.prototype.name = "TransformError";
const it = /* @__PURE__ */ Object.create(null);
class b {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, n) {
    this.$anchor = e, this.$head = t, this.ranges = n || [new Xr(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = v.empty) {
    let n = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = n, n = n.lastChild;
    let o = e.steps.length, s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l], f = e.mapping.slice(o);
      e.replaceRange(f.map(a.pos), f.map(c.pos), l ? v.empty : t), l == 0 && Vt(e, o, (n ? n.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let n = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: s, $to: l } = i[o], a = e.mapping.slice(n), c = a.map(s.pos), f = a.map(l.pos);
      o ? e.deleteRange(c, f) : (e.replaceRangeWith(c, f, t), Vt(e, n, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, n = !1) {
    let i = e.parent.inlineContent ? new E(e) : ce(e.node(0), e.parent, e.pos, e.index(), t, n);
    if (i)
      return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let s = t < 0 ? ce(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, n) : ce(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, n);
      if (s)
        return s;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new q(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return ce(e, e, 0, 0, 1) || new q(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return ce(e, e, e.content.size, e.childCount, -1) || new q(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let n = it[t.type];
    if (!n)
      throw new RangeError(`No selection type ${t.type} defined`);
    return n.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in it)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return it[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return E.between(this.$anchor, this.$head).getBookmark();
  }
}
b.prototype.visible = !0;
class Xr {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let jt = !1;
function Jt(r) {
  !jt && !r.parent.inlineContent && (jt = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + r.parent.type.name + ")"));
}
class E extends b {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Jt(e), Jt(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let n = e.resolve(t.map(this.head));
    if (!n.parent.inlineContent)
      return b.near(n);
    let i = e.resolve(t.map(this.anchor));
    return new E(i.parent.inlineContent ? i : n, n);
  }
  replace(e, t = v.empty) {
    if (super.replace(e, t), t == v.empty) {
      let n = this.$from.marksAcross(this.$to);
      n && e.ensureMarks(n);
    }
  }
  eq(e) {
    return e instanceof E && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ke(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new E(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, n = t) {
    let i = e.resolve(t);
    return new this(i, n == t ? i : e.resolve(n));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, n) {
    let i = e.pos - t.pos;
    if ((!n || i) && (n = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = b.findFrom(t, n, !0) || b.findFrom(t, -n, !0);
      if (o)
        t = o.$head;
      else
        return b.near(t, n);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (b.findFrom(e, -n, !0) || b.findFrom(e, n, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new E(e, t);
  }
}
b.jsonID("text", E);
class Ke {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Ke(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return E.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class S extends b {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, n), this.node = t;
  }
  map(e, t) {
    let { deleted: n, pos: i } = t.mapResult(this.anchor), o = e.resolve(i);
    return n ? b.near(o) : new S(o);
  }
  content() {
    return new v(y.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof S && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new yt(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new S(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new S(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
S.prototype.visible = !1;
b.jsonID("node", S);
class yt {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: n } = e.mapResult(this.anchor);
    return t ? new Ke(n, n) : new yt(n);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), n = t.nodeAfter;
    return n && S.isSelectable(n) ? new S(t) : b.near(t);
  }
}
class q extends b {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = v.empty) {
    if (t == v.empty) {
      e.delete(0, e.doc.content.size);
      let n = b.atStart(e.doc);
      n.eq(e.selection) || e.setSelection(n);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new q(e);
  }
  map(e) {
    return new q(e);
  }
  eq(e) {
    return e instanceof q;
  }
  getBookmark() {
    return Yr;
  }
}
b.jsonID("all", q);
const Yr = {
  map() {
    return this;
  },
  resolve(r) {
    return new q(r);
  }
};
function ce(r, e, t, n, i, o = !1) {
  if (e.inlineContent)
    return E.create(r, t);
  for (let s = n - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!o && S.isSelectable(l))
        return S.create(r, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = ce(r, l, t + i, i < 0 ? l.childCount : 0, i, o);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function Vt(r, e, t) {
  let n = r.steps.length - 1;
  if (n < e)
    return;
  let i = r.steps[n];
  if (!(i instanceof P || i instanceof F))
    return;
  let o = r.mapping.maps[n], s;
  o.forEach((l, a, c, f) => {
    s == null && (s = f);
  }), r.setSelection(b.near(r.doc.resolve(s), t));
}
function qt(r, e) {
  return !e || !r ? r : r.bind(e);
}
class Ne {
  constructor(e, t, n) {
    this.name = e, this.init = qt(t.init, n), this.apply = qt(t.apply, n);
  }
}
new Ne("doc", {
  init(r) {
    return r.doc || r.schema.topNodeType.createAndFill();
  },
  apply(r) {
    return r.doc;
  }
}), new Ne("selection", {
  init(r, e) {
    return r.selection || b.atStart(e.doc);
  },
  apply(r) {
    return r.selection;
  }
}), new Ne("storedMarks", {
  init(r) {
    return r.storedMarks || null;
  },
  apply(r, e, t, n) {
    return n.selection.$cursor ? r.storedMarks : null;
  }
}), new Ne("scrollToSelection", {
  init() {
    return 0;
  },
  apply(r, e) {
    return r.scrolledIntoView ? e + 1 : e;
  }
});
function In(r, e, t) {
  for (let n in r) {
    let i = r[n];
    i instanceof Function ? i = i.bind(e) : n == "handleDOMEvents" && (i = In(i, e, {})), t[n] = i;
  }
  return t;
}
class le {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && In(e.props, this, this.props), this.key = e.key ? e.key.key : Mn("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const ot = /* @__PURE__ */ Object.create(null);
function Mn(r) {
  return r in ot ? r + "$" + ++ot[r] : (ot[r] = 0, r + "$");
}
class ae {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Mn(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const xt = (r, e) => r.selection.empty ? !1 : (e && e(r.tr.deleteSelection().scrollIntoView()), !0);
function Nn(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("backward", r) : t.parentOffset > 0) ? null : t;
}
const On = (r, e, t) => {
  let n = Nn(r, t);
  if (!n)
    return !1;
  let i = vt(n);
  if (!i) {
    let s = n.blockRange(), l = s && pe(s);
    return l == null ? !1 : (e && e(r.tr.lift(s, l).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (Fn(r, i, e, -1))
    return !0;
  if (n.parent.content.size == 0 && (ue(o, "end") || S.isSelectable(o)))
    for (let s = n.depth; ; s--) {
      let l = wt(r.doc, n.before(s), n.after(s), v.empty);
      if (l && l.slice.size < l.to - l.from) {
        if (e) {
          let a = r.tr.step(l);
          a.setSelection(ue(o, "end") ? b.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : S.create(a.doc, i.pos - o.nodeSize)), e(a.scrollIntoView());
        }
        return !0;
      }
      if (s == 1 || n.node(s - 1).childCount > 1)
        break;
    }
  return o.isAtom && i.depth == n.depth - 1 ? (e && e(r.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Qr = (r, e, t) => {
  let n = Nn(r, t);
  if (!n)
    return !1;
  let i = vt(n);
  return i ? Tn(r, i, e) : !1;
}, Zr = (r, e, t) => {
  let n = zn(r, t);
  if (!n)
    return !1;
  let i = kt(n);
  return i ? Tn(r, i, e) : !1;
};
function Tn(r, e, t) {
  let n = e.nodeBefore, i = n, o = e.pos - 1;
  for (; !i.isTextblock; o--) {
    if (i.type.spec.isolating)
      return !1;
    let f = i.lastChild;
    if (!f)
      return !1;
    i = f;
  }
  let s = e.nodeAfter, l = s, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let f = l.firstChild;
    if (!f)
      return !1;
    l = f;
  }
  let c = wt(r.doc, o, a, v.empty);
  if (!c || c.from != o || c instanceof P && c.slice.size >= a - o)
    return !1;
  if (t) {
    let f = r.tr.step(c);
    f.setSelection(E.create(f.doc, o)), t(f.scrollIntoView());
  }
  return !0;
}
function ue(r, e, t = !1) {
  for (let n = r; n; n = e == "start" ? n.firstChild : n.lastChild) {
    if (n.isTextblock)
      return !0;
    if (t && n.childCount != 1)
      return !1;
  }
  return !1;
}
const Rn = (r, e, t) => {
  let { $head: n, empty: i } = r.selection, o = n;
  if (!i)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", r) : n.parentOffset > 0)
      return !1;
    o = vt(n);
  }
  let s = o && o.nodeBefore;
  return !s || !S.isSelectable(s) ? !1 : (e && e(r.tr.setSelection(S.create(r.doc, o.pos - s.nodeSize)).scrollIntoView()), !0);
};
function vt(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      if (r.index(e) > 0)
        return r.doc.resolve(r.before(e + 1));
      if (r.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function zn(r, e) {
  let { $cursor: t } = r.selection;
  return !t || (e ? !e.endOfTextblock("forward", r) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Bn = (r, e, t) => {
  let n = zn(r, t);
  if (!n)
    return !1;
  let i = kt(n);
  if (!i)
    return !1;
  let o = i.nodeAfter;
  if (Fn(r, i, e, 1))
    return !0;
  if (n.parent.content.size == 0 && (ue(o, "start") || S.isSelectable(o))) {
    let s = wt(r.doc, n.before(), n.after(), v.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let l = r.tr.step(s);
        l.setSelection(ue(o, "start") ? b.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : S.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == n.depth - 1 ? (e && e(r.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, Dn = (r, e, t) => {
  let { $head: n, empty: i } = r.selection, o = n;
  if (!i)
    return !1;
  if (n.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", r) : n.parentOffset < n.parent.content.size)
      return !1;
    o = kt(n);
  }
  let s = o && o.nodeAfter;
  return !s || !S.isSelectable(s) ? !1 : (e && e(r.tr.setSelection(S.create(r.doc, o.pos)).scrollIntoView()), !0);
};
function kt(r) {
  if (!r.parent.type.spec.isolating)
    for (let e = r.depth - 1; e >= 0; e--) {
      let t = r.node(e);
      if (r.index(e) + 1 < t.childCount)
        return r.doc.resolve(r.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const ei = (r, e) => {
  let t = r.selection, n = t instanceof S, i;
  if (n) {
    if (t.node.isTextblock || !se(r.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = _e(r.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let o = r.tr.join(i);
    n && o.setSelection(S.create(o.doc, i - r.doc.resolve(i).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, ti = (r, e) => {
  let t = r.selection, n;
  if (t instanceof S) {
    if (t.node.isTextblock || !se(r.doc, t.to))
      return !1;
    n = t.to;
  } else if (n = _e(r.doc, t.to, 1), n == null)
    return !1;
  return e && e(r.tr.join(n).scrollIntoView()), !0;
}, ni = (r, e) => {
  let { $from: t, $to: n } = r.selection, i = t.blockRange(n), o = i && pe(i);
  return o == null ? !1 : (e && e(r.tr.lift(i, o).scrollIntoView()), !0);
}, Ln = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  return !t.parent.type.spec.code || !t.sameParent(n) ? !1 : (e && e(r.tr.insertText(`
`).scrollIntoView()), !0);
};
function bt(r) {
  for (let e = 0; e < r.edgeCount; e++) {
    let { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const ri = (r, e) => {
  let { $head: t, $anchor: n } = r.selection;
  if (!t.parent.type.spec.code || !t.sameParent(n))
    return !1;
  let i = t.node(-1), o = t.indexAfter(-1), s = bt(i.contentMatchAt(o));
  if (!s || !i.canReplaceWith(o, o, s))
    return !1;
  if (e) {
    let l = t.after(), a = r.tr.replaceWith(l, l, s.createAndFill());
    a.setSelection(b.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Pn = (r, e) => {
  let t = r.selection, { $from: n, $to: i } = t;
  if (t instanceof q || n.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let o = bt(i.parent.contentMatchAt(i.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let s = (!n.parentOffset && i.index() < i.parent.childCount ? n : i).pos, l = r.tr.insert(s, o.createAndFill());
    l.setSelection(E.create(l.doc, s + 1)), e(l.scrollIntoView());
  }
  return !0;
}, $n = (r, e) => {
  let { $cursor: t } = r.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (X(r.doc, o))
      return e && e(r.tr.split(o).scrollIntoView()), !0;
  }
  let n = t.blockRange(), i = n && pe(n);
  return i == null ? !1 : (e && e(r.tr.lift(n, i).scrollIntoView()), !0);
};
function ii(r) {
  return (e, t) => {
    let { $from: n, $to: i } = e.selection;
    if (e.selection instanceof S && e.selection.node.isBlock)
      return !n.parentOffset || !X(e.doc, n.pos) ? !1 : (t && t(e.tr.split(n.pos).scrollIntoView()), !0);
    if (!n.depth)
      return !1;
    let o = [], s, l, a = !1, c = !1;
    for (let d = n.depth; ; d--)
      if (n.node(d).isBlock) {
        a = n.end(d) == n.pos + (n.depth - d), c = n.start(d) == n.pos - (n.depth - d), l = bt(n.node(d - 1).contentMatchAt(n.indexAfter(d - 1))), o.unshift(a && l ? { type: l } : null), s = d;
        break;
      } else {
        if (d == 1)
          return !1;
        o.unshift(null);
      }
    let f = e.tr;
    (e.selection instanceof E || e.selection instanceof q) && f.deleteSelection();
    let u = f.mapping.map(n.pos), h = X(f.doc, u, o.length, o);
    if (h || (o[0] = l ? { type: l } : null, h = X(f.doc, u, o.length, o)), !h)
      return !1;
    if (f.split(u, o.length, o), !a && c && n.node(s).type != l) {
      let d = f.mapping.map(n.before(s)), g = f.doc.resolve(d);
      l && n.node(s - 1).canReplaceWith(g.index(), g.index() + 1, l) && f.setNodeMarkup(f.mapping.map(n.before(s)), l);
    }
    return t && t(f.scrollIntoView()), !0;
  };
}
const oi = ii(), si = (r, e) => {
  let { $from: t, to: n } = r.selection, i, o = t.sharedDepth(n);
  return o == 0 ? !1 : (i = t.before(o), e && e(r.tr.setSelection(S.create(r.doc, i))), !0);
};
function li(r, e, t) {
  let n = e.nodeBefore, i = e.nodeAfter, o = e.index();
  return !n || !i || !n.type.compatibleContent(i.type) ? !1 : !n.content.size && e.parent.canReplace(o - 1, o) ? (t && t(r.tr.delete(e.pos - n.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || se(r.doc, e.pos)) ? !1 : (t && t(r.tr.join(e.pos).scrollIntoView()), !0);
}
function Fn(r, e, t, n) {
  let i = e.nodeBefore, o = e.nodeAfter, s, l, a = i.type.spec.isolating || o.type.spec.isolating;
  if (!a && li(r, e, t))
    return !0;
  let c = !a && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (s = (l = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && l.matchType(s[0] || o.type).validEnd) {
    if (t) {
      let d = e.pos + o.nodeSize, g = y.empty;
      for (let x = s.length - 1; x >= 0; x--)
        g = y.from(s[x].create(null, g));
      g = y.from(i.copy(g));
      let p = r.tr.step(new F(e.pos - 1, d, e.pos, d, new v(g, 1, 0), s.length, !0)), w = p.doc.resolve(d + 2 * s.length);
      w.nodeAfter && w.nodeAfter.type == i.type && se(p.doc, w.pos) && p.join(w.pos), t(p.scrollIntoView());
    }
    return !0;
  }
  let f = o.type.spec.isolating || n > 0 && a ? null : b.findFrom(e, 1), u = f && f.$from.blockRange(f.$to), h = u && pe(u);
  if (h != null && h >= e.depth)
    return t && t(r.tr.lift(u, h).scrollIntoView()), !0;
  if (c && ue(o, "start", !0) && ue(i, "end")) {
    let d = i, g = [];
    for (; g.push(d), !d.isTextblock; )
      d = d.lastChild;
    let p = o, w = 1;
    for (; !p.isTextblock; p = p.firstChild)
      w++;
    if (d.canReplace(d.childCount, d.childCount, p.content)) {
      if (t) {
        let x = y.empty;
        for (let I = g.length - 1; I >= 0; I--)
          x = y.from(g[I].copy(x));
        let M = r.tr.step(new F(e.pos - g.length, e.pos + o.nodeSize, e.pos + w, e.pos + o.nodeSize - w, new v(x, g.length, 0), 0, !0));
        t(M.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function jn(r) {
  return function(e, t) {
    let n = e.selection, i = r < 0 ? n.$from : n.$to, o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return i.node(o).isTextblock ? (t && t(e.tr.setSelection(E.create(e.doc, r < 0 ? i.start(o) : i.end(o)))), !0) : !1;
  };
}
const ai = jn(-1), ci = jn(1);
function fi(r, e = null) {
  return function(t, n) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o), l = s && Cn(s, r, e);
    return l ? (n && n(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function Ht(r, e = null) {
  return function(t, n) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let { $from: { pos: s }, $to: { pos: l } } = t.selection.ranges[o];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (i)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(r, e)))
          if (a.type == r)
            i = !0;
          else {
            let f = t.doc.resolve(c), u = f.index();
            i = f.parent.canReplaceWith(u, u + 1, r);
          }
      });
    }
    if (!i)
      return !1;
    if (n) {
      let o = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[s];
        o.setBlockType(l, a, r, e);
      }
      n(o.scrollIntoView());
    }
    return !0;
  };
}
function St(...r) {
  return function(e, t, n) {
    for (let i = 0; i < r.length; i++)
      if (r[i](e, t, n))
        return !0;
    return !1;
  };
}
St(xt, On, Rn);
St(xt, Bn, Dn);
St(Ln, Pn, $n, oi);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function ui(r, e = null) {
  return function(t, n) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o);
    if (!s)
      return !1;
    let l = n ? t.tr : null;
    return di(l, s, r, e) ? (n && n(l.scrollIntoView()), !0) : !1;
  };
}
function di(r, e, t, n = null) {
  let i = !1, o = e, s = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let a = s.resolve(e.start - 2);
    o = new Fe(a, a, e.depth), e.endIndex < e.parent.childCount && (e = new Fe(e.$from, s.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let l = Cn(o, t, n, e);
  return l ? (r && hi(r, e, l, i, t), !0) : !1;
}
function hi(r, e, t, n, i) {
  let o = y.empty;
  for (let f = t.length - 1; f >= 0; f--)
    o = y.from(t[f].type.create(t[f].attrs, o));
  r.step(new F(e.start - (n ? 2 : 0), e.end, e.start, e.end, new v(o, 0, 0), t.length, !0));
  let s = 0;
  for (let f = 0; f < t.length; f++)
    t[f].type == i && (s = f + 1);
  let l = t.length - s, a = e.start + t.length - (n ? 2 : 0), c = e.parent;
  for (let f = e.startIndex, u = e.endIndex, h = !0; f < u; f++, h = !1)
    !h && X(r.doc, a, l) && (r.split(a, l), a += 2 * l), a += c.child(f).nodeSize;
  return r;
}
function pi(r) {
  return function(e, t) {
    let { $from: n, $to: i } = e.selection, o = n.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == r);
    return o ? t ? n.node(o.depth - 1).type == r ? mi(e, t, r, o) : gi(e, t, o) : !0 : !1;
  };
}
function mi(r, e, t, n) {
  let i = r.tr, o = n.end, s = n.$to.end(n.depth);
  o < s && (i.step(new F(o - 1, s, o, s, new v(y.from(t.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new Fe(i.doc.resolve(n.$from.pos), i.doc.resolve(s), n.depth));
  const l = pe(n);
  if (l == null)
    return !1;
  i.lift(n, l);
  let a = i.doc.resolve(i.mapping.map(o, -1) - 1);
  return se(i.doc, a.pos) && a.nodeBefore.type == a.nodeAfter.type && i.join(a.pos), e(i.scrollIntoView()), !0;
}
function gi(r, e, t) {
  let n = r.tr, i = t.parent;
  for (let d = t.end, g = t.endIndex - 1, p = t.startIndex; g > p; g--)
    d -= i.child(g).nodeSize, n.delete(d - 1, d + 1);
  let o = n.doc.resolve(t.start), s = o.nodeAfter;
  if (n.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = o.node(-1), f = o.index(-1);
  if (!c.canReplace(f + (l ? 0 : 1), f + 1, s.content.append(a ? y.empty : y.from(i))))
    return !1;
  let u = o.pos, h = u + s.nodeSize;
  return n.step(new F(u - (l ? 1 : 0), h + (a ? 1 : 0), u + 1, h - 1, new v((l ? y.empty : y.from(i.copy(y.empty))).append(a ? y.empty : y.from(i.copy(y.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(n.scrollIntoView()), !0;
}
function wi(r) {
  return function(e, t) {
    let { $from: n, $to: i } = e.selection, o = n.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == r);
    if (!o)
      return !1;
    let s = o.startIndex;
    if (s == 0)
      return !1;
    let l = o.parent, a = l.child(s - 1);
    if (a.type != r)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, f = y.from(c ? r.create() : null), u = new v(y.from(r.create(null, y.from(l.type.create(null, f)))), c ? 3 : 1, 0), h = o.start, d = o.end;
      t(e.tr.step(new F(h - (c ? 3 : 1), d, h, d, u, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Jn(r) {
  const { state: e, transaction: t } = r;
  let { selection: n } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return n;
    },
    get doc() {
      return i;
    },
    get tr() {
      return n = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class yi {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: n } = this, { view: i } = t, { tr: o } = n, s = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...f) => {
      const u = a(...f)(s);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: n, editor: i, state: o } = this, { view: s } = i, l = [], a = !!e, c = e || o.tr, f = () => (!a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c), l.every((h) => h === !0)), u = {
      ...Object.fromEntries(Object.entries(n).map(([h, d]) => [h, (...p) => {
        const w = this.buildProps(c, t), x = d(...p)(w);
        return l.push(x), u;
      }])),
      run: f
    };
    return u;
  }
  createCan(e) {
    const { rawCommands: t, state: n } = this, i = !1, o = e || n.tr, s = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...f) => c(...f)({ ...s, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: n, editor: i, state: o } = this, { view: s } = i, l = {
      tr: e,
      editor: i,
      view: s,
      state: Jn({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(n).map(([a, c]) => [a, (...f) => c(...f)(l)]));
      }
    };
    return l;
  }
}
function U(r, e, t) {
  return r.config[e] === void 0 && r.parent ? U(r.parent, e, t) : typeof r.config[e] == "function" ? r.config[e].bind({
    ...t,
    parent: r.parent ? U(r.parent, e, t) : null
  }) : r.config[e];
}
function xi(r) {
  const e = r.filter((i) => i.type === "extension"), t = r.filter((i) => i.type === "node"), n = r.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: n
  };
}
function B(r, e) {
  if (typeof r == "string") {
    if (!e.nodes[r])
      throw Error(`There is no node type named '${r}'. Maybe you forgot to add the extension?`);
    return e.nodes[r];
  }
  return r;
}
function Vn(...r) {
  return r.filter((e) => !!e).reduce((e, t) => {
    const n = { ...e };
    return Object.entries(t).forEach(([i, o]) => {
      if (!n[i]) {
        n[i] = o;
        return;
      }
      if (i === "class") {
        const l = o ? String(o).split(" ") : [], a = n[i] ? n[i].split(" ") : [], c = l.filter((f) => !a.includes(f));
        n[i] = [...a, ...c].join(" ");
      } else if (i === "style") {
        const l = o ? o.split(";").map((f) => f.trim()).filter(Boolean) : [], a = n[i] ? n[i].split(";").map((f) => f.trim()).filter(Boolean) : [], c = /* @__PURE__ */ new Map();
        a.forEach((f) => {
          const [u, h] = f.split(":").map((d) => d.trim());
          c.set(u, h);
        }), l.forEach((f) => {
          const [u, h] = f.split(":").map((d) => d.trim());
          c.set(u, h);
        }), n[i] = Array.from(c.entries()).map(([f, u]) => `${f}: ${u}`).join("; ");
      } else
        n[i] = o;
    }), n;
  }, {});
}
function vi(r, e) {
  return e.filter((t) => t.type === r.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(r.attrs) || {} : {
    [t.name]: r.attrs[t.name]
  }).reduce((t, n) => Vn(t, n), {});
}
function ki(r) {
  return typeof r == "function";
}
function G(r, e = void 0, ...t) {
  return ki(r) ? e ? r.bind(e)(...t) : r(...t) : r;
}
function bi(r) {
  return Object.prototype.toString.call(r) === "[object RegExp]";
}
function Si(r) {
  return Object.prototype.toString.call(r).slice(8, -1);
}
function Oe(r) {
  return Si(r) !== "Object" ? !1 : r.constructor === Object && Object.getPrototypeOf(r) === Object.prototype;
}
function Ct(r, e) {
  const t = { ...r };
  return Oe(r) && Oe(e) && Object.keys(e).forEach((n) => {
    Oe(e[n]) && Oe(r[n]) ? t[n] = Ct(r[n], e[n]) : t[n] = e[n];
  }), t;
}
class _ {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = G(U(this, "addOptions", {
      name: this.name
    }))), this.storage = G(U(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new _(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Ct(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new _({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = G(U(t, "addOptions", {
      name: t.name
    })), t.storage = G(U(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Ci(r, e, t) {
  const { from: n, to: i } = e, { blockSeparator: o = `

`, textSerializers: s = {} } = t || {};
  let l = "";
  return r.nodesBetween(n, i, (a, c, f, u) => {
    var h;
    a.isBlock && c > n && (l += o);
    const d = s == null ? void 0 : s[a.type.name];
    if (d)
      return f && (l += d({
        node: a,
        pos: c,
        parent: f,
        index: u,
        range: e
      })), !1;
    a.isText && (l += (h = a == null ? void 0 : a.text) === null || h === void 0 ? void 0 : h.slice(Math.max(n, c) - c, i - c));
  }), l;
}
function Ei(r) {
  return Object.fromEntries(Object.entries(r.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
_.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ae("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: r } = this, { state: e, schema: t } = r, { doc: n, selection: i } = e, { ranges: o } = i, s = Math.min(...o.map((f) => f.$from.pos)), l = Math.max(...o.map((f) => f.$to.pos)), a = Ei(t);
            return Ci(n, { from: s, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
});
const Ai = () => ({ editor: r, view: e }) => (requestAnimationFrame(() => {
  var t;
  r.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Ii = (r = !1) => ({ commands: e }) => e.setContent("", r), Mi = () => ({ state: r, tr: e, dispatch: t }) => {
  const { selection: n } = e, { ranges: i } = n;
  return t && i.forEach(({ $from: o, $to: s }) => {
    r.doc.nodesBetween(o.pos, s.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: f } = e, u = c.resolve(f.map(a)), h = c.resolve(f.map(a + l.nodeSize)), d = u.blockRange(h);
      if (!d)
        return;
      const g = pe(d);
      if (l.type.isTextblock) {
        const { defaultType: p } = u.parent.contentMatchAt(u.index());
        e.setNodeMarkup(d.start, p);
      }
      (g || g === 0) && e.lift(d, g);
    });
  }), !0;
}, Ni = (r) => (e) => r(e), Oi = () => ({ state: r, dispatch: e }) => Pn(r, e), Ti = (r, e) => ({ editor: t, tr: n }) => {
  const { state: i } = t, o = i.doc.slice(r.from, r.to);
  n.deleteRange(r.from, r.to);
  const s = n.mapping.map(e);
  return n.insert(s, o.content), n.setSelection(new E(n.doc.resolve(Math.max(s - 1, 0)))), !0;
}, Ri = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, n = t.$anchor.node();
  if (n.content.size > 0)
    return !1;
  const i = r.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === n.type) {
      if (e) {
        const l = i.before(o), a = i.after(o);
        r.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, zi = (r) => ({ tr: e, state: t, dispatch: n }) => {
  const i = B(r, t.schema), o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === i) {
      if (n) {
        const a = o.before(s), c = o.after(s);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Bi = (r) => ({ tr: e, dispatch: t }) => {
  const { from: n, to: i } = r;
  return t && e.delete(n, i), !0;
}, Di = () => ({ state: r, dispatch: e }) => xt(r, e), Li = () => ({ commands: r }) => r.keyboardShortcut("Enter"), Pi = () => ({ state: r, dispatch: e }) => ri(r, e);
function qe(r, e, t = { strict: !0 }) {
  const n = Object.keys(e);
  return n.length ? n.every((i) => t.strict ? e[i] === r[i] : bi(e[i]) ? e[i].test(r[i]) : e[i] === r[i]) : !0;
}
function qn(r, e, t = {}) {
  return r.find((n) => n.type === e && qe(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, n.attrs[i]])),
    t
  ));
}
function Wt(r, e, t = {}) {
  return !!qn(r, e, t);
}
function Hn(r, e, t) {
  var n;
  if (!r || !e)
    return;
  let i = r.parent.childAfter(r.parentOffset);
  if ((!i.node || !i.node.marks.some((f) => f.type === e)) && (i = r.parent.childBefore(r.parentOffset)), !i.node || !i.node.marks.some((f) => f.type === e) || (t = t || ((n = i.node.marks[0]) === null || n === void 0 ? void 0 : n.attrs), !qn([...i.node.marks], e, t)))
    return;
  let s = i.index, l = r.start() + i.offset, a = s + 1, c = l + i.node.nodeSize;
  for (; s > 0 && Wt([...r.parent.child(s - 1).marks], e, t); )
    s -= 1, l -= r.parent.child(s).nodeSize;
  for (; a < r.parent.childCount && Wt([...r.parent.child(a).marks], e, t); )
    c += r.parent.child(a).nodeSize, a += 1;
  return {
    from: l,
    to: c
  };
}
function Y(r, e) {
  if (typeof r == "string") {
    if (!e.marks[r])
      throw Error(`There is no mark type named '${r}'. Maybe you forgot to add the extension?`);
    return e.marks[r];
  }
  return r;
}
const $i = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  const o = Y(r, n.schema), { doc: s, selection: l } = t, { $from: a, from: c, to: f } = l;
  if (i) {
    const u = Hn(a, o, e);
    if (u && u.from <= c && u.to >= f) {
      const h = E.create(s, u.from, u.to);
      t.setSelection(h);
    }
  }
  return !0;
}, Fi = (r) => (e) => {
  const t = typeof r == "function" ? r(e) : r;
  for (let n = 0; n < t.length; n += 1)
    if (t[n](e))
      return !0;
  return !1;
};
function Wn(r) {
  return r instanceof E;
}
function te(r = 0, e = 0, t = 0) {
  return Math.min(Math.max(r, e), t);
}
function ji(r, e = null) {
  if (!e)
    return null;
  const t = b.atStart(r), n = b.atEnd(r);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return n;
  const i = t.from, o = n.to;
  return e === "all" ? E.create(r, te(0, i, o), te(r.content.size, i, o)) : E.create(r, te(e, i, o), te(e, i, o));
}
function pt() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Ee() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Ji() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const Vi = (r = null, e = {}) => ({ editor: t, view: n, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const s = () => {
    (Ee() || pt()) && n.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (n.focus(), Ji() && !Ee() && !pt() && n.dom.focus({ preventScroll: !0 }));
    });
  };
  if (n.hasFocus() && r === null || r === !1)
    return !0;
  if (o && r === null && !Wn(t.state.selection))
    return s(), !0;
  const l = ji(i.doc, r) || t.state.selection, a = t.state.selection.eq(l);
  return o && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), s()), !0;
}, qi = (r, e) => (t) => r.every((n, i) => e(n, { ...t, index: i })), Hi = (r, e) => ({ tr: t, commands: n }) => n.insertContentAt({ from: t.selection.from, to: t.selection.to }, r, e), Un = (r) => {
  const e = r.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const n = e[t];
    n.nodeType === 3 && n.nodeValue && /^(\n\s\s|\n)$/.test(n.nodeValue) ? r.removeChild(n) : n.nodeType === 1 && Un(n);
  }
  return r;
};
function Te(r) {
  const e = `<body>${r}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Un(t);
}
function Ae(r, e, t) {
  if (r instanceof ie || r instanceof y)
    return r;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const n = typeof r == "object" && r !== null, i = typeof r == "string";
  if (n)
    try {
      if (Array.isArray(r) && r.length > 0)
        return y.fromArray(r.map((l) => e.nodeFromJSON(l)));
      const s = e.nodeFromJSON(r);
      return t.errorOnInvalidContent && s.check(), s;
    } catch (o) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: o });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", r, "Error:", o), Ae("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let s = !1, l = "";
      const a = new Dr({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (s = !0, l = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? fe.fromSchema(a).parseSlice(Te(r), t.parseOptions) : fe.fromSchema(a).parse(Te(r), t.parseOptions), t.errorOnInvalidContent && s)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${l}`) });
    }
    const o = fe.fromSchema(e);
    return t.slice ? o.parseSlice(Te(r), t.parseOptions).content : o.parse(Te(r), t.parseOptions);
  }
  return Ae("", e, t);
}
function Wi(r, e, t) {
  const n = r.steps.length - 1;
  if (n < e)
    return;
  const i = r.steps[n];
  if (!(i instanceof P || i instanceof F))
    return;
  const o = r.mapping.maps[n];
  let s = 0;
  o.forEach((l, a, c, f) => {
    s === 0 && (s = f);
  }), r.setSelection(b.near(r.doc.resolve(s), t));
}
const Ui = (r) => !("type" in r), _i = (r, e, t) => ({ tr: n, dispatch: i, editor: o }) => {
  var s;
  if (i) {
    t = {
      parseOptions: o.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let l;
    const a = (w) => {
      o.emit("contentError", {
        editor: o,
        error: w,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        Ae(e, o.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (w) {
        a(w);
      }
    try {
      l = Ae(e, o.schema, {
        parseOptions: c,
        errorOnInvalidContent: (s = t.errorOnInvalidContent) !== null && s !== void 0 ? s : o.options.enableContentCheck
      });
    } catch (w) {
      return a(w), !1;
    }
    let { from: f, to: u } = typeof r == "number" ? { from: r, to: r } : { from: r.from, to: r.to }, h = !0, d = !0;
    if ((Ui(l) ? l : [l]).forEach((w) => {
      w.check(), h = h ? w.isText && w.marks.length === 0 : !1, d = d ? w.isBlock : !1;
    }), f === u && d) {
      const { parent: w } = n.doc.resolve(f);
      w.isTextblock && !w.type.spec.code && !w.childCount && (f -= 1, u += 1);
    }
    let p;
    if (h) {
      if (Array.isArray(e))
        p = e.map((w) => w.text || "").join("");
      else if (e instanceof y) {
        let w = "";
        e.forEach((x) => {
          x.text && (w += x.text);
        }), p = w;
      } else typeof e == "object" && e && e.text ? p = e.text : p = e;
      n.insertText(p, f, u);
    } else
      p = l, n.replaceWith(f, u, p);
    t.updateSelection && Wi(n, n.steps.length - 1, -1), t.applyInputRules && n.setMeta("applyInputRules", { from: f, text: p }), t.applyPasteRules && n.setMeta("applyPasteRules", { from: f, text: p });
  }
  return !0;
}, Ki = () => ({ state: r, dispatch: e }) => ei(r, e), Gi = () => ({ state: r, dispatch: e }) => ti(r, e), Xi = () => ({ state: r, dispatch: e }) => On(r, e), Yi = () => ({ state: r, dispatch: e }) => Bn(r, e), Qi = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = _e(r.doc, r.selection.$from.pos, -1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Zi = () => ({ state: r, dispatch: e, tr: t }) => {
  try {
    const n = _e(r.doc, r.selection.$from.pos, 1);
    return n == null ? !1 : (t.join(n, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, eo = () => ({ state: r, dispatch: e }) => Qr(r, e), to = () => ({ state: r, dispatch: e }) => Zr(r, e);
function _n() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function no(r) {
  const e = r.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let n, i, o, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      s = !0;
    else if (/^a(lt)?$/i.test(a))
      n = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      o = !0;
    else if (/^mod$/i.test(a))
      Ee() || _n() ? s = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return n && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), s && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const ro = (r) => ({ editor: e, view: t, tr: n, dispatch: i }) => {
  const o = no(r).split(/-(?!$)/), s = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: s === "Space" ? " " : s,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const f = c.map(n.mapping);
    f && i && n.maybeStep(f);
  }), !0;
};
function Et(r, e, t = {}) {
  const { from: n, to: i, empty: o } = r.selection, s = e ? B(e, r.schema) : null, l = [];
  r.doc.nodesBetween(n, i, (u, h) => {
    if (u.isText)
      return;
    const d = Math.max(n, h), g = Math.min(i, h + u.nodeSize);
    l.push({
      node: u,
      from: d,
      to: g
    });
  });
  const a = i - n, c = l.filter((u) => s ? s.name === u.node.type.name : !0).filter((u) => qe(u.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((u, h) => u + h.to - h.from, 0) >= a;
}
const io = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = B(r, t.schema);
  return Et(t, i, e) ? ni(t, n) : !1;
}, oo = () => ({ state: r, dispatch: e }) => $n(r, e), so = (r) => ({ state: e, dispatch: t }) => {
  const n = B(r, e.schema);
  return pi(n)(e, t);
}, lo = () => ({ state: r, dispatch: e }) => Ln(r, e);
function Kn(r, e) {
  return e.nodes[r] ? "node" : e.marks[r] ? "mark" : null;
}
function Ut(r, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(r).reduce((n, i) => (t.includes(i) || (n[i] = r[i]), n), {});
}
const ao = (r, e) => ({ tr: t, state: n, dispatch: i }) => {
  let o = null, s = null;
  const l = Kn(typeof r == "string" ? r : r.name, n.schema);
  return l ? (l === "node" && (o = B(r, n.schema)), l === "mark" && (s = Y(r, n.schema)), i && t.selection.ranges.forEach((a) => {
    n.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, f) => {
      o && o === c.type && t.setNodeMarkup(f, void 0, Ut(c.attrs, e)), s && c.marks.length && c.marks.forEach((u) => {
        s === u.type && t.addMark(f, f + c.nodeSize, s.create(Ut(u.attrs, e)));
      });
    });
  }), !0) : !1;
}, co = () => ({ tr: r, dispatch: e }) => (e && r.scrollIntoView(), !0), fo = () => ({ tr: r, dispatch: e }) => {
  if (e) {
    const t = new q(r.doc);
    r.setSelection(t);
  }
  return !0;
}, uo = () => ({ state: r, dispatch: e }) => Rn(r, e), ho = () => ({ state: r, dispatch: e }) => Dn(r, e), po = () => ({ state: r, dispatch: e }) => si(r, e), mo = () => ({ state: r, dispatch: e }) => ci(r, e), go = () => ({ state: r, dispatch: e }) => ai(r, e);
function wo(r, e, t = {}, n = {}) {
  return Ae(r, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: n.errorOnInvalidContent
  });
}
const yo = (r, e = !1, t = {}, n = {}) => ({ editor: i, tr: o, dispatch: s, commands: l }) => {
  var a, c;
  const { doc: f } = o;
  if (t.preserveWhitespace !== "full") {
    const u = wo(r, i.schema, t, {
      errorOnInvalidContent: (a = n.errorOnInvalidContent) !== null && a !== void 0 ? a : i.options.enableContentCheck
    });
    return s && o.replaceWith(0, f.content.size, u).setMeta("preventUpdate", !e), !0;
  }
  return s && o.setMeta("preventUpdate", !e), l.insertContentAt({ from: 0, to: f.content.size }, r, {
    parseOptions: t,
    errorOnInvalidContent: (c = n.errorOnInvalidContent) !== null && c !== void 0 ? c : i.options.enableContentCheck
  });
};
function xo(r, e) {
  const t = Y(e, r.schema), { from: n, to: i, empty: o } = r.selection, s = [];
  o ? (r.storedMarks && s.push(...r.storedMarks), s.push(...r.selection.$head.marks())) : r.doc.nodesBetween(n, i, (a) => {
    s.push(...a.marks);
  });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function vo(r) {
  for (let e = 0; e < r.edgeCount; e += 1) {
    const { type: t } = r.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function ko(r, e) {
  for (let t = r.depth; t > 0; t -= 1) {
    const n = r.node(t);
    if (e(n))
      return {
        pos: t > 0 ? r.before(t) : 0,
        start: r.start(t),
        depth: t,
        node: n
      };
  }
}
function At(r) {
  return (e) => ko(e.$from, r);
}
function De(r, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => {
    const i = r.find((o) => o.type === e && o.name === n);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function bo(r, e, t = {}) {
  const { empty: n, ranges: i } = r.selection, o = e ? Y(e, r.schema) : null;
  if (n)
    return !!(r.storedMarks || r.selection.$from.marks()).filter((u) => o ? o.name === u.type.name : !0).find((u) => qe(u.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (i.forEach(({ $from: u, $to: h }) => {
    const d = u.pos, g = h.pos;
    r.doc.nodesBetween(d, g, (p, w) => {
      if (!p.isText && !p.marks.length)
        return;
      const x = Math.max(d, w), M = Math.min(g, w + p.nodeSize), I = M - x;
      s += I, l.push(...p.marks.map((z) => ({
        mark: z,
        from: x,
        to: M
      })));
    });
  }), s === 0)
    return !1;
  const a = l.filter((u) => o ? o.name === u.mark.type.name : !0).filter((u) => qe(u.mark.attrs, t, { strict: !1 })).reduce((u, h) => u + h.to - h.from, 0), c = l.filter((u) => o ? u.mark.type !== o && u.mark.type.excludes(o) : !0).reduce((u, h) => u + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function _t(r, e) {
  const { nodeExtensions: t } = xi(e), n = t.find((s) => s.name === r);
  if (!n)
    return !1;
  const i = {
    name: n.name,
    options: n.options,
    storage: n.storage
  }, o = G(U(n, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function Gn(r, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
  var n;
  if (t) {
    if (r.type.name === "hardBreak")
      return !0;
    if (r.isText)
      return /^\s*$/m.test((n = r.text) !== null && n !== void 0 ? n : "");
  }
  if (r.isText)
    return !r.text;
  if (r.isAtom || r.isLeaf)
    return !1;
  if (r.content.childCount === 0)
    return !0;
  if (e) {
    let i = !0;
    return r.content.forEach((o) => {
      i !== !1 && (Gn(o, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
function So(r, e, t) {
  var n;
  const { selection: i } = e;
  let o = null;
  if (Wn(i) && (o = i.$cursor), o) {
    const l = (n = r.storedMarks) !== null && n !== void 0 ? n : o.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = i;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? r.doc.inlineContent && r.doc.type.allowsMarkType(t) : !1;
    return r.doc.nodesBetween(l.pos, a.pos, (f, u, h) => {
      if (c)
        return !1;
      if (f.isInline) {
        const d = !h || h.type.allowsMarkType(t), g = !!t.isInSet(f.marks) || !f.marks.some((p) => p.type.excludes(t));
        c = d && g;
      }
      return !c;
    }), c;
  });
}
const Co = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  const { selection: o } = t, { empty: s, ranges: l } = o, a = Y(r, n.schema);
  if (i)
    if (s) {
      const c = xo(n, a);
      t.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const f = c.$from.pos, u = c.$to.pos;
        n.doc.nodesBetween(f, u, (h, d) => {
          const g = Math.max(d, f), p = Math.min(d + h.nodeSize, u);
          h.marks.find((x) => x.type === a) ? h.marks.forEach((x) => {
            a === x.type && t.addMark(g, p, a.create({
              ...x.attrs,
              ...e
            }));
          }) : t.addMark(g, p, a.create(e));
        });
      });
  return So(n, t, a);
}, Eo = (r, e) => ({ tr: t }) => (t.setMeta(r, e), !0), Ao = (r, e = {}) => ({ state: t, dispatch: n, chain: i }) => {
  const o = B(r, t.schema);
  let s;
  return t.selection.$anchor.sameParent(t.selection.$head) && (s = t.selection.$anchor.parent.attrs), o.isTextblock ? i().command(({ commands: l }) => Ht(o, { ...s, ...e })(t) ? !0 : l.clearNodes()).command(({ state: l }) => Ht(o, { ...s, ...e })(l, n)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Io = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, i = te(r, 0, n.content.size), o = S.create(n, i);
    e.setSelection(o);
  }
  return !0;
}, Mo = (r) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: n } = e, { from: i, to: o } = typeof r == "number" ? { from: r, to: r } : r, s = E.atStart(n).from, l = E.atEnd(n).to, a = te(i, s, l), c = te(o, s, l), f = E.create(n, a, c);
    e.setSelection(f);
  }
  return !0;
}, No = (r) => ({ state: e, dispatch: t }) => {
  const n = B(r, e.schema);
  return wi(n)(e, t);
};
function Kt(r, e) {
  const t = r.storedMarks || r.selection.$to.parentOffset && r.selection.$from.marks();
  if (t) {
    const n = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    r.tr.ensureMarks(n);
  }
}
const Oo = ({ keepMarks: r = !0 } = {}) => ({ tr: e, state: t, dispatch: n, editor: i }) => {
  const { selection: o, doc: s } = e, { $from: l, $to: a } = o, c = i.extensionManager.attributes, f = De(c, l.node().type.name, l.node().attrs);
  if (o instanceof S && o.node.isBlock)
    return !l.parentOffset || !X(s, l.pos) ? !1 : (n && (r && Kt(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  const u = a.parentOffset === a.parent.content.size, h = l.depth === 0 ? void 0 : vo(l.node(-1).contentMatchAt(l.indexAfter(-1)));
  let d = u && h ? [
    {
      type: h,
      attrs: f
    }
  ] : void 0, g = X(e.doc, e.mapping.map(l.pos), 1, d);
  if (!d && !g && X(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (g = !0, d = h ? [
    {
      type: h,
      attrs: f
    }
  ] : void 0), n) {
    if (g && (o instanceof E && e.deleteSelection(), e.split(e.mapping.map(l.pos), 1, d), h && !u && !l.parentOffset && l.parent.type !== h)) {
      const p = e.mapping.map(l.before()), w = e.doc.resolve(p);
      l.node(-1).canReplaceWith(w.index(), w.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    r && Kt(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return g;
}, To = (r, e = {}) => ({ tr: t, state: n, dispatch: i, editor: o }) => {
  var s;
  const l = B(r, n.schema), { $from: a, $to: c } = n.selection, f = n.selection.node;
  if (f && f.isBlock || a.depth < 2 || !a.sameParent(c))
    return !1;
  const u = a.node(-1);
  if (u.type !== l)
    return !1;
  const h = o.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== l || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (i) {
      let x = y.empty;
      const M = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let W = a.depth - M; W >= a.depth - 3; W -= 1)
        x = y.from(a.node(W).copy(x));
      const I = a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3, z = {
        ...De(h, a.node().type.name, a.node().attrs),
        ...e
      }, L = ((s = l.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(z)) || void 0;
      x = x.append(y.from(l.createAndFill(null, L) || void 0));
      const O = a.before(a.depth - (M - 1));
      t.replace(O, a.after(-I), new v(x, 4 - M, 0));
      let j = -1;
      t.doc.nodesBetween(O, t.doc.content.size, (W, rr) => {
        if (j > -1)
          return !1;
        W.isTextblock && W.content.size === 0 && (j = rr + 1);
      }), j > -1 && t.setSelection(E.near(t.doc.resolve(j))), t.scrollIntoView();
    }
    return !0;
  }
  const d = c.pos === a.end() ? u.contentMatchAt(0).defaultType : null, g = {
    ...De(h, u.type.name, u.attrs),
    ...e
  }, p = {
    ...De(h, a.node().type.name, a.node().attrs),
    ...e
  };
  t.delete(a.pos, c.pos);
  const w = d ? [
    { type: l, attrs: g },
    { type: d, attrs: p }
  ] : [{ type: l, attrs: g }];
  if (!X(t.doc, a.pos, 2))
    return !1;
  if (i) {
    const { selection: x, storedMarks: M } = n, { splittableMarks: I } = o.extensionManager, z = M || x.$to.parentOffset && x.$from.marks();
    if (t.split(a.pos, 2, w).scrollIntoView(), !z || !i)
      return !0;
    const L = z.filter((O) => I.includes(O.type.name));
    t.ensureMarks(L);
  }
  return !0;
}, st = (r, e) => {
  const t = At((s) => s.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (n === void 0)
    return !0;
  const i = r.doc.nodeAt(n);
  return t.node.type === (i == null ? void 0 : i.type) && se(r.doc, t.pos) && r.join(t.pos), !0;
}, lt = (r, e) => {
  const t = At((s) => s.type === e)(r.selection);
  if (!t)
    return !0;
  const n = r.doc.resolve(t.start).after(t.depth);
  if (n === void 0)
    return !0;
  const i = r.doc.nodeAt(n);
  return t.node.type === (i == null ? void 0 : i.type) && se(r.doc, n) && r.join(n), !0;
}, Ro = (r, e, t, n = {}) => ({ editor: i, tr: o, state: s, dispatch: l, chain: a, commands: c, can: f }) => {
  const { extensions: u, splittableMarks: h } = i.extensionManager, d = B(r, s.schema), g = B(e, s.schema), { selection: p, storedMarks: w } = s, { $from: x, $to: M } = p, I = x.blockRange(M), z = w || p.$to.parentOffset && p.$from.marks();
  if (!I)
    return !1;
  const L = At((O) => _t(O.type.name, u))(p);
  if (I.depth >= 1 && L && I.depth - L.depth <= 1) {
    if (L.node.type === d)
      return c.liftListItem(g);
    if (_t(L.node.type.name, u) && d.validContent(L.node.content) && l)
      return a().command(() => (o.setNodeMarkup(L.pos, d), !0)).command(() => st(o, d)).command(() => lt(o, d)).run();
  }
  return !t || !z || !l ? a().command(() => f().wrapInList(d, n) ? !0 : c.clearNodes()).wrapInList(d, n).command(() => st(o, d)).command(() => lt(o, d)).run() : a().command(() => {
    const O = f().wrapInList(d, n), j = z.filter((W) => h.includes(W.type.name));
    return o.ensureMarks(j), O ? !0 : c.clearNodes();
  }).wrapInList(d, n).command(() => st(o, d)).command(() => lt(o, d)).run();
}, zo = (r, e = {}, t = {}) => ({ state: n, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, s = Y(r, n.schema);
  return bo(n, s, e) ? i.unsetMark(s, { extendEmptyMarkRange: o }) : i.setMark(s, e);
}, Bo = (r, e, t = {}) => ({ state: n, commands: i }) => {
  const o = B(r, n.schema), s = B(e, n.schema), l = Et(n, o, t);
  let a;
  return n.selection.$anchor.sameParent(n.selection.$head) && (a = n.selection.$anchor.parent.attrs), l ? i.setNode(s, a) : i.setNode(o, { ...a, ...t });
}, Do = (r, e = {}) => ({ state: t, commands: n }) => {
  const i = B(r, t.schema);
  return Et(t, i, e) ? n.lift(i) : n.wrapIn(i, e);
}, Lo = () => ({ state: r, dispatch: e }) => {
  const t = r.plugins;
  for (let n = 0; n < t.length; n += 1) {
    const i = t[n];
    let o;
    if (i.spec.isInputRules && (o = i.getState(r))) {
      if (e) {
        const s = r.tr, l = o.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          s.step(l.steps[a].invert(l.docs[a]));
        if (o.text) {
          const a = s.doc.resolve(o.from).marks();
          s.replaceWith(o.from, o.to, r.schema.text(o.text, a));
        } else
          s.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, Po = () => ({ tr: r, dispatch: e }) => {
  const { selection: t } = r, { empty: n, ranges: i } = t;
  return n || e && i.forEach((o) => {
    r.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, $o = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: s = !1 } = e, { selection: l } = t, a = Y(r, n.schema), { $from: c, empty: f, ranges: u } = l;
  if (!i)
    return !0;
  if (f && s) {
    let { from: h, to: d } = l;
    const g = (o = c.marks().find((w) => w.type === a)) === null || o === void 0 ? void 0 : o.attrs, p = Hn(c, a, g);
    p && (h = p.from, d = p.to), t.removeMark(h, d, a);
  } else
    u.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Fo = (r, e = {}) => ({ tr: t, state: n, dispatch: i }) => {
  let o = null, s = null;
  const l = Kn(typeof r == "string" ? r : r.name, n.schema);
  return l ? (l === "node" && (o = B(r, n.schema)), l === "mark" && (s = Y(r, n.schema)), i && t.selection.ranges.forEach((a) => {
    const c = a.$from.pos, f = a.$to.pos;
    let u, h, d, g;
    t.selection.empty ? n.doc.nodesBetween(c, f, (p, w) => {
      o && o === p.type && (d = Math.max(w, c), g = Math.min(w + p.nodeSize, f), u = w, h = p);
    }) : n.doc.nodesBetween(c, f, (p, w) => {
      w < c && o && o === p.type && (d = Math.max(w, c), g = Math.min(w + p.nodeSize, f), u = w, h = p), w >= c && w <= f && (o && o === p.type && t.setNodeMarkup(w, void 0, {
        ...p.attrs,
        ...e
      }), s && p.marks.length && p.marks.forEach((x) => {
        if (s === x.type) {
          const M = Math.max(w, c), I = Math.min(w + p.nodeSize, f);
          t.addMark(M, I, s.create({
            ...x.attrs,
            ...e
          }));
        }
      }));
    }), h && (u !== void 0 && t.setNodeMarkup(u, void 0, {
      ...h.attrs,
      ...e
    }), s && h.marks.length && h.marks.forEach((p) => {
      s === p.type && t.addMark(d, g, s.create({
        ...p.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, jo = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = B(r, t.schema);
  return fi(i, e)(t, n);
}, Jo = (r, e = {}) => ({ state: t, dispatch: n }) => {
  const i = B(r, t.schema);
  return ui(i, e)(t, n);
};
var Vo = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ai,
  clearContent: Ii,
  clearNodes: Mi,
  command: Ni,
  createParagraphNear: Oi,
  cut: Ti,
  deleteCurrentNode: Ri,
  deleteNode: zi,
  deleteRange: Bi,
  deleteSelection: Di,
  enter: Li,
  exitCode: Pi,
  extendMarkRange: $i,
  first: Fi,
  focus: Vi,
  forEach: qi,
  insertContent: Hi,
  insertContentAt: _i,
  joinBackward: Xi,
  joinDown: Gi,
  joinForward: Yi,
  joinItemBackward: Qi,
  joinItemForward: Zi,
  joinTextblockBackward: eo,
  joinTextblockForward: to,
  joinUp: Ki,
  keyboardShortcut: ro,
  lift: io,
  liftEmptyBlock: oo,
  liftListItem: so,
  newlineInCode: lo,
  resetAttributes: ao,
  scrollIntoView: co,
  selectAll: fo,
  selectNodeBackward: uo,
  selectNodeForward: ho,
  selectParentNode: po,
  selectTextblockEnd: mo,
  selectTextblockStart: go,
  setContent: yo,
  setMark: Co,
  setMeta: Eo,
  setNode: Ao,
  setNodeSelection: Io,
  setTextSelection: Mo,
  sinkListItem: No,
  splitBlock: Oo,
  splitListItem: To,
  toggleList: Ro,
  toggleMark: zo,
  toggleNode: Bo,
  toggleWrap: Do,
  undoInputRule: Lo,
  unsetAllMarks: Po,
  unsetMark: $o,
  updateAttributes: Fo,
  wrapIn: jo,
  wrapInList: Jo
});
_.create({
  name: "commands",
  addCommands() {
    return {
      ...Vo
    };
  }
});
_.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ae("tiptapDrop"),
        props: {
          handleDrop: (r, e, t, n) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: n
            });
          }
        }
      })
    ];
  }
});
_.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ae("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const qo = new ae("focusEvents");
_.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: r } = this;
    return [
      new le({
        key: qo,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              r.isFocused = !0;
              const n = r.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(n), !1;
            },
            blur: (e, t) => {
              r.isFocused = !1;
              const n = r.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(n), !1;
            }
          }
        }
      })
    ];
  }
});
_.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const r = () => this.editor.commands.first(({ commands: s }) => [
      () => s.undoInputRule(),
      // maybe convert first text block node to default node
      () => s.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: f, $anchor: u } = a, { pos: h, parent: d } = u, g = u.parent.isTextblock && h > 0 ? l.doc.resolve(h - 1) : u, p = g.parent.type.spec.isolating, w = u.pos - u.parentOffset, x = p && g.parent.childCount === 1 ? w === u.pos : b.atStart(c).from === h;
        return !f || !d.type.isTextblock || d.textContent.length || !x || x && u.parent.type.name === "paragraph" ? !1 : s.clearNodes();
      }),
      () => s.deleteSelection(),
      () => s.joinBackward(),
      () => s.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: s }) => [
      () => s.deleteSelection(),
      () => s.deleteCurrentNode(),
      () => s.joinForward(),
      () => s.selectNodeForward()
    ]), n = {
      Enter: () => this.editor.commands.first(({ commands: s }) => [
        () => s.newlineInCode(),
        () => s.createParagraphNear(),
        () => s.liftEmptyBlock(),
        () => s.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: r,
      "Mod-Backspace": r,
      "Shift-Backspace": r,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...n
    }, o = {
      ...n,
      "Ctrl-h": r,
      "Alt-Backspace": r,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Ee() || _n() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new le({
        key: new ae("clearDocument"),
        appendTransaction: (r, e, t) => {
          if (r.some((p) => p.getMeta("composition")))
            return;
          const n = r.some((p) => p.docChanged) && !e.doc.eq(t.doc), i = r.some((p) => p.getMeta("preventClearDocument"));
          if (!n || i)
            return;
          const { empty: o, from: s, to: l } = e.selection, a = b.atStart(e.doc).from, c = b.atEnd(e.doc).to;
          if (o || !(s === a && l === c) || !Gn(t.doc))
            return;
          const h = t.tr, d = Jn({
            state: t,
            transaction: h
          }), { commands: g } = new yi({
            editor: this.editor,
            state: d
          });
          if (g.clearNodes(), !!h.steps.length)
            return h;
        }
      })
    ];
  }
});
_.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ae("tiptapPaste"),
        props: {
          handlePaste: (r, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
});
_.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new le({
        key: new ae("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class He {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = G(U(this, "addOptions", {
      name: this.name
    }))), this.storage = G(U(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new He(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Ct(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new He(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = G(U(t, "addOptions", {
      name: t.name
    })), t.storage = G(U(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
class Ho {
  constructor(e, t, n) {
    this.isDragging = !1, this.component = e, this.editor = t.editor, this.options = {
      stopEvent: null,
      ignoreMutation: null,
      ...n
    }, this.extension = t.extension, this.node = t.node, this.decorations = t.decorations, this.innerDecorations = t.innerDecorations, this.view = t.view, this.HTMLAttributes = t.HTMLAttributes, this.getPos = t.getPos, this.mount();
  }
  mount() {
  }
  get dom() {
    return this.editor.view.dom;
  }
  get contentDOM() {
    return null;
  }
  onDragStart(e) {
    var t, n, i, o, s, l, a;
    const { view: c } = this.editor, f = e.target, u = f.nodeType === 3 ? (t = f.parentElement) === null || t === void 0 ? void 0 : t.closest("[data-drag-handle]") : f.closest("[data-drag-handle]");
    if (!this.dom || !((n = this.contentDOM) === null || n === void 0) && n.contains(f) || !u)
      return;
    let h = 0, d = 0;
    if (this.dom !== u) {
      const M = this.dom.getBoundingClientRect(), I = u.getBoundingClientRect(), z = (i = e.offsetX) !== null && i !== void 0 ? i : (o = e.nativeEvent) === null || o === void 0 ? void 0 : o.offsetX, L = (s = e.offsetY) !== null && s !== void 0 ? s : (l = e.nativeEvent) === null || l === void 0 ? void 0 : l.offsetY;
      h = I.x - M.x + z, d = I.y - M.y + L;
    }
    const g = this.dom.cloneNode(!0);
    (a = e.dataTransfer) === null || a === void 0 || a.setDragImage(g, h, d);
    const p = this.getPos();
    if (typeof p != "number")
      return;
    const w = S.create(c.state.doc, p), x = c.state.tr.setSelection(w);
    c.dispatch(x);
  }
  stopEvent(e) {
    var t;
    if (!this.dom)
      return !1;
    if (typeof this.options.stopEvent == "function")
      return this.options.stopEvent({ event: e });
    const n = e.target;
    if (!(this.dom.contains(n) && !(!((t = this.contentDOM) === null || t === void 0) && t.contains(n))))
      return !1;
    const o = e.type.startsWith("drag"), s = e.type === "drop";
    if ((["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(n.tagName) || n.isContentEditable) && !s && !o)
      return !0;
    const { isEditable: a } = this.editor, { isDragging: c } = this, f = !!this.node.type.spec.draggable, u = S.isSelectable(this.node), h = e.type === "copy", d = e.type === "paste", g = e.type === "cut", p = e.type === "mousedown";
    if (!f && u && o && e.target === this.dom && e.preventDefault(), f && o && !c && e.target === this.dom)
      return e.preventDefault(), !1;
    if (f && a && !c && p) {
      const w = n.closest("[data-drag-handle]");
      w && (this.dom === w || this.dom.contains(w)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("drop", () => {
        this.isDragging = !1;
      }, { once: !0 }), document.addEventListener("mouseup", () => {
        this.isDragging = !1;
      }, { once: !0 }));
    }
    return !(c || s || h || d || g || p && u);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(e) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.dom.contains(e.target) && e.type === "childList" && (Ee() || pt()) && this.editor.isFocused && [
      ...Array.from(e.addedNodes),
      ...Array.from(e.removedNodes)
    ].every((n) => n.isContentEditable) ? !1 : this.contentDOM === e.target && e.type === "attributes" ? !0 : !this.contentDOM.contains(e.target);
  }
  /**
   * Update the attributes of the prosemirror node.
   */
  updateAttributes(e) {
    this.editor.commands.command(({ tr: t }) => {
      const n = this.getPos();
      return typeof n != "number" ? !1 : (t.setNodeMarkup(n, void 0, {
        ...this.node.attrs,
        ...e
      }), !0);
    });
  }
  /**
   * Delete the node.
   */
  deleteNode() {
    const e = this.getPos();
    if (typeof e != "number")
      return;
    const t = e + this.node.nodeSize;
    this.editor.commands.deleteRange({ from: e, to: t });
  }
}
var Xn = { exports: {} }, at = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gt;
function Wo() {
  if (Gt) return at;
  Gt = 1;
  var r = R;
  function e(u, h) {
    return u === h && (u !== 0 || 1 / u === 1 / h) || u !== u && h !== h;
  }
  var t = typeof Object.is == "function" ? Object.is : e, n = r.useState, i = r.useEffect, o = r.useLayoutEffect, s = r.useDebugValue;
  function l(u, h) {
    var d = h(), g = n({ inst: { value: d, getSnapshot: h } }), p = g[0].inst, w = g[1];
    return o(function() {
      p.value = d, p.getSnapshot = h, a(p) && w({ inst: p });
    }, [u, d, h]), i(function() {
      return a(p) && w({ inst: p }), u(function() {
        a(p) && w({ inst: p });
      });
    }, [u]), s(d), d;
  }
  function a(u) {
    var h = u.getSnapshot;
    u = u.value;
    try {
      var d = h();
      return !t(u, d);
    } catch {
      return !0;
    }
  }
  function c(u, h) {
    return h();
  }
  var f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : l;
  return at.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : f, at;
}
Xn.exports = Wo();
var Yn = Xn.exports;
const Uo = (...r) => (e) => {
  r.forEach((t) => {
    typeof t == "function" ? t(e) : t && (t.current = e);
  });
}, _o = ({ contentComponent: r }) => {
  const e = Yn.useSyncExternalStore(r.subscribe, r.getSnapshot, r.getServerSnapshot);
  return R.createElement(R.Fragment, null, Object.values(e));
};
function Ko() {
  const r = /* @__PURE__ */ new Set();
  let e = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(t) {
      return r.add(t), () => {
        r.delete(t);
      };
    },
    getSnapshot() {
      return e;
    },
    getServerSnapshot() {
      return e;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(t, n) {
      e = {
        ...e,
        [t]: fr.createPortal(n.reactElement, n.element, t)
      }, r.forEach((i) => i());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(t) {
      const n = { ...e };
      delete n[t], e = n, r.forEach((i) => i());
    }
  };
}
class Go extends R.Component {
  constructor(e) {
    var t;
    super(e), this.editorContentRef = R.createRef(), this.initialized = !1, this.state = {
      hasContentComponentInitialized: !!(!((t = e.editor) === null || t === void 0) && t.contentComponent)
    };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  init() {
    const e = this.props.editor;
    if (e && !e.isDestroyed && e.options.element) {
      if (e.contentComponent)
        return;
      const t = this.editorContentRef.current;
      t.append(...e.options.element.childNodes), e.setOptions({
        element: t
      }), e.contentComponent = Ko(), this.state.hasContentComponentInitialized || (this.unsubscribeToContentComponent = e.contentComponent.subscribe(() => {
        this.setState((n) => n.hasContentComponentInitialized ? n : {
          hasContentComponentInitialized: !0
        }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent();
      })), e.createNodeViews(), this.initialized = !0;
    }
  }
  componentWillUnmount() {
    const e = this.props.editor;
    if (!e || (this.initialized = !1, e.isDestroyed || e.view.setProps({
      nodeViews: {}
    }), this.unsubscribeToContentComponent && this.unsubscribeToContentComponent(), e.contentComponent = null, !e.options.element.firstChild))
      return;
    const t = document.createElement("div");
    t.append(...e.options.element.childNodes), e.setOptions({
      element: t
    });
  }
  render() {
    const { editor: e, innerRef: t, ...n } = this.props;
    return R.createElement(
      R.Fragment,
      null,
      R.createElement("div", { ref: Uo(t, this.editorContentRef), ...n }),
      (e == null ? void 0 : e.contentComponent) && R.createElement(_o, { contentComponent: e.contentComponent })
    );
  }
}
const Xo = lr((r, e) => {
  const t = R.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [r.editor]);
  return R.createElement(Go, {
    key: t,
    innerRef: e,
    ...r
  });
});
R.memo(Xo);
var ct = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xt;
function Yo() {
  if (Xt) return ct;
  Xt = 1;
  var r = R, e = Yn;
  function t(c, f) {
    return c === f && (c !== 0 || 1 / c === 1 / f) || c !== c && f !== f;
  }
  var n = typeof Object.is == "function" ? Object.is : t, i = e.useSyncExternalStore, o = r.useRef, s = r.useEffect, l = r.useMemo, a = r.useDebugValue;
  return ct.useSyncExternalStoreWithSelector = function(c, f, u, h, d) {
    var g = o(null);
    if (g.current === null) {
      var p = { hasValue: !1, value: null };
      g.current = p;
    } else p = g.current;
    g = l(function() {
      function x(O) {
        if (!M) {
          if (M = !0, I = O, O = h(O), d !== void 0 && p.hasValue) {
            var j = p.value;
            if (d(j, O)) return z = j;
          }
          return z = O;
        }
        if (j = z, n(I, O)) return j;
        var W = h(O);
        return d !== void 0 && d(j, W) ? j : (I = O, z = W);
      }
      var M = !1, I, z, L = u === void 0 ? null : u;
      return [function() {
        return x(f());
      }, L === null ? void 0 : function() {
        return x(L());
      }];
    }, [f, u, h, d]);
    var w = i(c, g[0], g[1]);
    return s(function() {
      p.hasValue = !0, p.value = w;
    }, [w]), a(w), w;
  }, ct;
}
Yo();
const Qo = tn({
  editor: null
});
Qo.Consumer;
const Qn = tn({
  onDragStart: void 0
}), Zo = () => ar(Qn), es = R.forwardRef((r, e) => {
  const { onDragStart: t } = Zo(), n = r.as || "div";
  return (
    // @ts-ignore
    R.createElement(n, { ...r, ref: e, "data-node-view-wrapper": "", onDragStart: t, style: {
      whiteSpace: "normal",
      ...r.style
    } })
  );
});
function Yt(r) {
  return !!(typeof r == "function" && r.prototype && r.prototype.isReactComponent);
}
function Qt(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.forward_ref)" || r.$$typeof.description === "react.forward_ref"));
}
function ts(r) {
  return !!(typeof r == "object" && r.$$typeof && (r.$$typeof.toString() === "Symbol(react.memo)" || r.$$typeof.description === "react.memo"));
}
function ns(r) {
  if (Yt(r) || Qt(r))
    return !0;
  if (ts(r)) {
    const e = r.type;
    if (e)
      return Yt(e) || Qt(e);
  }
  return !1;
}
function rs() {
  try {
    if (Mt)
      return parseInt(Mt.split(".")[0], 10) >= 19;
  } catch {
  }
  return !1;
}
class is {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(e, { editor: t, props: n = {}, as: i = "div", className: o = "" }) {
    this.ref = null, this.id = Math.floor(Math.random() * 4294967295).toString(), this.component = e, this.editor = t, this.props = n, this.element = document.createElement(i), this.element.classList.add("react-renderer"), o && this.element.classList.add(...o.split(" ")), this.editor.isInitialized ? ur(() => {
      this.render();
    }) : queueMicrotask(() => {
      this.render();
    });
  }
  /**
   * Render the React component.
   */
  render() {
    var e;
    const t = this.component, n = this.props, i = this.editor, o = rs(), s = ns(t), l = { ...n };
    l.ref && !(o || s) && delete l.ref, !l.ref && (o || s) && (l.ref = (a) => {
      this.ref = a;
    }), this.reactElement = R.createElement(t, { ...l }), (e = i == null ? void 0 : i.contentComponent) === null || e === void 0 || e.setRenderer(this.id, this);
  }
  /**
   * Re-renders the React component with new props.
   */
  updateProps(e = {}) {
    this.props = {
      ...this.props,
      ...e
    }, this.render();
  }
  /**
   * Destroy the React component.
   */
  destroy() {
    var e;
    const t = this.editor;
    (e = t == null ? void 0 : t.contentComponent) === null || e === void 0 || e.removeRenderer(this.id);
  }
  /**
   * Update the attributes of the element that holds the React component.
   */
  updateAttributes(e) {
    Object.keys(e).forEach((t) => {
      this.element.setAttribute(t, e[t]);
    });
  }
}
class ss extends Ho {
  constructor(e, t, n) {
    if (super(e, t, n), !this.node.isLeaf) {
      this.options.contentDOMElementTag ? this.contentDOMElement = document.createElement(this.options.contentDOMElementTag) : this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div"), this.contentDOMElement.dataset.nodeViewContentReact = "", this.contentDOMElement.dataset.nodeViewWrapper = "", this.contentDOMElement.style.whiteSpace = "inherit";
      const i = this.dom.querySelector("[data-node-view-content]");
      if (!i)
        return;
      i.appendChild(this.contentDOMElement);
    }
  }
  /**
   * Setup the React component.
   * Called on initialization.
   */
  mount() {
    const e = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: !1,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (c = {}) => this.updateAttributes(c),
      deleteNode: () => this.deleteNode(),
      ref: ir()
    };
    if (!this.component.displayName) {
      const c = (f) => f.charAt(0).toUpperCase() + f.substring(1);
      this.component.displayName = c(this.extension.name);
    }
    const i = { onDragStart: this.onDragStart.bind(this), nodeViewContentRef: (c) => {
      c && this.contentDOMElement && c.firstChild !== this.contentDOMElement && (c.hasAttribute("data-node-view-wrapper") && c.removeAttribute("data-node-view-wrapper"), c.appendChild(this.contentDOMElement));
    } }, o = this.component, s = or((c) => R.createElement(Qn.Provider, { value: i }, sr(o, c)));
    s.displayName = "ReactNodeView";
    let l = this.node.isInline ? "span" : "div";
    this.options.as && (l = this.options.as);
    const { className: a = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.renderer = new is(s, {
      editor: this.editor,
      props: e,
      as: l,
      className: `node-${this.node.type.name} ${a}`.trim()
    }), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.updateElementAttributes();
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    var e;
    if (this.renderer.element.firstElementChild && !(!((e = this.renderer.element.firstElementChild) === null || e === void 0) && e.hasAttribute("data-node-view-wrapper")))
      throw Error("Please use the NodeViewWrapper component for your node view.");
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    return this.node.isLeaf ? null : this.contentDOMElement;
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    const { from: e, to: t } = this.editor.state.selection, n = this.getPos();
    if (typeof n == "number")
      if (e <= n && t >= n + this.node.nodeSize) {
        if (this.renderer.props.selected)
          return;
        this.selectNode();
      } else {
        if (!this.renderer.props.selected)
          return;
        this.deselectNode();
      }
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(e, t, n) {
    const i = (o) => {
      this.renderer.updateProps(o), typeof this.options.attrs == "function" && this.updateElementAttributes();
    };
    if (e.type !== this.node.type)
      return !1;
    if (typeof this.options.update == "function") {
      const o = this.node, s = this.decorations, l = this.innerDecorations;
      return this.node = e, this.decorations = t, this.innerDecorations = n, this.options.update({
        oldNode: o,
        oldDecorations: s,
        newNode: e,
        newDecorations: t,
        oldInnerDecorations: l,
        innerDecorations: n,
        updateProps: () => i({ node: e, decorations: t, innerDecorations: n })
      });
    }
    return e === this.node && this.decorations === t && this.innerDecorations === n || (this.node = e, this.decorations = t, this.innerDecorations = n, i({ node: e, decorations: t, innerDecorations: n })), !0;
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: !0
    }), this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: !1
    }), this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  /**
   * Destroy the React component instance.
   */
  destroy() {
    this.renderer.destroy(), this.editor.off("selectionUpdate", this.handleSelectionUpdate), this.contentDOMElement = null;
  }
  /**
   * Update the attributes of the top-level element that holds the React component.
   * Applying the attributes defined in the `attrs` option.
   */
  updateElementAttributes() {
    if (this.options.attrs) {
      let e = {};
      if (typeof this.options.attrs == "function") {
        const t = this.editor.extensionManager.attributes, n = vi(this.node, t);
        e = this.options.attrs({ node: this.node, HTMLAttributes: n });
      } else
        e = this.options.attrs;
      this.renderer.updateAttributes(e);
    }
  }
}
function ls(r, e) {
  return (t) => t.editor.contentComponent ? new ss(r, t, e) : {};
}
function as(r) {
  if (r == null) return "";
  try {
    const e = JSON.stringify(r);
    if (typeof window > "u") {
      const t = globalThis.Buffer;
      return t ? t.from(e, "utf-8").toString("base64") : "";
    }
    return window.btoa(unescape(encodeURIComponent(e)));
  } catch {
    return "";
  }
}
function Zn(r, e) {
  if (!r || typeof r != "string") return e;
  try {
    let t;
    if (typeof window > "u") {
      const i = globalThis.Buffer;
      t = i ? i.from(r, "base64").toString("utf-8") : "";
    } else
      t = decodeURIComponent(escape(window.atob(r)));
    if (!t) return e;
    const n = JSON.parse(t);
    return { ...e, ...n };
  } catch {
    return e;
  }
}
const cs = {
  slides: [],
  autoplay: !1,
  interval: 5e3,
  showDots: !0,
  showArrows: !0,
  loop: !0,
  aspectRatio: "16/9"
}, fs = {
  slides: [],
  height: "medium",
  align: "left",
  autoplay: !0,
  interval: 6e3,
  showDots: !0,
  showArrows: !0
}, us = {
  slides: [],
  perView: 3,
  autoplay: !1,
  interval: 5e3,
  showDots: !0,
  showArrows: !0,
  loop: !0
}, ds = {
  logos: [],
  speed: "normal",
  grayscale: !0,
  height: 40
};
function A(r) {
  return r ? String(r).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : "";
}
function K(r, e) {
  return e == null || e === "" ? "" : typeof e == "boolean" ? e ? ` ${r}="1"` : "" : ` ${r}="${A(String(e))}"`;
}
function er(r, e) {
  return r ? `<a href="${A(r)}" rel="noopener">${e}</a>` : e;
}
function It(r, e, t) {
  const n = r && t > 1 ? '<div class="fws-arrows"><button type="button" class="fws-prev" aria-label="Previous"></button><button type="button" class="fws-next" aria-label="Next"></button></div>' : "";
  let i = "";
  if (e && t > 1) {
    const o = [];
    for (let s = 0; s < t; s++)
      o.push(`<button type="button" aria-label="Slide ${s + 1}"></button>`);
    i = `<div class="fws-dots">${o.join("")}</div>`;
  }
  return n + i;
}
function hs(r) {
  const e = r.slides || [];
  if (e.length === 0) return "";
  const t = [
    'class="fws fws-image"',
    'data-cms-slider="image"',
    `data-aspect="${A(r.aspectRatio)}"`,
    K("data-autoplay", r.autoplay).trim(),
    K("data-interval", r.interval).trim(),
    K("data-loop", r.loop).trim()
  ].filter(Boolean).join(" "), n = e.map((i) => {
    const o = `<img src="${A(i.src)}" alt="${A(i.alt)}" loading="lazy" />`, s = i.caption ? `<div class="fws-caption">${A(i.caption)}</div>` : "";
    return `<div class="fws-slide">${er(i.link, o)}${s}</div>`;
  }).join("");
  return `<div ${t}><div class="fws-viewport"><div class="fws-track">${n}</div></div>${It(r.showArrows, r.showDots, e.length)}</div>`;
}
function ps(r) {
  const e = r.slides || [];
  if (e.length === 0) return "";
  const t = [
    'class="fws fws-hero"',
    'data-cms-slider="hero"',
    `data-height="${A(r.height)}"`,
    `data-align="${A(r.align)}"`,
    K("data-autoplay", r.autoplay).trim(),
    K("data-interval", r.interval).trim(),
    K("data-loop", !0).trim()
  ].filter(Boolean).join(" "), n = e.map((i) => {
    const o = i.overlay === "light" ? "fws-overlay-light" : i.overlay === "dark" ? "fws-overlay-dark" : "", s = i.backgroundSrc ? ` style="background-image:url('${A(i.backgroundSrc)}')"` : "", l = i.eyebrow ? `<div class="fws-eyebrow">${A(i.eyebrow)}</div>` : "", a = i.title ? `<h2 class="fws-title">${A(i.title)}</h2>` : "", c = i.subtitle ? `<p class="fws-subtitle">${A(i.subtitle)}</p>` : "", f = i.ctaLabel && i.ctaHref ? `<a class="fws-cta" href="${A(i.ctaHref)}" rel="noopener">${A(i.ctaLabel)}</a>` : "";
    return `<div class="fws-slide ${o}"${s}><div class="fws-hero-content">${l}${a}${c}${f}</div></div>`;
  }).join("");
  return `<div ${t}><div class="fws-viewport"><div class="fws-track">${n}</div></div>${It(r.showArrows, r.showDots, e.length)}</div>`;
}
function ms(r) {
  const e = r.slides || [];
  if (e.length === 0) return "";
  const n = [
    'class="fws fws-card"',
    'data-cms-slider="card"',
    `data-per-view="${Math.min(4, Math.max(1, r.perView || 3))}"`,
    K("data-autoplay", r.autoplay).trim(),
    K("data-interval", r.interval).trim(),
    K("data-loop", r.loop).trim()
  ].filter(Boolean).join(" "), i = e.map((o) => {
    const s = o.imageSrc ? `<div class="fws-card-image"><img src="${A(o.imageSrc)}" alt="${A(o.imageAlt)}" loading="lazy" /></div>` : "", l = o.title ? `<h3 class="fws-card-title">${A(o.title)}</h3>` : "", a = o.text ? `<p class="fws-card-text">${A(o.text)}</p>` : "", c = o.linkLabel || o.link, f = o.link ? `<a class="fws-card-link" href="${A(o.link)}" rel="noopener">${A(c)}</a>` : "";
    return `<div class="fws-slide">${s}<div class="fws-card-body">${l}${a}${f}</div></div>`;
  }).join("");
  return `<div ${n}><div class="fws-viewport"><div class="fws-track">${i}</div></div>${It(r.showArrows, r.showDots, e.length)}</div>`;
}
function gs(r) {
  const e = r.logos || [];
  if (e.length === 0) return "";
  const t = Math.max(20, Math.min(120, Math.floor(r.height || 40))), n = [
    'class="fws fws-logo"',
    'data-cms-slider="logo"',
    `data-speed="${A(r.speed)}"`,
    K("data-grayscale", r.grayscale).trim()
  ].filter(Boolean).join(" "), i = e.map((o) => {
    const s = `<img src="${A(o.src)}" alt="${A(o.alt)}" style="height:${t}px" loading="lazy" />`;
    return er(o.link, s);
  }).join("");
  return `<div ${n}><div class="fws-logo-viewport"><div class="fws-logo-track">${i}</div></div></div>`;
}
const Re = "flexweg-sliders", Ge = {
  image: {
    id: `${Re}/image`,
    kind: "image",
    defaults: cs,
    renderHtml: (r) => hs(r)
  },
  hero: {
    id: `${Re}/hero`,
    kind: "hero",
    defaults: fs,
    renderHtml: (r) => ps(r)
  },
  card: {
    id: `${Re}/card`,
    kind: "card",
    defaults: us,
    renderHtml: (r) => ms(r)
  },
  logo: {
    id: `${Re}/logo`,
    kind: "logo",
    defaults: ds,
    renderHtml: (r) => gs(r)
  }
}, tr = Object.values(Ge);
function ws({ kind: r, attrs: e, selected: t }) {
  const { t: n } = H("flexweg-sliders"), o = Ge[r].renderHtml(e), s = ys(r, e), l = n(`blocks.${r}.title`);
  return /* @__PURE__ */ k(
    es,
    {
      as: "div",
      className: "flexweg-sliders-nodeview",
      style: {
        position: "relative",
        outline: t ? "2px solid var(--primary, #0ea5e9)" : "1px dashed rgba(0,0,0,.15)",
        borderRadius: ".5rem",
        padding: ".25rem",
        margin: "1rem 0",
        cursor: "pointer"
      },
      "data-drag-handle": !0,
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            className: "flexweg-sliders-nodeview-label",
            style: {
              position: "absolute",
              top: ".25rem",
              right: ".5rem",
              fontSize: ".7rem",
              padding: ".15rem .5rem",
              background: "rgba(0,0,0,.65)",
              color: "#fff",
              borderRadius: "9999px",
              zIndex: 3,
              pointerEvents: "none"
            },
            children: n("preview.blockLabel", { kind: l, n: s })
          }
        ),
        s === 0 ? /* @__PURE__ */ m("div", { className: "fws-placeholder", children: n(`empty.${r}`) }) : /* @__PURE__ */ m(
          "div",
          {
            "aria-hidden": "true",
            dangerouslySetInnerHTML: { __html: o }
          }
        )
      ]
    }
  );
}
function ys(r, e) {
  var t, n;
  return r === "logo" ? ((t = e.logos) == null ? void 0 : t.length) ?? 0 : ((n = e.slides) == null ? void 0 : n.length) ?? 0;
}
function ve(r) {
  return `flexwegSlider${r.charAt(0).toUpperCase() + r.slice(1)}`;
}
function xs(r) {
  const e = r.id, t = ve(r.kind);
  return He.create({
    name: t,
    group: "block",
    atom: !0,
    selectable: !0,
    draggable: !0,
    addAttributes() {
      return {
        attrs: {
          default: r.defaults,
          parseHTML: (n) => Zn(n.getAttribute("data-attrs") ?? "", r.defaults),
          renderHTML: (n) => ({
            "data-attrs": as(n.attrs ?? r.defaults)
          })
        }
      };
    },
    parseHTML() {
      return [{ tag: `div[data-cms-block="${e}"]` }];
    },
    renderHTML({ HTMLAttributes: n }) {
      return [
        "div",
        Vn(n, { "data-cms-block": e })
      ];
    },
    addNodeView() {
      return ls((n) => {
        const i = n.node.attrs.attrs ?? r.defaults, o = (s) => {
          n.updateAttributes({ attrs: { ...i, ...s } });
        };
        return /* @__PURE__ */ m(
          ws,
          {
            kind: r.kind,
            attrs: i,
            updateAttrs: o,
            selected: n.selected
          }
        );
      });
    }
  });
}
function vs({ editor: r, kind: e }) {
  const { t } = H("flexweg-sliders"), n = ve(e), o = r.getAttributes(n).attrs ?? Ge[e].defaults;
  function s(l) {
    r.chain().updateAttributes(n, {
      attrs: { ...o, ...l }
    }).run();
  }
  return /* @__PURE__ */ k("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ k(Zt, { title: t("inspector.slides"), children: [
      e === "image" && /* @__PURE__ */ m(ks, { attrs: o, update: s }),
      e === "hero" && /* @__PURE__ */ m(bs, { attrs: o, update: s }),
      e === "card" && /* @__PURE__ */ m(Ss, { attrs: o, update: s }),
      e === "logo" && /* @__PURE__ */ m(Cs, { attrs: o, update: s })
    ] }),
    /* @__PURE__ */ k(Zt, { title: t("inspector.options"), children: [
      e === "image" && /* @__PURE__ */ m(Es, { attrs: o, update: s }),
      e === "hero" && /* @__PURE__ */ m(As, { attrs: o, update: s }),
      e === "card" && /* @__PURE__ */ m(Is, { attrs: o, update: s }),
      e === "logo" && /* @__PURE__ */ m(Ms, { attrs: o, update: s })
    ] })
  ] });
}
function Zt({ title: r, children: e }) {
  return /* @__PURE__ */ k("fieldset", { className: "space-y-2", children: [
    /* @__PURE__ */ m("legend", { className: "text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400", children: r }),
    e
  ] });
}
function $({ label: r, value: e, onChange: t, placeholder: n }) {
  return /* @__PURE__ */ k("label", { className: "block", children: [
    /* @__PURE__ */ m("span", { className: "block text-xs text-surface-600 dark:text-surface-300 mb-1", children: r }),
    /* @__PURE__ */ m(
      "input",
      {
        type: "text",
        className: "input w-full",
        value: e ?? "",
        placeholder: n,
        onChange: (i) => t(i.target.value)
      }
    )
  ] });
}
function Xe({ label: r, value: e, onChange: t, min: n, max: i, step: o }) {
  return /* @__PURE__ */ k("label", { className: "block", children: [
    /* @__PURE__ */ m("span", { className: "block text-xs text-surface-600 dark:text-surface-300 mb-1", children: r }),
    /* @__PURE__ */ m(
      "input",
      {
        type: "number",
        className: "input w-full",
        value: e ?? 0,
        min: n,
        max: i,
        step: o,
        onChange: (s) => t(Number(s.target.value) || 0)
      }
    )
  ] });
}
function V({ label: r, checked: e, onChange: t }) {
  return /* @__PURE__ */ k("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
    /* @__PURE__ */ m("input", { type: "checkbox", checked: !!e, onChange: (n) => t(n.target.checked) }),
    /* @__PURE__ */ m("span", { className: "text-sm", children: r })
  ] });
}
function de({ label: r, value: e, options: t, onChange: n }) {
  return /* @__PURE__ */ k("label", { className: "block", children: [
    /* @__PURE__ */ m("span", { className: "block text-xs text-surface-600 dark:text-surface-300 mb-1", children: r }),
    /* @__PURE__ */ m("select", { className: "input w-full", value: e, onChange: (i) => n(i.target.value), children: t.map((i) => /* @__PURE__ */ m("option", { value: i.value, children: i.label }, i.value)) })
  ] });
}
function Ye({ label: r, url: e, alt: t, onPick: n, onClear: i }) {
  const { t: o } = H("flexweg-sliders"), [s, l] = cr(!1);
  return /* @__PURE__ */ k("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ m("span", { className: "block text-xs text-surface-600 dark:text-surface-300", children: r }),
    e ? /* @__PURE__ */ k("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ m("img", { src: e, alt: t ?? "", className: "w-14 h-14 object-cover rounded border border-surface-200 dark:border-surface-700" }),
      /* @__PURE__ */ k("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ m("button", { type: "button", className: "btn btn-secondary text-xs", onClick: () => l(!0), children: o("inspector.pickImage") }),
        /* @__PURE__ */ m("button", { type: "button", className: "btn btn-ghost text-xs", onClick: i, children: o("inspector.clearImage") })
      ] })
    ] }) : /* @__PURE__ */ m("button", { type: "button", className: "btn btn-secondary text-xs", onClick: () => l(!0), children: o("inspector.pickImage") }),
    s && /* @__PURE__ */ m(
      dr,
      {
        onPick: (a) => {
          n(a), l(!1);
        },
        onClose: () => l(!1)
      }
    )
  ] });
}
function Qe({ items: r, emptyKey: e, newItem: t, renderItem: n, onChange: i }) {
  const { t: o } = H("flexweg-sliders"), s = r ?? [];
  function l(h, d) {
    const g = s.slice();
    g[h] = { ...g[h], ...d }, i(g);
  }
  function a(h) {
    const d = s.slice();
    d.splice(h, 1), i(d);
  }
  function c(h, d) {
    const g = h + d;
    if (g < 0 || g >= s.length) return;
    const p = s.slice(), [w] = p.splice(h, 1);
    p.splice(g, 0, w), i(p);
  }
  function f(h) {
    const d = s.slice();
    d.splice(h + 1, 0, { ...d[h] }), i(d);
  }
  function u() {
    i(s.concat(t()));
  }
  return /* @__PURE__ */ k("div", { className: "space-y-3", children: [
    s.length === 0 && /* @__PURE__ */ m("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: o(`empty.${e}`) }),
    s.map((h, d) => /* @__PURE__ */ k("div", { className: "rounded border border-surface-200 dark:border-surface-700 p-2 space-y-2", children: [
      /* @__PURE__ */ k("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ k("span", { className: "text-[11px] font-semibold uppercase opacity-60", children: [
          "#",
          d + 1
        ] }),
        /* @__PURE__ */ k("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ m(ze, { title: o("inspector.moveUp"), onClick: () => c(d, -1), disabled: d === 0, children: "↑" }),
          /* @__PURE__ */ m(ze, { title: o("inspector.moveDown"), onClick: () => c(d, 1), disabled: d === s.length - 1, children: "↓" }),
          /* @__PURE__ */ m(ze, { title: o("inspector.duplicate"), onClick: () => f(d), children: "⎘" }),
          /* @__PURE__ */ m(ze, { title: o("inspector.removeSlide"), onClick: () => a(d), variant: "danger", children: "×" })
        ] })
      ] }),
      n(h, d, (g) => l(d, g))
    ] }, d)),
    /* @__PURE__ */ m("button", { type: "button", className: "btn btn-secondary w-full", onClick: u, children: o("inspector.addSlide") })
  ] });
}
function ze({ children: r, onClick: e, disabled: t, title: n, variant: i }) {
  return /* @__PURE__ */ m(
    "button",
    {
      type: "button",
      onClick: e,
      disabled: t,
      title: n,
      "aria-label": n,
      className: `inline-flex items-center justify-center w-6 h-6 rounded text-xs ${i === "danger" ? "hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400" : "hover:bg-surface-100 dark:hover:bg-surface-700"} disabled:opacity-30 disabled:cursor-not-allowed`,
      children: r
    }
  );
}
function ks({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ m(
    Qe,
    {
      items: r.slides ?? [],
      emptyKey: "image",
      newItem: () => ({ src: "", alt: "", caption: "", link: "" }),
      onChange: (n) => e({ slides: n }),
      renderItem: (n, i, o) => /* @__PURE__ */ k("div", { className: "space-y-2", children: [
        /* @__PURE__ */ m(
          Ye,
          {
            label: t("inspector.pickImage"),
            url: n.src,
            alt: n.alt,
            onPick: (s) => o({ src: Ue(s, "large") || s.url || "", alt: n.alt || s.alt || s.name }),
            onClear: () => o({ src: "" })
          }
        ),
        /* @__PURE__ */ m($, { label: t("inspector.fields.alt"), value: n.alt ?? "", onChange: (s) => o({ alt: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.caption"), value: n.caption ?? "", onChange: (s) => o({ caption: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.link"), value: n.link ?? "", onChange: (s) => o({ link: s }), placeholder: "https://" })
      ] })
    }
  );
}
function bs({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ m(
    Qe,
    {
      items: r.slides ?? [],
      emptyKey: "hero",
      newItem: () => ({ backgroundSrc: "", eyebrow: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "", overlay: "dark" }),
      onChange: (n) => e({ slides: n }),
      renderItem: (n, i, o) => /* @__PURE__ */ k("div", { className: "space-y-2", children: [
        /* @__PURE__ */ m(
          Ye,
          {
            label: t("inspector.pickImage"),
            url: n.backgroundSrc,
            onPick: (s) => o({ backgroundSrc: Ue(s, "large") || s.url || "" }),
            onClear: () => o({ backgroundSrc: "" })
          }
        ),
        /* @__PURE__ */ m($, { label: t("inspector.fields.eyebrow"), value: n.eyebrow ?? "", onChange: (s) => o({ eyebrow: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.title"), value: n.title ?? "", onChange: (s) => o({ title: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.subtitle"), value: n.subtitle ?? "", onChange: (s) => o({ subtitle: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.ctaLabel"), value: n.ctaLabel ?? "", onChange: (s) => o({ ctaLabel: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.ctaHref"), value: n.ctaHref ?? "", onChange: (s) => o({ ctaHref: s }), placeholder: "https://" }),
        /* @__PURE__ */ m(
          de,
          {
            label: t("inspector.overlay"),
            value: n.overlay ?? "none",
            onChange: (s) => o({ overlay: s }),
            options: [
              { value: "none", label: t("options.overlay.none") },
              { value: "light", label: t("options.overlay.light") },
              { value: "dark", label: t("options.overlay.dark") }
            ]
          }
        )
      ] })
    }
  );
}
function Ss({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ m(
    Qe,
    {
      items: r.slides ?? [],
      emptyKey: "card",
      newItem: () => ({ imageSrc: "", imageAlt: "", title: "", text: "", link: "", linkLabel: "" }),
      onChange: (n) => e({ slides: n }),
      renderItem: (n, i, o) => /* @__PURE__ */ k("div", { className: "space-y-2", children: [
        /* @__PURE__ */ m(
          Ye,
          {
            label: t("inspector.pickImage"),
            url: n.imageSrc,
            alt: n.imageAlt,
            onPick: (s) => o({ imageSrc: Ue(s, "medium") || s.url || "", imageAlt: n.imageAlt || s.alt || s.name }),
            onClear: () => o({ imageSrc: "" })
          }
        ),
        /* @__PURE__ */ m($, { label: t("inspector.fields.alt"), value: n.imageAlt ?? "", onChange: (s) => o({ imageAlt: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.title"), value: n.title ?? "", onChange: (s) => o({ title: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.text"), value: n.text ?? "", onChange: (s) => o({ text: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.link"), value: n.link ?? "", onChange: (s) => o({ link: s }), placeholder: "https://" }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.linkLabel"), value: n.linkLabel ?? "", onChange: (s) => o({ linkLabel: s }) })
      ] })
    }
  );
}
function Cs({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ m(
    Qe,
    {
      items: r.logos ?? [],
      emptyKey: "logo",
      newItem: () => ({ src: "", alt: "", link: "" }),
      onChange: (n) => e({ logos: n }),
      renderItem: (n, i, o) => /* @__PURE__ */ k("div", { className: "space-y-2", children: [
        /* @__PURE__ */ m(
          Ye,
          {
            label: t("inspector.pickImage"),
            url: n.src,
            alt: n.alt,
            onPick: (s) => o({ src: Ue(s, "medium") || s.url || "", alt: n.alt || s.alt || s.name }),
            onClear: () => o({ src: "" })
          }
        ),
        /* @__PURE__ */ m($, { label: t("inspector.fields.alt"), value: n.alt ?? "", onChange: (s) => o({ alt: s }) }),
        /* @__PURE__ */ m($, { label: t("inspector.fields.link"), value: n.link ?? "", onChange: (s) => o({ link: s }), placeholder: "https://" })
      ] })
    }
  );
}
function Es({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ k("div", { className: "space-y-2", children: [
    /* @__PURE__ */ m(
      de,
      {
        label: t("inspector.aspectRatio"),
        value: r.aspectRatio,
        onChange: (n) => e({ aspectRatio: n }),
        options: [
          { value: "16/9", label: t("options.aspect.16/9") },
          { value: "4/3", label: t("options.aspect.4/3") },
          { value: "1/1", label: t("options.aspect.1/1") },
          { value: "21/9", label: t("options.aspect.21/9") }
        ]
      }
    ),
    /* @__PURE__ */ m(V, { label: t("inspector.autoplay"), checked: r.autoplay, onChange: (n) => e({ autoplay: n }) }),
    r.autoplay && /* @__PURE__ */ m(Xe, { label: t("inspector.interval"), value: r.interval, onChange: (n) => e({ interval: n }), min: 1500, step: 500 }),
    /* @__PURE__ */ m(V, { label: t("inspector.showDots"), checked: r.showDots, onChange: (n) => e({ showDots: n }) }),
    /* @__PURE__ */ m(V, { label: t("inspector.showArrows"), checked: r.showArrows, onChange: (n) => e({ showArrows: n }) }),
    /* @__PURE__ */ m(V, { label: t("inspector.loop"), checked: r.loop, onChange: (n) => e({ loop: n }) })
  ] });
}
function As({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ k("div", { className: "space-y-2", children: [
    /* @__PURE__ */ m(
      de,
      {
        label: t("inspector.height"),
        value: r.height,
        onChange: (n) => e({ height: n }),
        options: [
          { value: "short", label: t("options.height.short") },
          { value: "medium", label: t("options.height.medium") },
          { value: "tall", label: t("options.height.tall") }
        ]
      }
    ),
    /* @__PURE__ */ m(
      de,
      {
        label: t("inspector.align"),
        value: r.align,
        onChange: (n) => e({ align: n }),
        options: [
          { value: "left", label: t("options.align.left") },
          { value: "center", label: t("options.align.center") },
          { value: "right", label: t("options.align.right") }
        ]
      }
    ),
    /* @__PURE__ */ m(V, { label: t("inspector.autoplay"), checked: r.autoplay, onChange: (n) => e({ autoplay: n }) }),
    r.autoplay && /* @__PURE__ */ m(Xe, { label: t("inspector.interval"), value: r.interval, onChange: (n) => e({ interval: n }), min: 1500, step: 500 }),
    /* @__PURE__ */ m(V, { label: t("inspector.showDots"), checked: r.showDots, onChange: (n) => e({ showDots: n }) }),
    /* @__PURE__ */ m(V, { label: t("inspector.showArrows"), checked: r.showArrows, onChange: (n) => e({ showArrows: n }) })
  ] });
}
function Is({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ k("div", { className: "space-y-2", children: [
    /* @__PURE__ */ m(
      de,
      {
        label: t("inspector.perView"),
        value: String(r.perView),
        onChange: (n) => e({ perView: Number(n) }),
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" }
        ]
      }
    ),
    /* @__PURE__ */ m(V, { label: t("inspector.autoplay"), checked: r.autoplay, onChange: (n) => e({ autoplay: n }) }),
    r.autoplay && /* @__PURE__ */ m(Xe, { label: t("inspector.interval"), value: r.interval, onChange: (n) => e({ interval: n }), min: 1500, step: 500 }),
    /* @__PURE__ */ m(V, { label: t("inspector.showDots"), checked: r.showDots, onChange: (n) => e({ showDots: n }) }),
    /* @__PURE__ */ m(V, { label: t("inspector.showArrows"), checked: r.showArrows, onChange: (n) => e({ showArrows: n }) }),
    /* @__PURE__ */ m(V, { label: t("inspector.loop"), checked: r.loop, onChange: (n) => e({ loop: n }) })
  ] });
}
function Ms({ attrs: r, update: e }) {
  const { t } = H("flexweg-sliders");
  return /* @__PURE__ */ k("div", { className: "space-y-2", children: [
    /* @__PURE__ */ m(
      de,
      {
        label: t("inspector.speed"),
        value: r.speed,
        onChange: (n) => e({ speed: n }),
        options: [
          { value: "slow", label: t("options.speed.slow") },
          { value: "normal", label: t("options.speed.normal") },
          { value: "fast", label: t("options.speed.fast") }
        ]
      }
    ),
    /* @__PURE__ */ m(Xe, { label: t("inspector.logoHeight"), value: r.height, onChange: (n) => e({ height: n }), min: 20, max: 120, step: 4 }),
    /* @__PURE__ */ m(V, { label: t("inspector.grayscale"), checked: r.grayscale, onChange: (n) => e({ grayscale: n }) })
  ] });
}
const nr = `/* Baseline CSS for the four slider blocks. Injected via the
   page.head.extra filter once per page on which any slider appears.
   Themes can override these rules with higher-specificity .fws-*
   selectors. */

.fws {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 1.5rem 0;
  overflow: hidden;
}
.fws-viewport { width: 100%; overflow: hidden; position: relative; }
.fws-track {
  display: flex;
  width: 100%;
  transition: transform 350ms ease;
  will-change: transform;
  touch-action: pan-y;
}
.fws-slide {
  flex: 0 0 100%;
  min-width: 0;
  position: relative;
}
.fws-slide img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* Per-view sizing — overridden by data-per-view via inline style on the slide. */
.fws[data-per-view="2"] .fws-slide { flex-basis: 50%; }
.fws[data-per-view="3"] .fws-slide { flex-basis: 33.3333%; }
.fws[data-per-view="4"] .fws-slide { flex-basis: 25%; }
@media (max-width: 768px) {
  .fws[data-per-view="2"] .fws-slide,
  .fws[data-per-view="3"] .fws-slide,
  .fws[data-per-view="4"] .fws-slide { flex-basis: 100%; }
}

/* Image slider — aspect-ratio comes from data-aspect. */
.fws-image[data-aspect="16/9"] .fws-slide { aspect-ratio: 16 / 9; }
.fws-image[data-aspect="4/3"] .fws-slide { aspect-ratio: 4 / 3; }
.fws-image[data-aspect="1/1"] .fws-slide { aspect-ratio: 1 / 1; }
.fws-image[data-aspect="21/9"] .fws-slide { aspect-ratio: 21 / 9; }
.fws-image .fws-caption {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: .75rem 1rem;
  background: linear-gradient(to top, rgba(0,0,0,.6), transparent);
  color: #fff;
  font-size: .875rem;
}
.fws-image .fws-slide > a { display: block; height: 100%; }

/* Hero slider — viewport height. */
.fws-hero[data-height="short"] .fws-slide { height: 50vh; min-height: 320px; }
.fws-hero[data-height="medium"] .fws-slide { height: 70vh; min-height: 420px; }
.fws-hero[data-height="tall"] .fws-slide { height: 100vh; min-height: 520px; }
.fws-hero .fws-slide {
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: #fff;
}
.fws-hero .fws-overlay-light::before,
.fws-hero .fws-overlay-dark::before {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
}
.fws-hero .fws-overlay-light::before { background: rgba(255,255,255,.45); }
.fws-hero .fws-overlay-dark::before { background: rgba(0,0,0,.45); }
.fws-hero .fws-hero-content {
  position: relative;
  max-width: 720px;
  padding: 2rem 2.5rem;
  z-index: 1;
}
.fws-hero[data-align="center"] .fws-slide { justify-content: center; text-align: center; }
.fws-hero[data-align="right"] .fws-slide { justify-content: flex-end; text-align: right; }
.fws-hero .fws-eyebrow {
  text-transform: uppercase;
  letter-spacing: .12em;
  font-size: .75rem;
  opacity: .85;
  margin-bottom: .5rem;
}
.fws-hero .fws-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; margin: 0 0 .5rem; }
.fws-hero .fws-subtitle { font-size: clamp(1rem, 1.6vw, 1.25rem); opacity: .9; margin: 0 0 1.25rem; }
.fws-hero .fws-cta {
  display: inline-block;
  padding: .65rem 1.25rem;
  border: 1px solid currentColor;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

/* Card slider. */
.fws-card .fws-track { gap: 1rem; padding: .25rem; }
.fws-card .fws-slide {
  background: var(--card, #fff);
  color: var(--card-foreground, inherit);
  border-radius: .75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
  display: flex;
  flex-direction: column;
}
.fws-card .fws-card-image { aspect-ratio: 16/9; background: rgba(0,0,0,.04); }
.fws-card .fws-card-image img { width: 100%; height: 100%; object-fit: cover; }
.fws-card .fws-card-body { padding: 1rem 1.125rem; display: flex; flex-direction: column; gap: .35rem; flex: 1; }
.fws-card .fws-card-title { font-size: 1.05rem; font-weight: 700; margin: 0; }
.fws-card .fws-card-text { font-size: .9rem; opacity: .85; margin: 0; }
.fws-card .fws-card-link {
  margin-top: auto;
  display: inline-block;
  font-weight: 600;
  font-size: .875rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid currentColor;
  align-self: flex-start;
}

/* Controls — arrows + dots. Shared across image / hero / card. */
.fws-arrows .fws-prev,
.fws-arrows .fws-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(0,0,0,.55);
  color: #fff;
  border: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 2;
}
.fws-arrows .fws-prev { left: .75rem; }
.fws-arrows .fws-next { right: .75rem; }
.fws-arrows .fws-prev:hover,
.fws-arrows .fws-next:hover { background: rgba(0,0,0,.75); }
.fws-arrows .fws-prev:disabled,
.fws-arrows .fws-next:disabled { opacity: .35; cursor: not-allowed; }
.fws-arrows .fws-prev::before { content: "‹"; font-size: 1.5rem; line-height: 1; }
.fws-arrows .fws-next::before { content: "›"; font-size: 1.5rem; line-height: 1; }

.fws-dots {
  position: absolute;
  bottom: .75rem;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  gap: .375rem;
  z-index: 2;
}
.fws-dots button {
  width: .55rem;
  height: .55rem;
  border-radius: 9999px;
  background: rgba(255,255,255,.55);
  border: 0;
  cursor: pointer;
  padding: 0;
}
.fws-dots button[aria-current="true"] { background: #fff; transform: scale(1.25); }

/* Card slider variant: arrows outside the viewport, dots below. */
.fws-card .fws-arrows .fws-prev,
.fws-card .fws-arrows .fws-next { background: rgba(0,0,0,.35); }
.fws-card .fws-dots {
  position: static;
  margin-top: .75rem;
  justify-content: center;
}
.fws-card .fws-dots button { background: rgba(0,0,0,.25); }
.fws-card .fws-dots button[aria-current="true"] { background: #000; }

/* Logo carousel — pure CSS marquee. */
.fws-logo {
  overflow: hidden;
  width: 100%;
  margin: 1.5rem 0;
}
.fws-logo-viewport { overflow: hidden; mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
.fws-logo-track {
  display: flex;
  gap: 2.5rem;
  width: max-content;
  align-items: center;
  animation: fws-logo-scroll linear infinite;
}
.fws-logo[data-speed="slow"] .fws-logo-track { animation-duration: 60s; }
.fws-logo[data-speed="normal"] .fws-logo-track { animation-duration: 35s; }
.fws-logo[data-speed="fast"] .fws-logo-track { animation-duration: 18s; }
.fws-logo[data-grayscale="1"] .fws-logo-track img { filter: grayscale(100%); opacity: .75; transition: filter .25s, opacity .25s; }
.fws-logo[data-grayscale="1"] .fws-logo-track img:hover { filter: none; opacity: 1; }
.fws-logo-track img { display: block; width: auto; }

@keyframes fws-logo-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .fws-logo-track { animation: none; }
  .fws-track { transition: none; }
}

/* Editor-only preview helpers — kept terse. */
.fws-placeholder {
  display: block;
  padding: 1.25rem 1rem;
  border: 1px dashed currentColor;
  border-radius: .5rem;
  font-size: .875rem;
  opacity: .7;
  text-align: center;
}
`, Ns = `// Vanilla JS runtime for the flexweg-sliders plugin. Inlined by the
// page.body.end filter as a single <script> tag on every page that
// uses at least one slider block. No dependencies, no framework — just
// querySelectorAll + addEventListener + a CSS transform on the track.
//
// Sliders to initialize:
//   - [data-cms-slider="image"]  → fade or slide carousel with controls
//   - [data-cms-slider="hero"]   → same logic as image, full-bleed
//   - [data-cms-slider="card"]   → multi-slide-per-view carousel
//   - [data-cms-slider="logo"]   → infinite CSS marquee (no JS state)
//
// Each slider container exposes its config through data-* attrs:
//   data-autoplay="1" data-interval="5000" data-loop="1"

(function () {
  if (typeof document === "undefined") return;
  if (window.__flexwegSlidersReady) return;
  window.__flexwegSlidersReady = true;

  // Helpers — short names chosen to avoid the dollar-sign identifier.
  // String.prototype.replace in older versions of the admin's render
  // pipeline treats certain dollar-sign sequences in replacement
  // strings as special escapes, so plugin-injected JS that uses such
  // sequences (in identifiers OR comments) can be silently rewritten.
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function attrBool(el, name) { var v = el.getAttribute(name); return v === "1" || v === "true"; }
  function attrInt(el, name, fallback) { var n = parseInt(el.getAttribute(name) || "", 10); return isNaN(n) ? fallback : n; }

  function initCarousel(root) {
    var track = q(".fws-track", root);
    if (!track) return;
    var slides = qa(".fws-slide", track);
    if (slides.length === 0) return;

    var perView = Math.max(1, attrInt(root, "data-per-view", 1));
    var loop = attrBool(root, "data-loop");
    var autoplay = attrBool(root, "data-autoplay");
    var interval = Math.max(1500, attrInt(root, "data-interval", 5000));
    var maxIndex = Math.max(0, slides.length - perView);
    var index = 0;
    var timer = null;
    var isPointerDown = false;
    var startX = 0;
    var deltaX = 0;

    var dotsHost = q(".fws-dots", root);
    var dots = dotsHost ? qa("button", dotsHost) : [];
    var prevBtn = q(".fws-prev", root);
    var nextBtn = q(".fws-next", root);

    function clamp(i) {
      if (loop) {
        if (i < 0) return maxIndex;
        if (i > maxIndex) return 0;
        return i;
      }
      return Math.max(0, Math.min(maxIndex, i));
    }

    function apply() {
      var pct = (100 / perView) * index;
      track.style.transform = "translate3d(-" + pct + "%, 0, 0)";
      slides.forEach(function (s, i) {
        var active = i >= index && i < index + perView;
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        if (i === index) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      if (prevBtn) prevBtn.disabled = !loop && index <= 0;
      if (nextBtn) nextBtn.disabled = !loop && index >= maxIndex;
    }

    function go(i) {
      index = clamp(i);
      apply();
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    if (prevBtn) prevBtn.addEventListener("click", function () { stopAuto(); prev(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stopAuto(); next(); });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { stopAuto(); go(i); });
    });

    // Keyboard: left/right arrows when slider focused.
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") { stopAuto(); prev(); ev.preventDefault(); }
      else if (ev.key === "ArrowRight") { stopAuto(); next(); ev.preventDefault(); }
    });

    // Swipe (pointer events — covers touch + mouse drag).
    track.addEventListener("pointerdown", function (ev) {
      isPointerDown = true;
      startX = ev.clientX;
      deltaX = 0;
      track.style.transition = "none";
      try { track.setPointerCapture(ev.pointerId); } catch (_e) {}
    });
    track.addEventListener("pointermove", function (ev) {
      if (!isPointerDown) return;
      deltaX = ev.clientX - startX;
      var w = track.getBoundingClientRect().width || 1;
      var pct = (100 / perView) * index;
      var dragPct = (deltaX / w) * 100;
      track.style.transform = "translate3d(calc(-" + pct + "% + " + dragPct + "px), 0, 0)";
    });
    function endDrag() {
      if (!isPointerDown) return;
      isPointerDown = false;
      track.style.transition = "";
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) next(); else prev();
      } else {
        apply();
      }
      deltaX = 0;
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    function startAuto() {
      if (!autoplay || slides.length <= perView) return;
      stopAuto();
      timer = window.setInterval(next, interval);
    }
    function stopAuto() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);

    // Pause autoplay when offscreen to save CPU + battery.
    if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startAuto(); else stopAuto();
        });
      }, { threshold: 0.25 });
      io.observe(root);
    } else {
      startAuto();
    }

    apply();
  }

  function initLogo(root) {
    // Logo carousel uses CSS animation; JS only duplicates the track
    // contents once so the marquee loops seamlessly. Skip if already
    // duplicated (idempotent across re-inits).
    if (root.getAttribute("data-fws-init") === "1") return;
    var track = q(".fws-logo-track", root);
    if (!track) return;
    var html = track.innerHTML;
    track.innerHTML = html + html;
    root.setAttribute("data-fws-init", "1");
  }

  function initAll() {
    qa("[data-cms-slider]").forEach(function (root) {
      var kind = root.getAttribute("data-cms-slider");
      if (kind === "logo") initLogo(root);
      else initCarousel(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
`, Os = `<style data-flexweg-sliders>${nr}</style>`, Ts = `<script data-flexweg-sliders>${Ns}<\/script>`;
function Rs() {
  if (typeof document > "u" || document.querySelector("style[data-flexweg-sliders-admin]")) return;
  const r = document.createElement("style");
  r.setAttribute("data-flexweg-sliders-admin", "true"), r.textContent = nr, document.head.appendChild(r);
}
let We = !1;
function zs(r, e) {
  const t = r.match(
    new RegExp(`${e}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`)
  );
  return t ? t[1] ?? t[2] ?? t[3] ?? "" : "";
}
const Bs = /<div\s+([^>]*data-cms-block="flexweg-sliders\/(\w+)"[^>]*)>\s*<\/div>/g;
function Ds(r) {
  return We = !1, r.replace(Bs, (e, t, n) => {
    const i = Ge[n];
    if (!i) return "";
    const o = zs(t, "data-attrs"), s = Zn(o, i.defaults), l = i.renderHtml(s);
    return l && (We = !0), l;
  });
}
function Ls() {
  return We ? Os : "";
}
function Ps() {
  return We ? Ts : "";
}
tr.map((r) => r.id);
const Ze = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
function $s() {
  return /* @__PURE__ */ k("svg", { ...Ze, children: [
    /* @__PURE__ */ m("rect", { x: "3", y: "6", width: "14", height: "12", rx: "1.5" }),
    /* @__PURE__ */ m("rect", { x: "7", y: "3", width: "14", height: "12", rx: "1.5", opacity: ".5" }),
    /* @__PURE__ */ m("circle", { cx: "10", cy: "10", r: "1.5" })
  ] });
}
function Fs() {
  return /* @__PURE__ */ k("svg", { ...Ze, children: [
    /* @__PURE__ */ m("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
    /* @__PURE__ */ m("path", { d: "M7 11h8" }),
    /* @__PURE__ */ m("path", { d: "M7 14h5" }),
    /* @__PURE__ */ m("circle", { cx: "18", cy: "17", r: "1", fill: "currentColor" }),
    /* @__PURE__ */ m("circle", { cx: "14", cy: "17", r: "1" })
  ] });
}
function js() {
  return /* @__PURE__ */ k("svg", { ...Ze, children: [
    /* @__PURE__ */ m("rect", { x: "2", y: "6", width: "6", height: "12", rx: "1.25" }),
    /* @__PURE__ */ m("rect", { x: "9", y: "6", width: "6", height: "12", rx: "1.25" }),
    /* @__PURE__ */ m("rect", { x: "16", y: "6", width: "6", height: "12", rx: "1.25", opacity: ".5" })
  ] });
}
function Js() {
  return /* @__PURE__ */ k("svg", { ...Ze, children: [
    /* @__PURE__ */ m("circle", { cx: "5", cy: "12", r: "2" }),
    /* @__PURE__ */ m("circle", { cx: "12", cy: "12", r: "2" }),
    /* @__PURE__ */ m("circle", { cx: "19", cy: "12", r: "2" }),
    /* @__PURE__ */ m("path", { d: "M1 12h2M22 12h2", opacity: ".5" })
  ] });
}
const en = "flexweg-sliders";
Rs();
const Vs = {
  image: $s,
  hero: Fs,
  card: js,
  logo: Js
}, Ks = {
  id: en,
  name: "Flexweg Sliders",
  version: "1.0.2",
  author: "Flexweg",
  description: "Four slider blocks (image, hero, cards, logo carousel) for the post/page editor. Self-contained: bundles its own vanilla-JS carousel runtime and CSS, injected per-page only when at least one slider is used.",
  i18n: { en: he, fr: hr, de: pr, es: mr, nl: gr, pt: wr, ko: yr },
  register(r) {
    for (const e of tr) {
      const t = xs(e), n = Vs[e.kind];
      r.registerBlock({
        id: e.id,
        nodeName: ve(e.kind),
        titleKey: `blocks.${e.kind}.title`,
        namespace: en,
        icon: n,
        category: "media",
        extensions: [t],
        // Insert an empty slider; the user adds slides via the
        // Block-tab Inspector. We don't bootstrap with a placeholder
        // slide because an empty slider renders nothing and avoids
        // dangling images from default URLs.
        insert: (i) => {
          i.focus().insertContent({ type: ve(e.kind), attrs: { attrs: e.defaults } }).run();
        },
        isActive: (i) => i.isActive(ve(e.kind)),
        // The EditorInspector's auto-attrs plumbing is bypassed —
        // SliderInspector reads attrs itself off the editor on every
        // render so it picks up updates from other paths (e.g.
        // undo/redo) live.
        inspector: ({ editor: i }) => /* @__PURE__ */ m(vs, { editor: i, kind: e.kind })
      });
    }
    r.addFilter("post.html.body", (e) => Ds(e)), r.addFilter("page.head.extra", (e) => {
      const t = Ls();
      return t ? [e, t].filter(Boolean).join(`
`) : e;
    }), r.addFilter("page.body.end", (e) => {
      const t = Ps();
      return t ? [e, t].filter(Boolean).join(`
`) : e;
    });
  }
};
export {
  Ge as SLIDERS,
  Ks as default
};
