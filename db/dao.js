var db = require('./conn.js').Db,
	assert = require('assert');

exports.findOne = function(collection, key, value, callback) {
	console.log('\n  ==> Entrou no dao.findOne(collection, key, value) <==');
	console.log('Collection: ' + collection);
	console.log('Key: ' + key);
	console.log('Value: ' + value);
	
	function preparaJson(key, value, exec) {
		console.log('\n  ==> Entrou no preparaJson(key, value, exec) <==');
		var json = {};
		json[key] = value;
		console.log('Json de pesquisa: ' + JSON.stringify(json));
		setTimeout(function() {
			if(json[key] != ''){
				exec.call(null, json);
			}else{
				console.log('\n  ==> CAMPO DE PESQUISA "'+key+'" VAZIO <==');
				callback.call(null, false);
			}
		}, 300);
	}
	preparaJson(key, value, exec);

	function exec(json) {
		console.log('\n  ==> Entrou no exec(json) <==');
		db.open(function(err, banco) {
			console.log('\n  ==> Entrou no db.opem <==');
			var collectionDb = banco.collection(collection);						
			collectionDb.findOne(json, function(err, item) {
				if (err) {
					console.log('\n==> err:');
					console.log(err);
				}
				console.log('Item retornado: ' + JSON.stringify(item));
				db.close();
				callback.call(null, item);
			});
		});
	}
}

exports.find = function(collection, jsonFind, jsonSelect, callback) {
	console.log('\n  ==> Entrou no dao.find(collection, jsonFind, jsonSelect, callback) <==');
	console.log('Collection: ' + collection);
	console.log('jsonFind: ');
	console.log(jsonFind);
	console.log('jsonSelect: ');
	console.log(jsonSelect);
	db.open(function(err, banco) {
		console.log('\n  ==> Entrou no db.opem <==');
		var collectionDb = banco.collection(collection);

		collectionDb.find(jsonFind, jsonSelect).toArray(function(err, item) {
			if (err) {
				console.log('err: ');
				console.log(err);
			}
			//console.log('Item retornado: ' + JSON.stringify(item));
			db.close();
			callback.call(null, item);
		});

	});
}

exports.insert = function(collection, json, callback) {
	console.log('\n  ==> Entrou no dao.insert(collection, json, callback) <==');
	console.log('Collection: ' + collection);
	console.log('Json a ser inserido: ');
	console.log(json);
	db.open(function(err, banco) {
		var collectionDb = banco.collection(collection);

		collectionDb.insert(json, function(err, item) {
			if (err) {
				console.log('err: ');
				console.log(err);
			}
			console.log('Dados obtidos do DB:');
			console.log(item.ops[0]);
			db.close();
			callback.call(null, item.ops[0]);
		});
	});
}

exports.update = function(collection, jsonFind, jsonUpdate, callback) {
	console.log('\n  ==> Entrou no dao.update(collection, jsonFind, jsonUpdate, callback) <==');
	console.log('Collection: ' + collection);
	console.log('Json de condição: ');
	console.log(jsonFind);
	console.log('Json de atualização: ');
	console.log(jsonUpdate);
	db.open(function(err, banco) {
		var collectionDb = banco.collection(collection);
		collectionDb.update(jsonFind, {$set: jsonUpdate}, function(err, item) {
			if (err) {
				console.log('err: ');
				console.log(err);
				db.close();
				callback.call(null, false);
			} else {
				console.log('Campo pesquisado:' + JSON.stringify(jsonFind));
				console.log('Campo atualizado: ' + JSON.stringify(jsonUpdate));
				db.close();
				callback.call(null, true);
			}
		});
	});
}

exports.remove = function(collection, jsonCondition, callback) {
	db.open(function(err, banco) {
		var collectionDb = banco.collection(collection);
		collectionDb.remove(jsonCondition, {
			single: false
		}, function(err, retorno) {
			if (err) {
				console.log('err: ');
				console.log(err);
			}
			db.close();
			callback.call(null, retorno);
		});
	});
}

//{ imoveis: [ { id: 1, nome: 'Casa', qtdComodos: 10, endereco: 'Rua Paraná, 160, Socorro, Jaboatão dos Guararapes - PE', lat: -1.948473, lng: -39.84426, status: true, tipo: 'imovel' }, { id: 2, nome: 'Apartamento', qtdComodos: 15, endereco: 'Rua 7 de Setembro, 1000, Boa vista, Recife - PE', lat: -1.75363, lng: -39.63453, status: true, tipo: 'imovel' }, { nome: 'Casa', qtdComodos: 10, endereco: 'Rua Paraná, 160, Socorro, Jaboatão dos Guararapes - PE', lat: -1.948473, lng: -39.84426, status: true, tipo: 'imovel', id: 3 } ] }