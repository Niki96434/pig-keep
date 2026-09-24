import { useEffect, useRef, type RefObject } from 'react'

export interface OnClickOutside<T extends HTMLElement = HTMLElement> {
  formRef: RefObject<T | null>
  onSubmit: () => void
  isOpenForm: boolean
}

type EventType = PointerEvent

export function useOnClickOutside({ formRef, onSubmit, isOpenForm }: OnClickOutside) {
  const onSubmitRef = useRef(onSubmit)

  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  useEffect(() => {
    const listener = (event: EventType) => {
      if (!formRef.current || formRef.current.contains(event.target as Node)) {
        return
      }
      onSubmitRef.current()
    }
    if (isOpenForm) {
      document.addEventListener('pointerdown', listener)
      return () => {
        document.removeEventListener('pointerdown', listener)
      }
    }
  }, [formRef, isOpenForm])
}
