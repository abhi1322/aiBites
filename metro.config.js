const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add resolver configuration for Convex
config.resolver.alias = {
  ...config.resolver.alias,
  // Mock problematic modules that Convex tries to import
  "request_manager.js": false,
  crypto: false,
  stream: false,
  buffer: false,
  util: false,
  events: false,
  path: false,
  fs: false,
  os: false,
  url: false,
  querystring: false,
  http: false,
  https: false,
  zlib: false,
  assert: false,
  constants: false,
  domain: false,
  punycode: false,
  string_decoder: false,
  timers: false,
  tty: false,
  vm: false,
  worker_threads: false,
  child_process: false,
  cluster: false,
  dgram: false,
  dns: false,
  module: false,
  net: false,
  readline: false,
  repl: false,
  tls: false,
  v8: false,
  wasi: false,
};

// Ensure proper module resolution for React Native
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// Add platform extensions
config.resolver.platforms = ["native", "ios", "android", "web"];

module.exports = withNativeWind(config, { input: "./global.css" });
