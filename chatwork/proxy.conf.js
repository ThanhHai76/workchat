const PROXY_CONFIG = [{
  context: [
    "/api/"
  ],
  target: "https://localhost:8888",
  secure: false,
  changeOrigin: true
}]

module.exports = PROXY_CONFIG;
