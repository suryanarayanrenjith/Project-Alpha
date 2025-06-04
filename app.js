document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const modal = document.getElementById('negotiation-modal');
    const negotiatedPriceInput = document.getElementById('negotiated-price');
    const microphoneIcon = document.querySelector('.microphone-icon');
    let currentProductId = null;

    // Set up speech recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    if (recognition) {
        recognition.lang = 'en-IN';
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const number = parseFloat(transcript.replace(/[^0-9.]/g, ''));
            if (!isNaN(number)) {
                negotiatedPriceInput.value = number.toFixed(2);
            }
        };
    }

    // Sample product data with vegetable names and prices in rupees per kilogram
    const products = [
        { id: 1, name: 'Carrot', price: 30.0 },
        { id: 2, name: 'Tomato', price: 40.0 },
        { id: 3, name: 'Broccoli', price: 80.0 },
        { id: 4, name: 'Spinach', price: 50.0 },
        { id: 5, name: 'Bell Pepper', price: 60.0 },
        { id: 6, name: 'Cucumber', price: 35.0 },
        { id: 7, name: 'Potato', price: 25.0 },
        { id: 8, name: 'Onion', price: 28.0 },
        // Add more vegetable products as needed
    ];

    // Function to generate a random response for negotiation
    function generateNegotiationResponse() {
        const responses = [
            "Sure, I can accept that!",
            "Hmm, can we meet in the middle?",
            "I appreciate the offer, but can you go a bit higher?",
            "I'm sorry, but that's too low. Can you increase the price?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Render product list
    function renderProductList() {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <p>${product.name} - ₹${product.price.toFixed(2)} / kg</p>
                <button class="button" onclick="initiateNegotiation(${product.id})">Negotiate</button>
            `;
            productList.appendChild(productElement);
        });
    }

    // Function to initiate negotiation modal
    window.initiateNegotiation = function (productId) {
        currentProductId = productId;
        const stored = localStorage.getItem('negotiatedPrice_' + productId);
        if (stored) {
            negotiatedPriceInput.value = stored;
        } else {
            negotiatedPriceInput.value = products.find(product => product.id === productId).price.toFixed(2);
        }
        modal.style.display = 'flex';
        negotiatedPriceInput.focus();
        if (recognition) {
            recognition.stop();
        }
    };

    // Function to close negotiation modal
    window.closeModal = function () {
        modal.style.display = 'none';
    };

    // Submit negotiation

    // Function to submit negotiation
    window.submitNegotiation = function () {
        const negotiatedPrice = parseFloat(negotiatedPriceInput.value);
        if (!isNaN(negotiatedPrice) && negotiatedPrice >= 0) {
            if (currentProductId !== null) {
                localStorage.setItem('negotiatedPrice_' + currentProductId, negotiatedPrice.toFixed(2));
            }
            const response = generateNegotiationResponse();
            alert(response);
            closeModal();
        } else {
            alert('Please enter a valid negotiated price.');
        }
    };

    if (microphoneIcon) {
        microphoneIcon.addEventListener('click', function () {
            if (recognition) {
                recognition.start();
            } else {
                alert('Speech recognition is not supported in this browser.');
            }
        });
    }

    // Close modal when clicking outside or pressing ESC
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Initial rendering
    renderProductList();
});
