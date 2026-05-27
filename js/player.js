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
    this.closeBtn.addEventListener("click", () => this.close());
  },

  open(stream) {
    this.stream = stream;
    this.titleEl.textContent = stream.name + (stream.info ? " " + stream.info : "");

    if (stream.embed) {
      this.frame.src = stream.url;
    } else {
      this.frame.src = stream.url;
    }

    this.container.classList.remove("hidden");
  },

  close() {
    this.container.classList.add("hidden");
    this.frame.src = "";
    this.stream = null;
  },
};
