import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing/test-utils'
import { PetCard } from './PetCard'
import type { Pet } from '../model/types'

describe('PetCard', () => {
  const mockPet: Pet = {
    id: 'pet-123',
    name: 'Борис',
    level: 2,
    progress: 340,
    requiredXp: 500,
    pleasureIndex: 90,
    mood: 'happy',
  }

  it('should render pet name with "Свин" prefix, level, and XP progress', () => {
    renderWithProviders(<PetCard pet={mockPet} />)

    expect(screen.getAllByText('Свин Борис').length).toBeGreaterThan(0)
    expect(screen.getAllByText('уровень 2').length).toBeGreaterThan(0)
    expect(screen.getByText('340/500')).toBeInTheDocument()
    expect(screen.getByText('ХР до следующего уровня')).toBeInTheDocument()
  })

  it('should render mood badge "Счастлив" for happy mood', () => {
    renderWithProviders(<PetCard pet={mockPet} />)

    expect(screen.getAllByText('Счастлив').length).toBeGreaterThan(0)
  })

  it('should render "СВИНОМЕТР" label', () => {
    renderWithProviders(<PetCard pet={mockPet} />)

    expect(screen.getByText('СВИНОМЕТР')).toBeInTheDocument()
  })

  it('should render Boris illustration with alt text', () => {
    renderWithProviders(<PetCard pet={mockPet} />)

    const images = screen.getAllByRole('img', { name: 'Свин Борис' })
    expect(images.length).toBeGreaterThan(0)
  })
})
