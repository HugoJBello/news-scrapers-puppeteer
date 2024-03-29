import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {LaVanguardiaContentScraper} from "../src/scrapers/LaVanguardiaContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('LaVanguardiaContentScraper 1', function () {
    describe('LaVanguardiaContentScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new LaVanguardiaContentScraper("test","");

        it('LaVanguardiaContentScraper', async function () {

            const url = "https://www.lavanguardia.com/politica/20230205/8734503/feijoo-insinua-gana-elecciones-dejara-presidente-pp.html"
            
            const result = await scraper.extractNewInUrl(url, "", 0, 0);
            console.log(result);
            console.log(result.figuresUrl);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result).to.have.property("sections")

            expect(result.tags).not.equal(null)
            expect(result.content).not.equal(null)
            expect(result.figuresUrl).not.equal(null)
            expect(result.content).not.equal(undefined)
            expect(result.content).not.equal('')
            expect(result.date).not.equal(null)

            expect(result.date).not.equal(undefined)
            expect(result.tags).not.equal(undefined)
            expect(result.content).not.equal(undefined)
            expect(result.description).not.equal(undefined)
            expect(result.headline).not.equal(undefined)
            expect(result.url).not.equal(undefined)
        });
    });
});