const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  const arr = persons.map((person) => person.name);

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "The name or number is missing",
    });
  } else if (arr.find((name) => name === body.name)) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }
  //String(Math.round(Math.random() * 10000))
  const person = {
    id: body.id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info of ${
      persons.length
    } people</p><p>${new Date().toString()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
