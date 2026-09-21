/**
 * Shashemene Flora Archive — Plant Database (Premium)
 * Add entries to the `plants` array below.
 */

const plants = [
  {
    id: "plant-001",
    nameEnglish: "Ethiopian Mint",
    nameOromo: "Damaksa",
    nameAmharic: "ሃሸና",
    nameScientific: "Mentha spicata L.",
    family: "Lamiaceae",
    region: "Shashemene Biodiversity Garden",
    distribution: "Widely cultivated in highland gardens; naturalised near water sources in Sidama Zone.",
    collector: "Derartu Taye",
    dateCollected: "2026-03-15",
    traditionalUse: "Used locally for digestive ailments, headaches, and as a general tonic. Leaves are brewed as tea or crushed for topical application on minor wounds.",
    preparation: "Fresh leaves steeped in hot water for 10–15 minutes. One cup taken twice daily before meals for digestive support.",
    warnings: "Generally considered safe in traditional doses. Consult a practitioner before use during pregnancy.",
    status: "Field Reported",
    references: "Field interview with local herbalist, Shashemene, March 2026. EBI preliminary survey notes (unpublished).",
    images: ["images/plants/ethiopian mint", "images/plants/afi.jpg"]
  },
  {
    id: "plant-002",
    nameEnglish: "African Wormwood",
    nameOromo: "Harmuusa",
    nameAmharic: "አረም",
    nameScientific: "Artemisia afra Jacq. ex Willd.",
    family: "Asteraceae",
    region: "Bale-Shashemene Highlands",
    distribution: "Common in highland grasslands and disturbed areas from 1,800–3,500m elevation.",
    collector: "Derartu Taye",
    dateCollected: "2026-04-02",
    traditionalUse: "Traditionally used for respiratory conditions, fever reduction, and as an insect repellent when burned as incense.",
    preparation: "Dried leaves and stems boiled in water; steam inhaled for congestion. Poultice applied to temples for headache relief.",
    warnings: "Not recommended for prolonged internal use. Avoid during pregnancy.",
    status: "Cross-Referenced",
    references: "Local ethnobotanical survey, 2026. Cross-referenced with EBI herbarium specimen #EBI-SH-042.",
    images: ["images/plants/african wormwood.jpg"]
  },
  {
    id: "plant-003",
    nameEnglish: "False Banana",
    nameOromo: "Waqeensa",
    nameAmharic: "ሽንኩርት",
    nameScientific: "Ensete ventricosum (Welw.) Cheesman",
    family: "Musaceae",
    region: "Sidama Zone, near Shashemene",
    distribution: "Staple crop across southern Ethiopian highlands; cultivated extensively in Sidama and Gurage areas.",
    collector: "Derartu Taye",
    dateCollected: "2026-02-20",
    traditionalUse: "Staple food crop with documented use of pseudostem extracts for wound healing and bone-setting support in traditional medicine.",
    preparation: "Pseudostem pulp fermented (kocho) for nutrition; sap applied directly to fractures and sprains under traditional practitioner guidance.",
    warnings: "Sap application for bone-setting requires trained traditional practitioner supervision.",
    status: "Lab Verified",
    references: "EBI ethnobotanical database entry. Lab verification: phytochemical screening, EBI Shashemene, 2026.",
    images: ["images/plants/ethiopian false banana.jpg", "images/plants/afi.jpg"]
  },
  {
    id: "plant-004",
    nameEnglish: "Kosso",
    nameOromo: "Hargessa",
    nameAmharic: "ቆሶ",
    nameScientific: "Hagenia abyssinica (Bruce) J.F.Gmel.",
    family: "Rosaceae",
    region: "Bale Mountain foothills",
    distribution: "Afromontane forests of Ethiopia, Kenya, Tanzania, and Uganda between 2,000–3,300m.",
    collector: "Lencho Taye",
    dateCollected: "2026-01-10",
    traditionalUse: "Bark powder traditionally used as anthelmintic (tapeworm treatment). One of the most documented Ethiopian medicinal plants in historical literature.",
    preparation: "Dried bark ground to powder; small doses taken with water on empty stomach under strict traditional dosage protocols.",
    warnings: "Toxic in large doses. Traditional use requires precise dosing — never exceed practitioner-recommended amounts.",
    status: "Cross-Referenced",
    references: "Abbink, J. (1995). Medicinal plants of Ethiopia. Cross-ref: EBI herbarium #EBI-BALE-018. Field notes, Lencho Taye, Jan 2026.",
    images: ["images/plants/kosso.jpg"]
  }
];

(function () {
  'use strict';

  const grid = document.getElementById('archive-grid');
  const searchInput = document.getElementById('archive-search');
  const filterContainer = document.getElementById('filter-tags');
  const modalOverlay = document.getElementById('plant-modal');
  const modalBody = document.getElementById('modal-body-content');
  const statTotal = document.getElementById('stat-plants-total');
  const statVerified = document.getElementById('stat-plants-verified');

  if (!grid) return;

  let activeFilter = 'all';
  let searchQuery = '';

  const regions = [...new Set(plants.map(p => p.region))];

  if (statTotal) statTotal.dataset.counter = plants.length;
  if (statVerified) {
    statVerified.dataset.counter = plants.filter(p => p.status === 'Lab Verified' || p.status === 'Cross-Referenced').length;
  }

  function getStatusClass(status) {
    if (status === 'Lab Verified') return 'badge--lab';
    if (status === 'Cross-Referenced') return 'badge--cross';
    return 'badge--field';
  }

  function getRelated(currentId) {
    const current = plants.find(p => p.id === currentId);
    if (!current) return [];
    return plants.filter(p => p.id !== currentId && p.region === current.region).slice(0, 3);
  }

  function filterPlants() {
    return plants.filter(plant => {
      const matchesRegion = activeFilter === 'all' || plant.region === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        plant.nameEnglish.toLowerCase().includes(q) ||
        plant.nameOromo.toLowerCase().includes(q) ||
        plant.nameAmharic.includes(q) ||
        plant.nameScientific.toLowerCase().includes(q) ||
        plant.traditionalUse.toLowerCase().includes(q) ||
        plant.region.toLowerCase().includes(q);
      return matchesRegion && matchesSearch;
    });
  }

  function renderCards(list) {
    if (!list.length) {
      grid.innerHTML = `<div class="archive-empty"><p>No plants match your search. Try a different term or filter.</p></div>`;
      return;
    }

    grid.innerHTML = list.map((plant, i) => `
      <article class="plant-card reveal" data-plant-id="${plant.id}" tabindex="0" role="button"
               aria-label="View details for ${plant.nameEnglish}" style="transition-delay: ${i * 60}ms">
        <div class="plant-card__image">
          <img src="${plant.images[0]}" alt="${plant.nameEnglish} — ${plant.nameScientific}" loading="lazy"
               onerror="this.src='images/plants/placeholder.svg'">
        </div>
        <div class="plant-card__body">
          <span class="badge ${getStatusClass(plant.status)}">${plant.status}</span>
          <div class="plant-card__names">
            <h3>${plant.nameEnglish}</h3>
            <p class="name-oromo">${plant.nameOromo}</p>
            <p class="name-amharic">${plant.nameAmharic}</p>
          </div>
          <p class="plant-card__scientific scientific-name">${plant.nameScientific}</p>
          <p class="plant-card__region">${plant.region}</p>
          <p class="plant-card__use">${plant.traditionalUse}</p>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.plant-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.plantId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.plantId); }
      });
    });

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(grid.querySelectorAll('.plant-card'),
        { opacity: 0, y: 28, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }
      );
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  }

  function openModal(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant || !modalOverlay || !modalBody) return;

    const related = getRelated(id);
    const citation = `${plant.nameScientific}. Collected ${plant.dateCollected}, ${plant.region}. Shashemene Flora Archive. Status: ${plant.status}.`;

    modalBody.innerHTML = `
      <div class="modal__gallery">
        ${plant.images.map((src, i) => `
          <img src="${src}" alt="${plant.nameEnglish} — image ${i + 1}" loading="lazy"
               onerror="this.src='images/plants/placeholder.svg'">
        `).join('')}
      </div>
      <div class="modal__body">
        <p class="label-upper">${plant.family || 'Plantae'}</p>
        <h2 id="modal-title">${plant.nameEnglish}</h2>
        <p class="name-oromo">${plant.nameOromo} · ${plant.nameAmharic}</p>
        <p class="scientific-name">${plant.nameScientific}</p>
        <div class="modal__meta">
          <span class="badge ${getStatusClass(plant.status)}">${plant.status}</span>
          <span>${plant.region}</span>
          <span>Collected by ${plant.collector}, ${plant.dateCollected}</span>
        </div>

        <div class="tabs">
          <div class="tab-list" role="tablist">
            <button class="tab-btn active" data-tab="use" role="tab">Traditional Use</button>
            <button class="tab-btn" data-tab="prep" role="tab">Preparation</button>
            <button class="tab-btn" data-tab="science" role="tab">Classification</button>
            <button class="tab-btn" data-tab="refs" role="tab">References</button>
          </div>
          <div class="tab-panel active" data-panel="use" role="tabpanel">
            <div class="modal__section">
              <h4>Traditional Use</h4>
              <p>${plant.traditionalUse}</p>
            </div>
            ${plant.warnings ? `<div class="modal__section"><h4>Warnings</h4><p>${plant.warnings}</p></div>` : ''}
          </div>
          <div class="tab-panel" data-panel="prep" role="tabpanel">
            <div class="modal__section">
              <h4>Preparation Method</h4>
              <p>${plant.preparation}</p>
            </div>
          </div>
          <div class="tab-panel" data-panel="science" role="tabpanel">
            <div class="modal__section">
              <h4>Scientific Classification</h4>
              <p><strong>Family:</strong> ${plant.family || '—'}</p>
              <p class="scientific-name"><strong>Species:</strong> ${plant.nameScientific}</p>
            </div>
            <div class="modal__section">
              <h4>Distribution</h4>
              <p>${plant.distribution || plant.region}</p>
            </div>
          </div>
          <div class="tab-panel" data-panel="refs" role="tabpanel">
            <div class="modal__section">
              <h4>References</h4>
              <p class="modal__references">${plant.references}</p>
            </div>
          </div>
        </div>

        ${related.length ? `
          <div class="modal__section">
            <h4>Related Specimens</h4>
            <div class="related-plants">
              ${related.map(r => `
                <div class="related-plants__item" data-plant-id="${r.id}" role="button" tabindex="0">
                  <img src="${r.images[0]}" alt="${r.nameEnglish}" onerror="this.src='images/plants/placeholder.svg'">
                  <span>${r.nameEnglish}</span>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

        <div class="modal__actions">
          <button class="btn btn--ghost btn--small" data-copy-citation="modal-citation">Copy Citation</button>
          <button class="btn btn--ghost btn--small" data-print>Print Record</button>
          <button class="btn btn--ghost btn--small" data-bookmark="${plant.id}">Bookmark</button>
          <a href="#" class="btn btn--primary btn--small" data-modal="pdf-download">Download PDF</a>
        </div>
        <p id="modal-citation" class="visually-hidden">${citation}</p>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    modalBody.querySelectorAll('.related-plants__item').forEach(item => {
      item.addEventListener('click', () => openModal(item.dataset.plantId));
    });

    initTabsInModal();
    initModalCitation();
    if (window.initTabs) window.initTabs();
  }

  function initTabsInModal() {
    const tabGroup = modalBody.querySelector('.tabs');
    if (!tabGroup) return;
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        tabGroup.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
      });
    });
  }

  function initModalCitation() {
    modalBody.querySelector('[data-copy-citation]')?.addEventListener('click', async () => {
      const text = document.getElementById('modal-citation')?.textContent.trim();
      if (text) await navigator.clipboard.writeText(text);
    });
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initFilters() {
    if (!filterContainer) return;
    const tags = [{ label: 'All Regions', value: 'all' }, ...regions.map(r => ({ label: r, value: r }))];
    filterContainer.innerHTML = tags.map(tag => `
      <button class="filter-tag${tag.value === 'all' ? ' active' : ''}" data-filter="${tag.value}">${tag.label}</button>
    `).join('');

    filterContainer.querySelectorAll('.filter-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        if (typeof gsap !== 'undefined') {
          gsap.to(grid, { opacity: 0, y: 12, duration: 0.2, onComplete: () => {
            renderCards(filterPlants());
            gsap.to(grid, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          }});
        } else {
          renderCards(filterPlants());
        }
      });
    });
  }

  function initSearch() {
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCards(filterPlants());
    });
  }

  function initModal() {
    if (!modalOverlay) return;
    modalOverlay.querySelector('.modal__close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initSearch();
    initModal();
    renderCards(plants);
  });
})();
