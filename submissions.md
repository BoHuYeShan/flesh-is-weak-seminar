# 群友投稿

群友提交的优质内容。

<SubmissionsPanel />

<style>
/* 卡片列表 */
.list { display: grid; gap: 16px; max-width: 800px; margin: 0 auto; padding: 40px 28px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.card-body { padding: 20px; }
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.tag { font-family: var(--font-mono); font-size: 11px; padding: 3px 10px; background: var(--cyan-dim); color: var(--cyan); border-radius: 100px; }
.card h3 { margin: 0 0 8px; font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
.card p { margin: 0 0 12px; font-size: 14px; color: var(--muted); line-height: 1.6; }
.card-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); align-items: center; }
.card-license { padding: 2px 8px; background: var(--cyan-dim); color: var(--cyan); border-radius: 4px; font-size: 11px; }
.license-tag { background: var(--cyan-dim) !important; color: var(--cyan) !important; }
.loading, .empty { text-align: center; padding: 60px 28px; color: var(--faint); font-family: var(--font-mono); }

/* 弹窗面板 */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.panel { display: flex; width: 100%; max-width: 1000px; height: 85vh; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }

/* 左侧目录栏 */
.sidebar { width: 220px; min-width: 220px; border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; padding: 20px 0; }
.sidebar-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--faint); padding: 0 16px 12px; border-bottom: 1px solid var(--border); margin-bottom: 8px; }
.sidelink { display: block; font-size: 13px; color: var(--muted); text-decoration: none; padding: 6px 16px; border-left: 2px solid transparent; transition: all 0.15s; cursor: pointer; line-height: 1.4; }
.sidelink:hover { color: var(--text); background: var(--card); }
.sidelink.on { color: var(--cyan); border-left-color: var(--cyan); background: var(--cyan-dim); }
.sidelink.lv2 { padding-left: 28px; }
.sidelink.lv3 { padding-left: 40px; font-size: 12px; }

/* 目录底部按钮 */
.sidebar-actions { margin-top: auto; padding: 16px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
.sidebar-actions button { font-family: var(--font-mono); font-size: 12px; padding: 8px 12px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); cursor: pointer; transition: all 0.15s; text-align: left; }
.sidebar-actions button:hover { border-color: var(--cyan); color: var(--cyan); }

/* 右侧内容区 */
.md-content { flex: 1; overflow-y: auto; }
.md-header { padding: 28px 28px 0; position: sticky; top: 0; background: var(--surface); z-index: 1; }
.md-header h2 { font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--text); margin: 0 0 12px; }
.md-meta { display: flex; gap: 12px; align-items: center; font-family: var(--font-mono); font-size: 13px; color: var(--muted); flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.md-body { padding: 24px 28px; font-size: 15px; line-height: 1.8; color: var(--text); }
.md-body h1, .md-body h2, .md-body h3 { font-family: var(--font-display); color: var(--text); margin: 28px 0 12px; scroll-margin-top: 80px; }
.md-body h1 { font-size: 24px; }
.md-body h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.md-body h3 { font-size: 18px; }
.md-body p { margin: 12px 0; }
.md-body strong { color: var(--text); }
.md-body code { font-family: var(--font-mono); font-size: 13px; background: var(--card); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
.md-body pre { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
.md-body pre code { background: none; padding: 0; color: var(--text); display: block; white-space: pre; }
.md-body a { color: var(--cyan); text-decoration: none; }
.md-body a:hover { text-decoration: underline; }
.md-body ul { margin: 12px 0; padding-left: 24px; }
.md-body li { margin: 6px 0; }
.md-body li::marker { color: var(--cyan); }
.md-body hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
.md-body blockquote { border-left: 3px solid var(--cyan); padding-left: 16px; margin: 16px 0; color: var(--muted); }
.md-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
.md-body th, .md-body td { border: 1px solid var(--border); padding: 10px 14px; text-align: left; }
.md-body th { background: var(--card); font-weight: 600; color: var(--text); }
.md-body td { color: var(--muted); }
.md-footer { padding: 16px 28px; border-top: 1px solid var(--border); }
.md-footer a { font-family: var(--font-mono); font-size: 13px; color: var(--cyan); text-decoration: none; }
.md-footer a:hover { color: var(--text); }

/* 移动端 */
@media (max-width: 768px) {
  .overlay { padding: 0; align-items: flex-end; }
  .panel { border-radius: 16px 16px 0 0; height: 95vh; flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; height: auto; max-height: 40vh; border-right: none; border-bottom: 1px solid var(--border); flex-direction: row; flex-wrap: wrap; padding: 12px; gap: 4px; }
  .sidebar-title { width: 100%; padding: 0 0 8px; }
  .sidelink { padding: 4px 10px; border-left: none; border-bottom: 2px solid transparent; font-size: 12px; }
  .sidelink.on { border-bottom-color: var(--cyan); border-left: none; }
  .sidebar-actions { flex-direction: row; padding: 8px 0 0; margin-top: 8px; width: 100%; }
  .sidebar-actions button { flex: 1; text-align: center; padding: 6px; font-size: 11px; }
  .md-header { padding: 16px; }
  .md-header h2 { font-size: 18px; }
  .md-body { padding: 12px 16px; font-size: 14px; }
  .list { padding: 20px 16px; }
}
</style>
