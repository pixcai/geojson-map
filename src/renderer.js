var Projection = require('./projection')

function Renderer(regions, options) {
	this.regions = []
	this.options = {}
	this.markers = []
	this.context = options.el.getContext('2d')

	if (!options.projection) {
		options.projection = {
			type: Projection.MERCATOR, 
			zoom: 0
		}
	}
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

	for (var i = 0, M = regions.length; i < M; i++) {
		var drawableRegion = []
		var contours = regions[i].contours

		drawableRegion.center = projection.coordinateToPoint(
			regions[i].center, 
			boundingRect
		)
		this.markers.push({
			point: drawableRegion.center, 
			label: regions[i].name
		})

		for (var j = 0, N = contours.length; j < N; j++) {
			for (var k = 0, O = contours[j].length; k < O; k++) {
				drawableRegion.push(contours[j][k].map(function (coordinate) {
					return projection.coordinateToPoint(coordinate, boundingRect)
				}))
			}
		}
		this.regions.push(drawableRegion)
	}

	if (this.options.markers && Array.isArray(this.options.markers.data)) {
		var markers = this.options.markers.data.filter(function (marker) {
			return (
				typeof marker === 'object' 
				&& marker.point 
				&& typeof marker.point.x === 'number' 
				&& typeof marker.point.y === 'number'
			)
		})

		this.markers = this.markers.concat(markers)
	}
}

Renderer.prototype.render = function () {
	var regions = this.regions
	var context = this.context
	var style = Object.assign({
		color: 'black', 
		backgroundColor: 'transparent'
	}, this.options.style)
	var markers = this.options.markers

	context.save()
	context.strokeStyle = style.color
	context.fillStyle = style.backgroundColor

	regions.forEach(function (region) {
		region.forEach(function (contour, index) {
			context.beginPath()
			context.moveTo(contour[0].x, contour[0].y)
			
			for (var i = 1, L = contour.length; i < L; i++) {
				context.lineTo(contour[i].x, contour[i].y)
			}
			context.stroke()
			context.fill()
		})
	})

	if (markers && markers.show) {
		var style = Object.assign({
			width: 2, 
			height: 2, 
			fontSize: 12, 
			fontFamily: 'courier', 
			color: 'red', 
			backgroundColor: 'red'
		}, markers.style)

		context.font = style.fontSize + 'px ' + style.fontFamily

		this.markers.forEach(function (marker) {
			var x = marker.point.x
			var y = marker.point.y

			if (markers.show === 'marker' || markers.show) {
				context.fillStyle = style.backgroundColor
				context.beginPath()
				context.arc(x, y, Math.min(style.width, style.height), 0, Math.PI * 2)
				context.fill()
			}
			if ((markers.show === 'label' && typeof marker.label === 'string') 
				|| markers.show) {
				context.fillStyle = style.color
				context.fillText(marker.label, x + 4, y + style.fontSize / 2)
			}
		})
	}
	context.restore()
}

Renderer.prototype.resize = function (width, height) {

}

Renderer.prototype.getBoundingRect = function () {
	var LIMIT = Number.MAX_VALUE
	var min, max
	var regions = this.options.regions
	var transform = this.options.projection.transform
	var boundingRect = { xMin: LIMIT, yMin: LIMIT, xMax: -LIMIT, yMax: -LIMIT }

	for (var i = 0, L = regions.length; i < L; i++) {
		var rect = regions[i].getBoundingRect()

		min = transform([rect.xMin, rect.yMin])
		max = transform([rect.xMax, rect.yMax])

		boundingRect.xMin = boundingRect.xMin < min.x ? boundingRect.xMin : min.x
		boundingRect.yMin = boundingRect.yMin < min.y ? boundingRect.yMin : min.y
		boundingRect.xMax = boundingRect.xMax > max.x ? boundingRect.xMax : max.x
		boundingRect.yMax = boundingRect.yMax > max.y ? boundingRect.yMax : max.y
	}

	return boundingRect
}

module.exports = Renderer
