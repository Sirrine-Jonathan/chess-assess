"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const port = process.env.APP_PORT || 3000;
const routingControllerOptions = {
    routePrefix: 'v1',
    controllers: [`${__dirname}/modules/http/*.controller.*`],
    validation: true,
    classTransformer: true,
    cors: true,
    defaultErrorHandler: true
};
const app = (0, routing_controllers_1.createExpressServer)(routingControllerOptions);
app.listen(port, () => {
    console.log(`This is working in port ${port}`);
});
//# sourceMappingURL=server.js.map