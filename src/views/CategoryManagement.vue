<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import { TodoCategory } from '@/types/todo';
import type { Todo } from '@/types/todo';
import * as echarts from 'echarts';

const store = useTodoStore();
const { todos } = storeToRefs(store);

// 分类统计
const categoryStats = computed(() => {
  const stats = new Map<TodoCategory, number>();
  
  Object.values(TodoCategory).forEach((category: TodoCategory) => {
    const count = todos.value.filter((todo: Todo) => todo.category === category).length;
    stats.set(category, count);
  });
  
  return stats;
});

// 图表相关
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chart = echarts.init(chartRef.value);
  const option = {
    title: {
      text: '任务分类统计'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '任务分类',
        type: 'pie',
        radius: '70%',
        data: Array.from(categoryStats.value).map(([name, value]) => ({
          name,
          value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
};

onMounted(() => {
  initChart();
  
  window.addEventListener('resize', () => {
    chart?.resize();
  });
});
</script>

<template>
  <div class="category-page">
    <h1>分类管理</h1>
    
    <div class="stats-container">
      <div class="chart-container" ref="chartRef"></div>
      
      <div class="category-list">
        <div v-for="[category, count] in categoryStats" :key="category" class="category-item">
          <div class="category-info">
            <span class="category-name" :class="category">{{ category }}</span>
            <span class="category-count">{{ count }} 个任务</span>
          </div>
          <div class="category-progress">
            <div class="progress-bar" 
                 :style="{ width: `${(count / todos.length) * 100}%` }"
                 :class="category">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-page {
  padding: 20px;
  
  h1 {
    margin-bottom: 30px;
    color: #2c3e50;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    .chart-container {
      height: 400px;
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
    
    .category-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      
      .category-item {
        margin-bottom: 20px;
        
        .category-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          
          .category-name {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            
            &.work { background-color: #e3f2fd; }
            &.personal { background-color: #f3e5f5; }
            &.shopping { background-color: #e8f5e9; }
            &.health { background-color: #fff3e0; }
            &.others { background-color: #f5f5f5; }
          }
          
          .category-count {
            color: #666;
          }
        }
        
        .category-progress {
          height: 6px;
          background: #eee;
          border-radius: 3px;
          overflow: hidden;
          
          .progress-bar {
            height: 100%;
            transition: width 0.3s ease;
            
            &.work { background-color: #2196f3; }
            &.personal { background-color: #9c27b0; }
            &.shopping { background-color: #4caf50; }
            &.health { background-color: #ff9800; }
            &.others { background-color: #9e9e9e; }
          }
        }
      }
    }
  }
}
</style> 