import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import './chunks/astro_6Rlbwsvc.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.zjCbv0E3.js"}],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.zjCbv0E3.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.mA6bOUUD.css"}],"routeData":{"route":"/[...slug]","type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/nils/Sites/changeazy.com/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_IYv5bEZQ.mjs","\u0000@astrojs-manifest":"manifest_vQw_74eS.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_N5VMHSe7.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"chunks/_.._CKqX7o01.mjs","astro:scripts/page.js":"_astro/page.zjCbv0E3.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/roboto-cyrillic-ext-100-normal.naomUVZ9.woff2","/_astro/roboto-cyrillic-100-normal.R5XyF4r5.woff2","/_astro/roboto-greek-100-normal.WplCaLMk.woff2","/_astro/roboto-vietnamese-100-normal.TEJDdb59.woff2","/_astro/roboto-latin-ext-100-normal.K_EPbNMb.woff2","/_astro/roboto-cyrillic-ext-300-normal.E82ViLoj.woff2","/_astro/roboto-cyrillic-300-normal.-po7MILF.woff2","/_astro/roboto-latin-100-normal.8MOTs21p.woff2","/_astro/roboto-greek-300-normal.J3YrlqhA.woff2","/_astro/roboto-vietnamese-300-normal.pz61bwbN.woff2","/_astro/roboto-latin-ext-300-normal.xLDXUQvh.woff2","/_astro/roboto-latin-300-normal.E4R60IWG.woff2","/_astro/roboto-cyrillic-ext-400-normal.zkSvWxgI.woff2","/_astro/roboto-greek-400-normal.UVhwlGKP.woff2","/_astro/roboto-vietnamese-400-normal.JAkXt1WZ.woff2","/_astro/roboto-latin-ext-400-normal.OGy6Zcg4.woff2","/_astro/roboto-cyrillic-700-normal.eWQSlgh7.woff2","/_astro/roboto-latin-400-normal.JkyEVz-m.woff2","/_astro/roboto-greek-700-normal.nNk6vBVU.woff2","/_astro/roboto-cyrillic-ext-700-normal.rKwhCSHC.woff2","/_astro/roboto-vietnamese-700-normal.EnpEoUH0.woff2","/_astro/roboto-latin-ext-700-normal.WBgqNxqO.woff2","/_astro/roboto-latin-700-normal.njOYDr_M.woff2","/_astro/roboto-cyrillic-400-normal.1Q02bZlk.woff2","/_astro/roboto-cyrillic-100-normal.xex_YG8W.woff","/_astro/roboto-greek-100-normal.7_aQMzs2.woff","/_astro/roboto-cyrillic-ext-100-normal.hLpe1Z1_.woff","/_astro/roboto-vietnamese-100-normal.AktjcZq7.woff","/_astro/roboto-cyrillic-ext-300-normal.uwBobgv-.woff","/_astro/roboto-cyrillic-300-normal.FF-TwrnM.woff","/_astro/roboto-latin-ext-100-normal.IdrcKVUV.woff","/_astro/roboto-greek-300-normal.4G3vnZze.woff","/_astro/roboto-latin-100-normal.obYh6yDh.woff","/_astro/roboto-latin-ext-300-normal.mlLlnqo5.woff","/_astro/roboto-vietnamese-300-normal.zsQ2em1q.woff","/_astro/roboto-cyrillic-ext-400-normal.PiqLoFV_.woff","/_astro/roboto-greek-400-normal.ZxjWinlq.woff","/_astro/roboto-latin-300-normal.JauzICV2.woff","/_astro/roboto-vietnamese-400-normal.ZBATgFfY.woff","/_astro/roboto-latin-ext-400-normal.5aATcKHE.woff","/_astro/roboto-cyrillic-700-normal.wCMcOcVz.woff","/_astro/roboto-greek-700-normal.o7k6RnxP.woff","/_astro/roboto-cyrillic-ext-700-normal.HQzrQ3OY.woff","/_astro/roboto-vietnamese-700-normal.DHNHOqon.woff","/_astro/roboto-latin-400-normal.VNUqCuId.woff","/_astro/roboto-latin-700-normal.YeN9SxC4.woff","/_astro/roboto-latin-ext-700-normal.8FF03k7w.woff","/_astro/roboto-cyrillic-400-normal.wkKjpXzZ.woff","/_astro/legwork.cDAaBBKZ.jpg","/_astro/wimper.B_NmbMn6.jpg","/_astro/coachme-600x600.kSlu5MR8.jpg","/_astro/1.square-flyer-600x600.Q78EyvnU.jpg","/_astro/1.office-600x600.-M0sQRP2.jpg","/_astro/1.perry-600x600.wzg4hwgb.jpg","/_astro/_slug_.mA6bOUUD.css","/favicon.svg","/_astro/page.zjCbv0E3.js","/assets/docs/AVChangeEazyFebruari2016.pdf","/assets/images/1.office-600x600.jpg","/assets/images/1.office.jpg","/assets/images/1.perry-600x600.jpg","/assets/images/1.perry.jpg","/assets/images/1.square-flyer-600x600.jpg","/assets/images/1.square-flyer.jpg","/assets/images/2.perry.jpg","/assets/images/coaching1.jpg","/assets/images/coachme-600x600.jpg","/assets/images/coachme.jpg","/assets/images/hero1.jpg","/assets/images/legwork.jpg","/assets/images/niki-wimper.jpg","/assets/images/perry-movement.jpg","/_astro/page.zjCbv0E3.js"]});

export { manifest };
