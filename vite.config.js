import url from 'url'
import path from 'path'
import million from 'million/compiler';
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'



const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const transformHtmlPlugin = data => ({
    name: 'transform-html',
    transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
            return html.replace(
                /<%=\s*(\w+)\s*%>/gi,
                (match, p1) => data[p1] || ''
            );
        }
    }
  }); 
	return {
		plugins: [
			transformHtmlPlugin({ title: env.VITE_APP_NAME}), 
			million.vite({ auto: true }), 
			react()
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	}  
})
