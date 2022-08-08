class CellCollection:
    def __init__(self, value_count):
        self.available_values = { i + 1 for i in range(value_count) }

    def pop_value(self, value):
        self.available_values.remove(value)

    def push_value(self, value):
        self.available_values.add(value)


