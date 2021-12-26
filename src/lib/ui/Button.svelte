<button on:click>
	<slot>Click Me</slot>
</button>

<style>
	button {
		width: var(--width, 4rem);
		min-width: max-content;
		height: 2rem;

		padding: 0.5em 1em;

		font-family: var(--font-primary);

		color: var(--color);

		border: var(--border, 1px solid transparent);
		border-radius: 5px;
		background: var(--bg);
		box-shadow: 0 1px 2px #00000022;

		cursor: pointer;
		transition: 0.2s;

		transform: scale(1);
	}
	button:hover {
		background: var(--bgHover);
		border: var(--borderHover);
		color: var(--colorHover);
		box-shadow: 0 4px 8px #00000015;

		transform: scale(1.05);
		backface-visibility: hidden;
	}
	button:focus,
	button:active {
		box-shadow: 0 0 1.5px 1px var(--borderHover);

		transform: scale(0.95);
		transition: 0.1s;
	}
</style>
