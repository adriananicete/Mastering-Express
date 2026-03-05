import express from "express";

const PORT = process.env.PORT || 8000;
const app = express();

const users = [
  { id: 1, name: "Adrian", email: "anicete.ian14@gmail.com" },
  { id: 2, name: "Roselyn", email: "roselyn@gmail.com" },
  { id: 3, name: "Shaira", email: "neslie@gmail.com" },
  { id: 4, name: "Angelo", email: "angelo@gmail.com" },
  { id: 5, name: "Aaron", email: "aaron@gmail.com" },
  { id: 6, name: "Albert", email: "albert@gmail.com" },
  { id: 7, name: "Antonia", email: "antonia@gmail.com" },
];

const products = [
  { id: 123, name: "Guitar", price: 100 },
  { id: 456, name: "Drums", price: 250 },
  { id: 789, name: "Keyboard", price: 150 },
];

app.get("/", (req, res) => {
  res.send("Hello again Adrian");
});

// @desc Get all users
// @route GET /api/users
app.get("/api/users", (req, res) => {
    console.log(req.query)

    const { query: { filter, value }} = req;

    if (filter && value) {
        const filteredUser = users.filter(user => user[filter].toLowerCase().includes(value.toLowerCase()));
        return res.json(filteredUser)
    } else {
        return res.json(users)   
    }
});

// @desc Get single user
// @route GET /api/users/:id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  // Check if the id is NaN
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Id" });
  }

  const user = users.find((user) => user.id === id);

  // if the user doesn't exists
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }
  res.status(200).json(user);
});

// @desc Get all products
// @route GET /api/products
app.get("/api/products", (req, res) => {
  res.status(200).json(products);
});

// @desc Create new user
// @route POST /api/users
app.post("/api/users", (req, res) => {
  res.status(201).json({ message: "This is a POST request" });
});

// @desc update new user
// @route PUT /api/users/:id
app.put("/api/users", (req, res) => {
  res.status(200).json({ message: "This is a PUT request" });
});

// @desc delete new user
// @route DELETE /api/users/:id
app.delete("/api/users", (req, res) => {
  res.status(200).json({ message: "This is a DELETE request" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
