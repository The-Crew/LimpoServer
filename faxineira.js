var user = require('./model/user.js');
//require('./teste.js');
var porta_do_server = 3131;
url = require('url'),
http = require('http');
//qs = require('querystring');

var server = http.createServer( function (req, res) {
 
    if(req.method=='POST') {
            var post='';
            req.on('data', function (data) {
                post +=data;
                console.log('\n--------#----------#----------');
                console.log('Dados recebido pelo POST:');
                console.log(post+'\n');
            });
            req.on('end',function(){
                var objetoJson =  JSON.parse(post);//qs.parse(post);
                console.log('Converter string recebida no POST em: '+JSON.stringify(objetoJson)+'\n');

                //TRATAR OS ACTIONS DAS SOLICITAÇÕES DO CLIENTE
                switch(objetoJson.action){
                    case "login":
                        console.log('\n==> Entrou no case:login <==');
                        
                        user.findForId(objetoJson.idUser, function(retorno){
                            imprimir(retorno);
                        });
                    break;
                    case "registrar":
                        
                        if(objetoJson.tipo == 'user'){
                            console.log('\n==> Entrou no case:registrar - Usuario <==');
                            user.insert(objetoJson.dados, function(retorno){
                                imprimir(retorno);
                            });
                            
                        }else if(objetoJson.tipo == 'imovel'){
                            console.log('\n==> Entrou no case:registrar - Imovel <==');
                            user.insertImovel(objetoJson.idUser, objetoJson.dados, function(retorno){
                                imprimir(retorno);
                            });
                        }
                    break;
                    case "atualizar":
                        
                        if(objetoJson.tipo == 'user'){
                            console.log('\n==> Entrou no case:atualizar  - Usuario <==');
                            user.update(objetoJson.idUser, objetoJson.dados, function(retorno){
                                imprimir(retorno);
                            });
                            
                        }else if(objetoJson.tipo == 'imovel'){
                            console.log('\n==> Entrou no case:atualizar - Imovel <==');
                            user.updateImovel(objetoJson.idUser, objetoJson.dados, function(retorno){
                                imprimir(retorno);
                            });
                        }
                    break;
                    case "remover":
                        
                        if(objetoJson.tipo == 'user'){
                            console.log('\n==> Entrou no case:remover - Usuario <==');
                            user.remove(objetoJson.idUser, function(retorno){
                                imprimir(retorno);
                            });
                        }else if(objetoJson.tipo == 'imovel'){
                            console.log('\n==> Entrou no case:remover - Imovel <==');
                            
                            user.removeImovel(objetoJson.idUser, objetoJson.idImovel, function(retorno){
                                imprimir(retorno);
                            });
                        }
                    break;
                    case "faxineira":
                        if (objetoJson.tipo == "lista") {
                            user.findForId(objetoJson.idUser, function(retorno){
                                imprimir(retorno.indic);
                            });
                        }else if (objetoJson.tipo == "sys") {
                            user.findForId(objetoJson.idFax, function(retorno){
                                imprimir(retorno);
                            });
                        }else if (objetoJson.tipo == "melhor") {
                            var exec = require('child_process').exec;
                            exec('java -jar grafo.jar '+objetoJson.idUser, function(error, stdout, stderr){
                                console.log("Melhor faxineira: "+stdout);
                                user.findForId(stdout, function(retorno){
                                    if(!retorno.off){
                                        user.update(stdout, {off:false,sol:objetoJson.idUser}, function(retorno){
                                            imprimir(retorno);
                                        });
                                    }else{
                                        imprimir(false);
                                    }
                                });
                            });
                        }
                    break;
                    case "solicitar":
                        console.log(objetoJson);
                        
                        user.findForId(objetoJson.idFax, function(retorno){
                            if(!retorno.off){
                                user.update(objetoJson.idFax, {off:false,sol:objetoJson.idUser, solLat:objetoJson.solLat,solLng:objetoJson.solLng}, function(retorno){
                                    user.findForId(objetoJson.idUser, function(retorno){
                                        retorno.indic = retorno.indic == undefined ? [] : retorno.indic;
                                        retorno.indic[retorno.indic.length] = {id:objetoJson.idFax, ant:'sys'}
                                        user.update(objetoJson.idUser, {indic:retorno.indic}, function(retorno){
                                            imprimir(retorno);
                                        });
                                    })
                                    
                                });
                            }else{
                                imprimir(false);
                            }
                        });
                    break;
                    case "indicar":
                        console.log(objetoJson);
                        
                        user.findForEmail(objetoJson.emailUser, function(retorno){
                            if(retorno){
                                user.insertIndic(retorno.id, objetoJson.idUser, objetoJson.idFax, function(retorno){
                                    console.log(retorno);
                                    imprimir(retorno);
                                });
                            }else{
                                imprimir(false);
                            }
                        });
                    break;
                    case "onOff":
                        user.update(objetoJson.idUser, {estado:objetoJson.estado}, function(retorno){
                            imprimir(retorno.estado);
                        });
                    break;
                    case "checando":
                        if(objetoJson.aberto){
                            user.findForId(objetoJson.idUser,function (retorno) {
                                if(retorno.sol){
                                    var json = {};
                                    findForId(retorno.sol, function (_retorno) {
                                        json.user.nome =_retorno.nome;
                                        json.user.sexo = _retorno.sexo;
                                    });
                                    json.solLat = retorno.solLat;
                                    json.solLng = retorno.solLng;
                                    imprimir(json);
                                }else{
                                    imprimir(false);
                                }
                            });
                        }else if(objetoJson.aceitar){
                            user.update(objetoJson.idUser, {estado:false}, function(retorno){
                                imprimir(true);
                            });
                        }else if(objetoJson.recusar){
                            user.update(objetoJson.idUser, {estado:true, solLat:'',solLng:'',sol:''}, function(retorno){
                                imprimir(true);
                            });
                        }
                        
                    break;
                }

                
            });
    }
    else if(req.method=='GET') {
        var objetoJson = url.parse(req.url,true).query;
        if(Object.keys(objetoJson).length > 0){
            console.log('\n==> METODO GET <==');
            console.log(req.url);
            console.log('Dados recebido e convertido: '+JSON.stringify(objetoJson));
        }else{
            imprimir('<a href="./limpo/limpo.apk">APK Limpo</a>');
    }

        switch(objetoJson.action){
            case "login":
                console.log('\n==> Entrou no case:login <==');
                
                user.findForId(objetoJson.idUser, function(retorno){
                    imprimir(retorno);
                });
            break;
            case "inserir":
                console.log('\n==> Entrou no case:inserir <==');
                
                if(objetoJson.tipo == 'user'){
                    user.insert(objetoJson.dados, function(retorno){
                        imprimir(retorno);
                    });
                    
                }else if(objetoJson.tipo == 'imovel'){
                    user.insertImovel(objetoJson.idUser, objetoJson.dados, function(retorno){
                        imprimir(retorno);
                    });
                }
            break;
            case "atualizar":
                console.log('\n==> Entrou no case:atualizar <==');
                var registrar = require('./controller/registrar')
                var usuario = registrar.usuario(objetoJson);
                imprimir(usuario);
            break;
            case "remover":
                console.log('\n==> Entrou no case:remover <==');
                
                user.remove(objetoJson.idUser, function(retorno){
                    imprimir(retorno);
                });
            break;
            case "removerImovel":
                console.log('\n==> Entrou no case:removerImovel <==');
                
                user.removeImovel(objetoJson.idUser, objetoJson.idImovel, function(retorno){
                    imprimir(retorno);
                });
            break;

        }

        /*res.writeHead(200, {'Content-type':'text/plain'});
        res.write('GET: '+JSON.stringify(url_parts.query));
        res.end();*/
    }
 
    function imprimir(dados){
        console.log('\nDados a serem retornados para o app: ');
        console.log(dados);
        console.log('--------#----------#----------\n');

        //res.writeHead(200, {'Content-type':'text/plain'});
        var origin = (req.headers.origin || "*");
        res.writeHead(200, {
                        'Content-type':'text/plain',
                        "access-control-allow-origin": origin,});
        /*res.writeHead(204,
                     { "access-control-allow-origin": origin,
                     "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                     "access-control-allow-headers": "content-type, accept",
                     "access-control-max-age": 10,
                     "content-length": 0,
                     "success":"Updated Successfully",  
                     'Content-type':'text/plain'
                   });*/
        res.write(JSON.stringify(dados));
        //res.write(JSON.stringify(dados));
	//TIME PARA SIMULAR ATRASO/DEMORA/INTERNET LENTA/ETC
        setTimeout(function(){
            res.end();
        }, 0);
    }

});

server.listen(porta_do_server, function(){
    console.log('servidor rodando na porta '+porta_do_server);
});

