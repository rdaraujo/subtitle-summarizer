import { funcoes } from "./funcoes.js";

const { listFiles, readFiles, subtitlefy, subtitlefyAlt, removeSymbols } = funcoes();

listFiles("data", ".srt")
  .then((srtFiles) => readFiles(srtFiles))
  .then((fileContents) => fileContents.join("\n"))
  .then((contents) => contents.split("\n"))
  .then((content) => subtitlefy(content))
  .then((subtitles) => removeSymbols(subtitles))
  .then(console.log);
