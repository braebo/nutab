/**
 * Stories, comments, jobs, Ask HNs and even polls are just items. They're identified by their ids,
 * which are unique integers, and live under `/v0/item/<id>`.
 *
 * @param id The id of the item to retrieve.
 * @param deleted `true` if the item is deleted.
 * @param type The type of item.
 * @param by The username of the item's author.
 * @param time The creation date of the item, in Unix Time.
 * @param text The comment, story or poll text. HTML.
 * @param dead `true` if the item is dead.
 * @param parent The parent id of the item.
 * @param poll The poll associated with the item.
 * @param kids The ids of the item's comments, in ranked display order.
 * @param url The story URL.
 * @param score The story's score, or the votes for a pollopt.
 * @param title The title of the story, poll or job.
 * @param parts The comment's parent and pollopts, in display order.
 * @param descendants The comment's number of immediate replies.
 */
export interface IHNItem {
	/**
	 ** The item's unique id.
	 */
	id: number

	/**
	 ** `true` if the item is deleted.
	 */
	deleted?: boolean

	/**
	 ** The type of item.
	 */
	type?: `job` | `story` | `comment` | `poll` | `pollopt`

	/**
	 ** The username of the item's author.
	 */
	by?: string

	/**
	 ** Creation date of the item, in Unix Time.
	 */
	time?: number

	/**
	 ** The comment, story or poll text. HTML.
	 */
	text?: string

	/**
	 ** `true` if the item is dead.
	 */
	dead?: boolean

	/**
	 ** The comment's parent: either another comment or the relevant story.
	 */
	parent?: number

	/**
	 ** The pollopt's associated poll.
	 */
	poll?: number

	/**
	 ** The ids of the item's comments, in ranked display order.
	 */
	kids?: number[]

	/**
	 ** The URL of the story.
	 */
	url?: string

	/**
	 ** The story's score, or the votes for a pollopt.
	 */
	score?: number

	/**
	 ** The title of the story, poll or job. HTML.
	 */
	title?: string

	/**
	 ** A list of related pollopts, in display order.
	 */
	parts?: number[]

	/**
	 ** In the case of stories or polls, the total comment count.
	 */
	descendants?: number
}

export interface IJsonLinkMeta {
	description: string
	domain: string
	duration: number
	images: string[]
	title: string
	url: string
}
