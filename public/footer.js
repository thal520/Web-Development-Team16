const checkbox = document.getElementById('click');

const box = document.getElementById('news');

checkbox.addEventListener('click', function handleClick() {
  if (checkbox.checked) {
    box.style.display = 'inline-block';
  } else {
    box.style.display = 'none';
  }
});