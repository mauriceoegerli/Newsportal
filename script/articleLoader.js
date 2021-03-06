function ArticleLoader(newsportal) {
    this.newsportal = newsportal;

    this.loadArticle = function (articleTitle, articlePreviewText, articlePageName, articleLink, articleImage, articleDate, articleCategory) {
        let image = '';
        if (articleImage != '') {
            image = `<div class="article-image">
                        <img src="${articleImage}"></img>
                    </div>`
        }
        let article = `<div class="article-section">
            <a href="${articleLink}" target="_blank" class="no-format">
                <div class="article-container">
                    <div class="article-title">
                        <h3>${articleTitle}</h3>
                    </div>
                    <div class="article-content-container">
                        ${image}
                        <div class="article-preview-text">
                            <p>
                                ${articlePreviewText}
                            </p>
                        </div>
                    </div>
                </div>
            </a>
            <div class="article-page">
                <div class="article-page-name">
                    <p>${articlePageName}</p>
                </div>
                <div class="article-page-image">
                </div>
            </div>
        </div>`;

        $(`#articles-section-${articleCategory}`).append(article);
    }

    this.loadArticles = function (category) {
        let me = this;
        return new Promise(function (resolve, reject) {
            let sources = me.newsportal.settingsHandler.settings.sources.map(element => {
                return element['name'];
            });
            $.ajax({
                    url: `${me.newsportal.apiUrl}/getNewArticles.php`,
                    crossDomain: true,
                    data: {
                        "sources": sources,
                        "category": category
                    },
                })
                .done(function (data) {
                    let articles = [];
                    data.forEach(
                        element => {
                            element.channel.item.forEach(
                                item => {
                                    item['name'] = element.channel.title;
                                    articles.push(item);
                                });

                        });

                    articles.sort(function compare(a, b) {
                        let dateA = new Date(a.pubDate);
                        let dateB = new Date(b.pubDate);
                        return dateB - dateA;
                    });

                    articles.forEach((element, index) => {
                        let title = element.title;
                        let description = element.description;
                        let name = element.name;
                        let link = element.link;
                        let thumbnail = '';
                        let date = element.pubDate;
                        if (typeof articles[index].thumbnail != 'undefined') {
                            thumbnail = articles[index].thumbnail['@attributes'].url;
                        }
                        me.loadArticle(title, description, name, link, thumbnail, date, category);

                        if (index == articles.length - 1) {
                            resolve(data);
                        }
                    });
                });
        });
    }
}

//# sourceURL=articleLoader.js