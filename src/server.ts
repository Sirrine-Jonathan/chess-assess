require("dotenv").config();
import "reflect-metadata";
import express from "express";
import path from "path";
import { createServer } from "http";
import Websocket from "./websocket/websocket";
import RoomSocket from "./websocket/room.socket";

import {
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";

const port = process.env.PORT || 3000;

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

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([{ path: "/room", handler: new RoomSocket() }]);

httpServer.listen(port, () => {
  console.log(`This is working in port ${port}`);
});
