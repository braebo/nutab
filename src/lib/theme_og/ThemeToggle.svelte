<script lang="ts">
	import { themer } from '$lib/theme/themer.svelte'
	import { fade, fly } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'
	import { onMount } from 'svelte'

	import Clouds from './graphics/Clouds.svelte'
	import Stars from './graphics/Stars.svelte'
	import Moon from './graphics/Moon.svelte'
	import Sun from './graphics/Sun.svelte'

	let {
		size,
	}: {
		size: number
	} = $props()

	let first = $state(true)

	function handleToggle() {
		// themer.mode = themer.mode === 'light' ? 'dark' : 'light'
		themer.preference = themer.preference === 'light' ? 'dark' : 'light'
		first = false
	}

	let mounted = $state(false)
	onMount(() => (mounted = true))
</script>

{#if mounted}
	{#key themer.mode}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			role="button"
			tabindex={0}
			class="theme-toggle"
			onclick={(e) => {
				e.preventDefault()
				handleToggle()
			}}
		>
			<span style:pointer-events="none">
				{#if themer.mode == 'light'}
					<div
						out:fade
						in:fly={{
							y: first ? -40 : 1,
							duration: first ? 2000 : 750,
							opacity: first ? 1 : 0,
							easing: quartOut,
						}}
					>
						<Sun {size} />
					</div>
					<Clouds {size} />
				{:else if themer.mode == 'dark'}
					<Stars {size} />
					<div
						out:fade
						in:fly={{
							y: first ? -40 : 1,
							duration: first ? 2000 : 750,
							opacity: first ? 1 : 0,
							easing: quartOut,
						}}
					>
						<Moon {size} />
					</div>
				{/if}
			</span>
		</div>
	{/key}
{/if}

<style lang="scss">
	.theme-toggle {
		position: absolute;
		top: 0px;

		width: 55px;
		height: 55px;

		z-index: 50;
		cursor: pointer;
		pointer-events: all;
	}
</style>
