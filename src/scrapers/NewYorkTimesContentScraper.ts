import {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'

export class NewYorkTimesContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public newspaper: string
    public scraperId: string
    public excludedParagraphs = ['Send any friend a story', 'As a subscriber, you have 10 gift articles to give each month. Anyone can read what you share.', 'Supported by', "Advertisement", "Something went wrong. Please try again later", "We use cookies and similar methods to recognize visitors"]

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    async extractNewInUrl(url: string, scrapingId:string, newsIndex:number): Promise<NewScrapedI> {
        // https://www.nytimes.com/live/2021/01/26/us/biden-trump-impeachment
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


            const div = await this.page.$('div.pg-rail-tall__body');

            const [headline, content, contentMarkdown, date, author, image, tags, description] = await Promise.all([this.extractHeadline(), this.extractBody(),this.extractBodyMarkdown(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractDescription()])

            await this.browser.close();
            //await this.page.waitFor(this.timeWaitStart);

            let results = {
                id: v4(),
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
                scrapedAt: new Date()
            } as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            return null;
        }
    }

    async extractBody() {
        try {
            const pars = await this.page.$$("p")
            let text = ''
            for (let par of pars) {
                const textPar = await this.page.evaluate(element => element.textContent, par);
                text = text + '\n ' + this.cleanParagprah(textPar)
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

    cleanParagprah = (textPar: string) => {
        for (const text of this.excludedParagraphs) {
            if (textPar.includes(text)) {
                return ""
            }
        }
        return textPar
    }

    cleanUp = (text: string) => {
        return text.replace(/\n/g, " ")
    }

    async extractDescription() {
        try {
            const description = await this.page.$eval("head > meta[name='description']", (element: any) => element.content);
            return description
        } catch (e) {
            return null
        }

    }

    async extractDate(): Promise<Date> {
        try {
            const date = await this.page.$eval("head > meta[property='article:published_time']", (element: any) => element.content);
            return new Date(date)
        } catch (e) {
            return null
        }

    }

    async extractTags(): Promise<string[]> {
        try {
            let tags = await this.page.$eval("head > meta[name='news_keywords']", (element: any) => element.content);
            if (tags && tags.includes(";")) {
                return tags.split(";").map((elem: string) => (elem.trim()))
            }
            return [tags]
        } catch (e) {
            return null
        }

    }


    async extractHeadline() {
        try {
            let headline = await this.page.$eval("head > meta[property='twitter:title']", (element: any) => element.content);
            return headline
        } catch (e) {
            return null
        }

    }

    async extractAuthor() {
        try {
            let headline = await this.page.$eval("head > meta[name='author']", (element: any) => element.content);
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
