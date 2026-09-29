from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import GeminiService
from app.services.matching_service import compute_recommendations
from app.services.profile_service import extract_latest_answer, merge_profile, next_missing_field
from app.services.search_service import SearchService


class Orchestrator:
    def __init__(self, search_service: SearchService | None = None, gemini_service: GeminiService | None = None):
        self.search_service = search_service or SearchService()
        self.gemini_service = gemini_service or GeminiService()

    async def handle(self, request: ChatRequest) -> ChatResponse:
        profile = request.user_profile
        missing = next_missing_field(profile)
        if missing:
            extracted = extract_latest_answer(request.messages, missing[0])
            if extracted:
                profile = merge_profile(profile, extracted)
                missing = next_missing_field(profile)
        if missing:
            field, question = missing
            return ChatResponse(is_final_recommendation=False, question=question, field_expected=field, user_profile_summary=profile)
        results = await self.search_service.search(profile)
        opportunities = await self.gemini_service.extract_opportunities(results)
        return ChatResponse(is_final_recommendation=True, user_profile_summary=profile, recommendations=compute_recommendations(profile, opportunities))