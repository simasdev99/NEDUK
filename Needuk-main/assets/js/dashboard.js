document.addEventListener("DOMContentLoaded", function () {
  const btnCriarExp = document.getElementById("criarex");
  const experienciasContainer = document.getElementById(
    "experiencias-container"
  );
  const noExperiencesMessage = document.getElementById(
    "no-experiences-message"
  );

  // Listener para o botão de criar experiência (mantido)
  btnCriarExp.addEventListener("click", function () {
    window.location.href = "newExp.html";
  });

  // Função para formatar a data (mantida)
  function formatDate(mes, ano) {
    if (!mes || !ano) return "Data não informada";
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const mIndex = parseInt(mes, 10) - 1;
    if (mIndex < 0 || mIndex > 11) return "Data inválida";
    return meses[mIndex] + "/" + ano;
  }

  // --- Função para carregar e renderizar as experiências ---
  function carregarExperiencias() {
    const experienciasSalvasJSON = localStorage.getItem("experiencias");
    let experiencias = [];

    if (experienciasSalvasJSON) {
      try {
        experiencias = JSON.parse(experienciasSalvasJSON);
      } catch {
        experiencias = [];
      }
    }

    experienciasContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar

    if (experiencias.length === 0) {
      noExperiencesMessage.style.display = "block";
      return;
    } else {
      noExperiencesMessage.style.display = "none";
    }

    experiencias.forEach((exp, index) => {
      // O 'index' não é mais estritamente necessário aqui, mas não causa problema
      const card = document.createElement("div");
      card.className = "experiencia-card";

      // --- Título clicável ---
      const tituloEl = document.createElement("h3");
      tituloEl.textContent = exp.titulo;
      tituloEl.classList.add("titulo-experiencia"); // Adiciona a classe para o estilo de cursor/hover
      card.appendChild(tituloEl);

      // --- Contêiner para os detalhes (inicialmente oculto) ---
      const detalhesContainer = document.createElement("div");
      detalhesContainer.className = "experiencia-detalhes";

      const tipoEl = document.createElement("p");
      tipoEl.innerHTML = `<span class="detalhe">Tipo:</span> ${exp.tipo}`;
      detalhesContainer.appendChild(tipoEl);

      const periodoEl = document.createElement("p");
      const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
      const terminoFormatado =
        exp.mesTermino && exp.anoTermino
          ? formatDate(exp.mesTermino, exp.anoTermino)
          : "Atual";
      periodoEl.innerHTML = `<span class="detalhe">Período:</span> ${inicioFormatado} - ${terminoFormatado}`;
      detalhesContainer.appendChild(periodoEl);

      if (exp.cargaHoraria) {
        const cargaEl = document.createElement("p");
        cargaEl.innerHTML = `<span class="detalhe">Carga horária:</span> ${exp.cargaHoraria} horas`;
        detalhesContainer.appendChild(cargaEl);
      }

      if (exp.habilidades) {
        const habsEl = document.createElement("p");
        habsEl.innerHTML = `<span class="detalhe">Habilidades:</span> ${exp.habilidades}`;
        detalhesContainer.appendChild(habsEl);
      }

      if (exp.descricao) {
        const descEl = document.createElement("p");
        descEl.innerHTML = `<span class="detalhe">Descrição:</span> ${exp.descricao}`;
        detalhesContainer.appendChild(descEl);
      }

      card.appendChild(detalhesContainer);

      // Adiciona o botão de Gerar PDF
      const btnGerarPDF = document.createElement("button");
      btnGerarPDF.textContent = "Gerar PDF";
      btnGerarPDF.classList.add("btn-gerar-pdf");
      card.appendChild(btnGerarPDF);

      //  como roda para gerar o PDF
      btnGerarPDF.addEventListener("click", function () {
        const { jsPDF } = window.jspdf; // Obtém a biblioteca jsPDF
        const doc = new jsPDF();

        // Adiciona o conteúdo ao PDF
        doc.text(`Experiência: ${exp.titulo}`, 10, 10);
        doc.text(`Tipo: ${exp.tipo}`, 10, 20);
        doc.text(`Período: ${inicioFormatado} - ${terminoFormatado}`, 10, 30);
        if (exp.cargaHoraria)
          doc.text(`Carga Horária: ${exp.cargaHoraria} horas`, 10, 40);
        if (exp.habilidades)
          doc.text(`Habilidades: ${exp.habilidades}`, 10, 50);
        if (exp.descricao) doc.text(`Descrição: ${exp.descricao}`, 10, 60);

        // Salva o PDF
        doc.save(`experiencia_${exp.titulo}.pdf`);
      });

      experienciasContainer.appendChild(card);
    });
  }

  // --- Lógica de clique para expandir/colapsar os detalhes (MANTIDA) ---
  experienciasContainer.addEventListener("click", function (event) {
    const tituloClicado = event.target.closest(".experiencia-card h3");
    if (tituloClicado) {
      const detalhes = tituloClicado.parentNode.querySelector(
        ".experiencia-detalhes"
      );
      if (detalhes) {
        detalhes.classList.toggle("show");
      }
    }
  });

  carregarExperiencias();
});
