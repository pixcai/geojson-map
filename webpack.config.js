var webpack = require('webpack')

module.exports = {
	entry: './index.js', 
	output: {
		path: './dist', 
		filename: 'geojson-map.js', 
		library: 'geoJsonMap', 
		libraryTarget: 'umd'
	}, 
	resolve: {
		extensions: ['.js', '']
	}, 
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
}
