document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const menuIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        if (navCta) navCta.classList.toggle('mobile-active');
        
        if (navLinks.classList.contains('mobile-active')) {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            if(navCta) navCta.classList.remove('mobile-active');
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.fade-in-up, .slide-up, .slide-left, .slide-right');
    animateElements.forEach(el => animateOnScroll.observe(el));

    // --- Tooltips clicáveis do formulário (funciona em toque, não só hover) ---
    let activeTooltipBtn = null;
    let activeTooltipEl = null;

    function closeTooltip() {
        if (activeTooltipEl) {
            activeTooltipEl.remove();
            activeTooltipEl = null;
            activeTooltipBtn = null;
        }
    }

    document.querySelectorAll('.tooltip-icon').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isSame = activeTooltipBtn === btn;
            closeTooltip();
            if (isSame) return;
            const popover = document.createElement('div');
            popover.className = 'tooltip-popover';
            popover.textContent = btn.getAttribute('data-tooltip');
            btn.insertAdjacentElement('afterend', popover);
            activeTooltipEl = popover;
            activeTooltipBtn = btn;
        });
    });
    document.addEventListener('click', closeTooltip);

    // Smooth scrolling for anchor links (fallback/enhancement over CSS behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // --- WhatsApp Form Redirection Handler ---
    const whatsappForm = document.getElementById('whatsappForm');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect Base Data
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const cep = document.getElementById('cep').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            
            // Collect Vehicle & Usage Data
            const nascimento = document.getElementById('nascimento').value;
            // Format Date from YYYY-MM-DD to DD/MM/YYYY
            let nascimentoFormatted = nascimento;
            if (nascimento) {
                const [year, month, day] = nascimento.split('-');
                nascimentoFormatted = `${day}/${month}/${year}`;
            }
            
            const veiculo = document.getElementById('veiculo').value;
            const placa = document.getElementById('placa').value;
            const modelo = document.getElementById('modelo').value;
            
            // Collect Radio Options
            const kitgas = document.querySelector('input[name="kitgas"]:checked')?.value || 'Não';
            const motoristaApp = document.querySelector('input[name="motorista_app"]:checked')?.value || 'Não';
            const usoComercial = document.querySelector('input[name="uso_comercial"]:checked')?.value || 'Não';
            const leilao = document.querySelector('input[name="leilao"]:checked')?.value || 'Não';
            
            // Base WhatsApp Number (Format without +, spaces or dashes)
            const whatsappNumber = "5583988691217"; 
            
            // Format Message
            let message = `Olá! Meu nome é *${nome}* e preenchi o formulário no site para uma cotação completa.%0A%0A`;
            
            message += `*--- Dados Pessoais ---*%0A`;
            message += `*WhatsApp:* ${telefone} %0A`;
            message += `*Email:* ${email} %0A`;
            message += `*CPF:* ${cpf} %0A`;
            message += `*Nascimento:* ${nascimentoFormatted} %0A`;
            message += `*CEP:* ${cep} %0A%0A`;
            
            message += `*--- Dados do Veículo ---*%0A`;
            message += `*Tipo de Veículo:* ${veiculo} %0A`;
            message += `*Placa:* ${placa} %0A`;
            message += `*Modelo/Ano:* ${modelo} %0A%0A`;
            
            message += `*--- Informações Adicionais ---*%0A`;
            message += `*Possui Kit Gás:* ${kitgas} %0A`;
            message += `*Motorista de App:* ${motoristaApp} %0A`;
            message += `*Uso Comercial:* ${usoComercial} %0A`;
            message += `*Veículo de Leilão:* ${leilao} %0A%0A`;
            
            message += `Por favor, poderia me enviar as opções disponíveis para o meu perfil?`;
            
            // Create URL and open new tab
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappURL, '_blank');
        });
    }
});
