<script lang="ts">
	import BookmarkArt from './BookmarkArt.svelte'
	import ImageURL from './ImageURL.svelte'
	import Tooltip from '../Tooltip.svelte'

	import { bookmarkEditor } from '$lib/stores'
	import fetchMeta from '$lib/feeds/fetchMeta'
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

	async function getAutoImage() {
		const meta = await fetchMeta($bookmarkEditor?.url, true)
		log({ meta })

		if (meta?.image) {
			$bookmarkEditor.image = meta.image
		} else {
			autoImageError = true
			log('No image found for bookmark: ' + $bookmarkEditor?.title, 'tomato')
			// TODO: Add an error toast and (maybe?) fallback to image then color
			if (!$bookmarkEditor?.url) {
				alert('Please enter a url first.')
			} else alert('No image found for the provided url.')
			// $activeBookmarks[i].autoImage = false
		}
	}
</script>

<div
	class="image-container"
	on:mouseout={() => (hovering = false)}
	on:blur={() => (hovering = false)}
	on:mouseover={() => (hovering = true)}
	on:focus={() => (hovering = true)}
>
	<!-- Settings -->

	<div class="icon-display-options" class:hovering>
		<div class="icon-mode-container">
			{#if $bookmarkEditor?.useImage}
				<div class="auto-image-btn" class:error={autoImageError} on:click={getAutoImage}>Auto Image</div>
				<ImageURL open />
			{/if}
		</div>
		<div class="checkboxes">
			<div class="color checkbox" on:click={useColor} class:active={colorMode}>
				<Tooltip content="Auto Image" placement="top" offset={[0, 8]} delay={[0, 250]}>
					<div class="radio">
						<div class="circle" class:checked={!$bookmarkEditor?.useImage} />
					</div>
				</Tooltip>
				<!-- <label class:hoveringColor for="color">Color</label> -->
			</div>
			<!-- <div class="auto-image checkbox">
				<Tooltip content="Auto Image" placement="top" offset={[0, 8]} delay={[0, 250]}>
					<div class="radio" on:click={useAutoImage}>
						<div class="circle" class:checked={$bookmarkEditor?.autoImage} />
					</div>
				</Tooltip>
			</div> -->
			<div class="image checkbox" on:click={useImage} class:active={$bookmarkEditor?.useImage}>
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<div class="radio">
					<div class="circle" class:checked={$bookmarkEditor?.useImage} />
				</div>
				<!-- <label class:hoveringImage for="image">Image</label> -->
			</div>
		</div>
	</div>

	<!-- Icon -->
	<!-- {#if $bookmarkEditor?.useImage || $bookmarkEditor?.autoImage}
		<div class="img-display">
			<img name="image" src={$bookmarkEditor?.image || icon} alt={$bookmarkEditor?.title} />
		</div>
	{:else} -->
	<div class="bookmark-art-container">
		<BookmarkArt
			--foreground={$bookmarkEditor?.foreground}
			--background={$bookmarkEditor?.background}
			--size="100px"
			--shadow=" 0px 4.7px 10px -3px rgba(0, 0, 0, 0.275), 0px 7.3px 5.6px -1px rgba(0, 0, 0, 0.09), 0px 14px 15px -1px rgba(0, 0, 0, 0.14)"
			title={$bookmarkEditor?.title}
		/>

		<div class="color-settings">
			{#if !$bookmarkEditor?.useImage}
				<input name="background" type="color" bind:value={$bookmarkEditor.background} />
				<input name="foreground" type="color" bind:value={$bookmarkEditor.foreground} />
			{/if}
		</div>
	</div>
	<!-- {/if} -->
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
		// gap: 1rem;
	}

	.icon-mode-container {
		position: relative;
		display: flex;
		align-items: center;
		height: 2.25rem;
		gap: 1rem;
	}

	.auto-image-btn {
		// position: absolute;
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

	// .image-input {
	// 	width: 80%;
	// }

	.checkboxes {
		display: flex;
		align-items: center;
		justify-content: center;
		// gap: 0.5rem;

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

	img {
		display: flex;

		width: auto;
		height: 100px;
		// margin: 2.5rem auto 0.5rem auto;

		animation: floatDown 1s forwards;

		animation-timing-function: cubic-bezier(0.175, 0.985, 0.12, 1);
	}

	.img-display {
		display: flex;
		align-items: center;
		position: relative;

		height: 110px;
		width: max-content;
		// min-height: 192px;
		margin: 0 auto;
	}

	.bookmark-art-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		// margin: 2rem auto;
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

	// .image-url-link-icon {
	// 	opacity: 0.5;
	// 	text-align: center;
	// 	cursor: pointer;
	// 	padding-top: 0.25rem;

	// 	&:hover {
	// 		opacity: 1;
	// 	}
	// }

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
