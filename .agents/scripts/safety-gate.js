#!/usr/bin/env node

// Read stdin
let input = '';
process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input || '{}');
    const toolName = payload?.toolCall?.name || '';
    const args = payload?.toolCall?.args || {};
    const commandLine = args.CommandLine || '';

    // Patterns that require explicit user confirmation
    const dangerousPatterns = [
      /rm\s+-rf\s+(\/|~|\.\.|\*)/i,
      /git\s+push\s+.*--force/i,
      /git\s+reset\s+--hard/i,
      /prisma\s+migrate\s+reset/i,
      /drop\s+database/i,
      /docker\s+system\s+prune/i
    ];

    const isDangerous = dangerousPatterns.some(pattern => pattern.test(commandLine));

    if (isDangerous) {
      console.log(JSON.stringify({
        decision: 'ask',
        reason: `Potential high-risk command detected: "${commandLine}". Requires confirmation.`
      }));
    } else {
      console.log(JSON.stringify({
        decision: 'allow'
      }));
    }
  } catch (err) {
    // If parsing fails, default to allow so we don't break execution
    console.log(JSON.stringify({ decision: 'allow' }));
  }
});
