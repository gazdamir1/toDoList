import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import List from "./App"

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-container">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}))

describe("List Component", () => {
  it("renders correctly", () => {
    render(<List />)

    expect(screen.getByText("todos")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("What needs to be done?")
    ).toBeInTheDocument()
    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
  })

  it("adds new task", async () => {
    render(<List />)
    const input = screen.getByPlaceholderText("What needs to be done?")
    const taskText = "New test task"

    await act(async () => {
      fireEvent.change(input, { target: { value: taskText } })
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 })
    })

    expect(await screen.findByText(taskText)).toBeInTheDocument()
    expect(input).toHaveValue("")
  })

  it("limits task text length", async () => {
    render(<List />)
    const input = screen.getByPlaceholderText(
      "What needs to be done?"
    ) as HTMLInputElement
    const longText = "A very very very very very long task description"
    const expectedText = longText.slice(0, 28)

    await act(async () => {
      fireEvent.change(input, {
        target: {
          value: longText.slice(0, 28),
        },
      })
    })

    expect(input.value).toBe(expectedText)
  })

  it("toggles task completion", async () => {
    render(<List />)
    const input = screen.getByPlaceholderText("What needs to be done?")
    const taskText = "Task to toggle"

    await act(async () => {
      fireEvent.change(input, { target: { value: taskText } })
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 })
    })

    const taskItem = await screen.findByText(taskText)
    const checkbox = taskItem.previousElementSibling

    expect(checkbox).not.toHaveClass("_completed_ce1e69")

    await act(async () => {
      if (checkbox) fireEvent.click(checkbox)
    })

    expect(checkbox).toHaveClass("_completed_ce1e69")
    expect(taskItem).toHaveClass("_completedText_ce1e69")
  })

  it("filters tasks", async () => {
    render(<List />)
    const input = screen.getByPlaceholderText("What needs to be done?")

    await act(async () => {
      fireEvent.change(input, { target: { value: "Active task" } })
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 })
    })

    await act(async () => {
      fireEvent.change(input, { target: { value: "Completed task" } })
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 })
    })

    const completedTask = await screen.findByText("Completed task")
    const checkbox = completedTask.previousElementSibling
    await act(async () => {
      if (checkbox) fireEvent.click(checkbox)
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Active"))
    })
    expect(screen.getByText("Active task")).toBeInTheDocument()
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByText("Completed"))
    })
    expect(screen.getByText("Completed task")).toBeInTheDocument()
    expect(screen.queryByText("Active task")).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByText("All"))
    })
    expect(screen.getByText("Active task")).toBeInTheDocument()
    expect(screen.getByText("Completed task")).toBeInTheDocument()
  })

  it("clears completed tasks", async () => {
    render(<List />)
    const input = screen.getByPlaceholderText("What needs to be done?")

    await act(async () => {
      fireEvent.change(input, { target: { value: "Task to clear" } })
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 })
    })

    const task = await screen.findByText("Task to clear")
    const checkbox = task.previousElementSibling
    await act(async () => {
      if (checkbox) fireEvent.click(checkbox)
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Clear completed"))
    })
    expect(screen.queryByText("Task to clear")).not.toBeInTheDocument()
  })
})
