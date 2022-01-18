import {
  FunctionDeclaration,
  Statement,
  ts,
  Project,
  VariableStatement,
  ExpressionStatement,
  ArrowFunction,
} from "ts-morph";
const project = new Project({ useInMemoryFileSystem: true });

let all_function: (FunctionDeclaration | ArrowFunction)[] = [];

const get_function_definition = (
  input: Statement<ts.Statement>[]
): (FunctionDeclaration | ArrowFunction)[] => {
  for (const funcItem of input) {
    if (funcItem instanceof FunctionDeclaration) {
      all_function.push(funcItem);
      const statement = funcItem.getStatements();
      for (let item of statement) {
        if (item instanceof VariableStatement) {
          let structure = item.getStructure();
          for (let decl of structure.declarations) {
            const newsourceFile = project
              .createSourceFile(
                `${Math.random().toString(36).substring(2)}.ts`,
                decl.initializer
              )
              .getStatements();
            for (let expr of newsourceFile) {
              if (expr instanceof ExpressionStatement) {
                let children = expr.getChildren();
                for (let child of children) {
                  if (child instanceof ArrowFunction) {
                    all_function.push(child);
                  }
                }
              }
            }
          }
        }
      }
    } else if (funcItem instanceof VariableStatement) {
      let decleration = funcItem.getStructure().declarations;
      for (let item of decleration) {
        //prase var stateents and transverse
        const newsourceFile = project
          .createSourceFile(
            `${Math.random().toString(36).substring(2)}.ts`,
            item.initializer
          )
          .getStatements();
        get_function_definition(newsourceFile);
      }
    } else if (funcItem instanceof ExpressionStatement) {
      let children = funcItem.getChildren();
      for (let child of children) {
        if (child instanceof ArrowFunction) {
          all_function.push(child);
        }
      }
    }
  }
  return all_function;
};

export default get_function_definition;
