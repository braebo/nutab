<script lang="ts">
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	let tag = ''
	let arrelementsmatch = []
	let regExpEscape = (s) => {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
	}

	export let tags: string[]
	export let addKeys: number[]
	export let maxTags: number | false
	export let onlyUnique: boolean
	export let removeKeys: number[]
	export let placeholder: string
	export let allowPaste: boolean
	export let allowDrop: boolean
	export let splitWith: string
	export let autoComplete: boolean
	export let autoCompleteKey: number | false
	export let name: string
	export let allowBlur: boolean
	export let disable: boolean
	export let minChars: number

	$: tags = tags || []
	$: addKeys = addKeys || [13]
	$: maxTags = maxTags || false
	$: onlyUnique = onlyUnique || true
	$: removeKeys = removeKeys || [8]
	$: placeholder = placeholder || ''
	$: allowPaste = allowPaste || false
	$: allowDrop = allowDrop || false
	$: splitWith = splitWith || ','
	$: autoComplete = autoComplete || false
	$: autoCompleteKey = autoCompleteKey || false
	$: name = name || 'input'
	$: id = id || uniqueID()
	$: allowBlur = allowBlur || false
	$: disable = disable || false
	$: minChars = minChars || 1

	$: matchsID = id + '_matchs'

	let storePlaceholder = placeholder

	function setTag(input) {
		const currentTag = input.target.value

		if (addKeys) {
			addKeys.forEach(function (key) {
				if (key === input.keyCode) {
					if (currentTag) input.preventDefault()

					switch (input.keyCode) {
						case 9:
							// TAB add first element on the autoComplete list
							if (autoComplete && document.getElementById(matchsID)) {
								addTag(
									document.getElementById(matchsID).querySelectorAll('li')[0]
										.textContent
								)
							} else {
								addTag(currentTag)
							}
							break
						default:
							addTag(currentTag)
							break
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
					document.getElementById(id).readOnly = false
					placeholder = storePlaceholder
					// document.getElementById(id).focus();
				}
			})
		}

		// ArrowDown : focus on first element of the autocomplete
		if (input.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
			event.preventDefault()
			document.getElementById(matchsID).querySelector('li:first-child').focus()
		} // ArrowUp : focus on last element of the autocomplete
		else if (input.keyCode === 38 && autoComplete && document.getElementById(matchsID)) {
			event.preventDefault()
			document.getElementById(matchsID).querySelector('li:last-child').focus()
		}
	}

	function addTag(currentTag) {
		if (typeof currentTag === 'object' && currentTag !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects"
				)
			}

			var currentObjTags = currentTag
			currentTag = currentTag[autoCompleteKey].trim()
		} else {
			currentTag = currentTag.trim()
		}

		if (currentTag == '') return
		if (maxTags && tags.length == maxTags) return
		if (onlyUnique && tags.includes(currentTag)) return

		tags.push(currentObjTags ? currentObjTags : currentTag)
		tags = tags
		tag = ''

		dispatch('updateTags', {
			tags: tags
		})

		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = []
		// document.getElementById(id).focus();

		if (maxTags && tags.length == maxTags) {
			document.getElementById(id).readOnly = true
			placeholder = ''
		}
	}

	function removeTag(i) {
		tags.splice(i, 1)
		tags = tags

		dispatch('updateTags', {
			tags: tags
		})
		// dispatch('tags', {
		// 	tags: tags
		// });

		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = []
		// document.getElementById(id).readOnly = false;
		// placeholder = storePlaceholder;
		// document.getElementById(id).focus();
	}

	function onPaste(e) {
		if (!allowPaste) return

		e.preventDefault()

		const data = getClipboardData(e)
		const tags = splitTags(data).map((tag) => addTag(tag))
	}

	function onDrop(e) {
		if (!allowDrop) return

		e.preventDefault()

		const data = e.dataTransfer.getData('Text')
		const tags = splitTags(data).map((tag) => addTag(tag))
	}

	function onBlur(tag) {
		if (!document.getElementById(matchsID) && allowBlur) {
			event.preventDefault()
			addTag(tag)
		}
	}

	function getClipboardData(e) {
		if (window.clipboardData) {
			return window.clipboardData.getData('Text')
		}

		if (e.clipboardData) {
			return e.clipboardData.getData('text/plain')
		}

		return ''
	}

	function splitTags(data) {
		return data.split(splitWith).map((tag) => tag.trim())
	}

	async function getMatchElements(input) {
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

		var value = input.target.value

		// Escape
		if (value == '' || input.keyCode === 27 || value.length < minChars) {
			arrelementsmatch = []
			return
		}

		if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects"
				)
			}

			let matchs = autoCompleteValues
				.filter((e) => e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()))
				.map((matchTag) => {
					return {
						label: matchTag,
						search: matchTag[autoCompleteKey].replace(
							RegExp(regExpEscape(value.toLowerCase()), 'i'),
							'<strong>$&</strong>'
						)
					}
				})
		} else {
			let matchs = autoCompleteValues
				.filter((e) => e.toLowerCase().includes(value.toLowerCase()))
				.map((matchTag) => {
					return {
						label: matchTag,
						search: matchTag.replace(
							RegExp(regExpEscape(value.toLowerCase()), 'i'),
							'<strong>$&</strong>'
						)
					}
				})
		}

		if (onlyUnique === true && !autoCompleteKey) {
			matchs = matchs.filter((tag) => !tags.includes(tag.label))
		}

		arrelementsmatch = matchs
	}

	function navigateAutoComplete(autoCompleteIndex, autoCompleteLength, autoCompleteElement) {
		if (!autoComplete) return

		event.preventDefault()

		// ArrowDown
		if (event.keyCode === 40) {
			// Last element on the list ? Go to the first
			if (autoCompleteIndex + 1 === autoCompleteLength) {
				document.getElementById(matchsID).querySelector('li:first-child').focus()
				return
			}
			document.getElementById(matchsID).querySelectorAll('li')[autoCompleteIndex + 1].focus()
		} else if (event.keyCode === 38) {
			// ArrowUp
			// First element on the list ? Go to the last
			if (autoCompleteIndex === 0) {
				document.getElementById(matchsID).querySelector('li:last-child').focus()
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
					<Tooltip
						content="Delete_tag"
						placement="bottom"
						offset={[0, 15]}
						delay={[1000, 150]}
					>
						<span
							class="input-tag-remove"
							on:click|stopPropagation={() => removeTag(i)}
						>
							&#215;
						</span>
					</Tooltip>
				{/if}
			</span>
		{/each}
	{/if}
	<!-- id={id} -->
	<!-- <Tooltip content="New_tag" placement="bottom" offset={[0, 12]} delay={[1000, 150]}> -->
	<br />
	<input
		type="text"
		{name}
		bind:value={tag}
		on:keydown={setTag}
		on:keyup={getMatchElements}
		on:paste={onPaste}
		on:drop={onDrop}
		on:blur={() => onBlur(tag)}
		on:click|stopPropagation
		class="input new-tag"
		{placeholder}
		disabled={disable}
		onfocus="this.placeholder = ''"
		onblur="this.placeholder = 'new tag'"
		autocomplete="off"
	/>
	<!-- </Tooltip> -->
</div>

{#if autoComplete && arrelementsmatch.length > 0}
	<div class="input-matchs-parent">
		<ul id="{id}_matchs" class="input-matchs">
			{#each arrelementsmatch as element, index}
				<li
					tabindex="-1"
					on:keydown={() =>
						navigateAutoComplete(index, arrelementsmatch.length, element.label)}
					on:click|stopPropagation={() => addTag(element.label)}
				>
					{@html element.search}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	span.hashtag {
		padding: 0 2px;

		font-size: 14px;

		color: var(--light-b);
	}

	.input,
	.input-tag,
	.input-matchs {
		height: max-content;
		margin-right: 0.5rem;

		margin-bottom: 1rem;

		/* align-items: center; */

		font-family: inherit;
		font-size: 1rem;

		background: none;
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

		border: solid 1px rgb(var(--light-b-rgb), 0);
		border-radius: 2px;
	}

	.input {
		display: flex;
		flex: 1;

		margin: auto;

		font-family: inherit;

		color: rgb(var(--light-c));
		border: solid 1px rgba(var(--light-b-rgb), 0);
		border-radius: 4px;

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

		transform: translate(0px, -1px);
		text-align: center;
	}

	.input.new-tag {
		position: absolute;
		right: 0;

		bottom: -30px;
		left: 0;

		height: 20px;
		margin: auto;

		padding: 0.3rem 0.5rem;

		border: 1px solid rgba(var(--brand-a-rgb), 0);

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

		cursor: default;
		white-space: nowrap;
	}

	.input-tag-remove {
		padding-left: 3px;

		color: rgba(var(--light-c-rgb), 0);

		cursor: pointer;
		transition: 0.2s;
		animation-name: spin;
		animation-duration: 3s;
		animation-timing-function: ease-out;
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
		font-weight: 700;

		color: rgba(var(--dark-c-rgb), 1) !important;
	}

	/* input-matchs */

	.input-matchs-parent {
		position: relative;
	}

	.input-matchs {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;

		max-height: 310px;
		margin: 3px 0;
		padding: 0px;

		/* background:#FFF; */
		border: solid 1px var(--light-c);
		border-radius: 2px;

		overflow: scroll;
		overflow-x: auto;
	}

	.input-matchs li {
		/* padding: 5px; */
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
