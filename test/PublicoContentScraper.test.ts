import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {PublicoContentScraper} from "../src/scrapers/PublicoContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('PublicoContentScraper 1', function () {
    describe('PublicoContentScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new PublicoContentScraper("test","");

        it('PublicoContentScraper', async function () {

            const url = "https://www.publico.es/internacional/cordon-democratico-ultraderecha-cae-europa-abre-paso-normalizacion.html#md=modulo-portada-ancho-completo:t1;mm=mobile-big"
            const result = await scraper.extractNewInUrl(url, "", 0, 0);
            console.log(result);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result).to.have.property("sections")
            expect(result.tags).not.equal(null)
            expect(result.content).not.equal(null)
            expect(result.content).not.equal(undefined)
            expect(result.content).not.equal('')
            expect(result.contentMarkdown).not.equal(null)
            expect(result.contentMarkdown).not.equal(undefined)
            expect(result.contentMarkdown).not.equal('')
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