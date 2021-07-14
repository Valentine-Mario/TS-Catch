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
  for (let functionItem of sourceFile) {
    //get instances of function item
    if (functionItem instanceof FunctionDeclaration) {
      let parameters: ParameterDeclaration[] = functionItem.getParameters();
      //get all parameters in function
      for (let params of parameters) {
        if (params instanceof ParameterDeclaration) {
          //if parameter type is Boolean, Number or String
          if (
            params.getStructure().type === "Boolean" ||
            params.getStructure().type === "Number" ||
            params.getStructure().type === "String"
          ) {
            span_and_lint(
              params.getStart(),
              params.getEnd(),
              content,
              `Consider using 'boolean', 'number', or 'string' primitive type rather than 'Boolean', 'Number', 'String' in function '${functionItem.getName()}' parameter`,
              file
            );
          }
        }
      }
    }
  }
};
