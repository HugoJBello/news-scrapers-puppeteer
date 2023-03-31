
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {ScienceNewsIndexScraper} from "../src/scrapers/ScienceNewsIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ScienceNewsIndexScraper 1', function () {
    describe('ScienceNewsIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.sciencenews.org/",]
        } as ScrapingIndexI

        const scraper = new ScienceNewsIndexScraper(testIndex);
        scraper.maxPages=1


        it('ScienceNewsIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(0)
        });
    });
});