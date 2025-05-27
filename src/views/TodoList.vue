<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import { useSettingsStore } from '@/stores/settings';
import { TodoCategory, TodoPriority } from '@/types/todo';
import type { Todo } from '@/types/todo';
import dayjs from 'dayjs';
import { importExportService } from '@/services/importExport';

const todoStore = useTodoStore();
const settingsStore = useSettingsStore();
const { filteredTodos, completedCount, totalCount } = storeToRefs(todoStore);
const { settings } = storeToRefs(settingsStore);

// 新待办事项表单
const newTodoTitle = ref('');
const newTodoDescription = ref('');
const newTodoCategory = ref<TodoCategory>(TodoCategory.Others);
const newTodoPriority = ref<TodoPriority>(TodoPriority.Medium);
const newTodoDueDate = ref('');

// 筛选条件
const searchText = ref('');
const selectedCategory = ref<TodoCategory | ''>('');
const selectedPriority = ref<TodoPriority | ''>('');
const showCompleted = ref(settings.value.display.showCompleted);

// 监听筛选条件变化
watch([searchText, selectedCategory, selectedPriority, showCompleted], () => {
  todoStore.setFilter({
    searchText: searchText.value,
    category: selectedCategory.value || undefined,
    priority: selectedPriority.value || undefined,
    completed: showCompleted.value ? undefined : false
  });
});

// 方法
function addNewTodo() {
  if (!newTodoTitle.value.trim()) return;

  const dueDate = newTodoDueDate.value || 
    dayjs().add(settings.value.defaultValues.dueTime, 'hour').toISOString();

  todoStore.addTodo({
    title: newTodoTitle.value.trim(),
    description: newTodoDescription.value.trim(),
    category: newTodoCategory.value,
    priority: newTodoPriority.value,
    completed: false,
    dueDate
  });

  // 重置表单
  newTodoTitle.value = '';
  newTodoDescription.value = '';
  newTodoCategory.value = TodoCategory.Others;
  newTodoPriority.value = TodoPriority.Medium;
  newTodoDueDate.value = '';
}

function toggleTodo(id: number) {
  todoStore.toggleTodo(id);
}

function deleteTodo(id: number) {
  if (confirm('确定要删除这个任务吗？')) {
    todoStore.deleteTodo(id);
  }
}

function clearCompleted() {
  if (confirm('确定要清除所有已完成的任务吗？')) {
    todoStore.clearCompleted();
  }
}

// 格式化日期
function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

// 获取优先级标签样式
function getPriorityClass(priority: TodoPriority) {
  return {
    'high': priority === TodoPriority.High,
    'medium': priority === TodoPriority.Medium,
    'low': priority === TodoPriority.Low
  };
}

// 获取分类标签样式
function getCategoryClass(category: TodoCategory) {
  return {
    'work': category === TodoCategory.Work,
    'personal': category === TodoCategory.Personal,
    'shopping': category === TodoCategory.Shopping,
    'health': category === TodoCategory.Health,
    'others': category === TodoCategory.Others
  };
}

// 导入/导出方法
function handleExportJson() {
  importExportService.exportToJson();
}

function handleExportCsv() {
  importExportService.exportToCsv();
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  try {
    if (file.name.endsWith('.json')) {
      await importExportService.importFromJson(file);
    } else if (file.name.endsWith('.csv')) {
      await importExportService.importFromCsv(file);
    } else {
      alert('请选择 .json 或 .csv 文件');
    }
    input.value = ''; // 重置输入
  } catch (error) {
    alert('导入失败：' + (error as Error).message);
  }
}
</script>

<template>
  <div class="todo-list-page">
    <header class="page-header">
      <h1>待办事项</h1>
      <div class="todo-actions">
        <div class="import-export-buttons">
          <input
            type="file"
            accept=".json,.csv"
            @change="handleImport"
            style="display: none"
            ref="fileInput"
          >
          <button @click="$refs.fileInput.click()" class="import-button">
            <i class="fas fa-file-import"></i> 导入
          </button>
          <div class="dropdown">
            <button class="export-button">
              <i class="fas fa-file-export"></i> 导出
            </button>
            <div class="dropdown-content">
              <button @click="handleExportJson">导出为 JSON</button>
              <button @click="handleExportCsv">导出为 CSV</button>
            </div>
          </div>
        </div>
        <div class="todo-stats">
          <span>已完成: {{ completedCount }}/{{ totalCount }}</span>
          <button @click="clearCompleted" class="clear-button" v-if="completedCount > 0">
            清除已完成
          </button>
        </div>
      </div>
    </header>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchText" 
          type="text" 
          placeholder="搜索待办事项..."
          class="search-input"
        >
      </div>

      <div class="filter-group">
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

        <label class="show-completed">
          <input type="checkbox" v-model="showCompleted">
          显示已完成
        </label>
      </div>
    </div>

    <div class="add-todo">
      <div class="add-todo-main">
        <input 
          v-model="newTodoTitle" 
          type="text" 
          placeholder="添加新的待办事项..."
          @keyup.enter="addNewTodo"
          class="add-input"
        >
        <button @click="addNewTodo" class="add-button">添加</button>
      </div>

      <div class="add-todo-details">
        <input 
          v-model="newTodoDescription" 
          type="text" 
          placeholder="添加描述（可选）"
          class="description-input"
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

        <input 
          v-model="newTodoDueDate" 
          type="datetime-local" 
          class="due-date-input"
        >
      </div>
    </div>

    <div class="todo-items" :class="{ 'compact-mode': settings.display.compactMode }">
      <div 
        v-for="todo in filteredTodos" 
        :key="todo.id" 
        class="todo-item"
        :class="{ completed: todo.completed }"
      >
        <div class="todo-content">
          <div class="todo-main">
            <input 
              type="checkbox" 
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
            >
            <div class="todo-text">
              <span class="todo-title">{{ todo.title }}</span>
              <span class="todo-description" v-if="todo.description">{{ todo.description }}</span>
            </div>
          </div>

          <div class="todo-meta">
            <span class="todo-category" :class="getCategoryClass(todo.category)">
              {{ todo.category }}
            </span>
            <span class="todo-priority" :class="getPriorityClass(todo.priority)">
              {{ todo.priority }}
            </span>
            <span class="todo-date" :class="{ overdue: !todo.completed && dayjs(todo.dueDate).isBefore(dayjs()) }">
              {{ formatDate(todo.dueDate || todo.createdAt) }}
            </span>
          </div>
        </div>

        <div class="todo-actions">
          <button @click="deleteTodo(todo.id)" class="delete-button">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-list-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h1 {
      color: #2c3e50;
      margin: 0;
    }

    .todo-actions {
      display: flex;
      align-items: center;
      gap: 20px;

      .import-export-buttons {
        display: flex;
        gap: 10px;

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            font-size: 0.9em;
          }
        }

        .import-button {
          background: #4CAF50;
          color: white;

          &:hover {
            background: #45a049;
          }
        }

        .dropdown {
          position: relative;
          display: inline-block;

          .export-button {
            background: #2196F3;
            color: white;

            &:hover {
              background: #1e88e5;
            }
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: white;
            min-width: 160px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            z-index: 1;

            button {
              width: 100%;
              padding: 12px 16px;
              text-align: left;
              background: none;
              color: #333;
              border: none;

              &:hover {
                background-color: #f5f5f5;
              }
            }
          }

          &:hover .dropdown-content {
            display: block;
          }
        }
      }

      .todo-stats {
        display: flex;
        align-items: center;
        gap: 15px;

        span {
          color: #666;
        }

        .clear-button {
          padding: 8px 16px;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #ff6b81;
          }
        }
      }
    }
  }

  .filters {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: center;

    .search-box {
      flex: 1;
      position: relative;

      i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }

      .search-input {
        width: 100%;
        padding: 10px 10px 10px 35px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1em;

        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }
    }

    .filter-group {
      display: flex;
      gap: 10px;
      align-items: center;

      .filter-select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 120px;

        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }

      .show-completed {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
        cursor: pointer;

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .add-todo {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .add-todo-main {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;

      .add-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1em;

        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }

      .add-button {
        padding: 0 24px;
        background: #409EFF;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: #66b1ff;
        }
      }
    }

    .add-todo-details {
      display: flex;
      gap: 10px;

      .description-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;

        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }

      select, input[type="datetime-local"] {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 120px;

        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }
    }
  }

  .todo-items {
    .todo-item {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;

      &.completed {
        opacity: 0.7;
        background: #f8f9fa;

        .todo-title {
          text-decoration: line-through;
          color: #666;
        }
      }

      .todo-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .todo-main {
          display: flex;
          align-items: flex-start;
          gap: 15px;

          input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-top: 3px;
          }

          .todo-text {
            .todo-title {
              font-size: 1.1em;
              color: #2c3e50;
            }

            .todo-description {
              display: block;
              margin-top: 5px;
              color: #666;
              font-size: 0.9em;
            }
          }
        }

        .todo-meta {
          display: flex;
          gap: 10px;
          align-items: center;

          span {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
          }

          .todo-category {
            &.work { background: #e3f2fd; color: #1976d2; }
            &.personal { background: #f3e5f5; color: #7b1fa2; }
            &.shopping { background: #e8f5e9; color: #388e3c; }
            &.health { background: #fff3e0; color: #f57c00; }
            &.others { background: #f5f5f5; color: #616161; }
          }

          .todo-priority {
            &.high { background: #ffebee; color: #c62828; }
            &.medium { background: #fff3e0; color: #f57c00; }
            &.low { background: #e8f5e9; color: #388e3c; }
          }

          .todo-date {
            color: #666;

            &.overdue {
              color: #ff4757;
            }
          }
        }
      }

      .todo-actions {
        .delete-button {
          padding: 8px;
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s;

          &:hover {
            color: #ff6b81;
          }
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

        .delete-button {
          opacity: 1;
        }
      }
    }

    &.compact-mode {
      .todo-item {
        padding: 12px;
        margin-bottom: 6px;

        .todo-content {
          gap: 6px;

          .todo-main {
            gap: 10px;

            .todo-text {
              .todo-title {
                font-size: 1em;
              }

              .todo-description {
                margin-top: 3px;
                font-size: 0.85em;
              }
            }
          }

          .todo-meta {
            gap: 6px;

            span {
              padding: 2px 6px;
              font-size: 0.85em;
            }
          }
        }
      }
    }
  }
}

// 深色主题样式
:root.dark {
  .todo-list-page {
    .page-header {
      h1 {
        color: #ffffff;
      }

      .todo-actions {
        .import-export-buttons {
          .dropdown {
            .dropdown-content {
              background-color: #2c2c2c;

              button {
                color: #ffffff;

                &:hover {
                  background-color: #3d3d3d;
                }
              }
            }
          }
        }

        .todo-stats span {
          color: #b0b0b0;
        }
      }
    }

    .filters {
      .search-box {
        i {
          color: #b0b0b0;
        }

        .search-input {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #ffffff;

          &:focus {
            border-color: #409EFF;
          }
        }
      }

      .filter-group {
        .filter-select {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #ffffff;
        }

        .show-completed {
          color: #b0b0b0;
        }
      }
    }

    .add-todo {
      background: #2c2c2c;

      .add-todo-main {
        .add-input {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #ffffff;
        }
      }

      .add-todo-details {
        input, select {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #ffffff;
        }
      }
    }

    .todo-items {
      .todo-item {
        background: #2c2c2c;

        &.completed {
          background: #1a1a1a;
        }

        .todo-content {
          .todo-main {
            .todo-text {
              .todo-title {
                color: #ffffff;
              }

              .todo-description {
                color: #b0b0b0;
              }
            }
          }
        }
      }
    }
  }
}
</style> 