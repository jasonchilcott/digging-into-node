#!/usr/bin/env node

"use strict";
const util = require("util");
const path = require("path");
const fs = require("fs");
const Transform = require("stream").Transform;
const zlib = require("zlib");
const CAF = require("caf");

// const getStdin = require("get-stdin");

const args = require("minimist")(process.argv.slice(2), {
  boolean: [ "help", "in", "out", "compress", "uncompress" ],
  string: [ "file" ]
} );

processFile = CAF(processFile);

const BASE_PATH = path.resolve(
  process.env.BASE_PATH || __dirname
)

let OUTFILE = path.join(BASE_PATH, "out.txt")

function streamComplete(stream) {
  return new Promise(function c(res){
    stream.on("end", res)
  });
}



if (args.help) {
  printHelp();
} else if (args.in || 
  args._.includes("-")) {
  let tooLong = CAF.timeout(30, "Took too long!");
  processFile(tooLong, process.stdin);
}else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file))
  let tooLong = CAF.timeout(30, "Took too long!");
  processFile(tooLong, stream)
  .then(function(){
    console.log("Complete!");
  })
  .catch(error);
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


function *processFile(signal, inStream) {
  let outStream = inStream;



  let upperStream = new Transform({
    transform(chunk, enc, cb) {
      this.push(chunk.toString().toUpperCase());
      
      cb();
    }
  })
  outStream = outStream.pipe(upperStream);

  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }

  if (args.compress) {
    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }
  
  let targetStream;
  if (args.out) {
    targetStream = process.stdout;

  } else {
    targetStream = fs.createWriteStream(OUTFILE)
  }

  outStream.pipe(targetStream);

  signal.pr.catch(function f(){
    outStream.unpipe(targetStream);
    outStream.destroy();
  });

  yield streamComplete(outStream);
  //contents = contents.toUpperCase();
  //process.stdout.write(contents)
}


function printHelp() {
  console.log("ex3 usage:");
  console.log("  ex3.js --file={FILENAME}");
  console.log("");
  console.log("--help                print this help");
  console.log("--file={FILENAME}     process the file");
  console.log("--in, -               process stdin");
  console.log("--out                 print to stdout");
  console.log("--compress            gzip the output");
  console.log("--uncompress          un-gzip the input");
  console.log("");
}