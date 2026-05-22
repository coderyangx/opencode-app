import { anthropic } from '@ai-sdk/anthropic';
import { ToolLoopAgent } from 'ai';
// import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';

const memory = anthropic.tools.memory_20250818({
  execute: async (action) => {
    // `action` contains `command`, `path`, and other fields
    // depending on the command (view, create, str_replace,
    // insert, delete, rename).
    // Implement your storage backend here.
    // Return the result as a string.
  }
});
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-haiku-4.5',
  tools: { memory } // only works with Claude
});

const result = await agent.generate({
  prompt: 'Remember that my favorite editor is Neovim'
});

const lettaCloud = () => {
  return {
    tool: (name) => {
      return {};
    }
  };
};
const agent1 = new ToolLoopAgent({
  model: lettaCloud(),
  tools: {
    core_memory_append: lettaCloud.tool('core_memory_append'),
    memory_insert: lettaCloud.tool('memory_insert'),
    memory_replace: lettaCloud.tool('memory_replace')
  },
  providerOptions: {
    letta: {
      agent: { id: 'your-agent-id' }
    }
  }
});

const result1 = await agent.generate({
  prompt: 'Remember that my favorite editor is Neovim'
});
