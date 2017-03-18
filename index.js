var parseGeoJSON = require('./lib/parser')
var Renderer = require('./src/renderer')

module.exports = function (geoJSON, options) {
	return new Renderer(parseGeoJSON(geoJSON), options)
}
