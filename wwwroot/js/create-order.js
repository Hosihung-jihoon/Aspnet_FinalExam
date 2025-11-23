const API_URL = 'http://localhost:5228/api';
let cart = [];

// Check authentication
const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

if (!token) {
    alert('You must be logged in to access this page!');
    window.location.href = '/login.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

// Load customers
async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/Customers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const customers = await response.json();
            const select = document.getElementById('customerId');
            
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.name} (${customer.email})`;
                select.appendChild(option);
            });
        } else {
            showMessage('Error loading customers. You may need Admin access.', 'error');
        }
    } catch (error) {
        showMessage('Error loading customers: ' + error.message, 'error');
    }
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/Products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const products = await response.json();
        const tbody = document.getElementById('productsBody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.stock}</td>
                <td>
                    <input type="number" id="qty-${product.id}" min="1" max="${product.stock}" value="1" style="width: 60px; padding: 5px;">
                </td>
                <td>
                    <button class="btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, ${product.stock})" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showMessage('Error loading products: ' + error.message, 'error');
    }
}

// Add to cart
function addToCart(productId, productName, price, maxStock) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (quantity < 1 || quantity > maxStock) {
        showMessage(`Quantity must be between 1 and ${maxStock}`, 'error');
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        if (existingItem.quantity > maxStock) {
            showMessage(`Cannot add more than ${maxStock} items`, 'error');
            existingItem.quantity = maxStock;
        }
    } else {
        cart.push({
            productId,
            productName,
            price,
            quantity,
            maxStock
        });
    }
    
    updateCartDisplay();
    showMessage('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartDisplay();
    showMessage('Product removed from cart', 'success');
}

// Update cart display
function updateCartDisplay() {
    const cartDiv = document.getElementById('cartItems');
    const createBtn = document.getElementById('createOrderBtn');
    
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p class="info">No items in cart</p>';
        createBtn.disabled = true;
        document.getElementById('totalAmount').textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.productName}</strong><br>
                    <small>${item.price.toLocaleString()} VND x ${item.quantity} = ${subtotal.toLocaleString()} VND</small>
                </div>
                <button onclick="removeFromCart(${item.productId})">Remove</button>
            </div>
        `;
    });
    
    cartDiv.innerHTML = html;
    document.getElementById('totalAmount').textContent = total.toLocaleString();
    createBtn.disabled = false;
}

// Create order
document.getElementById('createOrderBtn').addEventListener('click', async () => {
    const customerId = parseInt(document.getElementById('customerId').value);
    
    if (!customerId) {
        showMessage('Please select a customer!', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showMessage('Cart is empty!', 'error');
        return;
    }
    
    const orderData = {
        customerId: customerId,
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };
    
    try {
        const response = await fetch(`${API_URL}/Orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            showMessage('Order created successfully! Order ID: ' + order.id, 'success');
            
            // Reset cart
            cart = [];
            updateCartDisplay();
            document.getElementById('customerId').value = '';
            
            // Reload products (stock updated)
            loadProducts();
            
            // Redirect after 2 seconds
            setTimeout(() => {
                if (confirm('Do you want to view the order details?')) {
                    // In real app, create order-detail.html page
                    alert('Order Details page not implemented. Order ID: ' + order.id);
                }
            }, 2000);
        } else {
            const error = await response.json();
            showMessage('Error: ' + (error.message || 'Order creation failed'), 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// Load data on page load
loadCustomers();
loadProducts();