<script lang="ts">
	import BookmarkEditorIcon from './BookmarkEditorIcon.svelte'
	import ImageURL from './ImageURL.svelte'
	import Tooltip from '../Tooltip.svelte'

	import { bookmarkEditor } from '$lib/stores'
	import fetchMeta from '$lib/feeds/fetchMeta'
	import { fly } from 'svelte/transition'
	import { log } from 'fractils'

	$: autoImageError = false

	let colorMode = !$bookmarkEditor?.useImage
	let hovering = false

	function useImage() {
		$bookmarkEditor.useImage = true
	}

	function useColor() {
		$bookmarkEditor.useImage = false
	}

	let loading = false

	async function getAutoImage() {
		loading = true

		let url = $bookmarkEditor?.url.startsWith('https://') ? $bookmarkEditor?.url : 'https://' + $bookmarkEditor?.url

		url = url.replace('http://', '')

		const meta = await fetchMeta(url, true, true)

		if (meta?.image) {
			$bookmarkEditor.image = meta.image
			$bookmarkEditor.autoImage = true
		} else {
			autoImageError = true
			log('No image found for bookmark: ' + $bookmarkEditor?.title, 'tomato')
			$bookmarkEditor.autoImage = false
			// TODO: Add an error toast?
			if (!$bookmarkEditor?.url) {
				alert('Please enter a url first.')
			} else alert('No image found for the provided url.')
		}
		loading = false
	}
</script>

<div
	class="image-container"
	on:mouseout={() => (hovering = false)}
	on:blur={() => (hovering = false)}
	on:mouseover={() => (hovering = true)}
	on:focus={() => (hovering = true)}
>
	<div class="icon-display-options" class:hovering>
		<div class="icon-mode-container">
			{#if $bookmarkEditor?.useImage}
				<div class="auto-image-btn" class:loading in:fly={{ x: 10 }} out:fly={{ x: 10, duration: 100 }}>
					{#if !autoImageError}
						{#if !loading}
							<Tooltip
								content="Try_to_load_image_from_url"
								placement="left"
								offset={[0, 42]}
								delay={[400, 100]}
							>
								<div class:error={autoImageError} on:click={getAutoImage}>Auto</div>
							</Tooltip>
						{:else if loading}
							<div class:error={autoImageError}>loading...</div>
						{/if}
					{:else if autoImageError}
						<Tooltip content="No_image_found_for_url" placement="left" offset={[0, 42]} delay={[400, 100]}>
							<div class:error={autoImageError}>Not Found</div>
						</Tooltip>
					{/if}
				</div>
				<ImageURL open />
			{/if}
		</div>

		<div class="checkboxes">
			<Tooltip content="Color_Background" placement="left" offset={[0, 5]} delay={[0, 0]}>
				<div class="color checkbox" on:click={useColor} class:active={colorMode}>
					<div class="radio">
						<div class="circle" class:checked={!$bookmarkEditor?.useImage} />
					</div>
				</div>
			</Tooltip>

			<Tooltip content="Image_Background" placement="right" offset={[0, 10]} delay={[0, 0]}>
				<div class="image checkbox" on:click={useImage} class:active={$bookmarkEditor?.useImage}>
					<div class="radio">
						<div class="circle" class:checked={$bookmarkEditor?.useImage} />
					</div>
				</div>
			</Tooltip>
		</div>
	</div>

	<div class="bookmark-art-container">
		<BookmarkEditorIcon
			--foreground={$bookmarkEditor?.foreground}
			--background={$bookmarkEditor?.background}
			--size="100px"
			--shadow=" 0px 4.7px 10px -3px rgba(0, 0, 0, 0.275), 0px 7.3px 5.6px -1px rgba(0, 0, 0, 0.09), 0px 14px 15px -1px rgba(0, 0, 0, 0.14)"
		/>

		<div class="color-settings">
			{#if $bookmarkEditor && !$bookmarkEditor?.useImage}
				<input name="background" type="color" bind:value={$bookmarkEditor.background} />
				<input name="foreground" type="color" bind:value={$bookmarkEditor.foreground} />
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.image-container {
		position: relative;
		margin-bottom: 2rem;
	}

	.icon-display-options {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		opacity: 0;
		transition: opacity 0.2s;

		&.hovering {
			opacity: 1;
		}
	}

	.icon-mode-container {
		position: relative;
		display: flex;
		align-items: center;
		height: 2.25rem;
		gap: 1rem;
	}

	.auto-image-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20%;
		height: 1.1rem;
		white-space: nowrap;
		font-size: 0.75rem;
		opacity: 0.5;
		outline: 1px solid var(--light-d);
		border-radius: 0.25rem;
		transition: opacity 0.2s;
		cursor: pointer;
		&:hover {
			opacity: 1;
		}
	}

	.checkboxes {
		display: flex;
		align-items: center;
		justify-content: center;

		margin-bottom: 0.5rem;
	}

	.checkbox {
		padding: 5px;
		cursor: pointer;
		opacity: 0.25;
		transition: opacity 0.2s;

		&:hover,
		&.active {
			opacity: 1;
		}
	}

	.bookmark-art-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		perspective: 1200px;
		transform-style: preserve-3d;

		animation: floatDown ease-out 1.25s forwards;

		animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
	}

	.color-settings {
		position: absolute;
		inset: 0 -10rem 0 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;

		width: max-content;
		margin: auto;
	}

	input[type='color'] {
		width: 30px;
		height: 30px;
		padding: 0;

		opacity: 0.2;
		&:hover {
			opacity: 1;
		}

		transition: opacity 0.2s;
		cursor: pointer;
	}

	/* 3d CSS Float Down Animation */
	@keyframes floatDown {
		0% {
			opacity: 0;

			transform: perspective(500px) translate3d(0, -25px, 50px) scale(1.2);
		}
		100% {
			opacity: 1;

			transform: perspective(500px) translate3d(0, 0, 0) scale(1);
		}
	}
</style>
