export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  category: TodoCategory;
  priority: TodoPriority;
  dueDate?: string;
  notes?: string;
}

export enum TodoCategory {
  Work = "work",
  Personal = "personal",
  Shopping = "shopping",
  Health = "health",
  Others = "others",
}

export enum TodoPriority {
  High = "high",
  Medium = "medium",
  Low = "low",
}

export interface TodoFilter {
  searchText?: string;
  category?: TodoCategory;
  priority?: TodoPriority;
  completed?: boolean;
  dateRange?: [Date, Date];
}

// 添加类型守卫函数
export function isTodoCategory(value: unknown): value is TodoCategory {
  return Object.values(TodoCategory).includes(value as TodoCategory);
}

export function isTodoPriority(value: unknown): value is TodoPriority {
  return Object.values(TodoPriority).includes(value as TodoPriority);
}

// 添加工具类型
export type TodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;
export type TodoUpdate = Partial<TodoInput>;
