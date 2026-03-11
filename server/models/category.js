// This is a dummy model for categories.
// In a real application, this would interact with a PostgreSQL database.
let categories = [
    { id: 1, name: "Personal" },
    { id: 2, name: "Work" },
    { id: 3, name: "Urgent" }
];
let currentCategoryId = categories.length + 1;

class Category {
    static findById(id) {
        return categories.find(category => category.id === parseInt(id));
    }

    static findAll() {
        return categories;
    }

    static create(name) {
        const newCategory = { id: currentCategoryId++, name };
        categories.push(newCategory);
        return newCategory;
    }

    static findByName(name) {
        return categories.find(category => category.name === name);
    }

    static delete(id) {
        const initialLength = categories.length;
        categories = categories.filter(category => category.id !== parseInt(id));
        return categories.length < initialLength;
    }
}

module.exports = Category;
