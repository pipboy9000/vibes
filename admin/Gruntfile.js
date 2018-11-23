
module.exports = function (grunt) {
    var path = require('path');

    var cwd = process.cwd();
    console.log(`cwd: ${cwd}`)
    // var basePath = path.dirname(cwd);
    var basePath = cwd;
    var prodPath = path.join(basePath,'prod');
    console.log(`prodPath: ${prodPath}`)
    
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-npm-command');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        paths: {
            client: path.join(cwd,'dist'),
            server: path.join(basePath),
            public: path.join(prodPath, 'public'),
            prod: prodPath
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
                        src: ['server.js','package.json','package-lock.json'],
                        dest: '<%= paths.prod %>',
                        flatten: false
                    },
                ]
            }
        },

        gitadd: {
            task: {
              options: {
                verbose: true,
                cwd: '<%= paths.prod %>',
                all: true,
                force: true
              },
              files: {
                cwd: '<%= paths.prod %>',
              }
            }
          },

        gitcommit: {
            task: {
              options: {
                cwd: '<%= paths.prod %>',
                all: true
              },
              files: [
                {
                  expand: true,
                  src: ['**/*','.gitignore'],
                  cwd: '<%= paths.prod %>'
                }
              ]
            }
          },

          gitpush: {
            task: {
              options: {
                cwd: '<%= paths.prod %>',
                remote: 'heroku',
                verbose: true,
                force: true
              }
            }
          },

        'npm-command': {
            'webpack-build-app': {
                options: {
                    cmd: 'run',
                    args: ['build']
                }
            },
        },

    });

    grunt.registerTask('deploy', [
        'clean:prod',
        'npm-command:webpack-build-app',
        'copy:main',
        'gitadd',
        'gitcommit',
        'gitpush'
    ]);
};



