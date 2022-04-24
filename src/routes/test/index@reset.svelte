<script lang="ts">
	import type { IMeta } from '$lib/feeds/fetchMeta'
	import fetchMeta from '$lib/feeds/fetchMeta'
	import { onMount } from 'svelte'

	let data: IMeta = {} as IMeta

	onMount(async () => {
		data = await fetchMeta('https://fractils.fractal-hq.com')
	})
</script>

<template lang="pug">
	
	pre {JSON.stringify(data, null, 2)}

</template>
