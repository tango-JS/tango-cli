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
var cpr = require('cpr');
var replace = require('replace');
var rename = require('rename');
var template = require('lodash.template');
var shell = require('shelljs');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Tango JS', {
      font: 'thin',
      horizontalLayout: 'full'
    })
  )
);

let capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let generate = (type, name) => {

  switch (type) {
    case 'module':
      if (name.indexOf('/') >= 0) {
        var nameArr = name.split('/');
        var fixName = nameArr[nameArr.length - 1];
      } else {
        var fixName = name;
      }

      console.log(chalk.cyan('Generating ' + fixName + ' module.'));

      cpr(files.workingPath() + '/blueprints/angular/module', name, {
        deleteFirst: false, //Delete "to" before
        overwrite: false, //If the file exists, overwrite it
        confirm: true //After the copy, stat all the copied files to make sure they are there
      }, function(err, files) {

        files.shift();
        files.forEach(function(file) {

          fs.rename(file, file.replace('__name__', fixName), function(err) {
            if (err) console.log(chalk.black.bgRed('ERROR: ' + err));
          });

        })

        if (typeof nameArr !== 'undefined') {
          var pathName = name;
        } else {
          var pathName = './' + name;
        }
        replace({
          regex: "<%= moduleNameLC %>",
          replacement: fixName,
          paths: [pathName],
          recursive: true,
          silent: true,
        });
        replace({
          regex: "<%= moduleNameUC %>",
          replacement: capitalizeFirstLetter(fixName),
          paths: [pathName],
          recursive: true,
          silent: true,
        });

        console.log(chalk.white.bgGreen(fixName + ' module generated.'));
      });


      break;
    case 'component':
      console.log(chalk.cyan('Generating component.'));
      break;
    case 'service':
      console.log(chalk.cyan('Generating service.'));
      break;
    case 'filter':
      console.log(chalk.cyan('Generating filter.'));
      break;
    default:
      console.log(chalk.red('Error: ' + type + ' generator not supported.'));
  }
};


let init = () => {
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
              process.chdir(answers.name + '/src');
              // run in cmd line
              var npmStatus = new Spinner('Running npm install...');
              npmStatus.start();
              let output = (error, stdout, stderr) => {
                if (error) {
                  npmStatus.stop();
                  console.log(chalk.red.bold.underline("exec error:") + error);
                }
                if (stdout) {
                  npmStatus.stop();
                  console.log(chalk.green.bold.underline("Result:") + stdout);
                }

              };

              shell.exec('npm install', output);
            }

          });
        }

      } else if (answers.type == 'ionic') {
        var status = new Spinner('Downloading seed from: https://github.com/cogoo/ionicStarter...');
        status.start();
        if (files.directoryExists(answers.name)) {
          console.log(chalk.bgYellow.black('This directory already exists. Please re-run init with a different name'));
          status.stop();
        } else {
          download('cogoo/ionicStarter', answers.name, function(err) {
            if (err) {
              status.stop();
              console.log(chalk.red('Error in download, check internet connection and try again ...'));
            } else {
              status.stop();
              console.log(chalk.green('Download completed ...'));
              process.chdir(answers.name);
              // run in cmd line
              var npmStatus = new Spinner('Running npm install...');
              npmStatus.start();
              let output = (error, stdout, stderr) => {
                if (error) {
                  npmStatus.stop();
                  console.log(chalk.red.bold.underline("exec error:") + error);
                }
                if (stdout) {
                  npmStatus.stop();
                  console.log(chalk.green.bold.underline("Result:") + stdout);
               
                  var ionicStatus = new Spinner('Copying ionic folders...');
                  ionicStatus.start();
                  cpr(process.cwd() + '/@ionic_bundle', process.cwd()+ '/node_modules/@ionic_bundle', {
                    deleteFirst: false, //Delete "to" before
                    overwrite: false, //If the file exists, overwrite it
                    confirm: true //After the copy, stat all the copied files to make sure they are there
                  }, function(err, files) {
                    ionicStatus.stop();
                    shell.exec('rm -r @ionic_bundle');
                    console.log(chalk.white.bgGreen('Ionic project ready!'));
                  })

                }

              };

              shell.exec('npm install', output);
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

program
  .version(pkg.version)
  .command('generate <type> <name>')
  .alias('g')
  .action(generate);


program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();
