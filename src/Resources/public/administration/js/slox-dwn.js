(function(){var e={44:function(){},353:function(e,n,t){var o=t(44);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[e.id,o,""]]),o.locals&&(e.exports=o.locals),t(346).Z("dd604e62",o,!0,{})},346:function(e,n,t){"use strict";function o(e,n){for(var t=[],o={},r=0;r<n.length;r++){var a=n[r],s=a[0],i={id:e+":"+r,css:a[1],media:a[2],sourceMap:a[3]};o[s]?o[s].parts.push(i):t.push(o[s]={id:s,parts:[i]})}return t}t.d(n,{Z:function(){return h}});var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},s=r&&(document.head||document.getElementsByTagName("head")[0]),i=null,l=0,d=!1,c=function(){},u=null,p="data-vue-ssr-id",w="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function h(e,n,t,r){d=t,u=r||{};var s=o(e,n);return f(s),function(n){for(var t=[],r=0;r<s.length;r++){var i=a[s[r].id];i.refs--,t.push(i)}n?f(s=o(e,n)):s=[];for(var r=0;r<t.length;r++){var i=t[r];if(0===i.refs){for(var l=0;l<i.parts.length;l++)i.parts[l]();delete a[i.id]}}}}function f(e){for(var n=0;n<e.length;n++){var t=e[n],o=a[t.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](t.parts[r]);for(;r<t.parts.length;r++)o.parts.push(g(t.parts[r]));o.parts.length>t.parts.length&&(o.parts.length=t.parts.length)}else{for(var s=[],r=0;r<t.parts.length;r++)s.push(g(t.parts[r]));a[t.id]={id:t.id,refs:1,parts:s}}}}function v(){var e=document.createElement("style");return e.type="text/css",s.appendChild(e),e}function g(e){var n,t,o=document.querySelector("style["+p+'~="'+e.id+'"]');if(o){if(d)return c;o.parentNode.removeChild(o)}if(w){var r=l++;n=x.bind(null,o=i||(i=v()),r,!1),t=x.bind(null,o,r,!0)}else n=m.bind(null,o=v()),t=function(){o.parentNode.removeChild(o)};return n(e),function(o){o?(o.css!==e.css||o.media!==e.media||o.sourceMap!==e.sourceMap)&&n(e=o):t()}}var b=function(){var e=[];return function(n,t){return e[n]=t,e.filter(Boolean).join("\n")}}();function x(e,n,t,o){var r=t?"":o.css;if(e.styleSheet)e.styleSheet.cssText=b(n,r);else{var a=document.createTextNode(r),s=e.childNodes;s[n]&&e.removeChild(s[n]),s.length?e.insertBefore(a,s[n]):e.appendChild(a)}}function m(e,n){var t=n.css,o=n.media,r=n.sourceMap;if(o&&e.setAttribute("media",o),u.ssrId&&e.setAttribute(p,n.id),r&&(t+="\n/*# sourceURL="+r.sources[0]+" */\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var a=n[o]={id:o,exports:{}};return e[o](a,a.exports,t),a.exports}t.d=function(e,n){for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="bundles/sloxdwn/",window?.__sw__?.assetPath&&(t.p=window.__sw__.assetPath+"/bundles/sloxdwn/"),function(){"use strict";let{ApiService:e}=Shopware.Classes,{Context:n}=Shopware;class o extends e{constructor(e,n,t="sloxdwn"){super(e,n,t),this.name="sloxdwn"}async requestDownloadToken(e){let n=`/_action/${this.apiEndpoint}/${e}/request-download-token`,t=this.getBasicHeaders();return await this.httpClient.post(n,{},{headers:t}).then(e=>e?.data?.accessToken)}requestDownload(e,t){let o=new URLSearchParams({accessToken:t}),r=n.api.apiPath+`/_admin/${this.apiEndpoint}/${e}/request-download?${o.toString()}`;window.open(r,"_blank")}}Shopware.Service().register("PluginDownloadService",()=>new o(Shopware.Application.getContainer("init").httpClient,Shopware.Service("loginService"))),t(353);var r=JSON.parse('{"SloxDwn":{"downloadLabel":"Herunterladen"}}'),a=JSON.parse('{"SloxDwn":{"downloadLabel":"Download"}}');let{Component:s,Context:i,Mixin:l}=Shopware,{Criteria:d}=Shopware.Data;Shopware.Component.override("sw-extension-card-base",{template:'\r\n{% block sw_extension_card_base_activation_switch %}\r\n    <section>\r\n        <span class="sw-extension-card-base__info-name">\r\n            {{ extension.label }}\r\n        </span>\r\n        <span class="sw-extension-card-base__download-button">\r\n        <br/>\r\n            <sw-button variant="ghost" class="slox-download-button" size="x-small" \r\n                @click="requestDownload" @keydown.enter="requestDownload" \r\n                :is-loading="isDownloadLoading" >\r\n                    <sw-icon class="slox-download-button-icon" name="regular-cloud-download" />\r\n                     {{ $tc(\'SloxDwn.downloadLabel\') }}\r\n            </sw-button>\r\n        </span>\r\n        \r\n        {% block sw_extension_card_base_info_inactive_label %}\r\n        <span\r\n            v-if="isInstalled && !extension.active"\r\n            class="sw-extension-card-base__info-inactive"\r\n        >\r\n            {{ $tc(\'sw-extension-store.component.sw-extension-card-base.inactiveLabel\') }}\r\n        </span>\r\n        {% endblock %}\r\n    </section>\r\n{% endblock %}',inheritAttrs:!1,inject:["PluginDownloadService"],mixins:[l.getByName("notification"),"sw-extension-error"],data(){return{isDownloadLoading:!1}},methods:{async requestDownload(){this.isDownloadLoading=!0;try{let e=await this.PluginDownloadService.requestDownloadToken(this.extension.localId).catch(()=>null);e?this.PluginDownloadService.requestDownload(this.extension.localId,e):this.createNotificationError({title:"Unexpected error",message:"Could not generate access token for extension download"})}catch(e){this.showExtensionErrors(e)}finally{this.isDownloadLoading=!1}}},snippets:{"de-DE":r,"en-GB":a}})}()})();