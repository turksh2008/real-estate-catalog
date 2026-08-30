/* Data layer: fetch + normalize rows from the Google Apps Script web app.
   No Vue here — returns a plain Promise<Array>. */
(function (w) {
  'use strict';

  var CFG = w.APP_CONFIG;
  var PLACEHOLDER = w.PLACEHOLDER_IMG;

  // First non-empty value among the arguments.
  function pick() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return '';
  }

  // A sheet cell may hold an array or a delimited string of URLs.
  function parseImages(val) {
    var arr = [];
    if (Array.isArray(val)) {
      arr = val.slice();
    } else if (val !== undefined && val !== null && String(val).trim() !== '') {
      arr = String(val).split(/[\n,|;]+/);
    }
    arr = arr.map(function (s) { return String(s).trim(); }).filter(Boolean);
    return arr.length ? arr : [PLACEHOLDER];
  }

  // Map a raw row (any key casing) to a stable internal shape.
  // Frozen so Vue skips making it reactive => faster rendering for large lists.
  function normalizeProperty(p, index) {
    p = p || {};
    var id = pick(p.id, p.ID, p.Id, p.rowId, p.RowId, p.reference, p.Reference);
    return Object.freeze({
      _key: (id || 'row') + '-' + index,
      id: id || ('row-' + index),
      title: pick(p.title, p.Title),
      location: pick(p.location, p.Location),
      price: pick(p.price, p.Price),
      listingType: pick(p.listingType, p.ListingType, p.type, p.Type),
      propertyType: pick(p.propertyType, p.PropertyType, p.category, p.Category),
      status: pick(p.status, p.Status, p.availability, p.Availability),
      bedrooms: pick(p.bedrooms, p.Bedrooms, p.beds, p.Beds),
      bathrooms: pick(p.bathrooms, p.Bathrooms, p.baths, p.Baths),
      landSize: pick(p.landSize, p.LandSize, p.area, p.Area, p.size, p.Size),
      description: pick(p.description, p.Description, p.details, p.Details),
      images: Object.freeze(parseImages(pick(
        p.images, p.Images, p.image, p.Image, p.photos, p.Photos, p.pictures, p.Pictures
      )))
    });
  }

  // Accept a bare array or a wrapped payload ({ data: [...] }, etc.).
  function extractList(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];
    var keys = ['data', 'properties', 'items', 'records', 'rows', 'result'];
    for (var i = 0; i < keys.length; i++) {
      if (Array.isArray(data[keys[i]])) return data[keys[i]];
    }
    return [];
  }

  // One request with an abort timeout.
  function fetchOnce(url) {
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, CFG.requestTimeoutMs);
    var opts = { method: 'GET', redirect: 'follow', cache: 'no-store' };
    if (controller) opts.signal = controller.signal;

    return fetch(url, opts).then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }, function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  // Public: fetch with retry + backoff, resolves to a normalized array.
  function fetchProperties() {
    var url = CFG.webAppUrl +
      (CFG.webAppUrl.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();

    function attempt(n) {
      return fetchOnce(url)
        .then(function (data) {
          return extractList(data).map(normalizeProperty);
        })
        .catch(function (err) {
          if (n >= CFG.maxAttempts) throw err;
          return new Promise(function (resolve) { setTimeout(resolve, 1000 * n); })
            .then(function () { return attempt(n + 1); });
        });
    }

    return attempt(1);
  }

  w.PropertyAPI = {
    fetchProperties: fetchProperties,
    normalizeProperty: normalizeProperty,
    extractList: extractList,
    parseImages: parseImages
  };
})(window);
