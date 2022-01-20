import { ClassDeclaration, Statement, ts } from "ts-morph";
let all_classes: ClassDeclaration[] = [];

const get_class_methods = (
  input: Statement<ts.Statement>[]
): ClassDeclaration[] => {
  for (const classItem of input) {
    if (classItem instanceof ClassDeclaration) {
      all_classes.push(classItem);
    }
  }
  return all_classes;
};

export default get_class_methods;
