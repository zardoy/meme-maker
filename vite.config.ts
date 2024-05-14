import { defineConfig } from 'vite'
import pluginReact from '@vitejs/plugin-react'
import vitePluginSvgr from 'vite-plugin-svgr'

export default defineConfig({
    base: './',
    plugins: [pluginReact(), vitePluginSvgr({})],
})
