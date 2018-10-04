// To create new version, run the following in cmd, in the root directory of project:
//   1. grunt bump-build-deploy-to-4 --verbose

module.exports = function (grunt) {

    var path = require('path');
    
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-npm-command');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('../server/package.json'),
        paths: {
            client: './platforms/browser/www',
            server: '../server',
            public: '../prod/public',
            prod: '../prod'
        },
        clean: {
            options: {
                'force': true
              },
            prod: ['<%= paths.prod %>/*', '!<%= paths.prod %>/.git']
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.client %>',
                        src: '**',
                        dest: '<%= paths.public %>',
                        flatten: false
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.server %>',
                        src: ['**/*','!**/node_modules/**'],
                        dest: '<%= paths.prod %>',
                        flatten: false
                    },
                ]
            }
        },

        gitadd: {
            task: {
              options: {
                force: true,
                cwd: '<%= paths.prod %>'
              },
              files: {
                src: ['*']
              }
            }
          },

        gitcommit: {
            prod: {
              options: {
                cwd: '<%= paths.prod %>'
              },
              files: [
                {
                  src: ["*"],
                  expand: true,
                  cwd: '<%= paths.prod %>'
                }
              ]
            }
          },

        'npm-command': {
            'webpack-build-app': {
                options: {
                    cmd: 'run',
                    args: ['build']
                }
            },
            'cordova-build-browser': {
                options: {
                    cmd: 'run',
                    args: ['build-browser']
                }
            },
        },

    });

    grunt.registerTask('deploy', [
        'clean:prod',
        'npm-command:webpack-build-app',
        'npm-command:cordova-build-browser',
        'copy:main']);
};



