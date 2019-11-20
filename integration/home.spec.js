
describe('app', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000')
  })

  it('should display Make Things', async () => {
    await expect(page).toMatch('Hello CodeSandbox')
  })
})