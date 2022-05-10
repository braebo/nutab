import { onDestroy, tick } from 'svelte'
import { tweened } from 'svelte/motion'
import { derived } from 'svelte/store'

const a = tweened(0, { duration: 500 })
const b = tweened(0)
const c = tweened(100)

let stageTimer: NodeJS.Timeout

let t = 1
export const animate = async () => {
	await tick()
	if (!window) return
	requestAnimationFrame(() => {
		switch (t) {
			case 0:
				a.set(0, { duration: 0 })
				b.set(0, { duration: 0 })
				c.set(0.01, { duration: 0 })
				break
			case 1:
				a.set(-50)
				b.set(20)
				c.set(150)
				break
			case 2:
				a.set(0)
				b.set(100)
				c.set(150)
				break
			case 3:
				a.set(150)
				b.set(200)
				c.set(300)
				break
			default:
				break
		}
		if (t < 3) t++
		else t = 0
		stageTimer = setTimeout(() => {
			animate()
			clearTimeout(stageTimer)
		}, 300)
	})
}

export const skeletonAnimation = derived(
	[a, b, c],
	([$a, $b, $c]) => `linear-gradient(to right, var(--light-b) ${$a}%, var(--light-a) ${$b}%, var(--light-b) ${$c}%)`
)

// onDestroy(() => (stageTimer = null))
