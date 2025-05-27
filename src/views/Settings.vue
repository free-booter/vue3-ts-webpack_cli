<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import type { UserSettings } from '@/stores/settings';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' }
] as const;

const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '英文', value: 'en-US' }
] as const;

function updateTheme(theme: UserSettings['theme']) {
  settingsStore.updateSettings({ theme });
  applyTheme(theme);
}

function applyTheme(theme: UserSettings['theme']) {
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  document.documentElement.classList.toggle('dark', isDark);
}

// 监听系统主题变化
if (settings.value.theme === 'system') {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      applyTheme('system');
    });
}
</script>

<template>
  <div class="settings-page">
    <h1>设置</h1>
    
    <div class="settings-section">
      <h2>外观</h2>
      <div class="setting-item">
        <label>主题</label>
        <div class="theme-options">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            :class="['theme-button', { active: settings.theme === option.value }]"
            @click="updateTheme(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      
      <div class="setting-item">
        <label>语言</label>
        <select v-model="settings.language">
          <option v-for="option in languageOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="setting-item">
        <label>紧凑模式</label>
        <input
          type="checkbox"
          v-model="settings.display.compactMode"
          @change="settingsStore.updateDisplaySettings({ compactMode: settings.display.compactMode })"
        >
      </div>
    </div>
    
    <div class="settings-section">
      <h2>通知</h2>
      <div class="setting-item">
        <label>启用通知</label>
        <input
          type="checkbox"
          v-model="settings.notifications.enabled"
          @change="settingsStore.updateNotificationSettings({ enabled: settings.notifications.enabled })"
        >
      </div>
      
      <div class="setting-item" v-if="settings.notifications.enabled">
        <label>提前提醒时间（分钟）</label>
        <input
          type="number"
          v-model="settings.notifications.reminderTime"
          @change="settingsStore.updateNotificationSettings({ reminderTime: settings.notifications.reminderTime })"
          min="1"
          max="1440"
        >
      </div>
      
      <div class="setting-item" v-if="settings.notifications.enabled">
        <label>提醒声音</label>
        <input
          type="checkbox"
          v-model="settings.notifications.sound"
          @change="settingsStore.updateNotificationSettings({ sound: settings.notifications.sound })"
        >
      </div>
    </div>
    
    <div class="settings-section">
      <h2>默认值</h2>
      <div class="setting-item">
        <label>默认截止时间（小时）</label>
        <input
          type="number"
          v-model="settings.defaultValues.dueTime"
          @change="settingsStore.updateDefaultValues({ dueTime: settings.defaultValues.dueTime })"
          min="1"
          max="168"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: 30px;
    color: #2c3e50;
  }
  
  .settings-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin-bottom: 20px;
      color: #2c3e50;
      font-size: 1.2em;
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      label {
        flex: 1;
        color: #666;
      }
      
      input[type="number"] {
        width: 100px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        
        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }
      
      input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }
      
      select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 150px;
        
        &:focus {
          outline: none;
          border-color: #409EFF;
        }
      }
      
      .theme-options {
        display: flex;
        gap: 10px;
        
        .theme-button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f5f7fa;
          }
          
          &.active {
            background: #409EFF;
            color: white;
            border-color: #409EFF;
          }
        }
      }
    }
  }
}

// 深色主题样式
:root.dark {
  .settings-page {
    background: #1a1a1a;
    
    h1, h2 {
      color: #ffffff;
    }
    
    .settings-section {
      background: #2c2c2c;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
      
      .setting-item {
        border-bottom-color: #3d3d3d;
        
        label {
          color: #b0b0b0;
        }
        
        input, select {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #ffffff;
          
          &:focus {
            border-color: #409EFF;
          }
        }
        
        .theme-button {
          background: #1a1a1a;
          border-color: #3d3d3d;
          color: #b0b0b0;
          
          &:hover {
            background: #2c2c2c;
          }
          
          &.active {
            background: #409EFF;
            color: white;
          }
        }
      }
    }
  }
}
</style> 