<script>
	// import { updateAllCollectionsList } from '../data/db';
	import { fly, slide } from 'svelte/transition'
	import AuthForm from './AuthForm.svelte'
	import { authStore } from './authStore'

	const { githubSignIn, signIn, signUp, status, successMessage, error } = authStore

	let email = null,
		password = null
</script>

<div class="login-container">
	{#if $status != 'invalid'}
		<div class="message" transition:fly|global={{ y: 100 }}>
			{#if $status == 'success'}
				<!-- <span on:load={updateAllCollectionsList()} /> -->
				<div class="success-message" in:slide|global>{$successMessage}</div>
			{:else if $status == 'error'}
				<div class="error-message" transition:slide|global>
					{#await $error?.message then err}
						{err} 🤔
					{/await}
				</div>
			{/if}
		</div>
	{/if}

	<AuthForm
		bind:email
		bind:password
		on:signin={async () => await signIn(email, password)}
		on:signup={async () => await signUp(email, password)}
		on:githubSignin={async () => await githubSignIn()}
	/>
</div>

<style>
	.login-container {
		width: 300px;
		height: 250px;
		margin: 0 auto;
		position: relative;
	}
	.success-message {
		text-align: center;
		background-color: var(--light-a);
		border: 1px solid var(--primary);
		font-variation-settings: 'wght' 700;
		color: var(--dark-a);
		font-size: 18px;
		border-radius: 5px;
		padding: 5px 10px;
		height: 100%;
		width: 100%;
	}
	.error-message {
		border: 1px solid rgb(245, 175, 167);
		background-color: var(--light-a);
		color: var(--dark-b);
		border-radius: 5px;
		padding: 5px 10px;
		height: 100%;
		width: 100%;
	}
	.message {
		height: max-content;
		position: absolute;
		border-radius: 5px;
		margin: 10px auto;
		font-size: 16px;
		bottom: -33%;
		width: 300px;
		z-index: -1;
		right: 0;
		left: 0;
	}
</style>
