import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import path from 'path'
import * as dotenv from 'dotenv'

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../env/.env.' + process.env.BASE_ENV),
})

const sassRegex = /\.scss$/
const styleLoadersArray = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[path][name]__[local]--[hash:5]',
      },
    },
  },
]

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'), //入口文件
  // 打包出口文件
  output: {
    filename: 'static/js/[name].js', //每个输出js的名称
    path: path.join(__dirname, '../dist'), //打包输出路径
    clean: true, //webpack4需配置clean-webpack-plugin来删除distwenj文件，webpack5内置了
    publicPath: '/', //打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: [
              [
                '@babel/preset-env',
                {
                  // 设置兼容目标浏览器版本,也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
                  },
                  useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                  corejs: 3, // 配置使用core-js使用的版本
                  loose: true,
                },
              ],
              // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
              // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /.css$/, //匹配 css 文件
        use: ['style-loader', 'css-loader'],
      },
      {
        test: sassRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // 使用dart-sass代替node-sass
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'],
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack5-react-ts',
      filename: 'index.html',
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, '../public/index.html'),
      inject: true, //自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, '../node_modules'),
    }),
    // 注入到业务
    new DefinePlugin({
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ].filter(Boolean),
}

export default baseConfig

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
