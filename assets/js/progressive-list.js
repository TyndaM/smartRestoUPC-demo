(function () {
    function initProgressiveLists(root) {
        const scope = root || document;
        const lists = scope.querySelectorAll('[data-progressive-list]');

        lists.forEach(function (list) {
            const section = list.closest('[data-progressive-section]') || list.parentElement;
            const trigger = section ? section.querySelector('[data-progressive-trigger]') : null;
            const items = Array.from(list.querySelectorAll('[data-progressive-item]'));
            const initialCount = Math.max(parseInt(list.getAttribute('data-initial-count') || '4', 10), 1);
            const step = Math.max(parseInt(list.getAttribute('data-step') || String(initialCount), 10), 1);
            let visibleCount = items.length;

            if (!items.length) {
                if (trigger) {
                    trigger.hidden = true;
                }
                return;
            }

            function syncVisibility() {
                items.forEach(function (item, index) {
                    item.classList.toggle('is-hidden', index >= visibleCount);
                });

                if (!trigger) {
                    return;
                }

                const hasMore = visibleCount < items.length;
                trigger.hidden = !hasMore;
                trigger.disabled = !hasMore;
            }

            if (items.length > initialCount) {
                visibleCount = initialCount;

                if (trigger) {
                    trigger.addEventListener('click', function () {
                        visibleCount = Math.min(visibleCount + step, items.length);
                        syncVisibility();
                    });
                }
            } else if (trigger) {
                trigger.hidden = true;
                trigger.disabled = true;
            }

            syncVisibility();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initProgressiveLists(document);
    });

    window.MgcServiceInitProgressiveLists = initProgressiveLists;
})();
