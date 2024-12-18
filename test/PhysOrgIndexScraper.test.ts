
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {PhysOrgIndexScraper} from "../src/scrapers/PhysOrgIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('PhysOrgIndexScraper 1', function () {
    describe('PhysOrgIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://phys.org/",]
        } as ScrapingIndexI

        const scraper = new PhysOrgIndexScraper(testIndex);
        scraper.maxPages=1


        it('PhysOrgIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(result).to.have.lengthOf.at.least(1)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(0)
        });
    });
});