import log from '../../logging.js';
export { log };
  
export default {
  re: [
    /^(https)?:\/\/[www.]{0,}wayfair.com\/[a-zA-Z0-9-]{1,}\//i
  ],

  highestPriority: true,

  mixins: [
    "favicon",
    "canonical",
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
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/76.0',
          'Accept-Language': 'en-US;q=0.7,en;q=0.3',
        },
        prepareResult: function (error, response, body, cb) {

          // 404 means article is not emendable
          if (error || response.statusCode !== 200) {
            return cb(null);
          } else {
            let $ = cheerio.load(body);
            var description = $('meta[name="description"]').attr('content');
            var title = $("title").text();
            $('script[type="application/ld+json"]').each(function (i, elem) {
              let json = elem.children[0].data;
              if (json && json.includes('"@type":"Product"')) {
                // return price.
                let price = JSON.parse(json).offers.price;
                let canonical = JSON.parse(json).url;
                return cb(null, {
                  title: title,
                  description: description,
                  canonical: canonical,
                  price: price,
                });
              } 
            });
          }
        }
      }, cb);
    }
  },

  getLink: function (cheerio, request, url, cb) {
    request({
      uri: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/76.0',
        'Accept-Language': 'en-US;q=0.7,en;q=0.3',
      },
      prepareResult: function (error, response, body) {

        // 404 means article is not emendable
        if (error || response.statusCode !== 200) {
          return cb(null);
        } else {
          let $ = cheerio.load(body);
          $('script[type="application/ld+json"]').each(function (i, elem) {
            let json = elem.children[0].data;
            if (json && json.includes('"@type":"Product"')) {
              // return image.
              var image = JSON.parse(json).image;
              var links = [];

              if (image) {
                var size_M_src = image;
                var size_X_src = size_M_src.replace("/M/", "/X3/");
  
                //thumbnail
                links.push({
                  href: size_M_src,
                  type: CONFIG.T.image,
                  rel: CONFIG.R.thumbnail,
                });
              }

              return cb(null, links);
            }
          }, cb);
        }
      }
    });
  },
};
