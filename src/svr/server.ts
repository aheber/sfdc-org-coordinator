"use strict";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = "org-coordinator";
// Port where we'll run the websocket server
const serverPort = process.env.PORT || 1337;
import express from "express";
import { getOrgAccessUrls } from "./salesforce";

const PUBLIC_PATH = __dirname + "/public";
const orgs = {};

/**
 * HTTP server
 */
async function run() {
  const app = express();
  const server = app.listen(serverPort);
  console.log("Hosting public files from", PUBLIC_PATH);
  // this will make Express serve your static files
  app.use(express.static(PUBLIC_PATH));
  app.use(express.json());

  app.use(function (req, res, next) {
    console.log("Path", req.path);
    return next();
  });

  // user would like to claim an org
  app.get("/api/v1/org", async function (req: any, res) {
    // get "slug" from the URL, if slug is present then see if we already have an avaialble org for that slug, otherwise get a fresh one
    const slug = req.query.slug;
    const username = orgs[slug];
    console.log(orgs, slug, username);

    if (!username) {
      res.writeHead(404);
      return res.end();
    }
    res.json({ username });
  });

  app.post("/api/v1/org", async function (req, res) {
    orgs[req.body.slug] = req.body.username;
    console.log(orgs);
    res.json(req.body);
  });

  // doesn't require authentication right now, maybe in the future if we create more users with an "open" role
  app.get("/api/v1/org/open", async function (req, res) {
    const slug = req.query.slug as string;
    if (!slug || slug.length == 0) {
      res.statusCode = 400;
      return res.end();
    }
    console.log(slug);
    let username;
    try {
      username = orgs[slug];
      if (!username) {
        throw new Error("No org for slug");
      }
    } catch (err) {
      res.statusCode = 404;
      return res.end();
    }
    res.json(await getOrgAccessUrls(username));
  });

  app.get("*", (_req, res) => {
    res.sendFile("index.html", { root: PUBLIC_PATH });
  });
  app.use(logErrors);
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

run().catch((err) => {
  throw err;
});
