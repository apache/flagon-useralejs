/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const w = require("ws");
const fs = require("fs");
const path = require("path");

const logDirectory = path.resolve(__dirname, "../logs");
const logPath = path.resolve(
  logDirectory,
  "logs_" + new Date().getTime() + ".json",
);

try {
  fs.lstatSync(logDirectory);
} catch (e) {
  fs.mkdirSync(logDirectory); // Create directory if it doesn't exist
}

const wStream = fs.createWriteStream(logPath);
wStream.on("open", function () {
  wStream.write("[");
});

let firstLog = true;

const wss = new w.WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("message type:" + typeof message);
    const body =
      typeof message === "string"
        ? JSON.parse(message)
        : JSON.parse(message.toString());

    const isEmptyArray = Array.isArray(body) && body.length === 0;
    const isEmptyObject =
      typeof body === "object" &&
      body !== null &&
      Object.keys(body).length === 0;
    if (isEmptyArray || isEmptyObject) return;

    console.log(body);

    let delimeter = ",\n\t";

    if (firstLog) {
      wStream.write("\n\t");
      firstLog = false;
    } else {
      wStream.write(delimeter);
    }

    const logLength = message.length - 1;
    body.forEach(function (log, i) {
      if (i === logLength) {
        delimeter = "";
      }

      wStream.write(JSON.stringify(log) + delimeter);
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

process.on("SIGTERM", function () {
  wss.close();
});
process.on("SIGINT", function () {
  wss.close();
});
