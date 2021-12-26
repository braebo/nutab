// https://stackoverflow.com/questions/12802383/extending-array-in-typescript
declare global {
	interface Array<T> {
		rotate(count: number): Array<T>;
	}
}

// https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
Array.prototype.rotate = (function <T>() {
	const push = Array.prototype.push,
		splice = Array.prototype.splice;

	return function (count: number) {
		const len = this.length >>> 0;
		count = count >> 0;

		//* convert count to value in range [0, len)
		count = ((count % len) + len) % len;

		push.apply(this, splice.call(this, 0, count));
		return this;
	};
})();

export {}