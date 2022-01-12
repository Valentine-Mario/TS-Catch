import {
  ArrowFunction,
  BinaryExpression,
  Block,
  ClassDeclaration,
  ExpressionStatement,
  FunctionDeclaration,
  LabeledStatement,
  MethodDeclaration,
  ParameterDeclaration,
  Project,
  Statement,
  ts,
  VariableStatement,
  VariableStatementStructure,
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";
const project = new Project({ useInMemoryFileSystem: true });

export const useMoreSucciniteArrayType = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  // for (let item of sourceFile) {
  //   var global_variables: VariableStatementStructure[];
  //   if (item instanceof VariableStatement) {
  //     let var_structure = item.getStructure();
  //     global_variables.push(var_structure);
  //   }
  // }
};
