const r = (max = 255) => Math.floor(Math.random() * Math.floor(max))
const rgba = (opacity = 0.1) => [r(), r(), r(), opacity]
const randomColorRgba = () => `rgba(${rgba()})`
const randomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

export const randomColor = () => `#${randomHex(6)}`
