//- Doesn't work.

// import type { Writable } from 'svelte/store'

// import { liveQuery as dexieLiveQuery } from 'dexie'
// import { fromStore } from 'svelte/store'

// export const liveQuery = <T>(q: () => T | Promise<T>) =>
// 	fromStore({
// 		subscribe: (run, invalidate) => {
// 			return dexieLiveQuery(q).subscribe(run as () => T, invalidate).unsubscribe
// 		},
// 	} as Writable<T>)
