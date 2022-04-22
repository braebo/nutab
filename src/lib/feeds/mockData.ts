import type { IJsonLinkMeta } from './types'

export const getMockMetaData = async (index: number): Promise<IJsonLinkMeta> =>
	new Promise((res, rej) => {
		setTimeout(() => {
			if (Math.random() > 0.01) {
				console.log(mockMetaData[index])
				res(mockMetaData[index])
			} else rej(new Error('Mock data failed'))
		}, Math.random() * 1000)
	})

const mockMetaData: IJsonLinkMeta[] = [
	{
		title: 'FrameworkComputer',
		description:
			'Documentation for the Mainboard in the Framework Laptop - GitHub - FrameworkComputer/Mainboard: Documentation for the Mainboard in the Framework Laptop',
		images: ['https://repository-images.githubusercontent.com/462058408/a398a589-990d-40b5-9b0c-5e6635432e39'],
		duration: 962,
		domain: 'github.com',
		url: 'https://github.com/FrameworkComputer/Mainboard'
	},
	{
		title: 'GitHub',
		description:
			'SymPy Documentation repository. Contribute to sympy/sympy_doc development by creating an account on GitHub.',
		images: [
			'https://opengraph.githubassets.com/5ff49c2600625db0e31cab427b2b95e2af62bfabc36152a33163ae175537e7ee/sympy/sympy_doc'
		],
		duration: 1140,
		domain: 'github.com',
		url: 'https://github.com/sympy/sympy_doc'
	},
	{
		title: 'AMP: Cutting Out Google and Enhancing Privacy',
		description:
			"Brave is rolling out a new feature called De-AMP, which allows Brave users to bypass Google-hosted AMP pages, and instead visit the content's publisher directly.",
		images: ['https://brave.com/privacy-updates/images/privacy-updates-og.png'],
		duration: 542,
		domain: 'brave.com',
		url: 'https://brave.com/privacy-updates/18-de-amp/'
	},
	{
		title: "How Intuit's TurboTax capitalized on taxpayers' fear.",
		description: 'ProPublica’s Justin Elliot on how Intuit built its TurboTax empire.    ',
		images: [
			'https://compote.slate.com/images/54500d15-7f67-4f32-b631-7b44d1b9be6b.jpeg?width=780&height=520&rect=7942x5295&offset=0x0'
		],
		duration: 443,
		domain: 'slate.com',
		url: 'https://slate.com/technology/2022/04/turbotax-free-file-online-ftc.html'
	},
	{
		title: 'Canada bans foreign home buyers for two years',
		description:
			"Canada's housing market is one of the world's hottest, with prices jumping by more than 20% in 2021.",
		images: [
			'https://images.axios.com/XIvj5wkl2ZbWAEAkrIUWwmiLqgs=/0x200:4000x2450/1366x768/2022/04/19/1650329719857.jpg'
		],
		duration: 1910,
		domain: 'www.axios.com',
		url: 'https://www.axios.com/canada-foreign-home-buyers-ban-589fdf10-844f-4160-afe0-e8452df92fa8.html'
	}
]
