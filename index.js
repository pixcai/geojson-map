var parseGeoJson = require('./lib/parser')
var Renderer = require('./src/renderer')

function geoJsonMap(geoJSON, options) {
	return new Renderer(parseGeoJson(geoJSON), options)
}

geoJsonMap.MERCATOR = 0

module.exports = geoJsonMap
