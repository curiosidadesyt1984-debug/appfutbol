const UI = {
  init() {
    this.navList = document.getElementById("navList");
    this.content = document.getElementById("content");
    this.breadcrumbs = document.getElementById("breadcrumbs");
    this.loading = document.getElementById("loading");
    this.error = document.getElementById("error");
    this.playerTitle = document.getElementById("playerTitle");
    this.playerFrame = document.getElementById("playerFrame");
    this.sidebar = document.getElementById("sidebar");
    this.overlay = document.getElementById("overlay");
    this.menuToggle = document.getElementById("menuToggle");

    this.menuToggle.addEventListener("click", () => this.toggleSidebar());
    this.overlay.addEventListener("click", () => this.closeSidebar());
  },

  toggleSidebar() {
    this.sidebar.classList.toggle("open");
    this.overlay.classList.toggle("open");
  },

  closeSidebar() {
    this.sidebar.classList.remove("open");
    this.overlay.classList.remove("open");
  },

  setNav(items, onClick) {
    this.navList.innerHTML = items.map((item, i) => {
      const imgTag = item.image
        ? `<img src="${item.image}" loading="lazy" onerror="this.style.display='none'">`
        : "";
      return `<li data-index="${i}">${imgTag}<span>${item.name}</span></li>`;
    }).join("");

    this.navList.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => {
        this.navList.querySelectorAll("li").forEach(l => l.classList.remove("active"));
        li.classList.add("active");
        const idx = parseInt(li.dataset.index);
        onClick(items[idx], idx);
        this.closeSidebar();
      });
    });
  },

  showLoading() { this.loading.classList.remove("hidden"); this.content.classList.add("hidden"); },
  hideLoading() { this.loading.classList.add("hidden"); this.content.classList.remove("hidden"); },
  showError(msg) {
    this.error.textContent = msg;
    this.error.classList.remove("hidden");
    this.content.classList.add("hidden");
  },
  hideError() { this.error.classList.add("hidden"); },

  renderCards(items, onClick) {
    this.hideError();
    this.hideLoading();

    if (!items.length) {
      this.content.innerHTML = '<div class="error">No hay contenido disponible</div>';
      return;
    }

    this.content.innerHTML = items.map((item, i) => {
      const imgTag = item.image
        ? `<img src="${item.image}" loading="lazy" class="card-img ${item.embed ? 'contain' : ''}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 150%22><rect fill=%22%23222%22 width=%22100%22 height=%22150%22/><text x=%2250%22 y=%2275%22 text-anchor=%22middle%22 fill=%22%23555%22 font-size=%2210%22>Sin imagen</text></svg>'">`
        : '<div class="card-img" style="background:#252525;display:flex;align-items:center;justify-content:center;color:#555;font-size:0.75rem">Sin imagen</div>';

      return `<div class="card" data-index="${i}">${imgTag}
        <div class="card-body">
          <div class="card-title">${item.name}</div>
          ${item.info ? `<div class="card-info">${item.info}</div>` : ""}
        </div>
      </div>`;
    }).join("");

    this.content.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.index);
        onClick(items[idx], idx);
      });
    });
  },

  setBreadcrumbs(trail) {
    this.breadcrumbs.innerHTML = trail.map((t, i) => {
      const isLast = i === trail.length - 1;
      return `<li data-idx="${i}" class="${isLast ? 'active' : ''}">${t.name}</li>`;
    }).join("");
  },

  setBreadcrumbClick(onClick) {
    this.breadcrumbs.querySelectorAll("li:not(.active)").forEach(li => {
      li.addEventListener("click", () => {
        const idx = parseInt(li.dataset.idx);
        onClick(idx);
      });
    });
  },
};
