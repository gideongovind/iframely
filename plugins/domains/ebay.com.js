import log from '../../logging.js';
export { log };
  
export default {
  re: [
    /^(https):\/\/[www.]{0,}ebay.com\/itm\/[0-9]{5,}/i
  ],

  lowestPriority: true,

  mixins: [
    "*",
  ],

  getMeta: function (cheerio) {
    var $priceScope = cheerio('[itemprop="price"]');
    var price = $priceScope.attr('content');
    if (typeof price === 'undefined') {
      return;
    }

    return {
      price: price,
    }
  },
};
