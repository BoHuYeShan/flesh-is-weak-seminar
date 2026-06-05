#!/usr/bin/env python3
"""
新闻爬虫脚本 — 从 RSS 源抓取新闻，可选用 AI 摘要

输出: public/data/news/{date}.json

环境变量:
  GROQ_API_KEY — Groq 免费 API key（可选，用于 AI 摘要）
"""

import json
import os
import re
import sys
from datetime import datetime, date
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
NEWS_DIR = REPO_ROOT / "public" / "data" / "news"

# ===== RSS 源配置 =====
RSS_SOURCES = [
    {"url": "https://hnrss.org/frontpage", "name": "Hacker News", "category": "技术"},
    {"url": "https://feeds.feedburner.com/TheHackersNews", "name": "The Hacker News", "category": "安全"},
    {"url": "https://techcrunch.com/feed/", "name": "TechCrunch", "category": "科技"},
    {"url": "https://www.reddit.com/r/technology/.rss", "name": "r/technology", "category": "技术"},
    {"url": "https://www.reddit.com/r/programming/.rss", "name": "r/programming", "category": "编程"},
    {"url": "https://github.blog/feed/", "name": "GitHub Blog", "category": "开源"},
    {"url": "https://openai.com/blog/rss/", "name": "OpenAI Blog", "category": "AI"},
]

# AI 相关源（优先级高）
AI_SOURCES = [
    {"url": "https://huggingface.co/blog/feed.xml", "name": "Hugging Face", "category": "AI"},
    {"url": "https://ai.googleblog.com/feeds/posts/default", "name": "Google AI", "category": "AI"},
]


def fetch_rss(url: str, max_items: int = 10) -> list:
    """抓取 RSS 源"""
    try:
        import feedparser
        feed = feedparser.parse(url)
        items = []
        for entry in feed.entries[:max_items]:
            # 清理 HTML 标签
            summary = entry.get('summary', '')
            summary = re.sub(r'<[^>]+>', '', summary)[:300]

            items.append({
                'title': entry.get('title', '').strip(),
                'summary': summary.strip(),
                'link': entry.get('link', ''),
                'published': entry.get('published', ''),
                'source': feed.feed.get('title', url)
            })
        return items
    except ImportError:
        print("feedparser not installed. Run: pip install feedparser")
        return []
    except Exception as e:
        print(f"  Failed to fetch {url}: {e}")
        return []


def ai_curate(articles: list, api_key: str) -> list:
    """用 AI 筛选和摘要新闻"""
    try:
        import requests
    except ImportError:
        print("requests not installed. Run: pip install requests")
        return articles[:8]

    # 构建 prompt
    article_list = []
    for i, a in enumerate(articles[:30]):
        article_list.append(f"{i+1}. [{a.get('source', '?')}] {a['title']}: {a['summary'][:100]}")

    prompt = f"""从以下新闻中选出最重要的8条，覆盖不同领域（AI、安全、开源、编程、科技）。

返回 JSON 格式：
{{"articles": [{{"index": 原序号, "category": "AI/安全/开源/编程/科技/其他"}}]}}

新闻列表：
{chr(10).join(article_list)}"""

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 500
            },
            timeout=30
        )

        if resp.status_code != 200:
            print(f"  Groq API error: {resp.status_code}")
            return articles[:8]

        content = resp.json()["choices"][0]["message"]["content"]
        # 提取 JSON
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            result = json.loads(json_match.group())
            curated = []
            for item in result.get('articles', []):
                idx = item.get('index', 0) - 1
                if 0 <= idx < len(articles):
                    a = articles[idx].copy()
                    a['category'] = item.get('category', a.get('category', '其他'))
                    curated.append(a)
            return curated[:8]
    except Exception as e:
        print(f"  AI curation failed: {e}")

    return articles[:8]


def crawl_all() -> list:
    """爬取所有源"""
    all_articles = []

    all_sources = AI_SOURCES + RSS_SOURCES
    for source in all_sources:
        print(f"  Fetching: {source['name']}...")
        items = fetch_rss(source['url'], max_items=8)
        for item in items:
            item['category'] = source['category']
        all_articles.extend(items)
        print(f"    Got {len(items)} items")

    # 去重（按标题）
    seen = set()
    unique = []
    for a in all_articles:
        title_key = a['title'].lower().strip()
        if title_key and title_key not in seen:
            seen.add(title_key)
            unique.append(a)

    print(f"\n  Total unique articles: {len(unique)}")
    return unique


def save_news(articles: list, today: date = None):
    """保存新闻到 JSON"""
    if today is None:
        today = date.today()

    NEWS_DIR.mkdir(parents=True, exist_ok=True)

    data = {
        'date': today.isoformat(),
        'generated': datetime.now().isoformat(),
        'count': len(articles),
        'articles': articles
    }

    out_file = NEWS_DIR / f"{today.isoformat()}.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n  Saved to {out_file}")


def main():
    print("=== News Crawler ===\n")

    # 爬取
    raw_articles = crawl_all()

    if not raw_articles:
        print("No articles found. Exiting.")
        return

    # AI 筛选（如果有 key）
    api_key = os.environ.get('GROQ_API_KEY', '')
    if api_key:
        print("\n  Running AI curation...")
        curated = ai_curate(raw_articles, api_key)
    else:
        print("\n  No GROQ_API_KEY found, using top 8 by default.")
        curated = raw_articles[:8]

    # 保存
    save_news(curated)

    # 打印摘要
    print(f"\n=== Today's News ({len(curated)} articles) ===")
    for i, a in enumerate(curated, 1):
        print(f"  {i}. [{a.get('category', '?')}] {a['title']}")


if __name__ == '__main__':
    main()
