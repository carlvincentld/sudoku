import { range } from './helpers/array.helper';
export class CellCollection {
    constructor(valueCount) {
        this.availableValues = range(1, valueCount + 1);
    }
    popValue(value) {
        this.availableValues[value - 1] = 0;
    }
    pushValue(value) {
        this.availableValues[value - 1] = value;
    }
    // TODO: Déplacer la logique de gestion de valeurs dans sa propre classe
    intersectValues(...collection) {
        const result = new Set();
        for (let i = 0; i < this.availableValues.length; i++) {
            if (this.availableValues[i] !== 0
                && collection.every(xs => xs.availableValues[i] === this.availableValues[i])) {
                result.add(this.availableValues[i]);
            }
        }
        return result;
    }
}
