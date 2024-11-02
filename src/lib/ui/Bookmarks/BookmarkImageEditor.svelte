<script lang="ts">
	import BookmarkEditorIcon from './BookmarkEditorIcon.svelte'
	import ImageURL from './ImageURL.svelte'
	import Tooltip from '../Tooltip.svelte'

	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import fetchMeta from '$lib/feeds/fetchMeta'
	import { fly } from 'svelte/transition'
	import { log } from 'fractils'

	let autoImageError = $state(false)

	let colorMode = !bookmarkEditor.editor?.useImage
	let hovering = $state(false)

	function useImage() {
		if (!bookmarkEditor.editor) return
		bookmarkEditor.editor.useImage = true
	}

	function useColor() {
		if (!bookmarkEditor.editor) return
		bookmarkEditor.editor.useImage = false
	}

	let loading = $state(false)

	async function getAutoImage() {
		loading = true

		if (!bookmarkEditor.editor) return

		let url = bookmarkEditor.editor?.url.startsWith('https://')
			? bookmarkEditor.editor?.url
			: 'https://' + bookmarkEditor.editor?.url

		url = url.replace('http://', '')

		const meta = await fetchMeta(url, true, true)

		if (meta?.image) {
			bookmarkEditor.editor.image = meta.image
			bookmarkEditor.editor.autoImage = true
		} else if (meta?.icon) {
			bookmarkEditor.editor.image = meta.icon
			bookmarkEditor.editor.autoImage = true
		} else {
			autoImageError = true
			log('No image found for bookmark: ' + bookmarkEditor.editor?.title, 'tomato')
			bookmarkEditor.editor.autoImage = false
			// TODO: Add an error toast?
			if (!bookmarkEditor.editor?.url) {
				alert('Please enter a url first.')
			} else alert('No image found for the provided url.')
		}
		loading = false
	}
</script>

<div
	role="region"
	class="image-container"
	onmouseout={() => (hovering = false)}
	onblur={() => (hovering = false)}
	onmouseover={() => (hovering = true)}
	onfocus={() => (hovering = true)}
>
	<div class="icon-display-options" class:hovering>
		<div class="icon-mode-container">
			{#if bookmarkEditor.editor?.useImage}
				<div
					class="auto-image-btn"
					class:loading
					in:fly={{ x: 10 }}
					out:fly={{ x: 10, duration: 100 }}
				>
					{#if !autoImageError}
						{#if !loading}
							<Tooltip
								content="Try_to_load_image_from_url"
								placement="left"
								offset={[0, 42]}
								delay={[400, 100]}
							>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div
									role="button"
									tabindex="0"
									class:error={autoImageError}
									onclick={getAutoImage}
								>
									Auto
								</div>
							</Tooltip>
						{:else if loading}
							<div class:error={autoImageError}>loading...</div>
						{/if}
					{:else if autoImageError}
						<Tooltip
							content="No_image_found_for_url"
							placement="left"
							offset={[0, 42]}
							delay={[400, 100]}
						>
							<div class:error={autoImageError}>Not Found</div>
						</Tooltip>
					{/if}
				</div>
				<ImageURL open />
			{/if}
		</div>

		<div class="checkboxes">
			<Tooltip content="Color_Background" placement="left" offset={[0, 5]} delay={[0, 0]}>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					role="button"
					tabindex="0"
					class="color checkbox"
					onclick={useColor}
					class:active={colorMode}
				>
					<div class="radio">
						<div class="circle" class:checked={!bookmarkEditor.editor?.useImage}></div>
					</div>
				</div>
			</Tooltip>

			<Tooltip content="Image_Background" placement="right" offset={[0, 10]} delay={[0, 0]}>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					role="button"
					tabindex="0"
					class="image checkbox"
					onclick={useImage}
					class:active={bookmarkEditor.editor?.useImage}
				>
					<div class="radio">
						<div class="circle" class:checked={bookmarkEditor.editor?.useImage}></div>
					</div>
				</div>
			</Tooltip>
		</div>
	</div>

	<div class="bookmark-art-container">
		<BookmarkEditorIcon
			--foreground={bookmarkEditor.editor?.foreground}
			--background={bookmarkEditor.editor?.background}
			--size="100px"
			--shadow=" 0px 4.7px 10px -3px rgba(0, 0, 0, 0.275), 0px 7.3px 5.6px -1px rgba(0, 0, 0, 0.09), 0px 14px 15px -1px rgba(0, 0, 0, 0.14)"
		/>

		<div class="color-settings">
			{#if bookmarkEditor.editor && !bookmarkEditor.editor?.useImage}
				<input
					name="background"
					type="color"
					bind:value={bookmarkEditor.editor.background}
				/>
				<input
					name="foreground"
					type="color"
					bind:value={bookmarkEditor.editor.foreground}
				/>
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
		outline: 1px solid color-mix(in srgb, var(--fg-d) 100%, transparent);
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
		transition: opacity 0.2s;
		cursor: pointer;

		&:hover {
			opacity: 1;
		}
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
