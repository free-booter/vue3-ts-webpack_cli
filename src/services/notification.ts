import { useSettingsStore } from "@/stores/settings";
import type { Todo } from "@/types/todo";

class NotificationService {
  private static instance: NotificationService;
  private notificationSound: HTMLAudioElement;
  private settingsStore = useSettingsStore();

  private constructor() {
    this.notificationSound = new Audio("/notification.mp3");
    this.requestPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermission(): Promise<void> {
    if (!("Notification" in window)) {
      console.warn("该浏览器不支持桌面通知");
      return;
    }

    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  }

  public async notify(todo: Todo): Promise<void> {
    const { settings } = this.settingsStore;

    if (
      !settings.notifications.enabled ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const notification = new Notification("待办事项提醒", {
      body: `任务"${todo.title}"即将到期`,
      icon: "/favicon.ico",
      tag: `todo-${todo.id}`,
      requireInteraction: true,
    });

    if (settings.notifications.sound) {
      this.notificationSound.play().catch(console.error);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  public scheduleReminder(todo: Todo): void {
    if (!todo.dueDate) return;

    const { settings } = this.settingsStore;
    const dueDate = new Date(todo.dueDate);
    const reminderTime = new Date(
      dueDate.getTime() - settings.notifications.reminderTime * 60000
    );
    const now = new Date();

    if (reminderTime > now) {
      setTimeout(() => {
        this.notify(todo);
      }, reminderTime.getTime() - now.getTime());
    }
  }

  public cancelReminder(todoId: number): void {
    // 如果需要，可以在这里实现取消提醒的逻辑
  }
}

export const notificationService = NotificationService.getInstance();
