# TS-CATCH

### setup

- Fork and clone repo
- run `npm install` to install dependencies and dev dependencies

### Adding lint

- In this simple tutorial, we would add a lint that warns user about using `foo` as a function name

- We would be using ts-morph to parse the typescript. You can go through the doc [here](https://ts-morph.com/)

#### Creating a func and importing func to necessary files

- Lints are created in the `src/lints` directory eg in our case, we would create `do_not_allow_foo_in_func_name.ts` file (snake case).

- Also create a test file with the same name as stated above inb the `src/test` directory (create a simple function here with foo name and another without to test)

- Add the following in the file in the `src/lints`

```
export const doNotUseFooInFuncName = (
    sourceFile: Statement<ts.Statement>[],
    file: string,
    content: string
)=>{

}

```

SourceFile contains the generated abstract syntax tree (AST) of the TS file parsed
file is the filepath
while content is the raw ts file content

- Now we need to transverse the AST to look for function declerations. So we iterate over the array.
  In the func body, add the following

```
for(let b of sourceFile){
    //check if node is a function decleration
    //and check if the func name is foo
    if(b instanceof FunctionDeclaration && b.getName()==="foo"){
        //span the error
        span_and_lint(
              b.getStart(),
              b.getEnd(),
              content,
              `Consider using a more declerative name in function parameter`,
              file
            );
    }
}

```

- Now inport the file to the `src/lints/index.ts` file, and export it.
- Finally import the function into the `src/index.ts` file and add it in the `lints` function.

- To run the test, run `npm run lint --path=src/test/do_not_allow_foo_in_func_name.ts`. This would generate a `do_not_allow_foo_in_func_name.ts.stderr` in the `stderr` dir. You can view the generate file to see the lints out put.

### Running test

- Run `npm run all` to run all lint test.
- Run `npm run lint --path=path_to_test_ts_file` to run test for a single ts file.
