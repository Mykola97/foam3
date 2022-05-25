
const path_ = require('path');
const fs_ = require('fs');

require('../src/foam_node.js');

const FOAM_POM = path_.join(__dirname, '../src/pom');
const CORE_POM = path_.join(__dirname, '../src/foam/nanos/pom');
const FOOBAR_POM = path_.join(__dirname, '../src/foam/foobar/pom');
const TOOL_DIR = __dirname;

var [argv, X, flags] = require('./processArgs.js')(
  '',
  { version: '', license: '', pom: 'pom' },
  { debug: true, java: false, web: true, buildDebug: false }
);

// FOOBAR only loads FOAM's POM file, so we don't refer to X.pom here
foam.require(FOAM_POM);
foam.require(CORE_POM);
foam.require(FOOBAR_POM);

X = foam.__context__.createSubContext({
    ...X,
    args: process.argv.slice(2),
    console: console,
    // list of directories foobar is allowed to modify
    allowedDirectories: [
        process.cwd()
    ],
    protectedDirectories: [
        process.cwd()
    ]
});

var config;
var pomData;
const foobarPomCtx = {
    foam: {
        POM: function FOOBAR_POM (pom) {
            pomData = pom;
            config = pom.foobar;
        }
    }
};

with ( foobarPomCtx ) {
    let pomPath = X.pom;
    if ( ! pomPath.endsWith('.js') ) pomPath += '.js';
    const pomScript = fs_.readFileSync(path_.resolve(process.cwd(), pomPath)).toString();
    eval(pomScript);
}

if ( config.hasOwnProperty('protected') ) {
    for ( const protectedPath of config.protected ) {
        X.protectedDirectories.push(path_.resolve(protectedPath));
    }
}

config.jrlOutdir = path_.resolve(config.runtime, 'journals');

console.log("\033[31;1mFOAM\033[0m Object Oriented Build Application and Runtime\n");

const main = async function main () {
    const o = foam.foobar.FoobarTemplateUtil.create();
    const foobarX = X.createSubContext({
        config,
        toolsDir: TOOL_DIR,
        srcDirs: pomData.projects.map(p => path_.dirname(p.name)).join(',')
    });

    const ctrl = foam.foobar.FoobarController.create({}, foobarX);
    for ( const thing of (await ctrl.capabilityDAO.select()).array ) {
        console.log(thing.id, ...( thing.args ? [thing.args] : [] ));
    }

    await ctrl.runTask('Build');
}

const mainWithSimpleErrors = async function mainWithSimpleErrors () {
    try {
        await main();
    } catch (e) {
        console.error('\033[31;1mBUILD FAILED\033[0m', e.message);
        process.exit(1);
    }
}

X.buildDebug ? main() : mainWithSimpleErrors();

