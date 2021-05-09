
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
    // 测试
    this.copyTemplate('.babelrc', '.babelrc')
    this.copyTemplate('.nycrc', '.nycrc')
    this.copyTemplate('sample.test.js', './test/sample.test.js')

    const pkgJson = {
      name: options.name,
      version: options.version,
      description: options.version,
      main: "main.js",
      scripts: {
        test: "mocha --require @babel/register",
        coverage: "nyc mocha",
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
      'webpack-cli', 'babel-loader',
      '@vue/compiler-sfc', "html-webpack-plugin@^5.3.1",
      '@babel/core@^7.14.0', '@babel/preset-env@^7.14.1', '@babel/register@^7.13.16',
      '@istanbuljs/nyc-config-babel@^3.0.0', 'babel-plugin-istanbul@^6.0.0',
      'mocha@^8.3.2', 'nyc@^15.1.0'
    ], {'save-dev': true})
    
  }

}
