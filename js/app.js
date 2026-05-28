const Auth = {
  USER: "miguel",
  PASS: "12345678",

  init() {
    this.overlay = document.getElementById("loginOverlay");
    this.appContainer = document.getElementById("appContainer");
    this.form = document.getElementById("loginForm");
    this.error = document.getElementById("loginError");
    this.userInput = document.getElementById("loginUser");
    this.passInput = document.getElementById("loginPass");

    this.form.addEventListener("submit", e => {
      e.preventDefault();
      this.login();
    });

    if (sessionStorage.getItem("auth") === "ok") {
      this.showApp();
    }
  },

  login() {
    if (this.userInput.value === this.USER && this.passInput.value === this.PASS) {
      sessionStorage.setItem("auth", "ok");
      this.showApp();
    } else {
      this.error.classList.remove("hidden");
    }
  },

  showApp() {
    this.overlay.classList.add("hidden");
    this.appContainer.classList.remove("hidden");
  },

  isLoggedIn() {
    return sessionStorage.getItem("auth") === "ok";
  },
};

const App = {
  BASE: "AF1CIONADOS",
  trail: [],

  async init() {
    Auth.init();
    if (!Auth.isLoggedIn()) return;
    UI.init();
    Player.init();
    await this.loadMainMenu();
  },

  async loadMainMenu() {
    UI.showLoading();
    try {
      const data = await this.fetchLocal("futbol.w3u");
      const parsed = Parser.parseFile("futbol.w3u", data);
      this.trail = [{ name: parsed.name, data: parsed }];
      this.showCurrent();
    } catch (e) {
      UI.showError("No se pudo cargar el menu principal: " + e.message);
    }
  },

  async navigate(item) {
    if (!item) return;

    if (item.stations && item.stations.length > 0) {
      const valid = item.stations.filter(s => s.url);
      if (valid.length) {
        this.trail.push({ name: item.name, data: { type: "content", name: item.name, items: valid } });
        this.showCurrent();
      }
      return;
    }

    if (!item.url) return;

    if (item.isPlaylist || Parser.isPlaylistFile(item.url)) {
      UI.showLoading();
      try {
        const raw = await this.fetchLocal(item.url);
        const parsed = Parser.parseFile(item.url, raw);
        if (parsed.type === "content" && item.url.toLowerCase().includes("zona.deportiva")) {
          parsed.items = FootballFilter.filter(parsed.items);
        }
        this.trail.push({ name: parsed.name, data: parsed });
        this.showCurrent();
      } catch (e) {
        window.open(item.url, "_blank");
      }
      return;
    }

    if (item.embed) {
      Player.open(item);
      return;
    }

    if (item.isHost) {
      window.open(item.url, "_blank");
      return;
    }

    Player.open(item);
  },

  showCurrent() {
    const current = this.trail[this.trail.length - 1];
    const data = current.data;

    UI.setBreadcrumbs(this.trail);
    UI.setBreadcrumbClick(idx => this.goBack(idx));

    const navItems = data.items.map(i => ({
      name: i.name,
      image: i.image,
      info: i.info,
      url: i.isPlaylist ? this.resolveLocal(i.url) : i.url,
      stations: i.stations || [],
      isHost: i.isHost,
      isPlaylist: i.isPlaylist,
      hasStations: !!(i.stations && i.stations.length),
    }));

    UI.setNav(navItems, item => this.navigate(item));
    UI.renderCards(navItems, item => this.navigate(item));
  },

  goBack(targetIdx) {
    this.trail = this.trail.slice(0, targetIdx + 1);
    this.showCurrent();
  },

  resolveLocal(url) {
    if (!url || !url.startsWith("http")) return url;
    try {
      const fn = url.split("/").pop();
      if (!fn) return url;
      const ext = fn.split(".").pop()?.toLowerCase();
      if (["w3u", "m3u", "m3u8", "json"].includes(ext)) return fn;
    } catch (e) { return url; }
    if (url.includes("af1c1onados.vercel.app") || url.includes("aficionados.vercel.app") || url.includes("series-af1cionados.vercel.app")) {
      return url.split("/").pop() || url;
    }
    return url;
  },

  async fetchLocal(filename) {
    if (filename.startsWith("http")) {
      const resp = await fetch(filename);
      if (!resp.ok) throw new Error(resp.status + " " + resp.statusText);
      return resp.text();
    }
    const resp = await fetch(this.BASE + "/" + filename);
    if (!resp.ok) throw new Error(resp.status + " " + resp.statusText + " al cargar " + filename);
    return resp.text();
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
