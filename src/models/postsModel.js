import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
// Conecta ao banco de dados usando a string de conexão fornecida como variável de ambiente.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
// Função assíncrona para obter todos os posts de uma coleção.
export async function getTodosPosts() {
    // Obtém o banco de dados 'Imersao-instabytes' da conexão estabelecida.
    const db = conexao.db("Imersao-instabytes");
    // Obtém a coleção 'posts' dentro do banco de dados.
    const colecao = db.collection("posts");
    // Retorna um array com todos os documentos da coleção
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post.
export async function criarPost(novoPost) {
    // Obtém o banco de dados 'Imersao-instabytes' da conexão estabelecida.
    const db = conexao.db("Imersao-instabytes");
    // Obtém a coleção 'posts' dentro do banco de dados.
    const colecao = db.collection("posts");
    // Insere um novo documento (o post) na coleção. O método `insertOne` retorna um objeto com informações sobre a inserção.
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost});
}