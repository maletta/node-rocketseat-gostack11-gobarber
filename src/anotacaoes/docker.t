##docker anotações

docker run --name container1 -d --port 8080:80 <imagem>
// executa alguma imagem
// --name <nome_para_o_container> [define um nome para o container]
// -d [modo detached, não interrompe o terminal]
// --port --port 8080:80 [expõe a porta 80 da imagem para a 8080 do host, port fowarding]
// sempre iniciar um NOVA imagem
exemplo: docker run -d --port 8080:80 ngix



docker ps
//lista os containers rodanco

docker ps -a
// lista containers que estavam rodando

docker stop <nome_do_container_OU_id_do_container>
// para a execução do container

docker start <id_container>
// inicializa container que já foi criado

docker rm <id_container>
// deletar container da lista de containers


docker exec <container_name> ls
// docker exec [executa comandos dentro do container]
// ls [um exemplo de comando]

docker exec -it <container_name> bash
// docker exec [executa comandos dentro do container]
// -it permite acessar de forma iterativa
// bash abre o terminal do container

docker rmi <nome_da_iagem>
// remove a IMAGE baixa no cache do docker




docker build -t <tag_nome_do_container> <caminho_do_dockerfile>
// docker build gera uma imagem a partir de um dockerfile
// -t [dá um nome para a imagem]
exemplo: docker build -t api/pokemon .

docker-compose up -d
//sobe um docker-compose.yml
//docker-compose é utilizado para gerenciar containers, mais de um serviço
// -d [modo detached, não interrompe o terminal]

docker-compose down
// mata o container docker




