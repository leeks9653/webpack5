const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");

module.exports = {
    mode : "development",
    entry: {
        main: "./src/app.js" 
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].js",
    },
    module: {
        rules : [
            {
                test: /\.css$/, // 자바스크립트로 끝나는 모든 파일을 로더로 돌림, 정규표현식 입력
                use: [
                    "style-loader",
                    "css-loader"
                ] // 실행되는 로더   마지막에서 처음으로
            },
            {
                test: /\.png$/,
                type: "asset/resource", // url-loader = asset/inline
                generator: {
                    // publicPath: "./dist/",
                    filename: "[name].[ext]?[hash]"
                }
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
            Build Date: ${new Date().toLocalestring()}
            CommitVersion: ${childProcess.execSync("git rev-parse --short HEAD")}
            `
        })
    ]
}