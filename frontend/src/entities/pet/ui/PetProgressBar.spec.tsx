import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PetProgressBar } from './PetProgressBar'

describe('PetProgressBar', () => {
  it('should render progressbar with correct accessibility attributes', () => {
    render(<PetProgressBar progress={150} requiredXp={500} />)

    const bar = screen.getByRole('progressbar', { name: /опыт питомца/i })
    expect(bar).toBeInTheDocument()
    expect(bar).toHaveAttribute('aria-valuenow', '150')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '500')
  })

  it('should calculate correct fill width percentage', () => {
    render(<PetProgressBar progress={250} requiredXp={500} />)
    const fill = screen.getByTestId('pet-progress-fill')

    expect(fill).toBeInTheDocument()
    expect(fill.style.width).toBe('50%')
  })

  it('should clamp width between 0% and 100%', () => {
    const { unmount } = render(<PetProgressBar progress={600} requiredXp={500} />)
    const overFill = screen.getByTestId('pet-progress-fill')
    expect(overFill.style.width).toBe('100%')
    unmount()

    render(<PetProgressBar progress={0} requiredXp={500} />)
    const zeroFill = screen.getByTestId('pet-progress-fill')
    expect(zeroFill.style.width).toBe('0%')
  })

  it('should handle zero requiredXp gracefully', () => {
    render(<PetProgressBar progress={50} requiredXp={0} />)
    const fill = screen.getByTestId('pet-progress-fill')
    expect(fill.style.width).toBe('0%')
  })
})
