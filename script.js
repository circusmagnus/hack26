document.addEventListener('DOMContentLoaded', () => {
    const displayButton = document.getElementById('displayButton');
    const helloText = document.getElementById('helloText');

    if (displayButton && helloText) {
        displayButton.addEventListener('click', () => {
            helloText.style.display = 'block';
        });
    }
});