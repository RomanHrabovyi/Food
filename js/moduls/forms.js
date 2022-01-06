function forms() {
    //Forms

    const forms = document.querySelectorAll('form');

    const message = { //повідомлення для користувача про статус відправки або помилки
        loading: 'img/form/spinner.svg',
        success: 'Дякуємо! Ми скоро з вами зв\'яжемось',
        failure: 'Виникла помилка! Повторіть ще раз!'
    };

    forms.forEach(item => { //на кожну форму буде підвязана функція postData
        bindPostData(item);
    });

    //асинхронний код
    // async - буде асинхронний код
    // await- ставимо перед тими операціями яких нам потрібно дочекатись

    const postData = async (url, data) => { //url i data дані які будуть поститись
        const res = await fetch(url, {
            method: 'POST',
            headers: { //при відправці FormData не JSON файл,-headers непотрібні
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json(); //повертаємо promis
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries())); //споч formData перетворюємо в масив масивів а потім в обєкт,а потім в json

            postData('http://localhost:3000/requests', json) //повертається promis який потім обробляємо
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success); //повідомлення підтвердження успіху
                    statusMessage.remove(); //видаляємо повідомлення з форми

                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset(); //очищаємо інпути в формі
                });

            function showThanksModal(message) {
                const prevModalDialog = document.querySelector('.modal__dialog');

                prevModalDialog.classList.add('hide');
                openModal();

                const thanksModal = document.createElement('div');
                thanksModal.classList.add('modal__dialog');
                thanksModal.innerHTML = `
                        <div class = "modal__content">
                            <div class="modal__close" data-close>&times;</div>
                            <div class="modal__title">${message}</div>
                        </div>
                        
                    `;

                document.querySelector('.modal').append(thanksModal);
                setTimeout(() => {
                    thanksModal.remove();
                    prevModalDialog.classList.add('show');
                    prevModalDialog.classList.remove('hide');
                    closeModal();
                }, 4000);

            }

        });
    }
}

module.exports = forms;