import { Database } from 'bun:sqlite'
import { default as c } from 'chalk'

const l = console.log
const d = c.dim

interface Article {
	url: string
	response: string
}

const allowlist = ['http://localhost:3333']

const db = new Database('hn-cache.db')

// Create the cache table if it doesn't exist
db.query(
	`CREATE TABLE IF NOT EXISTS articles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	url TEXT,
	response TEXT
  );`,
).run()

// Fetch all articles from the 'articles' table
const query = db.query('SELECT * FROM articles')
const rows = query.all()

function find(url: string) {
	const query = db.query('SELECT * FROM articles WHERE url = $url')
	const result = query.get({ $url: url })
	return result
}

const setCache = (article: Article) => {
	const query = db.query(`INSERT INTO articles (url, response) VALUES ($url, $response)`)
	query.run({ $url: article.url, $response: article.response })
}

l(c.green('Cache:'))
for (const row of rows) {
	if (isValid(row)) logRow(row)
}

// Start Bun Server
Bun.serve({
	port: 8080, // Use the same port as in your original cors-anywhere example
	hostname: '0.0.0.0', // Listen on all available network interfaces
	fetch: async (req: Request) => {
		// The destination url is in the ?url= query parameter
		const url = new URL(req.url).searchParams.get('url')

		if (!url) {
			l(c.red('Invalid request from' + d(req.headers.get('origin') || 'unknown')))
			return new Response(null, { status: 400 })
		}

		l(`Proxying: ${d(url.toString())}`)

		const hit = find(url)

		if (isValid(hit)) {
			l(c.green('Cache hit.'))
			return new Response(hit.response, {
				headers: {
					'Access-Control-Allow-Origin': '*',	
				},
			})
		}

		// Preflight request handling.
		if (req.method === 'OPTIONS') {
			l(c.yellow('Preflight request received.'))

			if (!allowlist.includes(req.headers.get('origin') || '')) {
				l(c.red('Invalid origin. Allowed origins:'), allowlist.join(', '))
				return new Response(null, { status: 403 })
			}

			// Preflight request. Reply successfully:
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
					// 'Access-Control-Allow-Headers': 'Content-Type',
				},
			})
		}

		// Make the actual request to the target server
		const targetResponse = await fetch(url)
		const text = await targetResponse.text()

		// Validate it.
		if (!targetResponse.ok || typeof text !== 'string') {
			l(c.red('Target response was not ok.'))
			return new Response(null, { status: 400 })
		}

		// Cache the response
		setCache({ url, response: text })

		// Add CORS headers to the response

		// Create a new response object to send back to the client
		const clientResponse = new Response(targetResponse.body, {
			status: 200,
			statusText: 'OK',
			headers: {
				'Access-Control-Allow-Origin': '*',
				// 'Content-Type': 'text/html',
				'Connection': 'close',
			},
		})

		l('Target response: ')
		l('status: ', c.magentaBright(targetResponse.status))
		l('text: ', c.magentaBright(targetResponse.statusText))
		// l(responseHeaders)

		return clientResponse
	},
})

function logRow<T extends Article>(row: T) {
	const { url, response } = row
	l(c.yellow(new URL(url).origin), d((response.trim().slice(0, 100) + '...').replace(/\n/g, ' ') || ''))
}

function isValid(row: any): row is Article {
	if (typeof row !== 'object') return false
	if (row === null) return false
	const { url, response } = row
	if (typeof url !== 'string') return false
	if (typeof response !== 'string') return false
	return true
}
