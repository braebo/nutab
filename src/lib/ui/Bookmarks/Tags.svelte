<script lang="ts">
	import { fly } from 'svelte/transition'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	let tag = ''
	let arrelementsmatch: any[] = []
	let regExpEscape = (s: string) => {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
	}
	let blurred = true
	let tagInput: HTMLInputElement

	export let tags: string[] = []
	export let addKeys: number[] = [13]
	export let maxTags: boolean | number = false
	export let onlyUnique = false
	export let removeKeys = [8]
	export let placeholder = ''
	export let allowPaste = false
	export let allowDrop = false
	export let splitWith = ','
	export let autoComplete: string[] | Function | boolean = false
	export let autoCompleteKey: number = 0
	export let name = 'svelte-tags-input'
	export let id = uniqueID()
	export let allowBlur = false
	export let disable = false
	export let minChars = 1
	export let onlyAutocomplete = false
	export let labelText = name
	export let labelShow = false
	$: tags
	$: addKeys
	$: maxTags
	$: onlyUnique
	$: removeKeys
	$: placeholder
	$: allowPaste
	$: allowDrop
	$: splitWith
	$: autoComplete
	$: autoCompleteKey
	$: name
	$: id
	$: allowBlur
	$: disable
	$: minChars
	$: onlyAutocomplete
	$: labelText
	$: labelShow
	$: matchsID = id + '_matchs'
	let storePlaceholder = placeholder
	function setTag(input: KeyboardEvent) {
		const currentTag = (input.target as HTMLInputElement).value

		if (addKeys) {
			addKeys.forEach(function (key) {
				if (key === input.keyCode) {
					if (currentTag) input.preventDefault()

					/* switch (input.keyCode) {
					case 9:
						// TAB add first element on the autoComplete list
						if (autoComplete && document.getElementById(matchsID)) {                        
							addTag(document.getElementById(matchsID).querySelectorAll("li")[0].textContent);
						} else {
							addTag(currentTag);
						}                    
						break;
					default:
						addTag(currentTag);
						break;
					} */
					if (autoComplete && document.getElementById(matchsID)) {
						addTag(document.getElementById(matchsID).querySelectorAll('li')[0].textContent)
					} else {
						addTag(currentTag)
					}
				}
			})
		}

		if (removeKeys) {
			removeKeys.forEach(function (key) {
				if (key === input.keyCode && tag === '') {
					tags.pop()
					tags = tags
					dispatch('tags', {
						tags: tags
					})
					arrelementsmatch = []
					;(document.getElementById(id) as HTMLInputElement).readOnly = false
					placeholder = storePlaceholder
					document.getElementById(id).focus()
				}
			})
		}

		// ArrowDown : focus on first element of the autocomplete
		if (input.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
			event.preventDefault()
			;(document.getElementById(matchsID).querySelector('li:first-child') as HTMLInputElement).focus()
		} // ArrowUp : focus on last element of the autocomplete
		else if (input.keyCode === 38 && autoComplete && document.getElementById(matchsID)) {
			event.preventDefault()
			;(document.getElementById(matchsID).querySelector('li:last-child') as HTMLInputElement).focus()
		}
	}
	function addTag(currentTag: string) {
		if (typeof currentTag === 'object' && currentTag) {
			if (!autoCompleteKey) {
				return console.error("'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects")
			}
			var currentObjTags = currentTag
			// @ts-ignore
			currentTag = currentTag[autoCompleteKey].trim()
		} else {
			console.log(currentTag)
			currentTag = currentTag.trim()
		}

		if (currentTag == '') return
		if (maxTags && tags.length == maxTags) return
		if (onlyUnique && tags.includes(currentTag)) return
		if (onlyAutocomplete && arrelementsmatch.length === 0) return

		tags.push(currentObjTags ? currentObjTags : currentTag)
		tags = tags
		tag = ''
		dispatch('tags', {
			tags: tags
		})

		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = []
		document.getElementById(id).focus()
		if (maxTags && tags.length == maxTags) {
			;(document.getElementById(id) as HTMLInputElement).readOnly = true
			placeholder = ''
		}
	}
	function removeTag(i: number) {
		tags.splice(i, 1)
		tags = tags
		dispatch('tags', {
			tags: tags
		})

		// Hide autocomplete list
		arrelementsmatch = []
		;(document.getElementById(id) as HTMLInputElement).readOnly = false
		placeholder = storePlaceholder
		// Focus on svelte tags input
		// document.getElementById(id).focus()
	}
	function onPaste(e: ClipboardEvent) {
		if (!allowPaste) return
		e.preventDefault()
		const data = getClipboardData(e)
		const tags = splitTags(data).map((tag: string) => addTag(tag))
	}
	function onDrop(e: DragEvent) {
		if (!allowDrop) return
		e.preventDefault()
		const data = e.dataTransfer.getData('Text')
		const tags = splitTags(data).map((tag: string) => addTag(tag))
	}
	function onBlur(e: Event, tag: string) {
		if (!document.getElementById(matchsID) && allowBlur) {
			event.preventDefault()
			// TODO: Fix adding tag on blue
			if (tag) addTag(tag)
		}
		blurred = true
	}
	function getClipboardData(e: ClipboardEvent) {
		if ((<any>window).clipboardData) {
			return (<any>window).clipboardData.getData('Text')
		}
		if (e.clipboardData) {
			return e.clipboardData.getData('text/plain')
		}
		return ''
	}
	function splitTags(data: string) {
		return data.split(splitWith).map((tag) => tag.trim())
	}
	async function getMatchElements(input: KeyboardEvent) {
		if (!autoComplete) return
		let autoCompleteValues = []

		if (Array.isArray(autoComplete)) {
			autoCompleteValues = autoComplete
		}

		if (typeof autoComplete === 'function') {
			if (autoComplete.constructor.name === 'AsyncFunction') {
				autoCompleteValues = await autoComplete()
			} else {
				autoCompleteValues = autoComplete()
			}
		}

		var value = (input.target as HTMLInputElement).value

		// Escape
		if (value == '' || input.keyCode === 27 || value.length < minChars) {
			arrelementsmatch = []
			return
		}

		if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
			if (!autoCompleteKey) {
				return console.error("'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects")
			}
			var matchs = autoCompleteValues
				.filter((e: string) => e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()))
				.map((matchTag: string) => {
					return {
						label: matchTag,
						search: matchTag[autoCompleteKey].replace(
							RegExp(regExpEscape(value.toLowerCase()), 'i'),
							'<strong>$&</strong>'
						)
					}
				})
		} else {
			var matchs = autoCompleteValues
				.filter((e: string) => e.toLowerCase().includes(value.toLowerCase()))
				.map((matchTag: string) => {
					return {
						label: matchTag,
						search: matchTag.replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), '<strong>$&</strong>')
					}
				})
		}
		if (onlyUnique === true && !autoCompleteKey) {
			// @ts-ignore
			matchs = matchs.filter((tag: string) => !tags.includes(tag.label))
		}
		arrelementsmatch = matchs
	}
	function navigateAutoComplete(
		event: KeyboardEvent,
		autoCompleteIndex: number,
		autoCompleteLength: number,
		autoCompleteElement: string
	) {
		if (!autoComplete) return

		event.preventDefault()
		// ArrowDown
		if (event.keyCode === 40) {
			// Last element on the list ? Go to the first
			if (autoCompleteIndex + 1 === autoCompleteLength) {
				;(document.getElementById(matchsID).querySelector('li:first-child') as HTMLInputElement).focus()
				return
			}
			document.getElementById(matchsID).querySelectorAll('li')[autoCompleteIndex + 1].focus()
		} else if (event.keyCode === 38) {
			// ArrowUp
			// First element on the list ? Go to the last
			if (autoCompleteIndex === 0) {
				;(document.getElementById(matchsID).querySelector('li:last-child') as HTMLInputElement).focus()
				return
			}
			document.getElementById(matchsID).querySelectorAll('li')[autoCompleteIndex - 1].focus()
		} else if (event.keyCode === 13) {
			// Enter
			addTag(autoCompleteElement)
		} else if (event.keyCode === 27) {
			// Escape
			arrelementsmatch = []
			document.getElementById(id).focus()
		}
	}
	function uniqueID() {
		return 'sti_' + Math.random().toString(36).substr(2, 9)
	}
	function handleFocus() {
		blurred = false
		tagInput.placeholder = ''
	}
	function handleBlur(e: Event) {
		onBlur(e, tag)
		tagInput.placeholder = 'new tag'
	}
</script>

<div class="input-layout" class:sti-layout-disable={disable}>
	{#if tags.length > 0}
		{#each tags as tag, i}
			<span class="input-tag">
				{#if typeof tag === 'string'}
					<span class="hashtag">#</span>
					{tag}
				{:else}
					{tag[autoCompleteKey]}
				{/if}
				{#if !disable}
					<Tooltip content="Delete" placement="top" offset={[0, 8]} delay={[1000, 150]}>
						<div class="input-tag-remove" on:click|stopPropagation={() => removeTag(i)}>&#215;</div>
					</Tooltip>
				{/if}
			</span>
		{/each}
	{/if}
	<br />
	<input
		type="text"
		{name}
		{id}
		bind:this={tagInput}
		bind:value={tag}
		on:keydown={setTag}
		on:keyup={getMatchElements}
		on:paste={onPaste}
		on:drop={onDrop}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:click|stopPropagation
		class="input new-tag"
		{placeholder}
		disabled={disable}
		autocomplete="off"
	/>
</div>

{#if autoComplete && arrelementsmatch.length > 0 && !blurred}
	<div class="input-matchs-parent" transition:fly|local={{ y: 3, duration: 150 }}>
		<ul id="{id}_matchs" class="input-matchs">
			{#each arrelementsmatch as element, index}
				<li
					tabindex="-1"
					on:keydown={(e) => navigateAutoComplete(e, index, arrelementsmatch.length, element.label)}
					on:click|stopPropagation={() => addTag(element.label)}
				>
					{@html element.search}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.hashtag {
		padding: 0 2px;

		color: var(--light-b);

		font-size: 14px;

		transform: translate(-2px, 2px);
	}

	.input,
	.input-tag,
	.input-matchs {
		height: max-content;
		margin-right: 0.5rem;

		margin-bottom: 1rem;

		/* align-items: center; */

		background: none;

		font-family: inherit;
		font-size: 1rem;
	}

	.input-layout {
		display: flex;
		flex-wrap: wrap;
		position: relative;

		align-items: center;
		justify-content: center;
		justify-items: center;

		max-width: 100%;
		margin: auto;

		border: solid 1px rgba(var(--light-b-rgb), 0);
		border-radius: 2px;
	}

	.input {
		display: flex;
		flex: 1;

		margin: auto;

		border: solid 1px rgba(var(--light-b-rgb), 0);
		color: var(--light-c);
		border-radius: 4px;

		font-family: inherit;

		transition: all 0.3s;
		box-flex: 1;
	}

	.input:focus {
		outline: 0;
	}

	input::-webkit-input-placeholder {
		color: transparent;
	}

	.input-layout:hover .input::-webkit-input-placeholder {
		color: var(--light-c);

		text-align: center;

		transform: translate(0px, -1px);
	}

	.input.new-tag {
		display: flex;
		position: absolute;
		right: 0;

		bottom: -30px;
		left: 0;

		height: 20px;
		margin: auto;
		width: fit-content;
		padding: 1rem 0.5rem;

		border: 1px solid rgba(var(--brand-a-rgb), 0);

		text-align: center;

		transition: 0.5s;

		transform: translateY(-2px);
	}
	.input-layout:hover .new-tag,
	.new-tag:focus,
	.new-tag:active {
		border-color: rgba(var(--confirm-rgb), 0.25);
	}

	.input-tag {
		display: flex;

		list-style: none;

		color: var(--light-d);
		border-radius: 2px;

		white-space: nowrap;

		cursor: default;
	}

	.input-tag-remove {
		color: rgba(var(--light-c-rgb), 0);

		cursor: pointer;
		transition: 0.2s;

		animation-name: spin;
		animation-duration: 3s;
		animation-timing-function: ease-out;

		transform: translate(0, -3px);
	}

	.input-layout:focus .input-tag-remove,
	.input-layout:hover .input-tag-remove {
		color: rgba(var(--light-c-rgb), 0.5);
	}

	@keyframes spin {
		from {
			transform: translate(-100, 100) rotate(180);
		}
		to {
			transform: rotate(0) translate(0, 0);
		}
	}

	.input-tag-remove:hover {
		color: rgba(var(--dark-c-rgb), 1) !important;

		font-weight: 700;
	}

	/* input-matchs */

	.input-matchs-parent {
		position: relative;
	}

	.input-matchs {
		position: absolute;
		top: 2rem;
		right: 0;
		left: 0;

		width: 50%;
		min-height: 4rem;
		max-height: 310px;
		margin: 3px auto;
		padding: 1rem 1.5rem;

		background: var(--light-a);
		border-radius: 5px;
		box-shadow: 0px 3px 6.1px rgba(0, 0, 0, 0.05), 0px 12.7px 20.5px rgba(0, 0, 0, 0.018),
			0px 57px 92px rgba(0, 0, 0, 0.03);

		overflow-x: auto;
		z-index: 20;
	}

	.input-matchs li {
		list-style: none;

		border-radius: 2px;

		cursor: pointer;
	}

	.input-matchs li:hover,
	.input-matchs li:focus {
		background: var(--dark-a);
		color: var(--light-a);
		outline: none;
	}

	/* input disabled */
	.input-layout.sti-layout-disable,
	.input:disabled {
		background: var(--light-b);

		cursor: not-allowed;
	}

	.input-layout.sti-layout-disable:hover,
	.input-layout.sti-layout-disable:focus {
		border-color: var(--light-c);
	}

	.input-layout.sti-layout-disable .input-tag {
		background: var(--light-d);
	}

	.input-layout.sti-layout-disable .input-tag-remove {
		cursor: not-allowed;
	}
</style>
