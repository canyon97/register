from typing import Dict, Any
from playwright.async_api import BrowserContext
from .auth import login
from .main import get_credentials

async def create_session(context: BrowserContext, data: Dict[str, Any]) -> Dict[str, Any]:
    """data: plate, state, expiresInDays, location"""
    page = await context.new_page()
    username, password = await get_credentials()
    await login(page, username, password)
    # TODO: navigate to create form, fill with data, submit and confirm
    await page.close()
    return {"ok": True, "id": "todo", **data} 