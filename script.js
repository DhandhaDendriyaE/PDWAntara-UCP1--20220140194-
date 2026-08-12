document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FITUR TANYA AI (Halaman tanya-ai.html)
    // ==========================================
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const errorMessage = document.getElementById('errorMessage');

    if (chatForm && chatInput && chatBox) {

        // Database Balasan Dummy AI (Hardcoded / Keyword Matching)
        const aiResponses = [
            {
                keywords: ['makanan', 'rekomendasi', 'saran', 'menu', 'enak', 'favorit'],
                response: 'Rekomendasi terbaik kami adalah **Rendang Daging Sapi Khas Minang** dan **Ayam Lengkuas Rempah**! Keduanya dibuat dari resep rahasia Bu Yanti.'
            },
            {
                keywords: ['pedas', 'sambal', 'cumi'],
                response: 'Untuk yang suka pedas mantap, wajib coba **Sambal Bawang Cumi Asin** dan Rendang kami!'
            },
            {
                keywords: ['cemilan', 'kue', 'ringan', 'snack', 'keripik', 'nastar'],
                response: 'Kami punya **Keripik Tempe Daun Jeruk** yang super renyah dan **Nastar Keju Lumer** untuk camilan santai Anda.'
            },
            {
                keywords: ['harga', 'murah', 'biaya', 'bayar'],
                response: 'Harga produk kami sangat terjangkau, mulai dari Rp 15.000 untuk cemilan hingga Rp 65.000 untuk olahan daging porsi keluarga.'
            },
            {
                keywords: ['kirim', 'ongkir', 'pesan', 'order', 'beli'],
                response: 'Anda dapat memesan langsung melalui halaman Menu Produk atau menghubungi WhatsApp resmi Dapur Bu Yanti!'
            }
        ];

        const defaultResponse = 'Terima kasih atas pertanyaannya! Untuk informasi lebih rinci mengenai pesanan khusus atau stok, silakan kunjungi halaman Menu Produk kami atau hubungi Bu Yanti langsung.';

        // Handle Event Submit Form Chat
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();

            // 4. Validasi Form - Input Kosong
            if (userText === '') {
                if (errorMessage) errorMessage.classList.remove('d-none');
                return;
            }

            if (errorMessage) errorMessage.classList.add('d-none');

            // 1. Tampilkan Chat Bubble User
            appendUserMessage(userText);
            chatInput.value = '';

            // Scroll otomatis ke bawah
            scrollToBottom();

            // 3. Efek "AI Sedang Mengetik..."
            const typingIndicator = showTypingIndicator();
            scrollToBottom();

            // Simulasi Delay AI Mengetik (1200ms)
            setTimeout(() => {
                // Hapus indikator mengetik
                typingIndicator.remove();

                // 2. Dapatkan & Tampilkan Balasan AI
                const replyText = getAIReply(userText);
                appendAIMessage(replyText);
                scrollToBottom();
            }, 1200);
        });

        // Fungsi Menambahkan Bubble User
        function appendUserMessage(text) {
            const userBubbleGroup = document.createElement('div');
            userBubbleGroup.className = 'd-flex mb-3 justify-content-end align-items-start';
            userBubbleGroup.innerHTML = `
                <div class="chat-bubble-user p-3 rounded-3 bg-success text-white">
                    ${escapeHTML(text)}
                </div>
                <div class="bg-secondary text-white rounded-circle ms-2 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 35px; height: 35px;">
                    <i class="bi bi-person-fill"></i>
                </div>
            `;
            chatBox.appendChild(userBubbleGroup);
        }

        // Fungsi Menambahkan Indikator Mengetik
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'd-flex mb-3 align-items-start';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="bg-success text-white rounded-circle me-2 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 35px; height: 35px;">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="chat-bubble-ai p-3 rounded-3 bg-light border text-muted fst-italic">
                    <span class="spinner-grow spinner-grow-sm text-success me-1" role="status"></span>
                    Bu Yanti AI sedang mengetik...
                </div>
            `;
            chatBox.appendChild(typingDiv);
            return typingDiv;
        }

        // Fungsi Menambahkan Bubble Balasan AI
        function appendAIMessage(text) {
            const aiBubbleGroup = document.createElement('div');
            aiBubbleGroup.className = 'd-flex mb-3 align-items-start';
            aiBubbleGroup.innerHTML = `
                <div class="bg-success text-white rounded-circle me-2 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 35px; height: 35px;">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="chat-bubble-ai p-3 rounded-3 bg-light border text-dark">
                    ${text}
                </div>
            `;
            chatBox.appendChild(aiBubbleGroup);
        }

        // Logika AI Dummy Matching (Keyword Based)
        function getAIReply(input) {
            const lowerInput = input.toLowerCase();
            for (let item of aiResponses) {
                if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
                    return item.response;
                }
            }
            return defaultResponse;
        }

        function scrollToBottom() {
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        }
    }

    // ==========================================
    // 2. FITUR FILTER KATEGORI (Halaman menu.html)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (filterButtons.length > 0 && menuItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Ubah status tombol aktif
                filterButtons.forEach(btn => btn.classList.remove('btn-success', 'active'));
                filterButtons.forEach(btn => btn.classList.add('btn-outline-success'));
                
                button.classList.remove('btn-outline-success');
                button.classList.add('btn-success', 'active');

                const filterValue = button.getAttribute('data-filter');

                menuItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }
                });
            });
        });
    }

    // ==========================================
    // 3. FITUR TOMBOL KEMBALI KE ATAS (index.html)
    // ==========================================
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('d-none');
            } else {
                backToTopBtn.classList.add('d-none');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});