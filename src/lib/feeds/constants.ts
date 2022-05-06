import type { ICategory } from './types'

import { dev } from '$app/env'

export const DEFAULT_CATEGORY: ICategory = 'topstories'

export const CORS = dev ? 'http://localhost:8080/' : ''

export const INITIAL_SIZE = 10

export const BATCH_SIZE = 5
