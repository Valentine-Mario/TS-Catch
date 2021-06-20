import { useLetInFuncScope } from "./lints/use_let_in_func_scope";
import { read_dir, read_file } from "./lib/file_lib";
import { Project, Statement, ts } from "ts-morph";
const project = new Project({ useInMemoryFileSystem: true });

import * as fs from "fs";

let file_path: string[] = process.argv;

function lints(
  sourceFile: Statement<ts.Statement>[],
  file: string,
  file_content: string
) {
  useLetInFuncScope(sourceFile, file, file_content);
}

async function run() {
  if (
    file_path[2] !== undefined &&
    fs.existsSync(file_path[2]) &&
    fs.lstatSync(file_path[2]).isDirectory()
  ) {
    try {
      let dir_list = (await read_dir(file_path[2])) as string[];
      for (let a of dir_list as string[]) {
        let file_content = (await read_file(a)) as string;
        const sourceFile = project
          .createSourceFile(a, file_content)
          .getStatements();
        lints(sourceFile, a, file_content);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (file_path[2] !== undefined && fs.existsSync(file_path[2])) {
    try {
      let file_content = (await read_file(file_path[2])) as string;
      const sourceFile = project
        .createSourceFile(file_path[2], file_content)
        .getStatements();
      lints(sourceFile, file_path[2], file_content);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("invalid file path");
  }
}

run();
