const express = require('express');
const app = express();
const fs = require('fs');
const _ = require('lodash');

const htmlEnableCache = (req, res, next) => {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.header('Expires', '31557600');
  res.header('Pragma', 'cache');

  return next();
};

const htmlDisableCache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  return next();
};

const RESOURCES = {
  'assets': htmlEnableCache
}

fs.readdirSync('./dist/').forEach((file) => {
  RESOURCES[file] = htmlEnableCache;
});

_.each(RESOURCES, (cacheStrategy, key) => {
  app.use(`/${key}`, cacheStrategy, express.static(`${__dirname}/dist/${key}`));
});

// Send index.html in place of all remaining paths.
app.all('*', htmlDisableCache, (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 5000, process.env.ADDRESS || '0.0.0.0');
