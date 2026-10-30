/**
 * ====================================================================
 * AVALIAÇÃO PRÁTICA - PROGRAMAÇÃO WEB
 * Aplicação: Catálogo de Produtos com Fetch API e Favoritos LocalStorage
 * Autor: Marcos Vinicius Sampaio de Sousa
 * ====================================================================
 * 
 * Tópicos aplicados:
 * - Manipulação do DOM (criação e atualização de elementos)
 * - Tratamento de Eventos (submit, click, change, input, keydown)
 * - Manipulação de Objetos e Arrays (filter, find, sort, map)
 * - JSON (serialização e deserialização com parse e stringify)
 * - LocalStorage (persistência dos favoritos no navegador)
 * - Requisições HTTP com Fetch API e Async/Await
 */

// ====================================================================
// 1. CONFIGURAÇÕES E ESTADO DA APLICAÇÃO
// ====================================================================

const API_BASE_URL = "https://dummyjson.com";
const CHAVE_LOCAL_STORAGE = "techstore_produtos_favoritos";

// Estado global da aplicação
let produtosAtuais = [];          // Lista de produtos atualmente carregados
let listaFavoritos = [];          // Lista de produtos favoritados (armazenados em localStorage)
let produtoSelecionado = null;    // Produto aberto no momento no modal
let visualizandoFavoritos = false; // Flag para indicar se a aba ativa é a de favoritos

// Fallback de dados locais (usado caso a máquina esteja sem conexão à internet)
const PRODUTOS_OFFLINE = [
    {
        id: 1,
        title: "Essence Mascara Lash Princess",
        description: "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
        category: "beauty",
        price: 9.99,
        discountPercentage: 7.17,
        rating: 4.94,
        stock: 5,
        brand: "Essence",
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"]
    },
    {
        id: 2,
        title: "Eyeshadow Palette with Mirror",
        description: "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for multiple looks.",
        category: "beauty",
        price: 19.99,
        discountPercentage: 5.5,
        rating: 3.28,
        stock: 44,
        brand: "Glamour Beauty",
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png"]
    },
    {
        id: 3,
        title: "Powder Canister",
        description: "The Powder Canister is a finely milled setting powder designed to set makeup and control shine.",
        category: "beauty",
        price: 14.99,
        discountPercentage: 18.14,
        rating: 3.82,
        stock: 59,
        brand: "Velvet Touch",
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png"]
    },
    {
        id: 4,
        title: "Red Lipstick",
        description: "The Red Lipstick is a classic bold lipstick that offers intense color payoff and a velvety matte finish.",
        category: "beauty",
        price: 12.99,
        discountPercentage: 19.03,
        rating: 2.51,
        stock: 68,
        brand: "Chic Cosmetics",
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png"]
    },
    {
        id: 5,
        title: "Red Nail Polish",
        description: "The Red Nail Polish offers a rich and glossy red color for vibrant and polished nails.",
        category: "beauty",
        price: 8.99,
        discountPercentage: 2.46,
        rating: 3.91,
        stock: 71,
        brand: "Nail Couture",
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png"]
    },
    {
        id: 6,
        title: "Calvin Klein CK One",
        description: "CK One by Calvin Klein is a classic unisex fragrance, featuring citrus notes and a refreshing aroma.",
        category: "fragrances",
        price: 49.99,
        discountPercentage: 0.32,
        rating: 4.85,
        stock: 17,
        brand: "Calvin Klein",
        thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
        images: ["https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png"]
    }
];

// ====================================================================
// 2. ELEMENTOS DO DOM (MAPEAMENTO)
// ====================================================================

// Navegação e cabeçalho
const btnVoltarInicio = document.getElementById("btnVoltarInicio");
const logoCatalogo = document.getElementById("logoCatalogo");
const btnVerTodos = document.getElementById("btnVerTodos");
const btnVerFavoritos = document.getElementById("btnVerFavoritos");
const contadorFavoritos = document.getElementById("contadorFavoritos");

// Formulário de busca e filtros
const formBusca = document.getElementById("formBusca");
const inputBusca = document.getElementById("inputBusca");
const btnLimparBusca = document.getElementById("btnLimparBusca");
const selectCategoria = document.getElementById("selectCategoria");
const selectOrdenacao = document.getElementById("selectOrdenacao");
const btnResetarFiltros = document.getElementById("btnResetarFiltros");

// Áreas de status e mensagens
const tituloSecao = document.getElementById("tituloSecao");
const contadorResultados = document.getElementById("contadorResultados");
const areaCarregando = document.getElementById("areaCarregando");
const areaErro = document.getElementById("areaErro");
const mensagemErro = document.getElementById("mensagemErro");
const btnTentarNovamente = document.getElementById("btnTentarNovamente");
const areaVazio = document.getElementById("areaVazio");
const tituloVazio = document.getElementById("tituloVazio");
const mensagemVazio = document.getElementById("mensagemVazio");
const btnAcaoVazio = document.getElementById("btnAcaoVazio");

// Grid de produtos
const gridProdutos = document.getElementById("gridProdutos");

// Modal de detalhes
const modalDetalhes = document.getElementById("modalDetalhes");
const modalOverlay = document.getElementById("modalOverlay");
const btnFecharModal = document.getElementById("btnFecharModal");
const modalImagemPrincipal = document.getElementById("modalImagemPrincipal");
const modalMiniaturas = document.getElementById("modalMiniaturas");
const modalCategoria = document.getElementById("modalCategoria");
const modalMarca = document.getElementById("modalMarca");
const modalTitulo = document.getElementById("modalTitulo");
const modalEstrelas = document.getElementById("modalEstrelas");
const modalNota = document.getElementById("modalNota");
const modalEstoque = document.getElementById("modalEstoque");
const modalDescricao = document.getElementById("modalDescricao");
const modalPrecoFinal = document.getElementById("modalPrecoFinal");
const modalPrecoOriginal = document.getElementById("modalPrecoOriginal");
const modalDesconto = document.getElementById("modalDesconto");
const btnModalFavorito = document.getElementById("btnModalFavorito");

// Toast de notificação
const toast = document.getElementById("toast");
let timeoutToast = null;


// ====================================================================
// 3. PERSISTÊNCIA: LOCALSTORAGE
// ====================================================================

/**
 * Carrega a lista de favoritos salvos no LocalStorage.
 * Aplica JSON.parse para converter a string armazenada de volta em Array de Objetos.
 */
function carregarFavoritosDoStorage() {
    try {
        const dadosArmazenados = localStorage.getItem(CHAVE_LOCAL_STORAGE);
        if (dadosArmazenados) {
            listaFavoritos = JSON.parse(dadosArmazenados);
        } else {
            listaFavoritos = [];
        }
    } catch (erro) {
        console.error("Erro ao ler favoritos do localStorage:", erro);
        listaFavoritos = [];
    }
    atualizarBadgeFavoritos();
}

/**
 * Salva o array de favoritos no LocalStorage.
 * Aplica JSON.stringify para transformar o Array de Objetos em formato JSON.
 */
function salvarFavoritosNoStorage() {
    try {
        localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(listaFavoritos));
    } catch (erro) {
        console.error("Erro ao salvar favoritos no localStorage:", erro);
    }
    atualizarBadgeFavoritos();
}

/**
 * Verifica se um produto com o ID especificado já está nos favoritos.
 * @param {number} id - Identificador do produto
 * @returns {boolean}
 */
function isProdutoFavorito(id) {
    return listaFavoritos.some(item => item.id === id);
}

/**
 * Alterna o estado de favorito de um produto (Adiciona ou Remove).
 * Utiliza métodos de array como findIndex, push e splice.
 * @param {Object} produto - Objeto do produto
 */
function toggleFavorito(produto) {
    const indice = listaFavoritos.findIndex(item => item.id === produto.id);

    if (indice >= 0) {
        // Já existe: remover dos favoritos
        listaFavoritos.splice(indice, 1);
        exibirToast(`"${produto.title}" foi removido dos favoritos 💔`);
    } else {
        // Não existe: adicionar aos favoritos
        listaFavoritos.push(produto);
        exibirToast(`"${produto.title}" adicionado aos favoritos! ❤️`);
    }

    // Persiste a mudança no localStorage
    salvarFavoritosNoStorage();

    // Se estivermos visualizando a aba de favoritos, re-renderiza para refletir a remoção imediatamente
    if (visualizandoFavoritos) {
        exibirAbaFavoritos();
    } else {
        // Atualiza os botões visuais nos cards já renderizados
        atualizarBotoesFavoritoNoGrid();
    }

    // Se o modal estiver aberto com este produto, atualiza seu botão de favoritar
    if (produtoSelecionado && produtoSelecionado.id === produto.id) {
        atualizarBotaoModalFavorito();
    }
}

/**
 * Atualiza o contador de favoritos no botão do cabeçalho
 */
function atualizarBadgeFavoritos() {
    contadorFavoritos.textContent = listaFavoritos.length;
}


// ====================================================================
// 4. INTEGRAÇÃO COM A API (FETCH API & ASYNC/AWAIT)
// ====================================================================

/**
 * Busca a lista de produtos da API DummyJSON.
 * Suporta busca por texto ou consulta padrão com limite de produtos.
 * @param {string} termoBusca - Termo opcional para busca
 */
async function buscarProdutosAPI(termoBusca = "") {
    // Exibe o spinner de carregamento e esconde outros blocos
    mostrarCarregando(true);
    ocultarMensagensFeedback();

    let url = `${API_BASE_URL}/products?limit=30`;

    if (termoBusca.trim() !== "") {
        url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(termoBusca.trim())}`;
    }

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status} - ${resposta.statusText}`);
        }

        const dados = await resposta.json();

        // Armazena a lista de produtos retornada
        produtosAtuais = dados.products || [];

        // Aplica filtros locais (categoria e ordenação) e renderiza
        aplicarFiltrosEExibir();

    } catch (erro) {
        console.warn("Falha ao consultar a API online. Usando dados locais de contingência.", erro);
        
        // Em caso de falha de conexão, utiliza dados locais para não travar a aplicação
        produtosAtuais = PRODUTOS_OFFLINE;
        aplicarFiltrosEExibir();
        
        exibirToast("⚠️ Modo Offline: exibindo produtos em cache local.");
    } finally {
        mostrarCarregando(false);
    }
}

/**
 * Busca as categorias disponíveis na API para preencher o select dinamicamente
 */
async function carregarCategoriasAPI() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/products/categories`);
        if (!resposta.ok) return;

        const categorias = await resposta.json();

        // Limpa opções antigas mantendo a opção "Todas"
        selectCategoria.innerHTML = '<option value="todas">Todas as categorias</option>';

        categorias.forEach(cat => {
            // A API DummyJSON pode retornar objetos { slug, name, url } ou strings
            const slug = typeof cat === "object" ? cat.slug : cat;
            const nome = typeof cat === "object" ? cat.name : cat;

            const option = document.createElement("option");
            option.value = slug;
            option.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
            selectCategoria.appendChild(option);
        });

    } catch (erro) {
        console.warn("Não foi possível carregar categorias dinâmicas da API:", erro);
    }
}


// ====================================================================
// 5. MANIPULAÇÃO DO DOM E RENDERIZAÇÃO
// ====================================================================

/**
 * Formata um valor numérico para a moeda brasileira (BRL)
 * @param {number} valor 
 * @returns {string} Ex: "R$ 99,90"
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor * 5.5); // Simulação de conversão para visualização em Reais
}

/**
 * Gera a representação de estrelas para a avaliação do produto
 * @param {number} rating - Nota de 0 a 5
 * @returns {string} Estrelas visuais
 */
function formatarEstrelas(rating) {
    const estrelasCompletas = Math.round(rating);
    return "★".repeat(estrelasCompletas) + "☆".repeat(Math.max(0, 5 - estrelasCompletas));
}

/**
 * Filtra e ordena os produtos conforme as opções do usuário e os renderiza na tela
 */
function aplicarFiltrosEExibir() {
    let listaFiltrada = [...produtosAtuais];

    // Se estiver na aba favoritos, a base é a lista de favoritos
    if (visualizandoFavoritos) {
        listaFiltrada = [...listaFavoritos];
    }

    // 1. Filtro por Categoria
    const categoriaSelecionada = selectCategoria.value;
    if (categoriaSelecionada !== "todas") {
        listaFiltrada = listaFiltrada.filter(item => 
            item.category && item.category.toLowerCase() === categoriaSelecionada.toLowerCase()
        );
    }

    // 2. Ordenação
    const criterioOrdenacao = selectOrdenacao.value;
    switch (criterioOrdenacao) {
        case "preco-crescente":
            listaFiltrada.sort((a, b) => a.price - b.price);
            break;
        case "preco-decrescente":
            listaFiltrada.sort((a, b) => b.price - a.price);
            break;
        case "avaliacao":
            listaFiltrada.sort((a, b) => b.rating - a.rating);
            break;
        case "nome-az":
            listaFiltrada.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            // Padrão retornado pela API
            break;
    }

    // Atualiza o contador de resultados no DOM
    const total = listaFiltrada.length;
    contadorResultados.textContent = `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`;

    // Renderiza a lista no Grid
    renderizarGrid(listaFiltrada);
}

/**
 * Cria os elementos HTML de cada card de produto e insere no grid do DOM
 * @param {Array} produtos - Array de objetos de produtos a exibir
 */
function renderizarGrid(produtos) {
    gridProdutos.innerHTML = "";

    if (produtos.length === 0) {
        areaVazio.style.display = "block";
        if (visualizandoFavoritos) {
            tituloVazio.textContent = "Você ainda não favoritou nenhum produto";
            mensagemVazio.textContent = "Navegue pelo catálogo e clique no coração ❤️ para salvar seus produtos favoritos.";
            btnAcaoVazio.textContent = "Explorar todos os produtos";
        } else {
            tituloVazio.textContent = "Nenhum produto encontrado";
            mensagemVazio.textContent = "Não encontramos produtos para os critérios pesquisados. Tente mudar os filtros.";
            btnAcaoVazio.textContent = "Limpar filtros";
        }
        return;
    }

    areaVazio.style.display = "none";

    // Itera pelo array de produtos e cria cada card
    produtos.forEach(produto => {
        const card = document.createElement("article");
        card.classList.add("card-produto");
        card.dataset.id = produto.id;

        const favoritado = isProdutoFavorito(produto.id);

        card.innerHTML = `
            <div class="card-produto-topo">
                <span class="badge-categoria-card">${produto.category || "Geral"}</span>
                <button 
                    type="button" 
                    class="btn-favorito-card ${favoritado ? "favoritado" : ""}" 
                    aria-label="${favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                    title="${favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                >
                    ${favoritado ? "❤️" : "🤍"}
                </button>
                <img 
                    src="${produto.thumbnail || produto.images?.[0] || ""}" 
                    alt="${produto.title}" 
                    class="card-produto-imagem"
                    loading="lazy"
                >
            </div>

            <div class="card-produto-corpo">
                <h3 class="card-produto-titulo" title="${produto.title}">${produto.title}</h3>
                
                <div class="card-produto-avaliacao">
                    <span class="estrelas-icone">${formatarEstrelas(produto.rating)}</span>
                    <span>${produto.rating.toFixed(1)}</span>
                </div>

                <div class="card-produto-precos">
                    <div>
                        <span class="preco-valor">${formatarMoeda(produto.price)}</span>
                    </div>
                    ${produto.discountPercentage ? `<span class="desconto-tag">-${Math.round(produto.discountPercentage)}%</span>` : ""}
                </div>

                <div class="card-produto-acoes">
                    <button type="button" class="btn btn-detalhes">
                        🔍 Ver Detalhes
                    </button>
                </div>
            </div>
        `;

        // Evento do botão de Favoritar no Card
        const btnFavorito = card.querySelector(".btn-favorito-card");
        btnFavorito.addEventListener("click", (evento) => {
            evento.stopPropagation();
            toggleFavorito(produto);
        });

        // Evento do botão "Ver Detalhes"
        const btnDetalhes = card.querySelector(".btn-detalhes");
        btnDetalhes.addEventListener("click", () => {
            abrirModalDetalhes(produto);
        });

        gridProdutos.appendChild(card);
    });
}

/**
 * Atualiza o visual dos botões de favoritos nos cards que já estão no grid
 */
function atualizarBotoesFavoritoNoGrid() {
    const cards = gridProdutos.querySelectorAll(".card-produto");
    cards.forEach(card => {
        const id = Number(card.dataset.id);
        const btnFavorito = card.querySelector(".btn-favorito-card");
        if (btnFavorito) {
            const favoritado = isProdutoFavorito(id);
            if (favoritado) {
                btnFavorito.classList.add("favoritado");
                btnFavorito.innerHTML = "❤️";
                btnFavorito.title = "Remover dos favoritos";
            } else {
                btnFavorito.classList.remove("favoritado");
                btnFavorito.innerHTML = "🤍";
                btnFavorito.title = "Adicionar aos favoritos";
            }
        }
    });
}


// ====================================================================
// 6. MODAL DE DETALHES DO PRODUTO
// ====================================================================

/**
 * Abre o modal preenchendo todos os dados do produto selecionado
 * @param {Object} produto 
 */
function abrirModalDetalhes(produto) {
    produtoSelecionado = produto;

    modalTitulo.textContent = produto.title;
    modalCategoria.textContent = produto.category || "Produto";
    modalMarca.textContent = produto.brand ? `Marca: ${produto.brand}` : "Marca Genérica";
    modalDescricao.textContent = produto.description || "Nenhuma descrição fornecida.";
    
    // Avaliação e estrelas
    modalEstrelas.textContent = formatarEstrelas(produto.rating);
    modalNota.textContent = `${produto.rating.toFixed(1)} / 5.0`;

    // Estoque
    if (produto.stock > 0) {
        modalEstoque.textContent = `Em estoque (${produto.stock} unid.)`;
        modalEstoque.classList.remove("baixo-estoque");
        if (produto.stock < 10) {
            modalEstoque.classList.add("baixo-estoque");
            modalEstoque.textContent = `Últimas ${produto.stock} unidades!`;
        }
    } else {
        modalEstoque.textContent = "Indisponível";
        modalEstoque.classList.add("baixo-estoque");
    }

    // Preços com cálculo de desconto
    const precoAtual = produto.price;
    const desconto = produto.discountPercentage || 0;
    const precoOriginal = desconto > 0 ? (precoAtual / (1 - (desconto / 100))) : precoAtual;

    modalPrecoFinal.textContent = formatarMoeda(precoAtual);
    modalPrecoOriginal.textContent = formatarMoeda(precoOriginal);
    modalDesconto.textContent = `-${Math.round(desconto)}% OFF`;

    // Imagem principal e galeria de miniaturas
    const imagemPadrao = produto.thumbnail || produto.images?.[0] || "";
    modalImagemPrincipal.src = imagemPadrao;
    modalImagemPrincipal.alt = produto.title;

    // Miniaturas
    modalMiniaturas.innerHTML = "";
    const todasImagens = produto.images && produto.images.length > 0 ? produto.images : [imagemPadrao];

    if (todasImagens.length > 1) {
        todasImagens.forEach((imgUrl, index) => {
            const miniatura = document.createElement("img");
            miniatura.src = imgUrl;
            miniatura.alt = `${produto.title} miniatura ${index + 1}`;
            miniatura.classList.add("modal-miniatura");
            if (index === 0) miniatura.classList.add("ativa");

            miniatura.addEventListener("click", () => {
                modalImagemPrincipal.src = imgUrl;
                modalMiniaturas.querySelectorAll(".modal-miniatura").forEach(m => m.classList.remove("ativa"));
                miniatura.classList.add("ativa");
            });

            modalMiniaturas.appendChild(miniatura);
        });
    }

    // Botão de favoritar no modal
    atualizarBotaoModalFavorito();

    // Exibe o modal
    modalDetalhes.classList.add("aberto");
    modalDetalhes.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Impede rolagem da página atrás do modal
}

/**
 * Fecha o modal de detalhes
 */
function fecharModalDetalhes() {
    modalDetalhes.classList.remove("aberto");
    modalDetalhes.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restaura rolagem normal
    produtoSelecionado = null;
}

/**
 * Atualiza o estado do botão de favoritar no modal
 */
function atualizarBotaoModalFavorito() {
    if (!produtoSelecionado) return;

    const favoritado = isProdutoFavorito(produtoSelecionado.id);
    const icone = btnModalFavorito.querySelector(".icone-coracao");
    const texto = btnModalFavorito.querySelector(".texto-btn-favorito");

    if (favoritado) {
        btnModalFavorito.classList.add("favoritado");
        icone.textContent = "❤️";
        texto.textContent = "Remover dos Favoritos";
    } else {
        btnModalFavorito.classList.remove("favoritado");
        icone.textContent = "🤍";
        texto.textContent = "Adicionar aos Favoritos";
    }
}


// ====================================================================
// 7. TOAST FEEDBACK E MENSAGENS VISUAIS
// ====================================================================

/**
 * Exibe uma notificação temporária no canto inferior da tela
 * @param {string} mensagem 
 */
function exibirToast(mensagem) {
    if (timeoutToast) clearTimeout(timeoutToast);

    toast.textContent = mensagem;
    toast.classList.add("visivel");

    timeoutToast = setTimeout(() => {
        toast.classList.remove("visivel");
    }, 3200);
}

/**
 * Controla a exibição da animação de carregamento (Spinner)
 * @param {boolean} mostrar 
 */
function mostrarCarregando(mostrar) {
    areaCarregando.style.display = mostrar ? "block" : "none";
    if (mostrar) {
        gridProdutos.style.display = "none";
        areaVazio.style.display = "none";
        areaErro.style.display = "none";
    } else {
        gridProdutos.style.display = "grid";
    }
}

/**
 * Esconde blocos de feedback de erro e vazio
 */
function ocultarMensagensFeedback() {
    areaErro.style.display = "none";
    areaVazio.style.display = "none";
}


// ====================================================================
// 8. CONTROLE DE NAVEGAÇÃO E INÍCIO DO CATÁLOGO
// ====================================================================

/**
 * Retorna à página inicial do catálogo:
 * Reseta o campo de busca, os filtros de categoria e ordenação,
 * fecha modais que estejam abertos, restaura a exibição de todos os produtos
 * e recarrega a listagem original com rolagem suave para o topo.
 */
function voltarAoInicioCatalogo() {
    // 1. Fecha o modal de detalhes caso esteja aberto
    if (modalDetalhes.classList.contains("aberto")) {
        fecharModalDetalhes();
    }

    // 2. Limpa o input de busca e esconde o botão de limpar
    inputBusca.value = "";
    btnLimparBusca.style.display = "none";

    // 3. Reseta os selects de categoria e ordenação
    selectCategoria.value = "todas";
    selectOrdenacao.value = "padrao";

    // 4. Garante que a aba ativa seja a de todos os produtos
    visualizandoFavoritos = false;
    btnVerTodos.classList.add("ativo");
    btnVerFavoritos.classList.remove("ativo");
    tituloSecao.textContent = "Todos os Produtos";

    // 5. Recarrega os produtos iniciais da API
    buscarProdutosAPI();

    // 6. Rola suavemente para o topo da página do catálogo
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 7. Notifica o usuário
    exibirToast("Página inicial do catálogo 🛍️");
}

/**
 * Alterna para a visualização de todos os produtos do catálogo
 */
function exibirAbaTodos() {
    visualizandoFavoritos = false;
    btnVerTodos.classList.add("ativo");
    btnVerFavoritos.classList.remove("ativo");
    tituloSecao.textContent = "Todos os Produtos";
    
    // Se a lista estiver vazia por algum motivo, busca da API
    if (produtosAtuais.length === 0) {
        buscarProdutosAPI();
    } else {
        aplicarFiltrosEExibir();
    }
}

/**
 * Alterna para a visualização apenas dos produtos favoritos
 */
function exibirAbaFavoritos() {
    visualizandoFavoritos = true;
    btnVerFavoritos.classList.add("ativo");
    btnVerTodos.classList.remove("ativo");
    tituloSecao.textContent = "Meus Produtos Favoritos ❤️";
    
    aplicarFiltrosEExibir();
}


// ====================================================================
// 9. EVENTOS E INICIALIZAÇÃO DA APLICAÇÃO
// ====================================================================

// Botão de Voltar ao Início do Catálogo
if (btnVoltarInicio) {
    btnVoltarInicio.addEventListener("click", function(evento) {
        evento.preventDefault();
        voltarAoInicioCatalogo();
    });
}

// Clique na Logo do Catálogo para também voltar ao início
if (logoCatalogo) {
    logoCatalogo.addEventListener("click", function() {
        voltarAoInicioCatalogo();
    });
}

// Envio do formulário de pesquisa
formBusca.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const termo = inputBusca.value.trim();
    
    if (visualizandoFavoritos) {
        // Se estiver nos favoritos, pesquisa localmente
        aplicarFiltrosEExibir();
    } else {
        // Se estiver no catálogo geral, consulta a API
        buscarProdutosAPI(termo);
    }
});

// Digitação no campo de pesquisa
inputBusca.addEventListener("input", function() {
    if (inputBusca.value.trim() !== "") {
        btnLimparBusca.style.display = "flex";
    } else {
        btnLimparBusca.style.display = "none";
        if (!visualizandoFavoritos) {
            buscarProdutosAPI();
        } else {
            aplicarFiltrosEExibir();
        }
    }
});

// Botão de limpar pesquisa
btnLimparBusca.addEventListener("click", function() {
    inputBusca.value = "";
    btnLimparBusca.style.display = "none";
    inputBusca.focus();
    if (!visualizandoFavoritos) {
        buscarProdutosAPI();
    } else {
        aplicarFiltrosEExibir();
    }
});

// Filtro de Categoria
selectCategoria.addEventListener("change", function() {
    aplicarFiltrosEExibir();
});

// Filtro de Ordenação
selectOrdenacao.addEventListener("change", function() {
    aplicarFiltrosEExibir();
});

// Botão de resetar filtros
btnResetarFiltros.addEventListener("click", function() {
    inputBusca.value = "";
    btnLimparBusca.style.display = "none";
    selectCategoria.value = "todas";
    selectOrdenacao.value = "padrao";
    
    if (visualizandoFavoritos) {
        aplicarFiltrosEExibir();
    } else {
        buscarProdutosAPI();
    }
});

// Botão de ação na mensagem de vazio
btnAcaoVazio.addEventListener("click", function() {
    if (visualizandoFavoritos) {
        exibirAbaTodos();
    } else {
        btnResetarFiltros.click();
    }
});

// Botão tentar novamente na mensagem de erro
btnTentarNovamente.addEventListener("click", function() {
    buscarProdutosAPI();
});

// Navegação entre abas
btnVerTodos.addEventListener("click", exibirAbaTodos);
btnVerFavoritos.addEventListener("click", exibirAbaFavoritos);

// Botão de favoritar dentro do modal
btnModalFavorito.addEventListener("click", function() {
    if (produtoSelecionado) {
        toggleFavorito(produtoSelecionado);
    }
});

// Fechamento do modal: clique no botão 'X' ou no overlay escuro
btnFecharModal.addEventListener("click", fecharModalDetalhes);
modalOverlay.addEventListener("click", fecharModalDetalhes);

// Fechamento do modal com a tecla 'Escape'
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && modalDetalhes.classList.contains("aberto")) {
        fecharModalDetalhes();
    }
});

// ====================================================================
// INICIALIZAÇÃO AO CARREGAR O DOM
// ====================================================================
document.addEventListener("DOMContentLoaded", function() {
    // 1. Carrega os favoritos salvos no LocalStorage
    carregarFavoritosDoStorage();

    // 2. Carrega as categorias dinamicamente da API
    carregarCategoriasAPI();

    // 3. Busca a lista inicial de produtos da API DummyJSON
    buscarProdutosAPI();
});
