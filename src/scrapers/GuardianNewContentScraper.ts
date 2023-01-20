import {NewScrapedI} from "../models/NewScraped";
import {ContentScraper} from "./ContentScraper";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'

export class GuardianNewContentScraper extends ContentScraper {
    public newspaper: string
    public scraperId: string
    public excludedParagraphs: string[] = []

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
    }

    async extractNewInUrl(url: string, scrapingId:string, newsIndex:number, scrapingIteration: number): Promise<NewScrapedI> {
        // https://www.theguardian.com/film/2021/jan/06/ham-on-rye-review-subversive-satire
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        try {
            await this.initializePuppeteer();
        } catch (e) {
            console.log("error initializing")
        }
        try {
            try {
                await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            } catch (e) {
                return {} as NewScrapedI
            }

            const div = await this.page.$('article');
            const [headline, content,contentMarkdown, date, author, image, tags, description] = await Promise.all([this.extractHeadline(), this.extractBody(div),this.extractBodyMarkdown(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractDescription()])

            await this.browser.close();

            let results = {
                url,
                content,
                contentMarkdown,
                headline,
                tags,
                date,
                image,
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
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            return null;
        }
    }

    async extractBody(div: any) {
        try {
            //const pars = await this.page.$$("div#maincontent")
            const pars = await div.$$("p")
            let text = ''
            for (let par of pars) {
                const textPar = await this.page.evaluate(element => element.textContent, par);
                const hasExcludedText = this.excludedParagraphs.some((text) => textPar.includes(text))
                if (!hasExcludedText) {
                    text = text + '\n ' + textPar
                }
            }
            return text
        } catch (e) {
            console.log(e)
            return null
        }

    }

    async extractBodyMarkdown(div: any) {
        try {
            const pars = await this.page.$$("p, h3, h3")
            let text = ''
            for (let par of pars) {
                const tagName = await (await par.getProperty('tagName')).jsonValue()

                let inner_html = await this.page.evaluate(element => element.innerHTML, par);
                const hasExcludedText = this.excludedParagraphs.some((text) => inner_html == text)
                if (!hasExcludedText) {
                    let markdownText = NodeHtmlMarkdown.translate(inner_html).trim()
                    
                    if (markdownText.trim() !== "" && (tagName === "h1" || tagName === "h2" || tagName === "h3")){
                        markdownText = markdownText.trim()
                        markdownText = "## " + markdownText
                    }

                    if (markdownText !== ""){
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

    async extractDate(): Promise<Date> {
        try {
            let date = await this.page.$eval("head > meta[property='article:published_time']", (element: any) => element.content);
            date = new Date(date)
            return date
        } catch (e) {
            return null
        }
    }

    async extractDescription() {
        try {
            const description = await this.page.$eval("head > meta[property='og:description']", (element: any) => element.content);
            return description
        } catch (e) {
            return null
        }

    }

    async extractTags(): Promise<string[]> {
        try {
            let tags = await this.page.$eval("head > meta[property='article:tag']", (element: any) => element.content);
            if (tags && tags.includes(",")) {
                return tags.split(",").map((elem: string) => (elem.trim()))
            }
            return [tags]
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
            let headline = await this.page.$eval("head > meta[property='article:author']", (element: any) => element.content);
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
