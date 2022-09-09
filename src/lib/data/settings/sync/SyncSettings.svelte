<script lang="ts">
	import { createUser } from '$lib/data/sync'

	import { userPhrase, userEmail } from '$lib/data/user'
	import { fade, fly } from 'svelte/transition'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { quintOut } from 'svelte/easing'

	let revealPhrase = false
	let email = ''

	const handleConnect = () => {
		//...
	}

	const handleCreate = () => {
		createUser(email)
		if (!$userEmail) $userEmail = email
	}
</script>

<comingSoon in:fly={{ y: 10, delay: 150 }} out:fly|local={{ y: 2, duration: 200 }}>Coming Soon</comingSoon>
<div class="account DISABLED">
	{#if $userPhrase?.length}
		{#key revealPhrase}
			{#if revealPhrase}
				<div class="phrase">
					{#each $userPhrase as word, i}
						<div
							class="word"
							in:fly={{ y: 5, delay: 100 + 10 * i, duration: 750 }}
							out:fly={{ y: -5, delay: 10 * ($userPhrase.length - i), duration: 350 }}
						>
							{word}
						</div>
					{/each}
					<Tooltip content="Hide_Passphrase" delay={[300, 100]}>
						<div
							class="hide"
							transition:fly={{ x: 10, delay: 250, duration: 200, easing: quintOut }}
							on:click={() => (revealPhrase = false)}
						>
							👁
						</div>
					</Tooltip>
					<p class="note" in:fly={{ y: 3, delay: 300 }} out:fly={{ y: 3, duration: 250 }}>
						Store your phrase in a safe place and use it to sync your devices.
					</p>
				</div>
			{:else}
				<div class="reveal" in:fade={{ delay: 750 }} out:fade={{ duration: 250 }}>
					<Button --width="14rem" on:click={() => (revealPhrase = true)}>Reveal secret passphrase</Button>
				</div>
				{#if !$userEmail}
					<div class="email" in:fade={{ duration: 150, delay: 300 }} out:fade|local={{ duration: 50 }}>
						<p>
							Add a recovery email <span class="note">(optional)</span>
						</p>

						<input bind:value={email} placeholder="Email" type="email" required />

						<!-- TODO -->
						<!-- <button on:click={() => postUserEmail(email)}>Add</button> -->

						<p class="note">A recovery email can be used to recover a lost passphrase.</p>
					</div>
				{/if}
			{/if}
		{/key}
	{:else}
		<div class="new" in:fly={{ y: 5, duration: 350, delay: 100 }} out:fly|local={{ y: 5, duration: 150 }}>
			<p style:transform="translateY(-0.25rem)">Sync your data across browsers.</p>
			<input bind:value={email} placeholder="Recovery Email (optional)" type="email" required />
			<div class="button">
				<div class="btn" on:click={handleCreate}>New Sync Code</div>
			</div>
		</div>
		<div class="existing" in:fly={{ y: 5, duration: 350, delay: 150 }} out:fly|local={{ y: 5, duration: 150 }}>
			<p>Already have a Sync Code?</p>
			<div class="button">
				<div class="btn" on:click={handleConnect}>Connect</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.DISABLED {
		opacity: 0.25;
		pointer-events: none;
	}
	comingSoon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		z-index: 999;
		font-size: 1.5rem;
		color: var(--dark-c);
		top: -9.75rem;
		font-family: var(--font-a);
		letter-spacing: 1px;
		pointer-events: none;
	}

	.account {
		margin-top: 1rem;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3rem;

		height: 60%;
	}

	.phrase {
		display: grid;
		grid-template-columns: repeat(5, auto);
		grid-template-rows: auto;
		column-gap: 15px;
		row-gap: 25px;

		max-width: 80%;

		color: var(--dark-a);

		font-size: 1.2rem;
		font-family: var(--font-b);
		text-align: center;

		.hide {
			cursor: pointer;
			opacity: 0.25;
			filter: saturate(0);

			transition: 0.3s;

			&:hover {
				opacity: 1;
				filter: saturate(1);
			}
		}

		.note {
			font-size: 0.9rem;
			position: absolute;
			left: 0;
			right: 0;
			bottom: -4.5rem;

			cursor: default;
			transition: opacity 0.1s;

			&:hover {
				opacity: 1 !important;
			}
		}
	}

	.reveal {
		position: absolute;
		inset: 0;
		margin: auto;
		width: max-content;
		height: 60%;
	}

	p {
		font-family: var(--font-a);
		color: var(--light-d);

		text-align: center;
	}

	input {
		padding: 0.5rem 1rem;
		width: 20rem;

		color: var(--dark-a);
		background-color: rgba(var(--light-c-rgb), 0.25);
		border: none;
		border-radius: 0.5rem;

		font-family: var(--font-a);
		font-variation-settings: 'wght' 300;

		&::placeholder {
			color: var(--light-d);
		}

		&:hover {
			outline: 1px solid var(--light-d);
		}

		&:focus {
			outline: 1px solid var(--dark-d);
			&::placeholder {
				content: '';
				color: transparent;
			}
		}
	}

	.email {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		bottom: -4rem;
	}

	.note {
		opacity: 0.5;
	}

	.button {
		margin: auto;
		width: fit-content;
	}

	.btn {
		border: 1px solid var(--light-a);
	}
	.btn:hover {
		border: 1px solid var(--dark-d);
	}

	.new {
		outline: 1px solid rgba(var(--light-d-rgb), 0.1);
		outline-offset: 1.5rem;
		border-radius: 0.25rem;
		margin-top: 5rem;
	}

	.new,
	.existing {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
