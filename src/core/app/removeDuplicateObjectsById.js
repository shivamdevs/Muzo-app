export default function removeDuplicateObjectsById(arr) {
    const uniqueObjects = {};
    let index = 0;
    for (let obj of arr) {
        const key = obj?.id || (JSON.stringify(obj) + index);
        uniqueObjects[key] = obj;
        index++;
    }
    return Object.values(uniqueObjects);
}
