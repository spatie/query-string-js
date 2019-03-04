import * as qs from "qs";
import { diff, mergeDeep, filterEmptyValues, objectPropertiesToString, sortArrayValues } from "./util";

const qsOptions = {
    arrayFormat: "brackets",
    sort: (a, b) => a.localeCompare(b)
};

export function parse(queryString, options = {}) {
    queryString = queryString.replace(/^\?/, "");

    let queryObject = qs.parse(queryString, { ...qsOptions, ...options });
    queryObject = filterEmptyValues(queryObject);

    if (!options.defaults) {
        return queryObject;
    }

    return mergeDeep({}, options.defaults, queryObject);
}

export function stringify(query, options = {}) {
    query = sanitizeQueryObject(query);

    if (options.defaults) {
        const defaults = sanitizeQueryObject(options.defaults);

        query = diff(defaults, query);
    }

    return qs.stringify(query, { ...qsOptions, ...options });
}

function sanitizeQueryObject(query) {
    query = filterEmptyValues(query);
    query = sortArrayValues(query);
    query = objectPropertiesToString(query);

    return query;
}
