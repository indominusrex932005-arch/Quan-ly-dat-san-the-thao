const form = document.querySelector('#booking-form');
if (form) {
  const button = document.querySelector('#open-guest');
  const dialog = document.querySelector('#guest-dialog');
  const summary = document.querySelector('#selection-summary');
  const price = document.querySelector('#selection-price');
  const selectedTimes = document.querySelector('#selected-times');
  const nameInput = document.querySelector('#guest-name');
  const phoneInput = document.querySelector('#guest-phone');
  const submitButton = document.querySelector('#submit-guest');
  const datePicker = document.querySelector('#date');
  const displayedDate = form.querySelector('input[type="hidden"][name="date"]').value;
  const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  function updateSelection() {
    const selected = [...form.querySelectorAll('input[name="times"]:checked')];
    const total = selected.reduce((sum, input) => sum + Number(input.dataset.price), 0);
    const dateChanged = datePicker.value !== displayedDate;
    button.disabled = selected.length === 0 || dateChanged;
    summary.textContent = dateChanged ? 'Bấm “Xem lịch” để áp dụng ngày mới.'
      : selected.length ? selected.length + ' ô · ' + selected.length * 30 + ' phút' : 'Chưa chọn ô giờ.';
    price.textContent = selected.length ? currency.format(total) : '—';
    const fragment = document.createDocumentFragment();
    for (const input of selected) {
      const chip = document.createElement('span');
      chip.className = 'selected-time';
      chip.textContent = input.value + '–' + input.dataset.end;
      fragment.append(chip);
    }
    if (!selected.length) {
      const empty = document.createElement('p');
      empty.className = 'selection-empty';
      empty.textContent = 'Chọn ô giờ để bắt đầu.';
      fragment.append(empty);
    }
    selectedTimes.replaceChildren(fragment);
  }

  function validateGuest() {
    nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? 'Hãy nhập họ tên có ít nhất 2 ký tự.' : '');
    const normalizedPhone = phoneInput.value.trim().replace(/[\s.-]/g, '').replace(/^\+84/, '0');
    phoneInput.setCustomValidity(/^0\d{9}$/.test(normalizedPhone) ? '' : 'Nhập số điện thoại Việt Nam gồm 10 số, bắt đầu bằng 0 hoặc +84.');
  }

  form.addEventListener('change', updateSelection);
  datePicker.addEventListener('change', updateSelection);
  nameInput.addEventListener('input', validateGuest);
  phoneInput.addEventListener('input', validateGuest);
  button.addEventListener('click', () => {
    if (!button.disabled) {
      dialog.showModal();
      nameInput.focus();
    }
  });
  document.querySelector('#close-guest').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => button.focus());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  form.addEventListener('submit', event => {
    validateGuest();
    if (!form.reportValidity() || button.disabled) {
      event.preventDefault();
      return;
    }
    nameInput.value = nameInput.value.trim();
    submitButton.disabled = true;
    submitButton.textContent = 'Đang kiểm tra thông tin…';
  });
  window.addEventListener('pageshow', () => {
    submitButton.disabled = false;
    submitButton.textContent = 'Tiếp tục xác nhận →';
    updateSelection();
  });
  updateSelection();
}
