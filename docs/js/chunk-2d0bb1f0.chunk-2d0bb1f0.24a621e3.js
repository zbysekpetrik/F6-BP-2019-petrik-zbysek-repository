(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0bb1f0"],{"39b6":function(e,n,o){"use strict";o.r(n),n["default"]={WaB:{components:[{name:"Pilot and passenger",arm:1.8,unit:"kg",toKg:1,rule:[function(e){return!!e||"Required!"},function(e){return e>=0||"Value below zero not allowed!"}]},{name:"Fuel",arm:1.66,unit:"L",toKg:.72,rule:[function(e){return!!e||"Required!"},function(e){return e>=0||"Value below zero not allowed!"},function(e){return e<=100||"Maximum volume: 100 L"}]},{name:"Baggage",arm:2.2,unit:"kg",toKg:1,rule:[function(e){return e>=0||void 0===e||"Value below zero not allowed!"},function(e){return e<=20||void 0===e||"Maximum weight: 20 kg"}]}],envelope:[{x:1.693,y:"BEW"},{x:1.693,y:"MTOW"},{x:1.782,y:"MTOW"},{x:1.782,y:"BEW"},{x:1.693,y:"BEW"}],summary:["BEW","TOW","CG","%MAC"],armToMAC:function(e){return(e-1.337)/1.37}},store:{}}}}]);