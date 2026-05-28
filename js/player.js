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

  open(stream) {
    this.stream = stream;
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
