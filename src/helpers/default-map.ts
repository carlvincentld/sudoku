export class DefaultMap<K, V> extends Map<K, V> {
    getOrDefault(key: K, fn: (key: K) => V): V {
        if (!this.has(key)) {
            this.set(key, fn(key));
        }

        return this.get(key)!;
    }
}