import path, { join } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin";
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./dist/index.html"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                // Định nghĩa các biến môi trường
                GENERATE_OAUTH_URL: JSON.stringify(process.env.GENERATE_OAUTH_URL),
                GOOGLE_CALLBACK_BE_URL: JSON.stringify(process.env.GOOGLE_CALLBACK_BE_URL),
            },
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "dist/public/css"),
                publicPath: "/public/css"
            },
            {
                directory: path.join(__dirname, "dist/public/svg"),
                publicPath: "/public/svg"
            },
            {
                directory: path.join(__dirname, "dist/public/image"),
                publicPath: "/public/image"
            },
        ],
        compress: false,
        port: 9000,
        historyApiFallback: true
    }
};

export default config