#!/usr/bin/env node

"use strict";
const path = require("path")
const args = require("minimist")(process.argv.slice(2), {
  boolean: [ "help" ],
  string: [ "file" ]
} );

if (args.help) {
  printHelp();
} else if (args.file) {
  
  console.log(filepath);
} else {
  error("Incorrect Usage.", true)
}




//console.log(args)


// My first Node.js program
//console.log("hell no, world");
//process.stdout.write("hell no, world");

//console.log(process.argv.slice(2));

//printHelp()

function error(msg,includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}

function printHelp() {
  console.log("ex1 usage:");
  console.log("  ex1.js --file={FILENAME}");
  console.log("");
  console.log("--help                print this help");
  console.log("--file={FILENAME}     process the file");
  console.log("");
}