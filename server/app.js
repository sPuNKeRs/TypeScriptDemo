var fs = require('fs');
var http = require('http');
var url = require('url');

// Создаем сервер

// Инициализация переменных
var port = 3000;

http.createServer((req, res) => {
	var pathname = url.parse(req.url).pathname;
	console.log(pathname);
	
	if(pathname == '/'){
		fs.readFile('./build/index.html', 'utf8', (err, data) => {
			if(err) throw err;
			res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'});
			
			res.end(data);
			//console.log(process.env);			
		});
	}



}).listen(port, err=>{
	if(err) throw err;
	console.log('Сервер работает на порту: ' + port);
});