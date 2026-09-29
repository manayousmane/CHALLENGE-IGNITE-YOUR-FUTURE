from __future__ import annotations

import asyncio
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from app.core.config import settings
from app.core.prompts import build_search_queries
from app.schemas.chat import UserProfile
from app.schemas.search import SearchResult


class SearchService:
    async def search(self, profile: UserProfile) -> list[SearchResult]:
        queries = build_search_queries(profile.model_dump())
        if settings.tavily_api_key:
            results = await self._tavily(queries)
            if results:
                return results
        return await self._duckduckgo(queries)

    async def _tavily(self, queries: list[str]) -> list[SearchResult]:
        async with httpx.AsyncClient(timeout=settings.search_timeout_seconds) as client:
            results: list[SearchResult] = []
            for query in queries:
                response = await client.post(
                    "https://api.tavily.com/search",
                    json={
                        "api_key": settings.tavily_api_key,
                        "query": query,
                        "search_depth": "advanced",
                        "max_results": settings.max_search_results,
                        "include_answer": False,
                    },
                )
                response.raise_for_status()
                for item in response.json().get("results", []):
                    results.append(self._result(item.get("title", ""), item.get("url", ""), item.get("content", "")))
            return self._deduplicate(results)

    async def _duckduckgo(self, queries: list[str]) -> list[SearchResult]:
        async with httpx.AsyncClient(
            timeout=settings.search_timeout_seconds,
            headers={"User-Agent": "PARCOURS-AI/0.1 (+orientation-benin)"},
            follow_redirects=True,
        ) as client:
            tasks = [self._duckduckgo_query(client, query) for query in queries]
            batches = await asyncio.gather(*tasks, return_exceptions=True)
        results = [item for batch in batches if isinstance(batch, list) for item in batch]
        return self._deduplicate(results)

    async def _duckduckgo_query(self, client: httpx.AsyncClient, query: str) -> list[SearchResult]:
        response = await client.get("https://html.duckduckgo.com/html/", params={"q": query})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        results: list[SearchResult] = []
        for item in soup.select(".result")[: settings.max_search_results]:
            link = item.select_one(".result__a")
            snippet = item.select_one(".result__snippet")
            if link and link.get("href"):
                results.append(self._result(link.get_text(" ", strip=True), link["href"], snippet.get_text(" ", strip=True) if snippet else ""))
        return results

    @staticmethod
    def _result(title: str, url: str, snippet: str) -> SearchResult:
        domain = urlparse(url).netloc.lower().removeprefix("www.") if url else None
        official = domain and (domain.endswith(".gouv.bj") or domain.endswith(".edu.bj") or domain.endswith(".bj"))
        return SearchResult(
            title=title.strip(),
            url=url,
            snippet=snippet.strip(),
            domain=domain,
            source_kind="official" if official else "secondary",
        )

    @staticmethod
    def _deduplicate(results: list[SearchResult]) -> list[SearchResult]:
        seen: set[str] = set()
        unique: list[SearchResult] = []
        for result in results:
            if result.url and result.url not in seen:
                seen.add(result.url)
                unique.append(result)
        return unique[: settings.max_search_results * 3]