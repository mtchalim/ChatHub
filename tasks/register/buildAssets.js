module.exports = function (grunt) {
	grunt.registerTask('buildAssets', [
    'copy:jsAssets',
    'copy:lessAssets',
    'copy:fontAssets'
  ]);
};
