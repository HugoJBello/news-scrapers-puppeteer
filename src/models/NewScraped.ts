


export interface NewScrapedI {
    newspaper: string
    author: string
    image: string
    date: Date
    scrapedAt: Date
    content: string
    contentMarkdown: string
    headline: string
    description: string
    tags: string[]
    figuresUrl: string[]
    figuresText: string[]
    url: string
    scraperId: string
    scrapingIteration: number
    id: string
    newsIndex: number
}