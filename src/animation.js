export function makeAWave() {

    //get selected text
    const textToAnimate = window.getSelection()?.toString() || "";
    if (!textToAnimate) {
        return;
    }

    const range = window.getSelection().getRangeAt(0);
    if (!range) {
        return;
    }

    //Create mother-span with class wave
    const wrapper = document.createElement('span');
    wrapper.classList.add('wave');

    //Split text into words and spaces, wrap words in spans, and append to wrapper
    let lastWordSpan = null;
    const tokens = textToAnimate.split(/(\s+)/);
    tokens.forEach((token) => {
        if (!token) {
            return;
        }

        if (/^\s+$/.test(token)) {
            wrapper.appendChild(document.createTextNode(token));
        } else {
            const childSpan = document.createElement('span');
            childSpan.textContent = token;
            wrapper.appendChild(childSpan);
            lastWordSpan = childSpan;
        }
    });
    
    // Replace selected text with wrapper
    range.deleteContents();
    range.insertNode(wrapper);

    // Listen for animation end on the last word span to clean up
    if (lastWordSpan) {
        lastWordSpan.addEventListener('animationend', () => {
            wrapper.replaceWith(document.createTextNode(wrapper.textContent));
        });
    }

}

export function stopAnimation() {
    const waves = document.querySelectorAll('.wave');
    waves.forEach(wave => {
        wave.replaceWith(document.createTextNode(wave.textContent));
    });
}