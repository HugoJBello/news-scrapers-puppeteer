import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {ElDiarioesContentScraper} from "../src/scrapers/ElDiarioesContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ElDiarioesContentScraper 1', function () {
    describe('ElDiarioesContentScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new ElDiarioesContentScraper("test","");

        it('ElDiarioesContentScraper', async function () {

            const url = "https://www.eldiario.es/castilla-y-leon/politica/castilla-leon-inadmite-requerimiento-gobierno-asegura-no-existe-acuerdo-antiaborto_1_9878698.html"
            const result = await scraper.extractNewInUrl(url, "", 0, 0);
            console.log(result);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result.tags).not.equal(null)
            expect(result.content).not.equal(null)
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