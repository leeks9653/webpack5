const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
                    process.env.NODE_ENV === "production" 
                    ? MiniCssExtractPlugin.loader 
                    :
                    "style-loader",
                    "css-loader"
                ] // 실행되는 로더   마지막에서 처음으로
            },
            {
                test: /\.png$/,
                type: "asset/resource", // url-loader = asset/inline
                generator: {
                    filename: "[name].[ext]?[hash]"
                }
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
            Build Date: ${new Date().toLocaleString()}
            CommitVersion: ${childProcess.execSync("git rev-parse --short HEAD")} 
            Author: ${childProcess.execSync("git config user.name")} 
            `
            // 처번째 줄은 현재 날짜
            // 두번째 줄은 깃의 커밋 버전을 넣어줌
            // 세번째 줄은 깃의 닉네임
        }),
        new webpack.DefinePlugin({
            TWO: JSON.stringify("1+1"),
            "api" : {
                domain: JSON.stringify("http://dev.api.domain.com")
            }
        }),
        // 사용하는 파일에서 콘솔로 출력해볼 수 있음 // console.log(TWO)
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            templateParameters: {
                env: process.env.NODE_ENV === "development" ? "개발용" : ""
            },
            minify: process.env.NODE_ENV === "production" ? {
                collapseWhitespace: true, // 빈칸제거
                removeComments: true, // 주석제거
            } : false
        }),
        // index.html 의 경로 설정
        // NODE_ENV=development npm run build 이렇게 입력하면 타이틀에 생성됨 index.html타이틀 부분에 <%=env %>작성
        new CleanWebpackPlugin(),
        // 빌드시에 미리 설치된 output 경로의 파일을 삭제하고 다시 생성
        ...(process.env.NODE_ENV === "production" 
        ? [new MiniCssExtractPlugin({filename: "[name].css"}) ]
        : [])
        // css 파일을 하나로 만들어서 사용
    ]
}