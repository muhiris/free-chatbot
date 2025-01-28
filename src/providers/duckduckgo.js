// src/providers/duckduckgo.js
export const createDuckDuckGoChat = () => {
  const endpoint = "https://duckduckgo.com/duckchat/v1/chat";
  let vqd = "";

  const getVqd = async () => {
    const response = await fetch("https://duckduckgo.com/duckchat/v1/status", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
        Accept: "text/event-stream",
        "x-vqd-accept": "1",
      },
    });

    vqd = response.headers.get("x-vqd-4") || "";
    if (!vqd) {
      throw new Error("Failed to get vqd token");
    }
  };

  const getHeaders = () => ({
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
    Accept: "text/event-stream",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://duckduckgo.com/",
    "Content-Type": "application/json",
    Origin: "https://duckduckgo.com",
    Connection: "keep-alive",
    Cookie: "dcm=1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    TE: "trailers",
    "x-vqd-4": vqd,
  });

  const chat = async (input, options = {}) => {
    try {
      if (!vqd) {
        await getVqd();
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          messages: [
            ...(options.previousMessages || []),
            { content: input, role: "user" },
          ],
          model: options.model || "gpt-4o-mini",
        }),
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
              if (data.message) {
                fullText += data.message;
              }
            } catch (e) {
              // Skip invalid JSON or metadata
              continue;
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
