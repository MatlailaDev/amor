// Mobile Menu Toggle
const openMenu = document.querySelector('.open');
const closeMenu = document.querySelector('.close');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

openMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
    openMenu.style.display = 'none';
    closeMenu.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
    closeMenu.style.display = 'none';
    openMenu.style.display = 'block';
    document.body.style.overflow = 'auto';
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        closeMenu.style.display = 'none';
        openMenu.style.display = 'block';
        document.body.style.overflow = 'auto';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to Top Functionality
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Calculate Amount Functionality
const serviceSelect = document.getElementById('serviceSelect');
const calculateSection = document.getElementById('calculateSection');
const durationInfo = document.getElementById('durationInfo');
const addonCheckboxes = document.querySelectorAll('input[name="addons"]');
const calculateBtn = document.getElementById('calculateBtn');
const baseAmount = document.getElementById('baseAmount');
const durationAmount = document.getElementById('durationAmount');
const addonsAmount = document.getElementById('addonsAmount');
const totalAmount = document.getElementById('totalAmount');

// Service duration mapping
const serviceDurations = {
    // Makeup Artistry
    'makeup_bridal': '2-3 hours',
    'makeup_engagement': '1.5-2 hours',
    'makeup_special_event': '1-1.5 hours',
    'makeup_editorial': '2-3 hours',
    'makeup_trial': '1.5-2 hours',
    
    // Luxury Spa Treatments
    'spa_signature_facial': '1 hour',
    'spa_detox_facial': '1.5 hours',
    'spa_body_wrap': '2 hours',
    'spa_aromatherapy': '1.5 hours',
    'spa_spa_day': '4-6 hours',
    
    // Eyelash Extensions
    'lashes_classic': '1.5-2 hours',
    'lashes_volume': '2-2.5 hours',
    'lashes_mega_volume': '2.5-3 hours',
    'lashes_hybrid': '2-2.5 hours',
    'lashes_fill': '1-1.5 hours',
    
    // Nail Services
    'nails_manicure_basic': '45-60 minutes',
    'nails_manicure_gel': '1-1.5 hours',
    'nails_pedicure_basic': '1-1.5 hours',
    'nails_pedicure_gel': '1.5-2 hours',
    'nails_nail_art': '30-45 minutes',
    'nails_full_set': '2.5-3 hours',
    
    // Therapeutic Massage
    'massage_swedish': '1 hour',
    'massage_deep_tissue': '1 hour',
    'massage_hot_stone': '1.5 hours',
    'massage_prenatal': '1 hour',
    'massage_couples': '1.5 hours',
    
    // SFX & Special Occasion
    'sfx_halloween': '2-3 hours',
    'sfx_theatrical': '2-4 hours',
    'sfx_character': '3-5 hours',
    'sfx_body_paint': '3-6 hours',
    'sfx_prosthetic': '4-8 hours',
    
    // Skincare Services
    'skin_consultation': '30-45 minutes',
    'skin_acne_treatment': '1.5 hours',
    'skin_anti_aging': '1.5 hours',
    'skin_hydrating': '1 hour',
    'skin_chemical_peel': '2 hours',
    
    // Brow & Lash Services
    'brow_shape': '30 minutes',
    'brow_tint': '30 minutes',
    'brow_lamination': '1 hour',
    'lash_tint': '30 minutes',
    'brow_lash_combo': '1.5 hours'
};

// Show/hide calculate section based on service selection
serviceSelect.addEventListener('change', function() {
    if (this.value) {
        calculateSection.style.display = 'block';
        durationInfo.style.display = 'flex';
        
        // Show estimated duration
        const estimatedDuration = serviceDurations[this.value] || 'To be confirmed';
        document.getElementById('estimatedDuration').textContent = estimatedDuration;
        
        // Reset and calculate initial amount
        resetCalculation();
        calculateAmount();
    } else {
        calculateSection.style.display = 'none';
        durationInfo.style.display = 'none';
    }
});

// Calculate amount when any input changes
addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateAmount);
});

// Calculate button (optional - for manual calculation)
calculateBtn.addEventListener('click', calculateAmount);

function calculateAmount() {
    const selectedService = serviceSelect.options[serviceSelect.selectedIndex];
    const basePrice = parseInt(selectedService.getAttribute('data-price')) || 0;
    
    // Calculate add-ons cost only
    let addonsCost = 0;
    addonCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            addonsCost += parseInt(checkbox.getAttribute('data-price')) || 0;
        }
    });
    
    // Calculate total (base price + add-ons only)
    const total = basePrice + addonsCost;
    
    // Update display
    baseAmount.textContent = `R${basePrice}`;
    durationAmount.textContent = `R0`;
    addonsAmount.textContent = `R${addonsCost}`;
    totalAmount.textContent = `R${total}`;
}

function resetCalculation() {
    addonCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    calculateAmount();
}

// Update WhatsApp message to include calculated amount
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = formData.get('date');
    const message = formData.get('message');
    
    // Get selected add-ons
    const selectedAddons = [];
    addonCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedAddons.push(checkbox.parentElement.querySelector('span').textContent);
        }
    });
    
    const total = totalAmount.textContent;
    
    // Format the message for WhatsApp
    const whatsappMessage = `
New Booking Request from Amor Beauty Website:

Name: ${name}
Phone: ${phone}
Service: ${service}
Date: ${date}
${selectedAddons.length > 0 ? `Add-ons: ${selectedAddons.join(', ')}\n` : ''}
Estimated Total: ${total}
Message: ${message || 'No additional notes'}

Please confirm this appointment and final pricing.`.trim();
    
    // Show copy instructions modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">📋 Booking Instructions</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="margin-bottom: 1rem; font-weight: 500;">Please follow these steps:</p>
                <ol style="margin-left: 1.5rem; margin-bottom: 1rem;">
                    <li style="margin-bottom: 0.5rem;">Click <strong>"Copy Message"</strong> to copy your booking details</li>
                    <li style="margin-bottom: 0.5rem;">Click <strong>"Open WhatsApp"</strong> to open WhatsApp</li>
                    <li style="margin-bottom: 0.5rem;">Paste the message and send it to Amor Beauty</li>
                </ol>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
                <button id="copyMessageBtn" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Copy Message</button>
                <button id="openWhatsAppBtn" style="
                    background: #25D366;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Open WhatsApp</button>
                <button id="closeModalBtn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal buttons
    document.getElementById('copyMessageBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(whatsappMessage).then(() => {
            this.textContent = '✓ Copied!';
            this.style.background = '#28a745';
            setTimeout(() => {
                this.textContent = 'Copy Message';
                this.style.background = 'var(--primary-color)';
            }, 2000);
        });
    });
    
    document.getElementById('openWhatsAppBtn').addEventListener('click', function() {
        // WhatsApp API URL- business number
        const whatsappURL = `https://wa.me/27817355138?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, '_blank');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        calculateSection.style.display = 'none';
        durationInfo.style.display = 'none';
        
        // Close modal
        document.body.removeChild(modal);
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
});

// Map functionality
document.getElementById('mapTrigger').addEventListener('click', () => {
    //Google Maps location
    const mapURL = 'https://www.google.com/maps/search/?api=1&query=Beauty+Salon+New+York';
    window.open(mapURL, '_blank');
});

// Photo Credits Accordion
const creditsTrigger = document.getElementById('creditsTrigger');
const creditsContent = document.getElementById('creditsContent');

creditsTrigger.addEventListener('click', () => {
    creditsTrigger.classList.toggle('active');
    creditsContent.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});