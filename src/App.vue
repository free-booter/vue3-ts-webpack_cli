<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <div class="app">
    <nav class="main-nav">
      <div class="nav-brand">Vue3 Todo</div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">
          <i class="fas fa-home"></i>
          首页
        </RouterLink>
        <RouterLink to="/todos" class="nav-link">
          <i class="fas fa-tasks"></i>
          待办事项
        </RouterLink>
        <RouterLink to="/archive" class="nav-link">
          <i class="fas fa-archive"></i>
          任务归档
        </RouterLink>
        <RouterLink to="/categories" class="nav-link">
          <i class="fas fa-tags"></i>
          分类管理
        </RouterLink>
        <RouterLink to="/statistics" class="nav-link">
          <i class="fas fa-chart-bar"></i>
          统计分析
        </RouterLink>
        <RouterLink to="/settings" class="nav-link">
          <i class="fas fa-cog"></i>
          设置
        </RouterLink>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
}

.app {
  width: 100vw;
  min-height: 100vh;
  display: grid;
}

.main-nav {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  position: fixed;
  height: 100vh;
  width: 220px;

  .nav-brand {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      padding: 12px 15px;
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        width: 20px;
        text-align: center;
      }

      &:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.router-link-active {
        color: white;
        background-color: #409EFF;
      }
    }
  }
}

.main-content {
  margin-left: 220px;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
