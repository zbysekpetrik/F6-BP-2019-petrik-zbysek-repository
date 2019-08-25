(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["info"],{"13ac":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("v-card",{staticStyle:{"margin-bottom":"56px"}},[n("v-img",{attrs:{src:e.planeInfo.img}}),n("div",{staticStyle:{padding:"0px"}},[n("v-card",[n("v-card-title",{staticStyle:{display:"flex","justify-content":"space-between"}},[n("h5",[e._v(e._s(e.manufacturer)+" "+e._s(e.planeInfo.plane))]),n("h5",[e._v(e._s(e.selectedPlane[0]))])]),n("v-divider"),void 0!==e.planeInfo.info?n("flycalc-dynamic-list",{attrs:{items:e.displayInfo}}):e._e()],1),n("div",{staticStyle:{"text-align":"center"}})],1)],1)],1)},i=[],r=n("7618"),c=(n("ac6a"),n("456d"),n("6762"),n("2fdb"),n("7ffd")),o={components:{"flycalc-dynamic-list":function(){return Promise.all([n.e("cruise~flycalc-dynamic-list~flycalc-rwy-condition~hangar"),n.e("flycalc-dynamic-list")]).then(n.bind(null,"9469"))}},beforeMount:function(){this.onload()},created:function(){this.loadConfig()},data:function(){return{plane:null,imperialUnits:["lb","ft","inch"],metricUnits:["kg","m","cm"],doNotDisplay:["BEWarm","__ob__"]}},methods:{onload:function(){this.topNavModel=[!0,"plane"]},loadConfig:function(){var e=this;n("7457")("./".concat(this.planeInfo.plane,".js")).then(function(t){e.plane=t.default,Object.keys(e.plane).includes(e.planeInfo.config)&&(e.plane=e.plane[e.planeInfo.config]);var n=[];n.push(!("WaB"in e.plane)),n.push(!("TO"in e.plane)),n.push(!("cruise"in e.plane)),n.push(!("LD"in e.plane)),e.bottomNavDisabled=n})}},computed:{displayInfo:function(){for(var e=[],t=Object.getOwnPropertyNames(this.planeInfo.weight),n=0;n<t.length;n++)if(!this.doNotDisplay.includes(t[n])&&"object"!==Object(r["a"])(this.planeInfo.weight[t[n]].value)){var a=void 0,i=void 0;switch(this.planeInfo.weight[t[n]].unit){case"lb":a=Math.round(.45359237*this.planeInfo.weight[t[n]].value),i="kg";break;case"inch":a=Math.round(25.4*this.planeInfo.weight[t[n]].value)/1e3,i="m";break;default:a=this.planeInfo.weight[t[n]].value,i=this.planeInfo.weight[t[n]].unit;break}e.push({name:t[n],value:"".concat(a," ").concat(i)})}t=Object.getOwnPropertyNames(this.planeInfo.info);for(var c=0;c<t.length;c++)"string"===typeof this.planeInfo.info[t[c]]&&e.push({name:t[c],value:this.planeInfo.info[t[c]]});return e},planeInfo:function(){return this.json[this.selectedPlane[1]][this.selectedPlane[0]]},manufacturer:function(){return this.selectedPlane[1].charAt(0).toUpperCase()+this.selectedPlane[1].slice(1)},hangarModel:Object(c["c"])("hangarPanel"),topNavModel:Object(c["c"])("topNav"),selectedPlane:Object(c["c"])("selectedPlane"),bottomNavDisabled:Object(c["c"])("bottomNavDisabled")}},l=o,s=n("2877"),d=n("6544"),f=n.n(d),u=n("b0af"),p=n("99d9"),h=n("ce7e6"),v=n("adda"),b=Object(s["a"])(l,a,i,!1,null,null,null);t["default"]=b.exports;f()(b,{VCard:u["a"],VCardTitle:p["c"],VDivider:h["a"],VImg:v["a"]})},7457:function(e,t,n){var a={"./150.js":["5b7c",7,"chunk-2d0d2f8f"],"./P2002JF.js":["39b6",9,"chunk-2d0bb1f0"],"./P2006T.js":["6700",9,"chunk-2d0d0177"],"./P2008JC.js":["94c3",9,"chunk-4ec27c4d"],"./P2010.js":["d6ae",9,"chunk-2d21ecec"],"./P92JS.js":["c405",9,"chunk-2d216aec"]};function i(e){var t=a[e];return t?n.e(t[2]).then(function(){var e=t[0];return n.t(e,t[1])}):Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}i.keys=function(){return Object.keys(a)},i.id="7457",e.exports=i},"8ce9":function(e,t,n){},ce7e6:function(e,t,n){"use strict";n("8e6e"),n("ac6a"),n("456d");var a=n("bd86"),i=(n("8ce9"),n("7560"));function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(n,!0).forEach(function(t){Object(a["a"])(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}t["a"]=i["a"].extend({name:"v-divider",props:{inset:Boolean,vertical:Boolean},render:function(e){var t;return this.$attrs.role&&"separator"!==this.$attrs.role||(t=this.vertical?"vertical":"horizontal"),e("hr",{class:c({"v-divider":!0,"v-divider--inset":this.inset,"v-divider--vertical":this.vertical},this.themeClasses),attrs:c({role:"separator","aria-orientation":t},this.$attrs),on:this.$listeners})}})}}]);