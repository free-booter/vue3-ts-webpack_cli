import { useTodoStore } from "@/stores/todo";
import type { Todo } from "@/types/todo";

export class ImportExportService {
  private static instance: ImportExportService;
  private todoStore = useTodoStore();

  private constructor() {}

  public static getInstance(): ImportExportService {
    if (!ImportExportService.instance) {
      ImportExportService.instance = new ImportExportService();
    }
    return ImportExportService.instance;
  }

  // 导出为 JSON 文件
  public exportToJson(): void {
    const { todos } = this.todoStore;
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 导出为 CSV 文件
  public exportToCsv(): void {
    const { todos } = this.todoStore;
    const headers = [
      "标题",
      "描述",
      "分类",
      "优先级",
      "完成状态",
      "创建时间",
      "更新时间",
      "截止时间",
      "备注",
    ];
    const rows = todos.map((todo) => [
      todo.title,
      todo.description || "",
      todo.category,
      todo.priority,
      todo.completed ? "是" : "否",
      todo.createdAt,
      todo.updatedAt || "",
      todo.dueDate || "",
      todo.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 从 JSON 文件导入
  public async importFromJson(file: File): Promise<void> {
    try {
      const text = await file.text();
      const todos = JSON.parse(text) as Todo[];

      // 验证数据格式
      if (!Array.isArray(todos)) {
        throw new Error("无效的数据格式");
      }

      // 更新 store
      this.todoStore.$patch({ todos });
    } catch (error) {
      console.error("导入失败:", error);
      throw error;
    }
  }

  // 从 CSV 文件导入
  public async importFromCsv(file: File): Promise<void> {
    try {
      const text = await file.text();
      const lines = text
        .split("\n")
        .map((line) =>
          line.split(",").map((cell) => cell.trim().replace(/^"(.*)"$/, "$1"))
        );

      // 移除表头
      const [, ...dataRows] = lines;

      const todos: Todo[] = dataRows.map((row) => ({
        id: Date.now() + Math.random(),
        title: row[0],
        description: row[1] || undefined,
        category: row[2] as Todo["category"],
        priority: row[3] as Todo["priority"],
        completed: row[4] === "是",
        createdAt: row[5],
        updatedAt: row[6] || undefined,
        dueDate: row[7] || undefined,
        notes: row[8] || undefined,
      }));

      // 更新 store
      this.todoStore.$patch({ todos });
    } catch (error) {
      console.error("导入失败:", error);
      throw error;
    }
  }
}

export const importExportService = ImportExportService.getInstance();
