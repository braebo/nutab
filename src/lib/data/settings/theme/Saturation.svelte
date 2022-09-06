<script lang="ts">
	import type { Settings } from '$lib/stores/settingsStore'

	import { settings, gradientBackground } from '$lib/stores'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import Control from '../grid/Control.svelte'
	import Range from '$lib/ui/Range.svelte'

	export let thisTheme: keyof Settings['theme']

	const updateBg = (e: Event) => ($settings.theme[thisTheme].background = $gradientBackground)
</script>

<div style:min-width="100%">
	<Control --width="75%">
		<Tooltip content="Saturation" placement="left" offset={[0, 15]} delay={[350, 100]}>
			<Range
				name="saturation"
				range={$settings.theme[thisTheme].gradientOpacity.range}
				bind:value={$settings.theme[thisTheme].gradientOpacity.value}
				on:input={updateBg}
				vertical
				truncate
			/>
		</Tooltip>
	</Control>
</div>
