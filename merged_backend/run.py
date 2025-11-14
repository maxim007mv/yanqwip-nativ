"""
Точка входа для запуска Yanqwip Merged Backend
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Yanqwip Merged Backend...")
    print("📝 API Docs: http://localhost:8000/docs")
    print("🔥 Server running on: http://localhost:8000")
    print("---")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
