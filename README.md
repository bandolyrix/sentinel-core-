# 🛡️ SentinelCore: Universal Adaptive Intelligence MCP Server

SentinelCore is a state-of-the-art MCP server designed for **Universal Adaptive Intelligence and Task Validation**. It provides a persistent, self-learning "brain" for any AI agent, ensuring tool usage and task execution with near-zero error rates through Zero-Trust validation.

## Core Features & Purpose

### 🛡️ Zero-Trust Architecture

**Purpose**: To ensure that any task execution or data write is validated against a ground truth "Seed" reference.

- **How it works**: Before the AI is allowed to confirm a task or store a discovery, SentinelCore checks the "Seed" directory for baseline patterns.
- **Value**: Prevents errors or logic-breaking deviations in any workflow.

### 🧠 Universal Memory & Adaptive Intelligence

**Purpose**: Provides the AI with a persistent "brain" that learns and organizes discoveries across all domains (Logic, Operations, Software, etc.).

- **Optional Storage**:
  - **Local Folder**: Default behavior (Saves to `./Backup`).
  - **Custom Drive/Folder**: Set `SENTINEL_STORAGE_PATH` to point to a specific drive or directory.
  - **SQLite Engine**: Set `SENTINEL_SQLITE_PATH` to point to a `.db` file for structured persistent storage.
- **Value**: Enables seamless cross-domain synthesis with hardware-independent persistence.

### ⚡ Validation Engine (Task Confidence)

**Purpose**: Replaces binary results with a probabilistic confidence score.

- **Outcome**: Returns a refined confidence score (0.0 to 1.0). High scores signal **Zero-Error Execution**.

### 🔍 Autonomous Intelligence Synthesis

**Purpose**: Bridges context gaps through self-learning.

- **How it works**: encounter unrecognized topics -> autonomously synthesize discovery document -> persist for future recall.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [git](https://git-scm.com/)

### Installation (Bando Edition)

```powershell
npm install -g https://github.com/bandolyrix/sentinel-core-.git
```

### Configuration (Environment Variables)

SentinelCore is highly flexible. Set these optional variables in your environment or MCP settings:

| Variable | Description | Default |
|----------|-------------|---------|
| `SENTINEL_STORAGE_PATH` | Custom drive/folder for memory storage | `./` |
| `SENTINEL_SQLITE_PATH` | Path to SQLite database file | N/A (Uses FS) |
| `POCKETBASE_URL` | URL for remote pattern synchronization | `http://127.0.0.1:8090` |

---

## 🏗️ Technical Architecture

SentinelCore is built on a modular "Gap Mapping" logic, using Node.js/TypeScript for high-performance context processing.

- **Developer**: BandoLyriX
- **Platform**: Node.js / TypeScript
- **Runtime**: MCP (Model Context Protocol)

*Property of the BandoLyriX Advanced Agentic Research Group.*
