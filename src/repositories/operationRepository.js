import { fsUtils } from "../utils/fs-utils.js";

export const operationRepository = {

    findAll() {
        return fsUtils.read();
    },

    findById(id) {
        const operations = fsUtils.read();
        return operations.find(op => op.id === id) || null;
    },

    findByCriteria(filters) {
        const operations = fsUtils.read();

        return operations.filter(op => {
            return Object.entries(filters).every(([key, value]) => {

                if (key === "minResult") {
                    return typeof op.result === "number" &&
                        op.result >= Number(value);
                }

                if (key === "maxResult") {
                    return typeof op.result === "number" &&
                        op.result <= Number(value);
                }

                if (key === "dateFrom") {
                    return op.createdAt >= value;
                }

                if (key === "dateTo") {
                    return op.createdAt <= value;
                }

                if (typeof op[key] === "string") {
                    return op[key].toLowerCase() === String(value).toLowerCase();
                }

                return Number(op[key]) === Number(value);
            });
        });
    },

    save(operation) {
        const operations = fsUtils.read();
        operations.push(operation);
        fsUtils.write(operations);
        return operation;
    },

    update(id, newOperation) {
        const operations = fsUtils.read();
        const index = operations.findIndex(op => op.id === id);

        if (index === -1) return null;

        operations[index] = newOperation;
        fsUtils.write(operations);
        return newOperation;
    },

    delete(id) {
        const operations = fsUtils.read();
        const filtered = operations.filter(op => op.id !== id);

        if (filtered.length === operations.length) {
            return false;
        }

        fsUtils.write(filtered);
        return true;
    }
};