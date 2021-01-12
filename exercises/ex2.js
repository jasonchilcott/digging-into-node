#!/usr/bin/env node

"use strict";
const util = require("util");
const path = require("path");
const fs = require("fs");
const Transform = require("stream").Transform;
// const getStdin = require("get-stdin");
const args = require("minimist")(process.argv.slice(2), {
  boolean: [ "help", "in" ],
  string: [ "file" ]
} );

const BASE_PATH = path.resolve(
  process.env.BASE_PATH || __dirname
)



if (args.help) {
  printHelp();
} else if (args.in || 
  args._.includes("-")) {
  processFile(process.stdin)
}else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file))
  processFile(stream);
} else {
  error("Incorrect Usage.", true)
}




function error(msg,includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}


function processFile(inStream) {
  let outStream = inStream;

  let upperStream = new Transform({
    transform(chunk, enc, cb) {
      this.push(chunk.toString().toUpperCase());
      setTimeout(cb, 500);
      
    }
  })
  outStream = outStream.pipe(upperStream);
  
  const targetStream = process.stdout;
  outStream.pipe(targetStream);
  //contents = contents.toUpperCase();
  //process.stdout.write(contents)
}


function printHelp() {
  console.log("ex1 usage:");
  console.log("  ex1.js --file={FILENAME}");
  console.log("");
  console.log("--help                print this help");
  console.log("--file={FILENAME}     process the file");
  console.log("--in, -               process stdin");
  console.log("");
}