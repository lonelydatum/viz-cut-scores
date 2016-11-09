/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 0.7.5 - Build: 291 (2012/04/09 11:48 PM)
*/
(function(p){function j(a,b,c,d,f){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=f||0}function h(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}var e={VERSION:"0.7.5"};j.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?
this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},getListener:function(){return this._listener},_destroy:function(){delete this._signal;delete this._listener;delete this.context},isOnce:function(){return this._isOnce},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.Signal=function(){var a=Array.prototype.slice.call(arguments);if(a.length>1||a.length>0&&!k(a[0]))this._argumentTypes=
a,this._argumentIsHash=!1;else if(a.length==1&&a[0]instanceof Object)this._argumentTypes=arguments[0],this._argumentIsHash=!0;this._bindings=[];this._prevParams=null};e.Signal.prototype={memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var f=this._indexOfListener(a,c);if(f!==-1){if(a=this._bindings[f],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new j(this,
a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){h(a,"add");return this._registerListener(a,
!1,b,c)},addOnce:function(a,b,c){h(a,"addOnce");return this._registerListener(a,!0,b,c)},remove:function(a,b){h(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),
c=this._bindings.length,d;if(this._argumentTypes)if(this._argumentIsHash){if(b.length!=1)throw Error("strict Signal argument length Mismatch. Expected single argument, named hash. Got: "+b.length);var f=b[0];for(d in this._argumentTypes){var e=f[d],g=this._argumentTypes[d];l(e,g,d)}}else{if(b.length!=this._argumentTypes.length)throw Error("strict Signal argument length Mismatch. Expected: "+this._argumentTypes.length+". Got: "+b.length);d=0;for(f=this._argumentTypes.length;d<f;d++)e=b[d],g=this._argumentTypes[d],
l(e,g,d)}if(this.memorize)this._prevParams=b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};if(typeof jQuery!="undefined")var g=jQuery.hasOwn,i=jQuery.isArray,m=jQuery.isNumeric,n=jQuery.isWindow,k=jQuery.isPlainObject;
else var o=Object.prototype.toString,g=Object.prototype.hasOwnProperty,i=Array.isArray||function(a){return o.call(a)=="[object Array]"},m=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},n=function(a){return a&&typeof a==="object"&&"setInterval"in a},k=function(a){if(!a||o.call(a)!=="[object Object]"||a.nodeType||n(a))return!1;try{if(a.constructor&&!g.call(a,"constructor")&&!g.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}for(var c in a);return c===void 0||g.call(a,
c)?!0:!1};var l=function(a,b,c){switch(b){case Number:if(!m(a)||i(a)||a.constructor===String||a instanceof String)throw Error("strict Signal argument Type Mismatch on argument "+c+" is not Number");break;case String:if(!(a.constructor===String||a instanceof String))throw Error("strict Signal argument Type Mismatch on argument "+c+" is not String");break;case Array:if(!i(a))throw Error("strict Signal argument Type Mismatch on argument "+c+" is not Array");break;default:if(!(a instanceof b||b.isPrototypeOf(a)))throw Error("strict Signal argument Type Mismatch on argument "+
c+" is not custom Class type: "+b);}};typeof define==="function"&&define.amd?define([],function(){return e}):typeof module!=="undefined"&&module.exports?module.exports=e:p.signals=e})(this);