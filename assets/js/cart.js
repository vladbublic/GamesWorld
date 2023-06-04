window.addEventListener('load', loadCartFromJSON);
window.addEventListener('load', updateTotal);

let cart;

function loadCartFromJSON() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    loadCart();
}

function loadCart() {
    const cartContainer = document.querySelector('.items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyCart = document.createElement('h4');
        emptyCart.innerHTML = 'Ваш кошик пустий, перейдіть у <a href="catalog.html"><span class="text-span-2">каталог</span></a>, щоб додати товари.';
        cartContainer.appendChild(emptyCart);
        return;
    }

    cart.forEach(function (item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        const imgElement = document.createElement('img');
        imgElement.src = item.image;
        imgElement.alt = '';
        imgElement.className = 'item-img';
        itemElement.appendChild(imgElement);

        const infoElement = document.createElement('div');
        infoElement.classList.add('item-info');

        const titleElement = document.createElement('h4');
        titleElement.className = 'item_title';
        titleElement.id = item.id;
        titleElement.textContent = item.name;
        infoElement.appendChild(titleElement);

        const priceElement = document.createElement('p');
        priceElement.className = 'item_price';
        if (item.newPrice == null) {
            priceElement.textContent = item.price + ' грн';
        } else {
            const priceSpan = document.createElement('span');
            priceSpan.textContent = item.price + ' грн';
            priceSpan.style.textDecoration = 'line-through';

            const newPriceSpan = document.createElement('span');
            newPriceSpan.textContent = item.newPrice + ' грн';

            priceElement.appendChild(priceSpan);
            priceElement.appendChild(document.createElement('br'));
            priceElement.appendChild(newPriceSpan);
        }

        infoElement.appendChild(priceElement);

        const countContainer = document.createElement('div');
        countContainer.classList.add('count-container');

        const countLabel = document.createElement('p');
        countLabel.textContent = 'Кількість:';
        countLabel.classList.add('count-name');

        countContainer.appendChild(countLabel);

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.value = item.count;
        countInput.min = '1';
        countInput.classList.add('count-input');

        countInput.addEventListener('change', function (event) {
            const newCount = parseInt(event.target.value);
            updateItemCount(item.id, newCount);
        });

        countContainer.appendChild(countInput);

        const totalElement = document.querySelector('.total-price');
        const totalPrice = calcTotal();
        totalElement.textContent = 'Сума: ' + totalPrice + ' грн';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '';
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', function () {
            removeFromCart(item.id);
        });

        itemElement.appendChild(infoElement);
        itemElement.appendChild(countContainer);
        itemElement.appendChild(deleteButton);
        cartContainer.appendChild(itemElement);
    });
}

function updateItemCount(itemId, newCount) {
    const itemUpdate = cart.find((item) => item.id === itemId);
    if (itemUpdate) {
        itemUpdate.count = newCount;

        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotal();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotal();
    loadCart();
}

function calcTotal() {
    let total = 0;
    cart.forEach(function (item) {
        if (item.newPrice != null)
            total += item.count * item.newPrice
        else total += item.count * item.price;
    });

    return total;
}

function updateTotal() {
    const totalElement = document.querySelector('.total-price');
    const total = calcTotal();
    totalElement.textContent = 'Сума: ' + total + ' грн';
}

const form = document.querySelector('.order-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Ваш кошик пустий. Додайте хоча б одну одиницю товару.');
        return;
    }

    const formData = new FormData(form);

    cart.forEach(function (item, index) {
        formData.append('Назва товару ' + (index + 1) , item.name);
        if (item.newPrice != null) {
            formData.append('Ціна товару ' + (index + 1), item.newPrice);
        } else {
            formData.append('Ціна товару ' + (index + 1), item.price);
        }
        formData.append('Кількість товару ' + (index + 1), item.count);
    });

    const total = calcTotal();
    formData.append('Сума замовлення', total + ' грн');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            form.reset();
            clearCart();
            alert('Дякуємо за замовлення!');
        }
    };
    xhr.send(formData);
});

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateTotal();
    loadCart();
}
