import { read_dir, read_file, read_stderr } from "./lib/file_lib";
import { Project, Statement, ts } from "ts-morph";
import {
  useLetInFuncScope,
  useBooleanInFuncType,
  useLetInMethodScope,
  useLetInArrowFunc,
  useLetInIIFScope,
  useLetInAnonymousFunc,
} from "./lints";
const project = new Project({ useInMemoryFileSystem: true });

import * as fs from "fs";

let file_path: string = process.env.TESTNAME || process.argv[2];

function lints(
  sourceFile: Statement<ts.Statement>[],
  file: string,
  file_content: string
) {
  useLetInFuncScope(sourceFile, file, file_content);
  useBooleanInFuncType(sourceFile, file, file_content);
  useLetInMethodScope(sourceFile, file, file_content);
  useLetInArrowFunc(sourceFile, file, file_content);
  useLetInIIFScope(sourceFile, file, file_content);
  useLetInAnonymousFunc(sourceFile, file, file_content);
}

async function run() {
  if (
    file_path !== undefined &&
    fs.existsSync(file_path) &&
    fs.lstatSync(file_path).isDirectory()
  ) {
    try {
      let dir_list = (await read_dir(file_path)) as string[];
      //clean up stderr files
      if (process.env.TESTNAME !== undefined) {
        clean_all();
      }
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
  } else if (file_path !== undefined && fs.existsSync(file_path)) {
    try {
      let file_content = (await read_file(file_path)) as string;
      //clean file
      if (process.env.TESTNAME !== undefined) {
        clean_file(file_path);
      }
      const sourceFile = project
        .createSourceFile(file_path, file_content)
        .getStatements();
      lints(sourceFile, file_path, file_content);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("invalid file path");
  }
}

async function clean_all() {
  let dir_list = (await read_stderr("src")) as string[];
  for (let file of dir_list) {
    fs.writeFileSync(file, "");
  }
}

async function clean_file(path: string) {
  let filename = path.replace(/^.*[\\\/]/, "");
  fs.writeFileSync("src/stderr/" + filename + ".stderr", "");
}

run();
