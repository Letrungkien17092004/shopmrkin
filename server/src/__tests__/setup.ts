/**
 * Jest Setup File
 * File này sẽ chạy trước tất cả các test
 */

// Set timeout cho tất cả tests (nếu cần)
// jest.setTimeout(10000)

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'

// Global mocks hoặc configurations
beforeAll(() => {
    // Setup code chạy một lần trước tất cả tests
    console.log('🧪 Starting test suite...')
})

afterAll(() => {
    // Cleanup code chạy một lần sau tất cả tests
    console.log('✅ Test suite completed')
})

// Suppress console errors during tests (optional)
// const originalError = console.error
// beforeAll(() => {
//     console.error = (...args: any[]) => {
//         if (
//             typeof args[0] === 'string' &&
//             args[0].includes('Warning: ReactDOM.render')
//         ) {
//             return
//         }
//         originalError.call(console, ...args)
//     }
// })

// afterAll(() => {
//     console.error = originalError
// })