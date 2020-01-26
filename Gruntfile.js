var shell = require('shelljs');

module.exports = function (grunt) {

  /***************************************************************************/
  /* Configuration of Grunt & the tasks
  /***************************************************************************/

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Command line tasks
    // They allow to run external commands (as in a terminal).
    exec: {
      typedoc: "npx typedoc src/ts"
    },

    // Typescript task
    // It compiles each TypeScript souce file into a JavaScript file.
    ts: {
      default : {
        tsconfig: "./tsconfig.json"
      }
    },

    // Typescript linter task
    tslint: {
      options: {
        project: "./tsconfig.json",
        configuration: "./tslint.json",
        formatter: "codeFrame",
        force: false,
        fix: false
      },

      files: {
        src: ["./src/ts/**/*.ts"]
      }
    },

    // Browserify task
    // It aggregates all compiled JavaScript files into a single file.
    browserify: {
      bundle: {
        src: "./build/modules/index.js",
        dest: "./build/itm.js"
      }
    }

  });


  /***************************************************************************/
  /* npm plugin loading
  /***************************************************************************/
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-browserify");

  /***************************************************************************/
  /* Task registering
  /***************************************************************************/

  grunt.registerTask("clean",
    "Delete the build directory as well as temporary files and caches.",
    "exec:clean"
  );

  grunt.registerTask("copy-static-files",
    "Copy static files into the build directory.",
    function () {
      shell.mkdir("-p", "build/img");
      shell.mkdir("-p", "build/css");
      shell.cp("-f", "./src/*.html", "build/");
      shell.cp("-f", "./src/css/*.css", "build/css/");
      shell.cp("-f", "./src/img/*", "build/img/");
    }
  );

  grunt.registerTask("lint",
    "Check the style of the Typescript sources for the specified rules.",
    ["tslint"]
  );

  grunt.registerTask("compile",
    "Compile Typescript sources (using browserify) into the build directory.",
    ["ts", "browserify"]
  );

  grunt.registerTask("build",
    "Copy static files and compile Typescript sources into the build directory.",
    ["copy-static-files", "lint", "compile"]
  );

  grunt.registerTask("make-doc",
    "Generate the documentation of the Typescript sources in the docs directory.",
    "exec:typedoc"
  );

  grunt.registerTask("default", "build");
};
