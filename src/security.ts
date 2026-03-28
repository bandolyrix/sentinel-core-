import { MemoryManager } from "./memory.js";

// Nemo-Claw Security Module
export class SecurityModule {
  private memory: MemoryManager;

  constructor(memory: MemoryManager) {
    this.memory = memory;
  }

  // Ensures sensitive strings are Base64 encoded before writing to memory
  encodeSensitiveData(data: string): string {
    return Buffer.from(data).toString("base64");
  }

  decodeSensitiveData(base64Data: string): string {
    return Buffer.from(base64Data, "base64").toString("utf-8");
  }

  // Aliases for tool usage consistency
  encodeBase64(data: string): string { return this.encodeSensitiveData(data); }
  decodeBase64(data: string): string { return this.decodeSensitiveData(data); }

  // Zero-Trust validation check
  async validateAgainstSeed(
    filename: string,
    proposedFix: string
  ): Promise<boolean> {
    const seedData = await this.memory.readSeed(filename);
    
    if (!seedData) {
      console.warn(`[Zero-Trust] No Seed found for ${filename}. Validation failed.`);
      return false;
    }

    if (proposedFix.includes("unsafe") || proposedFix.includes("bypass")) {
      console.warn(`[Zero-Trust] Proposed fix contains forbidden patterns.`);
      return false;
    }

    return true;
  }
}
