import { MemoryManager } from "./memory.js";
export interface AnalysisResult {
    confidenceScore: number;
    action: "Auto-Fix" | "Request Review" | "Ignore/Log";
    details: string;
}
export declare class ValidationEngine {
    private memory;
    constructor(memory: MemoryManager);
    validateTaskConfidence(content: string, identifier: string, intelligenceData?: string): Promise<AnalysisResult>;
    private determineAction;
}
