const Parser = {
  parseFile(filename, raw) {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "w3u" || ext === "json") {
      try { return this.parseW3U(JSON.parse(raw), filename); }
      catch (e) { throw new Error("Error al leer " + filename + ": " + e.message); }
    }
    if (ext === "m3u" || ext === "m3u8") {
      return this.parseM3U(raw, filename);
    }
    throw new Error("Formato no soportado: ." + ext);
  },

  parseW3U(json, filename) {
    const groups = json.groups || [];

    if (groups.length > 0) {
      const items = groups.map(g => {
        const inlineStations = g.stations || [];
        const hasStations = inlineStations.length > 0;
        const hasUrl = !!(g.url && g.url.trim());
        const isPlaylist = hasUrl && this.isPlaylistFile(g.url);

        return {
          name: (g.name || "").trim(),
          image: g.image || g.imageScale || "",
          info: g.info || "",
          url: hasUrl ? g.url : "",
          stations: hasStations ? inlineStations.map(s => this.buildStation(s)) : [],
          author: g.author || "",
          hasStations,
          hasUrl,
          isPlaylist,
        };
      });

      return {
        type: (items.every(i => i.stations.length > 0)) ? "content" : "menu",
        name: json.name || filename,
        items,
      };
    }

    if (json.stations) {
      return {
        type: "content",
        name: json.name || filename,
        items: json.stations.map(s => this.buildStation(s)),
      };
    }

    if (json.name && json.url) {
      return { type: "content", name: json.name, items: [this.buildStation(json)] };
    }

    throw new Error("Estructura desconocida en " + filename);
  },

  buildStation(s) {
    return {
      name: s.name || "",
      info: s.info || "",
      image: s.image || s.imageScale || "",
      url: s.url || "",
      embed: s.embed === "true" || s.embed === true,
      isHost: s.isHost === "true" || s.isHost === true,
      userAgent: s.userAgent || "",
      referer: s.referer || "",
      origin: s.origin || "",
      online: s.online === "true" || s.online === true || s.online === undefined,
    };
  },

  isPlaylistFile(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return [".w3u", ".m3u", ".m3u8", ".json"].some(ext => lower.endsWith(ext))
      || url.includes("af1c1onados")
      || url.includes("aficionados")
      || url.includes("stark9.workers.dev")
      || url.includes("cutt.ly")
      || url.includes("raw.githubusercontent.com");
  },

  parseM3U(raw, filename) {
    const lines = raw.split(/\r?\n/);
    const items = [];
    let currentTitle = "";
    let currentGroup = "";

    for (const line of lines) {
      const t = line.trim();
      if (t === "" || t === "#EXTM3U") continue;

      if (t.startsWith("#EXTINF:")) {
        const gm = t.match(/group-title="([^"]*)"/);
        currentGroup = gm ? gm[1] : "";
        const tm = t.match(/,\s*(.+)$/);
        currentTitle = tm ? tm[1].trim() : "";
      } else if (t.startsWith("http")) {
        items.push({
          name: currentTitle || t,
          info: currentGroup,
          image: "",
          url: t,
          embed: false,
          isHost: false,
          userAgent: "",
          referer: "",
          origin: "",
          online: true,
        });
      }
    }

    return { type: "content", name: filename.replace(/\.[^.]+$/, ""), items };
  },
};
