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
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";
const project = new Project({ useInMemoryFileSystem: true });

export const useConstForUnreassignedVar = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {};
