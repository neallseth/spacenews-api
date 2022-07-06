const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    let data = await getSpaceNews();
    res.json(data);
})

app.listen(port, () => console.log(`spacenews-api listening on port ${port}!`))


async function getSpaceNews() {
    let html = await getHTML('https://spacenews.com/segment/news/');
    let $ = cheerio.load(html);
    const articles = [];

    $('div.article-meta').each(function (i, elem) {
        let tags = [];
        let title = $(this).find('h2.launch-title').text().trim();
        let link = $(this).find('h2.launch-title > a').attr('href');
        let author = $(this).find('div.launch-author > a').text();
        let date = $(this).find('div.launch-author > .pubdate').text();
        let excerpt = $(this).find('p.post-excerpt').text().replace("\n", "");

        $(this).find('a.tinier').each(function (i, elem) {
            tag = $(this).text()
            tags[i] = tag.replace("\n", "").trim();
        });

        let article = {
            title: title,
            link: link,
            author: author,
            date: date,
            description: excerpt,
            tags: tags
        }
        articles[i] = article;
    });
    return articles;
}

async function getHTML(url) {
    try {
        const {data} = await axios.get(url);
        return data;
    } catch (error) {
        console.error(error);
    }
}
