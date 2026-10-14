const countdown = document.querySelector('[data-payment-countdown]');

if (countdown) {
  const expiresAt = Date.parse(countdown.dataset.expiresAt);
  const button = document.querySelector('[data-demo-confirm-button]');
  const updateCountdown = () => {
    const remainingSeconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    if (!Number.isFinite(remainingSeconds) || remainingSeconds === 0) {
      countdown.textContent = 'Phiên mẫu đã hết hạn';
      if (button) {
        button.disabled = true;
        button.textContent = 'Phiên mẫu đã hết hạn';
      }
      return false;
    }
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    countdown.textContent = `Phiên mẫu còn ${minutes}:${seconds}`;
    return true;
  };
  if (updateCountdown()) {
    const timer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(timer);
    }, 1000);
  }
}

document.querySelector('[data-print-receipt]')?.addEventListener('click', () => window.print());

const ownerSearch = document.querySelector('[data-owner-search]');
if (ownerSearch) {
  const rows = [...document.querySelectorAll('[data-owner-booking]')];
  const emptyMessage = document.querySelector('[data-owner-no-results]');
  const normalize = (value) => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  ownerSearch.addEventListener('input', () => {
    const search = normalize(ownerSearch.value.trim());
    let visibleCount = 0;
    for (const row of rows) {
      row.hidden = !normalize(row.dataset.searchText).includes(search);
      if (!row.hidden) visibleCount += 1;
    }
    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  });
}
