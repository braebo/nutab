<script lang="ts">
	import FolderSidebar from '$lib/ui/Folders/FolderSidebar.svelte'
	import SettingsPanel from '$lib/settings/SettingsPanel.svelte'
	import Debugger from '$lib/utils/Debugger/Debugger.svelte'
	import { page } from '$app/stores'
	import { Header } from '$lib/ui'
	import 'greset/css/greset.css'
	import '../styles/app.scss'

	// import { showLoginPopup, authStore } from '$lib/auth/authStore'
	// import LoginPopup from '$lib/auth/LoginPopup.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import { onMount } from 'svelte'

	import Settings from '$lib/settings/Settings.svelte'
	import Themer from '$lib/theme/Themer.svelte'
	import Nav from '$lib/ui/Nav.svelte'

	// const { initAuth } = authStore

	onMount(() => {
		// initAuth()
	})

	const r = (max = 255) => Math.floor(Math.random() * Math.floor(max))
	const rgba = (opacity = 0.1) => [r(), r(), r(), opacity]

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

	#app(style="background-image: linear-gradient(to top, rgba({rgba()}), rgba({rgba()}));")
		Themer(size='{50}')

		Nav

		main
			slot
		
		FolderSidebar

		Settings

		Debugger

</template>
