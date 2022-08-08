class Cell:
    def __init__(self, x, y, column, row, section):
        self.x = x
        self.y = y
        self.value = 0

        self.column = column
        self.row = row
        self.section = section

    def available_values(self):
        return self.column.available_values\
                .intersection(self.row.available_values)\
                .intersection(self.section.available_values)

    def set_value(self, value):
        self.value = value
        self.column.pop_value(value)
        self.row.pop_value(value)
        self.section.pop_value(value)

    def unset_value(self):
        self.column.push_value(self.value)
        self.row.push_value(self.value)
        self.section.push_value(self.value)
        self.value = 0

