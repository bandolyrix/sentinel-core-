import { MemoryManager } from "./memory.js";
export declare class IntelligenceAgent {
    private memory;
    constructor(memory: MemoryManager);
    synthesizeTaskKnowledge(query: string): Promise<string>;
}
