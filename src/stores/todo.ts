import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Todo, TodoFilter } from "@/types/todo";
import dayjs from "dayjs";

export const useTodoStore = defineStore("todo", () => {
  // 状态
  const todos = ref<Todo[]>([]);
  const filter = ref<TodoFilter>({});

  // Getters
  const filteredTodos = computed(() => {
    return todos.value.filter((todo) => {
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
        const todoDate = dayjs(todo.createdAt);
        if (todoDate.isBefore(start) || todoDate.isAfter(end)) return false;
      }
      return true;
    });
  });

  const todosByCategory = computed(() => {
    const result: Record<string, Todo[]> = {};
    todos.value.forEach((todo) => {
      if (!result[todo.category]) {
        result[todo.category] = [];
      }
      result[todo.category].push(todo);
    });
    return result;
  });

  const completedCount = computed(
    () => todos.value.filter((t) => t.completed).length
  );
  const totalCount = computed(() => todos.value.length);

  // Actions
  function addTodo(todo: Omit<Todo, "id" | "createdAt">) {
    const newTodo: Todo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    todos.value.push(newTodo);
  }

  function updateTodo(id: number, updates: Partial<Todo>) {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates };
    }
  }

  function deleteTodo(id: number) {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
    }
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  function setFilter(newFilter: TodoFilter) {
    filter.value = newFilter;
  }

  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.completed);
  }

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
