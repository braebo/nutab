<script lang="ts">
	import { run, preventDefault } from 'svelte/legacy';

	import { authStore, showAuthForm } from './authStore'
	import isStrongPassword from 'validator/es/lib/isStrongPassword'
	import { elasticOut, quintOut } from 'svelte/easing'
	import { slide, fly, fade, scale } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	import isEmail from 'validator/es/lib/isEmail'
	import Spinner from './Spinner.svelte'
	import EyeIcon from './EyeIcon.svelte'
	import { url } from '@roxi/routify'
	import GithubIcon from '../graphics/icons/GithubIcon.svelte'

	const { status, loading, handleGithubSuccess, authenticated } = authStore

	const dispatch = createEventDispatcher()

	let active = $state('login'),
		showPassword = $state(false),
		width = '300px',
		emailInput = $state(),
		passwordInput = $state(),
		statusColor = $state('var(--light-c)'),
		passwordValid = $state(false)

	interface Props {
		email: any;
		password: any;
	}

	let { email = $bindable(), password = $bindable() }: Props = $props();

	

	run(() => {
		switch ($status) {
			case 'invalid':
				statusColor = 'var(--light-c)'
				break
			case 'valid':
				statusColor = 'var(--primary)'
				break
			case 'error':
				statusColor = 'var(--error)'
				break
			default:
				statusColor = 'var(--light-c)'
				break
		}
	});

	let emailValid = $derived(email ? isEmail(email) : false)
	let formValid = $derived(emailValid && passwordValid)
	run(() => {
		$status = emailValid && formValid ? 'valid' : 'invalid'
	});

	function checkPassword(e) {
		password = e.target.value
		passwordValid = passwordInput.validity.valid && isStrongPassword(password) ? true : false
	}

	// Popup window
	function handleGithub() {
		window.open(
			$url('./auth/login'),
			'login',
			`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
			width=400,height=600,left=25vw,top=25vh`
		)
	}
	// Handoff response from popup window.
	window.handleRes = async (res) => {
		await handleGithubSuccess(res)
	}

	function bounce(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '')
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: function (t, u) {
				const padding = u * 0.8
				return `transform: ${existingTransform} scale(${t + padding})`
			}
		}
	}

	run(() => {
		if ($authenticated) $showAuthForm = false
	});
</script>

<span style="--status-color: {statusColor}">
	{#if $showAuthForm}
		<div
			in:fade
			out:slide
			class="auth-container"
			style={`--width: ${width}; border: solid 1px ${statusColor};`}
			class:formValid
		>
			<nav in:fly={{ y: 10, delay: 200 }} class="auth-nav">
				<ul class="login-signup">
					<li>
						<h2 class="anim-link" class:activeTab={active == 'login'} onclick={() => (active = 'login')}>
							Login
						</h2>
					</li>
					<li>
						<h2 class="anim-link" class:activeTab={active == 'signup'} onclick={() => (active = 'signup')}>
							Sign Up
						</h2>
					</li>
				</ul>
			</nav>

			<form class="auth-form">
				<loginTab>
					<div {width}>
						<input
							bind:this={emailInput}
							in:bounce={{
								easing: elasticOut,
								delay: 50,
								duration: 750
							}}
							class="login-input email"
							required
							minlength="3"
							maxlength="25"
							id="username"
							type="email"
							bind:value={email}
							placeholder="Email"
							class:emailValid
							autocomplete="email"
						/>
						<input
							bind:this={passwordInput}
							in:bounce={{
								easing: elasticOut,
								delay: 250,
								duration: 750
							}}
							class="login-input password"
							required
							value={password}
							placeholder="Password"
							type={showPassword ? 'text' : 'password'}
							oninput={(e) => checkPassword(e)}
							onchange={(e) => checkPassword(e)}
							class:passwordValid
							minlength="5"
							maxlength="30"
							autocomplete="current-password"
						/>
						{#if password}
							<div class="eye-icon" onclick={() => (showPassword = !showPassword)} transition:fade>
								<EyeIcon active={showPassword} />
							</div>
						{/if}
					</div>
				</loginTab>
				<div class="button-wrapper">
					{#key active}
						{#if $loading}
							<br />
							<Spinner />
						{:else}
							<input
								class:formValid
								type="submit"
								in:scale={{
									y: 100,
									delay: 200,
									easing: quintOut,
									duration: 400
								}}
								out:fly={{ y: 100, duration: 750 }}
								onclick={preventDefault(() =>
									active == 'login' ? dispatch('signin') : dispatch('signup'))}
								value={active == 'login' ? 'Login' : 'Sign Up'}
							/>
						{/if}
					{/key}
				</div>
			</form>
			<div
				class="github-icon"
				in:scale={{ delay: 300, easing: quintOut, duration: 400 }}
				out:fly={{ y: -400, duration: 750 }}
				onclick={preventDefault(handleGithub)}
			>
				<GithubIcon />
			</div>
		</div>
	{/if}
</span>

<style>
	.github-icon {
		position: absolute;
		bottom: 10px;
		left: 10px;

		display: flex;
		overflow: hidden;

		width: 30px;
		height: 30px;

		cursor: pointer;
		transition: border-radius 300ms;

		border-radius: 100%;
	}
	.github-icon:hover {
		border-radius: 0;
	}
	input[type='text']:invalid {
		box-shadow: 0 0 3px none !important;
	}
	input:required {
		box-shadow: none !important;
	}
	.emailValid,
	.passwordValid {
		border: 1px solid var(--primary) !important;
	}
	.eye-icon {
		position: absolute;
		right: 35px;
		bottom: 148px;

		width: max-content;
		height: max-content;

		cursor: pointer;
	}
	.login-input {
		font-family: var(--font-a);
		font-size: inherit;
		font-size: 16px;

		display: block;

		width: 80%;
		margin: 1rem auto;
		margin-bottom: 1rem;
		padding: 0.4rem 0.8rem;
		padding: 0.5rem 0.2rem;

		transition: 500ms;
		text-align: center;

		color: var(--dark-a);
		border: 1px solid var(--status-color);
		border-radius: 8px;
		outline: none;
		outline-color: var(--primary);
		background: var(--light-a);
	}
	::placeholder {
		color: var(--dark-a);
	}
	.login-input:focus::placeholder {
		opacity: 0;
	}
	input[type='submit'] {
		font-size: 16px;
		line-height: 35px;

		position: absolute;
		top: 17px;
		right: 0;
		left: 0;

		display: flex;

		height: max-content;
		margin: 0 auto 1rem auto;
		padding: 3px 18px;

		cursor: pointer;
		transition: 250ms;
		letter-spacing: 1px;

		color: var(--dark-a);
		border: 1px solid var(--status-color);
		border-radius: 5px;
		outline-color: var(--dark-a);
		background-color: var(--light-a);

		font-variation-settings: 'wght' 500;
	}
	input[type='submit']:hover {
		color: var(--always-dark);
		background-color: var(--primary);
	}
	.button-wrapper {
		position: absolute;

		overflow: hidden;

		width: 100%;
		height: 90px;
		margin: auto;
	}
	form {
		position: relative;

		overflow: hidden;

		height: 250px;
		padding-top: 1.5rem;
	}
	logintab {
		position: relative;

		overflow: hidden;
		overflow: hidden;

		width: max-content;
		height: max-content;
	}
	nav {
		position: relative;

		display: flex;
	}
	li h2 {
		font-size: 1.5rem;

		width: 100%;
		margin: 0 auto;
		padding: 1rem;
		padding-bottom: 0;

		user-select: none;
		transition: color 500ms;

		color: var(--dark-d);
	}
	ul.login-signup {
		display: inline-flex;
		justify-content: space-between;

		width: 180px;
		margin: 0 auto;

		list-style-type: none;
	}
	.anim-link::after,
	.activeTab::after {
		position: absolute;
		right: 0;
		bottom: -2px;
		left: 0;

		display: flex;

		width: 0;
		height: 2px;
		margin: 0 auto;

		content: '';
		transition: width 0.3s;

		background: var(--primary);
	}
	.anim-link:hover::after,
	.activeTab::after {
		width: 50px;

		transition: width 0.3s;
	}
	.auth-form {
		overflow: hidden;

		max-height: initial;
	}
	.auth-container {
		width: var(--width);
		height: 250px;
		max-height: initial;
		margin: 128px auto;
		margin: 128px auto;
		padding: 10px;

		user-select: none;
		transition: background 250ms, border 300ms;
		text-align: center;

		border: solid 1px var(--status-color);
		border-radius: 10px;
		background: var(--light-a);
		box-shadow: 0 0 10px var(--status-color);
	}
</style>
