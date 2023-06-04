const form = document.querySelector('form');
const submitButton = document.querySelector('#btn-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                form.reset();
                alert('Чекайте на дзвінок!');
            } else {
                alert('Вибачте. Сталася помилка');
            }

        }
    };
    xhr.send(formData);

});