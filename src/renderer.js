var Projection = require('./projection')

function Renderer(regions, options) {
	this.regions = []
	this.options = {}
	this.markers = {
		centers: [], 
		customs: []
	}
	this.context = options.el.getContext('2d')

	Object.assign(this.options, options, {
		projection: new Projection(options.projection.type, {
			zoom: options.projection.zoom, 
			width: options.el.width, 
			height: options.el.height
		}), 
		regions: regions
	})

	var boundingRect = this.getBoundingRect()
	var projection = this.options.projection

	for (var i = 0, L = regions.length; i < L; i++) {
		var drawableRegion = {
			name: regions[i].name, 
			contours: []
		}
		var contours = regions[i].contours

		drawableRegion.center = projection.coordinateToPoint(
			regions[i].center, 
			boundingRect
		)
		this.markers.centers.push(drawableRegion.center)

		contours.forEach(function (contour) {
			var drawableContours = []

			contour.forEach(function (coordinate) {
				drawableContours.push(projection.coordinateToPoint(
					coordinate, 
					boundingRect
				))
			})
			drawableRegion.contours.push(drawableContours)
		})
		this.regions.push(drawableRegion)
	}
}

Renderer.prototype.render = function () {
	var regions = this.regions
	var context = this.context

	context.strokeStyle = 'black'
	regions.forEach(function (region) {
		region.contours.forEach(function (contour, index) {
			context.beginPath()
			context.moveTo(contour[0].x, contour[0].y)
			
			for (var i = 1, L = contour.length; i < L; i++) {
				context.lineTo(contour[i].x, contour[i].y)
			}
			context.stroke()
		})
	})
	
	if (this.options.showMarker) {
		context.fillStyle = 'blue'
		this.markers.centers.forEach(function (center) {
			context.beginPath()
			context.arc(center.x, center.y, 2, 0, Math.PI * 2)
			context.fill()
		})
		this.markers.customs.forEach(function (custom) {
			context.beginPath()
			context.arc(custom.x, custom.y, 2, 0, Math.PI * 2)
			context.fill()
		})
	}
}

Renderer.prototype.resize = function (width, height) {
}

Renderer.prototype.getBoundingRect = function () {
	var LIMIT = Number.MAX_VALUE
	var min, max
	var regions = this.options.regions
	var projection = this.options.projection.projection
	var boundingRect = { xMin: LIMIT, yMin: LIMIT, xMax: -LIMIT, yMax: -LIMIT }

	for (var i = 0, L = regions.length; i < L; i++) {
		var rect = regions[i].getBoundingRect()

		min = projection([rect.xMin, rect.yMin])
		max = projection([rect.xMax, rect.yMax])

		boundingRect.xMin = boundingRect.xMin < min.x ? boundingRect.xMin : min.x
		boundingRect.yMin = boundingRect.yMin < min.y ? boundingRect.yMin : min.y
		boundingRect.xMax = boundingRect.xMax > max.x ? boundingRect.xMax : max.x
		boundingRect.yMax = boundingRect.yMax > max.y ? boundingRect.yMax : max.y
	}

	return boundingRect
}

module.exports = Renderer
