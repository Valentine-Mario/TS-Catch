import * as fs from "fs";

export const span_and_lint = (
  start: number,
  end: number,
  file_content: string,
  addtional_into: string,
  file: string
) => {
  if (process.env.TESTNAME !== undefined) {
    let span = file_content.substring(start, end);
    let filename = file.replace(/^.*[\\\/]/, "");
    let output = `${addtional_into} :\n
    ${span}\n
    ${"^".repeat(end - start)}
  File: ${file}\n`;
    console.log(output);
    fs.writeFileSync(`src/stderr/${filename}.stderr`, output);
  } else {
    let span = file_content.substring(start, end);
    let output = `${addtional_into} :\n
    ${span}\n
    ${"^".repeat(end - start)}
  File: ${file}\n`;
    console.info(output);
  }
};
