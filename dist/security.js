// Nemo-Claw Security Module
export class SecurityModule {
    memory;
    constructor(memory) {
        this.memory = memory;
    }
    // Ensures sensitive strings are Base64 encoded before writing to memory
    encodeSensitiveData(data) {
        return Buffer.from(data).toString("base64");
    }
    decodeSensitiveData(base64Data) {
        return Buffer.from(base64Data, "base64").toString("utf-8");
    }
    // Aliases for tool usage consistency
    encodeBase64(data) { return this.encodeSensitiveData(data); }
    decodeBase64(data) { return this.decodeSensitiveData(data); }
    // Zero-Trust validation check
    async validateAgainstSeed(filename, proposedFix) {
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
//# sourceMappingURL=security.js.map