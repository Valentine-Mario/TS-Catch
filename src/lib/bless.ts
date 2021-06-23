import { assert } from "console";
import * as Diff from "diff";
import * as fs from "fs";
import { glob } from "glob";
import { read_file } from "./file_lib";

glob("src/stderr/**/*.stderr", async (error: Error, response: string[]) => {
  for (let a of response) {
    let filename = "src/lints/" + a.replace(/^.*[\\\/]/, "");
    if (fs.existsSync(filename)) {
      let staged = (await read_file(a)) as string;
      let current = (await read_file(filename)) as string;
      let diff: Diff.Change[] = Diff.diffChars(staged, current);
      if (diff.length > 1) {
        fs.writeFileSync(filename, staged);
        console.log(`updated ${filename}`);
      }
    } else {
      let staged = (await read_file(a)) as string;
      fs.writeFileSync(filename, staged);
      console.log(`updated ${filename}`);
    }
  }
});
