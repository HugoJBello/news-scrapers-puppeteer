import {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'


export class PublicoContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public newspaper: string
    public scraperId: string
    public excludedParagraphs: string[] = [' ', '  ', ' \n', '  \n']
    public mustStartWith = "https://www.publico.es/"

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    checkCorrectUrl(url:string) {
        if (url.startsWith(this.mustStartWith)){            
            return true
        }
        return false
    }
    async extractNewInUrl(url: string, scrapingId:string, newsIndex:number): Promise<NewScrapedI> {
        // https://www.publico.es/internacional/cordon-democratico-ultraderecha-cae-europa-abre-paso-normalizacion.html#md=modulo-portada-ancho-completo:t1;mm=mobile-big
        
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        if (!this.checkCorrectUrl(url)){
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
                await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            } catch (e) {
                return {} as NewScrapedI
            }

            const div = await this.page.$('article');
            const [headline, content,contentMarkdown, date, author, image, tags, description] = await Promise.all([this.extractHeadline(), this.extractBody(div),this.extractBodyMarkdown(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractDescription()])

            await this.browser.close();

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

    async extractBody(div: any) {
        try {
            //const pars = await this.page.$$("div#maincontent")
            const pars = await this.page.$$("p.pb-article-item-iteration")
            let text = ''
            for (let par of pars) {
                let textPar = await this.page.evaluate(element => element.textContent, par);
                const hasExcludedText = this.excludedParagraphs.some((text) => textPar == text)
                if (!hasExcludedText) {
                    textPar = textPar.trim()
                    if (textPar !== ""){
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

    async extractBodyMarkdown(div: any) {
        try {
            const pars = await this.page.$$("p.pb-article-item-iteration, h3.highlighted, h2.highlighted")
            let text = ''
            for (let par of pars) {
                let tagName = await (await par.getProperty('tagName')).jsonValue()
                tagName = tagName.toLocaleLowerCase()
                
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
            //await this.page.waitForSelector('span.published')
            
            //let date = await this.page.$eval("time>a", (element: any) => element.href);
            //date = date.split("/")[4].split("#")[0]            
            //date = new Date(date)

            let date = await this.page.$eval("header>time", (element: any) => element.getAttribute('datetime'));
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
