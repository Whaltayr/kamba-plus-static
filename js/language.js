/* KAMBA+ language.js — secure fixed version
   Supports both flat JSON keys like "home.hero.title"
   and nested JSON like { "home": { "hero": { "title": "..." } } }.
   Safe handling for data-i18n-html: only <br>, <em>, <strong> are allowed.
*/
(function () {
  'use strict';

  var DEFAULT_LANG = 'pt';
  var STORAGE_KEY = 'kamba_lang';
  var allowedLangs = ['pt', 'en'];

  function getSavedLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (allowedLangs.indexOf(saved) !== -1) return saved;

    var htmlLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
    if (allowedLangs.indexOf(htmlLang) !== -1) return htmlLang;

    return DEFAULT_LANG;
  }

  function getTranslation(dict, key) {
    if (!dict || !key) return undefined;

    /* First try flat keys:
       { "home.hero.title": "..." }
    */
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      return dict[key];
    }

    /* Then try nested keys:
       { "home": { "hero": { "title": "..." } } }
    */
    return String(key).split('.').reduce(function (acc, part) {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, dict);
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function allowSafeFormatting(value) {
    return escapeHTML(value)
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/&lt;em&gt;/gi, '<em>')
      .replace(/&lt;\/em&gt;/gi, '</em>')
      .replace(/&lt;strong&gt;/gi, '<strong>')
      .replace(/&lt;\/strong&gt;/gi, '</strong>');
  }

  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = getTranslation(dict, key);

      if (value !== undefined && value !== null) {
        el.textContent = String(value);
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var value = getTranslation(dict, key);

      if (value !== undefined && value !== null) {
        el.innerHTML = allowSafeFormatting(value);
      }
    });

    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-content');
      var value = getTranslation(dict, key);

      if (value !== undefined && value !== null) {
        el.setAttribute('content', String(value));
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      var value = getTranslation(dict, key);

      if (value !== undefined && value !== null) {
        el.setAttribute('aria-label', String(value));
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var value = getTranslation(dict, key);

      if (value !== undefined && value !== null) {
        el.setAttribute('title', String(value));
      }
    });
  }

  function setActiveButton(lang) {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang-btn') === lang;

      btn.classList.toggle('on', active);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function fetchJson(lang) {
    var paths = [
      'lang/' + lang + '.json',
      './lang/' + lang + '.json',
      'assets/lang/' + lang + '.json',
      './assets/lang/' + lang + '.json'
    ];

    var chain = Promise.reject();

    paths.forEach(function (path) {
      chain = chain.catch(function () {
        return fetch(path, { cache: 'no-store' }).then(function (res) {
          if (!res.ok) throw new Error('Missing language file: ' + path);
          return res.json();
        });
      });
    });

    return chain;
  }

  function setLanguage(lang) {
    if (allowedLangs.indexOf(lang) === -1) lang = DEFAULT_LANG;

    return fetchJson(lang)
      .then(function (dict) {
        applyTranslations(dict);

        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.setAttribute('lang', lang);
        setActiveButton(lang);

        window.dispatchEvent(new CustomEvent('kamba:languagechange', {
          detail: { lang: lang }
        }));

        console.info('[KAMBA+] Language loaded:', lang);
      })
      .catch(function (error) {
        console.warn('[KAMBA+] Translation load failed:', error);
        setActiveButton(lang);
      });
  }

  function init() {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang-btn'));
      });
    });

    setLanguage(getSavedLang());
  }

  window.KambaLanguage = {
    setLanguage: setLanguage,
    escapeHTML: escapeHTML,
    allowSafeFormatting: allowSafeFormatting
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();