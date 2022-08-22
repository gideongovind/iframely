import log from '../../logging.js';
export { log };
  
export default {
  // re: [
  //   /^(https):\/\/[www.]{0,}homedepot.com\/p\/[^\s]{1,}\/[0-9]{5,}/i
  // ],

  highestPriority: true,

  mixins: [
    "*",
  ],

  getMeta: function (cheerio, request, url, cb) {
    log(' <<< -------  getMeta -->', url);
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
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/76.0',
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
