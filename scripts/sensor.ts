const HUB_URL = process.env.NEURAL_HUB_URL || "http://localhost:3000";
const { execSync } = require("child_process");

async function syncEvent() {
  try {
    // 1. Identify Project
    const projectName = process.cwd().split(/[\\/]/).pop();
    
    // 2. Get Git Status
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    const lastCommit = execSync("git log -1 --pretty=format:%s").toString().trim();
    const status = execSync("git status --short").toString().trim();
    
    const payload = {
      branch,
      lastCommit,
      status: status || "clean",
      timestamp: new Date().toISOString(),
      path: process.cwd()
    };

    console.log(`Sending update for ${projectName} to Neural Hub...`);

    const response = await fetch(`${HUB_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName,
        type: "dev_sync",
        payload,
        importance: 1
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Hub synchronized. Event ID: ${result.eventId}`);
    } else {
      console.error(`❌ Hub error: ${result.error}`);
    }

  } catch (error) {
    console.error("❌ Failed to sync with Neural Hub:", error instanceof Error ? error.message : String(error));
  }
}

syncEvent();
