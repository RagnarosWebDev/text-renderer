import {defineConfig} from "vite";
import { resolve } from 'path'
import dtsPlugin from "vite-plugin-dts";


export default defineConfig({
    plugins: [
        dtsPlugin({include: ['lib']})
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            formats: ['es']
        }
    }
})