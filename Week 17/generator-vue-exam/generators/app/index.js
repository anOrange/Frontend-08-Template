
const YeomanGenerator = require('yeoman-generator')

module.exports = class extends YeomanGenerator {
  constructor(args, opts) {
    super(args, opts);

  }

  async initOptions() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }

  writing() {
    const pkgJson = {
      devDependencies: {
      },
      dependencies: {
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.yarnInstall(['lodash'], { 'dev': true });
  }

  initNpm() {
    // this.npmInstall(['vue'], {
    //   'save-dev': false
    // })
    // this.npmInstall(['lodash'], { 'save-dev': true });
    // this.npmInstall(['vue-loader', 'vue-template-compiler'], {'save-dev': true})
  }

  initTemplate() {
    
  }

}
