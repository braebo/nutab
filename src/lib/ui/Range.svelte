<script>
	export let setting, name, range
	const { min, max } = range
</script>

<input {name} bind:value={setting} type="range" {min} {max} on:change on:input />

<style>
	input[type='range'] {
		width: 100%;
		max-width: 80%;

		margin: 18px 0;

		background: none;
		appearance: none;
	}

	input[type='range']:focus {
		outline: none;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 15px;

		border: 0.2px solid var(--light-a);
		border-radius: 50px;
		background: var(--light-b);

		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		width: 12px;
		height: 12px;
		margin-top: 0px;

		border: 1px solid var(--light-a);
		border-radius: 20px;
		background: var(--dark-d);
		background-image: radial-gradient(ellipse at var(--progress) var(--progress), blue, red);

		cursor: pointer;
		transition: background 0.3s;
		appearance: none;
		appearance: none;
	}

	input[type='range']:focus::-webkit-slider-thumb {
		background: var(--brand-a);
	}

	input[type='range']::-moz-range-track {
		width: 100%;
		height: 8.4px;

		border: 0.2px solid var(--light-a);
		border-radius: 1.3px;
		background: #3071a9;
		box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;

		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 36px;

		border: 1px solid #000000;
		border-radius: 3px;
		box-shadow: 1px 1px 1px #000000aa, 0px 0px 1px #0d0d0daa;

		cursor: pointer;
	}

	input[type='range']::-ms-track {
		width: 100%;
		height: 8.4px;

		color: transparent;
		border-width: 16px 0;
		border-color: transparent;
		background: transparent;

		cursor: pointer;
	}

	input[type='range']::-ms-fill-lower {
		background: #2a6495;
		border: 0.2px solid var(--light-a);
		border-radius: 2.6px;
		box-shadow: 1px 1px 1px #000000aa, 0px 0px 1px #0d0d0daa;
	}

	input[type='range']::-ms-fill-upper {
		background: #3071a9;
		border: 0.2px solid var(--light-a);
		border-radius: 2.6px;
		box-shadow: 1px 1px 1px #000000aa, 0px 0px 1px #0d0d0daa;
	}

	input[type='range']::-ms-thumb {
		width: 16px;
		height: 36px;

		border: 1px solid #000000;
		border-radius: 3px;
		box-shadow: 1px 1px 1px #000000aa, 0px 0px 1px #0d0d0daa;

		cursor: pointer;
	}

	input[type='range']:focus::-ms-fill-lower {
		background: #3071a9;
	}

	input[type='range']:focus::-ms-fill-upper {
		background: #367ebd;
	}
</style>
