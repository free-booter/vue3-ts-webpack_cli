<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';
import type { Todo } from '@/types/todo';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

const store = useTodoStore();
const { todos } = storeToRefs(store);

// 归档任务列表
const archivedTasks = ref<Todo[]>([]);
// 图表实例
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  chart = echarts.init(chartRef.value);
  const option = {
    title: {
      text: '任务完成趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '30%']
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        smooth: true,
        data: todos.value
          .filter((todo: Todo) => todo.completed)
          .map((todo: Todo) => [todo.createdAt, 1])
      }
    ]
  };
  
  chart.setOption(option);
};

// 获取归档任务
const fetchArchivedTasks = () => {
  archivedTasks.value = todos.value
    .filter((todo: Todo) => todo.completed)
    .sort((a: Todo, b: Todo) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());
};

onMounted(() => {
  fetchArchivedTasks();
  initChart();
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart?.resize();
  });
});
</script>

<template>
  <div class="archive-page">
    <h1>任务归档</h1>
    
    <div class="chart-container" ref="chartRef"></div>
    
    <div class="archived-tasks">
      <h2>已完成任务</h2>
      <div class="task-list">
        <div v-for="task in archivedTasks" :key="task.id" class="task-item">
          <div class="task-content">
            <span class="task-title">{{ task.title }}</span>
            <span class="task-category" :class="task.category">{{ task.category }}</span>
            <span class="task-date">{{ dayjs(task.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.archive-page {
  padding: 20px;
  
  h1 {
    margin-bottom: 30px;
    color: #2c3e50;
  }
  
  .chart-container {
    height: 400px;
    margin-bottom: 40px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .archived-tasks {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin-bottom: 20px;
      color: #2c3e50;
    }
    
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .task-item {
      padding: 15px;
      border-radius: 6px;
      background: #f8f9fa;
      
      .task-content {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .task-title {
        flex: 1;
        font-weight: 500;
      }
      
      .task-category {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        
        &.work { background-color: #e3f2fd; }
        &.personal { background-color: #f3e5f5; }
        &.shopping { background-color: #e8f5e9; }
        &.health { background-color: #fff3e0; }
        &.others { background-color: #f5f5f5; }
      }
      
      .task-date {
        color: #666;
        font-size: 0.9em;
      }
    }
  }
}
</style> 