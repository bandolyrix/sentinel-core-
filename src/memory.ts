import { promises as fs } from "fs";
import path from "path";
import Database from "better-sqlite3";

export class MemoryManager {
  private volatileContext: Map<string, string> = new Map();
  private backupDir: string;
  private seedDir: string;
  private db: any | null = null;
  private useSqlite: boolean = false;

  constructor(basePath: string = process.cwd()) {
    // 1. Check for custom storage path via environment variable
    const customPath = process.env.SENTINEL_STORAGE_PATH;
    const root = customPath ? path.resolve(customPath) : path.resolve(basePath);
    
    this.backupDir = path.join(root, "Backup");
    this.seedDir = path.join(root, "Seed");

    // 2. Check for SQLite storage via environment variable
    const sqlitePath = process.env.SENTINEL_SQLITE_PATH;
    if (sqlitePath) {
      try {
        const fullSqlitePath = path.resolve(sqlitePath);
        // Ensure directory for sqlite file exists
        const sqliteDir = path.dirname(fullSqlitePath);
        // We handle directory creation in init()
        this.db = new Database(fullSqlitePath);
        this.useSqlite = true;
        console.error(`[MemoryManager] SQLite Storage Enabled: ${fullSqlitePath}`);
      } catch (err) {
        console.error(`[MemoryManager] Failed to initialize SQLite: ${err}`);
      }
    } else {
      console.error(`[MemoryManager] File System Storage Enabled: ${this.backupDir}`);
    }
  }

  async init() {
    // Ensure file system directories exist regardless of SQLite use (for Seed/Fallback)
    await fs.mkdir(this.backupDir, { recursive: true });
    await fs.mkdir(this.seedDir, { recursive: true });

    if (this.useSqlite && this.db) {
      // Initialize shared memory table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS universal_memory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          domain TEXT,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  }

  // Tier 1 (Volatile)
  setVolatile(key: string, value: string) {
    this.volatileContext.set(key, value);
  }

  getVolatile(key: string): string | undefined {
    return this.volatileContext.get(key);
  }

  // Tier 2 (Recursive / Categorized)
  async writeBackup(filename: string, data: string): Promise<string> {
    if (this.useSqlite && this.db) {
      const stmt = this.db.prepare("INSERT INTO universal_memory (domain, content) VALUES (?, ?)");
      stmt.run(filename, data);
      return `sqlite://universal_memory/${filename}`;
    }

    const safeName = path.basename(filename).replace(/[<>:"/\\|?*]/g, "_");
    const filepath = path.join(this.backupDir, safeName);
    await fs.appendFile(filepath, data, "utf-8");
    return filepath;
  }

  // Tier 3 (Seed - Always File System for Ground Truth)
  async readSeed(filename: string): Promise<string | null> {
    try {
      const data = await fs.readFile(path.join(this.seedDir, filename), "utf-8");
      return data;
    } catch {
      return null;
    }
  }

  async writeSeed(filename: string, data: string): Promise<void> {
    await fs.writeFile(path.join(this.seedDir, filename), data, "utf-8");
  }

  // Pattern search (Universal)
  async searchPocketBasePattern(query: string): Promise<any[]> {
    if (this.useSqlite && this.db) {
      const stmt = this.db.prepare("SELECT * FROM universal_memory WHERE content LIKE ?");
      return stmt.all(`%${query}%`);
    }
    // Fallback to local search simulation
    return [];
  }
}
