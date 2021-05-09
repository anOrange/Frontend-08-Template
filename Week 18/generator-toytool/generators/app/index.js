
const YeomanGenerator = require('yeoman-generator')

const kOptionSYM = Symbol('kOptions')
module.exports = class extends YeomanGenerator {
  constructor(args, opts) {
    super(args, opts);

  }

  async initOptions() {
    const options = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "version",
        message: "Project version",
        default: '1.0.0'
      }
    ]);
    this[kOptionSYM] = options
  }

  writing() {
    const options = this[kOptionSYM]
    this.copyTemplate('index.html', './src/index.html', {}, {
      title: options.name
    })
    this.copyTemplate('HelloWorld.vue', './src/HelloWorld.vue')
    this.copyTemplate('webpack.config.js', './webpack.config.js')
    this.copyTemplate('main.js', './src/main.js')

    const pkgJson = {
      name: options.name,
      version: options.version,
      description: options.version,
      main: "main.js",
      scripts: {
        build: "webpack"
      },
      dependencies: {
        vue: '^2.6.12'
      },
      devDependencies: {
        'webpack-cli': '^4.6.0'
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall()
  }

  initNpm() {
    this.npmInstall(['vue-loader@^15.9.6', 'vue-template-compiler', 'webpack@^5',
      '@vue/compiler-sfc', "html-webpack-plugin@^5.3.1",
    ], {'save-dev': true})
  }

}
