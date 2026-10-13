const form = document.querySelector('#booking-form');
if (form) {
  const button = document.querySelector('#open-guest');
  const dialog = document.querySelector('#guest-dialog');
  const summary = document.querySelector('#selection-summary');
  form.addEventListener('change', () => {
    const selected = [...form.querySelectorAll('input[name="times"]:checked')];
    const total = selected.reduce((sum, input) => sum + Number(input.dataset.price), 0);
    button.disabled = selected.length === 0;
    summary.textContent = selected.length ? selected.length + ' ô · ' + selected.length * 30 + ' phút · Giá dự kiến: '
      + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total) : 'Chưa chọn ô giờ.';
  });
  button.addEventListener('click', () => dialog.showModal());
  document.querySelector('#close-guest').addEventListener('click', () => dialog.close());
}
