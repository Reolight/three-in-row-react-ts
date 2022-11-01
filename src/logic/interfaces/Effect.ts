import Field from "../Field"

export default interface Effect {
    name: string
    duration: number
    action?: (f: Field) => void
}