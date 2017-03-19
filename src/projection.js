var PROJECTIONS = {}

function Projection(type, options) {
	this.projection = PROJECTIONS[type]
	this.options = Object.assign({
		zoom: 0, 
		width: 0, 
		height: 0
	}, options)
}

Projection.MERCATOR = 0

Projection.prototype.projectCoordinate = function (coordinate) {
	var point = this.projection(coordinate)
	var scale = Math.pow(2, parseInt(this.options.zoom, 10))

	point.x = point.x * scale
	point.y = point.y * scale

	return point
}

Projection.prototype.coordinateToPoint = function (coordinate, boundingRect) {
	var point = this.projectCoordinate(coordinate)
	var width = Math.abs(boundingRect.xMax - boundingRect.xMin)
	var height = Math.abs(boundingRect.yMax - boundingRect.yMin)
	var xScale = this.options.width / width
	var yScale = this.options.height / height

	if (xScale < yScale) {
		point.x = (point.x - boundingRect.xMin) * xScale
		point.y = (boundingRect.yMax - point.y) * xScale
		point.y += (this.options.height - height * xScale) / 2
	} else {
		point.x = (point.x - boundingRect.xMin) * yScale
		point.x += (this.options.width - width * yScale) / 2
		point.y = (boundingRect.yMax - point.y) * yScale
	}

	return point
}

PROJECTIONS[Projection.MERCATOR] = function (coordinate, options) {
	var point = {}

	options = Object.assign({
		radius: 6378137, 
		max: 85.0511287798, 
		radians: Math.PI / 180
	}, options)

	point.x = options.radius * coordinate[0] * options.radians
	point.y = Math.max(Math.min(options.max, coordinate[1]), -options.max)
	point.y = point.y * options.radians
	point.y = options.radius * Math.log(Math.tan((Math.PI / 4) + (point.y / 2)))

	return point
}

module.exports = Projection
