import { type } from "os";
import {
  FunctionDeclaration,
  VariableStatement,
  Statement,
  ts,
  ClassDeclaration,
  MethodDeclaration,
  Project,
  SourceFileCreateOptions,
  ExpressionStatement,
  ArrowFunction,
  CallExpression,
  ParenthesizedExpression,
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";
const project = new Project({ useInMemoryFileSystem: true });

//lint var keyword in function scope
export const useLetInFuncScope = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let functionItem of sourceFile) {
    //get instances of function statement
    if (functionItem instanceof FunctionDeclaration) {
      //get statements in function decleration
      const statement = functionItem.getStatements();
      for (let item of statement) {
        //get instances of variable in function scope
        if (item instanceof VariableStatement) {
          let structure = item.getStructure();
          //get variable statements that use var keyword
          if (structure.declarationKind === "var") {
            span_and_lint(
              item.getStart(),
              item.getEnd(),
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

//lint var keyword in anonymous func
export const useLetInAnonymousFunc = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  _content: string
) => {
  //get instances of vraible
  for (let varItem of sourceFile) {
    if (varItem instanceof VariableStatement) {
      let decleration = varItem.getStructure().declarations;
      //get variable text and parse it
      for (let item of decleration) {
        const newsourceFile = project
          .createSourceFile(file, item.initializer, { overwrite: true })
          .getStatements();
        //transverse express statements
        for (let expr of newsourceFile) {
          if (expr instanceof ExpressionStatement) {
            let children = expr.getChildren();
            for (let child of children) {
              //get all instances of fat arrow function
              if (child instanceof ArrowFunction) {
                let statements = child.getStatements();
                for (let child_statement of statements) {
                  //look for var keyword in function scope and lint
                  if (child_statement instanceof VariableStatement) {
                    let structure = child_statement.getStructure();
                    //get variable statements that use var keyword
                    if (structure.declarationKind === "var") {
                      if (structure.declarationKind === "var") {
                        span_and_lint(
                          child_statement.getStart(),
                          child_statement.getEnd(),
                          item.initializer as string,
                          "Consider using `let` for variable decleration in function scope rather than 'var'",
                          file
                        );
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

//lint immediately invoked functions
export const useLetInIIFScope = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let expr of sourceFile) {
    if (expr instanceof ExpressionStatement) {
      let item = expr.getChildren();
      for (let method of item) {
        if (method instanceof CallExpression) {
          let children = method.getExpression().getDescendantStatements();
          for (let child of children) {
            if (child instanceof VariableStatement) {
              let structure = child.getStructure();
              if (structure.declarationKind === "var") {
                span_and_lint(
                  child.getStart(),
                  child.getEnd(),
                  content,
                  "Consider using `let` for variable decleration in function scope rather than 'var'",
                  file
                );
              }
            }
          }
        }
      }
    }
  }
};

//lint var keyword in method scope
export const useLetInMethodScope = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let classItem of sourceFile) {
    //get instances of class decleration
    if (classItem instanceof ClassDeclaration) {
      //retrieve all methods in class
      let method_list = classItem.getMethods();
      for (let method of method_list) {
        if (method instanceof MethodDeclaration) {
          //get method statements
          let statement = method.getStatements();
          for (let item of statement) {
            //reteieve only variable statements
            if (item instanceof VariableStatement) {
              let structure = item.getStructure();
              //get variable statements that use var keyword
              if (structure.declarationKind === "var") {
                span_and_lint(
                  item.getStart(),
                  item.getEnd(),
                  content,
                  "Consider using `let` for variable decleration in method scope rather than 'var'" +
                    ` in class ${classItem.getName()}`,
                  file
                );
              }
            }
          }
        }
      }
    }
  }
};
