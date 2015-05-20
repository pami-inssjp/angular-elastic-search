module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    license: grunt.file.read('LICENSE'),

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    concat: {
     options: {
       separator: ';'
     },
     dist: {
       src: ['src/**/*.js'],
       dest: 'dist/<%= pkg.name %>.js'
     }
   },

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/* <%= license %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
          }
        }
    }



  });



  grunt.registerTask('default', ['jshint','concat', 'uglify']);


};
