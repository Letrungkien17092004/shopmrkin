import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import dotenv from "dotenv"

const __dirname = import.meta.dirname

dotenv.config({
    path: path.resolve(__dirname, ".env")
})


const config = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/, // Áp dụng cho các file kết thúc bằng .css
                use: [
                    'style-loader', // 1. Chèn CSS vào DOM
                    'css-loader',   // 2. Dịch @import và url()
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                // Định nghĩa các biến môi trường
                GENERATE_OAUTH_URL: JSON.stringify(process.env.GENERATE_OAUTH_URL),
                GOOGLE_CALLBACK_BE_URL: JSON.stringify(process.env.GOOGLE_CALLBACK_BE_URL),
                BACK_END_HOST: JSON.stringify(process.env.BACK_END_HOST),
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "public",
                    to: "./public",
                    globOptions: {
                        ignore: "**/index.html"
                    }
                }
            ]
        })
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "./public/css"),
                publicPath: "/public/css"
            },
            {
                directory: path.join(__dirname, "./public/svg"),
                publicPath: "/public/svg"
            },
            {
                directory: path.join(__dirname, "./public/image"),
                publicPath: "/public/image"
            },
        ],
        compress: false,
        port: 9000,
        historyApiFallback: true
    }
};

export default config