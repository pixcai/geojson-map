!function(t,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof exports?exports.geoJsonMap=o():t.geoJsonMap=o()}(this,function(){return function(t){function o(r){if(n[r])return n[r].exports;var e=n[r]={exports:{},id:r,loaded:!1};return t[r].call(e.exports,e,e.exports,o),e.loaded=!0,e.exports}var n={};return o.m=t,o.c=n,o.p="",o(0)}([function(t,o,n){function r(t,o){return new i(e(t),o)}var e=n(1),i=n(2);r.MERCATOR=0,t.exports=r},function(t,o){function n(t,o){for(var n,r,e=[],i=o.slice(),a=0,s=t.length;a<s;a+=2)n=t.charCodeAt(a)-64,r=t.charCodeAt(a+1)-64,n=(n>>1^-(1&n))+i[0],r=(r>>1^-(1&r))+i[1],i[0]=n,i[1]=r,e.push([n/1024,r/1024]);return e}function r(t){var o={MultiPolygon:function(t,o){return t.map(function(t,r){return n(t,o[r])})},Polygon:n},r=[];if("string"==typeof t&&(t=JSON.parse(t)),r=t.features,!t.UTF8Encoding)return t;for(var e=0,i=r.length;e<i;e++){var a=r[e].geometry,s=a.coordinates,c=a.encodeOffsets;s.forEach(function(t,n){s[n]=o[a.type](t,c[n])})}return t.UTF8Encoding=!1,t}function e(t,o,n){if(this.name=t,this.contours=o,!n){var r=this.getBoundingRect();n=[(r.xMin+r.xMax)/2,(r.yMin+r.yMax)/2]}this.center=n}e.prototype.getBoundingRect=function(){var t=Number.MAX_VALUE,o=function(o){var n=[t,t],r=[-t,-t];return o.forEach(function(t){n[0]=Math.min(n[0],t[0]),r[0]=Math.max(r[0],t[0]),n[1]=Math.min(n[1],t[1]),r[1]=Math.max(r[1],t[1])}),{xMin:n[0],yMin:n[1],xMax:r[0],yMax:r[1]}},n={xMin:t,yMin:t,xMax:-t,yMax:-t};return this.contours.forEach(function(t){t.forEach(function(t){var r=o(t);n.xMin=Math.min(n.xMin,r.xMin),n.xMax=Math.max(n.xMax,r.xMax),n.yMin=Math.min(n.yMin,r.yMin),n.yMax=Math.max(n.yMax,r.yMax)})}),n},t.exports=function(t){var o=r(t),n=o.features.filter(function(t){return t.properties&&t.geometry&&t.geometry.coordinates.length>0});return n.map(function(t){var o=t.geometry,n=o.coordinates;return"Polygon"===o.type&&(n=n.map(function(t){return[t]})),new e(t.properties.name,n,t.properties.cp)})}},function(t,o,n){function r(t,o){if(this.regions=[],this.options={},this.markers=[],!(o&&o.el instanceof HTMLCanvasElement))throw new Error("A canvas element required for `el` field in options. ");this.context=o.el.getContext("2d"),o.projection||(o.projection={type:e.MERCATOR,zoom:0}),Object.assign(this.options,o,{projection:new e(o.projection.type,{zoom:o.projection.zoom,width:o.el.width,height:o.el.height}),regions:t});for(var n=this.getBoundingRect(),r=this.options.projection,i=0,a=t.length;i<a;i++){var s=[],c=t[i].contours;s.center=r.coordinateToPoint(t[i].center,n),this.markers.push({point:s.center,label:t[i].name});for(var h=0,f=c.length;h<f;h++)for(var p=0,x=c[h].length;p<x;p++)s.push(c[h][p].map(function(t){return r.coordinateToPoint(t,n)}));this.regions.push(s)}if(this.options.markers&&Array.isArray(this.options.markers.data)){var u=this.options.markers.data.filter(function(t){var o=null;return Array.isArray(t)&&t.length>1&&"number"==typeof t[0]&&"number"==typeof t[1]&&(o=t.slice(0,2)),"object"==typeof t&&Array.isArray(t.point)&&t.point.length>1&&(o=t.point.slice(0,2)),!!o&&(t.point=r.coordinateToPoint(o,n),!0)});this.markers=this.markers.concat(u)}}var e=n(3);r.prototype.render=function(){var t=this.regions,o=this.context,n=Object.assign({color:"black",backgroundColor:"transparent"},this.options.style),r=this.options.markers;if(o.save(),o.strokeStyle=n.color,o.fillStyle=n.backgroundColor,t.forEach(function(t){t.forEach(function(t,n){o.beginPath(),o.moveTo(t[0].x,t[0].y);for(var r=1,e=t.length;r<e;r++)o.lineTo(t[r].x,t[r].y);o.stroke(),o.fill()})}),r&&r.show){var n=Object.assign({width:2,height:2,fontSize:12,fontFamily:"courier",color:"blue",backgroundColor:"red"},r.style);o.font=n.fontSize+"px "+n.fontFamily,this.markers.forEach(function(t){var e=t.point.x,i=t.point.y;"marker"!==r.show&&r.show!==!0||(o.fillStyle=n.backgroundColor,o.beginPath(),o.arc(e,i,Math.min(n.width,n.height),0,2*Math.PI),o.fill()),"label"!==r.show&&r.show!==!0||"string"==typeof t.label&&(o.fillStyle=n.color,o.fillText(t.label,e+4,i+n.fontSize/2))})}o.restore()},r.prototype.resize=function(t,o){},r.prototype.getBoundingRect=function(){for(var t,o,n=Number.MAX_VALUE,r=this.options.regions,e=this.options.projection.transform,i={xMin:n,yMin:n,xMax:-n,yMax:-n},a=0,s=r.length;a<s;a++){var c=r[a].getBoundingRect();t=e([c.xMin,c.yMin]),o=e([c.xMax,c.yMax]),i.xMin=i.xMin<t.x?i.xMin:t.x,i.yMin=i.yMin<t.y?i.yMin:t.y,i.xMax=i.xMax>o.x?i.xMax:o.x,i.yMax=i.yMax>o.y?i.yMax:o.y}return i},t.exports=r},function(t,o){function n(t,o){this.transform=r[t],this.options=o}var r={};n.MERCATOR=1,r[n.MERCATOR]=function(t,o){var n={};return o=Object.assign({radius:6378137,max:85.0511287798,radians:Math.PI/180},o),n.x=o.radius*t[0]*o.radians,n.y=Math.max(Math.min(o.max,t[1]),-o.max),n.y=n.y*o.radians,n.y=o.radius*Math.log(Math.tan(Math.PI/4+n.y/2)),n},n.prototype.projectCoordinate=function(t){var o=this.transform(t),n=Math.pow(2,parseInt(this.options.zoom,10));return o.x=o.x*n,o.y=o.y*n,o},n.prototype.coordinateToPoint=function(t,o){var n=this.projectCoordinate(t),r=Math.abs(o.xMax-o.xMin),e=Math.abs(o.yMax-o.yMin),i=this.options.width/r,a=this.options.height/e;return i<a?(n.x=(n.x-o.xMin)*i,n.y=(o.yMax-n.y)*i,n.y+=(this.options.height-e*i)/2):(n.x=(n.x-o.xMin)*a,n.x+=(this.options.width-r*a)/2,n.y=(o.yMax-n.y)*a),n},t.exports=n}])});