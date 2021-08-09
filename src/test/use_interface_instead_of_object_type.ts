function hello_world(a: object) {
  return a["user"];
}

function hello_world2(b: Object) {
  return b["age"];
}

type User = {
  name: string;
  age: number;
  admin: boolean;
};

function add_user(a: User) {
  let name = (b: Object) => {
    return b["age"];
  };
  return a.age;
}

class Test3 {
  constructor() {}
  addUser(user: Object) {
    return user["name"];
  }
}
