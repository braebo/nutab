<script lang="ts">
	// Data
	import { init_db } from '$lib/data/transactions'

	// Components
	import { settings } from '$lib/data/settings/settingsStore'
	import Settings from '$lib/data/settings/Settings.svelte'
	import Inspector from '$lib/inspector/index.svelte'
	import Themer from '$lib/theme/Themer.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Main from '$lib/ui/Main.svelte'
	import Nav from '$lib/ui/Nav.svelte'
	import { Header } from '$lib/ui'

	// Utils
	import { randomBackground } from '$lib/data/settings/randomBackground'
	import { Fractils } from 'fractils'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { dev } from '$app/env'

	// Styles
	import '../styles/app.scss'
	import 'greset/greset.css'

	import { fml } from '$lib/ui/Scrollbar.svelte'

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

	Fractils

	+if('dev')
		Inspector
	
	pre {JSON.stringify($fml, null, 2)}

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

	pre {
		position: fixed;
		top: 0;
		left: 5rem;
	}
</style>
