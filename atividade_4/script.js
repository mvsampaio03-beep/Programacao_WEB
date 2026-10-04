// Array que armazena os registros (objetos)
let registros = [];

// Recupera os elementos do HTML
const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const btnLimpar = document.getElementById("btnLimpar");

// Recupera os dados salvos no localStorage
const dadosSalvos = localStorage.getItem("produtos");

if (dadosSalvos) {
    registros = JSON.parse(dadosSalvos);
}

// Função responsável por mostrar os registros na tela
function mostrarProdutos() {
    listaProdutos.innerHTML = "";

    if (registros.length === 0) {
        listaProdutos.innerHTML = '<p class="vazio">Nenhum produto cadastrado.</p>';
        return;
    }

    // Percorre o array usando for...of
    for (const produto of registros) {
        const div = document.createElement("div");
        div.classList.add("produto");

        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
        `;

        listaProdutos.appendChild(div);
    }
}

// Captura o envio do formulário
formProduto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    // Cria um objeto com os valores do formulário
    const produto = {
        nome: document.getElementById("nome").value.trim(),
        categoria: document.getElementById("categoria").value.trim(),
        preco: Number(document.getElementById("preco").value),
        quantidade: Number(document.getElementById("quantidade").value)
    };

    // Adiciona o objeto ao array
    registros.push(produto);

    // Converte o array para JSON e salva no localStorage
    localStorage.setItem("produtos", JSON.stringify(registros));

    // Atualiza a lista na tela
    mostrarProdutos();

    // Limpa o formulário
    formProduto.reset();
});

// Limpa todos os registros
btnLimpar.addEventListener("click", function() {
    if (registros.length === 0) {
        return;
    }

    const confirmar = confirm("Deseja realmente apagar todos os produtos?");

    if (confirmar) {
        registros = [];

        // Remove os dados do localStorage
        localStorage.removeItem("produtos");

        mostrarProdutos();
    }
});

// Exibe os dados assim que a página é carregada
mostrarProdutos();
