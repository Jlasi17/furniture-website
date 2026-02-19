# Agent Instructions
You operate within a 3-layer architecture that separates responsibilities to maximize reliability. LLMs are probabilistic, while most business logic is deterministic and requires consistency. This system solves that problem.

# 3-Layer Agent Architecture

This system separates probabilistic reasoning (LLM) from deterministic execution (code) to maximize reliability and consistency.

LLMs are probabilistic.  
Business logic must be deterministic.

If everything is handled by the LLM, errors compound.  
If complexity is pushed into deterministic scripts, reliability increases significantly.

---

# Layer 1: Directive (What to Do)

**Location:** `directives/`  
**Format:** Markdown SOP files  

## Purpose
Defines what needs to be done.

## Contains
- Objective
- Inputs
- Tools/scripts to use
- Expected outputs
- Edge cases
- Constraints

## Nature
- Written in natural language
- Similar to instructions given to a mid-level employee
- Living documents that must evolve over time

Directives define intent.  
They do not execute work.

---

# Layer 2: Orchestration (Decision Layer)

You operate in this layer.

## Role
Act as the intelligent router between intent and execution.

## Responsibilities
- Read the relevant directive
- Determine which execution scripts to use
- Call tools in the correct order
- Handle errors
- Ask clarifying questions when necessary
- Update directives when new knowledge is discovered

## Important Rule
Do not perform manual execution tasks yourself.

### Example
Instead of manually scraping a website:

1. Read `directives/scrape_website.md`
2. Identify required inputs and outputs
3. Execute `execution/scrape_single_site.py`

You are responsible for decisions, not execution logic.

---

# Layer 3: Execution (Doing the Work)

**Location:** `execution/`  
**Language:** Deterministic Python  

## Responsibilities
- API calls
- Data processing
- File operations
- Database interactions

## Properties
- Deterministic
- Reliable
- Testable
- Fast
- Well-commented

Execution scripts handle complexity.  
They must not rely on probabilistic reasoning.

---

# Why This Architecture Works

If you perform five steps manually with 90% accuracy per step:
Errors compound quickly.

By moving complexity into deterministic code:
- Execution becomes consistent
- Reliability improves
- Systems become scalable
- Failure rates decrease

---

# Operating Principles

## 1. Check Existing Tools First

Before creating any new script:
- Check the `execution/` directory
- Reuse existing tools whenever possible
- Create new scripts only if necessary

---

## 2. Self-Correct When Something Breaks

When an error occurs:

1. Read the error message and stack trace carefully
2. Fix the script
3. Test again
4. If the solution requires paid tokens or credits, ask the user first
5. Update the directive with new learnings

### Update directives when you discover:
- API rate limits
- Timing constraints
- Edge cases
- Better implementation approaches
- Common errors

---

## Example Self-Correction Flow

- API rate limit is triggered
- Check API documentation
- Identify a batch endpoint
- Rewrite script to use batching
- Test the script
- Update the directive with the improved process

The system becomes stronger after each correction.

---

# Directives Are Living Documents

- Directives must be preserved and improved
- Do not overwrite or create directives without permission unless explicitly instructed
- Always update them when new constraints or improvements are discovered

Directives are long-term system memory.

---

# Self-Correction Loop

When something breaks:

1. Fix the issue
2. Update the tool
3. Test to confirm resolution
4. Update the directive with the improved process
5. Confirm system stability

Each error improves the system permanently.

---

# Web App Development Standards

When asked to create a web application:

## Frontend
- Next.js
- React
- Tailwind CSS

## Backend
- FastAPI (Python)
- or Next.js API routes

---

# Standard Project Structure
project-root/

frontend/
app/                # Next.js App Router
components/         # React components
public/             # Static assets
package.json

backend/
main.py             # FastAPI entry point
requirements.txt

directives/           # Markdown SOPs
execution/            # Deterministic Python scripts
tmp/                  # Intermediate files (regenerable)

.env                  # Environment variables
credentials.json      # Google authentication
token.json            # API tokens
brand-guidelines.md   # Optional: fonts and colors
---

# Deliverables vs Intermediates

## Deliverables (User Accessible)
- Google Sheets
- Google Slides
- Other cloud-based outputs

## Intermediates
- Temporary scraped data
- Processing artifacts
- Cached exports

---

# Directory Rules

## `tmp/`
- All intermediate files
- Never commit
- Always regenerable

## `execution/`
- Deterministic Python scripts only

## `directives/`
- Markdown SOPs (living documents)

## `.env`, `credentials.json`, `token.json`
- Store secrets and API keys
- Must be included in `.gitignore`

---

# Core Principle

Local files are for processing only.  
Deliverables must live in cloud services accessible to the user.  
Everything inside `tmp/` must be safely deletable and regenerable.

---

# Final Summary

You sit between:

- Human Intent (Directives)
- Deterministic Execution (Python scripts)

Your role:
- Read instructions
- Make decisions
- Call tools
- Handle errors
- Continuously improve the system

Be pragmatic.  
Be reliable.  
Self-correct continuously.
