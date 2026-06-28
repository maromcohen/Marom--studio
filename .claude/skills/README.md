# Skills של הפרויקט — נוסעים עם הריפו

התיקייה הזו (`.claude/skills/`) מנוהלת ב-git, ולכן **כל skill שיושב כאן זמין אוטומטית בכל סשן** של Claude Code — גם בענן וגם במחשב — בלי להעתיק שום דבר ידנית בכל פעם.

## המבנה הנכון

כל skill הוא **תיקייה** עם קובץ `SKILL.md` בתוכה:

```
.claude/skills/
  <שם-הסקיל>/
    SKILL.md        ← הקובץ הראשי (עם frontmatter: name, description)
    ...             ← קבצים נוספים שה-skill צריך (אופציונלי)
  <שם-סקיל-נוסף>/
    SKILL.md
```

> חשוב: קובץ `.md` בודד ושטוח ישירות בתוך `.claude/skills/` **לא** ייטען כ-skill. חייבים תיקייה עם `SKILL.md`.

ה-`SKILL.md` מתחיל ב-frontmatter, לדוגמה:

```markdown
---
name: my-skill
description: מתי להשתמש ב-skill הזה (כתוב פעלים שתחפש, כדי שייטען אוטומטית)
---

תוכן ההוראות של ה-skill...
```

## איך מעבירים לכאן את ה-skills מהמחשב (Windows / PowerShell)

מתוך תיקיית הריפו המקומית במחשב שלך:

```powershell
# 1. מעתיק את כל ה-skills הגלובליים שלך אל תוך הריפו
Copy-Item "$HOME\.claude\skills\*" ".\.claude\skills\" -Recurse -Force

# 2. מוסיף, מבצע commit ודוחף
git add .claude/skills
git commit -m "Bring my skills into the repo"
git push
```

ב-macOS / Linux:

```bash
cp -R ~/.claude/skills/. ./.claude/skills/
git add .claude/skills
git commit -m "Bring my skills into the repo"
git push
```

מאותו רגע — בכל סשן חדש (כולל בענן) Claude יזהה את ה-skills אוטומטית.

## טיפים

- אם תרצה ש-skill מסוים **לא** ייסע עם הריפו — אל תשים אותו כאן; השאר אותו רק ב-`~/.claude/skills/` הגלובלי.
- כדי לעדכן skill — פשוט ערוך את ה-`SKILL.md` שלו, ‎`git commit` ו-‎`git push`.
- כדי להסיר skill מהריפו — מחק את התיקייה שלו, ‎`git commit` ו-‎`git push`.
