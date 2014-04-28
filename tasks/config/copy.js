/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

	grunt.config.set('copy', {
		jsAssets: {
      files: [
      {
        expand: true,
        cwd: './bower_components/jquery/dist',
        src: ['jquery.min.js'],
        dest: './assets/js/dependencies'
      },
      {
        expand: true,
        cwd: './bower_components/bootstrap/dist/js',
        src: ['bootstrap.min.js'],
        dest: './assets/js'
      }
      ]
    },
    lessAssets: {
      files: [
      {
        expand: true,
        cwd: './bower_components/bootstrap/less',
        src: ['*.less'],
        dest: './assets/styles/bootstrap'
      },
      {
        expand: true,
        cwd: './bower_components/font-awesome/less',
        src: ['*.less'],
        dest: './assets/styles/font-awesome'
      }
      ]
    },
    fontAssets: {
      files: [
      {
        expand: true,
        cwd: './bower_components/font-awesome/fonts',
        src: ['*'],
        dest: './assets/fonts'
      }
      ]
    },
		dev: {
			files: [{
				expand: true,
				cwd: './assets',
				src: ['**/*.!(coffee|less)'],
				dest: '.tmp/public'
			}]
		},
		build: {
			files: [{
				expand: true,
				cwd: '.tmp/public',
				src: ['**/*'],
				dest: 'www'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
