from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import DATABASE_URL

# Le connection string Supabase est au format postgresql://...
# On le convertit pour le driver async asyncpg.
_async_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    _async_url,
    pool_size=10,
    max_overflow=5,
    # Vérifie que la connexion est toujours vivante avant de la réutiliser
    # depuis le pool — évite les erreurs "connection is closed" quand
    # Supabase/PgBouncer ferme une connexion inactive de son côté.
    pool_pre_ping=True,
    # Recycle les connexions au bout de 5 min, avant qu'un intermédiaire
    # (PgBouncer en mode transaction, notamment) ne les coupe lui-même.
    pool_recycle=300,
    connect_args={
        # Désactive le cache de "prepared statements" d'asyncpg —
        # indispensable si tu utilises un jour le Connection Pooler
        # Supabase (port 6543, PgBouncer en mode transaction), qui est
        # incompatible avec les prepared statements. Inoffensif sur une
        # connexion directe (port 5432).
        "statement_cache_size": 0,
    },
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session