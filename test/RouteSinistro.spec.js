//Importações das bibliotecas
const {test, expect, describe} = require ('@jest/globals');
const request =  require ("supertest");
const { faker } = require("@faker-js/faker/locale/pt_BR"); 
//Carrega as variaveis para o projeto
require('dotenv').config();
//Organiza os testes em um bloco
describe("Teste de Integração - Sinistros Frotas", () => {
    const BASE_URL = process.env.API_BASE_URL;
    const API_USER = process.env.API_USER;
    const API_USER_MOTORISTA = process.env.API_USER_MOTORISTA;
    const API_PASS = process.env.API_PASS;
    const req = request(BASE_URL);
    let token;
    let sinistroId;
    //Caso de teste
    test("Deve Autenticar na API - Usando o ADMIN", async () => {
        const dados = await req
        .post('/login')
        .send({
            credencial:API_USER,
            senha:API_PASS
        })
        .set('Accept','application/json');
        //Afirmação de que o status da resposta deve ser 200
        expect(dados.status).toBe(200);
        //Afirmo que na resposta esteja definado o token
        expect(dados.body.data.token).toBeDefined();
        //Armazena o token da resposta na variavel token
        token = dados.body?.data?.token;
        console.log(token);
        //console.log("Status Login",dados.status, '\nLogin Body:',dados.body);
    });

    test("Deve retornar uma lista de sinistros", async () => {
        const resposta = await req 
        .get("/sinistros")
        .set('Accept','application/json')
        .set("Authorization",`Bearer ${token}`)
        .expect(200);
        expect(resposta.status).toBe(200);
        sinistroId = resposta.body.data[0]._id
        sinistroId = resposta.body.data[0]._nome
        //console.log(resposta.body.data[0]._id);
    });

    test("Deve retornar uma sinistro com base no id", async () => {
        const resposta = await req 
        .get(`/sinistros/${sinistroId}`)
        .set('Accept','application/json')
        .set("Authorization",`Bearer ${token}`)
        .expect(200);
        expect(resposta.status).toBe(200);
        console.log(resposta.body);
    });
    test("Deve criar um sinistro com sucesso", async () => {
    const numeroAleatorio = Math.floor(Math.random() * 1000) + 1;
    const novoSinistro = {
        tipo_sinistro: "Incêndios",
        data_sinistro: "2024-02-21T13:44:30.186Z",
        local_sinistro: "Estrada",
        descricao: "Roubo de acessórios do veículo.",
        veiculo: "65d5fe3e6f806a24cfbcf363",
        motorista: "65d5fe3e6f806a24cfbcf363",
        fotos: [
          "/arquivos/000000000000000000000000/cafe.jpg"
        ],
        responsavel_analise: "Camila Silva"
      }
    
        const resposta = await req 
        .post(`/sinistros`)
        .send(novoSinistro)
        .set("Authorization",`Bearer ${token}`);
        //console.log(resposta.body);
        expect(201);
        expect(resposta.status).toBe(201);
        expect(resposta.body.data.nome).toBe(novoSinistro.nome);
       
    });




});