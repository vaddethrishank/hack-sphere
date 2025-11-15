# Supabase Schema Reference

## Correct Table Names & Relationships

### 1. Submission Data (Round 1)

**round1_submissions** (Main submission record)
```
id: UUID (primary key)
team_id: TEXT (foreign key → teams.id)
submitted_at: TIMESTAMP
score: NUMERIC (NULL until calculated)
```

**round1_mcq_answers** (Individual MCQ responses)
```
id: UUID (primary key)
submission_id: UUID (foreign key → round1_submissions.id)
mcq_id: TEXT (references the MCQ)
selected_option_id: TEXT (which option was selected)
```

**round1_coding_answers** (Code submissions)
```
id: UUID (primary key)
submission_id: UUID (foreign key → round1_submissions.id)
problem_id: TEXT (references the coding problem)
code: TEXT (the submitted code)
language: TEXT (e.g., 'javascript', 'python')
passed_test_cases: INTEGER
total_test_cases: INTEGER
```

---

### 2. Contest Data

**rounds**
```
id: INTEGER (primary key)
name: TEXT
status: TEXT ('Not Started', 'Active', 'Finished', 'Locked')
started_at: TIMESTAMP (optional)
duration_in_minutes: INTEGER (optional)
```

**mcqs**
```
id: TEXT (primary key)
question: TEXT
correct_answer_id: TEXT
```

**mcq_options**
```
id: TEXT (primary key)
mcq_id: TEXT (foreign key → mcqs.id)
text: TEXT
```

**coding_problems**
```
id: TEXT (primary key)
title: TEXT
description: TEXT
```

**coding_problem_test_cases**
```
id: UUID (primary key)
problem_id: TEXT (foreign key → coding_problems.id)
input: TEXT
expected_output: TEXT
is_hidden: BOOLEAN
```

**round2_problem**
```
id: UUID (primary key)
title: TEXT
description: TEXT
url: TEXT (optional)
problem_file_url: TEXT (optional)
```

---

### 3. Team Management

**teams**
```
id: TEXT (primary key)
name: TEXT
college: TEXT
payment_screenshot_url: TEXT (optional)
status: TEXT ('Approved', 'Pending', 'Rejected')
```

**team_members**
```
id: UUID (primary key)
team_id: TEXT (foreign key → teams.id)
name: TEXT
email: TEXT
role: TEXT ('Leader', 'Member')
```

---

### 4. Awards & Certificates

**certificates**
```
id: UUID (primary key)
team_id: TEXT (foreign key → teams.id)
team_name: TEXT
type: TEXT ('Participation', 'Appreciation', 'Outstanding Performance')
awarded_at: TIMESTAMP
```

---

## How Leaderboard Works

```
1. Load round1_submissions
   ├─ Get all submissions sorted by score DESC
   └─ For each submission:
      ├─ Load matching team from teams table
      ├─ Load MCQ answers from round1_mcq_answers
      └─ Load coding answers from round1_coding_answers

2. Combine data into leaderboard row:
   {
     rank: calculated by score order
     teamName: from teams
     college: from teams
     score: from round1_submissions
     submitted_at: from round1_submissions
     mcqAnswers: from round1_mcq_answers
     codingAnswers: from round1_coding_answers
   }

3. Filter by college if selected

4. Display sorted table
```

---

## Sample Data Structure (In Code)

**ContestContext maps to this:**
```typescript
Round1Submission {
  teamId: string;              // round1_submissions.team_id
  submittedAt: Date;           // round1_submissions.submitted_at
  score?: number;              // round1_submissions.score
  mcqAnswers: {
    [mcqId]: optionId         // from round1_mcq_answers rows
  };
  codingAnswers: {
    [problemId]: {
      code: string;            // from round1_coding_answers
      language: string;        // from round1_coding_answers
      submissionResult: {
        passed: number;        // from round1_coding_answers.passed_test_cases
        total: number;         // from round1_coding_answers.total_test_cases
      }
    }
  };
}
```

---

## Key Points

✅ **Scores are stored** in `round1_submissions.score`
✅ **Answers are separated** into MCQ and Coding tables for flexibility
✅ **Linked by submission_id** to reconstruct full submission
✅ **Real-time enabled** via Supabase Realtime subscriptions
✅ **ContestContext handles** mapping from normalized schema to application types
