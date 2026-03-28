import { MemoryManager } from "./memory.js";
export declare class SecurityModule {
    private memory;
    constructor(memory: MemoryManager);
    encodeSensitiveData(data: string): string;
    decodeSensitiveData(base64Data: string): string;
    encodeBase64(data: string): string;
    decodeBase64(data: string): string;
    validateAgainstSeed(filename: string, proposedFix: string): Promise<boolean>;
}
