import express from "express";
import fs from "fs";
const app = express()
const port = 3000
app.use(express.json())

const DATA_FILE = "./data/operations.json";

const readOperations = () => {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data)
}

const writeOperations = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const OperationsType = ["addition", "soustraction", "multiplication", "division"]

const calculate = (a, b, type) => {
    switch (type) {
        case "addition":
            return a + b;

        case "soustraction":
            return a - b;

        case "multiplication":
            return a * b;

        case "division":
            return b !== 0 ? a / b : "impossible de vivise un nombre par 0";

        default:
            return "opération invalide";
    }
};

app.post("/operations/:id", (req, res) => {
    const operations = readOperations();
    const id = Number(req.params.id)
    const { type, a, b } = req.body
    const result = calculate(a, b, type)
    const exist = operations.some(operation => operation.id === id)

    if (exist) {
        return res.status(409).json({ message: "operations existe deja" });
    }
    if (!OperationsType.includes(type)) {
        return res.status(409).json({ message: "Type d'operations invalide" });
    }
    const newOperation = {
        id,
        type,
        a,
        b,
        result,
        createdAt: Date.now().toString()
    }
    operations.push(newOperation)
    writeOperations(operations);
    return res.status(201).json(newOperation)
})

app.get("/operations", (req, res) => {
    const operations = readOperations();
    const filters = req.query;
    const minResult = req.query;
    const maxResult = req.query;
    const dateFrom = req.query;
    const dateTo = req.query;

    const result = operations.filter(opera =>
        Object.keys(filters).every(key => {
            const operaValue = opera[key];
            const filterValue = filters[key];

            if (typeof operaValue === "string") {
                return operaValue.toLowerCase() === filterValue.toLowerCase();
            }

            return operaValue == filterValue;
        })
    );

    if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(result);
});

app.get("/operations/:id", (req, res) => {
    const operations = readOperations();
    const id = Number(req.params.id)
    const operation = operations.find(opera => opera.id == id)
    if (!operation) {
        return res.status(404).json({ message: "operation non trouvé" })
    }
    res.json(operation)
})

app.put("/operations/:id", (req, res) => {
    const operations = readOperations();
    const id = Number(req.params.id);
    const { type, a, b } = req.body;

    const index = operations.findIndex(opera => opera.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "operation not found" });
    }
    if (!OperationsType.includes(type)) {
        return res.status(400).json({ message: "Type d'operation invalide" });
    }

    const result = calculate(a, b, type)
    const newResult = {
        id,
        type,
        a,
        b,
        result,
        createdAt: operations[index].createdAt
    }
    operations[index] = newResult;
    writeOperations(operations);

    return res.json(newResult);
});

app.delete("/operations/:id", (req, res) => {
    let operations = readOperations();
    const id = Number(req.params.id);

    const operationToDelete = operations.find(opera => opera.id === id);

    if (!operationToDelete) {
        return res.status(404).json({ message: "User not found" });
    }

    operations = operations.filter(opera => opera.id !== id);

    writeOperations(operations);

    return res.json({
        message: "Operation " + operationToDelete.id + "deleted"
    });
});

app.listen(port, () => {
    console.log("start");
})