import{n as e,t}from"./apiServices-B7Wm1m_f.js";var n=document.querySelector(`#country-detail`),r=document.querySelector(`#theme-toggle`),i=document.querySelector(`#home-link`),a=`theme-preference`;function o(){let e=r?.querySelector(`.theme-text`),t=r?.querySelector(`.theme-icon`),n=localStorage.getItem(a),i=window.matchMedia(`(prefers-color-scheme: dark)`).matches,o=n===`dark`||!n&&i;o?document.body.classList.add(`dark-mode`):document.body.classList.remove(`dark-mode`),s(o);function s(n){e&&(e.textContent=n?`Light Mode`:`Dark Mode`),t&&(t.textContent=n?`☀️`:`🌙`)}r?.addEventListener(`click`,()=>{let e=document.body.classList.toggle(`dark-mode`);localStorage.setItem(a,e?`dark`:`light`),s(e)})}function s(e,t){if(!n)return;let r=`<span class="no-borders" style="color: var(--text-muted);">None</span>`;e.borders&&e.borders.length>0&&(r=`<div class="border-badges">${e.borders.map(e=>{let n=t.find(t=>t.code&&t.code.toUpperCase()===e.toUpperCase()||t.name&&t.name.toLowerCase()===e.toLowerCase());return`<a href="/detail.html?code=${e}" class="btn border-badge">${n?n.name:e}</a>`}).join(``)}</div>`),n.innerHTML=`
    <div class="detail-flag-wrapper">
      <img src="${e.flagUrl}" alt="${e.flagAlt}" class="detail-flag" />
    </div>

    <div class="detail-info">
      <h2 class="detail-title">${e.name}</h2>

      <div class="detail-columns">
        <div class="detail-col">
          <p><strong>Native Name:</strong> <span>${e.nativeName||e.name}</span></p>
          <p><strong>Population:</strong> <span>${e.formattedPopulation}</span></p>
          <p><strong>Region:</strong> <span>${e.region}</span></p>
          <p><strong>Sub Region:</strong> <span>${e.subregion}</span></p>
          <p><strong>Capital:</strong> <span>${e.capital}</span></p>
        </div>

        <div class="detail-col">
          <p><strong>Top Level Domain:</strong> <span>${e.topLevelDomain}</span></p>
          <p><strong>Currencies:</strong> <span>${e.currencyName}${e.currencySymbol?` (${e.currencySymbol})`:``}</span></p>
          <p><strong>Languages:</strong> <span>${e.languages&&e.languages.length>0?e.languages.join(`, `):`N/A`}</span></p>
        </div>
      </div>

      <div class="border-countries">
        <strong>Border Countries:</strong>
        ${r}
      </div>
    </div>
  `}async function c(){o(),i?.addEventListener(`click`,()=>{window.location.href=`/`});let r=new URLSearchParams(window.location.search),a=(r.get(`code`)||r.get(`country`))?.trim();if(console.log(`[Detail Page] Extracted URL code:`,a),!a){n&&(n.innerHTML=`
        <div style="grid-column: 1 / -1;">
          <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">No country specified in URL.</p>
          <a href="/" class="btn back-btn">&larr; Back to Home</a>
        </div>
      `);return}try{let r=await t(),i=Array.isArray(r)?r.map(t=>new e(t)):[];console.log(`[Detail Page] Total countries loaded:`,i.length);let o=i.find(e=>{let t=e.code&&e.code.toUpperCase()===a.toUpperCase(),n=e.name&&e.name.toLowerCase()===a.toLowerCase();return t||n});o?(console.log(`[Detail Page] Country found:`,o.name),document.title=`${o.name} - Where in the world?`,s(o,i)):(console.warn(`[Detail Page] No matching country found for:`,a),n&&(n.innerHTML=`
          <div style="grid-column: 1 / -1;">
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">Could not find details for "${a}".</p>
            <a href="/" class="btn back-btn">&larr; Back to Home</a>
          </div>
        `))}catch(e){console.error(`[Detail Page] Error loading data:`,e)}}c();