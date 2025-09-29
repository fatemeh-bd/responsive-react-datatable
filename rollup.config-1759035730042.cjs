"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var resolve = require("@rollup/plugin-node-resolve");
var commonjs = require("@rollup/plugin-commonjs");
var typescript = require("@rollup/plugin-typescript");
var dts = require("rollup-plugin-dts");
var terser = require("@rollup/plugin-terser");
var peerDepsExternal = require("rollup-plugin-peer-deps-external");
var json = require("@rollup/plugin-json");
var postcss = require("rollup-plugin-postcss");

const packageJson = require("./package.json");

var rollup_config = [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        inject: {
          insertAt: "top",
        },
        extract: false,
        minimize: true,
        config: {
          path: "./postcss.config.js",
        },
      }),
      terser(),
    ],
    external: [
      "react",
      "react-dom",
      "axios",
      "swiper",
      "@tanstack/react-query",
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];

exports.default = rollup_config;
