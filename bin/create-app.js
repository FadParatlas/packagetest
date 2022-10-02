#! /usr/bin/env node

'use strict';

const path = require('path');
const util = require('util');
const packageJson = require('../package.json');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log('\x1b[31m', error, '\x1b[0m');
    };
  }
}

if (process.argv.length < 3) {
  console.log('\x1b[31m', 'You have to provide name to your app.');
  console.log('For example:');
  console.log('    npx react-parcel-app my-app', '\x1b[0m');
  process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/FadParatlas/threejsmui.git';

try {
  fs.mkdirSync(appPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(
      '\x1b[31m',
      `The file ${appName} already exist in the current directory, please give it another name.`,
      '\x1b[0m'
    );
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function setup() {
  try {
    console.log('\x1b[33m', 'Downloading the project structure...', '\x1b[0m');
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);

    process.chdir(appPath);

    console.log('\x1b[34m', 'Installing dependencies...', '\x1b[0m');
    await runCmd('npm install');
    console.log();

    await runCmd('npx rimraf ./.git');

    // fs.unlinkSync(path.join(appPath, 'LICENSE.MD'));
    fs.rmdirSync(path.join(appPath, 'bin'), { recursive: true });
    fs.unlinkSync(path.join(appPath, 'package.json'));

    buildPackageJson(packageJson, folderName);

    console.log(
      '\x1b[32m',
      'The installation is done, this is ready to use !',
      '\x1b[0m'
    );
    console.log();

    console.log('\x1b[34m', 'You can start by typing:');
    console.log(`    cd ${folderName}`);
    console.log('    npm start', '\x1b[0m');
    console.log();
    console.log('Check Readme.md for more informations');
    console.log();
  } catch (error) {
    console.log(error);
  }
}

setup();

function buildPackageJson(packageJson, folderName) {
  const {
    bin,
    keywords,
    license,
    homepage,
    repository,
    bugs,
    ...newPackage
  } = packageJson;

  Object.assign(newPackage, {
    name: folderName,
    version: '1.0.0',
    description: '',
    author: '',
    scripts: {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    devDependencies: {
      '@parcel/transformer-sass': '^2.0.0-beta.2',
      '@testing-library/dom': '^7.30.3',
      '@testing-library/jest-dom': '^5.11.10',
      '@testing-library/react': '^11.2.6',
      autoprefixer: '^10.2.5',
      'babel-preset-react-app': '^10.0.0',
      jest: '^26.6.3',
      'jest-cli': '^26.6.3',
      parcel: '^2.0.0-beta.2',
      prettier: '2.2.1',
    },
    dependencies: {
      "@emotion/react": "^11.10.4",
      "@emotion/styled": "^11.10.4",
      "@mui/material": "^5.10.7",
      "@react-three/drei": "^9.32.7",
      "@react-three/fiber": "^8.8.7",
      "@react-three/postprocessing": "^2.6.2",
      "@testing-library/jest-dom": "^5.16.5",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^13.5.0",
      "framer-motion": "^7.5.1",
      "google-map-react": "^2.2.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1",
      "three": "^0.145.0",
      "web-vitals": "^2.1.4"
    },
    postcss: {
      plugins: {
        autoprefixer: {
          overrideBrowserslist: ['> 1%', 'last 4 versions', 'ie >= 9'],
        },
      },
    },
  });

  fs.writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(newPackage, null, 2),
    'utf8'
  );
}