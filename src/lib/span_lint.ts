export const span_and_lint = (
  start: number,
  end: number,
  file_content: string,
  addtional_into: string,
  file: string
) => {
  let span = file_content.substring(start, end);
  console.info(`${addtional_into} :\n
   ${span}\n
   ${"^".repeat(end - start)}
File: ${file}\n`);
};
