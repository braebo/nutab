<script lang="ts">
	import { page } from '$app/stores'

	const links = [
		['/about', 'About'],
		['/contact', 'Contact']
	]
</script>

<template lang="pug">

	nav
		ul
			+each('links as [path, title], i (title)')

				li(class:active='{$page.path === path}')

					a(
						sveltekit:prefetch
						href='{path}'
					) {title}

</template>

<style>
	nav {
		display: flex;
		justify-content: center;
	}

	ul {
		display: flex;
		gap: 2rem;

		z-index: 1;
	}

	li {
		list-style: none;
	}

	nav a {
		display: flex;
		align-items: center;

		height: 100%;

		font-size: 0.8rem;
		font-weight: 700;

		color: var(--dark-a);

		transition: color 0.15s linear;

		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 10%;
	}

	a:hover {
		color: var(--brand-a);
	}
</style>
