document.addEventListener('DOMContentLoaded', () => {
    const attachDeleteEvent = (form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const hiddenInput = form.querySelector('input[name="checkbox"]');
            console.log("Attempting to submit form with ID:", hiddenInput.value);
            if (hiddenInput.value) {
                form.parentElement.classList.add('fade-out');
                setTimeout(() => {
                    console.log("Submitting form...");
                    form.submit();
                }, 500);
            }
        });
    };

    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(attachDeleteEvent);
    const itemForm = document.querySelector('.item-form');
    itemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newItemInput = itemForm.querySelector('input[name="newItem"]');
        if (newItemInput.value.trim() !== '') {
            const newItemText = newItemInput.value.trim();
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    newItem: newItemText,
                }),
            });

            if (response.ok) {
                const newItem = await response.json(); 
                const newListItem = document.createElement('li');
                newListItem.className = 'item fade-in';
                newListItem.innerHTML = `
                    <form action="/delete" method="POST" class="delete-form">
                        <input type="hidden" name="checkbox" value="${newItem._id}">
                        <span class="item-text">${newItemText}</span>
                        <button type="submit" class="delete-btn"><i class="fas fa-trash"></i></button>
                    </form>
                `;
                document.querySelector('.item-list').appendChild(newListItem);
                attachDeleteEvent(newListItem.querySelector('.delete-form'));
                newItemInput.value = '';
            } else {
                console.error('Failed to add new item.');
            }
        }
    });
});
