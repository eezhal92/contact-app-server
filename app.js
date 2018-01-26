const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contacts = require('./contacts');

const app = express();

app.use(cors('*'));
app.use(bodyParser.json());

app.get('/contacts', (req, res) => {
  res.json(contacts.all({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || undefined }));
});

app.get('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id, 10);

  let contact;

  try {
    contact = contacts.find(contactId);
  } catch (error) {
    let statusCode;

    if (error.code === 404) {
      statusCode = 404;
    } else {
      statusCode = 500;
    }

    res.status(statusCode).json({ message: error.message })

    return;
  }

  res.json(contact);
});

app.post('/contacts', (req, res) => {
  const { name, phone } = req.body;

  if (!name) {
    res.status(422).json({ message: '"name" field is required'});

    return;
  }

  if (!phone) {
    res.status(422).json({ message: '"phone" field is required'});

    return;
  }

  const contact = contacts.add({ name, phone });

  res.status(201).json(contact);
});

app.patch('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id, 10);
  const { name, phone } = req.body;

  if (!name) {
    res.status(422).json({ message: '"name" field is required'});

    return;
  }

  if (!phone) {
    res.status(422).json({ message: '"phone" field is required'});

    return;
  }

  const contact = contacts.update(contactId, { name, phone });

  res.json(contact);
});

app.delete('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id, 10);

  contacts.remove(contactId);

  res.json({ message: 'Contact has been deleted' });
});

app.get('*', (req, res) => {
  res.status(404).send('Endpoint Not found');
});

module.exports = app;
