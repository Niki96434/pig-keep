import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagBadge } from './TagBadge'

describe('TagBadge component', () => {
  it('should render tag name and title attribute', () => {
    render(<TagBadge name="Срочно" />)

    const tagElement = screen.getByText('Срочно')
    expect(tagElement).toBeInTheDocument()
    expect(tagElement).toHaveAttribute('title', 'Срочно')
  })

  it('should render delete button when onDelete is provided', () => {
    const onDelete = vi.fn()
    render(<TagBadge name="Работа" onDelete={onDelete} />)

    const deleteBtn = screen.getByRole('button', { name: /удалить тег работа/i })
    expect(deleteBtn).toBeInTheDocument()
  })

  it('should not render delete button when onDelete is not provided', () => {
    render(<TagBadge name="Работа" />)

    const deleteBtn = screen.queryByRole('button')
    expect(deleteBtn).not.toBeInTheDocument()
  })

  it('should call onDelete and stop propagation on click', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const onParentClick = vi.fn()

    render(
      <div onClick={onParentClick}>
        <TagBadge name="Покупки" onDelete={onDelete} />
      </div>
    )

    const deleteBtn = screen.getByRole('button', { name: /удалить тег покупки/i })
    await user.click(deleteBtn)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onParentClick).not.toHaveBeenCalled()
  })
})
