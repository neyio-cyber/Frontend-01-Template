const net = require("net");

/**
 * 跑不起来，尴尬😅
 * 扒码失败
 */

// method, url = host + port + path
// headers
// Content-Type
// Content-Type: application/x-www-form-urlencoded
// Content-Type: application/json
// Content-Type: multipart/form-data
// Content-Type: text/xml
// Content-Length
// body
class Request {
  constructor({
    host = "127.0.0.1:8088",
    method = "get",
    port = 80,
    path = "/",
    body: rawBody,
    headers = {},
  }) {
    let body = {};
    switch (headers["Content-Type"]) {
      case "application/json":
        body = JSON.stringify(rawBody);
        break;
      case "application/x-www-form-urlencoded":
        body = Object.keys(rawBody)
          .map((key) => `${key}=${encodeURIComponent(rawBody[key])}`)
          .join("&");
        break;
      default:
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    headers["Content-Length"] = body.length;
    Object.assign(this, {
      method,
      port,
      host,
      path,
      body,
      headers,
    });
    console.log(Object.keys(this));
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (buf) => {
        parser.receive(buf.toString());
        if (parser.isFinished) {
          resolve(parser.response);
        }
        connection.end();
      });
      connection.on("error", (err) => {
        connection.end();
        reject(err);
      });
    });
  }

  toString() {
    console.log(this.method);
    return (
      `${this.method} ${this.path} HTTP/1.1\r\nHOST: ${this.host}\r\n` +
      Object.keys(this.headers)
        .map((key) => `${key}: ${this.headers[key]}`)
        .join("\r\n") +
      `\r\n\r\n${this.body}\r\n`
    );
  }
}

const CONSTANTS = {
  WAITING_LENGTH: 0,
  WAITING_LENGTH_LINE_END: 1,
  READING_TRUNK: 2,
  WAITING_NEW_LINE: 3,
  WAITING_NEW_LINE_END: 4,
  FINISHED_NEW_LINE: 5,
  FINISHED_NEW_LINE_END: 6,
  WAITING_STATUS_LINE: 0,
  WAITING_STATUS_LINE_END: 1,
  WAITING_HEADER_NAME: 2,
  WAITING_HEADER_SPACE: 3,
  WAITING_HEADER_VALUE: 4,
  WAITING_HEADER_LINE_END: 5,
  WAITING_HEADER_BLOCK_END: 6,
  WAITING_BODY: 7,
};

class ResponseParser {
  constructor() {
    this.current = CONSTANTS.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParse = null;
  }

  get isFinished() {
    return this.bodyParse && this.bodyParse.isFinished;
  }

  get response() {
    console.log(this.statusLine);
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusTex: RegExp.$2,
      headers: this.headers,
      body: this.bodyParse.content.join(""),
    };
  }

  receive(string) {
    [...string].forEach(this.receiveChar);
  }

  receiveChar(char) {
    switch (this.current) {
      case [CONSTANTS.WAITING_STATUS_LINE]: {
        if (char === "\r") {
          this.current = CONSTANTS.WAITING_STATUS_LINE_END;
        } else {
          this.statusLine += char;
        }
        break;
      }
      case [this.current === CONSTANTS.WAITING_STATUS_LINE_END]: {
        if (char === "\n") {
          this.current = CONSTANTS.WAITING_HEADER_NAME;
        }
        break;
      }
      case [CONSTANTS.WAITING_HEADER_NAME]: {
        if (char === ":") {
          this.current = CONSTANTS.WAITING_HEADER_SPACE;
        } else if (char === "\r") {
          this.current = CONSTANTS.WAITING_HEADER_BLOCK_END;
          if (this.headers["Transfer-Encoding"] === "chunked")
            this.bodyParse = new TrunkedBodyParser();
        } else {
          this.headerName += char;
        }
        break;
      }
      case [CONSTANTS.WAITING_HEADER_SPACE]: {
        if (char === " ") {
          this.current = CONSTANTS.WAITING_HEADER_VALUE;
        }
        break;
      }
      case [CONSTANTS.WAITING_HEADER_VALUE]:
        {
          if (char === "\r") {
            this.current = CONSTANTS.WAITING_HEADER_LINE_END;
            this.headers[this.headerName] = this.headerValue;
            this.headerName = "";
            this.headerValue = "";
          } else {
            this.headerValue += char;
          }
        }
        break;
      case [CONSTANTS.WAITING_HEADER_LINE_END]:
        {
          if (char === "\n") {
            this.current = CONSTANTS.WAITING_HEADER_NAME;
          }
        }
        break;
      case [CONSTANTS.WAITING_HEADER_BLOCK_END]:
        {
          if (char === "\n") {
            this.current = CONSTANTS.WAITING_BODY;
          }
        }
        break;
      case [CONSTANTS.WAITING_BODY]:
        this.bodyParse.receiveChar(char);
        break;
      default:
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.isFinished = false;
    this.length = 0;
    this.content = [];
    this.current = CONSTANTS.WAITING_LENGTH;
  }

  receiveChar(char) {
    switch (this.current) {
      case [CONSTANTS.WAITING_LENGTH]:
        {
          if (char === "\r") {
            if (this.length === 0) {
              this.current = CONSTANTS.FINISHED_NEW_LINE;
            } else {
              this.current = CONSTANTS.WAITING_LENGTH_LINE_END;
            }
          } else {
            this.length *= 10;
            this.length += char.charCodeAt(0) - "0".charCodeAt(0);
          }
        }
        break;
      case [CONSTANTS.WAITING_LENGTH_LINE_END]:
        {
          if (char === "\n") {
            this.current = CONSTANTS.READING_TRUNK;
          }
        }
        break;
      case [CONSTANTS.READING_TRUNK]:
        {
          this.content.push(char);
          this.length--;
          if (this.length === 0) {
            this.current = CONSTANTS.WAITING_NEW_LINE;
          }
        }
        break;
      case [CONSTANTS.WAITING_NEW_LINE]:
        {
          if (char === "\r") {
            this.current = CONSTANTS.WAITING_NEW_LINE_END;
          }
        }
        break;
      case [CONSTANTS.WAITING_NEW_LINE_END]:
        {
          if (char === "\n") {
            this.current = CONSTANTS.WAITING_LENGTH;
          }
        }
        break;
      case [CONSTANTS.FINISHED_NEW_LINE]:
        {
          if (char === "\r") {
            this.current = CONSTANTS.FINISHED_NEW_LINE_END;
          }
        }
        break;
      case [CONSTANTS.FINISHED_NEW_LINE_END]: {
        if (char === "\n") {
          this.isFinished = true;
        }
      }
      default:
    }
  }
}

(async function () {
  const options = {
    host: "127.0.0.1",
    method: "POST",
    path: "/",
    port: 8088,
    headers: {
      ["X-Foo2"]: "hello",
    },
    body: {
      name: "world",
    },
  };
  const request = new Request(options);
  const response = await request.send();
  console.log(response);
})();
