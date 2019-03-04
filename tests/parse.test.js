import { parse } from "../src";

it("creates an empty object from an empty query string", () => {
    const queryString = parse("");

    expect(queryString).toEqual({});
});

it("adds nothing from an empty value", () => {
    const queryString = parse("search=", {});

    expect(queryString).toEqual({});
});

it("adds nothing from a nested empty null value", () => {
    const queryString = parse("search[filter]=");

    expect(queryString).toEqual({});
});

it("reads a string value", () => {
    const queryString = parse("search=Sebastian");

    expect(queryString).toEqual({ search: "Sebastian" });
});

it("reads multiple values", () => {
    const queryString = parse("page=5&search=Sebastian");

    expect(queryString).toEqual({ page: "5", search: "Sebastian" });
});

it("reads nothing from an empty array", () => {
    const queryString = parse("search[]=");

    expect(queryString).toEqual({});
});

it("reads an array value", () => {
    const queryString = parse("ids[]=1&ids[]=2&ids[]=3");

    expect(queryString).toEqual({ ids: ["1", "2", "3"] });
});

it("reads an object value", () => {
    const queryString = parse("filter[company]=Spatie&filter[name]=Sebastian");

    expect(queryString).toEqual({
        filter: {
            name: "Sebastian",
            company: "Spatie"
        }
    });
});

it("reads a nested object value", () => {
    const queryString = parse("filter[search][author]=Sebastian&filter[search][company]=Spatie");

    expect(queryString).toEqual({
        filter: {
            search: {
                author: "Sebastian",
                company: "Spatie"
            }
        }
    });
});

it("reads a value with dotted keys", () => {
    const queryString = parse("filter[search.author]=Sebastian&filter[search.company]=Spatie");

    expect(queryString).toEqual({
        filter: {
            "search.author": "Sebastian",
            "search.company": "Spatie"
        }
    });
});

it("merges default values", () => {
    const queryString = parse("filter[ids][]=1&filter[ids][]=3&filter[ids][]=4", {
        defaults: {
            filter: {
                search: {
                    company: "Spatie",
                    author: "Sebastian"
                },
                ids: []
            }
        }
    });

    expect(queryString).toEqual({
        filter: {
            search: {
                company: "Spatie",
                author: "Sebastian"
            },
            ids: ["1", "3", "4"]
        }
    });
});
