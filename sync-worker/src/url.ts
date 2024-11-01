import { DEV } from 'esm-env'

export const url = DEV
	? ('http://localhost:8787' as const)
	: ('https://nutab-sync.braebo.dev' as const)
