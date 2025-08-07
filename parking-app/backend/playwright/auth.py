from playwright.async_api import Page
from .main import BASE_URL

async def login(page: Page, username: str, password: str) -> None:
    await page.goto(BASE_URL)
    # TODO: fill selectors once known
    # await page.fill('#username', username)
    # await page.fill('#password', password)
    # await page.click('button[type="submit"]')
    # await page.wait_for_load_state('networkidle') 