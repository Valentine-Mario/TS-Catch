import { Project, FunctionDeclaration, VariableStatement } from "ts-morph";
import { read_dir, read_file } from "../lib/file_lib";

const project = new Project({ useInMemoryFileSystem: true });
const fs = project.getFileSystem();

export const useLetInFuncScope = () => {
  read_dir("test")
    .then(async (data) => {
      for (let a of data as string[]) {
        let file_content = (await read_file(a)) as string;
        const sourceFile = project
          .createSourceFile(a, file_content)
          .getStatements();
        for (let b of sourceFile) {
          if (b instanceof FunctionDeclaration) {
            const c = b.getStatements();
            for (let d of c) {
              if (d instanceof VariableStatement) {
                let structure = d.getStructure();
                if (structure.declarationKind === "var") {
                  console.log(
                    "consider using let instead of var in function scope"
                  );
                }
              }
            }
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
