const r = (max = 255) => Math.floor(Math.random() * Math.floor(max))
const rgba = (opacity = 0.1) => [r(), r(), r(), opacity]

export const randomBackground = () => `background-image: linear-gradient(to top, rgba(${rgba()}), rgba(${rgba()}));`
