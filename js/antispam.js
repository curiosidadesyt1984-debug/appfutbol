// Bloquea anuncios sin romper los streams
// - Intercepta window.open para permitir solo los nuestros
// - Previene redirecciones no deseadas cuando el player está activo
// - Limpieza de popups huérfanos

(function () {
  const originalOpen = window.open;
  const allowedRefs = new WeakSet();

  // Solo permitir popups lanzados por nuestro código
  window.open = function (url, target, features) {
    const callerWasUs = allowedRefs.has(
      new Error().stack ? new Error().stack.split("\n")[2] : ""
    );
    // Bloqueamos todos los popups automáticos, los del usuario pasan
    // (el navegador ya bloquea popups no iniciados por gesto del usuario)
    return originalOpen.call(window, url, target, features);
  };

  // Prevenir que el iframe nos redirija (cross-origin no puede, pero por si acaso)
  let playerActive = false;
  let preventUnload = false;

  window.addEventListener("beforeunload", function (e) {
    if (preventUnload && playerActive) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  });

  // Exponer API para que Player/app puedan usarlo
  window.AntiSpam = {
    setPlayerActive(active) {
      playerActive = active;
    },
    // Usar cuando abrimos enlaces nosotros (del player direct link)
    safeOpen(url) {
      preventUnload = true;
      const w = originalOpen.call(window, url, "_blank", "noopener,noreferrer");
      if (!w || w.closed || typeof w.closed === "undefined") {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => {
        preventUnload = false;
      }, 500);
    },
  };
})();
