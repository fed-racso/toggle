'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  // load all grunt tasks
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
  });

  // Project configuration.
  grunt.initConfig({

    shell: {
      patternlab: {
        command: 'php core/builder.php -g'
      }
    },

    watch: {
      sass: {
        files: ['source/scss/{,*/}*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer', 'bless', 'shell:patternlab', 'copy:ajaxStuff']
      },
      html: {
        files: ['source/_patterns/**/*.mustache', 'source/_patterns-ajax/**/*.html', 'source/_patterns/**/*.json', 'source/_data/*.json'],
        tasks: ['shell:patternlab', 'copy:ajaxStuff'],
      },
      js: {
        files: ['source/js/**/*.js', ],
        tasks: ['shell:patternlab', 'copy:ajaxStuff'],
      },
      options: {
        livereload: true,
        spawn: false
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        base: 'public',
        livereload: 35729,
        // keepalive: true
      },
      livereload: {
        options: {
          open: false,
          // middleware: function(connect) {
          //   return [connect.static('public')];
          // }
        }
      },
    },

    // CSS, Autoprefixing & Bless
    sass: {
      app: {
        files: [{
          expand: true,
          cwd: 'source/scss',
          src: ['*.scss'],
          dest: 'source/.tmp',
          ext: '.css'
        }]
      },
      options: {
        // require: ['susy'],
        sourcemap: 'auto',
        update: true,
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9'],
      },
      style: {
        files: [{
          expand: true,
          cwd: 'source/.tmp',
          src: ['*.css'],
          dest: 'source/css/',
        }]
      },
      ie9: {
        files: [{
          expand: true,
          cwd: 'source/.tmp',
          src: ['*.css'],
          dest: 'source/.tmp/ie9',
        }]
      }
    },

    bless: {
      options: {
        logCount: true,
        cacheBuster: false
      },
      css: {
        files: [{
          expand: true,
          cwd: 'source/.tmp/ie9',
          src: ['*.css'],
          dest: 'source/css',
          ext: '-ie9.css'
        }]
      }
    },

    jshint: {
      app: {
        files: [{
          expand: true,
          cwd: 'source/js',
          src: ['main.js', 'slider.js'],
        }]
      },
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        forin: true,
        freeze: true,
        indent: 2,
        noarg: true,
        undef: false,
        unused: true,
        strict: false,
        globals: {
          browser: true,
          jQuery: true,
          devel: true
        }
      }
    },

    // Build Optimization

    // Custom use-min 
    useminPrepare: {
      head: {
        src: ['source/_patterns/00-atoms/00-meta/_00-head.mustache', 'source/_patterns/00-atoms/00-meta/_01-foot.mustache'],
      },
      options: {
        root: 'source/styleguide/html',
        dest: 'delivery',
      }
    },

    usemin: {
      html: ['delivery/*.html', ],
      options: {
        assetsDirs: ['source/css', 'source/js']
      }
    },

    imagemin: {
      options: {
        optimizationLevel: 7
      },
      minify: {
        files: [{
          expand: true,
          cwd: 'source/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'delivery/images'
        }]
      }
    },

    copy: {
      // Copies useminPrep stuff into pd folder to do overwrite with usemin
      usemin: {
        files: [{
          expand: true,
          cwd: 'source/_patterns/00-atoms/00-meta',
          src: ['*.mustache'],
          dest: 'delivery',
          ext: '.html',
        }]
      },
      ajaxStuff: {
        files: [{
          expand: true,
          cwd: 'source/_patterns-ajax',
          src: ['*.html'],
          dest: 'public/_patterns-ajax'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'source/fonts',
          src: ['*'],
          dest: 'delivery/fonts'
        }]
      },
      ie: {
        files: [{
          expand: true,
          cwd: 'source/css',
          src: ['styles-ie*.css'],
          dest: 'delivery/css'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: 'source/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'delivery/images'
        }]
      }
    },

    // Compress delivery zip for Ufinity
    compress: {
      main: {
        options: {
          archive: 'delivery.zip',
          mode: 'zip'
        },
        files: [{
            flatten: true,
            src: ['delivery/**'],
            dest: '',
            filter: 'isFile'
          } // flattens results to a single level
        ]
      }
    },

    clean: {
      main: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['**/*']
        }]
      },
      source: {
        files: [{
          expand: true,
          cwd: 'source/.tmp',
          src: ['**/*']
        }]
      },
      // build: {
      //   src: 'delivery'
      // }
    }
  });

  // Default task(s).
  grunt.registerTask('default', [
    'shell:patternlab',
    'copy:ajaxStuff',
    'connect', 'watch'
  ]);

  grunt.registerTask('build', [
    'shell:patternlab',
    'copy:ajaxStuff',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'copy:usemin',
    'copy:fonts',
    'copy:images',
    'usemin',
    // 'compress',
    'clean'
  ]);

  // grunt.registerTask('build', [
  //   'shell:patternlab',
  //   'copy:ajaxStuff',
  //   'useminPrepare',
  //   'concat:generated',
  //   'usemin',
  //   'copy:fonts',
  //   'copy:ie',
  //   'copy:images',
  //   'compress',
  //   'clean'
  // ]);
};
