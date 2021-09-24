import fs from "fs";
import createNamedTuple from "named-tuple";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Subtitle = createNamedTuple("Subtitle", "num", "start", "end", "text");

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

  const subtitlerize = (lines) => {
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

  return { listFiles, readFiles, subtitlerize };
};
