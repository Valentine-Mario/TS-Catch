import {
  ArrowFunction,
  BinaryExpression,
  Block,
  ExpressionStatement,
  FunctionDeclaration,
  Identifier,
  LabeledStatement,
  ParameterDeclaration,
  Project,
  Statement,
  ts,
  VariableStatement,
} from "ts-morph";
import { span_and_lint } from "../lib/span_lint";
const project = new Project({ useInMemoryFileSystem: true });

export const useBooleanInFuncType = (
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
          let structure = item.getStructure();
          for (let decl of structure.declarations) {
            const newsourceFile = project
              .createSourceFile(
                `${Math.random().toString(36).substring(10)}.ts`,
                decl.initializer
              )
              .getStatements();
            for (let expr of newsourceFile) {
              if (expr instanceof ExpressionStatement) {
                let children = expr.getChildren();
                for (let child of children) {
                  if (child instanceof ArrowFunction) {
                    useBooleanInFuncType(
                      newsourceFile,
                      file,
                      decl.initializer as string
                    );
                  }
                }
              }
              if (expr instanceof FunctionDeclaration) {
                useBooleanInFuncType([expr], file, decl.initializer as string);
              }
            }
          }
        }
      }
      let parameters = functionItem.getParameters();
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
    } else if (functionItem instanceof ExpressionStatement) {
      let children = functionItem.getChildren();
      for (let child of children) {
        //if expression child is arrow function, execute
        if (child instanceof ArrowFunction) {
          let arrow_children = child.getStatements();
          for (let arrow_child of arrow_children) {
            //get all instances of variable expression
            if (arrow_child instanceof VariableStatement) {
              let structure = arrow_child.getStructure();
              for (let decl of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(10)}.ts`,
                    decl.initializer
                  )
                  .getStatements();
                for (let expr of newsourceFile) {
                  if (expr instanceof ExpressionStatement) {
                    let children = expr.getChildren();
                    for (let child of children) {
                      if (child instanceof ArrowFunction) {
                        useBooleanInFuncType(
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
          let parameters = child.getParameters();
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
                  `Consider using 'boolean', 'number', or 'string' primitive type rather than 'Boolean', 'Number', 'String' in anonymous function `,
                  file
                );
              }
            }
          }
        } else if (child instanceof BinaryExpression) {
          const binary_desc = child.getDescendants();
          for (let item of binary_desc) {
            const newsourceFile = project
              .createSourceFile(
                `${Math.random().toString(36).substring(10)}.ts`,
                item.getText()
              )
              .getStatements();
            useBooleanInFuncType(newsourceFile, file, item.getText());
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
            `${Math.random().toString(36).substring(10)}.ts`,
            item.initializer
          )
          .getStatements();
        useBooleanInFuncType(newsourceFile, file, item.initializer as string);
      }
    } else if (functionItem instanceof Block) {
      //get descendents of block expression
      let block_item = functionItem.getDescendantStatements();
      for (let block of block_item) {
        if (block instanceof ExpressionStatement) {
          const re = new RegExp(".*:.*[Number|String|Boolean]");
          if (re.test(block.getText())) {
            span_and_lint(
              block.getStart(),
              block.getEnd(),
              content,
              `Consider using 'boolean', 'number', or 'string' primitive type rather than 'Boolean', 'Number', 'String' in anonymous function `,
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
                    `${Math.random().toString(36).substring(10)}.ts`,
                    item.initializer
                  )
                  .getStatements();
                //recursively pass the var expression to this function
                useBooleanInFuncType(
                  newsourceFile,
                  file,
                  item.initializer as string
                );
              }
            }
          }
        } else if (block instanceof LabeledStatement) {
          let label_block = block.getDescendantStatements();
          let label_children = block.getChildren();
          for (let label_child of label_children) {
            if (label_child instanceof ExpressionStatement) {
              const newsourceFile = project
                .createSourceFile(
                  `${Math.random().toString(36).substring(10)}.ts`,
                  label_child.getText()
                )
                .getStatements();
              useBooleanInFuncType(newsourceFile, file, label_child.getText());
            }
          }
          for (let label_item of label_block) {
            if (label_item instanceof VariableStatement) {
              //get all parse all var expression
              let structure = label_item.getStructure();
              for (let item of structure.declarations) {
                const newsourceFile = project
                  .createSourceFile(
                    `${Math.random().toString(36).substring(10)}.ts`,
                    item.initializer
                  )
                  .getStatements();
                useBooleanInFuncType(
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
  }
};
