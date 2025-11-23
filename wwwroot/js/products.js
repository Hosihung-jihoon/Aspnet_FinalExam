const API_URL = 'http://localhost:5228/api';
let currentEditId = null;

// Check authentication
const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const roles = JSON.parse(localStorage.getItem('roles') || '[]');

if (!token || !roles.includes('Admin')) {
    alert('You must be logged in as Admin to access this page!');
    window.location.href = '/login.html';
}

document.getElementById('userEmail').textContent = email;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

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
                <td>${product.description || '-'}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showMessage('Error loading products: ' + error.message, 'error');
    }
}

// Add/Update product
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        id: currentEditId || 0,
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        stock: parseInt(document.getElementById('stock').value)
    };
    
    try {
        const url = currentEditId 
            ? `${API_URL}/Products/${currentEditId}` 
            : `${API_URL}/Products`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            showMessage(currentEditId ? 'Product updated!' : 'Product added!', 'success');
            resetForm();
            loadProducts();
        } else {
            const error = await response.json();
            showMessage('Error: ' + (error.message || 'Operation failed'), 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Edit product
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/Products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const product = await response.json();
        
        currentEditId = id;
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('description').value = product.description || '';
        document.getElementById('stock').value = product.stock;
        
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('submitBtn').textContent = 'Update Product';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showMessage('Error loading product: ' + error.message, 'error');
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/Products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showMessage('Product deleted!', 'success');
            loadProducts();
        } else {
            const error = await response.json();
            showMessage('Error: ' + (error.message || 'Delete failed'), 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Cancel edit
document.getElementById('cancelBtn').addEventListener('click', resetForm);

function resetForm() {
    currentEditId = null;
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('cancelBtn').style.display = 'none';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// Load products on page load
loadProducts();