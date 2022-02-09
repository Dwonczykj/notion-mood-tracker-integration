import express from 'express';
import { get_example_page, getPropertiesForPages, create_page_mood_tracker } from './index';
import path from 'path';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/example-page', (req, res) => {
  get_example_page().then((response) => res.send(response));
});

app.get('/page-props', (req, res) => {
  getPropertiesForPages().then((response) => res.send(response));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.post('/create-page', (req, res) => {
  create_page_mood_tracker('gym').then((r) => res.send(r));
});

app.get('/renderHTML', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, './')
  })
})