from typing import Dict, Any
from playwright.async_api import BrowserContext
from .auth import login
from .main import get_credentials

async def check_session(context: BrowserContext, session_id: str) -> Dict[str, Any]:
    page = await context.new_page()
    username, password = await get_credentials()
    await login(page, username, password)
    # TODO: navigate to session details for session_id and return status
    await page.close()
    return {"id": session_id, "active": False} 