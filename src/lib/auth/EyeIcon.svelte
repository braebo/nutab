<script>
	export let active = false
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="icon icon-tabler icon-tabler-eye"
	width="20"
	height="20"
	viewBox="0 0 24 24"
	stroke-width="1"
	stroke={active ? 'var(--light-c)' : 'var(--light-b)'}
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<circle cx="12" cy="12" r="4" />
	<path
		d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
	/>
</svg>
