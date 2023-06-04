import axios from "axios";

export default async function getFileContentSize(url) {
    if (!url) return "NA";
    return new Promise(resolve => {
        axios.head(url).then((result) => {
            resolve(formatBytes(result.headers['content-length'] || 0) || "NA");
        }).catch((err) => {
            console.error(err);
            resolve("NA");
        });
    });
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const decimalPlaces = 2;
    const exponent = Math.floor(Math.log(bytes) / Math.log(base));
    const size = (bytes / Math.pow(base, exponent)).toFixed(decimalPlaces);

    return `${size} ${units[exponent]}`;
}