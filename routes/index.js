/*
 * GET home page.
 */

var cheerio = require('cheerio');
var request = require('request');

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

exports.scrape = function (req, res) {
//    url = "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2277958/";
    url = "http://www.ncbi.nlm.nih.gov/pmc/articles/" + req.param("articleId");

    request(url, function (err, resp, body) {
        if (err) {
            throw err;
        } else {
            $ = cheerio.load(body);

            $('meta').each( function() {
                var elementContent = ($(this).attr("content"));
                var elementName = ($(this).attr("name"));

                switch (elementName) {
                    case "citation_authors":
                        citationAuthors = elementContent;
                        break;
                    case "citation_date":
                        citationDate = elementContent;
                        break;
                    case "citation_title":
                        citationTitle = elementContent;
                        break;
                    case "citation_journal_title":
                        citationJournalTitle = elementContent;
                        break;
                    case "citation_volume":
                        citationVolume = elementContent;
                        break;
                }});

            $('.citation-flpages').each(function () {
                pages = ($(this).text());
            });

            citationAuthors = citationAuthors.split(',');
            x = new Array();

            citationAuthors.forEach( function (value) {
                var mehNonReverse = value.split(" ");
                var mehReverse = mehNonReverse.reverse();
                lastName = mehReverse[0];
                mehNonReverse.pop();
                if (mehNonReverse.length > 1) {
                    shit = new Array();
                    mehNonReverse.reverse().forEach( function (i) {
                        var p = i.split("")[0];
                        if(p == p.toUpperCase()) {
                            shit.push(p);
                        }
                    });
                     x.push(lastName + " " + shit.join(""))

                } else {
                    initials = mehNonReverse[0].split("")[0];
                    x.push(lastName + " " + initials);
                }
            });

            citationAuthors = x.join(", ");

            citationDate = citationDate.replace(/[^0-9.]/g, "");
            pages = pages.split('–');

            if(pages.length > 1) {

                pages[0] = pages[0].replace(/[^0-9.]/g, "");
                pages[1] = pages[1].replace(/[^0-9.]/g, "").replace(".", "");
                pages = pages[0] + "-" + pages[1]
            } else {
                pages = pages[0].replace(/[^0-9.]/g, "");
            }

            res.render('scrape', {
                citationAuthors: citationAuthors,
                citationDate: citationDate,
                citationTitle: citationTitle,
                citationJournalTitle: citationJournalTitle,
                citationVolume: citationVolume,
                pages: pages
            });
        }
    });
};