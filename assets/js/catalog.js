window.addEventListener('load', loadItemsFromJSON);

let catalog;

function loadItemsFromJSON() {
    const jsonFile = 'assets/catalog.json';

    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', jsonFile, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            catalog = JSON.parse(xhr.responseText);
            loadCatalog(catalog);
        }
    };
    xhr.send();
}

function search() {
    const search = document.getElementById('searchInput').value;
    let searchResult = [];
    catalog.forEach(function (item) {
        if (item.name.toLowerCase().includes(search.toLowerCase())) {
            searchResult.push(item);
        }
    });
    if (searchResult.length !== 0)
        loadCatalog(searchResult);
    else
        alert("Товар не знайдено")
}

function loadCatalog(items) {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.replaceChildren();
    items.forEach(function (item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        const imgElement = document.createElement('img');
        imgElement.src = item.image;
        imgElement.alt = '';
        imgElement.classList.add('item-img');
        itemElement.appendChild(imgElement);

        const titleElement = document.createElement('h4');
        titleElement.classList.add('item_title');
        titleElement.id = item.id;
        titleElement.textContent = item.name;
        itemElement.appendChild(titleElement);

        const buttonElement = document.createElement('a');
        buttonElement.href = item.orderLink;
        if (item.newPrice == null) {
            buttonElement.classList.add('item_button');
            buttonElement.textContent = item.price + ' грн';
        } else {
            buttonElement.classList.add('item-button-mod');
            const newPrice = document.createElement('span');
            newPrice.textContent = item.newPrice + ' грн';
            const price = document.createElement('span');
            price.classList.add('item-button-span-white');
            price.textContent = item.price + ' грн';

            buttonElement.appendChild(price);
            buttonElement.appendChild(newPrice);

        }

        buttonElement.addEventListener('click', function (event) {
            event.preventDefault();
            addToCart(item);
        });

        itemElement.appendChild(buttonElement);

        itemsContainer.appendChild(itemElement);
    });
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    console.log(existingItem);
    if (existingItem) {
        existingItem.count += 1;
    } else {
        item.count = 1;
        cart.push(item);
    }
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Товар додано до кошику!");

}