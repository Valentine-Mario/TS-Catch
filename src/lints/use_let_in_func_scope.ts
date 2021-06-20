import {
  FunctionDeclaration,
  VariableStatement,
  Statement,
  ts,
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";

export const useLetInFuncScope = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let b of sourceFile) {
    if (b instanceof FunctionDeclaration) {
      const c = b.getStatements();
      for (let d of c) {
        if (d instanceof VariableStatement) {
          let structure = d.getStructure();
          if (structure.declarationKind === "var") {
            span_and_lint(
              d.getStart(),
              d.getEnd(),
              content,
              "Consider using `let` for variable decleration in function scope rather than 'var'",
              file
            );
          }
        }
      }
    }
  }
};
