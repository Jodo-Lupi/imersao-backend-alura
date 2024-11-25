import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionSuccessStatus: 200
};

// Configura o armazenamento de arquivos utilizando o multer
const storage = multer.diskStorage({
    // Define o diretório de destino para os arquivos
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Define o nome do arquivo a ser salvo
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
// Cria uma instância do multer com a configuração de armazenamento
const upload = multer({ dest: "./uploads", storage });

// Função para configurar as rotas da aplicação
const routes = (app) => {
    // Habilita o parsing de JSON no corpo das requisições
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota GET para listar todos os posts
    app.get("/posts", listarPosts);
    // Rota POST para criar um novo post
    app.post("/posts", postarNovoPost);
    // Rota POST para fazer upload de uma imagem e criar um novo post
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost)
};

export default routes;