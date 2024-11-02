<!-- <script lang="ts">
	// Data
	import { addMissingSettings } from '$lib/data/settings/addMissingSettings'
	import { settings } from '$lib/stores/settings.svelte'
	import { init_db } from '$lib/data/transactions.svelte'

	// Components
	import Settings from '$lib/data/settings/Settings.svelte'
	import Themer from '$lib/theme_og/ThemeToggle.svelte'
	import Inspector from '$lib/inspector/index.svelte'
	import Main from '$lib/ui/Main.svelte'
	import Nav from '$lib/ui/Nav.svelte'

	// Utils
	import { initBackground } from '$lib/theme_og'
	import { dev } from '$app/environment'
	import { Fractils } from 'fractils'
	import { onMount } from 'svelte'

	// Styles
	import '../styles/app.scss'
	import 'greset/greset.css'

	onMount(async () => {
		await addMissingSettings()

		await init_db()

		initBackground()
	})
</script>

<svelte:head>
	<title>Nutab</title>
</svelte:head>

<Fractils />

{#if dev}
	<Inspector />
{/if}

<div id="app" style={settings.activeBackground}>
	<Themer size={50} />

	<Nav />

	<Main>
		<slot />
	</Main>

	<Settings />
</div>

<style>
	#app {
		max-height: 100vh;

		overflow: hidden;
	}
</style> -->

<slot />
