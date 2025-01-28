// test.js
import {
  createPhindChat,
  createDuckDuckGoChat,
  createBlackboxChat,
} from "./src/index.js";

// Helper function to separate outputs
const printSeparator = (text) => {
  console.log("\n" + "=".repeat(50));
  console.log(text);
  console.log("=".repeat(50) + "\n");
};

async function testBasic() {
  // Initialize providers
  const phind = createPhindChat();
  const ddg = createDuckDuckGoChat();
  const blackbox = createBlackboxChat();

  try {
    // Test very short queries to check basic functionality
    printSeparator("BASIC TESTS - SHORT QUERIES");

    printSeparator("Testing Phind");
    const phindResponse = await phind.chat("what's 2+2?");
    console.log("Response:", phindResponse);

    printSeparator("Testing DuckDuckGo");
    const ddgResponse = await ddg.chat("what's 2+2?");
    console.log("Response:", ddgResponse);

    printSeparator("Testing Blackbox");
    const blackboxResponse = await blackbox.chat("what's 2+2?");
    console.log("Response:", blackboxResponse);
  } catch (error) {
    console.error("Basic test error:", error);
  }
}

async function testWithOptions() {
  printSeparator("OPTION TESTS - TESTING DIFFERENT MODELS/SETTINGS");

  try {
    // Test Phind with different models
    const phind = createPhindChat();
    printSeparator("Testing Phind with Phind-70B model");
    const phindResponse = await phind.chat("Hello!", {
      model: "Phind-70B",
      temperature: 0.7,
    });
    console.log("Response:", phindResponse);

    // Test DuckDuckGo with different models
    const ddg = createDuckDuckGoChat();
    printSeparator("Testing DuckDuckGo with gpt-4o-mini model");
    const ddgResponse = await ddg.chat("Hello!", {
      model: "gpt-4o-mini",
    });
    console.log("Response:", ddgResponse);

    // Test Blackbox with code mode
    const blackbox = createBlackboxChat();
    printSeparator("Testing Blackbox with code mode");
    const blackboxResponse = await blackbox.chat("Hello!", {
      codeModelMode: true,
      maxTokens: 100,
    });
    console.log("Response:", blackboxResponse);
  } catch (error) {
    console.error("Options test error:", error);
  }
}

async function testWithContext() {
  printSeparator("CONTEXT TESTS - TESTING WITH PREVIOUS MESSAGES");

  try {
    const previousMessages = [
      { role: "user", content: "My name is John" },
      { role: "assistant", content: "Hello John!" },
    ];

    const phind = createPhindChat();
    printSeparator("Testing Phind with context");
    const phindResponse = await phind.chat("What's my name?", {
      previousMessages,
    });
    console.log("Response:", phindResponse);

    const blackbox = createBlackboxChat();
    printSeparator("Testing Blackbox with context");
    const blackboxResponse = await blackbox.chat("What's my name?", {
      previousMessages,
    });
    console.log("Response:", blackboxResponse);
  } catch (error) {
    console.error("Context test error:", error);
  }
}

// Run all tests
console.log("Starting tests...\n");

(async () => {
  await testBasic();
  await testWithOptions();
  await testWithContext();
  console.log("\nAll tests completed!");
})();
