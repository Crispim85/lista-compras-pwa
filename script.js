const CACHE_NAME = "lista-compras-cache-v2"; // atualize a versão aqui se quiser forçar o update
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instala e adiciona ao cache
self.addEventListener("install", (event) => {
  self.skipWaiting(); // força instalação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa o novo service worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  clients.claim(); // ativa imediatamente
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

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
  const inputNome = document.getElementById("itemInput");
  const inputLink = document.getElementById("itemLink");
  const nome = inputNome.value.trim();
  const link = inputLink.value.trim();

  if (nome === "") return;

  const novoItem = { nome, link, comprado: false };
  listaCompras.push(novoItem);
  salvarLista();
  atualizarLista();

  inputNome.value = '';
  inputLink.value = '';
}

function atualizarLista() {
  const ul = document.getElementById('lista');
  ul.innerHTML = "";

  listaCompras.forEach((item, index) => {
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
    li.appendChild(nomeItem);
    li.appendChild(botoes);
    ul.appendChild(li);
  });
}

document.getElementById('itemInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') adicionarItem();
});

// Registro do service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function (reg) {
    console.log("Service Worker registrado:", reg.scope);
  }).catch(function (err) {
    console.log("Erro ao registrar Service Worker:", err);
  });
}