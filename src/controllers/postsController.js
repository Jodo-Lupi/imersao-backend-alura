import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js"
import fs from "fs";

// Rota para listar todos os posts
export async function listarPosts(req, res) {
    // Chama a função para obter todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(posts);
}

// Rota para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;
    // Tenta criar o novo post
    try {
        // Chama a função para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Envia o post criado como resposta com status 200 (sucesso)
        res.status(200).json(postCriado);
    // Caso ocorra algum erro
    } catch (erro) {
        // Imprime o erro no console para depuração
        console.error(erro.message);
        // Envia uma resposta com status 500 (erro interno do servidor)
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

// Rota para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
    // Cria um novo objeto de post com a descrição e o nome do arquivo original
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    // Tenta criar o post e renomear a imagem
    try {
        // Chama a função para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Gera um novo nome para a imagem usando o ID do post inserido
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia o post criado como resposta com status 200 (sucesso)
        res.status(200).json(postCriado);
    // Caso ocorra algum erro
    } catch (erro) {
        // Imprime o erro no console para depuração
        console.error(erro.message);
        // Envia uma resposta com status 500 (erro interno do servidor)
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}