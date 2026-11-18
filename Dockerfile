# ==================================================
# Semzolve Technologies & One Chemicals Production Dockerfile
# ==================================================
FROM python:3.11-slim

WORKDIR /app

# Ensure non-root user for security
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/data && \
    chown -R appuser:appuser /app

# Copy application files
COPY --chown=appuser:appuser . /app/

USER appuser

# Expose default port
EXPOSE 8000

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Run production server with built-in SQLite & REST API
CMD ["python3", "server.py"]
