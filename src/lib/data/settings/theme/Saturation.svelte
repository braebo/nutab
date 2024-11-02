<script lang="ts">
	import type { Settings } from '$lib/data/types'

	import { settings } from '$lib/stores/settings.svelte'
	import { createGradient } from '$lib/theme_og'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import Control from '../grid/Control.svelte'
	import Range from '$lib/ui/Range.svelte'

	interface Props {
		thisTheme: keyof Settings['theme']
	}

	let { thisTheme }: Props = $props()

	const updateBg = () => {
		settings.theme[thisTheme].background = createGradient(thisTheme)
	}
</script>

<div style:min-width="100%">
	<Control --width="75%">
		<Tooltip content="Saturation" placement="left" offset={[0, 15]} delay={[350, 100]}>
			<Range
				name="saturation"
				range={{ min: 0, max: 255 }}
				bind:value={settings.theme[thisTheme].gradientOpacity}
				oninput={updateBg}
				vertical
				truncate
			/>
		</Tooltip>
	</Control>
</div>
