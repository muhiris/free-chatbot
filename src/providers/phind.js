// src/providers/phind.js
export const createPhindChat = () => {
  const endpoint = "https://https.extension.phind.com/agent/";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "User-Agent": "",
    Accept: "*/*",
    "Accept-Encoding": "Identity",
  });

  const createRequestBody = (input, options = {}) => ({
    additional_extension_context: "",
    allow_magic_buttons: true,
    is_vscode_extension: true,
    message_history: [
      ...(options.previousMessages || []),
      { content: input, role: "user" },
    ],
    requested_model: options.model || "Phind-70B",
    user_input: input,
  });

  const chat = async (input, options = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(createRequestBody(input, options)),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              if (jsonStr === "[DONE]") continue;

              const data = JSON.parse(jsonStr);
              if (data.choices?.[0]?.delta?.content) {
                fullText += data.choices[0].delta.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullText;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return { chat };
};

