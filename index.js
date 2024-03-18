const express = require("express");

const server = express();
server.use(express.json());

const PORT = 8000;

// counter works like IDs
let counter = 0;
const todos = new Map();

// Create new TODO
server.post("/todo", async (req, res) => {
  const { msg } = req.body;
  if (!msg) {
    return res.status(400).json({ error: "missing msg in json body " });
  }

  const todo = { id: counter, msg };
  todos.set(todo.id, todo);

  // Increament counter
  counter++;

  return res.status(201).json(todo).end();
});

// Get all TODOs
server.get("/", async (req, res) => {
  // Map.values() returns an iterator that
  // could be given to Array.from
  return res
    .status(200)
    .json({ data: Array.from(todos.values()) })
    .end();
});

// Get 1 TODO
server.get("/todo/:id", async (req, res) => {
  // isNaN checks if its arg is NaN
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "id is not a number " });
  }

  const id = Number(req.params.id);
  const todo = todos.get(id);

  if (!todo) {
    return res.status(404).json({ error: `no such todo: ${id}` });
  }

  return res.status(200).json(todo).end();
});

server.post("/todo/update", async (req, res) => {
  return res.status(400).json({ error: "missing params id " });
});

// Update 1 TODO
server.post("/todo/update/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "id is not a number" });
  }

  const id = Number(req.params.id);
  const { msg } = req.body;

  if (!msg) {
    return res.status(400).json({ error: "missing msg in json body" });
  }

  const todo = todos.get(id);
  if (!todo) {
    return res.status(404).json({ error: `no such todo: ${id}` });
  }

  // todo is an object - it is passed by reference.
  // Mutating it here will also mutates the value in map 'todos'.
  todo.msg = msg;

  return res.status(201).json(todo).end();
});

// Delete all TODOs
server.delete("/todo", async (_, res) => {
  // Clear all entires in map 'todos'.
  todos.clear();

  return res.status(200).json({ status: `deleted succesfully` }).end();
});

// Delete 1 TODo
server.delete("/todo/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "id is not a number" });
  }

  const id = Number(req.params.id);

  // Map delete returns a boolean indicating a succesful deletion.
  // Deletion will fail if there's no such key in the map.
  if (!todos.delete(id)) {
    return res.status(404).json({ error: `no such todo: ${id}` });
  }

  return res.status(200).json({ status: `todo ${id} deleted succesfully` });
});

// Listen

server.listen(PORT, async () => {
  console.log(`server listening on port ${PORT}`);
});
