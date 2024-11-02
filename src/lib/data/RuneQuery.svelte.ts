import type { Subscriber, Unsubscriber } from 'svelte/store'

import { untrack } from 'svelte'

export interface ReadableQuery<T> {
	subscribe(
		this: void,
		run: Subscriber<T>,
		invalidate?: () => void,
	): {
		unsubscribe: Unsubscriber
	}
}

export type ReadableValue<T> = T extends ReadableQuery<infer U> ? U : never

export class RuneQuery<T = ReadableValue<ReadableQuery<unknown>>> {
	current = $state<T>()

	constructor(public readonly store: ReadableQuery<T>) {
		if ($effect.tracking()) {
			untrack(() => {
				store
					.subscribe((v) => {
						this.current = v
					})
					.unsubscribe()
			})

			$effect.pre(() => {
				return store.subscribe((v) => {
					this.current = v
				}).unsubscribe
			})
		} else {
			this.dispose = $effect.root(() => {
				untrack(() => {
					store
						.subscribe((v) => {
							this.current = v
						})
						.unsubscribe()
				})

				$effect.pre(() => {
					return store.subscribe((v) => {
						this.current = v
					}).unsubscribe
				})
			})
		}
	}

	dispose = () => {}
}
