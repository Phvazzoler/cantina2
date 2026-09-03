const API_CARDAPIO = "/api/cardapio";
const API_PEDIDOS = "/api/pedidos";

const gradeProdutos = document.querySelector("#grade-produtos");
const filtros = document.querySelector("#filtros");
const formulario = document.querySelector("#form-pedido");
const quantidade = document.querySelector("#quantidade");
const modal = document.querySelector("#modal-cupom");
const toast = document.querySelector("#toast");

let produtos = [];
let produtoSelecionado = null;
let descontoHoje = 0;
let categoriaAtual = "Todos";
let temporizadorToast;

async function carregarCardapio() {
    try {
        const resposta = await fetch(API_CARDAPIO);
        const dados = await lerResposta(resposta);

        produtos = dados.produtos;
        descontoHoje = dados.descontoHoje;

        document.querySelector("#desconto-hero").textContent =
            `${formatarNumero(descontoHoje)}%`;

        criarFiltros();
        renderizarProdutos();
        atualizarPrevia();
    } catch (erro) {
        gradeProdutos.innerHTML = `
            <div class="estado erro">${escapar(erro.message)}</div>
        `;
        mostrarToast(erro.message, true);
    }
}

function criarFiltros() {
    const categorias = [...new Set(produtos.map(produto => produto.categoria))];

    filtros.innerHTML = ["Todos", ...categorias].map(categoria => `
        <button class="filtro ${categoria === categoriaAtual ? "ativo" : ""}"
                data-categoria="${escapar(categoria)}" type="button">
            ${escapar(categoria)}
        </button>
    `).join("");
}

function renderizarProdutos() {
    const produtosFiltrados = categoriaAtual === "Todos"
        ? produtos
        : produtos.filter(produto => produto.categoria === categoriaAtual);

    if (produtosFiltrados.length === 0) {
        gradeProdutos.innerHTML = `
            <div class="estado">Nenhum produto disponível nesta categoria.</div>
        `;
        return;
    }

    gradeProdutos.innerHTML = produtosFiltrados.map(produto => `
        <article class="produto-card ${produtoSelecionado?.id === produto.id ? "selecionado" : ""}"
                 data-card-id="${produto.id}">
            <div class="produto-topo">
                <span class="produto-emoji">${escapar(produto.emoji)}</span>
                <span class="categoria">${escapar(produto.categoria)}</span>
            </div>
            <h3>${escapar(produto.nome)}</h3>
            <p>${escapar(produto.descricao)}</p>
            <div class="produto-rodape">
                <span class="produto-preco">${formatarMoeda(produto.preco)}</span>
                <button class="escolher" data-produto-id="${produto.id}" type="button">
                    Escolher
                </button>
            </div>
        </article>
    `).join("");
}

function escolherProduto(id) {
    produtoSelecionado = produtos.find(produto => produto.id === id);

    if (!produtoSelecionado) {
        mostrarToast("Produto não encontrado.", true);
        return;
    }

    document.querySelector("#produto-id").value = produtoSelecionado.id;
    document.querySelector("#produto-escolhido").innerHTML = `
        <span>${escapar(produtoSelecionado.emoji)}</span>
        <div>
            <strong>${escapar(produtoSelecionado.nome)}</strong>
            <small>${formatarMoeda(produtoSelecionado.preco)} por unidade</small>
        </div>
    `;

    renderizarProdutos();
    atualizarPrevia();
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth" });
}

function atualizarPrevia() {
    if (!produtoSelecionado) {
        document.querySelector("#previa-total").textContent = "R$ 0,00";
        return;
    }

    const qtd = Number(quantidade.value) || 1;
    const original = produtoSelecionado.preco * qtd;
    const total = original - (original * descontoHoje / 100);

    document.querySelector("#previa-total").textContent = formatarMoeda(total);
}

async function enviarPedido(evento) {
    evento.preventDefault();

    if (!produtoSelecionado) {
        mostrarToast("Escolha um produto antes de gerar o pedido.", true);
        document.querySelector("#cardapio").scrollIntoView();
        return;
    }

    const botao = formulario.querySelector("button[type='submit']");
    const dados = new FormData(formulario);
    const pedido = {
        nomeAluno: dados.get("nomeAluno").trim(),
        matricula: dados.get("matricula").trim(),
        periodo: dados.get("periodo"),
        produtoId: Number(dados.get("produtoId")),
        quantidade: Number(dados.get("quantidade"))
    };

    botao.disabled = true;
    botao.textContent = "Salvando pedido...";

    try {
        const resposta = await fetch(API_PEDIDOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        const pedidoSalvo = await lerResposta(resposta);
        mostrarCupom(pedidoSalvo);
    } catch (erro) {
        mostrarToast(erro.message, true);
    } finally {
        botao.disabled = false;
        botao.textContent = "Gerar código do pedido";
    }
}

function mostrarCupom(pedido) {
    const valorDesconto = pedido.valorOriginal - pedido.valorFinal;

    document.querySelector("#resultado-codigo").textContent = pedido.codigo;
    document.querySelector("#resultado-produto").textContent = pedido.produtoNome;
    document.querySelector("#resultado-quantidade").textContent = pedido.quantidade;
    document.querySelector("#resultado-original").textContent =
        formatarMoeda(pedido.valorOriginal);
    document.querySelector("#resultado-desconto").textContent =
        `- ${formatarMoeda(valorDesconto)} (${formatarNumero(pedido.percentualDesconto)}%)`;
    document.querySelector("#resultado-total").textContent =
        formatarMoeda(pedido.valorFinal);

    modal.showModal();
}

function limparPedido() {
    modal.close();
    formulario.reset();
    quantidade.value = 1;
    produtoSelecionado = null;
    document.querySelector("#produto-id").value = "";
    document.querySelector("#produto-escolhido").innerHTML = `
        <span class="produto-vazio-icone">👆</span>
        <div>
            <strong>Nenhum produto escolhido</strong>
            <small>Clique em “Escolher” no cardápio.</small>
        </div>
    `;
    renderizarProdutos();
    atualizarPrevia();
    document.querySelector("#cardapio").scrollIntoView();
}

async function lerResposta(resposta) {
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "A operação não pôde ser concluída.");
    }

    return dados;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

function formatarNumero(valor) {
    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2
    }).format(valor);
}

function mostrarToast(mensagem, erro = false) {
    clearTimeout(temporizadorToast);
    toast.textContent = mensagem;
    toast.classList.toggle("erro", erro);
    toast.classList.add("visivel");

    temporizadorToast = setTimeout(() => {
        toast.classList.remove("visivel");
    }, 3200);
}

function escapar(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

filtros.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-categoria]");
    if (!botao) return;

    categoriaAtual = botao.dataset.categoria;
    criarFiltros();
    renderizarProdutos();
});

gradeProdutos.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-produto-id]");
    if (botao) escolherProduto(Number(botao.dataset.produtoId));
});

quantidade.addEventListener("input", atualizarPrevia);
formulario.addEventListener("submit", enviarPedido);
document.querySelector("#fechar-modal").addEventListener("click", () => modal.close());
document.querySelector("#novo-pedido").addEventListener("click", limparPedido);

modal.addEventListener("click", evento => {
    if (evento.target === modal) modal.close();
});

carregarCardapio();