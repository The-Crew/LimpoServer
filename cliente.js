//require('./teste.js');
var porta_do_server = 3130;
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
                        var user = require('./model/user.js');
                        user.findForId(objetoJson.idUser, function(retorno){
                            imprimir(retorno);
                        });
                    break;
                    case "registrar":
                        var user = require('./model/user.js');
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
                        var user = require('./model/user.js');
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
                        var user = require('./model/user.js');
                        if(objetoJson.tipo == 'user'){
                            console.log('\n==> Entrou no case:remover - Usuario <==');
                            user.remove(objetoJson.idUser, function(retorno){
                                imprimir(retorno);
                            });
                        }else if(objetoJson.tipo == 'imovel'){
                            console.log('\n==> Entrou no case:remover - Imovel <==');
                            var user = require('./model/user.js');
                            user.removeImovel(objetoJson.idUser, objetoJson.idImovel, function(retorno){
                                imprimir(retorno);
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
                var user = require('./model/user.js');
                user.findForId(objetoJson.idUser, function(retorno){
                    imprimir(retorno);
                });
            break;
            case "inserir":
                console.log('\n==> Entrou no case:inserir <==');
                var user = require('./model/user.js');
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
                var user = require('./model/user.js');
                user.remove(objetoJson.idUser, function(retorno){
                    imprimir(retorno);
                });
            break;
            case "removerImovel":
                console.log('\n==> Entrou no case:removerImovel <==');
                var user = require('./model/user.js');
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
        res.end();
    }

});

server.listen(porta_do_server, function(){
    console.log('servidor rodando na porta '+porta_do_server);
});

