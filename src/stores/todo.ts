import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Todo, TodoFilter, TodoInput, TodoUpdate } from "@/types/todo";
import { TodoCategory, TodoPriority, isTodoCategory } from "@/types/todo";
import { notificationService } from "@/services/notification";

export const useTodoStore = defineStore("todo", () => {
  // 状态
  const todos = ref<Todo[]>([]);
  const filter = ref<TodoFilter>({});

  // Getters
  const filteredTodos = computed(() => {
    return todos.value.filter((todo: Todo) => {
      if (filter.value.category && todo.category !== filter.value.category)
        return false;
      if (filter.value.priority && todo.priority !== filter.value.priority)
        return false;
      if (
        filter.value.completed !== undefined &&
        todo.completed !== filter.value.completed
      )
        return false;
      if (
        filter.value.searchText &&
        !todo.title
          .toLowerCase()
          .includes(filter.value.searchText.toLowerCase())
      )
        return false;
      if (filter.value.dateRange) {
        const [start, end] = filter.value.dateRange;
        const todoDate = new Date(todo.createdAt);
        if (todoDate < start || todoDate > end) return false;
      }
      return true;
    });
  });

  const todosByCategory = computed(() => {
    const result: Record<TodoCategory, Todo[]> = Object.values(
      TodoCategory
    ).reduce((acc, category) => {
      if (isTodoCategory(category)) {
        acc[category] = [];
      }
      return acc;
    }, {} as Record<TodoCategory, Todo[]>);

    todos.value.forEach((todo: Todo) => {
      result[todo.category].push(todo);
    });
    return result;
  });

  const completedCount = computed(
    () => todos.value.filter((todo: Todo) => todo.completed).length
  );
  const totalCount = computed(() => todos.value.length);

  // Actions
  function addTodo(todo: TodoInput) {
    const newTodo: Todo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    todos.value.push(newTodo);

    // 如果设置了截止时间，安排提醒
    if (newTodo.dueDate) {
      notificationService.scheduleReminder(newTodo);
    }
  }

  function updateTodo(id: number, updates: TodoUpdate) {
    const index = todos.value.findIndex((todo: Todo) => todo.id === id);
    if (index !== -1) {
      const updatedTodo = {
        ...todos.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      todos.value[index] = updatedTodo;

      // 如果更新了截止时间，重新安排提醒
      if (updates.dueDate) {
        notificationService.scheduleReminder(updatedTodo);
      }
    }
  }

  function deleteTodo(id: number) {
    const index = todos.value.findIndex((todo: Todo) => todo.id === id);
    if (index !== -1) {
      // 取消提醒
      notificationService.cancelReminder(id);
      todos.value.splice(index, 1);
    }
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((todo: Todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();

      // 如果任务完成，取消提醒
      if (todo.completed) {
        notificationService.cancelReminder(id);
      } else if (todo.dueDate) {
        // 如果任务重新激活且有截止时间，重新安排提醒
        notificationService.scheduleReminder(todo);
      }
    }
  }

  function setFilter(newFilter: TodoFilter) {
    filter.value = newFilter;
  }

  function clearCompleted() {
    // 取消所有已完成任务的提醒
    todos.value.forEach((todo: Todo) => {
      if (todo.completed) {
        notificationService.cancelReminder(todo.id);
      }
    });
    todos.value = todos.value.filter((todo: Todo) => !todo.completed);
  }

  // 初始化时为所有未完成且有截止时间的任务安排提醒
  function initializeReminders() {
    todos.value.forEach((todo: Todo) => {
      if (!todo.completed && todo.dueDate) {
        notificationService.scheduleReminder(todo);
      }
    });
  }

  // 在创建 store 时初始化提醒
  initializeReminders();

  return {
    // 状态
    todos,
    filter,
    // Getters
    filteredTodos,
    todosByCategory,
    completedCount,
    totalCount,
    // Actions
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearCompleted,
  };
});
