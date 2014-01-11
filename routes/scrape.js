//exports.scrape = function (req, res) {
//
//    url = "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2277958/";
//
//    request(url, function (err, resp, body) {
//        if (err) {
//            throw err;
//        } else {
//            $ = cheerio.load(body);
//
//            $('#data .name').each(function () {
//                console.log($(this).text());
//            });
//
//            res.render('scrape', { req: req, res: res });
//        }
//    });
//};