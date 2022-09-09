<script lang="ts">
	// Data
	import { settings, activeTheme, activeBackground, type Settings as ISettings } from '$lib/stores'
	import { addMissingSettings } from '$lib/data/settings/addMissingSettings'
	import { init_db } from '$lib/data/transactions'

	// Components
	import Settings from '$lib/data/settings/Settings.svelte'
	import Inspector from '$lib/inspector/index.svelte'
	import Themer from '$lib/theme/ThemeToggle.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Main from '$lib/ui/Main.svelte'
	import Nav from '$lib/ui/Nav.svelte'
	import { Header } from '$lib/ui'

	// Utils
	import { initBackground, randomizeBackground } from '$lib/theme'
	import { Fractils, theme } from 'fractils'
	import { dev } from '$app/environment'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	// Styles
	import '../styles/app.scss'
	import 'greset/greset.css'

	onMount(async () => {
		await addMissingSettings()

		initBackground()

		init_db()
	})
</script>

<template lang="pug">

	svelte:head
		title Nutab

	Fractils

	+if('dev')
		Inspector

	#app(style='{$activeBackground}')
		Themer(size='{50}')

		Nav

		Main
			slot

		Settings

</template>

<style>
	#app {
		max-height: 100vh;

		overflow: hidden;
	}
</style>
