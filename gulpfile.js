const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const fileinclude = require('gulp-file-include')
const svgSprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const del = require('del')
const webpackStream = require('webpack-stream')
const uglify = require('gulp-uglify-es').default
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const webpHTML = require('gulp-webp-html')
const webpCss = require('gulp-webp-css')
const ghPages = require('gulp-gh-pages')
const path = require('path')

// =============================== Html ===============================
const html = () => {
  return src(['./src/index.html'])
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(webpHTML())
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}
// =============================== Html ===============================

// =============================== Styles ===============================
const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', notify.onError())
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(webpCss())
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream())
}
// =============================== Styles ===============================

// =============================== Scripts ===============================
const scripts = () => {
  return src('./src/js/main.js')
    .pipe(
      webpackStream({
        mode: 'development',
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      })
    )
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err)
      this.emit('end') // Don't stop the rest of the task
    })

    .pipe(sourcemaps.init())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())
}
// =============================== Scripts ===============================

// =============================== Images ===============================
const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(dest('./app/img'))
    .pipe(src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg']))
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest('./app/img'))
}

const svgSprites = () => {
  return src('./src/img/**.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('./app/img'))
}
// =============================== Images ===============================

// =============================== Fonts ===============================
const fonts = () => {
  src('./src/fonts/**.ttf').pipe(ttf2woff()).pipe(dest('./app/fonts/'))
  return src('./src/fonts/**.ttf').pipe(ttf2woff2()).pipe(dest('./app/fonts/'))
}
// =============================== Fonts ===============================

// =============================== Other Files ===============================
const resources = () => {
  return src('./src/resources/**').pipe(dest('./app'))
}
// =============================== Other Files ===============================

// =============================== Build ===============================
const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', notify.onError())
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
  return src('./src/js/main.js')
    .pipe(
      webpackStream({
        mode: 'development',
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      })
    )
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err)
      this.emit('end') // Don't stop the rest of the task
    })
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('./app/js'))
}

const optimizeImages = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [
          {
            removeViewBox: true,
          },
        ],
      })
    )
    .pipe(dest('./app/img'))
}
// =============================== Build ===============================

// =============================== Watch ===============================
const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app',
    },
  })

  watch('./src/scss/**/*.scss', styles)
  watch('./src/**/*.html', html)
  watch(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'], imgToApp)
  watch('./src/img/**.svg', svgSprites)
  watch('./src/resources/**', resources)
  watch('./src/fonts/**.ttf', fonts)
  watch('./src/js/**/*.js', scripts)
}
// =============================== Watch ===============================

const clean = () => {
  return del(['app/*'])
}

exports.styles = styles
exports.watchFiles = watchFiles
exports.fileinclude = html

// =============================== gulp ===============================
exports.default = series(
  clean,
  parallel(html, scripts, fonts, resources, imgToApp, svgSprites),
  styles,
  watchFiles
)
// =============================== gulp ===============================

// =============================== gulp build ===============================
exports.build = series(
  clean,
  parallel(html, scriptsBuild, fonts, resources, imgToApp, svgSprites),
  stylesBuild,
  optimizeImages
)
// =============================== gulp build ===============================

// =============================== deploy ===============================
const deploy = () => {
  return src('./app/**/*').pipe(ghPages())
}
// =============================== deploy ===============================

exports.deploy = deploy
