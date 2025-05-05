let listaCompras = [];

    window.onload = function () {
      const dadosSalvos = localStorage.getItem('listaCompras');
      if (dadosSalvos) {
        listaCompras = JSON.parse(dadosSalvos);
        atualizarLista();
      }
    };

    function salvarLista() {
      localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
    }

    function adicionarItem() {
      const input = document.getElementById('itemInput');
      const texto = input.value.trim();
      if (texto === "") return;

      listaCompras.push({ texto, comprado: false });
      salvarLista();
      atualizarLista();
      input.value = '';
    }

    function atualizarLista() {
      const ul = document.getElementById('lista');
      ul.innerHTML = "";

      listaCompras.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = item.comprado ? 'checked' : '';

        const span = document.createElement('span');
        span.textContent = item.texto;

        const botoes = document.createElement('div');
        botoes.className = 'btns';

        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✔';
        checkBtn.className = 'check-btn';
        checkBtn.onclick = () => {
          listaCompras[index].comprado = !listaCompras[index].comprado;
          salvarLista();
          atualizarLista();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
          listaCompras.splice(index, 1);
          salvarLista();
          atualizarLista();
        };

        botoes.appendChild(checkBtn);
        botoes.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(botoes);
        ul.appendChild(li);
      });
    }

    document.getElementById('itemInput').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') adicionarItem();
    });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
      console.log("Service Worker registrado:", reg.scope);
    }).catch(function(err) {
      console.log("Erro ao registrar Service Worker:", err);
    });
  }