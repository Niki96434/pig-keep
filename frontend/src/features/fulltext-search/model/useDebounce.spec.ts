import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with undefined search value', () => {
    const { result } = renderHook(() => useDebounce('initial'))

    expect(result.current.search).toBeUndefined()
  })

  it('should update search value after 300ms debounce delay', () => {
    const { result } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'query' },
    })

    expect(result.current.search).toBeUndefined()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.search).toBe('query')
  })

  it('should only emit the latest value after 300ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'first' },
    })

    act(() => {
      vi.advanceTimersByTime(150)
    })

    rerender({ value: 'second' })

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(result.current.search).toBeUndefined()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(result.current.search).toBe('second')
  })

  it('should update search value when search query is cleared', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'query' as string | undefined },
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.search).toBe('query')

    rerender({ value: undefined })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.search).toBeUndefined()
  })

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderHook(() => useDebounce('test'))

    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
