
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {AbcIndexScraper} from "../src/scrapers/AbcIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('AbcIndexScraper 1', function () {
    describe('AbcIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://abc.es/",]
        } as ScrapingIndexI

        const scraper = new AbcIndexScraper(testIndex);
        scraper.maxPages=1


        it('AbcIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(result.length).to.greaterThan(0)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(0)
        });
    });
});