import '@astrojs/internal-helpers/path';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, e as createAstro, f as createComponent, g as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderComponent, u as unescapeHTML, F as Fragment, j as renderHead, k as renderSlot } from '../astro_6Rlbwsvc.mjs';
import 'kleur/colors';
import 'clsx';
import { i as isESMImportedImage, a as isLocalService, b as isRemoteImage, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_9CNLbsw4.mjs';
import camelcase from 'camelcase';
/* empty css                           */

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_9CNLbsw4.mjs'
    ).then(n => n.s).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: typeof options.src === "object" && "then" in options.src ? (await options.src).default ?? await options.src : options.src
  };
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash);
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$n = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "/Users/nils/Sites/changeazy.com/node_modules/astro/components/Image.astro", void 0);

const $$Astro$m = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({ ...props, format, widths: props.widths, densities: props.densities })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(props.src) && specialFormatsFallback.includes(props.src.format)) {
    resultFallbackFormat = props.src.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionaAttributes = {};
  if (props.sizes) {
    sourceAdditionaAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionaAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "/Users/nils/Sites/changeazy.com/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					new URL("file:///Users/nils/Sites/changeazy.com/dist/");
					const getImage = async (options) => await getImage$1(options, imageConfig);

const { storyblokApi } = storyblokInit({
            accessToken: "tW4t8Y1eMGt0D4DQD8wpvQtt",
            use: [apiPlugin],
            apiOptions: {"region":"eu"},
          });
          const storyblokApiInstance = storyblokApi;

globalThis.storyblokApiInstance = storyblokApiInstance;

var P = Object.defineProperty, _ = (r, t, e) => t in r ? P(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, p = (r, t, e) => (_(r, typeof t != "symbol" ? t + "" : t, e), e);
class z {
  constructor() {
    p(this, "isCDNUrl", (t = "") => t.indexOf("/cdn/") > -1), p(this, "getOptionsPage", (t, e = 25, o = 1) => ({
      ...t,
      per_page: e,
      page: o
    })), p(this, "delay", (t) => new Promise((e) => setTimeout(e, t))), p(this, "arrayFrom", (t = 0, e) => [...Array(t)].map(e)), p(this, "range", (t = 0, e = t) => {
      const o = Math.abs(e - t) || 0, s = t < e ? 1 : -1;
      return this.arrayFrom(o, (a, n) => n * s + t);
    }), p(this, "asyncMap", async (t, e) => Promise.all(t.map(e))), p(this, "flatMap", (t = [], e) => t.map(e).reduce((o, s) => [...o, ...s], [])), p(this, "escapeHTML", function(t) {
      const e = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, o = /[&<>"']/g, s = RegExp(o.source);
      return t && s.test(t) ? t.replace(o, (a) => e[a]) : t;
    });
  }
  /**
   * @method stringify
   * @param  {Object} params
   * @param  {String} prefix
   * @param  {Boolean} isArray
   * @return {String} Stringified object
   */
  stringify(t, e, o) {
    const s = [];
    for (const a in t) {
      if (!Object.prototype.hasOwnProperty.call(t, a))
        continue;
      const n = t[a], c = o ? "" : encodeURIComponent(a);
      let l;
      typeof n == "object" ? l = this.stringify(
        n,
        e ? e + encodeURIComponent("[" + c + "]") : c,
        Array.isArray(n)
      ) : l = (e ? e + encodeURIComponent("[" + c + "]") : c) + "=" + encodeURIComponent(n), s.push(l);
    }
    return s.join("&");
  }
  /**
   * @method getRegionURL
   * @param  {String} regionCode region code, could be eu, us, cn, ap or ca
   * @return {String} The base URL of the region
   */
  getRegionURL(t) {
    const e = "api.storyblok.com", o = "api-us.storyblok.com", s = "app.storyblokchina.cn", a = "api-ap.storyblok.com", n = "api-ca.storyblok.com";
    switch (t) {
      case "us":
        return o;
      case "cn":
        return s;
      case "ap":
        return a;
      case "ca":
        return n;
      default:
        return e;
    }
  }
}
const U = function(r, t) {
  const e = {};
  for (const o in r) {
    const s = r[o];
    t.indexOf(o) > -1 && s !== null && (e[o] = s);
  }
  return e;
}, D = (r) => r === "email", B = () => ({
  singleTag: "hr"
}), q = () => ({
  tag: "blockquote"
}), F = () => ({
  tag: "ul"
}), J = (r) => ({
  tag: [
    "pre",
    {
      tag: "code",
      attrs: r.attrs
    }
  ]
}), K = () => ({
  singleTag: "br"
}), V = (r) => ({
  tag: `h${r.attrs.level}`
}), H = (r) => ({
  singleTag: [
    {
      tag: "img",
      attrs: U(r.attrs, ["src", "alt", "title"])
    }
  ]
}), G = () => ({
  tag: "li"
}), W = () => ({
  tag: "ol"
}), Y = () => ({
  tag: "p"
}), Q = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        "data-type": "emoji",
        "data-name": r.attrs.name,
        emoji: r.attrs.emoji
      }
    }
  ]
}), X = () => ({
  tag: "b"
}), Z = () => ({
  tag: "s"
}), ee = () => ({
  tag: "u"
}), te = () => ({
  tag: "strong"
}), re = () => ({
  tag: "code"
}), oe = () => ({
  tag: "i"
}), se = (r) => {
  if (!r.attrs)
    return {
      tag: ""
    };
  const t = new z().escapeHTML, e = { ...r.attrs }, { linktype: o = "url" } = r.attrs;
  if (delete e.linktype, e.href && (e.href = t(r.attrs.href || "")), D(o) && (e.href = `mailto:${e.href}`), e.anchor && (e.href = `${e.href}#${e.anchor}`, delete e.anchor), e.custom) {
    for (const s in e.custom)
      e[s] = e.custom[s];
    delete e.custom;
  }
  return {
    tag: [
      {
        tag: "a",
        attrs: e
      }
    ]
  };
}, ae = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: r.attrs
    }
  ]
}), ne = () => ({
  tag: "sub"
}), le = () => ({
  tag: "sup"
}), ie = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: r.attrs
    }
  ]
}), ce = (r) => {
  var t;
  return (t = r.attrs) != null && t.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `background-color:${r.attrs.color};`
        }
      }
    ]
  } : {
    tag: ""
  };
}, ge = (r) => {
  var t;
  return (t = r.attrs) != null && t.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `color:${r.attrs.color}`
        }
      }
    ]
  } : {
    tag: ""
  };
}, ue = {
  nodes: {
    horizontal_rule: B,
    blockquote: q,
    bullet_list: F,
    code_block: J,
    hard_break: K,
    heading: V,
    image: H,
    list_item: G,
    ordered_list: W,
    paragraph: Y,
    emoji: Q
  },
  marks: {
    bold: X,
    strike: Z,
    underline: ee,
    strong: te,
    code: re,
    italic: oe,
    link: se,
    styled: ae,
    subscript: ne,
    superscript: le,
    anchor: ie,
    highlight: ce,
    textStyle: ge
  }
}, pe = function(r) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, e = /[&<>"']/g, o = RegExp(e.source);
  return r && o.test(r) ? r.replace(e, (s) => t[s]) : r;
};
class fe {
  constructor(t) {
    p(this, "marks"), p(this, "nodes"), t || (t = ue), this.marks = t.marks || [], this.nodes = t.nodes || [];
  }
  addNode(t, e) {
    this.nodes[t] = e;
  }
  addMark(t, e) {
    this.marks[t] = e;
  }
  render(t, e = { optimizeImages: !1 }) {
    if (t && t.content && Array.isArray(t.content)) {
      let o = "";
      return t.content.forEach((s) => {
        o += this.renderNode(s);
      }), e.optimizeImages ? this.optimizeImages(o, e.optimizeImages) : o;
    }
    return console.warn(
      `The render method must receive an Object with a "content" field.
			The "content" field must be an array of nodes as the type ISbRichtext.
			ISbRichtext:
				content?: ISbRichtext[]
				marks?: ISbRichtext[]
				attrs?: any
				text?: string
				type: string
				
				Example:
				{
					content: [
						{
							content: [
								{
									text: 'Hello World',
									type: 'text'
								}
							],
							type: 'paragraph'
						}
					],
					type: 'doc'
				}`
    ), "";
  }
  optimizeImages(t, e) {
    let o = 0, s = 0, a = "", n = "";
    typeof e != "boolean" && (typeof e.width == "number" && e.width > 0 && (a += `width="${e.width}" `, o = e.width), typeof e.height == "number" && e.height > 0 && (a += `height="${e.height}" `, s = e.height), (e.loading === "lazy" || e.loading === "eager") && (a += `loading="${e.loading}" `), typeof e.class == "string" && e.class.length > 0 && (a += `class="${e.class}" `), e.filters && (typeof e.filters.blur == "number" && e.filters.blur >= 0 && e.filters.blur <= 100 && (n += `:blur(${e.filters.blur})`), typeof e.filters.brightness == "number" && e.filters.brightness >= -100 && e.filters.brightness <= 100 && (n += `:brightness(${e.filters.brightness})`), e.filters.fill && (e.filters.fill.match(/[0-9A-Fa-f]{6}/g) || e.filters.fill === "transparent") && (n += `:fill(${e.filters.fill})`), e.filters.format && ["webp", "png", "jpeg"].includes(e.filters.format) && (n += `:format(${e.filters.format})`), typeof e.filters.grayscale == "boolean" && e.filters.grayscale && (n += ":grayscale()"), typeof e.filters.quality == "number" && e.filters.quality >= 0 && e.filters.quality <= 100 && (n += `:quality(${e.filters.quality})`), e.filters.rotate && [90, 180, 270].includes(e.filters.rotate) && (n += `:rotate(${e.filters.rotate})`), n.length > 0 && (n = "/filters" + n))), a.length > 0 && (t = t.replace(/<img/g, `<img ${a.trim()}`));
    const c = o > 0 || s > 0 || n.length > 0 ? `${o}x${s}${n}` : "";
    return t = t.replace(
      /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g,
      `a.storyblok.com/f/$1/$2.$3/m/${c}`
    ), typeof e != "boolean" && (e.sizes || e.srcset) && (t = t.replace(/<img.*?src=["|'](.*?)["|']/g, (l) => {
      var i, g;
      const f = l.match(
        /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g
      );
      if (f && f.length > 0) {
        const d = {
          srcset: (i = e.srcset) == null ? void 0 : i.map((u) => {
            if (typeof u == "number")
              return `//${f}/m/${u}x0${n} ${u}w`;
            if (typeof u == "object" && u.length === 2) {
              let b = 0, y = 0;
              return typeof u[0] == "number" && (b = u[0]), typeof u[1] == "number" && (y = u[1]), `//${f}/m/${b}x${y}${n} ${b}w`;
            }
          }).join(", "),
          sizes: (g = e.sizes) == null ? void 0 : g.map((u) => u).join(", ")
        };
        let h = "";
        return d.srcset && (h += `srcset="${d.srcset}" `), d.sizes && (h += `sizes="${d.sizes}" `), l.replace(/<img/g, `<img ${h.trim()}`);
      }
      return l;
    })), t;
  }
  renderNode(t) {
    const e = [];
    t.marks && t.marks.forEach((s) => {
      const a = this.getMatchingMark(s);
      a && a.tag !== "" && e.push(this.renderOpeningTag(a.tag));
    });
    const o = this.getMatchingNode(t);
    return o && o.tag && e.push(this.renderOpeningTag(o.tag)), t.content ? t.content.forEach((s) => {
      e.push(this.renderNode(s));
    }) : t.text ? e.push(pe(t.text)) : o && o.singleTag ? e.push(this.renderTag(o.singleTag, " /")) : o && o.html ? e.push(o.html) : t.type === "emoji" && e.push(this.renderEmoji(t)), o && o.tag && e.push(this.renderClosingTag(o.tag)), t.marks && t.marks.slice(0).reverse().forEach((s) => {
      const a = this.getMatchingMark(s);
      a && a.tag !== "" && e.push(this.renderClosingTag(a.tag));
    }), e.join("");
  }
  renderTag(t, e) {
    return t.constructor === String ? `<${t}${e}>` : t.map((o) => {
      if (o.constructor === String)
        return `<${o}${e}>`;
      {
        let s = `<${o.tag}`;
        if (o.attrs)
          for (const a in o.attrs) {
            const n = o.attrs[a];
            n !== null && (s += ` ${a}="${n}"`);
          }
        return `${s}${e}>`;
      }
    }).join("");
  }
  renderOpeningTag(t) {
    return this.renderTag(t, "");
  }
  renderClosingTag(t) {
    return t.constructor === String ? `</${t}>` : t.slice(0).reverse().map((e) => e.constructor === String ? `</${e}>` : `</${e.tag}>`).join("");
  }
  getMatchingNode(t) {
    const e = this.nodes[t.type];
    if (typeof e == "function")
      return e(t);
  }
  getMatchingMark(t) {
    const e = this.marks[t.type];
    if (typeof e == "function")
      return e(t);
  }
  renderEmoji(t) {
    if (t.attrs.emoji)
      return t.attrs.emoji;
    const e = [
      {
        tag: "img",
        attrs: {
          src: t.attrs.fallbackImage,
          draggable: "false",
          loading: "lazy",
          align: "absmiddle"
        }
      }
    ];
    return this.renderTag(e, " /");
  }
}
const ke = (r) => {
  if (typeof r != "object" || typeof r._editable > "u")
    return {};
  const t = JSON.parse(
    r._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
  );
  return t ? {
    "data-blok-c": JSON.stringify(t),
    "data-blok-uid": t.id + "-" + t.uid
  } : {};
};
let de;
const be = (r, t) => {
  r.addNode("blok", (e) => {
    let o = "";
    return e.attrs.body.forEach((s) => {
      o += t(s.component, s);
    }), {
      html: o
    };
  });
}, me = (r) => !r || !(r != null && r.content.some((t) => t.content || t.type === "blok" || t.type === "horizontal_rule")), ye = (r, t, e) => {
  let o = e || de;
  if (!o) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return me(r) ? "" : (t && (o = new fe(t.schema), t.resolver && be(o, t.resolver)), o.render(r));
};
function ve() {
  return globalThis.storyblokApiInstance || console.error("storyblokApiInstance has not been initialized correctly"), globalThis.storyblokApiInstance;
}
function Ie(r, t) {
  const e = globalThis.storyblokApiInstance.richTextResolver;
  if (!e) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return ye(r, t, e);
}

const $$Astro$l = createAstro();
const $$Page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Page;
  const { language, blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<main${spreadAttributes(ke(blok))}> ${blok.body?.map((blok2) => {
    return renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "language": language, "blok": blok2 })}`;
  })} </main>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Page.astro", void 0);

const $$Astro$k = createAstro();
const $$Config = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$Config;
  return renderTemplate`${maybeRenderHead()}<div></div>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Config.astro", void 0);

const $$Astro$j = createAstro();
const $$Feature = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Feature;
  const { blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${spreadAttributes(ke(blok))} class="w-full bg-[#f7f6fd] rounded-[5px] text-center overflow-hidden"> <img${addAttribute(blok.image.filename, "src")}${addAttribute(blok.image.alt, "alt")} class="w-full h-48 xl:h-72 object-cover"> <div class="px-12 py-6"> <h3 class="text-2xl text-[#1d243d] font-bold"> ${blok.name} </h3> </div> </div>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Feature.astro", void 0);

const $$Astro$i = createAstro();
const $$Grid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Grid;
  const { blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${spreadAttributes(ke(blok))}> <div class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-center"> ${blok.columns?.map((blok2) => {
    return renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": blok2 })}`;
  })} </div> </div>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Grid.astro", void 0);

const $$Astro$h = createAstro();
const $$Teaser = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Teaser;
  const { blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${spreadAttributes(ke(blok))}> <h3 class="py-32 text-6xl text-[#50b0ae] font-bold text-center"> ${blok.headline} </h3> </div>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Teaser.astro", void 0);

const $$Astro$g = createAstro();
const $$RichTextRenderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$RichTextRenderer;
  const { richTextData, richTextOptions } = Astro2.props;
  return renderTemplate`${richTextData?.content?.map((richTextNode) => {
    if (richTextNode.type === "blok") {
      return richTextNode.attrs.body.map((blok) => renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": blok })}`);
    } else {
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Ie(
        { type: richTextNode.type, content: [richTextNode] },
        richTextOptions
      ))}` })}`;
    }
  })}`;
}, "/Users/nils/Sites/changeazy.com/node_modules/@storyblok/astro/components/RichTextRenderer.astro", void 0);

const $$Astro$f = createAstro();
const $$TextBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$TextBlock;
  const { blok } = Astro2.props;
  Ie(blok.content);
  return renderTemplate`${maybeRenderHead()}<div${spreadAttributes(ke(blok))} class="content-container contentpage"> ${renderComponent($$result, "RichTextRenderer", $$RichTextRenderer, { "richTextData": blok.content })} <!--<div class="prose" set:html={renderedRichText} />--> <!--<RichTextRenderer content={renderedRichText} {...storyblokEditable(blok)} />--> <!--<RichTextRenderer
    content={blok.content} {...storyblokEditable(blok)}
    resolver={(blok) => {
      return {
        component: StoryblokComponent,
        props: { blok },
      };
    }}
  />--> </div>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/TextBlock.astro", void 0);

const $$Astro$e = createAstro();
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Hero;
  const { blok } = Astro2.props;
  let dynamicHeroClass = blok.layout === "constrained" ? "container mx-auto" : "";
  return renderTemplate`${maybeRenderHead()}<section id="hero"${spreadAttributes(ke(blok))}${addAttribute(`${dynamicHeroClass} section`, "class")}> <div class="mdl-hero"> <div class="motto"> <p>change your focus</p> <p>change your life </p> <p>ChangeEazy !</p> </div> <img${addAttribute(blok.background_image.filename, "src")}${addAttribute(blok.background_image.alt, "alt")} class="mdl-hero__picture" width="1117" height="746" decoding="async"> </div> <div class="grid"> <div class="column"> <h2>Empowering People</h2> <p>Make yourself your priority and invest in your development, health and happiness !</p> <p>Investing in yourself is helping you to create the life you want. In any area of your life, coaching sessions,
        workshops and trainings will provide you insight, confidence and practical tools to lead a more fulfilling,
        balanced and successful life.</p></div> <div class="column"> <h2>Mission</h2> <p>Niki's mission is to support and enable individuals and teams in maximising their potential, reaching their
        goals, and enjoying a balanced, healthy and successful life – aligned with one’s values.</p> <p>You learn to improve your life, raise your standards and lead a happy, successful and fulfilling life. You will
        maximise your potentials and you learn to see opportunities, act on them and turn them into stepping stones to
        reach your goals.</p> </div> </div> </section> <!--
<div
  {...storyblokEditable(blok)}
  class={\`\${dynamicHeroClass} min-h-[500px] relative flex items-end justify-center my-6 rounded-[5px] overflow-hidden\`}
>
  <div
    class="relative z-10 w-full text-center bg-gradient-to-t from-black/70 via-black/50 to-transparent py-6"
  >
    <h1 class="text-6xl text-white font-bold mb-3">
      {blok.headline}
    </h1>
    <h2 class="text-4xl text-white font-light">
      {blok.subheadline}
    </h2>
  </div>
  <img
    src={blok.background_image.filename}
    alt={blok.background_image.alt}
    class="absolute top-0 left-0 z-0 w-full h-full object-cover"
  />
</div>-->`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Hero.astro", void 0);

const $$Astro$d = createAstro();
const $$Coaching = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Coaching;
  const { blok } = Astro2.props;
  return renderTemplate`<!-- coaching -->${maybeRenderHead()}<section id="coaching"${spreadAttributes(ke(blok))}> <div class="content-container"> <h1>Coaching</h1> <p>Coaching is a great way to facilitate changes and during the process you find ways to develop and create the life you want.<br>
Through the process of coaching combined with Patterns of Physical Transformation techniques Niki is creating a strong awareness of the neurological functions. It results in a deeper awareness in a persons body and mind. A fast and effective way to change muscular tension and more comfort.</p> <p>Niki is dedicated to provide a safe and supportive environment to learn, grow and make changes in your life.</p> <a href="coaching" class="btn">Read More about Coaching</a> </div> <div class="call-out"> <div class="content-container"> <h2>When you are ready to take the next step in your career, in your relationship or any other areas of your life</h2> <ul> <li>to leave old habits behind</li> <li>to deal with stress and burn out</li> <li>to be more confident, more successful</li> <li>to stay true to yourself</li> <li>to live healthy</li> <li>to find your passion and reach your goals</li> <li>to take the lead and live a balanced, happy and fulfilling life</li> </ul> </div> <a href="tel:+31653885727" class="btn">Contact for a free intake call</a> </div> </section>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Coaching.astro", void 0);

const coachme600 = new Proxy({"src":"/_astro/coachme-600x600.kSlu5MR8.jpg","width":600,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const flyer600 = new Proxy({"src":"/_astro/1.square-flyer-600x600.Q78EyvnU.jpg","width":600,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const office600 = new Proxy({"src":"/_astro/1.office-600x600.-M0sQRP2.jpg","width":600,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const perry1_600 = new Proxy({"src":"/_astro/1.perry-600x600.wzg4hwgb.jpg","width":600,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const $$Astro$c = createAstro();
const $$Training = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Training;
  const { blok } = Astro2.props;
  return renderTemplate`<!-- trainings -->${maybeRenderHead()}<section id="trainings"${spreadAttributes(ke(blok))}> <div class="content-container"> <h1>Trainings &amp; Workshops</h1> <p>ChangeEazy is offering various group workshops and customised trainings also on request.</p> <p>All offline and online trainings and workshops are practical, interactive to give you the opportunity to practice
      your new tools and techniques that will support you on your journey to success.</p> <ul class="showcase grid gutter-1"> <li class="showcase-item column"> <a href="/trainings/personal" class="showcase-link wiggle-me"> ${renderComponent($$result, "Picture", $$Picture, { "src": coachme600, "formats": ["avif", "webp"], "alt": "Thumbnail for I coach ME", "pictureAttributes": { class: "showcase-image" } })} </a> </li> <li class="showcase-item column"> <a href="/trainings/manager" class="showcase-link wiggle-me"> ${renderComponent($$result, "Picture", $$Picture, { "src": flyer600, "formats": ["avif", "webp"], "alt": "Thumbnail for Stress management", "pictureAttributes": { class: "showcase-image" } })} </a> </li> <li class="showcase-item column"> <a href="/trainings/performance" class="showcase-link wiggle-me"> ${renderComponent($$result, "Picture", $$Picture, { "src": office600, "formats": ["avif", "webp"], "alt": "Thumbnail for Effective communication skills", "pictureAttributes": { class: "showcase-image" } })} </a> </li> <li class="showcase-item column"> <a href="/trainings/culture" class="showcase-link wiggle-me"> ${renderComponent($$result, "Picture", $$Picture, { "src": perry1_600, "formats": ["avif", "webp"], "alt": "Thumbnail for Physical Transformation, The Perry Method", "pictureAttributes": { class: "showcase-image" } })} </a> </li> </ul> <a href="/trainings/index" class="btn btn-center">Read More about Trainings</a> </div> </section>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Training.astro", void 0);

const legwork = new Proxy({"src":"/_astro/legwork.cDAaBBKZ.jpg","width":512,"height":682,"format":"jpg","orientation":1}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const $$Astro$b = createAstro();
const $$Bodywork = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Bodywork;
  const { blok } = Astro2.props;
  return renderTemplate`<!-- bodywork -->${maybeRenderHead()}<section id="bodywork"${spreadAttributes(ke(blok))}> <div class="grid"> <div class="column"> <h2>Bodywork</h2> <p>In the domain of Trans-formational bodywork through mindful movement, The Perry Method (Patterns of Physical
        Transformation) is elegance at its finest. It is the best of: Feldenkrais, NLP and Functional neurology…
        synthesised.</p> <p><a href="/bodywork" class="btn">Read More about Bodywork</a></p></div> <div class="column"> <figure> ${renderComponent($$result, "Picture", $$Picture, { "src": legwork, "formats": ["avif", "webp"], "alt": "legwork", "pictureAttributes": { class: "" } })} </figure> </div> </div> </section>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Bodywork.astro", void 0);

const wimper = new Proxy({"src":"/_astro/wimper.B_NmbMn6.jpg","width":637,"height":1130,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const $$Astro$a = createAstro();
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$About;
  const { blok } = Astro2.props;
  return renderTemplate`<!-- about -->${maybeRenderHead()}<section id="about"${spreadAttributes(ke(blok))}> <div class="grid"> <div class="column"> <figure> ${renderComponent($$result, "Picture", $$Picture, { "src": wimper, "formats": ["avif", "webp"], "alt": "niki fekete", "pictureAttributes": { class: "" } })} </figure> </div> <div class="column"> <h1>About</h1> <p>Niki is a dedicated trainer, coach and <em>Patterns of Physical Transformation</em> practitioner with an
        extensive international leadership and sales background.</p> <p>Niki's mission is to support and enable individuals and teams in maximising their potential, reaching their
        goals, and enjoying a balanced, healthy and successful life – aligned with one’s values.</p> <p>You learn to improve your life, raise your standards and lead a happy, successful and fulfilling life. You will
        maximise your potentials and you learn to see opportunities, act on them and turn them into stepping stones to
        reach your goals.</p> <p><a href="/about" class="btn">Read More about me</a></p></div> </div> </section>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/About.astro", void 0);

const $$Astro$9 = createAstro();
const $$Testimonials = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Testimonials;
  const { blok } = Astro2.props;
  return renderTemplate`<!-- testimonials -->${maybeRenderHead()}<section id="testimonials"${spreadAttributes(ke(blok))}> <div class="content-container"> <h1>Testimonials</h1> <blockquote> <p>Niki is a professional coach and bodywork practitioner. Her extensive experience and knowledge enable her to
        coach clients holistically. She is truly an inspiration as she studies in continuation to develop herself and
        offer even more effective sessions. It is an honor to collaborate with her on future training and retreats.</p> </blockquote> <p class="cite">D. Preszeller, Italy</p> <a href="/testimonials" class="btn btn-center">See All</a> </div> </section>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Testimonials.astro", void 0);

const $$Astro$8 = createAstro();
const $$Showcase = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Showcase;
  const { blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<ul class="showcase grid gutter-1"${spreadAttributes(ke(blok))}> <li class="showcase-item column"> <a href="/trainings/personal" class="showcase-link wiggle-me"> <img src="/assets/images/coachme-600x600.jpg" alt="Thumbnail for I coach ME" class="showcase-image" width="600" height="600"> </a> </li> <li class="showcase-item column"> <a href="/trainings/manager" class="showcase-link wiggle-me"> <img src="/assets/images/1.square-flyer.jpg" alt="Thumbnail for Stress management" class="showcase-image" width="1000" height="1000"> </a> </li> <li class="showcase-item column"> <a href="/trainings/performance" class="showcase-link wiggle-me"> <img src="/assets/images/1.office-600x600.jpg" alt="Thumbnail for Effective communication skills" class="showcase-image" width="600" height="600"> </a> </li> <li class="showcase-item column"> <a href="/trainings/culture" class="showcase-link wiggle-me"> <img src="/assets/images/1.perry-600x600.jpg" alt="Thumbnail for Physical Transformation, The Perry Method" class="showcase-image" width="600" height="600"> </a> </li> </ul>`;
}, "/Users/nils/Sites/changeazy.com/src/storyblok/Showcase.astro", void 0);

const components = {page: $$Page,config: $$Config,feature: $$Feature,grid: $$Grid,teaser: $$Teaser,textblock: $$TextBlock,hero: $$Hero,coaching: $$Coaching,training: $$Training,bodywork: $$Bodywork,about: $$About,testimonials: $$Testimonials,showcase: $$Showcase};

const $$Astro$7 = createAstro();
const $$StoryblokComponent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$StoryblokComponent;
  const { blok, ...props } = Astro2.props;
  if (!blok) {
    throw new Error(
      "Cannot render StoryblokComponent. 'blok' prop is undefined."
    );
  }
  let key = camelcase(blok.component);
  const componentFound = key in components;
  let Component;
  if (!componentFound) {
    throw new Error(
        `Component could not be found for blok "${blok.component}"! Is it defined in astro.config.mjs?`
      );
  } else {
    Component = components[key];
  }
  return renderTemplate`${renderComponent($$result, "Component", Component, { "blok": blok, ...props })}`;
}, "/Users/nils/Sites/changeazy.com/node_modules/@storyblok/astro/components/StoryblokComponent.astro", void 0);

const $$Astro$6 = createAstro();
const $$TheLogo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$TheLogo;
  return renderTemplate`${maybeRenderHead()}<svg width="201px" height="57px" viewBox="0 0 201 57" xmlns="http://www.w3.org/2000/svg"> <title>logo</title> <g id="New-About-02-sans-serif" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Desktop" transform="translate(-53.000000, -20.000000)" fill="#FE6700"> <g id="Header"> <g id="logo" transform="translate(54.000000, 21.000000)"> <path d="M75.7104599,35.2895641 C78.8042154,35.2895641 81.0400387,34.2496462 81.0400387,34.2496462 L81.1960264,34.0156647 C81.378012,32.1438126 81.8979709,29.7779996 81.8979709,29.7779996 L80.6500695,29.8819914 C80.0001209,32.6897695 78.5962318,33.9896668 76.2304188,33.9896668 C72.6427023,33.9896668 70.2768892,30.9739051 70.2768892,26.3982666 C70.2768892,22.2645933 72.5127125,19.6388007 75.9964373,19.6388007 C78.5442359,19.6388007 79.8181353,20.4447371 79.8181353,22.0566097 C79.8181353,22.6285645 79.7401414,23.330509 79.7401414,23.330509 L80.9880428,23.2265173 C81.1440305,20.8347062 81.6379915,18.8848603 81.6379915,18.8848603 L81.5339997,18.7288726 C81.5339997,18.7288726 79.1681866,18.1049219 77.0103571,18.1049219 C71.7587721,18.1049219 67.9370741,21.9786159 67.9370741,27.2561988 C67.9370741,32.1698106 70.9788337,35.2895641 75.7104599,35.2895641 L75.7104599,35.2895641 Z M84.0038045,35.0295846 C84.0038045,35.0295846 85.4856875,34.9775887 86.5776012,34.9775887 C87.5395252,34.9775887 88.9434142,35.0555826 88.9434142,35.0555826 L89.1773957,33.9376709 L89.1253999,33.8336791 C89.1253999,33.8336791 88.5274471,33.885675 88.2154718,33.885675 C87.5395252,33.885675 87.2795457,33.4957058 87.2795457,32.42979 C87.2795457,30.2979585 87.3055437,28.114131 87.3575395,26.1122892 C87.7475087,25.8003139 89.2813875,24.6824022 90.6592787,24.6824022 C92.0371698,24.6824022 92.8171081,25.6703241 92.8171081,27.3861886 L92.6611205,32.5337818 C92.6611205,33.4437099 92.2451533,33.9376709 91.2052355,34.2236483 L91.1012437,35.2895641 C91.1012437,35.2895641 92.6871184,34.9775887 93.7790321,34.9775887 C94.7409561,34.9775887 96.0928493,35.0555826 96.0928493,35.0555826 L96.3008329,33.9376709 L96.248837,33.8336791 C96.248837,33.8336791 95.6508842,33.885675 95.3389089,33.885675 C94.6889602,33.885675 94.4289808,33.4437099 94.4289808,32.42979 C94.4289808,30.9219092 94.8449479,27.178205 94.8449479,26.2682769 C94.8449479,24.1364454 93.5450506,22.9145419 91.2832294,22.9145419 C90.2953074,22.9145419 87.8774985,24.6044084 87.3835375,24.9423817 C87.5135272,20.1587597 87.7475087,16.4150555 88.0074882,16.0250863 L87.8515005,15.687113 C87.8515005,15.687113 85.7976628,16.2070719 84.0038045,16.4410534 L83.8998128,17.2729877 L84.0038045,17.3509815 L84.5497614,17.3509815 C85.225708,17.3509815 85.5116854,17.7669486 85.5116854,18.7028747 L85.5116854,32.5337818 C85.5116854,33.4957058 85.1477142,33.8596771 84.1597922,33.9636688 L84.0038045,35.0295846 Z M104.490186,28.5300982 L99.576574,29.8819914 C98.7446398,30.1159729 98.1986829,30.9479071 98.1986829,31.961827 C98.1986829,33.8336791 99.602572,35.1855723 101.52642,35.1855723 C102.046379,35.1855723 103.138293,34.4056339 104.386194,33.1577325 L104.490186,33.1837305 C104.620176,34.5876195 105.400114,35.2895641 106.804003,35.2895641 C108.1039,34.847599 109.065824,33.2097284 109.065824,33.2097284 L108.701853,32.7937613 C108.701853,32.7937613 107.973911,33.4437099 107.141976,33.4437099 C106.46603,33.4437099 106.07606,33.0017448 106.07606,32.2478044 C106.07606,30.7139256 106.544023,27.2042029 106.544023,26.2682769 C106.544023,24.1624433 105.19213,22.9145419 102.930309,22.9145419 C101.812397,22.9145419 98.6926439,24.7343981 98.6926439,24.7343981 L99.0046192,25.8523098 L99.134609,25.9303036 C99.134609,25.9303036 100.564496,24.6304063 102.254362,24.6304063 C103.710247,24.6304063 104.542182,25.6443262 104.542182,27.3861886 L104.490186,28.5300982 Z M104.334198,32.1698106 C103.606256,32.8977531 102.618334,33.417712 101.968385,33.417712 C100.928467,33.417712 100.174527,32.6637716 100.174527,31.6758496 C100.174527,31.1298928 100.434506,30.7399236 100.928467,30.5839359 L104.43819,29.5180201 L104.334198,32.1698106 Z M117.59315,35.2895641 C117.59315,35.2895641 119.179025,34.9775887 120.270939,34.9775887 C121.232863,34.9775887 122.584756,35.0555826 122.584756,35.0555826 L122.79274,33.9376709 L122.740744,33.8336791 C122.740744,33.8336791 122.142791,33.885675 121.830816,33.885675 C121.180867,33.885675 120.920887,33.4437099 120.920887,32.42979 C120.920887,30.9219092 121.284859,27.178205 121.284859,26.2682769 C121.284859,24.2144392 119.906968,22.9145419 117.72314,22.9145419 C116.891206,22.9145419 114.525393,24.4744186 113.901442,24.8903858 L113.849446,24.8123919 C113.901442,23.9284618 114.135424,23.0965275 114.135424,23.0965275 L113.979436,22.888544 C113.979436,22.888544 112.133582,23.356507 110.339724,23.6424844 L110.26173,24.5004166 L110.339724,24.6044084 L110.625701,24.6044084 C111.561627,24.6044084 111.8996,25.0203755 111.8996,26.1902831 L111.8996,32.5337818 C111.8996,33.4957058 111.509631,33.9116729 110.521709,34.0676606 L110.391719,35.1335764 C110.391719,35.1335764 111.873602,34.9775887 112.965516,34.9775887 C113.92744,34.9775887 115.331329,35.0555826 115.331329,35.0555826 L115.565311,33.9376709 L115.513315,33.8336791 C115.513315,33.8336791 114.915362,33.885675 114.603387,33.885675 C113.92744,33.885675 113.667461,33.4957058 113.667461,32.42979 C113.667461,31.4158702 113.823448,27.8281536 113.901442,26.0342954 C114.421401,25.6443262 115.82529,24.6824022 117.099189,24.6824022 C118.477081,24.6824022 119.257019,25.6703241 119.257019,27.3861886 L119.153027,32.5337818 C119.153027,33.4437099 118.73706,33.9376709 117.697142,34.2236483 L117.59315,35.2895641 Z M129.786187,31.5978558 C132.671959,31.5978558 134.93378,29.570016 134.93378,26.9702214 C134.93378,26.0082974 134.569809,25.0983693 133.893862,24.3444289 L133.997854,24.2144392 C135.089768,24.1364454 136.233678,23.9804577 136.233678,23.9804577 L136.519655,22.5245727 L136.441661,22.4205809 C136.441661,22.4205809 134.17984,23.0445316 132.853945,23.2005193 C132.177998,23.2005193 131.294068,22.9145419 130.306146,22.9145419 C127.732349,22.9145419 125.470528,25.0723714 125.470528,27.5421762 C125.470528,29.076055 126.172473,30.3499544 127.394376,30.999903 L127.394376,31.1038948 C127.394376,31.1038948 126.016485,31.9358291 125.210549,32.7677633 C125.210549,34.0156647 126.432452,35.1075785 128.044325,35.315562 L128.044325,35.4715497 C128.044325,35.4715497 126.32846,36.6674552 125.470528,37.8113648 C125.470528,39.9951923 126.926413,41.2690916 129.396218,41.2690916 C132.697957,41.2690916 135.843708,38.9812724 135.843708,36.5894614 C135.843708,34.7696052 134.335827,34.0156647 130.306146,33.8076812 C128.174314,33.7296873 127.186392,33.3397181 127.186392,32.5337818 C127.186392,32.1958085 127.576362,31.7798414 128.278306,31.3898722 C128.824263,31.5198619 129.292226,31.5978558 129.786187,31.5978558 L129.786187,31.5978558 Z M130.410138,30.4539462 C128.616279,30.4539462 127.420374,29.102053 127.420374,27.1002112 C127.420374,25.3583488 128.408296,24.2404371 129.994171,24.2404371 C131.762031,24.2404371 132.983934,25.6183283 132.983934,27.6201701 C132.983934,29.3880304 131.996012,30.4539462 130.410138,30.4539462 L130.410138,30.4539462 Z M130.358142,39.9951923 C128.564284,39.9951923 127.498368,39.1892559 127.498368,37.8633607 C127.498368,36.6934531 129.11024,35.4975476 129.11024,35.4975476 C133.269912,36.0435045 134.17984,36.4074757 134.17984,37.4213956 C134.17984,38.7732888 132.385982,39.9951923 130.358142,39.9951923 L130.358142,39.9951923 Z M139.951384,27.3081947 C140.263359,25.4103447 141.537258,24.2404371 143.149131,24.2404371 C144.527022,24.2404371 145.306961,24.9943776 145.306961,26.3722687 C145.306961,26.8922276 145.176971,27.0222173 144.657012,27.0742132 L139.951384,27.3081947 Z M147.022825,28.2701187 L147.360798,27.9581434 C147.360798,27.9581434 147.516786,27.3341927 147.516786,26.684244 C147.516786,24.2144392 146.190891,22.9145419 143.643092,22.9145419 C140.549337,22.9145419 137.897546,25.9822995 137.897546,29.5440181 C137.897546,32.9757469 140.081373,35.2895641 143.357115,35.2895641 C144.916991,35.2895641 147.3348,33.5217038 147.3348,33.5217038 L147.048823,32.7677633 L146.892835,32.7157674 C146.892835,32.7157674 145.306961,33.5217038 143.695088,33.5217038 C141.381271,33.5217038 139.847392,31.5978558 139.847392,28.6860859 L139.847392,28.2701187 L147.022825,28.2701187 Z M154.458237,32.0138229 C154.458237,31.2858804 154.770213,29.6480098 155.05619,27.6981639 C155.498155,27.646168 156.252096,27.5421762 156.980038,27.5421762 C158.22794,27.5421762 160.229781,27.6201701 160.229781,27.6201701 L160.853732,25.4103447 L160.697744,25.2023611 C160.697744,25.2023611 158.565913,25.4103447 157.759977,25.4103447 C157.032034,25.4103447 155.94012,25.3843467 155.420161,25.3843467 L156.096108,21.2766713 C156.226098,20.4967329 156.356088,20.4187391 157.525995,20.4187391 C159.917806,20.4187391 160.515759,20.5747268 160.515759,21.6406426 C160.515759,22.2125974 160.307775,23.1225255 160.307775,23.1225255 L162.64759,22.9665378 C163.063558,20.5487288 163.7915,18.2609096 163.7915,18.2609096 L163.635512,18.0009302 C162.075636,18.2089137 159.527837,18.3129055 155.94012,18.3129055 C154.068268,18.3129055 151.312486,18.2349117 151.312486,18.2349117 L150.922517,19.7687905 L151.052507,20.002772 C151.052507,20.002772 151.546468,19.9507761 151.832445,19.9507761 C152.482394,19.9507761 152.586385,20.2367535 152.456396,21.3546652 L151.208494,31.2858804 C151.026509,32.7937613 150.558546,33.2877223 149.154657,33.4957058 L148.738689,35.2375682 C148.738689,35.2375682 150.922517,34.9775887 153.15834,34.9775887 C156.278094,34.9775887 160.931726,35.1595743 160.931726,35.1595743 L161.217703,34.8995949 C161.76366,32.4037921 162.517601,30.0899749 162.517601,30.0899749 L162.361613,29.8299955 L160.203783,30.0119811 C159.501839,32.6377736 159.007878,32.9757469 155.94012,32.9757469 C154.796211,32.9757469 154.458237,32.8717551 154.458237,32.0138229 L154.458237,32.0138229 Z M173.566728,32.1438126 C174.190678,28.0361372 175.43858,23.3825049 175.43858,23.3825049 L175.230596,22.9405398 L173.124763,22.5765686 L172.838785,22.7585542 L172.6568,23.330509 L170.394978,22.862546 C167.353219,22.862546 164.129473,27.3081947 164.129473,31.493864 C164.129473,33.885675 165.221387,35.2895641 167.093239,35.2895641 C168.47113,34.3276401 169.719032,32.7417654 171.278908,29.9339873 L171.486892,29.9599852 C171.226912,30.999903 170.602962,33.8076812 170.602962,34.3016421 C170.602962,34.9515908 170.966933,35.2895641 171.720873,35.2895641 C172.708795,35.2895641 173.800709,34.4836278 176.244516,31.9098311 L175.828549,30.999903 L175.386584,30.9479071 C174.138682,32.0398209 173.878703,32.2478044 173.670719,32.2478044 L173.566728,32.1438126 Z M167.925173,32.2478044 C167.613198,32.2478044 167.353219,31.3118784 167.353219,30.037979 C167.353219,27.5161783 168.497128,24.9163837 169.589042,24.9163837 C170.238991,24.9163837 171.096923,25.2023611 171.876861,25.6703241 C170.576964,29.1280509 168.705112,32.2478044 167.925173,32.2478044 L167.925173,32.2478044 Z M179.000298,27.3861886 C179.416265,26.0602933 180.014218,25.6443262 181.444105,25.6443262 L183.341955,25.6703241 L176.166522,34.2236483 L176.660483,35.0035867 C177.570411,34.4576298 178.584331,34.1196565 179.416265,34.1196565 C181.106132,34.1196565 182.458025,35.2895641 184.0439,35.2895641 C185.655772,35.2895641 186.929672,33.8596771 186.929672,32.0918167 C186.929672,31.467866 186.773684,30.7919195 186.591698,30.3499544 L185.967748,30.3239564 C185.759764,31.5458599 185.083818,32.2738024 184.173889,32.2738024 C183.263961,32.2738024 181.912068,31.8838332 181.080134,31.8838332 L180.404187,32.0138229 C182.302037,29.7779996 185.109816,26.5802523 187.8396,23.6684823 L187.70961,23.1745214 L186.279723,22.2645933 L185.733766,22.9145419 C185.395793,23.3045111 185.135813,23.4085029 184.485865,23.4085029 C182.484023,23.4085029 179.286276,22.6545624 179.286276,22.6545624 L178.584331,22.9405398 C178.246358,25.0463735 177.544413,27.5161783 177.544413,27.5161783 L179.000298,27.3861886 Z M194.885043,24.1364454 C195.690979,24.5524125 196.18494,25.254357 196.18494,26.0602933 C196.18494,27.2561988 195.171021,29.7260037 193.481154,32.6637716 L193.169179,32.6637716 C193.169179,28.7640797 193.039189,25.5923303 192.77921,23.0705296 L192.493232,22.8365481 L187.891596,23.356507 L187.787604,24.8643878 C187.787604,24.8643878 188.541544,24.786394 188.827522,24.786394 C189.399477,24.786394 189.633458,25.0203755 189.763448,25.6963221 C190.153417,28.114131 190.647378,31.987825 191.037347,36.2514881 C189.581462,38.0973422 188.645536,38.7472909 187.553622,38.7472909 C186.669692,38.7472909 185.915752,38.0973422 185.707768,37.1614162 L185.187809,37.1354182 C184.719846,38.0193484 184.225885,39.3192457 184.121894,39.9691943 C184.329877,40.6971368 185.473787,41.2950895 186.721688,41.2950895 C188.905516,41.2950895 191.089343,39.3972395 194.41708,34.6916113 C197.692821,29.9859831 199.330692,26.7622379 199.330692,24.9163837 C199.330692,23.9544597 199.018716,23.0965275 198.498758,22.6545624 L195.067029,23.3045111 L194.885043,24.1364454 Z" id="ChangeEazy"></path> <path d="M23.8793501,52.6646555 C19.6606056,49.9386975 18.2327228,48.0564884 17.6485889,44.0324551 C16.2856099,34.7512171 28.2279022,28.9747823 33.2254919,36.5685225 C35.107701,39.424288 33.0956844,44.2271664 30.1101113,44.2271664 C27.9682871,44.2271664 27.1245382,42.2800536 28.552421,40.5925557 C29.5259774,39.424288 29.3961699,38.9699617 28.0980947,38.5156353 C24.1389652,36.957945 21.5428147,44.4867815 25.0476178,47.4074508 C30.3048226,51.7560029 38.7423117,46.6935094 38.7423117,39.164673 C38.7423117,31.0517027 31.4081865,26.5733431 21.8024297,28.8449748 C12.1317691,31.1815102 3.49956874,27.1574769 0.83851448,19.0445066 C-3.25042255,6.64788803 11.8072503,-3.93142523 20.7639695,5.02529398 C26.086078,10.3474025 22.7759861,19.6286405 15.5716685,19.6286405 C12.3264804,19.6286405 9.34090734,15.1502809 11.0933089,13.0084567 C12.7808067,10.9964401 14.1437858,11.0613439 14.1437858,13.0733605 C14.1437858,15.2800884 17.6485889,14.5012433 18.1029153,12.1647078 C18.6221454,9.37384605 16.3505137,7.36182942 12.6509992,7.36182942 C3.5644725,7.36182942 3.5644725,20.7320045 12.6509992,23.7175775 C19.6606056,26.054113 26.3456931,21.8353684 28.4875172,13.7223981 C31.6678016,1.58539457 45.1677841,-3.60690641 54.0595996,3.92193002 C62.8216075,11.2560552 58.7326705,24.7560377 47.7639346,24.7560377 C40.3649057,24.7560377 36.0812574,17.2272013 40.8192321,12.4892266 C43.2206713,10.0877874 46.2062443,9.82817239 47.9586459,11.9050928 C49.3865287,13.7223981 48.3480685,15.929126 46.3360519,15.1502809 C44.5836503,14.5012433 43.6749976,15.8642223 44.5187465,18.0060464 C46.0115331,22.0300797 53.0860432,18.6550841 53.0860432,13.8522057 C53.0860432,4.37625635 39.3264455,2.75366229 35.0427972,11.7752853 C32.5764543,16.9675862 33.8096257,21.7704647 39.2615418,27.8714183 C44.7783616,34.0372757 45.8168218,38.3858278 43.4153826,44.7463965 C40.300002,52.9242706 30.5644376,56.8184963 23.8793501,52.6646555 L23.8793501,52.6646555 Z" id="Shape" stroke="#3EB8E7" transform="translate(29.479701, 27.378420) scale(-1, 1) rotate(-180.000000) translate(-29.479701, -27.378420) "></path> </g> </g> </g> </g> </svg>`;
}, "/Users/nils/Sites/changeazy.com/src/components/TheLogo.astro", void 0);

const $$Astro$5 = createAstro();
const $$TheHeader = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TheHeader;
  const storyblokApi = ve();
  const { data } = await storyblokApi.get("cdn/stories/config", {
    version: "draft",
    resolve_links: "url"
  });
  const headerMenu = data?.story?.content?.header_menu;
  return renderTemplate`${maybeRenderHead()}<header class="header masthead" role="banner"> <div class="grid"> <div class="branding"> <!--<a class="logo" href={getTransLink(language, '/')} rel="home" title="take me home">
        <TheLogo />
      </a>--> <a class="logo" href="/" } rel="home" title="take me home"> ${renderComponent($$result, "TheLogo", $$TheLogo, {})} </a> </div> <!-- menu --> <nav class="navigation" role="navigation"> <ul class="mdl-menu"> ${headerMenu.map((menu) => renderTemplate`<li class="menu-item"> <a${addAttribute(`/${menu.link.cached_url}`, "href")} class="hover:text-[#50b0ae]"> ${menu.link.story.name} </a> </li>`)} </ul> </nav> </div> </header> `;
}, "/Users/nils/Sites/changeazy.com/src/components/TheHeader.astro", void 0);

const navData = [
  {
    name: "coaching",
    href: "/#coaching"
  },
  {
    name: "trainings",
    href: "/#trainings"
  },
  {
    name: "bodywork",
    href: "/#bodywork"
  },
  {
    name: "about",
    href: "/#about"
  },
  {
    name: "testimonials",
    href: "/#testimonials"
  }
];

const $$Astro$4 = createAstro();
const $$MobileNav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MobileNav;
  return renderTemplate`${maybeRenderHead()}<nav class="navigation mobile" role="navigation"> <ul class="mdl-menu"> ${navData.map((i) => renderTemplate`<li class="menu-item"> <a${addAttribute(i.href, "href")}>${i.name}</a> </li>`)} </ul> </nav>`;
}, "/Users/nils/Sites/changeazy.com/src/components/MobileNav.astro", void 0);

const $$Astro$3 = createAstro();
const $$TheFooter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TheFooter;
  return renderTemplate`${maybeRenderHead()}<footer class="footer cf" role="contentinfo"> <div class="wrap wide"> <p class="footer-copyright">&copy; 2016–2024 – ChangeEazy | Niki Fekete.</p> <a href="assets/docs/AVChangeEazyFebruari2016.pdf" target="_blank">Terms & Conditions</a> <p>
[PDF - 179KB] - KvK 65276922 - BTW NL235800053B01 - Rekening nr NL02INGB0007241422
</p> </div> </footer>`;
}, "/Users/nils/Sites/changeazy.com/src/components/TheFooter.astro", void 0);

const $$Astro$2 = createAstro();
const $$ButtonBar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ButtonBar;
  return renderTemplate`${maybeRenderHead()}<div class="mdl-buttonbar"> <p>For more information or an intake interview, please contact Niki via
<a href="mailto:nikifekete@changeazy.com">email</a> or <a href="tel:+31653885727">phone</a>.
</p> <a class="btn" href="mailto:nikifekete@changeazy.com">email</a> <a class="btn" href="tel:+31653885727">phone</a>.
</div>`;
}, "/Users/nils/Sites/changeazy.com/src/components/ButtonBar.astro", void 0);

const $$Astro$1 = createAstro();
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  const { language, langSwitch } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="This is ChangeEazy">${renderHead()}</head> <body> ${renderComponent($$result, "TheHeader", $$TheHeader, { "langSwitch": langSwitch, "language": language })} <!--<main></main>--> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "ButtonBar", $$ButtonBar, {})} ${renderComponent($$result, "MobileNav", $$MobileNav, {})} ${renderComponent($$result, "TheFooter", $$TheFooter, {})} </body></html>`;
}, "/Users/nils/Sites/changeazy.com/src/layouts/BaseLayout.astro", void 0);

function parseUrl(url) {
  // Converting the current url to an array based on '/'
  let urlToArray = url?.split('/');

  // Removing empty elements from the array
  // urlToArray = urlToArray.filter(Boolean);
  // Adding a check to ensure urlToArray is defined before using filter
  urlToArray = urlToArray ? urlToArray.filter(Boolean) : [];

  // Extracting the slug directly from the url
  let slug = urlToArray?.join('/') || undefined;

  // Returning the slug
  return { slug };
}

async function generateStaticPaths() {
  const storyblokApi = ve();
  const { data } = await storyblokApi.get("cdn/links", {
    version: "draft" 
  });
  let links = data.links;
  links = Object.values(links);
  let paths = [];
  links.forEach((link) => {
    let slug = link.slug === "home" ? void 0 : link.slug;
    paths.push({
      props: { slug },
      params: {
        slug: slug || void 0
      }
    });
  });
  return paths;
}

const $$Astro = createAstro();
async function getStaticPaths() {
  return await generateStaticPaths();
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const params = Astro2.params;
  const props = parseUrl(params?.slug) ;
  const { slug } = props;
  const storyblokApi = ve();
  const { data } = await storyblokApi.get(
    `cdn/stories/${slug === void 0 ? "home" : slug}`,
    {
      version: "draft" 
    }
  );
  const story = data.story;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StoryblokComponent", $$StoryblokComponent, { "blok": story.content })} ` })}`;
}, "/Users/nils/Sites/changeazy.com/src/pages/[...slug].astro", void 0);

const $$file = "/Users/nils/Sites/changeazy.com/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const ____slug_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { ____slug_ as _, getConfiguredImageService as g, imageConfig as i };
