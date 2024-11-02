<script lang="ts">
	import { dev } from '$app/environment'
	import { page } from '$app/stores'
</script>

<h1>{$page.status}</h1>

{#if dev}
	<div class="error">
		<pre class="message"> {$page.error?.message} </pre>
		<pre class="stack"> {($page.error as Error)?.stack} </pre>
	</div>
{/if}

<style lang="scss">
	h1 {
		margin: 15vh auto 0;

		color: var(--warn);

		font-size: 10rem;
		font-weight: 100;
	}

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 10vh;
		text-align: center;

		pre {
			max-width: 90vw;

			text-align: left;
			line-height: 1.5rem;
		}

		.message {
			width: max-content;
			height: max-content;
			margin: 1rem auto;
			padding: 1rem;

			color: var(--bg-d);
			background: transparent;
			border: 1px solid var(--fg-d);
			border-radius: var(--radius-lg);
		}

		.stack {
			color: color-mix(in srgb, var(--bg-d) 50%, transparent);
			max-height: 40vh;
			overflow-y: auto;
		}

		::-webkit-scrollbar {
			background-color: var(--fg-a);
			width: 10px;
			height: 10px;
		}
		::-webkit-scrollbar-thumb {
			background-color: color-mix(in srgb, var(--fg-d) 50%, transparent);
			border-radius: 5px;
		}
		::-webkit-scrollbar-track {
			background-color: color-mix(in srgb, var(--fg-d) 10%, transparent);
		}
		::-webkit-scrollbar-corner {
			background-color: color-mix(in srgb, var(--fg-d) 10%, transparent);
		}
	}
</style>
