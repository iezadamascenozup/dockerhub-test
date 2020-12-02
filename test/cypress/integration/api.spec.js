/// <reference types="Cypress" />

describe('Validate OMDb API ', () => {
    it('Validate API response without informing API key', () => {
        cy.request({
            method: 'GET',
            url: 'https://omdbapi.com/?s=300',
            failOnStatusCode: false,
        }).as('noApiKey').then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body).to.not.be.null

            cy.get('@noApiKey').its('body').should('include', { Response: 'False' })
            cy.get('@noApiKey').its('body').should('include', { Error: 'No API key provided.' })
        })
    })

    it('Validate API response without informing the required parameter s', () => {
        cy.request('https://omdbapi.com/?apikey=52ec71bf').as('noSParameter').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null

            cy.get('@noSParameter').its('body').should('include', { Response: 'False' })
            cy.get('@noSParameter').its('body').should('include', { Error: 'Incorrect IMDb ID.' })
        })
    })

    it("Validate valid format JSON", () => {
        cy.request('http://omdbapi.com/?apikey=52ec71bf&s=300').as('jsonApi').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null

            cy.get('@jsonApi').its('headers')
                .its('content-type').should('include', 'application/json; charset=utf-8')
        })
    })

    it("Validate valid format XML", () => {
        cy.request('http://omdbapi.com/?apikey=52ec71bf&s=300&r=xml').as('xmlApi').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null

            cy.get('@xmlApi').its('headers')
                .its('content-type').should('include', 'text/xml; charset=utf-8')
        })
    })

    it('Validate API valid response', () => {
        cy.request('https://omdbapi.com/?apikey=52ec71bf&s=300').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            expect(response.body.Search[1]).to.be.any.keys('Title', 'Year', 'imdbID', 'Type', 'Poster')
            expect(response.body.totalResults).to.be.eql('103')
            expect(response.body.Response).to.be.eql('True')

        })
    })

    it('Validate Types equal movie', () => {
        cy.request('https://omdbapi.com/?apikey=52ec71bf&s=300&type=movie').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            expect(response.body.totalResults).to.be.eql('95')
            expect(response.body.Response).to.be.eql('True')
            response = JSON.stringify(response.body.Search)
            var jsonData = JSON.parse(response)
            for (var i = 0; i < jsonData.length; i++) {
                expect(jsonData[i]['Type']).eq('movie')
                expect(jsonData[i]['Type']).not.eq('game')
                expect(jsonData[i]['Type']).not.eq('series')
            }
        })
    })

    it('Validate Types equal series', () => {
        cy.request('https://omdbapi.com/?apikey=52ec71bf&s=300&type=series').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            expect(response.body.totalResults).to.be.eql('6')
            expect(response.body.Response).to.be.eql('True')
            response = JSON.stringify(response.body.Search)
            var jsonData = JSON.parse(response)
            for (var i = 0; i < jsonData.length; i++) {
                expect(jsonData[i]['Type']).eq('series')
                expect(jsonData[i]['Type']).not.eq('movie')
                expect(jsonData[i]['Type']).not.eq('game')
            }
        })
    })

    it('Validate Types equal game', () => {
        cy.request('https://omdbapi.com/?apikey=52ec71bf&s=300&type=game').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            expect(response.body.totalResults).to.be.eql('2')
            expect(response.body.Response).to.be.eql('True')
            response = JSON.stringify(response.body.Search)
            var jsonData = JSON.parse(response)
            for (var i = 0; i < jsonData.length; i++) {
                expect(jsonData[i]['Type']).eq('game')
                expect(jsonData[i]['Type']).not.eq('movie')
                expect(jsonData[i]['Type']).not.eq('series')
            }
        })
    })
})