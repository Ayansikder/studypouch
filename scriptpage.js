// Hamburger menu toggle for mobile navigation
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebarMenu');
  let overlay = document.querySelector('.sidebar-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
    hamburgerBtn.classList.remove('hide');
  }

  hamburgerBtn.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    const isOpen = sidebar.classList.contains('open');
    overlay.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      hamburgerBtn.classList.add('hide');
    } else {
      hamburgerBtn.classList.remove('hide');
    }
  });

  overlay.addEventListener('click', closeSidebar);
});
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

        // Support multiple images: product.image can be a string or array
        let images = [];
        if (Array.isArray(product.image)) {
          images = product.image;
        } else if (typeof product.image === 'string') {
          images = [product.image];
        }

        // Create round image selector buttons

        // Create small circular image buttons with thumbnails
        let imageButtons = '';
        images.forEach((img, idx) => {
          imageButtons += `
            <button class="img-thumb-btn" data-idx="${idx}" style="
              width:32px;height:32px;border-radius:50%;
              border:2px solid ${idx===0?'#007bff':'rgba(0,0,0,0.15)'};
              background: rgba(255,255,255,0.5);
              margin:0 4px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.08);padding:0;overflow:hidden;transition:border 0.2s;">
              <img src="${img}" style="width:28px;height:28px;object-fit:cover;border-radius:50%;opacity:${idx===0?'1':'0.7'};">
            </button>`;
        });

        card.innerHTML = `
          <img class="product-img" src="${images[0]}" alt="${product.name}" style="width:250px; height:250px;object-fit:cover;">
          <div class="img-selector" style="text-align:center;margin:8px 0 8px 0;">${imageButtons}</div>
          <h3>${product.name}</h3>
          <p>${product.style}</p>
          <div class="quantity-controls">
            <button class="minus">−</button>
            <span class="quantity">0</span>
            <button class="plus">+</button>
          </div>
        `;

        // Add image switching logic (only once, for .img-thumb-btn)
        const imgElem = card.querySelector('.product-img');
        const thumbBtns = card.querySelectorAll('.img-thumb-btn');
        thumbBtns.forEach((btn, idx) => {
          btn.addEventListener('click', function() {
            imgElem.src = images[idx];
            thumbBtns.forEach((b, i) => {
              b.style.border = (i === idx ? '#007bff 2px solid' : 'rgba(0,0,0,0.15) 2px solid');
              b.querySelector('img').style.opacity = (i === idx ? '1' : '0.7');
            });
          });
        });

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
  const phoneNumber = "919062504519"; // Replace with your actual WhatsApp number
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