import { glob } from "glob";
import * as fs from "fs";

export const read_dir = (dir: string): Promise<string[] | Error> => {
  return new Promise((res, rej) => {
    glob(dir + "/**/*.ts", (error: Error, response: string[]) => {
      if (error) {
        rej(error);
      } else {
        res(response);
      }
    });
  });
};

export const read_file = (
  path: string
): Promise<string | NodeJS.ErrnoException> => {
  return new Promise((res, rej) => {
    fs.readFile(path, "utf8", (error: NodeJS.ErrnoException, data: string) => {
      if (error) {
        rej(error);
      } else {
        res(data);
      }
    });
  });
};
