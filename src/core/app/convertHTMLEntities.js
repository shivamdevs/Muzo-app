export default function convertHTMLEntities(html = "") {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent;
}
