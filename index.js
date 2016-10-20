#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Spinner = CLI.Spinner;
var GitHubApi = require('github');
var _ = require('lodash');
var git = require('simple-git')();
var touch = require('touch');
var fs = require('fs');
var files = require('./lib/files');
var program = require('commander');
var exec = require('child_process').exec;
var pkg = require('./package.json');
var download = require('download-git-repo');
var path = require('path');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Tango JS', {
      font: 'thin',
      horizontalLayout: 'full'
    })
  )
);


let init = (directory, options) => {
  var questions = [{
    type: 'input',
    name: 'name',
    message: 'What\'s the name of your project?',
    default: 'my-tango-app'
  }, {
    type: 'list',
    name: 'type',
    message: 'Select the type of project you are creating:',
    choices: ['angular', 'ionic'],
    default: ['angular']
  }];

  inquirer
    .prompt(questions)
    .then(function(answers) {
      if (answers.type == 'angular') {

        var status = new Spinner('Downloading seed from: https://github.com/cogoo/angularStarter...');
        status.start();
        if (files.directoryExists(answers.name)) {
          console.log(chalk.yellow('This directory already exists. Please re-run init with a different name'));
          status.stop();
        } else {
          download('cogoo/angularStarter', answers.name, function(err) {
            if (err) {
              status.stop();
              console.log(chalk.red('Error in download, check internet connection and try again ...'));
            } else {
              status.stop();
              console.log(chalk.green('Download completed ...'));
            }

          });
        }

      } else if (answers.type == 'ionic') {
        var status = new Spinner('Downloading seed from: https://github.com/cogoo/ionicStarter...');
        status.start();
        if (files.directoryExists(answers.name)) {
          console.log(chalk.yellow('This directory already exists. Please re-run init with a different name'));
          status.stop();
        } else {
          download('cogoo/ionicStarter', answers.name, function(err) {
            if (err) {
              status.stop();
              console.log(chalk.red('Error in download, check internet connection and try again ...'));
            } else {
              status.stop();
              console.log(chalk.green('Download completed ...'));
            }

          });
        }

      }


    });

};

program
  .version(pkg.version)
  .command('init')
  .action(init);

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();