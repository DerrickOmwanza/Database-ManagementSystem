document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navClose = document.querySelector('[data-nav-close]');
  const navBackdrop = document.querySelector('[data-nav-backdrop]');
  const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-link'));

  const closeNav = () => {
    body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    }
  };

  const openNav = () => {
    body.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close navigation menu');
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (body.classList.contains('nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  [navClose, navBackdrop].forEach((control) => {
    if (control) {
      control.addEventListener('click', closeNav);
    }
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1080) {
        closeNav();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  document.querySelectorAll('[data-table-filter]').forEach((input) => {
    const targetSelector = input.getAttribute('data-table-filter');
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const tables = Array.from(document.querySelectorAll(targetSelector));
      const targetTable = tables.find((table) => table.offsetParent !== null) || tables[0];

      if (!targetTable) {
        return;
      }

      const rows = Array.from(targetTable.querySelectorAll('tbody tr'));

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = !query || text.includes(query) ? '' : 'none';
      });
    });
  });

  const reportSelector = document.querySelector('[data-report-selector]');
  if (reportSelector) {
    const sections = Array.from(document.querySelectorAll('[data-report-section]'));
    const updateSections = () => {
      const selected = reportSelector.value;
      sections.forEach((section) => {
        section.style.display = selected === 'all' || section.dataset.reportSection === selected ? '' : 'none';
      });
    };

    reportSelector.addEventListener('change', updateSections);
    updateSections();
  }

  document.querySelectorAll('[data-print-page]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
});
