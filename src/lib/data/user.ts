import { localStorageStore } from '../utils/localStorageStore'
import type { User } from './types'

export const userPhrase = localStorageStore<User['phrase']>('userPhrase', [])

// TODO not this probably
export const userEmail = localStorageStore<User['email']>('userEmail', '')
