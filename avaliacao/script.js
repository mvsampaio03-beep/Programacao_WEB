/* =========================================================
   SELEÇÃO DOS ELEMENTOS
========================================================= */

// Botão de troca de tema
const btnTema = document.getElementById("btnTema");

// Campo onde o usuário digita o nome
const campoNome = document.getElementById("nome");

// Mensagem personalizada
const mensagemNome = document.getElementById("mensagemNome");

// Botão de curtida
const btnCurtir = document.getElementById("btnCurtir");

// Número de curtidas
const curtidas = document.getElementById("curtidas");

// Botão de informações
const btnMais = document.getElementById("btnMais");

// Área de informações da História
const maisInformacoes =
    document.getElementById("maisInformacoes");

// Texto do botão e seta
const textoMais =
    document.getElementById("textoMais");

const setaMais =
    document.getElementById("setaMais");

// Botão das conquistas
const btnConquistas =
    document.getElementById("btnConquistas");

// Área das conquistas
const textoConquistas =
    document.getElementById("textoConquistas");

// Texto do botão das conquistas
const textoBtnConquistas =
    document.getElementById("textoBtnConquistas");

// Seta das conquistas
const setaConquistas =
    document.getElementById("setaConquistas");

// Primeiro link do menu
const primeiroLink =
    document.querySelector(".menu a");


/* =========================================================
   VARIÁVEIS
========================================================= */

// Guarda o número de curtidas
let totalCurtidas = 0;


/* =========================================================
   EVENTO CLICK - MODO ESCURO / CLARO
========================================================= */

btnTema.addEventListener("click", function () {

    // Adiciona ou remove a classe modo-claro
    document.body.classList.toggle("modo-claro");

    // Verifica qual modo está ativo
    if (
        document.body.classList.contains("modo-claro")
    ) {

        // Altera o texto do botão
        btnTema.querySelector("span").textContent =
            "Modo claro";

    } else {

        // Retorna o texto original
        btnTema.querySelector("span").textContent =
            "Modo escuro";
    }

});


/* =========================================================
   EVENTO INPUT - CAMPO DE NOME
========================================================= */

campoNome.addEventListener("input", function () {

    // Pega o valor digitado pelo usuário
    const nomeDigitado =
        campoNome.value.trim();

    // Verifica se o campo está vazio
    if (nomeDigitado === "") {

        // Retorna a mensagem padrão
        mensagemNome.textContent =
            "🏁 Bem-vindo à página de Ayrton Senna!";

        // Altera a aparência usando JavaScript
        mensagemNome.style.color =
            "#ffd400";

        return;
    }

    // Cria uma mensagem personalizada
    mensagemNome.textContent =
        `🏁 Bem-vindo, ${nomeDigitado}! Que sua paixão pela velocidade continue viva.`;

    // Altera a cor com JavaScript
    mensagemNome.style.color =
        "#ffdf22";

});


/* =========================================================
   EVENTO CLICK - CURTIDAS
========================================================= */

btnCurtir.addEventListener("click", function () {

    // Aumenta o contador
    totalCurtidas++;

    // Mostra o novo número
    curtidas.textContent =
        totalCurtidas;

    // Muda o texto do botão
    if (totalCurtidas === 1) {

        btnCurtir.textContent =
            "♥ Curtir novamente";

    } else {

        btnCurtir.textContent =
            "♥ Curtir novamente";
    }

});


/* =========================================================
   EVENTO CLICK - MAIS INFORMAÇÕES
========================================================= */

btnMais.addEventListener("click", function () {

    // Mostra ou esconde o conteúdo
    maisInformacoes.classList.toggle(
        "visivel"
    );

    // Verifica se o conteúdo está aberto
    const aberto =
        maisInformacoes.classList.contains(
            "visivel"
        );

    // Altera o texto do botão
    textoMais.textContent =
        aberto
            ? "Ocultar informações"
            : "Mostrar mais informações";

    // Altera a seta
    setaMais.textContent =
        aberto
            ? "⌃"
            : "⌄";

    // Atualiza o estado de acessibilidade
    btnMais.setAttribute(
        "aria-expanded",
        aberto
    );

});


/* =========================================================
   EVENTO CLICK - CONQUISTAS
========================================================= */

btnConquistas.addEventListener("click", function () {

    // Mostra ou esconde o texto
    textoConquistas.classList.toggle(
        "visivel"
    );

    // Verifica se o conteúdo está aberto
    const aberto =
        textoConquistas.classList.contains(
            "visivel"
        );

    // Altera o texto do botão
    textoBtnConquistas.textContent =
        aberto
            ? "Ocultar informações"
            : "Ver mais sobre as conquistas";

    // Altera a seta
    setaConquistas.textContent =
        aberto
            ? "⌃"
            : "⌄";

    // Atualiza o estado de acessibilidade
    btnConquistas.setAttribute(
        "aria-expanded",
        aberto
    );

});


/* =========================================================
   NAVEGAÇÃO - MENU E BARRA AMARELA
========================================================= */

// Seleciona todos os links do menu.
const linksMenu = document.querySelectorAll(".menu a");

// Seleciona as principais seções relacionadas ao menu.
// Cada seção corresponde a um link do cabeçalho.
const secoesMenu = [
    document.getElementById("hero"),
    document.getElementById("historia"),
    document.getElementById("conquistas")
];


// Função responsável por descobrir em qual parte da página
// o usuário está e colocar a classe "ativo" no link correto.
function atualizarMenu() {

    // Posição atual da tela.
    // O valor do cabeçalho é considerado para que a troca
    // da barra amarela aconteça no momento correto.
    const posicaoAtual =
        window.scrollY + document.querySelector(".cabecalho").offsetHeight + 30;

    // Começamos considerando o primeiro item do menu como ativo.
    let indiceAtivo = 0;

    // Percorre as seções na ordem em que aparecem na página.
    secoesMenu.forEach(function (secao, indice) {

        // Se a posição atual já passou pelo começo da seção,
        // essa seção passa a ser a seção ativa.
        if (secao && posicaoAtual >= secao.offsetTop) {
            indiceAtivo = indice;
        }
    });

    // Remove a classe "ativo" de todos os links.
    linksMenu.forEach(function (link) {
        link.classList.remove("ativo");
    });

    // Adiciona a classe "ativo" somente ao link correspondente
    // à seção em que o usuário está.
    if (linksMenu[indiceAtivo]) {
        linksMenu[indiceAtivo].classList.add("ativo");
    }
}


// Executa a função quando o usuário rolar a página.
window.addEventListener("scroll", atualizarMenu);

// Executa uma vez quando a página é carregada,
// garantindo que o menu comece na posição correta.
window.addEventListener("load", atualizarMenu);


/* =========================================================
   EVENTO MOUSEENTER
========================================================= */

primeiroLink.addEventListener(
    "mouseenter",
    function () {

        // Altera o espaçamento usando JavaScript.
        primeiroLink.style.letterSpacing =
            "1px";

    }
);


/* =========================================================
   EVENTO MOUSELEAVE
========================================================= */

primeiroLink.addEventListener(
    "mouseleave",
    function () {

        // Retorna ao valor original.
        primeiroLink.style.letterSpacing =
            "";

    }
);
