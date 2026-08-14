import { useEffect } from 'react'

/**
 * Custom Cursor disabled - restores default, normal system cursor pointer.
 */
export function useCustomCursor() {
  useEffect(() => {
    // Remove any existing custom cursor container & styles
    document.querySelectorAll('.custom-cursor-container').forEach((el) => el.remove())
    const customStyle = document.getElementById('custom-cursor-style')
    if (customStyle) customStyle.remove()

    // Ensure default cursor is restored on all elements
    document.body.style.cursor = 'default'
  }, [])
}
