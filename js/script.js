// menu hamburguer no menu de navegação
document.addEventListener("DOMContentLoaded", () => {
    const navbarNav = document.getElementById("navbarNav"); // Menu colapsável
    const navbarToggler = document.querySelector(".navbar-toggler"); // Botão de menu
  
    // Fecha o menu ao clicar em um item de navegação
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
        // Verifica se o menu está aberto, e se estiver, simula o clique para fechar
            if (navbarNav.classList.contains("show")) {
                navbarToggler.click();
            }
        });
    });
  
    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (event) => {
    // Se o clique foi fora do menu e do botão de navegação, fecha o menu
        if (!navbarNav.contains(event.target) && !navbarToggler.contains(event.target)) {
            if (navbarNav.classList.contains("show")) {
                navbarToggler.click();
            }
        }
    });
      
    // Impede o comportamento padrão do Bootstrap, utilizando os métodos diretamente
    navbarToggler.addEventListener("click", (event) => {
        // Impede o Bootstrap de alternar a classe diretamente
        event.stopPropagation();
    });
}); 

// Contagem regressiva
function startCountdown(targetDate) {
    const countdownElement = document.getElementById('countdown');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            countdownElement.innerHTML = "<h3>Chegou o grande dia!</h3>";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        daysSpan.textContent = days;
        hoursSpan.textContent = hours;
        minutesSpan.textContent = minutes;
        secondsSpan.textContent = seconds;
    }

    updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
}

// Data da festa: substitua pelo dia e horário do evento
const targetDate = new Date('2025-05-03T20:00:00');
startCountdown(targetDate);


// Confirmação de presença
const scriptURL = 'https://script.google.com/macros/s/AKfycbxPtsIRbYFOfx75Xr_uLdANq6WFRY01e9guVqocN4docPvjSgvv_nr1sRc5LJYYtJkYGw/exec';
    
async function searchName() {
    const name = document.getElementById('name').value.trim();
    
    if (!name) {
        alert('Por favor, digite um nome!');
        return;
    }
  
    try {
    // Fazer requisição GET sem cabeçalhos CORS
        const response = await fetch(`${scriptURL}?name=${encodeURIComponent(name)}`);
        const result = await response.json();

        const statusElement = document.getElementById('status'); // Captura o elemento da mensagem

        if (result.error || !result.name) {
            statusElement.textContent = 'Nome não encontrado. Verifique e tente novamente!';
            document.getElementById('update-form').style.display = 'none'; // Esconde o formulário
            return;
        }
  
        // Preenche os campos do formulário com os dados encontrados
        document.getElementById('name-display').textContent = result.name;
        document.getElementById('type-display').textContent = result.type;
        document.getElementById('email').value = result.email;
        document.getElementById('presence').value = result.presence;
        document.getElementById('restrictions').value = result.restrictions; // Nova coluna
        document.getElementById('observations').value = result.observations;
  
        // Armazena o índice da linha no elemento data-row-index
        document.getElementById('name-display').dataset.rowIndex = result.rowIndex;
  
        // Exibe o formulário
        document.getElementById('update-form').style.display = 'block';

        // Limpa mensagens anteriores
        statusElement.textContent = '';
    } catch (error) {
        document.getElementById('status').textContent = 'Erro ao buscar os dados. Tente novamente mais tarde!';
    }
}
  
async function updateData() {
    const email = document.getElementById('email').value;
    const presence = document.getElementById('presence').value;
    const restrictions = document.getElementById('restrictions').value;
    const observations = document.getElementById('observations').value;
      
    const nameDisplay = document.getElementById('name-display');
    const rowIndex = nameDisplay.dataset.rowIndex;
      
    if (!rowIndex) {
        alert('Nenhum registro encontrado para atualizar!');
        return;
    }
      
    try {
        const response = await fetch(scriptURL, {
        method: 'POST',
        redirect: 'follow', // Adicionado para lidar com redirecionamentos
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Alterado para evitar preflight
        },
        body: JSON.stringify({
            rowIndex: parseInt(rowIndex, 10),
            email,
            presence,
            restrictions,
            observations,
        }),
    });
      
    const result = await response.json();
        if (result.success) {

            // Exibir mensagem de sucesso
            document.getElementById('status').textContent = 'Sua presença está confirmada!';
            // Esconder o botão "Atualizar"
            document.querySelector('.botao-atualizar').style.display = 'none';
            document.querySelector('.botao-cancelar').style.display = 'none';
            // Mostrar o botão "OK"
            document.getElementById('ok-button-container').style.display = 'block';
        } else {
            document.getElementById('status').textContent = result.error || 'Erro ao atualizar os dados.';
        }
    } catch (error) {
        document.getElementById('status').textContent = 'Erro ao atualizar os dados: ' + error.message;
    }
}

function cancelForm() {
    document.getElementById('update-form').style.display = 'none'; // Esconde o formulário    
    document.getElementById('name').value = '';  // Limpa o campo de nome (input)
    document.getElementById('status').textContent = ''; // Limpa o status
}

function closeForm() {
    // Esconder o formulário de atualização
    document.getElementById('update-form').style.display = 'none';
    // Esconder a mensagem de status
    document.getElementById('status').textContent = '';
    // Esconder o botão OK
    document.getElementById('ok-button-container').style.display = 'none';
    // Exibir o botão de busca novamente
    document.querySelector('.botao-busca').style.display = 'block';
}

function disableSearchButtonAfterDate(date) {
    const searchButton = document.querySelector('.botao-busca button');
    const currentDate = new Date();

    // Converter a data fornecida para o formato Date
    const specifiedDate = new Date(date);

    if (currentDate > specifiedDate) {
        searchButton.disabled = true;
        searchButton.style.backgroundColor = '#ccc'; // Opcional: estilo para mostrar que está desabilitado
        searchButton.style.cursor = 'not-allowed'; // Para evitar que o usuário clique
    }
}

// Exemplo de como chamar a função (data após 01 de Janeiro de 2025)
disableSearchButtonAfterDate('2025-04-10');

      
// Função para abrir a modal com detalhes do presente
async function openModal(presentId) {
    console.log("Abrindo modal para o presentId:", presentId);
    
    try {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbyYah6cxzWgEEx9OJufodylEInPGkd6EXY7ikW4U7U1tnX5ZOHwrBjQayFhbTrhWI0q/exec?presentId=${presentId}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }

        // Atualizar os detalhes do presente na modal
        document.getElementById('giftDetails').innerHTML = `Você selecionou:<br><strong>${data.presentName}</strong>.<br>Confirmar escolha?`;
        document.getElementById('confirmGift').setAttribute('data-presentId', presentId);
        
        // Exibir a modal
        document.getElementById('giftModal').style.display = 'flex';
        
    } catch (error) {
        alert('Erro ao buscar os dados: ' + error.message);
    }
}

// Mostrar campo para o nome
function showNameInput() {
    document.getElementById('modalActions').style.display = 'none';
    document.getElementById('nameInputSection').style.display = 'block';
}

function cancelNameInput() {
    document.getElementById('nameInputSection').style.display = 'none';
    document.getElementById('modalActions').style.display = 'block';
}

// Função para confirmar o presente
async function confirmGift() {
    const presentId = document.getElementById('confirmGift').getAttribute('data-presentId');
    const giftName = document.getElementById('giftName').value.trim();
    
    if (!giftName) {
        alert('Por favor, digite seu nome.');
        return;
    }

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyYah6cxzWgEEx9OJufodylEInPGkd6EXY7ikW4U7U1tnX5ZOHwrBjQayFhbTrhWI0q/exec', {
            redirect: "follow",
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Ajustado para evitar preflight
            body: JSON.stringify({ presentId, gifted: giftName })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Exibir mensagem final
            document.getElementById('giftDetails').style.display = 'none';
            document.getElementById('nameInputSection').style.display = 'none';
            document.getElementById('thankYouMessage').innerHTML = `
                <strong>Obrigado, ${giftName}!</strong><br>
                Você adquiriu: ${data.presentName}
                <button class="btn btn-primary gift-modal-button-close" onclick="closeModal()">OK</button>
            `;

            thankYouMessage.style.display = 'flex !important';

            document.getElementById('thankYouMessage').style.display = 'block';
            document.querySelector('.gift-modal-button-close').style.display = 'block';

            // Desabilitar item na lista
            const presentBox = document.querySelector(`#${presentId}`).closest('.present-box');
            presentBox.classList.add('disabled');
            presentBox.querySelector('.checkbox-container').innerHTML = '<span>Presente adquirido</span>';
            
        } else {
            alert('Erro ao confirmar o presente: ' + data.error);
        }
    } catch (error) {
        alert('Erro ao processar a confirmação: ' + error.message);
    }
}

// Função para ocultar o presente após confirmação
function hidePresent(id) {
    var checkbox = document.getElementById(id);
    var presentBox = checkbox.closest('.present-box'); // Encontra o contêiner do presente

    if (checkbox.checked) {
        presentBox.style.display = 'none'; // Oculta toda a div
    }
}

// Função para fechar a modal e desmarcar o checkbox
function cancelGift(presentId) {
    document.getElementById('giftModal').style.display = 'none';
    document.getElementById('modalActions').style.display = 'block';
    document.getElementById('nameInputSection').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'none';
    document.getElementById('giftName').value = '';

    // Desmarcar o checkbox associado ao presentId
    if (presentId) {
        const checkbox = document.getElementById(presentId);
        if (checkbox) {
            checkbox.checked = false; // Desmarcar o checkbox
        }
    }
}


// Função para fechar a modal
function closeModal() {
    document.getElementById('giftModal').style.display = 'none';
    document.getElementById('modalActions').style.display = 'block';
    document.getElementById('nameInputSection').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'none';
    document.getElementById('giftName').value = '';

    // Recarregar a página após 10 segundos
    setTimeout(function() {
        location.reload(); // Recarrega a página
    }, 10000); // 10000ms = 10 segundos
}

document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".checkbox-container input[type='checkbox']");
    
    checkboxes.forEach((checkbox) => {
        const presentId = checkbox.id; // O ID do checkbox é o mesmo do presentId
        
        fetch(`https://script.google.com/macros/s/AKfycbyYah6cxzWgEEx9OJufodylEInPGkd6EXY7ikW4U7U1tnX5ZOHwrBjQayFhbTrhWI0q/exec?presentId=${presentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.gifted && data.gifted.trim() !== "") {
                // Encontra a div do presente
                const presentBox = checkbox.closest('.present-box');
                
                if (presentBox) {
                    presentBox.style.display = 'none'; // Oculta toda a div do presente
                }
            }
        })
        .catch(error => console.error(`Erro ao carregar status do presente ${presentId}:`, error));
    });
});

// Botão mostrar mais presentes

document.addEventListener("DOMContentLoaded", function () {
    const itemsPerBatch = 18; // Mostra de 3 em 3 linhas (cada linha tem 6)
    const presentBoxes = document.querySelectorAll(".present-box");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    // Esconde todos os itens extras
    presentBoxes.forEach((box, index) => {
        if (index >= itemsPerBatch) {
            box.style.display = "none";
        }
    });

    let visibleCount = itemsPerBatch;

    loadMoreBtn.addEventListener("click", function () {
        // Exibe mais 18 itens
        for (let i = visibleCount; i < visibleCount + itemsPerBatch; i++) {
            if (presentBoxes[i]) {
                presentBoxes[i].style.display = "block";
            }
        }

        visibleCount += itemsPerBatch;

        // Se todos os itens já foram exibidos, esconde o botão
        if (visibleCount >= presentBoxes.length) {
            loadMoreBtn.style.display = "none";
        }
    });
});

// Fotos da festa

document.addEventListener("DOMContentLoaded", function () {
    const fotos = document.querySelectorAll(".foto-item");
    const modal = new bootstrap.Modal(document.getElementById("fotoModal"));
    const carouselInner = document.querySelector("#carouselFotos .carousel-inner");
    const carouselElement = document.getElementById("carouselFotos");
    let currentIndex = 0;

    fotos.forEach((foto, index) => {
        foto.addEventListener("click", function () {
            currentIndex = index;
            abrirCarrossel();
        });
    });

    function abrirCarrossel() {
        carouselInner.innerHTML = "";
        
        fotos.forEach((foto, index) => {
            const isActive = index === currentIndex ? "active" : "";
            const imgSrc = foto.getAttribute("src");
            const carouselItem = `
                <div class="carousel-item ${isActive}">
                    <img src="${imgSrc}" class="d-block w-100" alt="Foto ${index + 1}">
                </div>
            `;
            carouselInner.innerHTML += carouselItem;
        });

        // Ativa o carrossel manualmente
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: false, // Impede que mude automaticamente
            wrap: true // Permite voltar para a primeira imagem ao chegar na última
        });

        modal.show();
    }
});
