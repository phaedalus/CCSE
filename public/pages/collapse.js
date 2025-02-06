document.addEventListener('DOMContentLoaded', function() {
    const coll = document.querySelectorAll('.collapsible-btn');
    
    coll.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const content = this.nextElementSibling;
            const isOpen = content.classList.contains('show');

            const isForm = content.querySelector('form');
            
            document.querySelectorAll('.content').forEach(c => {
                c.classList.remove('show');
                c.style.display = 'none';
            });

            if (!isOpen) {
                content.classList.add('show');
                content.style.display = 'block';

                if (isForm) {
                    content.style.display = 'block';
                }
            }
        });
    });
});