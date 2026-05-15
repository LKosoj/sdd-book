INSERT INTO memories(path, content, tags, source)
VALUES (
  'workflow/sdd.md',
  'Реализация возможности должна начинаться с зафиксированных в Git requirements.md, plan.md и validation.md.',
  'sdd,qwen,workflow',
  'manual'
)
ON CONFLICT(path) DO UPDATE SET
  content = excluded.content,
  tags = excluded.tags,
  source = excluded.source,
  updated_at = CURRENT_TIMESTAMP;
