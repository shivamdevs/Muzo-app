window.loadingOverlayRemove = function() {
    const elem = window.document.getElementById("loading-overlay");
    elem?.classList.add('ls-ol-fo');
    elem && setTimeout(() => {
        elem?.parentNode?.removeChild(elem);
    }, 500);
}