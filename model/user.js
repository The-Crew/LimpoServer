var collection = 'user';


function findForId(idUser, callback){
	console.log('\n==> Entrou no findForId(idUser, callback)')
	console.log('idUser: '+idUser);
	var dao = require('../db/dao.js');
	dao.findOne(collection,'id',idUser,function(objeto){
		if(!objeto){
			console.log('\n==> findForId retornou FALSE <==');
			callback.call(null, false);
		}else{
			callback.call(null, objeto);
		}
	});
}
exports.findForId = findForId;

exports.insert = function(dados, callback){
	console.log('\n==> Entrou no user.insert(dados, callback)');
	var dao = require('../db/dao.js');
	dao.insert(collection,dados, function(retorno){
		console.log('Retorno do dao.insert: ');
		console.log(retorno);
		callback.call(null, retorno);
	});
}

exports.remove = function(idUser, callback){
	console.log('\n==> Entrou no user.remove(idUser, callback)');
	var dao = require('../db/dao.js');
	dao.remove(collection,{id:idUser}, function(retorno){
		console.log('Retorno do dao.remove: ');
		console.log(retorno);
		callback.call(null, retorno);
	});
}

function update(idUser, dados, callback){
	console.log('\n==> Entrou no user.update(idUser, dados, callback)');
	findForId(idUser, function(objetoUser){
		if(objetoUser){
			for(var i in objetoUser) {
	    		if (dados.hasOwnProperty(i)){
	        		console.log('Campo a ser atualizado: '+i);
	        		objetoUser[i] = dados[i];
	        	}
			}
			for(var i in dados) {
	    		if (!objetoUser.hasOwnProperty(i)){
	        		console.log('Campo a ser atualizado: '+i);
	        		objetoUser[i] = dados[i];
	        	}
			}
			var dao = require('../db/dao.js');
			dao.update(collection,{id:idUser}, objetoUser, function(retorno){
				console.log('Retorno do dao.update: ');
				console.log(retorno);
				if(retorno === true){
					findForId(idUser, function(objetoUser){
						if(objetoUser){
							callback.call(null, objetoUser);
						}else{
							console.log('\n==> update retornou FALSE <==');
							callback.call(null, false);
						}
					});
				}else{
					console.log('\n==> update retornou FALSE <==');
					callback.call(null, false);
				}
			});
		}else{
			console.log('\n==> update retornou FALSE <==');
			callback.call(null, false);
		}
	})
}
exports.update = update;

exports.insertImovel = function(idUser, jsonImovel, _callback){
	console.log('\n==> Entrou no user.insertImovel(idUser, jsonImovel, _callback)');
	findForId(idUser, function(objetoUser){
		
		console.log('\n==> Iniciando Tratamento do Array de Imoveis <==');
		array = objetoUser.imoveis;
		array = array == undefined ? [] : array;
		var ultimoId;
		console.log('Arrai de imoveis: ');
		console.log(array);

		for(i = 0; i < array.length; i++){
			ultimoId = array[i].id;
		}

		jsonImovel.id = ultimoId == undefined ? 0 : ++ultimoId;
		jsonImovel.id = jsonImovel.id.toString();
		console.log('UltimoId: '+jsonImovel.id);
		array[array.length] = jsonImovel;
		console.log('Array: '); console.log({imoveis:array});

		update(idUser, {imoveis:array}, function(retorno){
			if(retorno){
				findForId(idUser, function(_retorno){

					_callback.call(null, _retorno.imoveis);
				});
			}else{_callback.call(null, retorno);}
		});
	});
}

exports.removeImovel = function(idUser, idImovel, _callback){
	console.log('\n==> Entrou no user.removeImovel(idUser, idImovel, _callback)');
	findForId(idUser, function(objetoUser){
		if(objetoUser){
			console.log('\n==> Iniciando Tratamento do Array de Imoveis <==');
			array = objetoUser.imoveis;
			var indexForRemove;
			console.log('Arrai de imoveis: ');
			console.log(array);

			for(i = 0; i < array.length; i++){
				indexForRemove = array[i].id == idImovel ? i : null;
			}
			console.log("indice para Remover: "+indexForRemove);
			
			for(i = indexForRemove; i<array.length; i++){
				array[i] = array[i+1];
			}
			array.pop();
			console.log('Novo array de imoveis: ');
			console.log(array);
			
			update(idUser, {imoveis:array}, function(retorno){
				_callback.call(null, retorno.imoveis);
			});
		}else{
			_callback.call(null, false);
		}
	});
}

exports.updateImovel = function(idUser, jsonImovel, _callback){
	console.log('\n==> Entrou no user.updateImovel(idUser, jsonImovel, _callback)');
	console.log('idUser: '+idUser);
	console.log('jsonImovel: ');
	console.log(jsonImovel);
	findForId(idUser, function(objetoUser){
		if(objetoUser){
			console.log('\n==> Iniciando Tratamento do Array de Imoveis <==');
			array = objetoUser.imoveis;
			var indexForUpdate;
			console.log('Arrai de imoveis: ');
			console.log(array);
			var id = jsonImovel.id.toString();
			console.log('Id do imovel: '+jsonImovel.id);

			for(i = 0; i < array.length; i++){
				console.log(array[i].id);
				if(id == array[i].id){
					indexForUpdate = i;
				}
			}
			console.log("indice para Atualizar: "+indexForUpdate);
			
			array[indexForUpdate] = jsonImovel;

			console.log('Novo array de imoveis: ');
			console.log(array);
			
			update(idUser, {imoveis:array}, function(retorno){
				_callback.call(null, retorno.imoveis);
			});
		}else{
			_callback.call(null, false);
		}
	});
}