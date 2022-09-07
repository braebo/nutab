<script lang="ts">
	import TabOptions from '$lib/ui/TabOptions.svelte'
	import ThemeEditor from './ThemeEditor.svelte'
	import { settings } from '$lib/stores'
	import { fly } from 'svelte/transition'

	import Clouds from '$lib/theme/graphics/Clouds.svelte'
	import Stars from '$lib/theme/graphics/Stars.svelte'
	import Moon from '$lib/theme/graphics/Moon.svelte'
	import Sun from '$lib/theme/graphics/Sun.svelte'

	let selected = $settings.sharedTheme ? 0 : 1

	const toggleShared = (e: CustomEvent) => {
		$settings.sharedTheme = !e.detail.index
	}

	const size = 60

	const _in = (direction: Record<string, number>) => ({ ...direction, duration: 250, delay: 150 })
	const _out = (direction: Record<string, number>) => ({ ...direction, duration: 250 })
</script>

<div class="theme-settings">
	<div class="shared" in:fly={_in({ y: 10 })} out:fly={_out({ y: 10 })}>
		<TabOptions options={['Shared', 'Separate']} bind:selected on:select={toggleShared} />
	</div>

	{#if $settings.sharedTheme}
		<div class="content">
			<div class="editor" in:fly={_in({ y: 10 })} out:fly={_out({ y: 10 })}>
				<ThemeEditor thisTheme="shared" />
			</div>
		</div>
	{:else}
		<div class="content">
			<div class="modes">
				<div class="editor light" in:fly={_in({ x: -10 })} out:fly={_out({ x: -10 })}>
					<div class="title">
						<div class="h3">Light</div>
						<div class="sun">
							<Sun {size} />
							<Clouds {size} t_in={{ x: -20, duration: 3000 }} />
						</div>
					</div>
					<ThemeEditor thisTheme="light" />
				</div>
				<div class="editor dark" in:fly={_in({ x: 10 })} out:fly={_out({ x: 10 })}>
					<div class="title">
						<div class="h3">Dark</div>
						<div class="moon">
							<Moon {size} />
							<Stars starSize={10} {size} />
						</div>
					</div>
					<ThemeEditor thisTheme="dark" />
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.theme-settings {
		position: relative;

		height: 90%;
	}

	.content {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		height: 21rem;
		width: 100%;
	}

	.modes {
		display: flex;
		color: var(--dark-d);
		justify-content: space-between;
		width: 100%;
	}

	.editor {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		margin-top: 3rem;

		&.light {
			// transform: translate(-2rem, -0.5rem);
			.title {
				margin-right: -3.5rem;
			}
			.sun {
				transform: translate(120px, -45px);
			}
		}

		&.dark {
			// transform: translate(2rem, -0.5rem);
			.title {
				margin-right: 3rem;
			}
			.moon {
				transform: translate(205px, -45px);
			}
		}
	}

	.title {
		position: relative;

		color: var(--dark-d);
		opacity: 0.75;

		font-size: 1.5rem;
		font-variation-settings: 'wght' 200;
		font-family: var(--font-a);
		letter-spacing: 2px;
		text-align: center;
	}

	.shared {
		inset: 0;

		width: 33%;
		margin: auto;
	}
</style>
