import { describe, it, expect } from "vitest";
import { streamText } from "@/lib/avalai";

async function readStream(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    output += decoder.decode(value);
  }
  return output;
}

describe("streamText", () => {
  it("emits meta and done events", async () => {
    const stream = streamText("سلام", { conversationId: "c1" });
    const output = await readStream(stream);
    expect(output).toContain("event: meta");
    expect(output).toContain("event: done");
  });
});
