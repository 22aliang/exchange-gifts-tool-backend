const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = mongoose.model("Participant", {
  name: String,
});

// 假資料
const participants = [
  { name: "John" },
  { name: "Jane" },
  { name: "Bob" },
  { name: "Alice" },
  { name: "Lisa" },
  { name: "David" },
  { name: "Nell" },
];

// 假資料
Participant.insertMany(participants, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Inserted fake data into MongoDB.");
  }
});

// 獲得所有人
app.get("/participants", (req, res) => {
  db.all("SELECT * FROM participants", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// 删除指定人
app.delete("/participants/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM participants WHERE id = ?", id, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Participant deleted successfully" });
    }
  });
});

// 刪除重複的名稱
app.delete("/remove-duplicate-names", (req, res) => {
  db.run(
    `
    DELETE FROM participants WHERE id NOT IN (
      SELECT MIN(id)
      FROM participants
      GROUP BY name
    )
  `,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Duplicate names removed successfully" });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
