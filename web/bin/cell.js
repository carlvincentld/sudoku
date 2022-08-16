export class Cell {
    constructor(x, y, column, row, section) {
        this.x = x;
        this.y = y;
        this.column = column;
        this.row = row;
        this.section = section;
        this.value = 0;
    }
    availableValues() {
        return this.section.intersectValues(this.column, this.row);
    }
    setValue(value) {
        this.value = value;
        this.column.popValue(value);
        this.row.popValue(value);
        this.section.popValue(value);
    }
    unsetValue() {
        const value = this.value;
        this.column.pushValue(value);
        this.row.pushValue(value);
        this.section.pushValue(value);
        this.value = 0;
        return value;
    }
}
