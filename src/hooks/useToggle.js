import { signal } from "@preact/signals-react"

const useToggle = (defaultValue) => {
  const toggle = signal(defaultValue)

  const toggleValue = () => {
    toggle.value = !toggle.value 
  }

  return [toggle, toggleValue]
}


export default useToggle;