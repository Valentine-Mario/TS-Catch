import { Statement, ts, VariableStatement } from "ts-morph";
let all_variables: VariableStatement[] = [];

const get_variable_definition = (
  input: Statement<ts.Statement>[]
): VariableStatement[] => {
  for (const varItem of input) {
    if (varItem instanceof VariableStatement) {
      all_variables.push(varItem);
    }
  }
  return all_variables;
};

export default get_variable_definition;
