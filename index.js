import { funcoes } from "./funcoes.js";

const { listFiles, readFiles, subtitlerize } = funcoes();

listFiles("data", ".srt")
  .then((srtFiles) => readFiles(srtFiles))
  .then((fileContents) => fileContents.join("\n"))
  .then((contents) => contents.split("\n"))
  .then((content) => subtitlerize(content))
  .then(console.log);
