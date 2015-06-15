module.exports = function (grunt) {
    var config = {
        pkg: require('./package.json'),
        isDev: grunt.option('no-dev')
    };

    grunt.initConfig({
        clean: {
            dist: ['dist/']
        },

        uglify: {
            js_min: {
                files: {
                    'dist/prow.min.js': ['src/prow.js']
                }
            },
            js: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: {
                    'dist/prow.js': ['src/prow.js']
                }
            }
        },

        jshint: {
            js: {
                files: {
                    src: ['src/**/*.js', 'tests/**/*.js']
                }
            }
        },

        simplemocha: {
            options: {
                reporter: 'list'
            },
            all: {src: ['test/**/*.js']}
        },

        watch: {
            js: {
                files: ['src/**/*.js', 'tests/**/*.js'],
                tasks: ['jshint']
            }
        }
    });

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        'simplemocha': 'grunt-simple-mocha'
    });

    grunt.registerTask('compile', ['uglify']);

    grunt.registerTask('default', ['jshint', 'uglify', 'simplemocha']);

    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('w', ['default', 'watch']);
};