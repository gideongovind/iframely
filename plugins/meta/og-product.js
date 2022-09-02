export default {

    // https://developers.pinterest.com/docs/rich-pins/products/?
    getMeta: function(og, meta, cheerio) {
        var price = og.price || (meta.product && meta.product.price);

        if (price !== undefined) {
            return {
                price: price && (price.amount || price.standard_amount),
                currency: price && price.currency,
                brand: og.brand,
                product_id: og.upc || og.ean || og.isbn,
                availability: og.availability || meta.availability
            };
        }
        // search for schema.org json data and find the product price.
        let json = cheerio('script[type="application/ld+json"]').html();
        if (json && json.includes('"@type": "Product"')) {
            let price = JSON.parse(json).offers[0].price;
            // return price.
            return {
                price: price,
            };
        }

    }
};
