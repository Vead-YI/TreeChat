"""
TreeChat - FastAPI 应用入口
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.api import router

# 创建应用
app = FastAPI(
    title="TreeChat API",
    description="🌲 树状对话系统 API - 让 AI 对话从铁轨变成森林",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": "TreeChat API",
        "version": "0.1.0",
        "description": "🌲 树状对话系统",
        "docs": "/docs",
    }


# 启动时运行
@app.on_event("startup")
async def startup():
    print("🌲 TreeChat API 启动中...")
    print("📖 文档地址: http://localhost:8000/docs")


@app.on_event("shutdown")
async def shutdown():
    print("👋 TreeChat API 已关闭")
