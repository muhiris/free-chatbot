// src/providers/base.js
import { ChatError } from "../utils/errors.js";
export class BaseProvider {
  constructor() {
    if (this.constructor === BaseProvider) {
      throw new Error("Can't instantiate abstract class");
    }
  }

  async makeRequest(input, options = {}, callbacks = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(this.createRequestBody(input, options)),
      });

      if (!response.ok || !response.body) {
        throw new ChatError(
          `Request failed with status ${response.status}`,
          this.providerName,
          "REQUEST_FAILED"
        );
      }

      await this.processStreamingResponse(response, callbacks);
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    } finally {
      if (callbacks.onComplete) {
        callbacks.onComplete();
      }
    }
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };
  }
}
