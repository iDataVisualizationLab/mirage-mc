"use strict";(self.webpackChunkmirage_mc=self.webpackChunkmirage_mc||[]).push([[288],{95288:function(e,n,t){t.r(n);var i=t(1413),r=(t(72791),t(11068)),u=t(95321),o=(t(54333),t(60220),t(4841)),s=t(43236),a=t(52411),l=t(47055),c=t(90977),M=t(86966),f=t(75600),p=t(95074),_=t(98268),d=t(99631),O=t(13967),I=t(80184);n.default=function(){var e=(0,u.useTheme)(),n=e.toggleThisTheme,t=e.isDarkMode,S=e.isRTL,E=(0,r.useMenu)(),y=(0,O.Z)(),h=E||{},b=h.toggleThis,v=h.isDesktop,T=h.isMiniMode,N=(h.isMenuOpen,h.isMiniSwitchVisibility),g=(h.isAuthMenuOpen,{icon:{color:y.palette.grey.A100,cursor:"pointer"},toolbar:(0,i.Z)({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:y.spacing(1)},y.mixins.toolbar)});return(0,I.jsxs)(o.Z,{square:!0,elevation:3,sx:{backgroundColor:function(e){return"dark"===e.palette.mode?e.palette.background.default:e.palette.primary.dark},margin:0,padding:0},children:[T&&false,(0,I.jsx)(s.Z,{sx:(0,i.Z)({},g.toolbar),children:!T&&(0,I.jsx)(a.ZP,{sx:(0,i.Z)({color:function(e){return y.palette.grey.A100},cursor:"pointer"},y.mixins.toolbar),children:(0,I.jsxs)(l.Z,{children:[(0,I.jsx)(c.Z,{onClick:function(){n("isDarkMode")},children:t?(0,I.jsx)(M.Z,{sx:(0,i.Z)({},g.icon)}):(0,I.jsx)(f.Z,{sx:(0,i.Z)({},g.icon)})}),v&&(0,I.jsxs)(I.Fragment,{children:[N&&(0,I.jsx)(c.Z,{onClick:function(){b("isMiniMode",!0),b("isMenuOpen",!1)},children:(0,I.jsx)(p.Z,{sx:(0,i.Z)({},g.icon)})}),(0,I.jsx)(c.Z,{color:"inherit",onClick:function(){b("isMenuOpen",!1)},children:S?(0,I.jsx)(_.Z,{sx:(0,i.Z)({},g.icon)}):(0,I.jsx)(d.Z,{sx:(0,i.Z)({},g.icon)})})," "]})]})})})]})}},98892:function(e,n,t){n.__esModule=!0,n.default=void 0;var i=function(e,n){if(!n&&e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=l(n);if(t&&t.has(e))return t.get(e);var i={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var o=r?Object.getOwnPropertyDescriptor(e,u):null;o&&(o.get||o.set)?Object.defineProperty(i,u,o):i[u]=e[u]}i.default=e,t&&t.set(e,i);return i}(t(72791)),r=a(t(74350)),u=t(26986),o=t(58967),s=a(t(99675));function a(e){return e&&e.__esModule?e:{default:e}}function l(e){if("function"!==typeof WeakMap)return null;var n=new WeakMap,t=new WeakMap;return(l=function(e){return e?t:n})(e)}function c(){return c=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},c.apply(this,arguments)}var M=function(e){var n=e.appConfig,t=e.children,a=e.persistKey,l=void 0===a?"menu":a,M=(n||{}).menu,f=M.initialAuthMenuOpen,p=M.initialMiniMode,_=M.initialMenuOpen,d=M.initialMobileMenuOpen,O=M.initialMiniSwitchVisibility,I=M.useWindowWatcher,S=JSON.parse(localStorage.getItem(l)),E=(0,i.useReducer)(s.default,c({isAuthMenuOpen:f,isMiniMode:p,isMenuOpen:_,isMobileMenuOpen:d,isMiniSwitchVisibility:O},S)),y=E[0],h=E[1],b={toggleThis:function(e,n){void 0===n&&(n=null),"isAuthMenuOpen"===e?h((0,o.setIsAuthMenuOpen)(null!==n?n:!y.isAuthMenuOpen)):"isMiniMode"===e?h((0,o.setIsMiniMode)(null!==n?n:!y.isMiniMode)):"isMenuOpen"===e?h((0,o.setIsMenuOpen)(null!==n?n:!y.isMenuOpen)):"isMobileMenuOpen"===e?h((0,o.setIsMobileMenuOpen)(null!==n?n:!y.isMobileMenuOpen)):"isMiniSwitchVisibility"===e&&h((0,o.setIsMiniSwitchVisibility)(null!==n?n:!y.isMiniSwitchVisibility))},isAuthMenuOpen:y.isAuthMenuOpen,isMiniMode:y.isMiniMode,isMenuOpen:y.isMenuOpen,isMobileMenuOpen:y.isMobileMenuOpen,isMiniSwitchVisibility:y.isMiniSwitchVisibility},v=(0,u.useMediaQuery)("(min-width:600px)");return(0,i.useEffect)((function(){try{localStorage.setItem(l,JSON.stringify(y))}catch(e){console.warn(e)}}),[y,l]),(0,i.useEffect)((function(){I&&(v||(b.setMenuOpen(!1),b.setMiniMode(!1)))}),[v,b,I]),i.default.createElement(r.default.Provider,{value:c({isDesktop:v},b)},t)};n.default=M,e.exports=n.default},11068:function(e,n,t){n.__esModule=!0,n.default=void 0,n.useMenu=function(){return(0,i.useContext)(r.default)},n.withMenu=void 0;var i=t(72791),r=s(t(74350)),u=s(t(68172));n.withMenu=u.default;var o=s(t(98892));function s(e){return e&&e.__esModule?e:{default:e}}n.default=o.default},58967:function(e,n,t){n.__esModule=!0,n.setIsAuthMenuOpen=function(e){return{type:i.SET_IS_AUTH_MENU_OPEN,payload:e}},n.setIsMenuOpen=function(e){return{type:i.SET_IS_MENU_OPEN,payload:e}},n.setIsMiniMode=function(e){return{type:i.SET_IS_MINI_MODE,payload:e}},n.setIsMiniSwitchVisibility=function(e){return{type:i.SET_IS_MINI_SWITCH_VISIBILITY,payload:e}},n.setIsMobileMenuOpen=function(e){return{type:i.SET_IS_MOBILE_MENU_OPEN,payload:e}};var i=function(e,n){if(!n&&e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=r(n);if(t&&t.has(e))return t.get(e);var i={},u=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var s=u?Object.getOwnPropertyDescriptor(e,o):null;s&&(s.get||s.set)?Object.defineProperty(i,o,s):i[o]=e[o]}i.default=e,t&&t.set(e,i);return i}(t(1837));function r(e){if("function"!==typeof WeakMap)return null;var n=new WeakMap,t=new WeakMap;return(r=function(e){return e?t:n})(e)}},99675:function(e,n,t){n.__esModule=!0,n.default=function(e,n){void 0===e&&(e={});var t=n.type,r=n.payload;switch(t){case i.SET_IS_AUTH_MENU_OPEN:return u({},e,{isAuthMenuOpen:r});case i.SET_IS_MINI_MODE:return u({},e,{isMiniMode:r});case i.SET_IS_MENU_OPEN:return u({},e,{isMenuOpen:r});case i.SET_IS_MOBILE_MENU_OPEN:return u({},e,{isMobileMenuOpen:r});case i.SET_IS_MINI_SWITCH_VISIBILITY:return u({},e,{isMiniSwitchVisibility:r});default:return e}};var i=function(e,n){if(!n&&e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=r(n);if(t&&t.has(e))return t.get(e);var i={},u=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var s=u?Object.getOwnPropertyDescriptor(e,o):null;s&&(s.get||s.set)?Object.defineProperty(i,o,s):i[o]=e[o]}i.default=e,t&&t.set(e,i);return i}(t(1837));function r(e){if("function"!==typeof WeakMap)return null;var n=new WeakMap,t=new WeakMap;return(r=function(e){return e?t:n})(e)}function u(){return u=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},u.apply(this,arguments)}e.exports=n.default},1837:function(e,n){n.__esModule=!0,n.SET_IS_MOBILE_MENU_OPEN=n.SET_IS_MINI_SWITCH_VISIBILITY=n.SET_IS_MINI_MODE=n.SET_IS_MENU_OPEN=n.SET_IS_AUTH_MENU_OPEN=void 0;n.SET_IS_AUTH_MENU_OPEN="SET_IS_AUTH_MENU_OPEN";n.SET_IS_MINI_MODE="SET_IS_MINI_MODE";n.SET_IS_MENU_OPEN="SET_IS_MENU_OPEN";n.SET_IS_MOBILE_MENU_OPEN="SET_IS_MOBILE_MENU_OPEN";n.SET_IS_MINI_SWITCH_VISIBILITY="SET_IS_MINI_SWITCH_VISIBILITY"},68172:function(e,n,t){n.__esModule=!0,n.default=void 0;var i=u(t(74350)),r=u(t(72791));function u(e){return e&&e.__esModule?e:{default:e}}function o(){return o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},o.apply(this,arguments)}var s=function(e){return function(n){return r.default.createElement(i.default.Consumer,null,(function(t){return r.default.createElement(e,o({},t,n))}))}};n.default=s,e.exports=n.default}}]);
//# sourceMappingURL=288.e42d1f67.chunk.js.map