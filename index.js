#!/usr/bin/env node
var program = require('commander');
var css = require('./css/css.js');

program
  .command('css <cssFile> <outPath>')
  .action(css);

program.parse(process.argv);


