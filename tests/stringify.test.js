import { stringify } from "../src";

it("creates an empty query string from an empty object", () => {
    const queryString = stringify({});

    expect(queryString).toBe("");
});

it("adds nothing from an undefined value", () => {
    const queryString = stringify({ search: undefined });

    expect(queryString).toBe("");
});

it("adds nothing from a nested undefined", () => {
    const queryString = stringify({
        filter: {
            search: undefined
        }
    });

    expect(queryString).toBe("");
});

it("adds nothing from a null value", () => {
    const queryString = stringify({ search: null });

    expect(queryString).toBe("");
});

it("adds nothing from a nested null value", () => {
    const queryString = stringify({
        filter: {
            search: null
        }
    });

    expect(queryString).toBe("");
});

it("adds nothing from an empty string", () => {
    const queryString = stringify({ search: "" });

    expect(queryString).toBe("");
});

it("adds nothing from a nested empty string", () => {
    const queryString = stringify({
        filter: {
            search: ""
        }
    });

    expect(queryString).toBe("");
});

it("accepts a string value", () => {
    const queryString = stringify({ search: "Sebastian" });

    expect(queryString).toBe("search=Sebastian");
});

it("accepts a number value", () => {
    const queryString = stringify({ page: 5 });

    expect(queryString).toBe("page=5");
});

it("accepts multiple values", () => {
    const queryString = stringify({ page: 5, search: "Sebastian" });

    expect(queryString).toBe("page=5&search=Sebastian");
});

it("sorts multiple values", () => {
    const queryString = stringify({ search: "Sebastian", page: 5 });

    expect(queryString).toBe("page=5&search=Sebastian");
});

it("adds nothing from an empty array", () => {
    const queryString = stringify({ ids: [] });

    expect(queryString).toBe("");
});

it("accepts an array value", () => {
    const queryString = stringify({ ids: [1, 2, 3] }, { encode: false });

    expect(queryString).toBe("ids[]=1&ids[]=2&ids[]=3");
});

it("sorts array values", () => {
    const queryString = stringify({ ids: [2, 1, 3] }, { encode: false });

    expect(queryString).toBe("ids[]=1&ids[]=2&ids[]=3");
});

it("sorts nested array values", () => {
    const queryString = stringify(
        {
            filter: {
                ids: [2, 1, 3]
            }
        },
        { encode: false }
    );

    expect(queryString).toBe("filter[ids][]=1&filter[ids][]=2&filter[ids][]=3");
});

it("accepts an object value", () => {
    const queryString = stringify(
        {
            filter: {
                name: "Sebastian",
                company: "Spatie"
            }
        },
        { encode: false }
    );

    expect(queryString).toBe("filter[company]=Spatie&filter[name]=Sebastian");
});

it("accepts a nested object value", () => {
    const queryString = stringify(
        {
            filter: {
                search: {
                    author: "Sebastian",
                    company: "Spatie"
                }
            }
        },
        { encode: false }
    );

    expect(queryString).toBe("filter[search][author]=Sebastian&filter[search][company]=Spatie");
});

it("sorts nested object value keys", () => {
    const queryString = stringify(
        {
            filter: {
                search: {
                    company: "Spatie",
                    author: "Sebastian"
                }
            }
        },
        { encode: false }
    );

    expect(queryString).toBe("filter[search][author]=Sebastian&filter[search][company]=Spatie");
});

it("accepts a value with dotted keys", () => {
    const queryString = stringify(
        {
            filter: {
                "search.author": "Sebastian",
                "search.company": "Spatie"
            }
        },
        { encode: false }
    );

    expect(queryString).toBe("filter[search.author]=Sebastian&filter[search.company]=Spatie");
});

it("ignores default values", () => {
    const queryString = stringify(
        {
            filter: {
                search: {
                    company: "Spatie",
                    author: "Sebastian"
                },
                ids: [1, 3, 4]
            }
        },
        {
            defaults: {
                filter: {
                    search: {
                        company: "Spatie"
                    },
                    ids: [1, 2, 3]
                }
            },
            encode: false
        }
    );

    expect(queryString).toBe("filter[ids][]=1&filter[ids][]=3&filter[ids][]=4&filter[search][author]=Sebastian");
});

it("ignores default values when they have the same value but a different type", () => {
    const queryString = stringify(
        {
            page: {
                number: "1"
            }
        },
        {
            defaults: {
                page: {
                    number: 1
                }
            }
        }
    );

    expect(queryString).toBe("");
});
