import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {NewYorkTimesContentScraper} from "../src/scrapers/NewYorkTimesContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('NewYorkTimesContentScraper.test', function () {
    describe('test scraper in a for a given new', function () {
        this.timeout(9999999);
        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new NewYorkTimesContentScraper("test","");

        it('NewYorkTimesContentScraper', async function () {
            const url ="https://www.nytimes.com/live/2021/01/27/us/biden-trump-impeachment"
            const result = await scraper.extractNewInUrl(url);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("description")
            expect(result).to.have.property("tags")
            expect(result.date).not.equal(null)

            expect(result.tags).not.equal(null)
            expect(result.tags).not.equal(null)
            expect(result.content).not.equal(null)
            expect(result.content).not.equal(undefined)
            expect(result.content).not.equal("")
            expect(result.description).not.equal("")
            expect(result.description).not.equal(undefined)
            expect(result.description).not.equal(null)

            expect(result.headline).not.equal(null)
            expect(result.headline).not.equal("")
        });
    });
});