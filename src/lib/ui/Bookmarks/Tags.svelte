<script lang="ts">
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { fly } from 'svelte/transition'

	let tag = $state('')
	let arrelementsmatch: any[] = $state([])
	let regExpEscape = (s: string) => {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
	}
	let blurred = $state(true)

	let {
		tags = $bindable([]),
		addKeys = ['Enter'],
		maxTags = false,
		onlyUnique = false,
		removeKeys = ['Backspace'],
		placeholder = $bindable(''),
		allowPaste = false,
		allowDrop = false,
		splitWith = ',',
		autoComplete = false,
		autoCompleteKey = 0,
		name = 'svelte-tags-input',
		id = uniqueID(),
		allowBlur = false,
		disable = false,
		minChars = 1,
		onlyAutocomplete = false,
		onclick = () => {},
		onTagChange = () => {},
	}: {
		tags?: string[]
		addKeys?: any
		maxTags?: boolean | number
		onlyUnique?: boolean
		removeKeys?: any
		placeholder?: string
		allowPaste?: boolean
		allowDrop?: boolean
		splitWith?: string
		autoComplete?: string[] | Function | boolean | unknown
		autoCompleteKey?: number
		name?: string
		id?: any
		allowBlur?: boolean
		disable?: boolean
		minChars?: number
		onlyAutocomplete?: boolean
		labelText?: any
		labelShow?: boolean
		onclick?: (e: MouseEvent) => void
		onTagChange?: (tags: string[]) => void
	} = $props()
	// run(() => {
	// 	tags
	// })
	// run(() => {
	// 	addKeys
	// })
	// run(() => {
	// 	maxTags
	// })
	// run(() => {
	// 	onlyUnique
	// })
	// run(() => {
	// 	removeKeys
	// })
	// run(() => {
	// 	placeholder
	// })
	// run(() => {
	// 	allowPaste
	// })
	// run(() => {
	// 	allowDrop
	// })
	// run(() => {
	// 	splitWith
	// })
	// run(() => {
	// 	autoComplete
	// })
	// run(() => {
	// 	autoCompleteKey
	// })
	// run(() => {
	// 	name
	// })
	// run(() => {
	// 	id
	// })
	// run(() => {
	// 	allowBlur
	// })
	// run(() => {
	// 	disable
	// })
	// run(() => {
	// 	minChars
	// })
	// run(() => {
	// 	onlyAutocomplete
	// })
	// run(() => {
	// 	labelText
	// })
	// run(() => {
	// 	labelShow
	// })
	let matchsID = $derived(id + '_matchs')

	let storePlaceholder = placeholder

	function setTag(e: KeyboardEvent) {
		const currentTag = (e.target as HTMLInputElement).value

		if (addKeys) {
			addKeys.forEach((key: string) => {
				if (key === e.key) {
					if (currentTag) e.preventDefault()

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
						const firstChildText = document
							.getElementById(matchsID)
							?.querySelectorAll('li')[0]?.textContent
						if (firstChildText) {
							addTag(firstChildText)
						}
					} else {
						addTag(currentTag)
					}
				}
			})
		}

		if (removeKeys) {
			removeKeys.forEach((key: string) => {
				if (key === e.key && tag === '') {
					tags.pop()
					tags = tags
					onTagChange?.(tags)
					arrelementsmatch = []
					;(document.getElementById(id) as HTMLInputElement).readOnly = false
					placeholder = storePlaceholder
					document.getElementById(id)?.focus()
				}
			})
		}

		if (e.key === 'ArrowDown' && autoComplete && document.getElementById(matchsID)) {
			e.preventDefault()
			;(
				document.getElementById(matchsID)?.querySelector('li:first-child') as HTMLLIElement
			)?.focus()
		} else if (e.key === 'ArrowUp' && autoComplete && document.getElementById(matchsID)) {
			e.preventDefault()
			;(
				document.getElementById(matchsID)?.querySelector('li:last-child') as HTMLLIElement
			)?.focus()
		}
	}

	function addTag(currentTag: string) {
		let currentObjTags
		if (typeof currentTag === 'object' && currentTag) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects",
				)
			}
			currentObjTags = currentTag
			// @ts-ignore
			currentTag = currentTag[autoCompleteKey].trim()
		} else {
			// currentTag =
			currentTag = currentTag.trim()
		}

		if (currentTag == '') return
		if (maxTags && tags.length == maxTags) return
		if (onlyUnique && tags.includes(currentTag)) return
		if (onlyAutocomplete && arrelementsmatch.length === 0) return

		tags.push(currentObjTags ? currentObjTags : currentTag)
		tags = tags
		tag = ''
		onTagChange?.(tags)

		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = []
		document.getElementById(id)?.focus()
		if (maxTags && tags.length == maxTags) {
			;(document.getElementById(id) as HTMLInputElement).readOnly = true
			placeholder = ''
		}
	}

	function removeTag(i: number) {
		tags.splice(i, 1)
		tags = tags
		onTagChange?.(tags)

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
		splitTags(data).map((tag: string) => addTag(tag))
	}

	function onDrop(e: DragEvent) {
		if (!allowDrop) return
		e.preventDefault()
		const data = e.dataTransfer?.getData('Text')
		if (!data) return
		splitTags(data).map((tag: string) => addTag(tag))
	}

	function onBlur(e: Event, _tag: string) {
		if (!document.getElementById(matchsID) && allowBlur) {
			e.preventDefault()
			// I think adding tags on:blur is a bad idea
			// if (_tag) addTag(_tag)
		}
		// blurred = true
		placeholder = 'new tag'
	}

	function getClipboardData(e: ClipboardEvent) {
		if ((globalThis.window as any).clipboardData) {
			return (globalThis.window as any).clipboardData.getData('Text')
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

		let value = (input.target as HTMLInputElement).value
		let matchs

		if (value == '' || input.key === 'Escape' || value.length < minChars) {
			arrelementsmatch = []
			return
		}

		if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects",
				)
			}
			matchs = autoCompleteValues
				.filter((e: string) =>
					e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()),
				)
				.map((matchTag: string) => {
					return {
						label: matchTag,
						search: matchTag[autoCompleteKey].replace(
							RegExp(regExpEscape(value.toLowerCase()), 'i'),
							'<strong>$&</strong>',
						),
					}
				})
		} else {
			matchs = autoCompleteValues
				.filter((e: string) => e.toLowerCase().includes(value.toLowerCase()))
				.map((matchTag: string) => {
					return {
						label: matchTag,
						search: matchTag.replace(
							RegExp(regExpEscape(value.toLowerCase()), 'i'),
							'<strong>$&</strong>',
						),
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
		e: KeyboardEvent,
		autoCompleteIndex: number,
		autoCompleteLength: number,
		autoCompleteElement: string,
	) {
		if (!autoComplete) return

		e.preventDefault()
		if (e.key === 'ArrowDown') {
			// Last element on the list ? Go to the first
			if (autoCompleteIndex + 1 === autoCompleteLength) {
				;(
					document
						.getElementById(matchsID)
						?.querySelector('li:first-child') as HTMLLIElement
				)?.focus()
				return
			}
			document.getElementById(matchsID)?.querySelectorAll('li')[autoCompleteIndex + 1].focus()
		} else if (e.key === 'ArrowUp') {
			// First element on the list ? Go to the last
			if (autoCompleteIndex === 0) {
				;(
					document
						.getElementById(matchsID)
						?.querySelector('li:last-child') as HTMLLIElement
				)?.focus()
				return
			}
			document.getElementById(matchsID)?.querySelectorAll('li')[autoCompleteIndex - 1].focus()
		} else if (e.key === 'Enter') {
			addTag(autoCompleteElement)
		} else if (e.key === 'Escape') {
			arrelementsmatch = []
			document.getElementById(id)?.focus()
		}
	}

	function uniqueID() {
		return 'sti_' + Math.random().toString(36).substring(2, 9)
	}

	function handleFocus() {
		blurred = false
		placeholder = ''
	}

	function handleBlur(e: Event) {
		onBlur(e, tag)
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
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							class="input-tag-remove"
							role="button"
							tabindex="0"
							onclick={(e) => {
								e.stopPropagation()
								removeTag(i)
							}}
						>
							&#215;
						</div>
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
		bind:value={tag}
		onkeydown={setTag}
		onkeyup={getMatchElements}
		onpaste={onPaste}
		ondrop={onDrop}
		onfocus={handleFocus}
		onblur={(e) => handleBlur(e)}
		{onclick}
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
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					tabindex="-1"
					onkeydown={(e) =>
						navigateAutoComplete(e, index, arrelementsmatch.length, element.label)}
					onclick={(e) => {
						e.stopPropagation()
						addTag(element.label)
					}}
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

		color: var(--fg-b);

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

		border: solid 1px color-mix(in srgb, var(--fg-b) 50%, transparent);
		border-radius: 2px;
	}

	.input {
		display: flex;
		flex: 1;

		margin: auto;

		border: solid 1px color-mix(in srgb, var(--fg-b) 0%, transparent);
		color: var(--fg-c);
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
		color: var(--fg-c);

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

		border: 1px solid color-mix(in srgb, var(--theme-a) 0%, transparent);

		text-align: center;

		transition: 0.5s;

		transform: translateY(-2px);
	}
	.input-layout:hover .new-tag,
	.new-tag:focus,
	.new-tag:active {
		border-color: color-mix(in srgb, var(--confirm) 25%, transparent);
	}

	.input-tag {
		display: flex;

		list-style: none;

		color: var(--fg-d);
		border-radius: 2px;

		white-space: nowrap;

		cursor: default;
	}

	.input-tag-remove {
		color: color-mix(in srgb, var(--fg-c) 0%, transparent);

		cursor: pointer;
		transition: 0.2s;

		animation-name: spin;
		animation-duration: 3s;
		animation-timing-function: ease-out;

		transform: translate(0, -3px);
	}

	.input-layout:focus .input-tag-remove,
	.input-layout:hover .input-tag-remove {
		color: color-mix(in srgb, var(--fg-c) 50%, transparent);
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
		color: color-mix(in srgb, var(--bg-c) 100%, transparent) !important;

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

		background: var(--fg-a);
		border-radius: 5px;
		box-shadow:
			0px 3px 6.1px rgba(0, 0, 0, 0.05),
			0px 12.7px 20.5px rgba(0, 0, 0, 0.018),
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
		background: var(--bg-a);
		color: var(--fg-a);
		outline: none;
	}

	/* input disabled */
	.input-layout.sti-layout-disable,
	.input:disabled {
		background: var(--fg-b);

		cursor: not-allowed;
	}

	.input-layout.sti-layout-disable:hover,
	.input-layout.sti-layout-disable:focus {
		border-color: var(--fg-c);
	}

	.input-layout.sti-layout-disable .input-tag {
		background: var(--fg-d);
	}

	.input-layout.sti-layout-disable .input-tag-remove {
		cursor: not-allowed;
	}
</style>
