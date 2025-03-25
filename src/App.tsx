import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import "swiper/swiper-bundle.css"
import styles from "./App.module.scss"

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function List() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const swiperRef = useRef<SwiperType | null>(null)
  const nextSlideRef = useRef<HTMLButtonElement>(null)
  const prevSlideRef = useRef<HTMLButtonElement>(null)

  const MAX_LENGTH = 28

  const addTask = () => {
    if (newTask.trim() === "") return

    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    }

    setTasks([...tasks, task])
    setNewTask("")

    // Переход на новый слайд, если текущий заполнен
    if (
      tasks.filter((t) => !t.completed).length % 3 === 0 &&
      tasks.length > 0
    ) {
      setTimeout(() => {
        swiperRef.current?.slideNext()
      }, 0)
    }
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  // Группируем задачи по 3 для отображения на слайдах
  const taskGroups = []
  for (let i = 0; i < filteredTasks.length; i += 3) {
    taskGroups.push(filteredTasks.slice(i, i + 3))
  }

  // Если нет задач, добавляем одну пустую группу
  if (taskGroups.length === 0) {
    taskGroups.push([])
  }

  const activeTasksCount = tasks.filter((task) => !task.completed).length

  return (
    <div className={styles.container}>
      <p className={styles.title}>todos</p>

      <div className={styles.todoContainer}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="What needs to be done?"
            className={styles.taskInput}
            maxLength={MAX_LENGTH}
          />
        </div>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className={styles.swiper}
          loop={true}
        >
          {taskGroups.map((group, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <div className={styles.tasksContainer}>
                {group.map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    <div
                      className={`${styles.taskCircle} ${
                        task.completed ? styles.completed : ""
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </div>
                    <span
                      className={`${styles.taskText} ${
                        task.completed ? styles.completedText : ""
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.footer}>
          <div className={styles.itemsLeft}>
            {activeTasksCount} item{activeTasksCount !== 1 ? "s" : ""} left
          </div>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                filter === "all" ? styles.active : ""
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === "active" ? styles.active : ""
              }`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === "completed" ? styles.active : ""
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <button
            className={styles.clearButton}
            onClick={clearCompleted}
            disabled={!tasks.some((task) => task.completed)}
          >
            Clear completed
          </button>
        </div>
      </div>
      <div className={styles.decorativeBlock}></div>
      <div className={styles.decorativeBlock2}></div>

      <div className={styles.navButtons}>
        <button
          ref={prevSlideRef}
          className={styles.SlideButton}
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={swiperRef.current?.isBeginning}
        >
          Back
        </button>

        <button
          ref={nextSlideRef}
          className={styles.SlideButton}
          onClick={() => swiperRef.current?.slideNext()}
        >
          Next
        </button>
      </div>
    </div>
  )
}
