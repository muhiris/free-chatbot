// src/providers/blackbox.js
import https from "https";

export const createBlackboxChat = () => {
  const chat = async (input) => {
    return new Promise((resolve, reject) => {
      const requestBody = {
        messages: [
          {
            content: input,
            role: "user",
          },
        ],
        previewToken: null,
        userId: null,
        codeModelMode: true,
        agentMode: {
          mode: true,
          id: "ModelSwitcher",
          name: "Model Switcher",
        },
        trendingAgentMode: {},
        isMicMode: false,
        maxTokens: 4096,
        isChromeExt: false,
        githubToken: null,
      };

      const options = {
        hostname: "www.blackbox.ai",
        path: "/api/chat",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Origin: "https://www.blackbox.ai",
          Referer: "https://www.blackbox.ai/",
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (data) {
              resolve(data);
            } else {
              reject(new Error("Empty response"));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(JSON.stringify(requestBody));
      req.end();
    });
  };

  return { chat };
};
