/**
 * A subset of {@link KeyboardEvent.key} values.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
export type KeyboardEventKey = ModifierKeys | WhitespaceKeys | NavigationKeys | EditingKeys | FunctionKeys | NumericKeypadKeys | UpperAlpha | LowerAlpha

type NumericKeypadKeys = "Decimal" | "Key11" | "Key12" | "Multiply" | "Add" | "Clear" | "Divide" | "Subtract" | "Separator" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type UpperAlpha = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
type LowerAlpha = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
type ModifierKeys = "Alt" | "AltGraph" | "CapsLock" | "Control" | "Fn" | "FnLock" | "Hyper" | "Meta" | "NumLock" | "ScrollLock" | "Shift" | "Super" | "Symbol" | "SymbolLock"
type WhitespaceKeys = "Enter" | "Tab" | " "
type NavigationKeys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "End" | "Home" | "PageDown" | "PageUp"
type EditingKeys = "Backspace" | "Delete"
type FunctionKeys = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "Soft1" | "Soft2" | "Soft3" | "Soft4"
