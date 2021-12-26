import type { Collection } from './types'
import Dexie from 'dexie';

export class BookmarkDB extends Dexie {
    collections: Dexie.Table<Collection, number>;

    constructor () {
        super("CollectionsDB");
        this.version(1).stores({
            collections: 'collection_id, user_id, *bookmarks, position'
        });
        this.collections = this.table("collections");
    }
}

const db: BookmarkDB = new BookmarkDB

export default db;