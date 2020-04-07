const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next){
  const { method, url} = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
   
  console.log(logLabel);

  return next();
}

app.use(logRequests);

function valideRepositoryId(req, res, next){
  const { id } = req.params;
  if(!isUuid(id)){
    return res.status(400).json({error: 'Invalid repository ID'});
  }
  return next();
}

app.use('/repositories/:id', valideRepositoryId)

app.get("/repositories", (req, res) => {

  return res.send(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return res.send(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs } = req.body;
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found!'})
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return res.send(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found!'})
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).json();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found!'})
  }

  repositories[repositoryIndex].likes++;

  return res.status(200).json({likes: repositories[repositoryIndex].likes});
});

module.exports = app;

