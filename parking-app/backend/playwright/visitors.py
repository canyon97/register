from typing import List, Dict, Any
from playwright.async_api import BrowserContext
from .auth import login
from .main import get_credentials

async def get_active_visitors(context: BrowserContext) -> List[Dict[str, Any]]:
    page = await context.new_page()
    username, password = await get_credentials()
    await login(page, username, password)
    # TODO: navigate to active visitors page and scrape
    # return a list of sessions with keys: id, plate, state, startTime, expiresAt, location
    await page.close()
    return [] 