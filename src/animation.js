export function makeAWave() {

    const textToAnimate = window.getSelection()?.toString() || "";
    if (!textToAnimate) {
        return;
    } else {
        const span = document.createElement('span');
        span.textContent = textToAnimate;
        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
        setTimeout(() => {
            span.classList.add('wobble');
            span.addEventListener('animationend', () => {
                span.replaceWith(document.createTextNode(span.textContent));
            });
        }, 0);  
    }

}