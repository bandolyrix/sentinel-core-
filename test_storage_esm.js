import { MemoryManager } from './dist/memory.js';
import path from 'path';
import fs from 'fs';

async function testStorage() {
  console.log("--- Testing Custom Folder Storage ---");
  process.env.SENTINEL_STORAGE_PATH = path.join(process.cwd(), 'TestStorage');
  const mmFS = new MemoryManager();
  await mmFS.init();
  const pathFS = await mmFS.writeBackup('TestDomain.md', 'Some content\n');
  console.log(`Saved to: ${pathFS}`);
  if (fs.existsSync(pathFS)) console.log("Success: File created.");

  console.log("\n--- Testing SQLite Storage ---");
  process.env.SENTINEL_SQLITE_PATH = path.join(process.cwd(), 'test_memory.db');
  process.env.SENTINEL_STORAGE_PATH = ''; // Reset custom path
  const mmSqlite = new MemoryManager();
  await mmSqlite.init();
  const pathSql = await mmSqlite.writeBackup('Logic.md', 'Integrated circuit check');
  console.log(`Saved to: ${pathSql}`);
  const results = await mmSqlite.searchPocketBasePattern('circuit');
  console.log("Search Results:", JSON.stringify(results, null, 2));
  if (results.length > 0) console.log("Success: SQLite entry found.");
}

testStorage().catch(console.error);
