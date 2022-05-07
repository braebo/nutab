<script>
	export let hidden = false
</script>

<svg width="10" height="8" viewBox="0 0 85 70" fill="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">
	<path
		class:hidden
		d="M3.88813 65.937L7.21214 68.0827C10.4602 70.1794 14.7929 69.2461 16.8897 65.9981L40.1019 30.0398C41.2805 28.2139 43.9491 28.2081 45.1357 30.0288L68.5784 65.9992C70.6805 69.2438 75.0148 70.1699 78.2593 68.0678L81.5798 65.9165C84.8243 63.8144 85.7504 59.4801 83.6483 56.2355L49.6589 3.77397C47.6981 1.13415 45.756 0.692804 42.8191 0.645343C39.7897 0.596388 37.1297 1.66805 35.7055 3.74141L1.80347 56.2595C-0.293237 59.5075 0.6401 63.8403 3.88813 65.937Z"
		fill="rgba(var(--light-d-rgb), 0.5)"
	/>
</svg>

<style>
	path {
		transform-origin: center;
		transition: 0.15s ease-out;
		transform: rotate(180deg) scale(1, 0.75);
	}
	.hidden {
		transform: rotate(90deg) scale(1, 0.5);
	}
</style>
