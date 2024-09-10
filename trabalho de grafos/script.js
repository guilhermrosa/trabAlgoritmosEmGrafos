let grafo = {
    nos: [],
    arestas: [],
    tipo: 'direcional-nao-ponderado'
};

function numeroDeNos() {
    const grafoTipo = document.getElementById('tipo').value;
    grafo.tipo = grafoTipo;
    const numNos = document.getElementById('qtd-nos').value;
    const divNomeNos = document.getElementById('div-campos-nomes');
    divNomeNos.innerHTML = '';

    for (let i = 0; i < numNos; i++) {
        const inputNo = document.createElement('input');
        inputNo.tipo = 'text';
        inputNo.placeholder = `Nome do Nó ${i + 1}`;
        inputNo.id = `no-${i}`;
        divNomeNos.appendChild(inputNo);
    }

    document.getElementById('div-nos').style.display = 'none';
    document.getElementById('div-nomes').style.display = 'block';
}

function salvarNomes() {
    const numNos = document.getElementById('qtd-nos').value;
    const nos = [];

    for (let i = 0; i < numNos; i++) {
        const nomeNo = document.getElementById(`no-${i}`).value;
        if (nomeNo && !nos.includes(nomeNo)) {
            nos.push(nomeNo);
        }
    }

    grafo.nos = nos;

    selecionaTipo();

    document.getElementById('div-nomes').style.display = 'none';
    document.getElementById('div-arestas').style.display = 'block';

    mostraPeso();

    if (grafo.tipo === 'direcional-nao-ponderado') {
        document.getElementById('botao-ordena-topologica').style.display = 'inline';
        document.getElementById('botao-fortemente-conectado').style.display = 'inline';
    }
}

function selecionaTipo() {
    const noOrigem = document.getElementById('origem');
    const noDestino = document.getElementById('destino');

    noOrigem.innerHTML = '';
    noDestino.innerHTML = '';

    grafo.nos.forEach(no => {
        const opcaoOrigem = document.createElement('option');
        opcaoOrigem.value = no;
        opcaoOrigem.textContent = no;
        noOrigem.appendChild(opcaoOrigem);

        const opcaoDestino = document.createElement('option');
        opcaoDestino.value = no;
        opcaoDestino.textContent = no;
        noDestino.appendChild(opcaoDestino);
    });
}

function mostraPeso() {
    const divPeso = document.getElementById('div-peso');
    if (grafo.tipo === 'nao-direcional-ponderado') {
        divPeso.style.display = 'inline';
    } else {
        divPeso.style.display = 'none';
    }
}

function addAresta() {
    const noOrigem = document.getElementById('origem').value;
    const noDestino = document.getElementById('destino').value;
    const peso = grafo.tipo === 'nao-direcional-ponderado' ? document.getElementById('peso').value : null;

    if (noOrigem && noDestino) {
        if (grafo.tipo === 'nao-direcional-ponderado') {
            let atualizaAresta = false;

            grafo.arestas.forEach(aresta => {
                if ((aresta.orig === noOrigem && aresta.dest === noDestino) ||
                    (aresta.orig === noDestino && aresta.dest === noOrigem)) {
                    if (aresta.peso !== peso) {
                        aresta.peso = peso;
                        atualizaAresta = true;
                    }
                }
            });

            if (!atualizaAresta) {
                const aresta = { orig: noOrigem, dest:noDestino, peso: peso };
                grafo.arestas.push(aresta);
                console.log(`Aresta adicionada: ${noOrigem} - ${noDestino} (Peso: ${peso})`);
            }
        } else {
            const arestaExistente = grafo.arestas.some(aresta => aresta.orig === noOrigem && aresta.dest === noDestino);
            
            if (!arestaExistente) {
                const aresta = { orig: noOrigem, dest:noDestino };
                grafo.arestas.push(aresta);
                console.log(`Aresta adicionada: ${noOrigem} -> ${noDestino}`);
            } else {
                console.log(`Aresta já existe: ${noOrigem} -> ${noDestino}`);
            }
        }
    }
}

function imprimir() {
    const exibirGrafo = document.getElementById('exibe-grafo');
    exibirGrafo.innerHTML = '';

    if (grafo.nos.length === 0) {
        exibirGrafo.textContent = 'O grafo está vazio.';
        return;
    }

    grafo.nos.forEach(no => {
        let arestasNo = [];

        if (grafo.tipo === 'nao-direcional-ponderado') {
            grafo.arestas
                .filter(aresta => aresta.orig === no || aresta.dest === no)
                .forEach(aresta => {
                    if (aresta.orig === no && !arestasNo.some(e => e.dest === aresta.dest && e.peso === aresta.peso)) {
                        arestasNo.push({ dest:aresta.dest, peso: aresta.peso });
                    } else if (aresta.dest === no && !arestasNo.some(e => e.dest === aresta.orig && e.peso === aresta.peso)) {
                        arestasNo.push({ dest:aresta.orig, peso: aresta.peso });
                    }
                });
        } else {
            arestasNo = grafo.arestas
                .filter(aresta => aresta.orig === no)
                .map(aresta => `( -> ${aresta.dest} )`);
        }

        const saida = document.createElement('div');
        if (grafo.tipo === 'nao-direcional-ponderado') {
            saida.textContent = `${no} ${arestasNo.map(aresta => `( ${aresta.dest}: ${aresta.peso} )`).join(' ')}`;
        } else {
            saida.textContent = `${no} ${arestasNo.join(' ')}`;
        }
        exibirGrafo.appendChild(saida);
    });

    exibirGrafo.style.display = 'block';
}

function limpar() {
    grafo.nos = [];
    grafo.arestas = [];
    console.log('Grafo limpo');

    document.getElementById('origem').innerHTML = '';
    document.getElementById('destino').innerHTML = '';

    document.getElementById('div-nos').style.display = 'block';
    document.getElementById('div-nomes').style.display = 'none';
    document.getElementById('div-arestas').style.display = 'none';
    document.getElementById('exibe-grafo').innerHTML = '';

    document.getElementById('botao-ordena-topologica').style.display = 'none';
    document.getElementById('div-ordena-topo').style.display = 'none';
}

function mostrarOrdenacaoTopologica() {
    const div = document.getElementById('div-ordena-topo');
    const noOrdenacao = document.getElementById('no-ordena-topo');
    noOrdenacao.innerHTML = '';

    grafo.nos.forEach(no => {
        const opcao = document.createElement('option');
        opcao.value = no;
        opcao.textContent = no;
        noOrdenacao.appendChild(opcao);
    });

    div.style.display = 'flex';
}

function ordenacaoTopologica() {
    const noEscolhido = document.getElementById('no-ordena-topo').value;
    if (noEscolhido) {
        const listaAdjacente = criarLista();
        const res = ordenaTopo(listaAdjacente, noEscolhido);

        const exibirGrafo = document.getElementById('exibe-grafo');
        exibirGrafo.innerHTML = '';

        const saidaOrdem = document.createElement('div');
        saidaOrdem.textContent = `Ordenação topológica do grafo:\n${res.ordem.join(' -> ')}`;
        exibirGrafo.appendChild(saidaOrdem);

        const saidaDesc = document.createElement('div');
        saidaDesc.textContent = `• A ordem de descoberta e finalização de cada nó do grafo:\n` +
            res.temposDeDescoberta.map(no => `${no.nome} (${no.discovery}/${no.finishing})`).join(', ');
        exibirGrafo.appendChild(saidaDesc);

        exibirGrafo.style.display = 'block';
    }
}

function ordenaTopo(listaAdjacente, noInicial) {
    const visitado = new Set();
    const pilha = [];
    const temposDeDescoberta = {};
    const temposDeFinalizacao = {};
    let tempo = 0;

    function buscaProf(no) {
        if (visitado.has(no)) return;
        visitado.add(no);
        tempo++;
        temposDeDescoberta[no] = tempo;

        const vizinhos = listaAdjacente[no].sort();
        vizinhos.forEach(vizinho => buscaProf(vizinho));

        tempo++;
        temposDeFinalizacao[no] = tempo;
        pilha.push(no);
    }

    buscaProf(noInicial);

    Object.keys(listaAdjacente).forEach(no => {
        if (!visitado.has(no)) {
            buscaProf(no);
        }
    });

    const ordem = pilha.reverse();

    const odermDeDescoberta = Object.keys(listaAdjacente).map(no => ({
        nome: no,
        discovery: temposDeDescoberta[no] || 0,
        finishing: temposDeFinalizacao[no] || 0
    }));

    return {
        ordem,
        temposDeDescoberta: odermDeDescoberta
    };
}

function criarLista() {
    const listaAdjacente = {};
    grafo.nos.forEach(no => {
        listaAdjacente[no] = [];
    });

    grafo.arestas.forEach(aresta => {
        listaAdjacente[aresta.orig].push(aresta.dest);
    });

    return listaAdjacente;
}

