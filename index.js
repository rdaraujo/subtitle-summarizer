import { funcoes } from "./funcoes.js";

const {
  listFiles,
  readFiles,
  subtitlefy,
  subtitlefyAlt,
  removeSymbols,
  wordfy,
  count,
  order,
} = funcoes();

listFiles("data", ".srt")
  .then((srtFiles) => readFiles(srtFiles))
  .then((fileContents) => fileContents.join("\n"))
  .then((contents) => contents.split("\n"))
  .then((content) => subtitlefy(content))
  .then((subtitles) => removeSymbols(subtitles))
  .then((subtitles) => wordfy(subtitles))
  .then((words) => count(words))
  .then((words) => order(words)('count'))
  .then(console.log);
