import {NewScrapedI} from "../models/NewScraped";
import {ContentScraper} from "./ContentScraper";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'


export class ElDiarioesContentScraper extends ContentScraper {
    public newspaper: string
    public scraperId: string
    public excludedParagraphs: string[] = [' ', '  ', ' \n', '  \n']
    public mustStartWith = "https://www.eldiario.es/"

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
    }

    checkCorrectUrl(url:string) {
        if (url.startsWith(this.mustStartWith)){            
            return true
        }
        return false
    }
    async extractNewInUrl(url: string, scrapingId:string, newsIndex:number, scrapingIteration: number): Promise<NewScrapedI> {
        // https://www.eldiario.es/politica/gobierno-rebajara-iva-gas-21-5_1_9280249.html
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        if (!this.checkCorrectUrl(url)){
            console.log("INCORRECT url ", url);
            return {url: url, status: "error"} as NewScrapedI
        }




        try {
            await this.initializePuppeteer();
        } catch (e) {
            console.log("error initializing")
            return {url: url, status: "error", "log":""+e.message} as NewScrapedI
        }
        try {
            try {
                await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            } catch (e) {
                return {url: url, status: "error", "log":""+e.message} as NewScrapedI
            }

            const div = await this.page.$('article');
            const [headline, content,contentMarkdown, date, author, image, tags,sections,  description] = await Promise.all([this.extractHeadline(), this.extractBody(div),this.extractBodyMarkdown(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractSections(), this.extractDescription()])
            const {figuresUrl, figuresText} = await this.extractFigures()

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
                author,
                description,
                figuresUrl, figuresText,
                scraperId: this.scraperId,
                newspaper: this.newspaper,
                newsIndex: newsIndex,
                scrapedAt: new Date(),
                scrapingIteration: scrapingIteration,
                status:"ok"
            } as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            return {url: url, status: "error", "log":""+err.message} as NewScrapedI
        }
    }

    async extractBody(div: any) {
        try {
            //const pars = await this.page.$$("div#maincontent")
            const pars = await this.page.$$("p.article-text")
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
            const pars = await this.page.$$("p.article-text, h3.article-text, h2.article-text")
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




    async extractFigures():Promise<any> {
        let figuresUrl:string[] = []
        let figuresText:string[] = []

        const figs = await this.page.$$("figure")
        for (let fig of figs){
            const img = await fig.$("picture > img")
            const cap = await fig.$("figcaption > span")

            try {
                //const pars = await this.page.$$("div#maincontent")
                const src = await img.getProperty('src');
                const image = await src.jsonValue();
                figuresUrl.push(image as string)
                
            } catch (e) {
            }

            if (img){
                try {
                    //const pars = await this.page.$$("div#maincontent")
                    let textPar = await this.page.evaluate(element => element.textContent, cap);
                    figuresText.push(textPar)
                } catch (e) {
                    console.log(e)
                    figuresText.push("")
                }
            }
            
    }
        return {figuresUrl, figuresText}
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

    async extractSections(): Promise<string[]> {
        try {
            let sections = await this.page.$eval("head > meta[property='article:section']", (element: any) => element.content);
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
