const Player = {
  container: null,
  titleEl: null,
  frame: null,
  closeBtn: null,
  stream: null,

  init() {
    this.container = document.getElementById("player");
    this.titleEl = document.getElementById("playerTitle");
    this.frame = document.getElementById("playerFrame");
    this.closeBtn = document.getElementById("playerClose");
    this.directLink = document.getElementById("playerDirectLink");
    this.closeBtn.addEventListener("click", () => this.close());
  },

  isMobile() {
    return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
  },

  open(stream) {
    this.stream = stream;

    if (this.isMobile()) {
      App.openLink(stream.url);
      return;
    }

    this.titleEl.textContent = stream.name + (stream.info ? " " + stream.info : "");

    this.frame.src = stream.url;
    this.directLink.href = stream.url;

    this.container.classList.remove("hidden");
  },

  close() {
    this.container.classList.add("hidden");
    this.frame.src = "";
    this.stream = null;
  },
};
