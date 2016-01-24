;(()=>{
	'use strict';

	var express = require('express');
	var path = require('path'); // Модуль для работы с путями

	module.exports = () => {
		var app = express();

		// Устанавливаем путь к статическому содержимому
        app.use(express.static(path.resolve('./build')));
		

		return app;
	};
})();