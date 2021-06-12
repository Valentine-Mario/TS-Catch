import {File, TypescriptParser} from "typescript-parser"
const parser = new TypescriptParser();

async function parse(path:string) {
    let data:File= await parser.parseFile(path, "")
    console.log(data)
}

parse("test/app.ts")