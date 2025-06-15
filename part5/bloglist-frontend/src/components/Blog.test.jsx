import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

describe('Blog component', () => {
    test('renders title and author but not url or likes by default', () => {
        const blog = {
            title: 'Test Blog Title', 
            author: 'Test Author',
            url: 'https://testblog.com',
            likes: 5,
            user: {
                name: 'Test User'
            }
        }

        const mockHandler = () => {}

        render(
            <Blog 
                blog={blog}
                handleLike={mockHandler}
                handleRemove={mockHandler}
                showRemoveButton={false}
            />
        )

        const element = screen.getByText(/Test Blog Title.*Test Author/, { exact: false })
        expect(element).toBeInTheDocument()
        const blogDetails = screen.getByTestId('blog-details')
        expect(blogDetails).toHaveStyle('display: none')
    })

    test('renders url and likes when view button is clicked', () => {
        const blog = {
            title: 'Test Blog Title',
            author: 'Test Author',
            url: 'https://testblog.com',
            likes: 5,
            user: {
                name: 'Test User'
            }
        }

        const mockHandler = () => {}

        render(
            <Blog
                blog={blog}
                handleLike={mockHandler}
                handleRemove={mockHandler}
                showRemoveButton={false}
            />
        )

        const element = screen.getByText(/Test Blog Title.*Test Author/, { exact: false })
        expect(element).toBeInTheDocument()
        const blogDetails = screen.getByTestId('blog-details')
        expect(blogDetails).toHaveStyle('display: none')
    })

    test('clicking the like button twice calls event handler twice', async () => {
        const blog = {
            title: 'Test Blog Title',
            author: 'Test Author',
            url: 'https://testblog.com',
            likes: 5,
            user: {
                name: 'Test User'
            }
        }

        const mockHandler = vi.fn()
        const user = userEvent.setup()

        render(
            <Blog
                blog={blog}
                handleLike={mockHandler}
                handleRemove={() => {}}
                showRemoveButton={false}
            />
        )

        const viewButton = screen.getByText('view')
        await user.click(viewButton)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })

    test('new blog form calls event handler with right details', async () => {
        const createBlog = vi.fn()
        const user = userEvent.setup()

        render(<CreateBlog createBlog={createBlog} />)

        const inputs = screen.getAllByRole('textbox')
        const submitButton = screen.getByText('Create')

        await user.type(inputs[0], 'Test Title')
        await user.type(inputs[1], 'Test Author')
        await user.type(inputs[2], 'http://test.com')
        await user.click(submitButton)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0]).toEqual({
            title: 'Test Title',
            author: 'Test Author',
            url: 'http://test.com'
        })
    })
})