import fs from "node:fs/promises";

class DB {
  data = [];
  filePath = "";
  constructor(filePath) {
    this.filePath = filePath;
    fs.readFile(filePath)
      .then((content) => {
        if (content != "") this.data = JSON.parse(content);
        console.log("DB initilized");
      })
      .catch((err) => console.log("Error reading file:" + err));
  }

  async save() {
    try {
      fs.writeFile(this.filePath, JSON.stringify(this.data));
      console.log("Data updated");
    } catch (err) {
      throw new Error("Error writing to file: " + err);
    }
  }
}

const db = new DB(process.env.FILE_PATH);

export default db;
