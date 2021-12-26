import { createClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const showLoginPopup = writable(false);
export const showAuthForm = writable(true);
export const errorMessage = writable('☹️');

export const authStore = createAuthStore();

function createAuthStore() {
	const successMessage = writable('Success!');
	const authenticated = writable(false);
	const status = writable('invalid');
	const loading = writable(false);
	const error = writable(null);
	const user = writable(null);

	// const supabaseURL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	// const supabasePublicKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY;
	const supabaseURL = '';
	const supabasePublicKey = '';
	
	const supabase = createClient(supabaseURL, supabasePublicKey);

	async function initAuth() {
		const currentUser = supabase.auth.user();
		user.set(currentUser);
		currentUser == null ? authenticated.set(false) : authenticated.set(true);
	}

	async function signIn(email, password) {
		loading.set(true);
		await supabase.auth.signIn({ email, password }).then(async (res) => {
			res.error ? handleError('❗️ Error signing in: ', res) : handleSignInSuccess(res);
		});
	}
	function handleSignInSuccess(res) {
		user.set(res.user);
		loading.set(false);
		successMessage.set(`Welcome Back.`);
		status.set('success');
		successMessageTimer();
		authenticated.set(true);
	}

	async function githubSignIn() {
		loading.set(true);
		let res = null;
		await supabase.auth
			.signIn({ provider: 'github' }, { redirectTo: `${import.meta.BASE_URL}/auth/success` })
			.then((_res) => {
				res = _res;
				return res;
			});
		return res;
	}
	async function handleGithubSuccess(res) {
		user.set(res);
		loading.set(false);
		successMessage.set(`Welcome Back.`);
		status.set('success');
		successMessageTimer();
	}

	async function signUp(email, password) {
		loading.set(true);
		await supabase.auth
			.signIn({
				email,
				password,
			})
			.then((res) => {
				res.error ? handleError('❗️ Error signing up: ', res) : handleSignUpSuccess(res);
			});
	}
	async function handleSignUpSuccess(res) {
		user.set(res.user);
		loading.set(false);
		status.set('success');
		successMessage.set('Confirmation Email Sent! 📬');
		successMessageTimer();
		authenticated.set(true);
	}

	let successTimer = null;
	function successMessageTimer() {
		if (successTimer) clearTimeout(successTimer);
		showAuthForm.set(false);
		successTimer = setTimeout(() => {
			showLoginPopup.set(false);
			authenticated.set(true);
			successTimer = null;
		}, 1000);
	}

	async function signOut() {
		await supabase.auth.signOut().then(async (res) => {
			if (res.error) error.set(await res.error);
			else {
				// Reset user store
				authenticated.set(false);
				user.set(null);
				location.reload();
			}
		});
	}

	let errorTimer = null;
	function handleError(message = '❗️ Error: ', res) {
		loading.set(false);
		status.set('error');
		error.set(res.error);
		console.log(message, res.error);
		if (errorTimer) clearTimeout(errorTimer);
		errorTimer = setTimeout(() => {
			status.set('invalid');
		}, 8000);
	}

	function clearTimers(timers) {
		timers.forEach((t) => {
			if (t) clearTimeout(t);
			t = null;
		});
	}

	return {
		supabase,
		user,
		authenticated,
		status,
		loading,
		error,
		successMessage,
		initAuth,
		signIn,
		githubSignIn,
		handleGithubSuccess,
		signUp,
		signOut,
		destroy() {
			clearTimers([errorTimer, successTimer]);
		},
	};
}
