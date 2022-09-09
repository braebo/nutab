<script lang="ts">
	// // Data
	// import { settings, activeTheme, activeBackground, type Settings as ISettings } from '$lib/stores'
	import { addMissingSettings } from '$lib/data/settings/addMissingSettings'
	// import { init_db } from '$lib/data/transactions'

	// // Components
	// import Settings from '$lib/data/settings/Settings.svelte'
	// import Inspector from '$lib/inspector/index.svelte'
	// import Themer from '$lib/theme/ThemeToggle.svelte'
	// import Modal from '$lib/ui/Modal.svelte'
	// import Main from '$lib/ui/Main.svelte'
	// import Nav from '$lib/ui/Nav.svelte'
	// import { Header } from '$lib/ui'

	// // Utils
	// import { initBackground, randomizeBackground } from '$lib/theme'
	// import { Fractils, theme } from 'fractils'
	// import { dev } from '$app/environment'
	// import { page } from '$app/stores'
	import { onMount } from 'svelte'

	// Styles
	import '../styles/app.scss'
	import 'greset/greset.css'

	import { exportBookmarks } from '$lib/data/importExport'

	onMount(async () => {
		await addMissingSettings()
		// await init_db()

		// initBackground()
	})
</script>

<template lang="pug">

	button.btn(on:click!='{() => exportBookmarks()}') Operation Rescue Derpcatto

	svelte:head
		title Nutab

	//- Fractils

	//- +if('dev')
	//- 	Inspector

	#app
	//- #app(style='{$activeBackground}')
		//- Themer(size='{50}')

		Nav

		Main
			slot

		//- Settings

</template>

<style>
	#app {
		max-height: 100vh;

		overflow: hidden;
	}
	button {
		width: 15rem;
		height: 5rem;
		font-family: var(--font-a);
		font-size: 1.2rem;
		margin: 5rem auto;
		color: white;
		background: tomato;
		animation: derp 2s infinite;
	}

	@keyframes derp {
		0% {
			filter: hue-rotate(0deg);
		}
		100% {
			filter: hue-rotate(360deg);
		}
	}
</style>
