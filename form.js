// form.js – EmailJS contact form + scroll reveal animations
// Vidal Reñao · Website Demos
//
// ⚙️  SETUP: Replace the 3 values below with your EmailJS credentials.
//    1. Go to https://www.emailjs.com and create a free account
//    2. Add an Email Service (Gmail, Outlook, etc.)
//    3. Create an Email Template with variables: {{name}}, {{email}}, {{sector}}, {{message}}
//    4. Copy your Public Key, Service ID and Template ID here

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ─── EmailJS Form ─────────────────────────────────────────────────────────────
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Initialise EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  // Helper: get current UI language from i18n
  function currentLang() {
    return localStorage.getItem('lang') || 'de';
  }

  const STATUS_MSGS = {
    sending: { es: 'Enviando...', en: 'Sending...', de: 'Wird gesendet...' },
    success: {
      es: '✅ ¡Mensaje enviado! Te responderé pronto.',
      en: '✅ Message sent! I\'ll get back to you soon.',
      de: '✅ Nachricht gesendet! Ich melde mich bald.',
    },
    error: {
      es: '❌ Error al enviar. Escríbeme por WhatsApp.',
      en: '❌ Failed to send. Please write to me on WhatsApp.',
      de: '❌ Fehler beim Senden. Bitte schreibe mir per WhatsApp.',
    },
    required: {
      es: 'Por favor, rellena todos los campos.',
      en: 'Please fill in all required fields.',
      de: 'Bitte alle Pflichtfelder ausfüllen.',
    },
  };

  function setStatus(type, msg) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + type;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = currentLang();

    const name    = form.querySelector('#f-name').value.trim();
    const email   = form.querySelector('#f-email').value.trim();
    const message = form.querySelector('#f-msg').value.trim();

    if (!name || !email || !message) {
      setStatus('error', STATUS_MSGS.required[lang]);
      return;
    }

    setStatus('', STATUS_MSGS.sending[lang]);
    submitBtn.disabled = true;

    const templateParams = {
      name,
      email,
      sector: form.querySelector('#f-sector').value || '–',
      message,
    };

    try {
      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // Demo mode – simulate success without real sending
        await new Promise(r => setTimeout(r, 1000));
        setStatus('success', STATUS_MSGS.success[lang]);
        form.reset();
      } else {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        setStatus('success', STATUS_MSGS.success[lang]);
        form.reset();
      }
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error', STATUS_MSGS.error[lang]);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initForm();
});
