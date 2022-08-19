<script lang="ts">
	import { settings, gradientBackground } from '$lib/stores'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import Range from '$lib/ui/Range.svelte'
	import Control from '../grid/Control.svelte'

	const updateBg = (e: Event) => ($settings.background = $gradientBackground)
</script>

<div style:min-width="100%">
	<Tooltip content="Saturation" placement="left" offset={[0, 15]} delay={[350, 100]}>
		<Control label="Saturation" --width="50%">
			<Range
				name="saturation"
				range={$settings.ranges.gradientOpacity.range}
				bind:value={$settings.ranges.gradientOpacity.value}
				on:input={updateBg}
				vertical
				truncate
			/>
		</Control>
	</Tooltip>
</div>
