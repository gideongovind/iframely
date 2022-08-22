import log from '../../logging.js';
export { log };
  
export default {
  re: [
    /^(https):\/\/[www.]{0,}walmart.com\/ip\/[^\s$.?#]{1,}\/[0-9]{5,}/i
  ],

  lowestPriority: true,

  mixins: [
    "*",
  ],

  getMeta: function (cheerio, request, url, cb) {
    var $priceScope = cheerio('[itemprop="price"]');
    var price = $priceScope.attr('content');
    if (typeof price !== 'undefined') {
      return {
        price: price,
      }
    } else {
      request({
        uri: url,
        headers: {
          'User-Agent': 'iframely/gist',
          'Accept-Language': 'en-US;q=0.7,en;q=0.3',
        },
        prepareResult: function (error, response, body, cb) {

          // 404 means article is not emendable
          if (error || response.statusCode !== 200) {
            return cb(null);
          } else {
            let $ = cheerio.load(body);
            $('script[type="application/ld+json"]').each(function (i, elem) {
              let json = elem.children[0].data;
              if (json && json.includes('"@type":"Product"')) {
                // return price.
                let price = JSON.parse(json).offers.price;
                return cb(null, {
                  price: price,
                });
              }
            });
          }
        }
      }, cb);
    }
  },
};
