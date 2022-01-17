<script lang="ts">
	// Components
	import SettingsPanel from '$lib/data/settings/SettingsPanel.svelte'
	import FolderSidebar from '$lib/ui/Folders/FolderSidebar.svelte'
	import Debugger from '$lib/utils/Debugger/Debugger.svelte'
	import Settings from '$lib/data/settings/Settings.svelte'
	import Themer from '$lib/theme/Themer.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Nav from '$lib/ui/Nav.svelte'
	import { Header } from '$lib/ui'

	// Data
	import { init_db } from '$lib/data/transactions'

	// Utils
	import { randomBackground } from '$lib/data/settings/randomBackground'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	// Styles
	import 'greset/css/greset.css'
	import '../styles/app.scss'

	onMount(() => {
		init_db()
	})

	// turns `/foo/bar/baz` into `Baz`
	const pageTitle = (path: string) => {
		if (path === '/') return 'Home'
		const paths = path.split('/')
		const title = paths[paths.length - 1]
		return title.charAt(0).toUpperCase() + title.slice(1)
	}
</script>

<template lang="pug">

	svelte:head
		title {pageTitle($page.url.pathname)} · Nutab

	#app(style='{randomBackground()}')
		Themer(size='{50}')

		Nav

		main
			slot
		
		FolderSidebar

		Settings

		Debugger

</template>

<style>
	#app {
		max-height: 100vh;

		overflow: hidden;
	}
</style>
