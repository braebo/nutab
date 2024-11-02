<script lang="ts">
	import { page } from '$app/stores'

	const links = [
		['/about', 'About'],
		['/contact', 'Contact'],
	]
</script>

<nav>
	<ul>
		{#each links as [path, title] (title)}
			<li class:active={$page.url.pathname === path}>
				<a data-sveltekit-preload-code data-sveltekit-preload-data href={path}>
					{title}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: center;

		padding: 2rem;
	}

	ul {
		display: flex;
		gap: 2rem;

		z-index: 1;
	}

	li {
		list-style: none;

		color: var(--bg-a);
	}

	a {
		display: flex;
		align-items: center;

		height: 100%;

		font-size: 1.2rem;
		font-weight: 700;

		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 10%;

		color: currentColor;

		transition: color 0.15s linear;
	}

	a:hover {
		text-decoration: none;

		color: var(--theme-a);
	}

	.active {
		color: var(--theme-a);
	}
</style>
