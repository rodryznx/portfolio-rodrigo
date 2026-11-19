// 1. FUNCIONALIDADE DE TEMA CLARO / ESCURO
const botaoTema = document.getElementById('btn-tema');

botaoTema.addEventListener('click', function () {
    // Adiciona ou remove a classe 'tema-escuro' no <body>
    document.body.classList.toggle('tema-escuro');

    // Atualiza o texto do botão conforme o tema ativo
    if (document.body.classList.contains('tema-escuro')) {
        botaoTema.textContent = 'Tema claro';
    } else {
        botaoTema.textContent = 'Tema escuro';
    }
});

// 2. VALIDAÇÃO E SIMULAÇÃO DE ENVIO DO FORMULÁRIO
const formulario = document.getElementById('form-contato');
const feedback = document.getElementById('feedback-form');

formulario.addEventListener('submit', function (evento) {
    // Impede que a página recarregue ao clicar em enviar
    evento.preventDefault();

    // Captura os valores digitados removendo espaços extras nas pontas (.trim())
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Verifica se algum campo está vazio
    if (nome === '' || email === '' || mensagem === '') {
        feedback.style.color = 'var(--erro)'; // Vermelho para erro
        feedback.textContent = 'Por favor, preencha todos os campos antes de enviar.';
        return;
    }

    // Validação simples do formato de e-mail (texto@texto.dominio)
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!padraoEmail.test(email)) {
        feedback.style.color = 'var(--erro)';
        feedback.textContent = 'Por favor, informe um e-mail válido (ex: nome@dominio.com).';
        return;
    }

    // Se passou nas validações: simula o envio, limpa os campos e avisa o usuário
    feedback.style.color = 'var(--acento)'; // Verde para sucesso
    feedback.textContent = 'Mensagem enviada com sucesso!';
    alert('Mensagem enviada com sucesso!');
    
    // Limpa os campos do formulário
    formulario.reset();
});

