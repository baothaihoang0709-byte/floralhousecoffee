// --- XỬ LÝ THEME TOGGLE (ROBUST VERSION) ---
// Helper function to safely use localStorage without crashing if disabled/blocked
const safeStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('LocalStorage access denied or restricted', e);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage access denied or restricted', e);
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage access denied or restricted', e);
        }
    }
};

function toggleTheme() {
    const body = document.body;
    const btnIcon = document.querySelector('#theme-toggle i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        if (btnIcon) {
            btnIcon.classList.remove('fa-sun');
            btnIcon.classList.add('fa-moon');
        }
        safeStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        if (btnIcon) {
            btnIcon.classList.remove('fa-moon');
            btnIcon.classList.add('fa-sun');
        }
        safeStorage.setItem('theme', 'dark');
    }
}

// --- HÀM THÊM STYLE CHO KHUNG ĐIỆN THOẠI & LAPTOP (MỚI) ---
function injectMockupStyles() {
    const styleId = 'mockup-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* Phone Mockup Style */
            .phone-mockup {
                border: 8px solid #333;
                border-radius: 20px;
                overflow: hidden;
                position: relative;
                background: #000;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                margin: 0 auto 15px auto;
                max-width: 280px; /* Giới hạn chiều rộng giống điện thoại */
                transition: transform 0.3s ease;
            }
            .phone-mockup:hover { transform: translateY(-5px); }
            .phone-mockup img {
                display: block;
                width: 100%;
                height: auto;
                border-radius: 12px;
                object-fit: cover;
            }
            /* Camera notch giả cho điện thoại */
            .phone-mockup::before {
                content: '';
                position: absolute;
                top: 0; left: 50%;
                transform: translateX(-50%);
                width: 40%; height: 15px;
                background: #333;
                border-radius: 0 0 10px 10px;
                z-index: 2;
            }

            /* Laptop Mockup Style */
            .laptop-mockup {
                margin: 0 auto 15px auto;
                max-width: 100%;
                transition: transform 0.3s ease;
            }
            .laptop-mockup:hover { transform: translateY(-5px); }
            .laptop-screen {
                background: #000;
                border: 8px solid #333;
                border-radius: 10px 10px 0 0;
                overflow: hidden;
                position: relative;
                box-shadow: 0 0 0 1px #555; /* Viền màn hình */
            }
            /* Camera dot giả cho laptop */
            .laptop-screen::before {
                content: '';
                position: absolute;
                top: 5px; left: 50%;
                transform: translateX(-50%);
                width: 6px; height: 6px;
                background: #555;
                border-radius: 50%;
                z-index: 2;
            }
            .laptop-screen img {
                display: block;
                width: 100%;
                height: auto;
            }
            .laptop-base {
                height: 12px;
                background: #e0e0e0; /* Màu bạc của macbook */
                border-radius: 0 0 10px 10px;
                position: relative;
                border: 1px solid #ccc;
                background: linear-gradient(to bottom, #dedede 0%, #c5c5c5 100%);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            /* Khe mở laptop */
            .laptop-base::after {
                content: '';
                position: absolute;
                top: 0; left: 50%;
                transform: translateX(-50%);
                width: 60px; height: 4px;
                background: #a0a0a0;
                border-radius: 0 0 4px 4px;
            }
            
            /* Caption fix */
            .gallery-caption {
                text-align: center;
                font-family: 'Dancing Script', cursive;
                font-size: 1.2rem;
                color: var(--dark-green);
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS styles for mockups
    injectMockupStyles();

    // Theme initialization
    const savedTheme = safeStorage.getItem('theme');
    const btnIcon = document.querySelector('#theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (btnIcon) {
            btnIcon.classList.remove('fa-moon');
            btnIcon.classList.add('fa-sun');
        }
    }
    
    // App initialization
    checkLoginStatus(); // Check User
    
    // === QUAN TRỌNG: Render Ảnh Cảnh Sắc & Khoảnh Khắc ===
    renderGrid('venue-grid', venueImages, createImageElement);
    renderGrid('customer-grid', customerImages, createImageElement);
    renderGrid('reels-grid', reelsData, createReelElement);

    // Validation Listeners cho Form
    const nameInput = document.getElementById('c-name');
    const contactInput = document.getElementById('c-contact');
    const messageInput = document.getElementById('c-message');
    const feedbackMessageInput = document.getElementById('f-message');

    if(nameInput) { nameInput.addEventListener('input', function() { const len = this.value.length; document.getElementById('c-name-count').textContent = `${len}/20`; const isValid = validateName(this.value); const errorEl = document.getElementById('c-name-error'); if (!isValid && len > 0) { this.classList.add('invalid'); errorEl.style.display = 'block'; } else { this.classList.remove('invalid'); errorEl.style.display = 'none'; } }); }
    if(contactInput) { contactInput.addEventListener('input', function() { const val = this.value; const cleanLen = val.replace(/\s/g, '').length; if (cleanLen > 30) { let count = 0; let cutIndex = 0; for(let i=0; i<val.length; i++) { if(val[i] !== ' ') count++; if(count > 30) { cutIndex = i; break; } } if(count > 30) { this.value = val.substring(0, cutIndex); } } const currentCleanLen = this.value.replace(/\s/g, '').length; document.getElementById('c-contact-count').textContent = `${currentCleanLen}/30`; const isValid = validateContact(this.value); const errorEl = document.getElementById('c-contact-error'); if (!isValid && this.value.length > 0) { this.classList.add('invalid'); errorEl.style.display = 'block'; } else { this.classList.remove('invalid'); errorEl.style.display = 'none'; } }); }
    if(messageInput) { messageInput.addEventListener('input', function() { const len = this.value.length; document.getElementById('c-message-count').textContent = `${len}/250`; const isValid = validateMessage(this.value); const errorEl = document.getElementById('c-message-error'); if (!isValid && len > 0) { this.classList.add('invalid'); errorEl.style.display = 'block'; } else { this.classList.remove('invalid'); errorEl.style.display = 'none'; } }); }
    if(feedbackMessageInput) { feedbackMessageInput.addEventListener('input', function() { const len = this.value.length; document.getElementById('f-message-count').textContent = `${len}/250`; const isValid = validateMessage(this.value); const errorEl = document.getElementById('f-message-error'); if (!isValid && len > 0) { this.classList.add('invalid'); errorEl.style.display = 'block'; } else { this.classList.remove('invalid'); errorEl.style.display = 'none'; } }); }
});

// Navigation
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active-link'));
    let activeLink;
    if (pageId === 'venue' || pageId === 'customer' || pageId === 'reels') {
        activeLink = document.querySelector('.nav-item.dropdown .nav-link');
    } else {
        activeLink = document.querySelector(`.nav-link[onclick*="'${pageId}'"]`);
    }
    if (activeLink) { activeLink.classList.add('active-link'); }

    closeMobileMenu();
    window.scrollTo(0, 0);
}
function scrollToLetter() { const letterSection = document.getElementById('letter-section'); if(letterSection) letterSection.scrollIntoView({ behavior: 'smooth' }); }

// Hero Slider
const heroImages = [
    'https://i.postimg.cc/02yc2Kps/498538104-1261921889274933-6001674160814610449-n.jpg', 
    'https://i.postimg.cc/c4vvtzP0/497867622-1263538389113283-4720495622930196313-n.jpg',
    'https://i.postimg.cc/Wzh1rDWC/498652886-1264680568999065-611903234758446464-n.jpg',
    'https://i.postimg.cc/FFBRvZ14/499133961-1263538372446618-6327013886961987301-n.jpg',
    'https://i.postimg.cc/Zq4YHssk/499435069-1264680502332405-3611031519090959969-n.jpg',
    'https://i.postimg.cc/bJFzzyyy/499550909-1264680565665732-1749112946200219501-n.jpg',
    'https://i.postimg.cc/xT34HsmH/576476835-1422400803227040-4241813530490748244-n.jpg',
    'https://i.postimg.cc/Znhwv3KG/590293946-1441080991359021-3284284012678839203-n.jpg',
    'https://i.postimg.cc/7YwBxgR1/595435546-1446772444123209-4023446344088621073-n.jpg'
];
let currentHeroIndex = 0;
const heroSlideshow = document.getElementById('hero-slideshow');
if (heroSlideshow) {
    heroImages.forEach((url, index) => {
        const slide = document.createElement('div');
        slide.classList.add('hero-slide');
        if (index === 0) slide.classList.add('active');
        slide.style.backgroundImage = `url('${url}')`;
        heroSlideshow.appendChild(slide);
    });
}
function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        slides[currentHeroIndex].classList.remove('active');
        currentHeroIndex = (currentHeroIndex + 1) % slides.length;
        slides[currentHeroIndex].classList.add('active');
    }
}
setInterval(nextSlide, 5000);

// --- LOGIC AUTHENTICATION ---
let currentUser = null;

function checkLoginStatus() {
    const storedUser = safeStorage.getItem('floral_user');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            updateAuthUI();
        } catch(e) {
            console.warn("Invalid user data");
        }
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('nav-login');
    const registerBtn = document.getElementById('nav-register');
    const userNav = document.getElementById('nav-user');
    const logoutBtn = document.getElementById('nav-logout');
    const userNameDisplay = document.getElementById('user-name-display');

    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userNav.style.display = 'block';
        logoutBtn.style.display = 'block';
        userNameDisplay.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userNav.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showFloralFireworks("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", "Thiếu thông tin");
        return;
    }

    let users = [];
    const storedUsersDB = safeStorage.getItem('floral_users_db');
    if (storedUsersDB) {
        try { users = JSON.parse(storedUsersDB); } catch (err) { users = []; }
    }

    const validUser = users.find(u => u.username === username && u.password === password);

    if (validUser) {
        currentUser = { name: validUser.username, email: validUser.email };
        safeStorage.setItem('floral_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('modal-login');
        showFloralFireworks("Đăng nhập thành công! Chào mừng " + username + " đến với Floral House.", "Xin chào!");
        
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    } else {
        showFloralFireworks("Tên đăng nhập hoặc mật khẩu không đúng, hoặc bạn chưa đăng ký tài khoản!", "Rất tiếc!");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        showFloralFireworks("Vui lòng điền đầy đủ thông tin!", "Thiếu thông tin");
        return;
    }

    if (password !== confirmPassword) {
        showFloralFireworks("Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.", "Lỗi mật khẩu");
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        showFloralFireworks("Mật khẩu không đủ mạnh! Vui lòng nhập ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt.", "Mật khẩu yếu");
        return;
    }

    let users = [];
    const storedUsersDB = safeStorage.getItem('floral_users_db');
    if (storedUsersDB) {
        try { users = JSON.parse(storedUsersDB); } catch (err) { users = []; }
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
        showFloralFireworks("Tên đăng nhập '" + username + "' đã được sử dụng. Vui lòng chọn tên khác.", "Trùng tên");
        return;
    }

    const newUser = { username, email, password }; 
    users.push(newUser);
    
    safeStorage.setItem('floral_users_db', JSON.stringify(users));

    showFloralFireworks("Đăng ký tài khoản thành công! Vui lòng đăng nhập.", "Chúc mừng!");
    
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm-password').value = '';
    
    switchAuthModal('modal-register', 'modal-login');
}

function logoutUser() {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        safeStorage.removeItem('floral_user');
        currentUser = null;
        updateAuthUI();
        showFloralFireworks("Đã đăng xuất thành công. Hẹn gặp lại bạn!", "Tạm biệt");
    }
}

function switchAuthModal(current, target) {
    closeModal(current);
    openModal(target);
}

// VALIDATION LOGIC
function validateName(value) { return value.length >= 3 && value.length <= 20; }
function validateContact(value) { const cleanLength = value.replace(/\s/g, '').length; return cleanLength >= 10 && cleanLength <= 30; }
function validateMessage(value) { return value.length >= 5 && value.length <= 250; }

async function handleFormSubmit(event, formId) {
    event.preventDefault();
    if (formId === 'contact-form') {
        const name = document.getElementById('c-name').value; const contact = document.getElementById('c-contact').value; const message = document.getElementById('c-message').value; let isValid = true;
        if (!validateName(name)) { document.getElementById('c-name').classList.add('invalid'); document.getElementById('c-name-error').style.display = 'block'; isValid = false; }
        if (!validateContact(contact)) { document.getElementById('c-contact').classList.add('invalid'); document.getElementById('c-contact-error').style.display = 'block'; isValid = false; }
        if (!validateMessage(message)) { document.getElementById('c-message').classList.add('invalid'); document.getElementById('c-message-error').style.display = 'block'; isValid = false; }
        if (!isValid) { showFloralFireworks("Vui lòng kiểm tra lại thông tin nhập liệu!", "Chưa hoàn tất"); return; }
    }
    if (formId === 'feedback-form') {
        const message = document.getElementById('f-message').value; let isValid = true;
        if (!validateMessage(message)) { document.getElementById('f-message').classList.add('invalid'); document.getElementById('f-message-error').style.display = 'block'; isValid = false; }
        if (!isValid) { showFloralFireworks("Vui lòng nhập nội dung phản ánh hợp lệ!", "Chưa hoàn tất"); return; }
    }
    const form = document.getElementById(formId); const formData = new FormData(form); const action = form.getAttribute('action');
    try {
        const response = await fetch(action, { method: form.method, body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
            form.reset();
            if (formId === 'contact-form') { document.getElementById('c-name-count').textContent = '0/20'; document.getElementById('c-contact-count').textContent = '0/30'; document.getElementById('c-message-count').textContent = '0/250'; }
            if (formId === 'feedback-form') { document.getElementById('f-message-count').textContent = '0/250'; }
            let message = "";
            if (formId === 'contact-form') { message = "Cảm ơn bạn đã gõ cửa Floral House. Tụi mình đã nhận tin và sẽ kết nối lại ngay."; } 
            else if (formId === 'feedback-form') { message = "Floral House đã ghi nhận thông tin và sẽ hỗ trợ bạn sớm nhất về vấn đề này"; }
            showFloralFireworks(message, "Cảm ơn bạn!");
        } else { showFloralFireworks("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau!", "Lỗi hệ thống"); }
    } catch (error) { showFloralFireworks("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!", "Lỗi kết nối"); }
}

function showFloralFireworks(customMessage, customTitle) { 
    const overlay = document.getElementById('notification-overlay'); 
    const messageElement = document.getElementById('notification-message'); 
    const titleElement = overlay.querySelector('h3');
    
    if (customMessage) messageElement.textContent = customMessage; 
    if (customTitle && titleElement) titleElement.textContent = customTitle;
    else if (titleElement) titleElement.textContent = "Thông báo"; 

    overlay.style.display = 'flex'; 
    for(let i=0; i<30; i++) { createParticle(overlay); } 
}
function createParticle(container) {
    const particle = document.createElement('div'); particle.classList.add('particle');
    const icons = ['fa-leaf', 'fa-seedling', 'fa-spa', 'fa-lemon', 'fa-tree']; const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    particle.innerHTML = `<i class="fas ${randomIcon}"></i>`;
    const colors = ['#A0D6B4', '#D4AF37', '#ffffff', '#90EE90']; particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    const startX = window.innerWidth / 2; const startY = window.innerHeight / 2;
    particle.style.left = startX + 'px'; particle.style.top = startY + 'px'; container.appendChild(particle);
    const angle = Math.random() * Math.PI * 2; const velocity = 5 + Math.random() * 5;
    const tx = Math.cos(angle) * (200 + Math.random() * 200); const ty = Math.sin(angle) * (200 + Math.random() * 200);
    particle.animate([ { transform: 'translate(0, 0) scale(0)', opacity: 1 }, { transform: `translate(${tx}px, ${ty}px) scale(1.5) rotate(${Math.random()*360}deg)`, opacity: 0 } ], { duration: 1000 + Math.random() * 1000, easing: 'cubic-bezier(0, .9, .57, 1)', fill: 'forwards' });
    setTimeout(() => { particle.remove(); }, 2000);
}
function closeNotification() { document.getElementById('notification-overlay').style.display = 'none'; }

function openModal(modalId) { const modal = document.getElementById(modalId); if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; } if(window.innerWidth <= 768) closeMobileMenu(); }
function closeModal(modalId) { const modal = document.getElementById(modalId); if (modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; } }
window.onclick = function(event) { if (event.target.classList.contains('modal')) { event.target.classList.remove('active'); document.body.style.overflow = 'auto'; } }

const hamburger = document.querySelector(".hamburger"); const navMenu = document.querySelector(".nav-menu");
function closeMobileMenu() { if (navMenu.classList.contains('active')) { hamburger.classList.remove("active"); navMenu.classList.remove("active"); document.body.classList.remove("menu-open"); } }
function toggleMobileMenu(e) { if(e) e.stopPropagation(); const isActive = navMenu.classList.contains("active"); if (isActive) { closeMobileMenu(); } else { hamburger.classList.add("active"); navMenu.classList.add("active"); document.body.classList.add("menu-open"); } }
hamburger.addEventListener("click", toggleMobileMenu);
document.addEventListener('click', (e) => { if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) { closeMobileMenu(); } });
document.addEventListener('touchstart', (e) => { if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) { closeMobileMenu(); } }, {passive: true});
const dropdown = document.querySelector('.dropdown');
if(dropdown) { dropdown.addEventListener('click', function(e) { if (!e.target.closest('.sub-link')) { this.classList.toggle('active'); } }); }
window.addEventListener('scroll', () => { const header = document.querySelector('header'); header.style.boxShadow = window.scrollY > 50 ? "0 2px 10px rgba(0,0,0,0.1)" : "none"; });

// --- LIGHTBOX LOGIC ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeLightbox = document.querySelector('.lightbox-close');

function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
            const captionEl = this.closest('.gallery-item').querySelector('.gallery-caption');
            captionText.innerHTML = captionEl ? captionEl.innerHTML : "Floral House Moment";
            document.body.style.overflow = 'hidden';
        });
    });
}

initLightbox();

if(closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto';
    });
}

if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        if(e.target !== lightboxImg && e.target !== captionText) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });
}

// ==========================================
//  KHO CHỨA LINK ẢNH (DYNAMIC GALLERIES)
// ==========================================

const venueImages = [
    "https://i.postimg.cc/c4vvtzP0/497867622-1263538389113283-4720495622930196313-n.jpg",
    "https://i.postimg.cc/02yc2Kps/498538104-1261921889274933-6001674160814610449-n.jpg",
    "https://i.postimg.cc/Wzh1rDWC/498652886-1264680568999065-611903234758446464-n.jpg",
    "https://i.postimg.cc/FFBRvZ14/499133961-1263538372446618-6327013886961987301-n.jpg",
    "https://i.postimg.cc/Zq4YHssk/499435069-1264680502332405-3611031519090959969-n.jpg",
    "https://i.postimg.cc/bJFzzyyy/499550909-1264680565665732-1749112946200219501-n.jpg"
];

const customerImages = [
    "https://i.postimg.cc/xT34HsmH/576476835-1422400803227040-4241813530490748244-n.jpg",
    "https://i.postimg.cc/Znhwv3KG/590293946-1441080991359021-3284284012678839203-n.jpg",
    "https://i.postimg.cc/7YwBxgR1/595435546-1446772444123209-4023446344088621073-n.jpg"
];

const reelsData = [
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+1", caption: "Pha chế cùng Floral" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+2", caption: "Một ngày nắng đẹp" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+3", caption: "Góc chill cuối tuần" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+4", caption: "Không gian xanh" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+5", caption: "Chiều hoàng hôn" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+6", caption: "Nhạc chill" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+7", caption: "Góc học tập" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+8", caption: "Bạn bè tụ tập" },
    { img: "https://placehold.co/400x711/e8f5e9/2E5A48?text=Reel+9", caption: "Món mới" }
];

const captions = [
    "Góc nhỏ bình yên",
    "Nắng sớm mai",
    "Hoa nở trong vườn",
    "Khoảng trời riêng",
    "Tĩnh lặng",
    "Hương sắc tự nhiên",
    "Góc chill cuối tuần",
    "Thanh xuân rực rỡ",
    "Hạnh phúc giản đơn"
];

// --- CẬP NHẬT HÀM TẠO ẢNH: TỰ ĐỘNG CHỌN KHUNG ĐIỆN THOẠI/LAPTOP ---
function createImageElement(url, index) {
    if (!url || url.trim() === "") return null;
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Tạo ảnh trước để kiểm tra kích thước
    const img = new Image();
    img.src = url.trim();
    img.alt = "Floral House Image " + (index + 1);
    img.loading = "lazy";
    
    // Gắn sự kiện click mở lightbox (như cũ)
    img.onclick = function() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const captionEl = document.getElementById('caption');
        lightbox.style.display = "flex";
        lightboxImg.src = this.src;
        // Lấy caption từ container cha
        const wrapper = this.closest('.gallery-item');
        const siblingCaption = wrapper ? wrapper.querySelector('.gallery-caption') : null;
        captionEl.innerHTML = siblingCaption ? siblingCaption.innerHTML : "Floral House Moment";
        document.body.style.overflow = 'hidden';
    };

    // Khi ảnh tải xong -> Kiểm tra kích thước -> Chọn khung
    img.onload = function() {
        const isPortrait = this.naturalHeight > this.naturalWidth;
        // Xóa nội dung loading (nếu có)
        item.innerHTML = ''; 

        if (isPortrait) {
            // --- ẢNH DỌC: KHUNG ĐIỆN THOẠI ---
            const phoneFrame = document.createElement('div');
            phoneFrame.className = 'phone-mockup';
            // Chèn ảnh vào khung điện thoại
            phoneFrame.appendChild(this); 
            item.appendChild(phoneFrame);
        } else {
            // --- ẢNH NGANG: KHUNG LAPTOP ---
            const laptopFrame = document.createElement('div');
            laptopFrame.className = 'laptop-mockup';
            
            // Màn hình
            const screen = document.createElement('div');
            screen.className = 'laptop-screen';
            screen.appendChild(this); // Chèn ảnh vào màn hình
            laptopFrame.appendChild(screen);
            
            // Bàn phím/Đế
            const base = document.createElement('div');
            base.className = 'laptop-base';
            laptopFrame.appendChild(base);

            item.appendChild(laptopFrame);
        }

        // Thêm Caption vào cuối cùng
        const captionDiv = document.createElement('div');
        captionDiv.className = 'gallery-caption';
        captionDiv.innerText = captions[index % captions.length];
        item.appendChild(captionDiv);
    };

    return item;
}

function createReelElement(data, index) {
    const item = document.createElement('div');
    item.className = 'reel-item';
    
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = "Reel Thumbnail " + (index + 1);
    img.loading = "lazy";

    const overlay = document.createElement('div');
    overlay.className = 'reel-overlay';
    overlay.innerHTML = '<div class="reel-play-btn"><i class="fas fa-play"></i></div>';

    const caption = document.createElement('div');
    caption.className = 'reel-caption';
    caption.innerText = data.caption;

    item.appendChild(img);
    item.appendChild(overlay);
    item.appendChild(caption);
    return item;
}

function renderGrid(containerId, items, createItemFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile || items.length <= 8) {
        items.forEach((item, index) => {
            const el = createItemFn(item, index);
            if(el) container.appendChild(el);
        });
        return;
    }

    let renderedCount = 0;
    const batchSize = 8; 

    const renderBatch = () => {
        const frag = document.createDocumentFragment();
        const end = Math.min(renderedCount + batchSize, items.length);
        
        for (let i = renderedCount; i < end; i++) {
            const el = createItemFn(items[i], i);
            if(el) frag.appendChild(el);
        }
        container.appendChild(frag);
        renderedCount = end;
    };

    renderBatch();

    const sentinel = document.createElement('div');
    sentinel.style.width = '100%';
    sentinel.style.height = '20px'; 
    sentinel.style.gridColumn = '1 / -1'; 
    container.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (renderedCount < items.length) {
                sentinel.remove();
                renderBatch();
                if (renderedCount < items.length) {
                    container.appendChild(sentinel);
                }
            } else {
                sentinel.remove();
            }
        }
    }, { rootMargin: '200px' }); 

    observer.observe(sentinel);
}
