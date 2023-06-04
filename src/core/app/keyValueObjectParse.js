export default function keyValueObjectParse(obj, key, value) {
    function parseVal(req) {
        const result = {};
        for (const item in req) {
            if (Object.hasOwnProperty.call(req, item)) {
                const element = req[item];
                result[item] = (typeof element === "function") ? element(obj[item]) : element;
            }
        }
        return result;
    }
    if (typeof key === "object" && !Array.isArray(key)) {
        return parseVal({ ...key });
    } else {
        return parseVal({ [key]: value });
    }
}