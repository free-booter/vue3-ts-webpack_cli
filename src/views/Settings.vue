<script setup lang="ts">
import { ref } from 'vue';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoArchive: boolean;
  defaultCategory: string;
  defaultPriority: string;
}

const settings = ref<Settings>({
  darkMode: false,
  notifications: true,
  autoArchive: false,
  defaultCategory: 'personal',
  defaultPriority: 'medium'
});

const saveSettings = () => {
  // 这里可以实现保存设置到本地存储或后端的逻辑
  localStorage.setItem('todo-settings', JSON.stringify(settings.value));
};
</script>

<template>
  <div class="settings">
    <h2>设置</h2>

    <div class="settings-container">
      <div class="setting-group">
        <h3>显示设置</h3>
        <div class="setting-item">
          <label>
            <span>深色模式</span>
            <input type="checkbox" v-model="settings.darkMode">
          </label>
        </div>
      </div>

      <div class="setting-group">
        <h3>通知设置</h3>
        <div class="setting-item">
          <label>
            <span>启用通知</span>
            <input type="checkbox" v-model="settings.notifications">
          </label>
        </div>
      </div>

      <div class="setting-group">
        <h3>任务设置</h3>
        <div class="setting-item">
          <label>
            <span>自动归档已完成任务</span>
            <input type="checkbox" v-model="settings.autoArchive">
          </label>
        </div>
        <div class="setting-item">
          <label>
            <span>默认分类</span>
            <select v-model="settings.defaultCategory">
              <option value="work">工作</option>
              <option value="personal">个人</option>
              <option value="shopping">购物</option>
              <option value="health">健康</option>
              <option value="others">其他</option>
            </select>
          </label>
        </div>
        <div class="setting-item">
          <label>
            <span>默认优先级</span>
            <select v-model="settings.defaultPriority">
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </label>
        </div>
      </div>

      <div class="settings-actions">
        <button @click="saveSettings" class="save-button">保存设置</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  padding: 20px;

  h2 {
    margin-bottom: 30px;
    color: #2c3e50;
    font-size: 2em;
  }

  .settings-container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .setting-group {
    margin-bottom: 30px;

    h3 {
      color: #2c3e50;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .setting-item {
      margin-bottom: 15px;

      label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        span {
          color: #666;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 200px;
          cursor: pointer;

          &:focus {
            outline: none;
            border-color: #409EFF;
          }
        }
      }
    }
  }

  .settings-actions {
    text-align: right;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .save-button {
      padding: 10px 20px;
      background-color: #409EFF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s;

      &:hover {
        background-color: #66b1ff;
      }
    }
  }
}
</style> 