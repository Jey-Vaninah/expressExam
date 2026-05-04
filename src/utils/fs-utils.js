import fs from "fs";

const DATA_FILE = "./data/operations.json";

export const fsUtils = {
    read() {
        try {
            const data = fs.readFileSync(DATA_FILE, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Erreur lecture:", error);
            return [];
        }
    },

    write(data) {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Erreur écriture:", error);
        }
    }
};