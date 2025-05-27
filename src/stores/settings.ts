import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: "zh-CN" | "en-US";
  notifications: {
    enabled: boolean;
    reminderTime: number; // 提前提醒分钟数
    sound: boolean;
  };
  display: {
    sidebarWidth: number;
    compactMode: boolean;
    showCompleted: boolean;
  };
  defaultValues: {
    category: string;
    priority: string;
    dueTime: number; // 默认截止时间（小时）
  };
}

export const useSettingsStore = defineStore("settings", () => {
  const defaultSettings: UserSettings = {
    theme: "system",
    language: "zh-CN",
    notifications: {
      enabled: true,
      reminderTime: 30,
      sound: true,
    },
    display: {
      sidebarWidth: 220,
      compactMode: false,
      showCompleted: true,
    },
    defaultValues: {
      category: "others",
      priority: "medium",
      dueTime: 24,
    },
  };

  const settings = ref<UserSettings>(defaultSettings);

  // Actions
  function updateSettings(newSettings: Partial<UserSettings>) {
    settings.value = {
      ...settings.value,
      ...newSettings,
    };
    saveToLocalStorage();
  }

  function updateDisplaySettings(
    displaySettings: Partial<UserSettings["display"]>
  ) {
    settings.value.display = {
      ...settings.value.display,
      ...displaySettings,
    };
    saveToLocalStorage();
  }

  function updateNotificationSettings(
    notificationSettings: Partial<UserSettings["notifications"]>
  ) {
    settings.value.notifications = {
      ...settings.value.notifications,
      ...notificationSettings,
    };
    saveToLocalStorage();
  }

  function updateDefaultValues(
    defaultValues: Partial<UserSettings["defaultValues"]>
  ) {
    settings.value.defaultValues = {
      ...settings.value.defaultValues,
      ...defaultValues,
    };
    saveToLocalStorage();
  }

  // 本地存储
  function saveToLocalStorage() {
    localStorage.setItem("user-settings", JSON.stringify(settings.value));
  }

  function loadFromLocalStorage() {
    const savedSettings = localStorage.getItem("user-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        settings.value = {
          ...defaultSettings,
          ...parsed,
        };
      } catch (e) {
        console.error("Failed to parse settings from localStorage:", e);
      }
    }
  }

  // 初始化时加载设置
  loadFromLocalStorage();

  return {
    settings,
    updateSettings,
    updateDisplaySettings,
    updateNotificationSettings,
    updateDefaultValues,
  };
});
