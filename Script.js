document.addEventListener('DOMContentLoaded', function() {
    const botaoEntrar = document.getElementById('entrar');
    const telaInicial = document.querySelector('.tela-inicial');
    const containerPrincipal = document.querySelector('.container.principal');
    const secaoJogos = document.getElementById('jogos');

    if (botaoEntrar && telaInicial && containerPrincipal) {
        botaoEntrar.addEventListener('click', function() {
            telaInicial.classList.add('esconde');
            containerPrincipal.classList.remove('esconde');
        });
    }

    function mostrarJogo(jogoId) {
        document.querySelectorAll('.jogo-area').forEach(area => area.classList.add('esconde'));
        const jogoAtivo = document.getElementById(`jogo-${jogoId}`);
        if (jogoAtivo) {
            jogoAtivo.classList.remove('esconde');
            // Iniciar a lógica específica do jogo ao ser mostrado
            if (jogoId === 'memoria') {
                iniciarJogoMemoria();
            } else if (jogoId === 'animais') {
                iniciarJogoAnimais();
            } else if (jogoId === 'conexao') {
                iniciarJogoConexao();
            }
        }
    }

    // -------------------- JOGO DA MEMÓRIA --------------------
    const tabuleiroMemoria = document.querySelector('#jogo-memoria .tabuleiro');
    const mensagemMemoria = document.getElementById('mensagem-memoria');
    let cartasMemoria = [];
    let cartasViradasMemoria = [];
    let podeVirarMemoria = false;
    let paresEncontradosMemoria = 0;

    function criarCartaMemoria(valor) {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.valor = valor;
        carta.innerHTML = `<div class="frente frente-${valor}"></div><div class="verso"></div>`;
        carta.addEventListener('click', virarCartaMemoria);
        return carta;
    }

    function embaralharMemoria(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function iniciarJogoMemoria() {
        if (!tabuleiroMemoria || !mensagemMemoria) return;
        tabuleiroMemoria.innerHTML = '';
        cartasMemoria = [];
        cartasViradasMemoria = [];
        podeVirarMemoria = false;
        paresEncontradosMemoria = 0;
        mensagemMemoria.textContent = '';

        // Defina os pares de imagens/ícones que você usará
        const valoresMemoria = [
            'milho', 'vaca', 'trator', 'predio', 'onibus', 'rio'
        ];
        const paresMemoria = [...valoresMemoria, ...valoresMemoria];
        embaralharMemoria(paresMemoria);

        paresMemoria.forEach(valor => {
            const carta = criarCartaMemoria(valor);
            tabuleiroMemoria.appendChild(carta);
            // Adicione estilos de fundo para cada valor (você precisará definir isso no CSS)
        });

        // Espera um pouco para garantir que as cartas estejam no DOM antes de permitir virar
        setTimeout(() => {
            podeVirarMemoria = true;
        }, 500);
    }

    function virarCartaMemoria() {
        if (!podeVirarMemoria || cartasViradasMemoria.length === 2 || this.classList.contains('virada')) {
            return;
        }

        this.classList.add('virada');
        cartasViradasMemoria.push(this);

        if (cartasViradasMemoria.length === 2) {
            podeVirarMemoria = false;
            setTimeout(verificarParesMemoria, 1000);
        }
    }

    function verificarParesMemoria() {
        const [carta1, carta2] = cartasViradasMemoria;
        if (carta1.dataset.valor === carta2.dataset.valor) {
            // Pares combinam
            paresEncontradosMemoria++;
            if (paresEncontradosMemoria === cartasMemoria.length / 2) {
                mensagemMemoria.textContent = 'Parabéns! Você encontrou todos os pares!';
            }
            cartasViradasMemoria = [];
            podeVirarMemoria = true;
        } else {
            // Pares não combinam
            carta1.classList.remove('virada');
            carta2.classList.remove('virada');
            cartasViradasMemoria = [];
            podeVirarMemoria = true;
        }
    }

    // -------------------- JOGO DE COMBINE OS ANIMAIS --------------------
    const animaisContainer = document.querySelector('#jogo-animais .animais-container');
    const areasDestino = document.querySelector('#jogo-animais .areas-destino');
    const mensagemAnimais = document.getElementById('mensagem-animais');
    let animais = [
        { nome: 'vaca', tipo: 'campo', imagem: 'vaca.png' },
        { nome: 'cavalo', tipo: 'campo', imagem: 'cavalo.png' },
        { nome: 'galinha', tipo: 'campo', imagem: 'galinha.png' },
        { nome: 'cachorro', tipo: 'cidade', imagem: 'cachorro.png' },
        { nome: 'gato', tipo: 'cidade', imagem: 'gato.png' },
        { nome: 'pombo', tipo: 'cidade', imagem: 'pombo.png' }
        // Adicione mais animais
    ];
    let animaisArrastados = 0;

    function iniciarJogoAnimais() {
        if (!animaisContainer || !areasDestino || !mensagemAnimais) return;
        animaisContainer.innerHTML = '';
        mensagemAnimais.textContent = 'Arraste os animais para o local correto.';
        animaisArrastados = 0;
        embaralharAnimais(animais);
        animais.forEach(animal => {
            const divAnimal = document.createElement('div');
            divAnimal.classList.add('animal');
            divAnimal.dataset.tipo = animal.tipo;
            divAnimal.style.backgroundImage = `url('${animal.imagem}')`;
            divAnimal.draggable = true;
            divAnimal.addEventListener('dragstart', drag);
            animaisContainer.appendChild(divAnimal);
        });

        const areas = areasDestino.querySelectorAll('.area-campo, .area-cidade');
        areas.forEach(area => {
            area.addEventListener('dragover', allowDrop);
            area.addEventListener('drop', dropAnimal);
        });
    }

    function embaralharAnimais(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    let animalArrastado = null;

    function drag(ev) {
        animalArrastado = ev.target;
        ev.dataTransfer.setData("text", ev.target.dataset.tipo);
    }

    function dropAnimal(ev) {
        ev.preventDefault();
        const tipoArrastado = ev.dataTransfer.getData("text");
        const tipoDestino = this.dataset.tipo;
        if (tipoArrastado === tipoDestino) {
            this.appendChild(animalArrastado);
            animalArrastado.draggable = false;
            animalArrastado = null;
            animaisArrastados++;
            if (animaisArrastados === animais.length) {
                mensagemAnimais.textContent = 'Parabéns! Você colocou todos os animais nos seus lugares!';
            }
        } else {
            mensagemAnimais.textContent = 'Ops! Este animal não pertence aqui.';
            setTimeout(() => {
                mensagemAnimais.textContent = 'Arraste os animais para o local correto.';
            }, 2000);
        }
    }

    // -------------------- JOGO DA CONEXÃO CAMPO-CIDADE --------------------
    const elementosConexaoContainer = document.querySelector('#jogo-conexao .elementos-conexao');
    const mensagemConexao = document.getElementById('mensagem-conexao');
    let elementosConexao = [
        { campo: 'Plantação de Milho', cidade: 'Farinha de Milho', conectado: false },
        { campo: 'Vaca Leiteira', cidade: 'Leite', conectado: false },
        { campo: 'Trator', cidade: 'Indústria de Máquinas', conectado: false },
        { campo: 'Horta', cidade: 'Feira Livre', conectado: false },
        { campo: 'Ar Puro', cidade: 'Parque Urbano', conectado: false }
        // Adicione mais conexões
    ];
    let primeiraSelecaoConexao = null;
    let paresConectados = 0;

    function iniciarJogoConexao() {
        if (!elementosConexaoContainer || !mensagemConexao) return;
        elementosConexaoContainer.innerHTML = '';
        mensagemConexao.textContent = 'Clique em um elemento do campo e depois em seu correspondente na cidade.';
        primeiraSelecaoConexao = null;
        paresConectados = 0;
        embaralharConexao(elementosConexao);

        elementosConexao.forEach(conexao => {
            const divCampo = document.createElement('div');
            divCampo.classList.add('elemento-conexao', 'campo');
            divCampo.textContent = conexao.campo;
            divCampo.dataset.par = conexao.cidade;
            divCampo.addEventListener('click', selecionarElementoConexao);

            const divCidade = document.createElement('div');
            divCidade.classList.add('elemento-conexao', 'cidade');
            divCidade.textContent = conexao.cidade;
            divCidade.dataset.par = conexao.campo;
            divCidade.addEventListener('click', selecionarElementoConexao);

            elementosConexaoContainer.appendChild(divCampo);
            elementosConexaoContainer.appendChild(divCidade);
        });
    }

    function embaralharConexao(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function selecionarElementoConexao() {
        if (this.classList.contains('conectado')) return;

        this.classList.add('selecionado');

        if (!primeiraSelecaoConexao) {
            primeiraSelecaoConexao = this;
        } else {
            if (this.dataset.par === primeiraSelecaoConexao.textContent) {
                this.classList.add('conectado');
                primeiraSelecaoConexao.classList.add('conectado');
                paresConectados++;
                if (paresConectados === elementosConexao.length) {
                    mensagemConexao.textContent = 'Excelente! Todas as conexões foram encontradas!';
                }
            } else {
                setTimeout(() => {
                    this.classList.remove('selecionado');
                    primeiraSelecaoConexao.classList.remove('selecionado');
                }, 1000);
            }
            primeiraSelecaoConexao = null;
        }
    }
});
