export default function convertToFormDataString(inputString) {
    const encodedString = inputString.toLowerCase().trim().replace(/ /g, '+');
    return encodeURI(encodedString);
}
