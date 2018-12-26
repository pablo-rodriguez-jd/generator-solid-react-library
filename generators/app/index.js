"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const figlet = require("figlet");
const path = require("path");
const mkdirp = require("mkdirp");
const glob = require("glob");

module.exports = class extends Generator {
  prompting() {
    const done = this.async();
    this.log(
      yosay(chalk.cyan.bold("Welcome to the \n Solid React Library Generator"))
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Please enter your library name :",
        store: true,
        validate: name => {
          const pass = name.match(/^[^\d\s!@£$%^&*()+=]+$/);
          if (pass) {
            return true;
          }
          return `${chalk.red(
            'Provide a valid "Library name", digits and whitespaces not allowed'
          )}`;
        },
        default: this.appname // Default to current folder name
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      done();
    });
  }

  writing() {
    const fromTemplateFiles = glob.sync(this.templatePath("./*"), {
      ignore: ["**/node_modules", "**/dist"],
      dot: true
    });
    this.log("Copying app directory...");
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log("Creating folder...");
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    this.log(this.templatePath());
    this.log(this.destinationPath());

    this.fs.copyTpl(fromTemplateFiles, this.destinationRoot(), {
      name: this.props.name
    });
  }

  install() {
    this.log("Installing dependencies...");
    this.installDependencies({
      yarn: true,
      npm: true,
      bower: false
    }).then(() => {
      this.completed = true;
    });
  }

  end() {
    if (this.completed) {
      this.log("Installation complete. Welcome to Solid");
      this.log(
        chalk.bold.blue(
          figlet.textSync("- Solid -", {
            font: "3D-ASCII",
            horizontalLayout: "full",
            verticalLayout: "full"
          })
        )
      );
    }
  }
};
