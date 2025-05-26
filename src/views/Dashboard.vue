<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import { computed } from 'vue';
import { TodoCategory, TodoPriority, type Todo } from '@/types/todo';

const store = useTodoStore();
const { todos } = storeToRefs(store);

const todosByCategory = computed(() => {
  const result: Record<TodoCategory, Todo[]> = {
    [TodoCategory.Work]: [],
    [TodoCategory.Personal]: [],
    [TodoCategory.Shopping]: [],
    [TodoCategory.Health]: [],
    [TodoCategory.Others]: []
  };
  
  todos.value.forEach((todo: Todo) => {
    result[todo.category].push(todo);
  });
  
  return result;
});

const stats = computed(() => ({
  total: todos.value.length,
  completed: todos.value.filter((todo: Todo) => todo.completed).length,
  highPriority: todos.value.filter((todo: Todo) => todo.priority === TodoPriority.High).length,
  dueToday: todos.value.filter((todo: Todo) => {
    if (!todo.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length
}));

// 添加获取分类图标的函数
const getCategoryIcon = (category: TodoCategory): string => {
  const icons = {
    [TodoCategory.Work]: 'fas fa-briefcase',
    [TodoCategory.Personal]: 'fas fa-user',
    [TodoCategory.Shopping]: 'fas fa-shopping-cart',
    [TodoCategory.Health]: 'fas fa-heartbeat',
    [TodoCategory.Others]: 'fas fa-ellipsis-h'
  };
  return icons[category];
};

// 添加获取分类中文名的函数
const getCategoryName = (category: TodoCategory): string => {
  const names = {
    [TodoCategory.Work]: '工作',
    [TodoCategory.Personal]: '个人',
    [TodoCategory.Shopping]: '购物',
    [TodoCategory.Health]: '健康',
    [TodoCategory.Others]: '其他'
  };
  return names[category];
};
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h2>仪表盘</h2>
      <div class="header-actions">
        <span class="date">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
      </div>
    </header>
    
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="stat-content">
          <h3>总任务</h3>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>
      <div class="stat-card completed">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>已完成</h3>
          <div class="stat-value">{{ stats.completed }}</div>
        </div>
      </div>
      <div class="stat-card priority">
        <div class="stat-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="stat-content">
          <h3>高优先级</h3>
          <div class="stat-value">{{ stats.highPriority }}</div>
        </div>
      </div>
      <div class="stat-card due">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>今日到期</h3>
          <div class="stat-value">{{ stats.dueToday }}</div>
        </div>
      </div>
    </div>

    <div class="category-overview">
      <h3><i class="fas fa-chart-pie"></i> 分类概览</h3>
      <div class="category-grid">
        <div v-for="category in [
          TodoCategory.Work,
          TodoCategory.Personal,
          TodoCategory.Shopping,
          TodoCategory.Health,
          TodoCategory.Others
        ]" 
             :key="category"
             class="category-card"
             :class="category">
          <div class="category-icon">
            <i :class="getCategoryIcon(category)"></i>
          </div>
          <div class="category-content">
            <h4>{{ getCategoryName(category) }}</h4>
            <div class="category-count">
              {{ todosByCategory[category].length }} 项任务
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      color: #2c3e50;
      font-size: 2em;
      margin: 0;
    }

    .header-actions {
      .date {
        color: #666;
        font-size: 1.1em;
      }
    }
  }

  .stats-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    .stat-card {
      flex: 1;
      min-width: 240px;
      max-width: calc(25% - 1.125rem);
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8em;
        flex-shrink: 0;
      }

      .stat-content {
        flex-grow: 1;

        h3 {
          color: #666;
          margin: 0 0 0.5rem 0;
          font-size: 1em;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #2c3e50;
        }
      }

      &.total .stat-icon {
        background: rgba(76, 175, 80, 0.1);
        color: #4CAF50;
      }

      &.completed .stat-icon {
        background: rgba(33, 150, 243, 0.1);
        color: #2196F3;
      }

      &.priority .stat-icon {
        background: rgba(244, 67, 54, 0.1);
        color: #F44336;
      }

      &.due .stat-icon {
        background: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      }
    }
  }

  .category-overview {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    h3 {
      color: #2c3e50;
      margin: 0 0 1.5rem 0;
      font-size: 1.3em;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: #666;
      }
    }

    .category-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      .category-card {
        flex: 1;
        min-width: 280px;
        max-width: calc(33.333% - 0.667rem);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.02);
        }

        .category-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
        }

        .category-content {
          h4 {
            margin: 0 0 0.3rem 0;
            font-size: 1.1em;
            font-weight: 500;
          }

          .category-count {
            font-size: 0.9em;
            opacity: 0.9;
          }
        }

        &.work { 
          background: linear-gradient(135deg, #4CAF50, #45a049);
          &:hover { background: linear-gradient(135deg, #45a049, #388E3C); }
        }
        &.personal { 
          background: linear-gradient(135deg, #2196F3, #1976D2);
          &:hover { background: linear-gradient(135deg, #1976D2, #1565C0); }
        }
        &.shopping { 
          background: linear-gradient(135deg, #FF9800, #F57C00);
          &:hover { background: linear-gradient(135deg, #F57C00, #EF6C00); }
        }
        &.health { 
          background: linear-gradient(135deg, #E91E63, #C2185B);
          &:hover { background: linear-gradient(135deg, #C2185B, #AD1457); }
        }
        &.others { 
          background: linear-gradient(135deg, #9C27B0, #7B1FA2);
          &:hover { background: linear-gradient(135deg, #7B1FA2, #6A1B9A); }
        }
      }
    }
  }
}
</style> 