#!/usr/bin/env node
/**
 * SentinelCore MCP Server
 * Architect: BandoLyriX
 * A secure, zero-trust Model Context Protocol server for distributed intelligence.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MemoryManager } from "./memory.js";
import { SecurityModule } from "./security.js";
import { ValidationEngine } from "./analyzer.js";
import { IntelligenceAgent } from "./research.js";

async function main() {
  const server = new Server(
    {
      name: "SentinelCore",
      version: "1.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const memory = new MemoryManager();
  await memory.init();
  
  const security = new SecurityModule(memory);
  const validator = new ValidationEngine(memory);
  const intelligence = new IntelligenceAgent(memory);

  // Register tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "validate_task_context",
          description: "Analyze any task or content for contextual gaps and confidence using the ValidationEngine.",
          inputSchema: {
            type: "object",
            properties: {
              content: { type: "string", description: "The task content or snippet to validate" },
              identifier: { type: "string", description: "A unique identifier for the context (e.g., filename, task ID)" }
            },
            required: ["content", "identifier"],
          },
        },
        {
          name: "synthesize_knowledge",
          description: "Trigger autonomous research and adaptive intelligence synthesis for any topic.",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "The topic or pattern to synthesize" }
            },
            required: ["query"],
          },
        },
        {
          name: "update_memory",
          description: "Store persistent findings in the Universal Memory layer.",
          inputSchema: {
            type: "object",
            properties: {
              masterFile: { type: "string", description: "Target domain master file (e.g., Software.md)" },
              data: { type: "string", description: "The information to store" },
              isBase64: { type: "boolean", description: "Whether the data is base64 encoded" }
            },
            required: ["masterFile", "data"],
          },
        }
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (request.params.name === "validate_task_context") {
          const args = request.params.arguments as any;
          const intelligenceResult = await intelligence.synthesizeTaskKnowledge(String(args.content));
          const result = await validator.validateTaskConfidence(
            String(args.content),
            String(args.identifier),
            intelligenceResult
          );
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (request.params.name === "synthesize_knowledge") {
        const { query } = request.params.arguments as any;
        const findings = await intelligence.synthesizeTaskKnowledge(query);
        return { content: [{ type: "text", text: findings }] };
      }

      if (request.params.name === "update_memory") {
        const args = request.params.arguments as any;
        if (!args.masterFile || typeof args.data !== "string") {
          throw new Error("Invalid arguments: 'masterFile' and 'data' are required.");
        }
        
        const { masterFile, data, isBase64 } = args;
        const dataToWrite = isBase64 ? security.decodeBase64(data) : data;
        const savedPath = await memory.writeBackup(masterFile, dataToWrite);
        
        const isSafe = await security.validateAgainstSeed(masterFile, dataToWrite);
        
        return { 
          content: [{ 
            type: "text", 
            text: `Data successfully written to ${masterFile}. 
Path: ${savedPath}
Zero-Trust validation: ${isSafe ? "PASSED" : "FAILED"}` 
          }] 
        };
      }

      throw new Error(`Tool not found: ${request.params.name}`);
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SentinelCore MCP server running on stdio");
}

main().catch(console.error);
