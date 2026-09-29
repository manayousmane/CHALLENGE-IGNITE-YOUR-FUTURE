from app.main import app
from app.schemas.chat import ChatRequest, Message, UserProfile
from app.schemas.search import ExtractedOpportunity
from app.services.catalog_service import catalog_service
from app.services.matching_service import compute_recommendations
from app.services.orchestrator import Orchestrator
from starlette.testclient import TestClient

client = TestClient(app)


class FakeSearch:
    async def search(self, profile):
        return []


class FakeGemini:
    async def extract_opportunities(self, results):
        return [
            ExtractedOpportunity(
                metier="Developpeur logiciel",
                description="Formation informatique au Benin",
                competences=["Python", "Bases de donnees"],
                etablissement="IFRI",
                ville="Abomey-Calavi",
                formation="Genie logiciel",
                source_url="https://enseignementsuperieur.gouv.bj/guide.pdf",
                source_title="Guide officiel",
            )
        ]


def complete_profile() -> UserProfile:
    return UserProfile(
        serie_bac="C",
        resultats_scolaires={"mathematiques": 15},
        appetences=["informatique"],
        competences_projets=["Python"],
        objectif_professionnel="Developpeur logiciel",
        budget_fcfa=500000,
        ville="Abomey-Calavi",
        preference_formation="formation pratique",
    )


def test_matching_returns_explainable_recommendation():
    recommendations = compute_recommendations(
        complete_profile(),
        [
            ExtractedOpportunity(
                metier="Developpeur logiciel",
                description="informatique et formation",
                competences=["informatique"],
                etablissement="IFRI",
                ville="Abomey-Calavi",
                formation="Genie logiciel",
                source_url="https://example.bj/formation",
                source_title="Formation",
            )
        ],
    )
    assert len(recommendations) == 1
    assert 0 <= recommendations[0].match_percentage <= 100
    assert recommendations[0].sources[0].url.endswith("formation")


async def test_orchestrator_asks_one_missing_question():
    request = ChatRequest(user_profile=UserProfile(serie_bac="C"))
    response = await Orchestrator(FakeSearch(), FakeGemini()).handle(request)
    assert response.is_final_recommendation is False
    assert response.field_expected == "resultats_scolaires"


async def test_orchestrator_completes_with_fake_services():
    response = await Orchestrator(FakeSearch(), FakeGemini()).handle(ChatRequest(user_profile=complete_profile()))
    assert response.is_final_recommendation is True
    assert response.recommendations


async def test_latest_answer_advances_profile():
    request = ChatRequest(
        messages=[Message(role="user", content="Je suis en serie C")],
        user_profile=UserProfile(),
    )
    response = await Orchestrator(FakeSearch(), FakeGemini()).handle(request)
    assert response.user_profile_summary is not None
    assert response.user_profile_summary.serie_bac == "Je suis en serie C"


def test_questionnaire_contains_eight_questions_in_order():
    from app.services.profile_service import REQUIRED_FIELDS

    assert len(REQUIRED_FIELDS) == 8
    assert [field for field, _ in REQUIRED_FIELDS] == [
        "serie_bac",
        "resultats_scolaires",
        "appetences",
        "competences_projets",
        "objectif_professionnel",
        "budget_fcfa",
        "ville",
        "preference_formation",
    ]


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json().get("status") == "ok"


def test_ai_status_endpoint():
    res = client.get("/api/ai-status")
    assert res.status_code == 200
    data = res.json()
    assert data["active"] is True
    assert "Bénin" in data["knowledgeBase"]


def test_search_formations_endpoint():
    res = client.get("/api/search/formations?ville=Calavi&limit=5")
    assert res.status_code == 200
    formations = res.json()
    assert isinstance(formations, list)
    assert len(formations) > 0


def test_interactive_chat_endpoint_responds_to_frontend_format():
    payload = {
        "message": "Je suis passionné par l'Intelligence Artificielle et Python",
        "history": [],
        "userProfile": {"educationLevel": "Bac C"},
        "mode": "free_chat",
        "useSearch": False,
    }
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "text" in data
    assert len(data["text"]) > 20
    assert "searchSources" in data
    assert len(data["searchSources"]) > 0
    assert data.get("recommendedCareers") is not None