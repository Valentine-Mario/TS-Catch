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

export const useInterfaceInFuncType = (
  sourceFile: Statement<ts.Statement>[],
  file: string,
  content: string
) => {
  for (let functionItem of sourceFile) {
    //get instances of function item
    if (functionItem instanceof FunctionDeclaration) {
      //get statements in function decleration
      const statement = functionItem.getStatements();
      for (let item of statement) {
        //get instances of variable in function scope
        if (item instanceof VariableStatement) {
          //get variable structure and parse the expr
          let structure = item.getStructure();
          for (let decl of structure.declarations) {
            const newsourceFile = project
              .createSourceFile(
                `${Math.random().toString(36).substring(2)}.ts`,
                decl.initializer
              )
              .getStatements();
            //transverse the expr and recursively lint the expr
            for (let expr of newsourceFile) {
              if (expr instanceof ExpressionStatement) {
                let children = expr.getChildren();
                for (let child of children) {
                  if (child instanceof ArrowFunction) {
                    useInterfaceInFuncType(
                      newsourceFile,
                      file,
                      decl.initializer as string
                    );
                  }
                }
              }
              if (expr instanceof FunctionDeclaration) {
                useInterfaceInFuncType(
                  [expr],
                  file,
                  decl.initializer as string
                );
              }
            }
          }
        }
      }
      let parameters = functionItem.getParameters();
      //get all parameters in function
      for (let params of parameters) {
        if (params instanceof ParameterDeclaration) {
          //if parameter type is object or Object
          if (
            params.getStructure().type === "object" ||
            params.getStructure().type === "Object"
          ) {
            span_and_lint(
              params.getStart(),
              params.getEnd(),
              content,
              `Consider defining an interface or type rather than object type in function '${functionItem.getName()}'`,
              file
            );
          }
        }
      }
    } else if (functionItem instanceof ExpressionStatement) {
      let children = functionItem.getChildren();
      for (let child of children) {
        //if expression child is arrow function, execute
        if (child instanceof ArrowFunction) {
          let arrow_children = child.getStatements();
          for (let arrow_child of arrow_children) {
            //get all instances of variable expression
            if (arrow_child instanceof VariableStatement) {
              //parse var statement in expr
              let structure = arrow_child.getStructure();
              for (let decl of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(2)}.ts`,
                    decl.initializer
                  )
                  .getStatements();
                for (let expr of newsourceFile) {
                  if (expr instanceof ExpressionStatement) {
                    //get expr child and recursively lint that
                    let children = expr.getChildren();
                    for (let child of children) {
                      if (child instanceof ArrowFunction) {
                        useInterfaceInFuncType(
                          newsourceFile,
                          file,
                          decl.initializer as string
                        );
                      }
                    }
                  }
                }
              }
            }
          }
          //get and lint parameters
          let parameters = child.getParameters();
          for (let params of parameters) {
            if (params instanceof ParameterDeclaration) {
              //if parameter type is type object or Object
              if (
                params.getStructure().type === "object" ||
                params.getStructure().type === "Object"
              ) {
                span_and_lint(
                  params.getStart(),
                  params.getEnd(),
                  content,
                  `Consider defining an interface or type rather than object type in anonymous function`,
                  file
                );
              }
            }
          }
        }
        //get binary expr and parse the descendants
        else if (child instanceof BinaryExpression) {
          const binary_desc = child.getDescendants();
          for (let item of binary_desc) {
            const newsourceFile = project
              .createSourceFile(
                `${Math.random().toString(36).substring(2)}.ts`,
                item.getText()
              )
              .getStatements();
            useInterfaceInFuncType(newsourceFile, file, item.getText());
          }
        }
      }
    } else if (functionItem instanceof VariableStatement) {
      let decleration = functionItem.getStructure().declarations;
      //get variable text and parse it
      for (let item of decleration) {
        //prase var statement and transverse
        const newsourceFile = project
          .createSourceFile(
            `${Math.random().toString(36).substring(2)}.ts`,
            item.initializer
          )
          .getStatements();
        useInterfaceInFuncType(newsourceFile, file, item.initializer as string);
      }
    } else if (functionItem instanceof Block) {
      //get descendents of block expression
      let block_item = functionItem.getDescendantStatements();
      for (let block of block_item) {
        if (block instanceof ExpressionStatement) {
          const re = new RegExp(".*:.*(object|Object)");
          if (re.test(block.getText())) {
            span_and_lint(
              block.getStart(),
              block.getEnd(),
              content,
              `Consider defining an interface or type rather than object type in function block`,
              file
            );
          }
        } else if (block instanceof Block) {
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
                useInterfaceInFuncType(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
            }
          }
        }
        //get label expr and parse children
        else if (block instanceof LabeledStatement) {
          let label_block = block.getDescendantStatements();
          let label_children = block.getChildren();
          for (let label_child of label_children) {
            if (label_child instanceof ExpressionStatement) {
              const newsourceFile = project
                .createSourceFile(
                  `${Math.random().toString(36).substring(2)}.ts`,
                  label_child.getText()
                )
                .getStatements();
              useInterfaceInFuncType(
                newsourceFile,
                file,
                label_child.getText()
              );
            }
          }
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
                useInterfaceInFuncType(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
            }
          }
        }
      }
    }
    //get class instances and all methods in class
    else if (functionItem instanceof ClassDeclaration) {
      let method_list = functionItem.getMethods();
      for (let method of method_list) {
        const statement = method.getStatements();
        for (let item of statement) {
          //recursievly parse var expr
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
                      useInterfaceInFuncType(
                        newsourceFile,
                        file,
                        decl.initializer as string
                      );
                    }
                  }
                }
                if (expr instanceof FunctionDeclaration) {
                  useInterfaceInFuncType(
                    [expr],
                    file,
                    decl.initializer as string
                  );
                }
              }
            }
          }
        }
        //lint methods parameters
        if (method instanceof MethodDeclaration) {
          let parameter = method.getParameters();
          for (let params of parameter) {
            if (
              params.getStructure().type === "object" ||
              params.getStructure().type === "Object"
            ) {
              span_and_lint(
                params.getStart(),
                params.getEnd(),
                content,
                `Consider defining an interface or type rather than object type in function '${functionItem.getName()}'`,
                file
              );
            }
          }
        }
      }
    }
  }
};
