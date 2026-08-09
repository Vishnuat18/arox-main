/**
 * AROX ERP - Contact Form
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Sending...';

    try {
      const data = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]')?.value || '',
        subject: form.querySelector('[name="subject"]').value,
        message: form.querySelector('[name="message"]').value
      };

      const result = await API.post('/api/contact', data);

      if (result.success) {
        Toast.success('Message Sent!', result.message);
        form.reset();
      } else {
        Toast.error('Failed', result.message);
      }
    } catch (error) {
      Toast.error('Error', 'Failed to send message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
