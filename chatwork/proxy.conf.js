const PROXY_CONFIG = [{
  context: [
    "/api/"
  ],
  target: "http://localhost:8888/",
  secure: false
}]

module.exports = PROXY_CONFIG;
