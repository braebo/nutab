<script lang="ts">
	// Data
	import { init_db } from '$lib/data/transactions'

	// Components
	import SettingsPanel from '$lib/data/settings/SettingsPanel.svelte'
	import { settings } from '$lib/data/settings/settingsStore'
	import Debugger from '$lib/utils/Debugger/Debugger.svelte'
	import Settings from '$lib/data/settings/Settings.svelte'
	import Themer from '$lib/theme/Themer.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Main from '$lib/ui/Main.svelte'
	import Nav from '$lib/ui/Nav.svelte'
	import { Header } from '$lib/ui'

	// Utils
	import { randomBackground } from '$lib/data/settings/randomBackground'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { dev } from '$app/env'

	// Styles
	import 'greset/css/greset.css'
	import '../styles/app.scss'

	onMount(async () => {
		if (!$settings.lockBackground) {
			$settings.background = randomBackground()
		}
		init_db()
	})
</script>

<template lang="pug">

	svelte:head
		title Nutab

	#app(style='{$settings.background}')
		Themer(size='{50}')

		Nav

		Main
			slot

		Settings

		+if('dev')
			Debugger

</template>

<style>
	#app {
		max-height: 100vh;

		overflow: hidden;
	}
</style>
