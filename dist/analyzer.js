export class ValidationEngine {
    memory;
    constructor(memory) {
        this.memory = memory;
    }
    // Calculates confidence score based on contextual gaps and intelligence
    async validateTaskConfidence(content, identifier, intelligenceData) {
        // 1. Check historical patterns
        const pastPatterns = await this.memory.searchPocketBasePattern(content);
        // 2. Check Seed (Ground Truth)
        const seed = await this.memory.readSeed(identifier);
        let score = 0.5; // Default neutral (Zero-Trust)
        // 3. Impact of Intelligence (Global Knowledge Synthesis)
        if (intelligenceData && (intelligenceData.includes("Intelligence Retrieval") || intelligenceData.includes("Global Knowledge Base"))) {
            // High-confidence match from global knowledge
            score += 0.3;
        }
        else if (intelligenceData && intelligenceData.includes("Autonomous Intelligence Synthesis")) {
            // New learning established
            score += 0.1;
        }
        if (pastPatterns.length > 0) {
            score += 0.2; // Recognized past successful pattern
        }
        if (seed && seed.includes(content)) {
            // Content matches ground truth exactly: high confidence
            score = 1.0;
        }
        else if (seed) {
            // Gap mapping between truth and current content
            // Divergence might indicate an error or unexpected deviation
            score -= 0.3;
        }
        // Clamp score between 0 and 1
        score = Math.max(0, Math.min(1, score));
        return this.determineAction(score);
    }
    determineAction(score) {
        if (score > 0.9) {
            return {
                confidenceScore: Math.round(score * 100) / 100,
                action: "Auto-Fix",
                details: "Score > 0.9. High confidence. Proceeding with Auto-Fix.",
            };
        }
        else if (score >= 0.6) {
            return {
                confidenceScore: Math.round(score * 100) / 100,
                action: "Request Review",
                details: "Score 0.6 - 0.9. Moderate confidence. Requesting human review.",
            };
        }
        else {
            return {
                confidenceScore: Math.round(score * 100) / 100,
                action: "Ignore/Log",
                details: "Score < 0.6. Low confidence. Logging internally.",
            };
        }
    }
}
//# sourceMappingURL=analyzer.js.map