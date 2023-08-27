
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {IndexScraper} from "./IndexScraper";

export class ElHeraldoSoriaIndexScraper extends IndexScraper {
    public maxPages: number
    public scrapingIndex: ScrapingIndexI
    public urls:string[] = []
    public urlPrefixes:string[] = []
    public mustStartWith = "https://www.heraldodiariodesoria.es/"

    constructor(scrapingIndex: ScrapingIndexI) {
        super();
        this.scrapingIndex = scrapingIndex
        this.maxPages = scrapingIndex.maxPages
    }

    async extractNewsUrlsInSectionPageFromIndexOneIteration (): Promise<string[]> {
        this.scrapingIndex.pageIndexSection = 1
        if (this.scrapingIndex.urlIndex > this.scrapingIndex.startingUrls.length -1 ){
            this.scrapingIndex.urlIndex = 0
            this.scrapingIndex.pageNewIndex= 1
        }
        const currentUrl = this.scrapingIndex.startingUrls[this.scrapingIndex.urlIndex]
        const extractedUrls = await this.extractUrlsFromStartingUrl(currentUrl)
        const uniqUrls = [...new Set(extractedUrls)];
        return uniqUrls
    }

    checkCorrectUrl(url:string) {
        if (url.startsWith(this.mustStartWith)){            
            return true
        }
        return false
    }

    async extractUrlsFromStartingUrl(url: string): Promise<string[]> {
            try {
                const urls = await this.extractUrlsInPage(url)
                //this.urls = this.urls.concat(urls)
                this.urls = urls
            } catch (e) {
                console.log(e)
                return this.urls
            }

        return this.urls
    }

    async extractUrlsInPage (url: string):Promise<string[]>{
        // https://elpais.com/
        const pageUrl = url

        console.log("\n************");
        console.log("extracting full index in url:")
        console.log(pageUrl);
        console.log("************");
        const urls: string[] = []

        await this.initializePuppeteer();

        try {
            await this.page.goto(pageUrl, {waitUntil: 'load', timeout: 0});

            const urlsInPage = await  this.extractUrlsFromPage();

            await this.browser.close();

            return urlsInPage

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            throw err
        }
    }

    async clickOkButtonCookie () {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }
    }

    async extractUrlsFromPage(): Promise<string[]>{
        let hrefs = await this.page.$$('h2>a')
        const urls = []
        for (const hrefv of hrefs){
            let url = await this.page.evaluate((a:any) => a.href, hrefv);
            urls.push(url)
        }
 
        const date_regex = /.html$/

        //2023/01/20.html
        console.log(urls)
        return urls.filter((href: string) => {
            //return date_regex.test(href) && this.checkCorrectUrl(href)
            return this.checkCorrectUrl(href)
        })
    }

}
