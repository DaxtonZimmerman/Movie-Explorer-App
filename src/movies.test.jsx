// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import useMovies from "./hooks/useMovies";
import StatusMessage from "./components/StatusMessage";
import MovieCard from "./components/MovieCard";

const movie = {
  imdbID: "tt0372784",
  Title: "Batman Begins",
  Year: "2005",
  Poster: "N/A",
};
async function finishSearch() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(400);
  });
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("useMovies", () => {
  it("debounces searches and returns movies", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Response: "True", Search: [movie] }),
    });
    const { result, rerender } = renderHook(({ term }) => useMovies(term), {
      initialProps: { term: "Bat" },
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    rerender({ term: "Batman" });
    expect(fetch).not.toHaveBeenCalled();
    await finishSearch();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("s=Batman");
    expect(result.current).toEqual({
      movies: [movie],
      loading: false,
      error: "",
    });
  });
  it("handles searches with no matches", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Response: "False", Error: "Movie not found!" }),
    });
    const { result, rerender } = renderHook(({ term }) => useMovies(term), {
      initialProps: { term: "xyz" },
    });
    await finishSearch();
    expect(result.current).toEqual({ movies: [], loading: false, error: "" });

  });
  it("loads recommendations on empty searches and restores them after clearing", async () => {
    fetch.mockImplementation(async (url) => {
      const title = new URL(url).searchParams.get("s");
      return { ok: true, json: async () => ({ Response: "True", Search: [movie, { ...movie, imdbID: title, Title: title }] }) };
    });
    const { result, rerender } = renderHook(({ term }) => useMovies(term), { initialProps: { term: "" } });
    await finishSearch();
    expect(fetch).toHaveBeenCalledTimes(5);
    expect(result.current.movies).toHaveLength(6);
    expect(result.current.error).toBe("");
    rerender({ term: "Alien" });
    await finishSearch();
    expect(result.current.movies).toHaveLength(2);
    rerender({ term: "   " });
    await finishSearch();
    expect(result.current.movies).toHaveLength(6);
    expect(result.current.loading).toBe(false);
  });
  it.each([
    ["network", () => Promise.reject(new Error("Network unavailable"))],
    ["HTTP", () => Promise.resolve({ ok: false })],
    [
      "API key",
      () =>
        Promise.resolve({
          ok: true,
          json: async () => ({ Response: "False", Error: "Invalid API key!" }),
        }),
    ],
  ])("handles a %s failure", async (_name, response) => {
    fetch.mockImplementation(response);
    const { result } = renderHook(() => useMovies("Batman"));
    await finishSearch();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toContain("Error fetching movies.");
    expect(result.current.movies).toEqual([]);
  });
  it("aborts old requests and ignores their late results", async () => {
    let resolveOld;
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const { result, rerender } = renderHook(({ term }) => useMovies(term), {
      initialProps: { term: "Old" },
    });
    await finishSearch();
    const oldSignal = fetch.mock.calls[0][1].signal;
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Response: "True", Search: [movie] }),
    });
    rerender({ term: "Batman" });
    expect(oldSignal.aborted).toBe(true);
    await finishSearch();
    await act(async () => {
      resolveOld({
        ok: true,
        json: async () => ({
          Response: "True",
          Search: [{ ...movie, Title: "Old" }],
        }),
      });
    });
    expect(result.current.movies[0].Title).toBe("Batman Begins");
  });
});

it("renders loading, error, and empty feedback", () => {
  const { rerender } = render(
    <StatusMessage loading error="" movieCount={0} searchTerm="Batman" />,
  );
  expect(screen.getByRole("status").textContent).toContain("Loading movies...");
  rerender(
    <StatusMessage
      loading={false}
      error="Error fetching movies"
      movieCount={0}
      searchTerm="Batman"
    />,
  );
  expect(screen.getByRole("alert").textContent).toContain(
    "Error fetching movies",
  );
  rerender(
    <StatusMessage
      loading={false}
      error=""
      movieCount={0}
      searchTerm="Batman"
    />,
  );
  expect(screen.getByText("No movies found")).toBeTruthy();
});
it("renders movie title, year, and missing poster fallback", () => {
  render(<MovieCard movie={movie} />);
  expect(screen.getByText("Batman Begins")).toBeTruthy();
  expect(screen.getByText("2005")).toBeTruthy();
  expect(screen.getByText("Poster unavailable")).toBeTruthy();
});
