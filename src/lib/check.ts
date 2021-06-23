import * as Diff from "diff";
import * as fs from "fs";
import { glob } from "glob";
import { read_file } from "./file_lib";
const file_path = process.env.TESTNAME;

if (file_path !== undefined && file_path === "src/test") {
  glob("src/stderr/**/*.stderr", async (error: Error, response: string[]) => {
    for (let a of response) {
      let filename = "src/lints/" + a.replace(/^.*[\\\/]/, "");
      if (fs.existsSync(filename)) {
        let staged = (await read_file(a)) as string;
        let current = (await read_file(filename)) as string;
        let diff: Diff.Change[] = Diff.diffChars(staged, current);
        if (diff.length == 1) {
          console.log(`${filename} test pass`);
        } else {
          for (let index = 1; index < diff.length; index++) {
            if (diff[index].added) {
              console.info(`+ ${diff[index].value} Failed test`);
            } else {
              console.info(`- ${diff[index].value} Failed test`);
            }
          }
        }
      } else {
        console.log("Run 'npm run bless' to updated stderr file for", a);
      }
    }
  });
} else {
  const relative_name = file_path.replace(/^.*[\\\/]/, "");
  fs.readFile(
    `src/stderr/${relative_name}.stderr`,
    "utf8",
    async (error: Error, response: string) => {
      let filename = "src/lints/" + relative_name + ".stderr";
      if (fs.existsSync(filename)) {
        let current = (await read_file(filename)) as string;
        let diff: Diff.Change[] = Diff.diffChars(response, current);
        if (diff.length == 1) {
          console.log(`${filename} test pass`);
        } else {
          for (let index = 1; index < diff.length; index++) {
            if (diff[index].added) {
              console.info(`+ ${diff[index].value} Failed test`);
            } else {
              console.info(`- ${diff[index].value} Failed test`);
            }
          }
        }
      } else {
        console.log(
          "Run 'npm run bless' to updated stderr file for",
          file_path
        );
      }
    }
  );
}
