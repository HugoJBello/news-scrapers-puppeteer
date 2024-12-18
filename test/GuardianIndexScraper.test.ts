
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {GuardianNewIndexScraper} from "../src/scrapers/GuardianNewIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('GuardianIndexScraper 1', function () {
    describe('GuardianIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.theguardian.com/international",]
        } as ScrapingIndexI

        const scraper = new GuardianNewIndexScraper(testIndex);
        scraper.maxPages=1


        it('GuardianIndexScraper', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(result.length).not.to.equal(0)
            expect(result).to.have.lengthOf.at.least(1)
            expect(scraper.scrapingIndex.pageNewIndex).to.equal(2)
        });
    });
});