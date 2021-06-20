import {
  FunctionDeclaration,
  ParameterDeclaration,
  Statement,
  ts,
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";

export const useBooleanInFuncType = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let b of sourceFile) {
    if (b instanceof FunctionDeclaration) {
      let parameters: ParameterDeclaration[] = b.getParameters();
      for (let c of parameters) {
        if (c instanceof ParameterDeclaration) {
          if (c.getStructure().type === "Boolean") {
            span_and_lint(
              c.getStart(),
              c.getEnd(),
              content,
              `Consider using 'boolean' primitive type rather than 'Boolean' in function '${b.getName()}' parameter`,
              file
            );
          }
        }
      }
    }
  }
};
