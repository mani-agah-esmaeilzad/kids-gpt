import { describe, it, expect } from "vitest";
import { getAvatarEmoji } from "@/lib/avatars";

describe("avatars", () => {
  it("returns default when key missing", () => {
    expect(getAvatarEmoji("unknown")).toBe("⭐");
  });
});
