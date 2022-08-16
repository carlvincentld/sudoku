const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

const mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.wav': 'audio/wav',
	'.mp4': 'video/mp4',
	'.woff': 'application/font-woff',
	'.ttf': 'application/font-ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.otf': 'application/font-otf',
	'.wasm': 'application/wasm',
};

function getContentType(filePath) {
	const extname = String(path.extname(filePath))
		.toLowerCase();
	return mimeTypes[extname] ?? 'application/octet-stream';
}

http
	.createServer((request, response) => {
		console.log(`request ${request.url}`);

		let filePath = `.${request.url}`;
		if (filePath === './') {
			filePath = './index.html';
		}

		if (!fs.existsSync(filePath)) {
			const basename = path.basename(filePath);
			const dirname = path.dirname(filePath);

			const entries = fs
				.readdirSync(dirname, { withFileTypes: true })
				.filter(x => 
					x.isFile()
						&& x.name.startsWith(basename)
						&& x.name.replace(basename, '') in mimeTypes);

			if (entries.length === 1) {
				console.log(`${filePath} was not found, but ${entries[0].name} with a valid extension was found in the same folder.`);
				filePath = path.join(dirname, entries[0].name);
			} else if (entries.length > 1) {
				console.log(`${filePath} was not found, but multiple files with valid extensions were found in the same folder`);
			}
		}

		fs.readFile(filePath, (error, content) => {
			if (error) {
				if (error.code === 'ENOENT') {
					fs.readFile('./404.html', (error, content) => {
						response.writeHead(404, { 'Content-Type': 'text/html' });
						response.end(content, 'utf-8');
					});
				} else {
					response.writeHead(500);
					response.end(
						`Sorry, check with the site admin for error: ${error.code} ..\n`
					);
				}
			} else {
				const contentType = getContentType(filePath);
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			}
		});
	})
	.listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);
