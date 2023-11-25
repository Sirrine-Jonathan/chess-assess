require("dotenv").config();
import "reflect-metadata";
import { createServer } from "http";
import Websocket from "./modules/websocket/websocket";
import ChessSocket from "./modules/websocket/chess.socket";

import {
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";

const port = process.env.APP_PORT || 4000;

const routingControllerOptions: RoutingControllersOptions = {
  routePrefix: "v1",
  controllers: [`${__dirname}/modules/http/*.controller.*`],
  validation: true,
  classTransformer: true,
  cors: true,
  defaultErrorHandler: true,
};

const app = createExpressServer(routingControllerOptions);

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([{ path: "/chess", handler: new ChessSocket() }]);

httpServer.listen(port, () => {
  console.log(`This is working in port ${port}`);
});
