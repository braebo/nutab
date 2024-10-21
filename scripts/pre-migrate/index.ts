/**
 * @fileoverview Finds all svelte files with a <script> tag and adds the lang="ts"
 * attribute if missing.
 */

const glob = new Bun.Glob('../../**/*.svelte')

let offending = 0
let skipped = 0

for await (const path of glob.scan('.')) {
	const file = Bun.file(path)
	const text = await file.text()

	const lines = text.split('\n')

	if (lines.length === 0) {
		skipped++
		continue
	}

	let line = 0
	let found = ''

	for (let i = 0; i < lines.length; i++) {
		if (!lines[i]) continue
		if (lines[i].includes('<script lang="ts">')) {
			skipped++
			line = 0
			found = ''
			break
		}
		if (lines[i]?.includes('<script>')) {
			found = lines[i]
			line = i
			offending++
			break
		}
	}

	if (found && line < lines.length && lines[line].includes('<script>')) {
		console.log('\n' + Bun.color('gray', 'ansi') + path)
		console.log(Bun.color('green', 'ansi') + 'Found <script> tag at line:', line, ':', found)

		const newLines = lines.map((l, i) => {
			if (i === line) return l.replace('<script>', '<script lang="ts">')
			return l
		})

		await Bun.write(path, newLines.join('\n'))
	}
}

console.log()
console.log(Bun.color('grey', 'ansi') + 'Files missing lang="ts" attribute:', offending)
console.log(Bun.color('grey', 'ansi') + 'Skipped files:', skipped)
