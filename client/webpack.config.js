import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = import.meta.dirname

const config = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./dist/index.html"
        })
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
        ],
        compress: false,
        port: 8001,
        historyApiFallback: true
    }
};

export default config