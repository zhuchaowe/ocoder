#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var css = require('./css/css.js');
var icon = require('./icon/icon.js');
program.version(JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version);
program.command('css <cssFile> <outPath>').action(css);
program.command('icon <iconFile> <outPath>').action(icon);
program.parse(process.argv);


