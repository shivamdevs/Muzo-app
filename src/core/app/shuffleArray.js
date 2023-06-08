export default function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        if (randomIndex !== i) {
            [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
        } else {
            [newArray[i], newArray[0]] = [newArray[0], newArray[i]];
        }
    }
    return newArray;
}