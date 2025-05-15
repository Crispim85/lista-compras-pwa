let listasPorCategoria = {};
    let categoriaAtual = "Padrão";

    window.onload = function () {
      const dadosSalvos = localStorage.getItem('listasPorCategoria');
      if (dadosSalvos) {
        listasPorCategoria = JSON.parse(dadosSalvos);
      } else {
        listasPorCategoria = { Padrão: [] };
      }
      atualizarCategoriaSelect(categoriaAtual);
    };

    function salvarListas() {
      localStorage.setItem('listasPorCategoria', JSON.stringify(listasPorCategoria));
    }

    function adicionarItem() {
      const inputNome = document.getElementById("itemInput");
      const inputLink = document.getElementById("itemLink");
      const nome = inputNome.value.trim();
      const link = inputLink.value.trim();

      if (nome === "") return;

      const novoItem = { nome, link, comprado: false };
      listasPorCategoria[categoriaAtual].push(novoItem);
      salvarListas();
      atualizarLista();

      inputNome.value = '';
      inputLink.value = '';
    }

    function atualizarLista() {
      const ul = document.getElementById('lista');
      ul.innerHTML = "";
      const lista = listasPorCategoria[categoriaAtual] || [];

      lista.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = item.comprado ? 'checked' : '';

        const nomeItem = document.createElement('span');
        if (item.link) {
          nomeItem.innerHTML = `<a href="${item.link}" target="_blank">${item.nome}</a>`;
        } else {
          nomeItem.textContent = item.nome;
        }

        const botoes = document.createElement('div');
        botoes.className = 'btns';

        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✔';
        checkBtn.className = 'check-btn';
        checkBtn.onclick = () => {
          listasPorCategoria[categoriaAtual][index].comprado = !listasPorCategoria[categoriaAtual][index].comprado;
          salvarListas();
          atualizarLista();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
          listasPorCategoria[categoriaAtual].splice(index, 1);
          salvarListas();
          atualizarLista();
        };

        botoes.appendChild(checkBtn);
        botoes.appendChild(deleteBtn);
        li.appendChild(nomeItem);
        li.appendChild(botoes);
        ul.appendChild(li);
      });
    }

    function atualizarCategoriaSelect(selecionar = null) {
      const select = document.getElementById("categoriaSelect");
      select.innerHTML = "";

      for (const categoria in listasPorCategoria) {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        if (categoria === selecionar) {
          option.selected = true;
          categoriaAtual = categoria;
        }
        select.appendChild(option);
      }

      const nova = document.createElement("option");
      nova.value = "nova";
      nova.textContent = "+ Nova Categoria...";
      select.appendChild(nova);

      atualizarLista();
    }

    function trocarCategoria() {
      const select = document.getElementById("categoriaSelect");
      const novaCategoria = select.value;

      if (novaCategoria === "nova") {
        const nomeNova = prompt("Digite o nome da nova categoria:");
        if (nomeNova && !listasPorCategoria[nomeNova]) {
          listasPorCategoria[nomeNova] = [];
          salvarListas();
          atualizarCategoriaSelect(nomeNova);
        } else {
          atualizarCategoriaSelect(categoriaAtual);
        }
        return;
      }

      categoriaAtual = novaCategoria;
      atualizarLista();
    }

    function sortearItem() {
      const lista = listasPorCategoria[categoriaAtual] || [];
      const itensNaoComprados = lista.filter(item => !item.comprado);

      const resultado = document.getElementById("itemSorteado");

      if (itensNaoComprados.length === 0) {
        resultado.innerText = "Todos os itens já foram comprados!";
        return;
      }

      const indexSorteado = Math.floor(Math.random() * itensNaoComprados.length);
      const itemSorteado = itensNaoComprados[indexSorteado];

      resultado.innerText = `Item sorteado: ${itemSorteado.nome}`;
    }

    document.getElementById('itemInput').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') adicionarItem();
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        console.log("Service Worker registrado:", reg.scope);
      }).catch(function (err) {
        console.log("Erro ao registrar Service Worker:", err);
      });
    }