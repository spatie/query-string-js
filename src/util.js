import * as deepmerge from "deepmerge";

export function mergeDeep(...objects) {
    return deepmerge.all(objects);
}

// Modified version of https://github.com/mattphillips/deep-object-diff
export function diff(lhs, rhs) {
    if (lhs === rhs) {
        return {}; // equal return no diff
    }

    if (!isObject(lhs) || !isObject(rhs)) {
        return rhs; // return updated rhs
    }

    const deletedValues = Object.keys(lhs).reduce((acc, key) => {
        return rhs.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
    }, {});

    return Object.keys(rhs).reduce((acc, key) => {
        if (!lhs.hasOwnProperty(key)) {
            return { ...acc, [key]: rhs[key] }; // return added r key
        }

        if (Array.isArray(rhs[key])) {
            return { ...acc, [key]: rhs[key] };
        }

        const difference = diff(lhs[key], rhs[key]);

        if (isObject(difference) && isEmpty(difference)) {
            return acc; // return no diff
        }

        return { ...acc, [key]: difference }; // return updated key
    }, deletedValues);
}

export function isEmpty(object) {
    return Object.keys(object).length === 0;
}

export function isObject(object) {
    if (!object) {
        return false;
    }

    return typeof object === "object";
}

export function mapValues(object, callback) {
    return Object.keys(object).reduce((newObject, key) => {
        newObject[key] = callback(object[key]);
        return newObject;
    }, {});
}

// https://stackoverflow.com/a/46982882/6374824
export function objectPropertiesToString(object) {
    Object.keys(object).forEach(key => {
        if (typeof object[key] === "object") {
            return objectPropertiesToString(object[key]);
        }
        object[key] = String(object[key]);
    });

    return object;
}

export function filterEmptyValues(object) {
    return Object.keys(object).reduce((filteredObject, key) => {
        if (isEmptyValue(object[key])) {
            return filteredObject;
        }

        if (Array.isArray(object[key])) {
            const value = object[key].filter(isNotEmptyValue);

            if (value.length === 0) {
                return filteredObject;
            }

            filteredObject[key] = value;

            return filteredObject;
        }

        if (isObject(object[key])) {
            const value = filterEmptyValues(object[key]);

            if (Object.keys(value).length === 0) {
                return filteredObject;
            }

            filteredObject[key] = value;

            return filteredObject;
        }

        filteredObject[key] = object[key];

        return filteredObject;
    }, {});
}

function isEmptyValue(value) {
    if (value === "") {
        return true;
    }

    if (value === undefined) {
        return true;
    }

    if (value === null) {
        return true;
    }

    return false;
}

function isNotEmptyValue(value) {
    return !isEmptyValue(value);
}

export function sortArrayValues(object) {
    return mapValues(object, value => {
        if (Array.isArray(value)) {
            return value.sort();
        }

        if (isObject(value) && !Array.isArray(value)) {
            return sortArrayValues(value);
        }

        return value;
    });
}
