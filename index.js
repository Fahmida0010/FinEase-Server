
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_User, process.env.DB_Pass)

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.dtpqtsr.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    db = client.db('FinEase');
    transactionsCollection = db.collection('transactions');
    app.post("/signup", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        const exists = await usersCollection.findOne({ email });
        if (exists) {
          return res.status(409).json({ message: "Email already exists" });
        }

        await usersCollection.insertOne({ name, email, password });

        res.json({ message: "Signup successful" });

      } catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
      }
    });
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
          return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
          message: "Login successful",
          user: {
            name: user.name,
            email: user.email
          }
        });

      } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
      }
    });
    app.post('/add-transaction', async (req, res) => {
      try {
        const data = { ...req.body, createdAt: new Date() };
        console.log(data)
        const result = await transactionsCollection.insertOne(data);
        console.log(result)
        res.send(result)

      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.get('/my-transactions/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const { sortBy = "date", sortOrder = "desc" } = req.query;

        if (!email) return res.status(400).json({ message: "Email is required" });

        // Sorting logic
        let sortOption = {};
        if (sortBy === "date") sortOption.createdAt = sortOrder === "asc" ? 1 : -1;
        if (sortBy === "amount") sortOption.amount = sortOrder === "asc" ? 1 : -1;

        const transactions = await transactionsCollection
          .find({ email })
          .sort(sortOption)
          .toArray();

        res.json(transactions);

      } catch (err) {
        res.status(500).json({ message: "Failed to fetch transactions" });
      }
    });

    app.get("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });

        if (!transaction) {
          return res.status(404).send({ success: false, message: "Transaction not found" });
        }
        const totalCategoryAgg = await db.collection("transactions").aggregate([
          { $match: { category: transaction.category } },
          { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
        ]).toArray();

        const totalAmountOfCategory = totalCategoryAgg[0]?.totalAmount || 0;

        res.send({
          ...transaction,
          totalAmountOfCategory
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server Error" });
      }
    });
    // UPDATE a transaction
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const result = await db
          .collection("transactions")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
          );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Transaction updated successfully" });
        } else {
          res.status(404).send({ success: false, message: "No data updated" });
        }
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ success: false, error: "Server Error" });
      }
    });

    app.get("/transactions/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = await transactionsCollection.findOne({ _id: new ObjectId(id) });
        res.send(data);
      } catch (err) {
        res.status(500).send({ error: "Server error" });
      }
    });
    // delete transaction
    app.delete("/my-transactions/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await transactionsCollection.deleteOne({
          _id: new ObjectId(id)
        });

        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Transaction not found" });

        res.json({ message: "Transaction deleted successfully" });

      } catch (err) {
        res.status(500).json({ message: "Delete failed" });
      }
    });

    await client.db("FinEase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('FinEase API Running ');
});


// REPORTS 
app.get("/reports", async (req, res) => {
  try {
    const transactions = await transactionsCollection.find().toArray();

    // Category Distribution
    const categoryDistribution = transactions.reduce((acc, item) => {
      const found = acc.find((c) => c.category === item.category);
      if (found) {
        found.value += item.amount;
      } else {
        acc.push({
          category: item.category,
          value: item.amount
        });
      }
      return acc;
    }, []);

    // Monthly Totals
    const monthlyTotals = transactions.reduce((acc, item) => {
      if (!item.createdAt) return acc;

      const month = item.createdAt.toISOString().slice(0, 7); // YYYY-MM
      const existing = acc.find((m) => m._id === month);

      if (existing) {
        if (item.type === "income") existing.income += item.amount;
        else existing.expense += item.amount;
      } else {
        acc.push({
          _id: month,
          income: item.type === "income" ? item.amount : 0,
          expense: item.type === "expense" ? item.amount : 0,
        });
      }

      return acc;
    }, []);

    res.json({
      categoryDistribution,
      monthlyTotals
    });
  } catch (err) {
    console.error("REPORTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

app.get("/summary", async (req, res) => {
  try {
    const income = await transactionsCollection
      .aggregate([
        { $match: { type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
      .toArray();

    const expense = await transactionsCollection
      .aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
      .toArray();

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Summary fetch failed" });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`FinEase Server running on port ${PORT} 🌟`);
});
