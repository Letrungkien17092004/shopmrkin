import path, {dirname} from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, "src/public")
        },
        compress: true,
        port: 3000,
    },
};