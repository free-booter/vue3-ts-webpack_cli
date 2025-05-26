export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
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
  category?: TodoCategory;
  priority?: TodoPriority;
  completed?: boolean;
  searchText?: string;
  dateRange?: [string, string];
}
