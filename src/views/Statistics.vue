<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import { computed } from 'vue';
import { TodoCategory, TodoPriority, type Todo } from '@/types/todo';

const store = useTodoStore();
const { todos } = storeToRefs(store);

// 按分类统计
const categoryStats = computed(() => {
  const stats: Record<TodoCategory, { total: number; completed: number }> = {
    [TodoCategory.Work]: { total: 0, completed: 0 },
    [TodoCategory.Personal]: { total: 0, completed: 0 },
    [TodoCategory.Shopping]: { total: 0, completed: 0 },
    [TodoCategory.Health]: { total: 0, completed: 0 },
    [TodoCategory.Others]: { total: 0, completed: 0 }
  };

  todos.value.forEach((todo: Todo) => {
    stats[todo.category].total++;
    if (todo.completed) {
      stats[todo.category].completed++;
    }
  });

  return stats;
});

// 按优先级统计
const priorityStats = computed(() => {
  const stats: Record<TodoPriority, { total: number; completed: number }> = {
    [TodoPriority.High]: { total: 0, completed: 0 },
    [TodoPriority.Medium]: { total: 0, completed: 0 },
    [TodoPriority.Low]: { total: 0, completed: 0 }
  };

  todos.value.forEach((todo: Todo) => {
    stats[todo.priority].total++;
    if (todo.completed) {
      stats[todo.priority].completed++;
    }
  });

  return stats;
});

// 计算完成率
const getCompletionRate = (completed: number, total: number): string => {
  if (total === 0) return '0%';
  return Math.round((completed / total) * 100) + '%';
};

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

// 添加获取优先级图标的函数
const getPriorityIcon = (priority: TodoPriority): string => {
  const icons = {
    [TodoPriority.High]: 'fas fa-exclamation-circle',
    [TodoPriority.Medium]: 'fas fa-exclamation',
    [TodoPriority.Low]: 'fas fa-angle-down'
  };
  return icons[priority];
};

// 添加获取优先级中文名的函数
const getPriorityName = (priority: TodoPriority): string => {
  const names = {
    [TodoPriority.High]: '高优先级',
    [TodoPriority.Medium]: '中优先级',
    [TodoPriority.Low]: '低优先级'
  };
  return names[priority];
};
</script>

<template>
  <div class="statistics">
    <header class="statistics-header">
      <h2><i class="fas fa-chart-bar"></i> 数据统计</h2>
      <div class="header-actions">
        <span class="date">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
      </div>
    </header>

    <div class="stats-container">
      <!-- 优先级统计 -->
      <div class="priority-stats">
        <h3><i class="fas fa-flag"></i> 优先级任务</h3>
        <div class="priority-cards">
          <div v-for="priority in [TodoPriority.High, TodoPriority.Medium, TodoPriority.Low]"
               :key="priority"
               class="priority-card"
               :class="priority">
            <div class="priority-icon">
              <i :class="getPriorityIcon(priority)"></i>
            </div>
            <div class="priority-info">
              <h4>{{ getPriorityName(priority) }}</h4>
              <div class="priority-numbers">
                <div class="number-item">
                  <span class="number">{{ priorityStats[priority].total }}</span>
                  <span class="label">总任务</span>
                </div>
                <div class="number-item">
                  <span class="number">{{ priorityStats[priority].completed }}</span>
                  <span class="label">已完成</span>
                </div>
                <div class="number-item completion-rate">
                  <span class="number">{{ getCompletionRate(priorityStats[priority].completed, priorityStats[priority].total) }}</span>
                  <span class="label">完成率</span>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: getCompletionRate(priorityStats[priority].completed, priorityStats[priority].total) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类统计 -->
      <div class="category-stats">
        <h3><i class="fas fa-folder"></i> 分类统计</h3>
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
            <div class="category-header">
              <div class="category-icon">
                <i :class="getCategoryIcon(category)"></i>
              </div>
              <h4>{{ getCategoryName(category) }}</h4>
              <div class="completion-badge">
                {{ getCompletionRate(categoryStats[category].completed, categoryStats[category].total) }}
              </div>
            </div>
            <div class="category-body">
              <div class="stat-row">
                <div class="stat-col">
                  <div class="stat-value">{{ categoryStats[category].total }}</div>
                  <div class="stat-label">总任务</div>
                </div>
                <div class="stat-col">
                  <div class="stat-value">{{ categoryStats[category].completed }}</div>
                  <div class="stat-label">已完成</div>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: getCompletionRate(categoryStats[category].completed, categoryStats[category].total) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.statistics {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  .statistics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      color: #2c3e50;
      font-size: 2em;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: #666;
      }
    }

    .date {
      color: #666;
      font-size: 1.1em;
    }
  }

  .stats-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    h3 {
      color: #2c3e50;
      font-size: 1.3em;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: #666;
      }
    }
  }

  .priority-stats {
    .priority-cards {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;

      .priority-card {
        flex: 1;
        min-width: 300px;
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        display: flex;
        gap: 1.5rem;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .priority-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;
        }

        .priority-info {
          flex: 1;

          h4 {
            margin: 0 0 1rem;
            font-size: 1.1em;
            color: #2c3e50;
          }

          .priority-numbers {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1rem;

            .number-item {
              .number {
                display: block;
                font-size: 1.5em;
                font-weight: 600;
                color: #2c3e50;
              }

              .label {
                font-size: 0.9em;
                color: #666;
              }

              &.completion-rate .number {
                color: #4caf50;
              }
            }
          }
        }

        &.high {
          border-left: 4px solid #f44336;
          .priority-icon {
            background: rgba(244, 67, 54, 0.1);
            color: #f44336;
          }
        }

        &.medium {
          border-left: 4px solid #ff9800;
          .priority-icon {
            background: rgba(255, 152, 0, 0.1);
            color: #ff9800;
          }
        }

        &.low {
          border-left: 4px solid #4caf50;
          .priority-icon {
            background: rgba(76, 175, 80, 0.1);
            color: #4caf50;
          }
        }
      }
    }
  }

  .category-stats {
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;

      .category-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .category-header {
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;

          .category-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
          }

          h4 {
            margin: 0;
            font-size: 1.1em;
            color: white;
            flex: 1;
          }

          .completion-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-size: 0.9em;
            color: white;
          }
        }

        .category-body {
          padding: 1.2rem;

          .stat-row {
            display: flex;
            justify-content: space-around;
            margin-bottom: 1rem;

            .stat-col {
              text-align: center;

              .stat-value {
                font-size: 1.5em;
                font-weight: 600;
                color: #2c3e50;
              }

              .stat-label {
                font-size: 0.9em;
                color: #666;
              }
            }
          }
        }

        &.work {
          .category-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }
        }

        &.personal {
          .category-header {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }
        }

        &.shopping {
          .category-header {
            background: linear-gradient(135deg, #FF9800, #F57C00);
            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }
        }

        &.health {
          .category-header {
            background: linear-gradient(135deg, #E91E63, #C2185B);
            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }
        }

        &.others {
          .category-header {
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }
        }
      }
    }
  }

  .progress-bar {
    height: 6px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;

    .progress {
      height: 100%;
      background-color: #4caf50;
      transition: width 0.6s ease;
    }
  }
}
</style> 