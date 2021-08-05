import {
  FunctionDeclaration,
  VariableStatement,
  Statement,
  ts,
  ClassDeclaration,
  MethodDeclaration,
  Project,
  ExpressionStatement,
  ArrowFunction,
  CallExpression,
  Block,
  LabeledStatement,
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
                    useLetInFuncScope(
                      newsourceFile,
                      file,
                      decl.initializer as string
                    );
                  }
                }
              }
            }
          }
          //get variable statements that use var keyword
          if (structure?.declarationKind === "var") {
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
    //get expressions kind
    else if (functionItem instanceof ExpressionStatement) {
      let children = functionItem.getChildren();
      for (let child of children) {
        //if expression child is arrow function, execute
        if (child instanceof ArrowFunction) {
          let statements = child.getStatements();
          for (let child_statement of statements) {
            //het all var statements in arrow function
            if (child_statement instanceof VariableStatement) {
              let structure = child_statement.getStructure();
              for (let decl of structure.declarations) {
                //parse var again and retrieve exprersion
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(2)}.ts`,
                    decl.initializer
                  )
                  .getStatements();
                for (let expr of newsourceFile) {
                  //transverse new parse var
                  if (expr instanceof ExpressionStatement) {
                    let children = expr.getChildren();
                    for (let child of children) {
                      //get all instances of arrow func and recursively transverse tham
                      if (child instanceof ArrowFunction) {
                        useLetInFuncScope(
                          newsourceFile,
                          file,
                          decl.initializer as string
                        );
                      }
                    }
                  }
                }
              }
              //get variable statements that use var keyword
              if (structure?.declarationKind === "var") {
                span_and_lint(
                  child_statement.getStart(),
                  child_statement.getEnd(),
                  content,
                  "Consider using `let` for variable decleration in function scope rather than 'var'",
                  file
                );
              }
            }
          }
        }
      }
    } else if (functionItem instanceof VariableStatement) {
      let decleration = functionItem.getStructure().declarations;
      //get variable text and parse it
      for (let item of decleration) {
        //prase var stateents and transverse
        const newsourceFile = project
          .createSourceFile(
            `${Math.random().toString(36).substring(2)}.ts`,
            item.initializer
          )
          .getStatements();
        useLetInFuncScope(newsourceFile, file, item.initializer as string);
      }
    }
    //get all bloock scope (factory method)_
    else if (functionItem instanceof Block) {
      //get descendents of block expression
      let block_item = functionItem.getDescendantStatements();
      for (let block of block_item) {
        //get nested block item
        if (block instanceof Block) {
          let block_list = block.getDescendantStatements();
          for (let varItem of block_list) {
            //get all var statements in block and parse
            if (varItem instanceof VariableStatement) {
              let structure = varItem.getStructure();
              for (let item of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(2)}.ts`,
                    item.initializer
                  )
                  .getStatements();
                //recursively pass the var expression to this function
                useLetInFuncScope(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
              //lint the var keyword
              if (structure?.declarationKind === "var") {
                span_and_lint(
                  varItem.getStart(),
                  varItem.getEnd(),
                  content,
                  "Consider using `let` for variable decleration in block scope rather than 'var'",
                  file
                );
              }
            }
          }
        }
        //get all labels in factory method
        else if (block instanceof LabeledStatement) {
          let label_block = block.getDescendantStatements();
          for (let label_item of label_block) {
            if (label_item instanceof VariableStatement) {
              //get all parse all var expression
              let structure = label_item.getStructure();
              for (let item of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(2)}.ts`,
                    item.initializer
                  )
                  .getStatements();
                useLetInFuncScope(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
              if (structure?.declarationKind === "var") {
                span_and_lint(
                  label_item.getStart(),
                  label_item.getEnd(),
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
    //get all class instances
    else if (functionItem instanceof ClassDeclaration) {
      //retrieve all methods in class
      let method_list = functionItem.getMethods();
      for (let method of method_list) {
        if (method instanceof MethodDeclaration) {
          //get method statements
          let statement = method.getStatements();
          for (let item of statement) {
            //reteieve only variable statements
            if (item instanceof VariableStatement) {
              let structure = item.getStructure();
              for (let item of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(2)}.ts`,
                    item.initializer
                  )
                  .getStatements();
                useLetInFuncScope(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
              //get variable statements that use var keyword
              if (structure?.declarationKind === "var") {
                span_and_lint(
                  item.getStart(),
                  item.getEnd(),
                  content,
                  "Consider using `let` for variable decleration in method scope rather than 'var'" +
                    ` in class ${functionItem.getName()}`,
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

//lint immediately invoked functions
export const useLetInIIFScope = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let expr of sourceFile) {
    //get expression kind
    if (expr instanceof ExpressionStatement) {
      let item = expr.getChildren();
      for (let method of item) {
        //get instances of call expression
        if (method instanceof CallExpression) {
          //get all the children statemnent of the expression
          let children = method.getExpression().getDescendantStatements();
          for (let child of children) {
            if (child instanceof VariableStatement) {
              //get structure and find instances of var keyword
              let structure = child.getStructure();
              if (structure?.declarationKind === "var") {
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
