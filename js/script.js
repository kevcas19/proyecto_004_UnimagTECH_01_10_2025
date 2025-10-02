document.addEventListener("DOMContentLoaded", () => {
  // --- Contenedores Principales de cada "Página" ---
  const loginPage = document.getElementById("login-page");
  const homePage = document.getElementById("home-page");
  const laptopsPage = document.getElementById("laptops-page");
  const computadoresPage = document.getElementById("computadores-page");
  const salasPage = document.getElementById("salas-page");
  const perfilPage = document.getElementById("perfil-page");
  const reservasPage = document.getElementById("reservas-page");
  const puzzlePage = document.getElementById("puzzle-page");

  // Array con todas las páginas
  const allPages = [
    loginPage,
    homePage,
    laptopsPage,
    computadoresPage,
    salasPage,
    perfilPage,
    reservasPage,
    puzzlePage,
  ].filter((page) => page !== null);

  // --- Elementos de la página de Login ---
  const initialView = document.getElementById("initial-view");
  const loginView = document.getElementById("login-view");
  const showLoginBtn = document.getElementById("show-login-btn");
  const backArrow = document.getElementById("back-arrow");
  const accederBtn = document.getElementById("acceder-btn");

  // --- Elementos de Navegación ---
  const navLinks = document.querySelectorAll(".nav-link");

  // --- Elementos del Menú de Perfil ---
  const profileToggles = document.querySelectorAll(".user-profile");
  const logoutBtns = document.querySelectorAll(".logout-btn");

  // ---Función para ocultar todas las páginas principales---
  const hideAllPages = () => {
    allPages.forEach((page) => {
      page.classList.add("hidden");
    });
  };

  // --- Lógica de Navegación del Menú Principal ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("data-target");
      const targetPage = document.getElementById(targetId);

      if (targetPage) {
        hideAllPages();
        targetPage.classList.remove("hidden");
        window.scrollTo(0, 0);
      }
    });
  });

  // --- Lógica específica de la Página de Login ---
  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", () => {
      initialView.classList.add("hidden");
      loginView.classList.remove("hidden");
    });
  }

  if (backArrow) {
    backArrow.addEventListener("click", (event) => {
      event.preventDefault();
      initialView.classList.remove("hidden");
      loginView.classList.add("hidden");
    });
  }

  if (accederBtn) {
    accederBtn.addEventListener("click", () => {
      hideAllPages();
      if (homePage) homePage.classList.remove("hidden");
    });
  }

  // --- LÓGICA DEL MENÚ DE PERFIL ---
  const closeAllDropdowns = () => {
    document.querySelectorAll(".profile-dropdown").forEach((menu) => {
      menu.classList.add("hidden");
    });
  };
  profileToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const currentMenu = toggle.querySelector(".profile-dropdown");
      if (currentMenu.classList.contains("hidden")) {
        closeAllDropdowns();
        currentMenu.classList.remove("hidden");
      } else {
        closeAllDropdowns();
      }
    });
  });
  document.addEventListener("click", () => {
    closeAllDropdowns();
  });
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      hideAllPages();
      if (loginPage) {
        loginPage.classList.remove("hidden");
        if (initialView && loginView) {
          initialView.classList.remove("hidden");
          loginView.classList.add("hidden");
        }
      }
    });
  });

  // --- LÓGICA PARA EL BOTÓN DE RESERVAR ---
  const allReserveBtns = document.querySelectorAll(".reserve-btn");
  allReserveBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.disabled) {
        alert("¡Reserva realizada con éxito!");
        hideAllPages();
        reservasPage.classList.remove("hidden");
      }
    });
  });

  // --- LÓGICA PARA EL HEADER INTELIGENTE (OCULTAR AL HACER SCROLL) ---
  let lastScrollY = window.scrollY;
  const allMainHeaders = document.querySelectorAll(".main-header");
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      allMainHeaders.forEach((header) => header.classList.add("header-hidden"));
    } else {
      allMainHeaders.forEach((header) =>
        header.classList.remove("header-hidden")
      );
    }
    lastScrollY = currentScrollY;
  });

  // --- LÓGICA SECUENCIAL DEL PROCESO DE RESERVA ---
  document
    .querySelectorAll("#laptops-page, #computadores-page, #salas-page")
    .forEach((page) => {
      const steps = page.querySelectorAll(".process-step");
      const reserveBtn = page.querySelector(".reserve-btn");
      if (steps.length === 0 || !reserveBtn) return;
      const updateStepStatus = () => {
        let isNextStepEnabled = true;
        steps.forEach((step, index) => {
          if (isNextStepEnabled) {
            step.classList.remove("is-disabled");
            step.querySelectorAll("input").forEach((input) => (input.disabled = false));
          } else {
            step.classList.add("is-disabled");
            step.querySelectorAll("input").forEach((input) => (input.disabled = true));
          }
          let isCurrentStepCompleted = false;
          step.querySelectorAll("input").forEach((input) => {
            if (
              (input.type === "radio" && input.checked) ||
              (input.type === "text" && input.value !== "")
            ) {
              isCurrentStepCompleted = true;
            }
          });
          if (!isCurrentStepCompleted) {
            isNextStepEnabled = false;
          }
        });
        reserveBtn.disabled = !isNextStepEnabled;
      };
      page.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener("change", updateStepStatus);
      });
      const datePickerInput = page.querySelector(".date-picker");
      const timePickerInput = page.querySelector(".time-picker");
      if (datePickerInput && timePickerInput) {
        const timePicker = flatpickr(timePickerInput, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "h:i K",
          minTime: "06:10",
          maxTime: "20:30",
          minuteIncrement: 10,
          onChange: updateStepStatus,
        });
        flatpickr(datePickerInput, {
          minDate: new Date().fp_incr(1),
          dateFormat: "d-m-Y",
          onChange: function () {
            updateStepStatus();
            timePicker.open();
          },
        });
      }
      updateStepStatus();
    });

  // ================================================================== //
  // =================== LÓGICA PARA EL PUZZLE ================== //
  // ================================================================== //
  
  if (puzzlePage) {
    const container = document.getElementById("puzzle-container");
    const imageSelectorBtns = document.querySelectorAll(".select-image-btn");
    const previewImage = document.getElementById("preview-image"); // <-- AÑADIDO

    const gridSize = 4;
    let pieces = [];
    let emptyIndex;
    
    function startGame(imageSrc) {
        // Actualizamos la imagen de vista previa
        if (previewImage) {
            previewImage.src = imageSrc; // <-- AÑADIDO
        }

        createPieces(imageSrc);
        shufflePieces();
        render();
    }

    function createPieces(imageSrc) {
        pieces = [];
        const totalPieces = gridSize * gridSize;
        for (let i = 0; i < totalPieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            if (i === totalPieces - 1) {
                piece.classList.add('empty');
                emptyIndex = i;
            } else {
                const x = (i % gridSize) * (100 / (gridSize - 1));
                const y = Math.floor(i / gridSize) * (100 / (gridSize - 1));
                piece.style.backgroundImage = `url(${imageSrc})`;
                piece.style.backgroundPosition = `${x}% ${y}%`;
                piece.dataset.index = i;
            }
            piece.addEventListener('click', ((currentIndex) => () => onPieceClick(currentIndex))(i));
            pieces.push(piece);
        }
    }

    function shufflePieces() {
        for (let i = 0; i < 300; i++) {
            const neighbors = getNeighbors(emptyIndex);
            const randomNeighborIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
            swapPieces(emptyIndex, randomNeighborIndex);
            emptyIndex = randomNeighborIndex;
        }
    }

    function render() {
        container.innerHTML = '';
        pieces.forEach(piece => {
            container.appendChild(piece);
        });
    }

    function onPieceClick(clickedIndex) {
        const currentPieceIndex = pieces.findIndex(p => p === event.target);
        if (isNeighbor(currentPieceIndex, emptyIndex)) {
            swapPieces(currentPieceIndex, emptyIndex);
            emptyIndex = currentPieceIndex;
            render();
            setTimeout(() => {
                if (isSolved()) {
                    alert('¡Felicidades, has ganado! 🥳');
                }
            }, 100);
        }
    }
    
    function swapPieces(index1, index2) {
        [pieces[index1], pieces[index2]] = [pieces[index2], pieces[index1]];
    }

    function isNeighbor(index1, index2) {
        const row1 = Math.floor(index1 / gridSize);
        const col1 = index1 % gridSize;
        const row2 = Math.floor(index2 / gridSize);
        const col2 = index2 % gridSize;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }
    
    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        if (row > 0) neighbors.push(index - gridSize);
        if (row < gridSize - 1) neighbors.push(index + gridSize);
        if (col > 0) neighbors.push(index - 1);
        if (col < gridSize - 1) neighbors.push(index + 1);
        return neighbors;
    }

    function isSolved() {
        for (let i = 0; i < pieces.length -1; i++) {
            if (pieces[i].classList.contains('empty') || parseInt(pieces[i].dataset.index) !== i) {
                return false;
            }
        }
        return true;
    }

    imageSelectorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const imageSrc = btn.dataset.src;
        startGame(imageSrc);
      });
    });

    if (imageSelectorBtns.length > 0) {
      startGame(imageSelectorBtns[0].dataset.src);
    }
  }

});