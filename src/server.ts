require("dotenv").config();
import "reflect-metadata";
import express from "express";
import path from "path";
import { createServer } from "http";
import Websocket from "./modules/websocket/websocket";
import ChessSocket from "./modules/websocket/chess.socket";

import {
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";

const port = process.env.APP_PORT || 3000;

const routingControllerOptions: RoutingControllersOptions = {
  routePrefix: "v1",
  controllers: [`${__dirname}/modules/http/*.controller.*`],
  validation: true,
  classTransformer: true,
  cors: true,
  defaultErrorHandler: true,
};

const app = createExpressServer(routingControllerOptions);

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([{ path: "/chess", handler: new ChessSocket() }]);

httpServer.listen(port, () => {
  console.log(`This is working in port ${port}`);
});
