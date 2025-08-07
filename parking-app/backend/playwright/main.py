import os
from contextlib import asynccontextmanager
from playwright.async_api import async_playwright, BrowserContext

USERNAME_ENV = "REGISTER_USERNAME"
PASSWORD_ENV = "REGISTER_PASSWORD"
BASE_URL = "https://registermyplate.com/Resident/"


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


@asynccontextmanager
async def browser_context() -> BrowserContext:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        try:
            yield context
        finally:
            await context.close()
            await browser.close()


async def get_credentials() -> tuple[str, str]:
    return require_env(USERNAME_ENV), require_env(PASSWORD_ENV)


if __name__ == "__main__":
    # Placeholder: manual smoke test can be added later
    print("Playwright bootstrap ready. Set REGISTER_USERNAME and REGISTER_PASSWORD in env.") 