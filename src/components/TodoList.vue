<template>
  <div class="todo-list">
    <div class="filters">
      <input 
        v-model="searchText" 
        type="text" 
        placeholder="搜索待办事项..."
        class="search-input"
      >
      <select v-model="selectedCategory" class="filter-select">
        <option value="">所有分类</option>
        <option v-for="category in Object.values(TodoCategory)" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <select v-model="selectedPriority" class="filter-select">
        <option value="">所有优先级</option>
        <option v-for="priority in Object.values(TodoPriority)" :key="priority" :value="priority">
          {{ priority }}
        </option>
      </select>
    </div>

    <div class="add-todo">
      <input 
        v-model="newTodoTitle" 
        type="text" 
        placeholder="添加新的待办事项..."
        @keyup.enter="addNewTodo"
        class="add-input"
      >
      <select v-model="newTodoCategory" class="category-select">
        <option v-for="category in Object.values(TodoCategory)" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <select v-model="newTodoPriority" class="priority-select">
        <option v-for="priority in Object.values(TodoPriority)" :key="priority" :value="priority">
          {{ priority }}
        </option>
      </select>
      <button @click="addNewTodo" class="add-button">添加</button>
    </div>

    <div class="todo-items">
      <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item" :class="{ completed: todo.completed }">
        <div class="todo-content">
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
          >
          <span class="todo-title">{{ todo.title }}</span>
          <span class="todo-category" :class="todo.category">{{ todo.category }}</span>
          <span class="todo-priority" :class="todo.priority">{{ todo.priority }}</span>
          <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
        </div>
        <div class="todo-actions">
          <button @click="deleteTodo(todo.id)" class="delete-button">删除</button>
        </div>
      </div>
    </div>

    <div class="todo-stats">
      <span>完成: {{ completedCount }}/{{ totalCount }}</span>
      <button @click="clearCompleted" class="clear-button">清除已完成</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import { TodoCategory, TodoPriority } from '@/types/todo';
import dayjs from 'dayjs';

const store = useTodoStore();
const { filteredTodos, completedCount, totalCount } = storeToRefs(store);

// 新待办事项表单
const newTodoTitle = ref('');
const newTodoCategory = ref<TodoCategory>(TodoCategory.Others);
const newTodoPriority = ref<TodoPriority>(TodoPriority.Medium);

// 筛选条件
const searchText = ref('');
const selectedCategory = ref<TodoCategory | ''>('');
const selectedPriority = ref<TodoPriority | ''>('');

// 方法
function addNewTodo() {
  if (!newTodoTitle.value.trim()) return;
  
  store.addTodo({
    title: newTodoTitle.value,
    completed: false,
    category: newTodoCategory.value,
    priority: newTodoPriority.value,
  });
  
  newTodoTitle.value = '';
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

// 监听筛选条件变化
watch([searchText, selectedCategory, selectedPriority], () => {
  store.setFilter({
    searchText: searchText.value,
    category: selectedCategory.value || undefined,
    priority: selectedPriority.value || undefined,
  });
});

const { toggleTodo, deleteTodo, clearCompleted } = store;
</script>

<style scoped lang="scss">
.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .search-input,
    .filter-select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .search-input {
      flex: 1;
    }
  }

  .add-todo {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .add-input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .category-select,
    .priority-select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .add-button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #45a049;
      }
    }
  }

  .todo-items {
    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      margin-bottom: 8px;
      background-color: #f9f9f9;
      border-radius: 4px;
      transition: all 0.3s;

      &.completed {
        opacity: 0.6;
        text-decoration: line-through;
      }

      .todo-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .todo-title {
        flex: 1;
      }

      .todo-category,
      .todo-priority {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.8em;
      }

      .todo-category {
        &.work { background-color: #e3f2fd; }
        &.personal { background-color: #f3e5f5; }
        &.shopping { background-color: #e8f5e9; }
        &.health { background-color: #fff3e0; }
        &.others { background-color: #f5f5f5; }
      }

      .todo-priority {
        &.high { background-color: #ffebee; color: #c62828; }
        &.medium { background-color: #fff3e0; color: #f57f17; }
        &.low { background-color: #e8f5e9; color: #2e7d32; }
      }

      .todo-date {
        font-size: 0.8em;
        color: #666;
      }

      .delete-button {
        padding: 4px 8px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;

        &:hover {
          background-color: #d32f2f;
        }
      }
    }
  }

  .todo-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .clear-button {
      padding: 6px 12px;
      background-color: #ff9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #f57c00;
      }
    }
  }
}
</style> 