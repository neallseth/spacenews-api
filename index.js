const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    var data = await getSpaceNews();
    res.send(data);
})

app.listen(port, () => console.log(`spacenews-api listening on port ${port}!`))


async function getSpaceNews() {
    var html = await getHTML('https://spacenews.com/segment/news/');
    var $ = cheerio.load(html);
    const articles = [];

    $('div.article-meta').each(function (i, elem) {
        var tags = [];
        var title = $(this).find('h2.launch-title').text().trim();
        var link = $(this).find('h2.launch-title > a').attr('href');
        var author = $(this).find('div.launch-author > a').text();
        var date = $(this).find('div.launch-author > .pubdate').text();
        var excerpt = $(this).find('p.post-excerpt').text().replace("\n", "");

        $(this).find('a.tinier').each(function (i, elem) {
            tag = $(this).text()
            tags[i] = tag.replace("\n", "").trim();
        });

        var article = {
            title: title,
            link: link,
            author: author,
            date: date,
            excerpt: excerpt,
            tags: tags
        }
        articles[i] = article;
    });
    return articles;
}

async function getHTML(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
