export function range(start, end) {
    if (end === null || end === undefined) {
        end = start;
        start = 0;
    }
    return new Array(end - start)
        .fill(0)
        .map((x, i) => i + start);
}
export function shuffle(array) {
    const result = Array.from(array);
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
