import type { Folder } from './types'
import Dexie from 'dexie'

export class BookmarkDB extends Dexie {
	folders: Dexie.Table<Folder, number>

	constructor() {
		super('FoldersDB')
		this.version(1).stores({
			folders: 'folder_id, user_id, *bookmarks, position'
		})
		this.folders = this.table('folders')
	}
}

const db: BookmarkDB = new BookmarkDB()

export default db
