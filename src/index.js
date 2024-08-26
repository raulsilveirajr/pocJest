const express = require('express');
const { queryParser } = require('express-query-parser')
const logRoute = require('./logRoute');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(logRoute);

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
    parseInt: true
  })
)

app.projects = [];

for (let i = 1; i <= 30; i++) {
  app.projects.push({
    id: i,
    title: `Project ${i}`,
    owner: `Owner ${i}`
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'Root route is empty.'
  })
})

app.get('/projects', (req, res) => {
  var { title, owner, page, pagesize, order, direction } = req.query;
  var resultProjectsList = app.projects;
  if (title) {
    resultProjectsList = resultProjectsList.filter(project => project.title.includes(title));
  }
  if (owner) {
    resultProjectsList = resultProjectsList.filter(project => project.owner.includes(owner));
  }
  if (order) {
    if (!direction) {
      direction = 'asc'
    }
    if (direction !== 'asc' && direction !== 'desc') {
      return res.status(400).json({ message: 'Direction must be asc or desc' });
    }

    if (order === 'id') {
      resultProjectsList.sort(function(a, b) { return (a.id < b.id) ? -1 : 1; });
    } else if (order === 'title') {
      resultProjectsList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === 'owner') {
      resultProjectsList.sort((a, b) => a.owner.localeCompare(b.owner));
    }
  }

  if (page) {
    if (isNaN(page)) {
      return res.status(400).json({ message: 'Page must be a number' });
    }
    var start = ((page - 1) * pagesize);
    var end = start + pagesize;
    console.log(`Page: ${page}, PageSize: ${pagesize}, Start: ${start}, End: ${end}, Lenght: ${resultProjectsList.length}`);
    resultProjectsList = resultProjectsList.slice(start, end);
  }

  res.json(resultProjectsList)
})

app.get('/projects/:id', (req, res) => {
  console.log(`Searching id ${req.params.id} in projects`);
  var project = app.projects.find(project => project.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  return res.json(project);
});

app.post('/projects', (req, res) => {
  const { title, owner } = req.body;
  var project = {
    id: app.projects.length + 1,
    title,
    owner
  };

  app.projects.push(project);
  return res.status(201).json(project);
})

app.put('/projects/:id', (req, res) => {
  console.log(`Searching id ${req.params.id} in projects`);
  const { title, owner } = req.body;
  var projectIndex = app.projects.findIndex(project => project.id === parseInt(req.params.id));
  if (projectIndex < 0) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!title || !owner) {
    return res.status(400).json({ message: 'Title and owner are required' });
  }
  var project = {
    id: parseInt(req.params.id),
    title,
    owner
  };
  app.projects[projectIndex] = project;
  return res.json(project);
})

app.patch('/projects/:id', (req, res) => {
  console.log(`Searching id ${req.params.id} in projects`);
  var projectIndex = app.projects.findIndex(project => project.id === parseInt(req.params.id));
  if (projectIndex < 0) {
    return res.status(404).json({ message: 'Project not found' });
  }
  var project = app.projects[projectIndex];
  for (field in req.body) {
    if (field !== 'id') {
      project[field] = req.body[field];
    }
  }
  app.projects[projectIndex] = project;
  return res.json(project);
})

app.delete('/projects/:id', (req, res) => {
  console.log(`Searching id ${req.params.id} in projects`);
  var projectIndex = app.projects.findIndex(project => project.id === parseInt(req.params.id));
  if (projectIndex < 0) {
    return res.status(404).json({ message: 'Project not found' });
  }
  app.projects.splice(projectIndex, 1);
  console.log(`Project id ${req.params.id} removed`);
  return res.status(204).send();
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };

