<script lang="ts">
	import type { Settings } from '$lib/settings/settingsStore'
	import type { Bookmark } from '$lib/data/types'

	import BookmarkArt from '$lib/ui/BookmarkArt.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Tags from '$lib/ui/Tags.svelte'
	import { log } from 'fractils'
	import { onMount } from 'svelte'

	export let settings: Settings
	export let i: number
	export let bookmark_id: string
	export let editorSettings: Bookmark

	let hovering = false,
		tag = ''

	$: placeholder = descriptionHover ? 'description' : '+'
	let debug = false

	let descriptionInput: HTMLInputElement
	let descriptionHover = false

	function handleTags(event: CustomEvent) {
		tag = event.detail.tags
	}
	async function updateTags(event: CustomEvent, index: number, id: string) {
		editorSettings['tags'] = event.detail.tags
	}

	const hasFocus = (el: Element) => document.activeElement === el

	onMount(() => log(editorSettings))
</script>

{#if debug}
	<pre>{JSON.stringify(editorSettings, null, 2).split('"').join('')}</pre>
{/if}

<div class="settings-container">
	{#if editorSettings['image']}
		<img name="image" src={editorSettings['image']} alt={editorSettings['title']} />
	{:else}
		<BookmarkArt
			--foreground={editorSettings['foreground']}
			--background={editorSettings['background']}
			--size="100px"
			title={editorSettings['title']}
		/>
	{/if}

	<div class="setting title">
		<div id="title" contenteditable bind:innerHTML={editorSettings['title']} />
	</div>

	<div class="setting description">
		<!-- <label for='description'>description</label> -->
		<input
			name="description"
			{placeholder}
			type="text"
			bind:this={descriptionInput}
			bind:value={editorSettings['description']}
			on:mouseover={() => {
				descriptionHover = true
			}}
			on:mouseout={() => {
				descriptionHover = false
			}}
			on:focus={() => {
				descriptionHover = true
			}}
			on:blur={() => {
				descriptionHover = false
			}}
		/>
	</div>

	<div class="setting">
		<!-- <label for="url">url</label> -->
		<input name="url" type="text" bind:value={editorSettings['url']} />
	</div>

	<div class="setting">
		<!-- <label for="tags">tags</label> -->
		<!-- <input name="tags" type="text" bind:value={editorSettings['tags']} /> -->
		<div name="tags" class="tags">
			<Tags
				on:updateTags={(e) => updateTags(e, i, bookmark_id)}
				bind:tags={editorSettings['tags']}
				placeholder={'new tag'}
				on:tags={handleTags}
				autoComplete={false}
				allowPaste={true}
				onlyUnique={true}
				removeKeys={[46]}
				addKeys={[9, 13]}
				allowDrop={true}
				allowBlur={true}
				splitWith={'/'}
				name={'tags'}
				maxTags={10}
				minChars={2}
			/>
		</div>
	</div>

	<div class="buttons">
		<Button --colorHover="var(--warn)" --borderHover="1px solid var(--warn)">Cancel</Button>
		<Button --colorHover="var(--confirm)" --borderHover="1px solid var(--confirm)">Save</Button>
	</div>

	{#if editorSettings['image'] === null}
		<div class="colors">
			<div class="setting">
				<label for="background">background</label>
				<input name="background" type="color" bind:value={editorSettings['background']} />
			</div>

			<div class="setting">
				<label for="foreground">foreground</label>
				<input name="foreground" type="color" bind:value={editorSettings['foreground']} />
			</div>
		</div>
	{/if}
</div>

<style>
	.settings-container {
		display: flex;
		flex-direction: column;

		width: 500px;
		height: max-content;
		margin: 30vh auto;

		border-radius: 10px;
		background: var(--light-a);
		box-shadow: 0 5px 15px 5px #00000011;
	}

	.setting {
		display: flex;
		position: relative;
		justify-content: space-around;

		font-size: 1.3rem;
	}

	input {
		width: 70%;
		margin: 0.5rem 1rem;
		padding: 0 8px 0 8px;

		font-family: 'Abel';
		font-size: 1rem;

		color: var(--dark-a);
		border: 1px solid rgba(var(--light-b-rgb), 0);
		border-radius: 3px;
		outline: none;
		background: var(--light-a);
	}

	.tags {
		position: relative;

		width: 90%;
		height: 100%;
		margin: 1rem auto;

		font-family: var(--font-primary);
	}

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-end;
		justify-items: center;

		width: 15rem;
		margin: 2rem auto;

		gap: 1rem;
	}

	label {
		width: 10%;
		margin: 0 0 1rem auto;
		padding-top: 0.25rem;

		color: rgba(var(--dark-d-rgb), 0.5);

		text-align: center;
	}

	input:focus {
		border: 1px solid rgba(var(--light-b-rgb), 1);
	}

	input[name='url'] {
		margin: auto;
		margin-bottom: 1.1rem;

		font: 0.8rem monospace;

		color: var(--light-c);

		text-align: center;
	}

	input[name='description'] {
		margin: 0 auto 2rem auto;

		color: rgba(var(--dark-d-rgb), 0.75);

		text-align: center;
	}

	input[name='description']::placeholder {
		color: rgba(var(--dark-d-rgb), 0.25);
	}

	input[type='color'] {
		width: 50px;
	}

	label[for='foreground'],
	label[for='background'] {
		width: max-content;
	}

	.colors {
		display: flex;
		justify-content: space-evenly;
	}

	img {
		display: flex;

		width: 100px;
		height: 100px;
		margin: 2rem auto 0 auto;
	}

	.setting.title {
		width: max-content;
		margin: 0 auto auto auto;
	}

	#title {
		margin: 5px auto 5px auto;
		padding: 0.2rem 0.7rem;

		outline: none;

		transition: 0.2s;
	}
	#title:after {
		display: block;
		position: absolute;
		inset: 0;

		border: 1px solid rgba(var(--dark-d-rgb), 0);
		border-radius: 5px;

		content: '';

		transition: border-color 0.2s;
	}

	#title:focus:after {
		border-color: rgba(var(--dark-d-rgb), 0.5);
	}

	pre {
		position: absolute;
		top: 10rem;
		left: 0;

		padding: 1rem;

		font-size: 1.2rem;

		color: var(--dark-b);
		border-radius: 5px;
		background: rgba(var(--light-b-rgb), 0.5);

		z-index: -1;
	}
</style>
