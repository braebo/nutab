<script lang="ts">
	// Data
	import { init_db } from '$lib/data/transactions'
	import { settings } from '$lib/stores'

	// Components
	import Settings from '$lib/data/settings/Settings.svelte'
	import Inspector from '$lib/inspector/index.svelte'
	import Themer from '$lib/theme/Themer.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Main from '$lib/ui/Main.svelte'
	import Nav from '$lib/ui/Nav.svelte'
	import { Header } from '$lib/ui'

	// Utils
	import { randomizeBackground } from '$lib/stores/background'
	import { gradientBackground } from '$lib/stores'
	import { Fractils } from 'fractils'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { dev } from '$app/env'

	// Styles
	import '../styles/app.scss'
	import 'greset/greset.css'

	onMount(() => {
		if (!$settings.lockBackground) {
			randomizeBackground()
		}
		init_db()
	})
</script>

<template lang="pug">

	svelte:head
		title Nutab

	Fractils

	+if('dev')
		Inspector

	#app(style='{$settings.background}')
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
