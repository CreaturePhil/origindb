module.exports = function(cacheObject) {
  return {
    /**
     * Increment a number.
     */
    inc: function(dbKey, jsonKey, value) {
      if (!cacheObject[dbKey]) cacheObject[dbKey] = {};
      if (typeof value !== 'number') return;
      if (isNaN(value)) return;

      var curVal = cacheObject[dbKey][jsonKey];
      if (typeof curVal !== 'number' || isNaN(curVal)) {
        cacheObject[dbKey][jsonKey] = 0;
        return;
      }

      cacheObject[dbKey][jsonKey] = curVal + value;

      return cacheObject[dbKey][jsonKey];
    },

    /**
     * Decrement a number.
     */
    dec: function(dbKey, jsonKey, value) {
      if (!cacheObject[dbKey]) cacheObject[dbKey] = {};
      if (typeof value !== 'number') return;
      if (isNaN(value)) return;

      var curVal = cacheObject[dbKey][jsonKey];
      if (typeof curVal !== 'number' || isNaN(curVal)) {
        cacheObject[dbKey][jsonKey] = 0;
        return;
      }

      cacheObject[dbKey][jsonKey] = curVal - value;

      return cacheObject[dbKey][jsonKey];
    },

    /**
     * Append a value to the end of an array.
     */
    push: function(dbKey, jsonKey, value) {
      if (!cacheObject[dbKey]) cacheObject[dbKey] = {};
      if (!Array.isArray(value)) return;

      var curVal = cacheObject[dbKey][jsonKey];
      if (!Array.isArray(curVal)) {
        cacheObject[dbKey][jsonKey] = [];
        return;
      }

      cacheObject[dbKey][jsonKey] = curVal.concat([value]);
      return cacheObject[dbKey][jsonKey];
    }
  };
};
