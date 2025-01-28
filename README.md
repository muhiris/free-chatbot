# free-chatbot

![npm](https://img.shields.io/npm/v/wgpt) ![npm](https://img.shields.io/npm/dt/wgpt)

Free AI chatbots without API keys for Node.js applications. Access multiple AI providers including Phind, DuckDuckGo, and Blackbox AI.

## Installation

```bash
npm install free-chatbot
```

## Basic Usage

```javascript
import {
  createPhindChat,
  createDuckDuckGoChat,
  createBlackboxChat,
} from "free-chatbot";

// Initialize providers
const phind = createPhindChat();
const ddg = createDuckDuckGoChat();
const blackbox = createBlackboxChat();

// Basic Usage Example
async function basicExample() {
  try {
    // Using Phind
    const phindResponse = await phind.chat("What is JavaScript?");
    console.log("Phind response:", phindResponse);

    // Using DuckDuckGo
    const ddgResponse = await ddg.chat("What is Python?");
    console.log("DuckDuckGo response:", ddgResponse);

    // Using Blackbox
    const blackboxResponse = await blackbox.chat("Write a quicksort algorithm");
    console.log("Blackbox response:", blackboxResponse);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Providers and Their Features

### 1. Phind (Recommended for Programming)
```javascript
const phind = createPhindChat();

// Supports context and model options
const response = await phind.chat("What is JavaScript?", {
  model: "Phind-70B",  // Optional, default is "Phind-70B"
  previousMessages: [   // Optional, for conversation context
    { role: "user", content: "Let's talk about programming" },
    { role: "assistant", content: "Sure! What would you like to know?" }
  ]
});
```

### 2. DuckDuckGo (Recommended for General Knowledge)
```javascript
const ddg = createDuckDuckGoChat();

// Supports model selection but NOT context
const response = await ddg.chat("What is Python?", {
  model: "gpt-4o-mini"  // Optional, default is "gpt-4o-mini"
  // Note: DuckDuckGo doesn't support previousMessages
});
```

### 3. Blackbox (Recommended for Code Generation)
```javascript
const blackbox = createBlackboxChat();

// Supports context and token limit
const response = await blackbox.chat("Write a function", {
  maxTokens: 1024,      // Optional, control response length
  previousMessages: [   // Optional, for conversation context
    { role: "user", content: "Let's write some code" },
    { role: "assistant", content: "Sure, what would you like to create?" }
  ]
});
```

## Provider Capabilities

| Feature | Phind | DuckDuckGo | Blackbox |
|---------|-------|------------|----------|
| Context Support | ✅ | ❌ | ✅ |
| Model Selection | ✅ | ✅ | ❌ |
| Token Control | ❌ | ❌ | ✅ |
| Code Generation | ✅ | ❌ | ✅ |
| General Knowledge | ✅ | ✅ | ✅ |

## Error Handling

```javascript
try {
  const response = await phind.chat("Hello");
  console.log(response);
} catch (error) {
  console.error("Error:", error);
}
```

## Best Practices

1. **Phind**
   - Best for programming questions
   - Good with technical context
   - Supports conversation history

2. **DuckDuckGo**
   - Use for single, standalone questions
   - Good for general knowledge
   - Don't use previousMessages with this provider

3. **Blackbox**
   - Excellent for code generation
   - Good with context
   - Use maxTokens to control response length

## Limitations

- DuckDuckGo doesn't support conversation context
- Response times may vary between providers
- Rate limiting may apply
- Internet connection required
- Services may occasionally be unavailable

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.