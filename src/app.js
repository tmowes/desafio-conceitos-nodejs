const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function valideRepositoryID(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid repository ID' })
  }
  return next()
}

app.use('/repositories/:id', valideRepositoryID)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
  // DONE
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body

  // const techsArray = techs.split(',').map(tech => tech.trim());

  const repository = {
    id: uuid(),
    title,
    url,
    techs, //: techsArray,
    likes,
  }
  repositories.push(repository)

  return response.json(repository)
  // DONE
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  // const techsArray = techs.split(',').map(tech => tech.trim());

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." })
  }

  const { likes } = repositories[repositoryIndex]

  const repository = {
    id,
    title,
    url,
    techs, //techsArray
    likes,
  }

  repositories[repositoryIndex] = repository

  console.log("FIM PUT --- Aqui deveria ter o likes", repository)

  return response.json(repository)
  // DONE
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: "Repository not found." })
  }

  repositories.splice(repositoryIndex, 1)
  return res.status(204).send()
  // DONE
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." })
  }

  const { likes, title, url, techs } = repositories[repositoryIndex]

  const addLike = likes + 1

  const repository = {
    id,
    title,
    url,
    techs,
    likes: addLike,
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
  // DONE
});

module.exports = app;
