import{n as e,t}from"./apiServices-B7Wm1m_f.js";var n=[],r=document.querySelector(`#countries-grid`),i=document.querySelector(`#search-input`),a=document.querySelector(`#region-filter`),o=document.querySelector(`#theme-toggle`),s=`theme-preference`;function c(){let e=o?.querySelector(`.theme-text`),t=o?.querySelector(`.theme-icon`),n=localStorage.getItem(s),r=window.matchMedia(`(prefers-color-scheme: dark)`).matches,i=n===`dark`||!n&&r;i?document.body.classList.add(`dark-mode`):document.body.classList.remove(`dark-mode`),a(i);function a(n){e&&(e.textContent=n?`Light Mode`:`Dark Mode`),t&&(t.textContent=n?`☀️`:`🌙`)}o?.addEventListener(`click`,()=>{let e=document.body.classList.toggle(`dark-mode`);localStorage.setItem(s,e?`dark`:`light`),console.log(`[Theme] Toggled to ${e?`dark`:`light`} mode`),a(e)})}function l(e){let t={Africa:1,Americas:2,Asia:3,Europe:4,Oceania:5};return[...e].sort((e,n)=>{let r=e.region||``,i=n.region||``,a=(t[r]??99)-(t[i]??99);return a===0?e.name.localeCompare(n.name):a})}function u(e){if(r){if(e.length===0){r.innerHTML=`<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 1.1rem; padding: 2rem 0;">No matching countries found.</p>`;return}r.innerHTML=l(e).map(e=>`
        <a href="/detail.html?code=${e.code}" class="country-card-link">
          <article class="country-card" data-code="${e.code}">
            <div class="flag-wrapper">
              <img 
                class="country-flag" 
                src="${e.flagUrl}" 
                alt="${e.flagAlt}" 
                loading="lazy" 
              />
            </div>
            <div class="country-info">
              <h2 class="country-name">${e.name}</h2>
              <p><strong>Population:</strong> <span>${e.formattedPopulation}</span></p>
              <p><strong>Region:</strong> <span>${e.region}</span></p>
              <p><strong>Capital:</strong> <span>${e.capital}</span></p>
            </div>
          </article>
        </a>
      `).join(``)}}function d(){let e=i?.value.trim().toLowerCase()||``,t=a?.value.trim().toLowerCase()||``,r=n.filter(n=>{let r=n.name.toLowerCase().includes(e),i=!t||t===`all`||t===`filter by region`||n.region.toLowerCase()===t;return r&&i});console.log(`[Filter] Query: "${e}" | Region: "${t}" | Matches: ${r.length}`),u(r)}async function f(){c(),i?.addEventListener(`input`,d),a?.addEventListener(`change`,d);try{console.log(`[App] Fetching countries data...`);let r=await t();if(console.log(`[App] Loaded raw countries count:`,Array.isArray(r)?r.length:0),Array.isArray(r)&&r.length>0&&console.log(`[App] Sample raw record:`,r[0]),n=Array.isArray(r)?r.map(t=>new e(t)):[],!n.length){console.warn(`[App] No country models could be parsed.`);return}console.log(`[App] Country instances parsed:`,n.length),u(n)}catch(e){console.error(`[App] Initialization error:`,e)}}f();