// Инициализация EXPRESS
var app = require('./configs/express')();

app.listen(3000, err=>{
	if(err) throw err;
	console.log('Сервер работает на 3000 порту1');	
});