export declare class MemoryManager {
    private volatileContext;
    private backupDir;
    private seedDir;
    constructor(basePath?: string);
    init(): Promise<void>;
    setVolatile(key: string, value: string): void;
    getVolatile(key: string): string | undefined;
    writeBackup(filename: string, data: string): Promise<string>;
    readSeed(filename: string): Promise<string | null>;
    writeSeed(filename: string, data: string): Promise<void>;
    searchPocketBasePattern(query: string): Promise<any[]>;
}
