from typing import List, Dict, Any
from playwright.async_api import BrowserContext
from .auth import login
from .main import get_credentials

async def get_favorites(context: BrowserContext) -> List[Dict[str, Any]]:
    page = await context.new_page()
    username, password = await get_credentials()
    await login(page, username, password)
    # TODO: navigate to favorites page and scrape
    # return a list with keys: id, nickname, plate, state, defaultLocation
    await page.close()
    return [] 