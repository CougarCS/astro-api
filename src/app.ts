import express from "express";
import cors from "cors";

import httpLogger from "./utils/logger/http-logger";

import indexRoute from "./routes/index";
import membersRoute from "./routes/members";
import eventsRoute from "./routes/events";
import transactionsRoute from "./routes/transactions";
import contactsRoute from "./routes/contacts";
import authRoute from "./routes/auth";

const app = express();

// Configuration
app.use(express.json());
app.use(cors());
app.use(httpLogger);

// Routes
app.use("/", indexRoute);
app.use("/members", membersRoute);
app.use("/events", eventsRoute);
app.use("/transactions", transactionsRoute);
app.use("/contacts", contactsRoute);
app.use("/auth", authRoute);

// Default to 404 if Endpoint/Method Not Recognized
app.use((req, res) => res.status(404).json({ message: "Not found" }));

export default app;
