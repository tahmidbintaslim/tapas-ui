import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DOC_PAGES } from "./_pages";
import { DocsSearch, searchDocs } from "./_search";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeAll(() => {
  // jsdom has no modal dialogs; open/close by attribute is enough for these tests.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
});

describe("searchDocs", () => {
  it("finds guides and sections by any word, title matches first", () => {
    expect(searchDocs(DOC_PAGES, "waitlist")[0].href).toBe("/docs/guides/waitlist");
    expect(searchDocs(DOC_PAGES, "price morph").map((p) => p.href)).toContain("/docs/sections/price-morph");
    expect(searchDocs(DOC_PAGES, "dark mode")[0].href).toBe("/docs/dark-mode");
    expect(searchDocs(DOC_PAGES, "faq")[0].href).toBe("/docs/faq");
  });
  it("requires every word and returns nothing for nonsense", () => {
    expect(searchDocs(DOC_PAGES, "faq zzzz")).toEqual([]);
  });
});

describe("DocsSearch", () => {
  it("opens with Ctrl+K, filters, moves with arrow keys and opens the active result on Enter", () => {
    render(<DocsSearch pages={DOC_PAGES} />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = screen.getByRole("combobox", { name: "Search docs and sections" });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: "faq" } });
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(1);
    expect(options.every((o) => /faq/i.test(o.textContent ?? ""))).toBe(true);
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[1].id);
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options.at(-1)!.id);

    fireEvent.keyDown(input, { key: "Enter" });
    expect(push).toHaveBeenCalledWith(searchDocs(DOC_PAGES, "faq").at(-1)!.href);
  });

  it("has a visible search button and says when nothing matches", () => {
    render(<DocsSearch pages={DOC_PAGES} />);
    fireEvent.click(screen.getByRole("button", { name: /Search docs/ }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "qqqq" } });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText(/No pages match/)).toBeTruthy();
  });
});
