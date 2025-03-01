import { describe, it, expect } from "vitest";
import { getBangsAndQuery } from "../src/helpers";

describe("getBangsAndQuery", () => {
  it("should return empty bangs array and the query when no bangs are present", () => {
    const result = getBangsAndQuery("search query without bangs");
    expect(result.bangsInQuery).toEqual([]);
    expect(result.query).toBe("search query without bangs");
  });

  it("should extract a single bang at the beginning", () => {
    const result = getBangsAndQuery("!g search on google");
    expect(result.bangsInQuery).toEqual(["g"]);
    expect(result.query).toBe("search on google");
  });

  it("should extract a single bang in the middle", () => {
    const result = getBangsAndQuery("search !g on google");
    expect(result.bangsInQuery).toEqual(["g"]);
    expect(result.query).toBe("search on google");
  });

  it("should extract a single bang at the end", () => {
    const result = getBangsAndQuery("search on google !g");
    expect(result.bangsInQuery).toEqual(["g"]);
    expect(result.query).toBe("search on google");
  });

  it("should extract multiple bangs", () => {
    const result = getBangsAndQuery(
      "!g !maps search for restaurants in new york"
    );
    expect(result.bangsInQuery).toEqual(["g", "maps"]);
    expect(result.query).toBe("search for restaurants in new york");
  });

  it("should extract bangs scattered throughout the query", () => {
    const result = getBangsAndQuery(
      "search !g for restaurants !maps in new york !yelp"
    );
    expect(result.bangsInQuery).toEqual(["g", "maps", "yelp"]);
    expect(result.query).toBe("search for restaurants in new york");
  });

  it("should handle extra spaces correctly", () => {
    const result = getBangsAndQuery(
      "  !g  !yt   search   query   with    extra   spaces  "
    );
    expect(result.bangsInQuery).toEqual(["g", "yt"]);
    expect(result.query).toBe("search query with extra spaces");
  });

  it("should return all parts as bangs when there is no query", () => {
    const result = getBangsAndQuery("!g !maps !yelp");
    expect(result.bangsInQuery).toEqual(["g", "maps", "yelp"]);
    expect(result.query).toBe("");
  });

  it("should handle empty string input", () => {
    const result = getBangsAndQuery("");
    expect(result.bangsInQuery).toEqual([]);
    expect(result.query).toBe("");
  });

  it("should handle bangs with no space after them", () => {
    const result = getBangsAndQuery("!gsearch for something");
    expect(result.bangsInQuery).toEqual(["gsearch"]);
    expect(result.query).toBe("for something");
  });
});
