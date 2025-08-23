export class SimpleQueue {
  private static processing = new Set<string>();
  private static queue: Array<{ id: string; fn: () => Promise<unknown> }> = [];

  static async add<T>(id: string, fn: () => Promise<T>): Promise<T> {
    if (this.processing.has(id)) {
      await this.waitForCompletion(id);
      return fn();
    }

    this.processing.add(id);

    try {
      const result = await fn();
      return result;
    } finally {
      this.processing.delete(id);
    }
  }

  private static async waitForCompletion(id: string): Promise<void> {
    while (this.processing.has(id)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
