let cart = json.parse(localstorage.getitem('cart')) || [];
updatecartcount();

function updatecartcount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getelementbyid('cart-count').textcontent = count;
}

function addtocart(name, price, size) {
    const existingitem = cart.find(item => item.name === name && item.size === size);
    if (existingitem) {
        existingitem.quantity++;
    } else {
        cart.push({ name, price: parsefloat(price), size, quantity: 1 });
    }
    localstorage.setitem('cart', json.stringify(cart));
    updatecartcount();
    alert(`${name} (size: ${size}) added to cart!`);
}

document.queryselectorall('.add-to-cart').foreach(button => {
    button.addeventlistener('click', () => {
        const name = button.dataset.name;
        const price = button.dataset.price;
        const size = button.previouselementsibling.value;
        addtocart(name, price, size);
    });
});

if (document.getelementbyid('cart-items')) {
    function displaycart() {
        const cartitems = document.getelementbyid('cart-items');
        cartitems.innerhtml = '';
        let total = 0;
        cart.foreach((item, index) => {
            total += item.price * item.quantity;
            cartitems.innerhtml += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name} (size: ${item.size})</h4>
                        <p>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).tofixed(2)}</p>
                    </div>
                    <button onclick="removefromcart(${index})">remove</button>
                </div>
            `;
        });
        document.getelementbyid('total-price').textcontent = total.tofixed(2);
    }
    displaycart();
}

function removefromcart(index) {
    cart.splice(index, 1);
    localstorage.setitem('cart', json.stringify(cart));
    updatecartcount();
    displaycart();
}

if (document.getelementbyid('checkout-form')) {
    document.getelementbyid('checkout-form').addeventlistener('submit', (e) => {
        e.preventdefault();
        const name = document.getelementbyid('name').value;
        const address = document.getelementbyid('address').value;
        const city = document.getelementbyid('city').value;
        const phone = document.getelementbyid('phone').value;
        
        let message = `order from dia's store:\nname: ${name}\naddress: ${address}\ncity: ${city}\nphone: ${phone}\n\nitems:\n`;
        cart.foreach(item => {
            message += `${item.name} (size: ${item.size}) - $${item.price} x ${item.quantity}\n`;
        });
        message += `\ntotal: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).tofixed(2)}`;
        
        const whatsappurl = `https://wa.me/1234567890?text=${encodeuricomponent(message)}`;
        window.open(whatsappurl, '_blank');
        
        cart = [];
        localstorage.setitem('cart', json.stringify(cart));
        updatecartcount();
        alert('order placed! check whatsapp.');
    });
}