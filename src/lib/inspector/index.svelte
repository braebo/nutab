<script lang="ts">
	import Inspector from './Inspector.svelte'
	// import {
	// 	activeFolderBookmarks,
	// 	activeBookmarks,
	// 	activeFolder,
	// 	tagFilter,
	// } from '$lib/data/dbStore'

	import { db } from '$lib/data/db.svelte'

	import { settings, cMenu } from '$lib/stores/settings.svelte'
	import { grid } from '$lib/stores/grid.svelte'
	// import * as stores from '$lib/stores'
</script>

<Inspector
	register={{
		// ...stores,
		activeBookmarks: db.activeBookmarks,
		activeFolder: db.activeFolder,
		tagFilter: db.tagFilter,
		cMenu: cMenu,
		settings: settings,
		// gridDimensions: grid.dimensions,
		// width: grid.width,
		// iconSize: grid.iconSize,
		// gap: grid.gap,
		// items: grid.items,
		grid: {
			dimensions: grid.dimensions,
			width: grid.width,
			iconSize: grid.iconSize,
			gap: grid.gap,
			items: grid.items,
		},
	}}
/>
