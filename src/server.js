// Usar o express para inicializar o servidor
const express = require ("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db.js")

// configurar pasta public
server.use(express.static("public"))

// habilitar o uso do req.body na apk
server.use(express.urlencoded({ extended: true}))

// utilizando template engine ao express
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos para a minha aplicacao (ROTAS)
// pagina inicial
// req: requisição um pedido
// res: resposta

server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um título"})
})


server.get("/create-point", (req, res) => {
    // req.query : QUery strings da nossa url
   console.log(req.query)
   return  res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    // req.body:  O corpo do nosso formulario
    //console.log(req.body)

    // inserer dados no banco de dados
        // inserir dados na tabela
        const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com Sucesso ! ")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)


    

})

server.get("/search" , (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
         return res.render("search-results.html", { total: 0})
    }


    //pegar os dados do banco de dados
    // para ser igual muda o like para = e tira a %
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%' `, function(err, rows){
        if(err){
            return console.log(err)
        }
        
        const total = rows.length

        //console.log(rows)
        //console.log("Aqui estão seus registros: ")
        //console.log(rows)

         //mostrar a pagina html com os dados do banco de dados
        return  res.render("search-results.html", {places: rows, total: total})
 
    })
})

// Ligar o servidor porta 3000
server.listen(3000)