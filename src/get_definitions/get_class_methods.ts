import { ClassDeclaration, MethodDeclaration, Statement, ts } from "ts-morph";

const get_class_methods = (
  input: Statement<ts.Statement>[]
): MethodDeclaration[] => {
  for (const classItem of input) {
    if (classItem instanceof ClassDeclaration) {
      let method_list = classItem.getMethods();
      return method_list;
    }
  }
};

export default get_class_methods;
