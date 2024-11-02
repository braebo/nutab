// // Function

// function boilerplate() {
// 	let value = $state('foo')
// 	return {
// 		get value() {
// 			return value
// 		},
// 		set value(v) {
// 			value = v
// 		},
// 	}
// }

// export const foo = boilerplate()

// // Class

// class Boilerplate {
// 	value = $state(0)
// }
// export const count = new Boilerplate()

// // Anonymous Class

// export const count = new class {
// 	value = $state(0)
// }()

// // Poor man's hook

// const useBoilerplate = <T>(initial: T) => {
// 	let count = $state(initial)
// 	return [() => count, (v: T) => (count = v)]
// }
// export const [getCount, setCount] = useBoilerplate(0)
