var erro = require('erro')();

module.exports = {
	InvalidParameterError: erro.create('InvalidParameterError', 'invalid-parameter')
};