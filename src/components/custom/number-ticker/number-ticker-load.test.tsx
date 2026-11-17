import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { expect, it, vi } from "vitest";

vi.mock("motion/react", async (orig) => ({ ...(await orig<typeof import("motion/react")>()), useInView: () => true }));
const { NumberTickerMotion } = await import("./number-ticker-motion");

// A row the visitor could already read when the page loaded must not go back to zero.
it("keeps its numbers when hydrated on screen", async () => {
  const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 10, bottom: 60 } as DOMRect);
  const el = <NumberTickerMotion stats={[{ value: 7, label: "Sample" }]} />;
  const host = document.createElement("div");
  host.innerHTML = renderToString(el);
  document.body.append(host);
  await act(async () => {
    hydrateRoot(host, el);
  });
  // 7 on the second turn of the wheel: (10 + 7) * 5%.
  expect(host.querySelector<HTMLElement>('[data-slot="ticker-wheel"]')!.style.transform).toContain("-85%");
  rect.mockRestore();
  host.remove();
});
