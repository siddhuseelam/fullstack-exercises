const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
    console.log('dummy  test running');
    
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

    test('of empty list is zero', () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 0)
    })
    test('when list has only one blog, equals the likes of that ', () =>{
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            }
        ]

        const result  = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 7)
    })
    test('of a bigger list is calculated right ', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            },
            {
                _id: '5a422b851b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/ewd02xx/EWD215.PDF',
                likes: 5
            },
            {
                _id: '5a422c851b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/ewd02xx/EWD215.PDF',
                likes: 12
            }
        ]

        const result  = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 24)
    })




    
})


describe('favorite blog', () => {
    test('of empty list is null', () => {
        const blogs = []

        const result = listHelper.favoriteBlog(blogs)
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, equals that blog ', () =>{
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            }
        ]

        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[0])
    })
    test('of a bigger list is calculated right ', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            },
            {
                _id: '5a422b851b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/ewd02xx/EWD215.PDF',
                likes: 5
            },
            {
                _id: '5a422c851b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/ewd02xx/EWD215.PDF',
                likes: 12
            }
        ]

        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[2])
    })
})
