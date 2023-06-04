export default function parseTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600).toFixed(0);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60).toFixed(0);
    let seconds = (totalSeconds % 60).toFixed(0);

    return ((hours > 0) ? String(hours).padStart(2, "0") + ':' : '') + (hours > 0 ? String(minutes).padStart(2, "0") : minutes) + ':' + String(seconds).padStart(2, "0");
};