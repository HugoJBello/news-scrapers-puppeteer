import { NewScrapedI } from "../models/NewScraped";
import { ContentScraper } from "./ContentScraper";
import { NodeHtmlMarkdown } from 'node-html-markdown'


export class ElHeraldoSoriaContentScraper extends ContentScraper {
    public newspaper: string
    public scraperId: string
    public excludedParagraphsEqual: string[] = [' ', '  ', ' \n', '  \n']
    public excludedParagraphsIncluding: string[] = ['Su privacidad es importante para nosotros']
    public mustStartWith = "https://heraldodiariodesoria.elmundo.es"

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
    }

    checkCorrectUrl(url: string) {
        if (url.startsWith(this.mustStartWith)) {
            return true
        }
        return false
    }
    async extractNewInUrl(url: string, scrapingId: string, newsIndex: number, scrapingIteration: number): Promise<NewScrapedI> {
        // https://heraldodiariodesoria.elmundo.es/articulo/soria/vino-soria-98-puntos-parker-que-cuesta-830-euros-botella/20230203221410353773.html
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        if (!this.checkCorrectUrl(url)) {
            console.log("INCORRECT url ", url);
            return {} as NewScrapedI
        }




        try {
            await this.initializePuppeteer();
        } catch (e) {
            console.log("error initializing")
        }
        try {
            try {
                await this.page.goto(url, { waitUntil: 'load', timeout: 0 });
            } catch (e) {
                return {} as NewScrapedI
            }

            const div = await this.page.$('div.article');
            const [headline, content, contentMarkdown, date, author, image, tags, sections, description] = await Promise.all([this.extractHeadline(), this.extractBody(div), this.extractBodyMarkdown(div), this.extractDate(url), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractSections(), this.extractDescription()])

            const { figuresUrl, figuresText } = await this.extractFigures(div)

            await this.browser.close();
            let results = {
                url,
                content,
                contentMarkdown,
                headline,
                tags,
                sections,
                date,
                image,
                figuresUrl,
                figuresText,
                author,
                description,
                scraperId: this.scraperId,
                newspaper: this.newspaper,
                newsIndex: newsIndex,
                scrapedAt: new Date(),
                scrapingIteration: scrapingIteration
            } as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            return null;
        }
    }

    async extractBody(div: any) {
        try {
            //const pars = await this.page.$$("div#maincontent")
            const pars = await this.page.$$("p")
            let text = ''
            for (let par of pars) {
                let textPar = await this.page.evaluate(element => element.textContent, par);
                const hasExcludedTextEqual = this.excludedParagraphsEqual.some((text) => textPar === text)
                const hasExcludedTextIncluded = this.excludedParagraphsIncluding.some((text) => textPar.includes(text))
                if (!hasExcludedTextEqual && !hasExcludedTextIncluded) {
                    textPar = textPar.trim()
                    if (textPar !== "") {
                        text = text + '\n' + textPar
                    }
                }
            }
            return text
        } catch (e) {
            console.log(e)
            return null
        }

    }



    async extractFigures(main: any): Promise<any> {
        let figuresUrl: string[] = []
        let figuresText: string[] = []

        try {
            let figs = await main.$$("figure")
            //const pics = await main.$$("picture")

            //figs = figs.concat(pics)

            for (let fig of figs) {
                const img = await fig.$("div > figure > img")
                const imgSolo = await fig.$("div > picture > img")
                const cap = await fig.$("figcaption")

                try {
                    let src = null
                    if (img) {
                        src = await img.getProperty('src');
                    } else if (imgSolo) {
                        src = await imgSolo.getProperty('src');
                    }
                    //const pars = await this.page.$$("div#maincontent")
                    const image = await src.jsonValue();
                    figuresUrl.push(image as string)

                } catch (e) {
                }

                if (img || imgSolo) {
                    try {
                        //const pars = await this.page.$$("div#maincontent")
                        let textPar = await this.page.evaluate(element => element.textContent, cap);
                        figuresText.push(textPar)
                    } catch (e) {
                        //console.log(e)
                        figuresText.push("")
                    }
                }

            }
        } catch (err) {

        }


        return { figuresUrl, figuresText }
    }


    async extractBodyMarkdown(div: any) {
        try {
            const pars = await this.page.$$("p, h3, h2")
            let text = ''
            for (let par of pars) {
                let tagName = await (await par.getProperty('tagName')).jsonValue()
                tagName = tagName.toLocaleLowerCase()

                let inner_html = await this.page.evaluate(element => element.innerHTML, par);
                const hasExcludedTextEqual = this.excludedParagraphsEqual.some((text) => inner_html === text)
                const hasExcludedTextIncluded = this.excludedParagraphsIncluding.some((text) => inner_html.includes(text))
                if (!hasExcludedTextEqual && !hasExcludedTextIncluded) {
                    let markdownText = NodeHtmlMarkdown.translate(inner_html).trim()

                    if (markdownText.trim() !== "" && (tagName === "h1" || tagName === "h2" || tagName === "h3")) {
                        markdownText = markdownText.trim()
                        markdownText = "## " + markdownText
                    }

                    if (markdownText !== "") {
                        text = text + '\n\n' + markdownText
                    }
                }
            }
            return text
        } catch (e) {
            console.log(e)
            return null
        }

    }


    cleanUp = (text: string) => {
        return text.replace(/\n/g, " ")
    }

    async extractDate(url: string): Promise<Date> {
        //20230204121936353779
        const splitted = url.split("/")[url.split("/").length - 1]
        const date = splitted.slice(0, 4) + "-" + splitted.slice(4, 6) + "-" + splitted.slice(6, 8)
        return new Date(date)
    }

    async extractDescription() {
        try {
            const description = await this.page.$eval("head > meta[name='description']", (element: any) => element.content);
            return description
        } catch (e) {
            return null
        }

    }

    async extractTags(): Promise<string[]> {
        try {
            let tags = await this.page.$eval("head > meta[name='keywords']", (element: any) => element.content);
            if (tags && tags.includes(",")) {
                return tags.split(",").map((elem: string) => (elem.trim()))
            }
            return [tags]
        } catch (e) {
            return null
        }

    }


    async extractSections(): Promise<string[]> {
        try {
            let sections = await this.page.$eval("head > meta[name='keywords']", (element: any) => element.content);
            if (sections && sections.includes(",")) {
                return sections.split(",").map((elem: string) => (elem.trim()))
            }
            return [sections]
        } catch (e) {
            return null
        }

    }


    async extractHeadline() {
        try {
            let headline = await this.page.$eval("head > meta[property='og:title']", (element: any) => element.content);
            return headline
        } catch (e) {
            return null
        }

    }

    async extractAuthor() {
        try {
            let headline = await this.page.$eval("head > meta[property='og:article:author']", (element: any) => element.content);
            return headline
        } catch (e) {
            return null
        }

    }

    async extractImage() {
        try {
            let headline = await this.page.$eval("head > meta[property='og:image']", (element: any) => element.content);
            return headline
        } catch (e) {
            return null
        }

    }


    async clickOkButtonCookie() {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }


    }

}
