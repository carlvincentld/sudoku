export function intersection(xs, ys, ...args) {
    const result = new Set();
    for (const x of xs) {
        if (ys.has(x)) {
            result.add(x);
        }
    }
    for (const zs of args) {
        for (const x of result) {
            if (!zs.has(x)) {
                result.delete(x);
            }
        }
    }
    return result;
}
