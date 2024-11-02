export const globals = new (class GlobalState {
	cart = $state<string[]>([])

	constructor() {
		this.cart = JSON.parse(globalThis.localStorage?.getItem('cart') || '[]')

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem('cart', JSON.stringify(this.cart))
			})
		})
	}
})()
