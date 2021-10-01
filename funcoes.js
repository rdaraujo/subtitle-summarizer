import fs from "fs";
import createNamedTuple from "named-tuple";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { groupby } from "itertools";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SYMBOLS = [
  ".",
  "?",
  "!",
  "-",
  ",",
  '"',
  "_",
  "♪",
  "<i>",
  "</i>",
  "\r",
  "[",
  "]",
  "(",
  ")",
];

export const funcoes = () => {
  const listFiles = (folder, ext) => {
    return new Promise((resolve, reject) => {
      try {
        const absolutePath = path.join(__dirname, folder);
        const files = fs.readdirSync(absolutePath);
        const targetFiles = files.filter(
          (file) => path.extname(file).toLowerCase() === ext
        );
        const absPathFiles = targetFiles.map((file) => path.join(folder, file));
        resolve(absPathFiles);
      } catch (e) {
        reject(e);
      }
    });
  };

  const readFiles = (paths) => {
    return Promise.all(paths.map((file) => readFileContent(file)));
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(file, { encoding: "utf-8" });
        resolve(content.toString());
      } catch (e) {
        reject(e);
      }
    });
  };

  const subtitlefy = (lines) => {
    const Subtitle = createNamedTuple("Subtitle", "num","start", "end", "text");
    return new Promise((resolve, reject) => {
      try {
        const allLines = lines.values();
        const blocks = [];
        let block = [];

        for (const line of allLines) {
          if (line.trim()) {
            block.push(line.trim());
          } else {
            blocks.push(block);
            block = [];
          }
        }

        const subtitles = [];

        for (const sub of blocks) {
          const [num, start_end, ...text] = sub;
          const [start, end] = start_end.split(" --> ");
          subtitles.push(new Subtitle(num, start, end, text));
        }
        resolve(subtitles);
      } catch (e) {
        reject(e);
      }
    });
  };

  const subtitlefyAlt = (lines) => {
    const Subtitle = createNamedTuple("Subtitle", "num","start", "end", "text");
    return new Promise((resolve, reject) => {
      try {
        const res = [];

        for (const [chave, valor] of groupby(lines, (line) => Boolean(line.trim()))) {
          if (chave) {
            res.push(Array.from(valor));
          }
        }

        const subtitles = [];

        for (const sub of res) {
          const [num, start_end, ...text] = sub;
          const [start, end] = start_end.split(" --> ");
          subtitles.push(new Subtitle(num, start, end, text));
        }
        resolve(subtitles);
      } catch (e) {
        reject(e);
      }
    });
  };

  const removeSymbols = (subtitles) => {
    return new Promise((resolve, reject) => {
      try {
        const result = subtitles.map((subtitle) => {
          const texts = subtitle.text.map((text) => {
            let line = text;
            SYMBOLS.forEach((simbolo) => {
              line = line.split(simbolo).join("");
            });
            return line.trim();
          });
          return { ...subtitle, text: texts };
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  };

  return { listFiles, readFiles, subtitlefy, subtitlefyAlt, removeSymbols };
};
