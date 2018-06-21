import {Router} from 'express';
import * as wixRunMode from 'wix-run-mode';
import * as ejs from 'ejs';
import * as wixExpressCsrf from 'wix-express-csrf';
import * as wixExpressRequireHttps from 'wix-express-require-https';
import * as bodyParser from 'body-parser';

import {readFileSync} from 'fs';



module.exports = (app: Router, context) => {
  let MEMORY = {};

  const config = context.config.load('minesweeper1');
  const templatePath = './src/index.ejs';
  const templateFile = readFileSync(templatePath, 'utf8');
  const isProduction = wixRunMode.isProduction();

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);
    const html = ejs.render(templateFile, renderModel, {cache: isProduction, filename: templatePath});
    res.send(html);
  });

  app.post("/save", (req, res) => {
      MEMORY = req.body.state;
      console.log("wallak");
      return res.sendStatus(200);
  });

  app.get("/load", (req, res) => {
     return res.send(MEMORY)
  });

  function getRenderModel(req) {
    return {
      locale: req.aspects['web-context'].language,
      basename: req.aspects['web-context'].basename,
      debug: req.aspects['web-context'].debug || process.env.NODE_ENV === 'development',
      clientTopology: config.clientTopology,
      title: 'Wix Full Stack Project Boilerplate'
    };
  }

  return app;
};
