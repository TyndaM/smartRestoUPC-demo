(function () {
    const form = document.getElementById('contactForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);
        const subject = String(formData.get('subject') || 'Demande de renseignements');
        const body = [
            'Nom : ' + String(formData.get('name') || ''),
            'E-mail : ' + String(formData.get('email') || ''),
            '',
            String(formData.get('message') || '')
        ].join('\n');
        const mailto = 'mailto:mgc.service@upc.ac.cd?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        window.location.href = mailto;
    });
})();