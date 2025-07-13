// ========== QUANTITY CONTROLS ==========
function initializeQuantityControls(card) {
  const plusBtn = card.querySelector('.plus');
  const minusBtn = card.querySelector('.minus');
  const quantityDisplay = card.querySelector('.quantity');

  let quantity = 0;

  plusBtn.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  minusBtn.addEventListener('click', () => {
    if (quantity > 0) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });
}

// ========== LOAD PRODUCTS FROM localStorage ==========
function renderStoredProductsFromJSON() {
  fetch('products.json')
    .then(response => {
      if (!response.ok) throw new Error("File not found or inaccessible");
      return response.json();
    })
    .then(catalog => {
      console.log("Loaded catalog:", catalog);

      const container = document.getElementById('catalogues');
      if (!container) {
        console.error("No #catalogues container found");
        return;
      }

      catalog.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', product.category || 'uncategorized');

        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.style}</p>
          <p>${product.price}</p>
          <div class="quantity-controls">
            <button class="minus">−</button>
            <span class="quantity">0</span>
            <button class="plus">+</button>
          </div>
        `;

        container.appendChild(card);
        initializeQuantityControls(card);
      });
    })
    .catch(err => {
      console.error("Failed to load catalog JSON:", err);
    });
}

document.addEventListener('DOMContentLoaded', renderStoredProductsFromJSON);

// ========== INITIAL SETUP ==========
document.addEventListener('DOMContentLoaded', () => {
 

  // Initialize quantity on hardcoded cards (if any)
  document.querySelectorAll('.card').forEach(card => {
    if (!card.dataset.category) {
      card.setAttribute('data-category', 'uncategorized');
    }
    initializeQuantityControls(card);
  });
});

// ========== SUBMIT TO WHATSAPP ==========
function submitOrder() {
  const messageLines = [];
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('h3')?.textContent;
    const style = card.querySelector('p:nth-of-type(1)')?.textContent;
    const price = card.querySelector('p:nth-of-type(2)')?.textContent;
    const quantity = parseInt(card.querySelector('.quantity')?.textContent);

    if (quantity > 0) {
      messageLines.push(`${title} | ${style} | ${price} | Quantity: ${quantity}`);
    }
  });

  if (messageLines.length === 0) {
    alert("Please select at least one product with quantity!");
    return;
  }

  const message = encodeURIComponent("Hello! I'm interested in these products:\n\n" + messageLines.join('\n'));
  const phoneNumber = "918123456789"; // Replace with your actual WhatsApp number
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
}

// ========== CATEGORY FILTER ==========
function filterCategory(category) {
  const cards = document.querySelectorAll('#catalogues .card');
  cards.forEach(card => {
    const cardCategory = card.dataset?.category || 'uncategorized';
    card.style.display = (category === 'all' || cardCategory === category) ? 'block' : 'none';
  });
}