import cors_proxy from 'cors-anywhere'

// Listen on a specific host via the HOST environment variable
const hostname = process.env.HOST || '0.0.0.0'
// Listen on a specific port via the PORT environment constiable
const port = process.env.PORT || 8080

cors_proxy
	.createServer({
		originWhitelist: [], // Allow all origins
		requireHeader: ['origin', 'x-requested-with'],
		removeHeaders: ['cookie', 'cookie2'],
	})
	//@ts-ignore
	.listen(port, hostname, function () {
		console.log('Running CORS Anywhere on ' + hostname + ':' + port)
	})
