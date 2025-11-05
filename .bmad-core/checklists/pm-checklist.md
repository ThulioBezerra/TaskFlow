<!-- Powered by BMAD™ Core -->

# Product Manager (PM) Requirements Checklist

This checklist serves as a comprehensive framework to ensure the Product Requirements Document (PRD) and Epic definitions are complete, well-structured, and appropriately scoped for MVP development. The PM should systematically work through each item during the product definition process.

## Agent Guidance: PM Checklist Initialization

**Purpose:** To ensure the agent has all necessary context before starting the checklist evaluation.

**Instructions for Agent:**
1.  Confirm access to `prd.md` (located at `docs/prd.md`). If not found, prompt the user for its location or content.
2.  Confirm access to `brief.md` (located at `docs/brief.md`). If not found, prompt the user for its location or content.
3.  Acknowledge that user research, market analysis, competitive analysis, business goals, strategy documents, and existing epic definitions or user stories are valuable context, and the agent should refer to them if available.

**Validation Approach for Agent:**
-   **User-Centric:** Every requirement should tie back to user value.
-   **MVP Focus:** Ensure scope is truly minimal while viable.
-   **Clarity:** Requirements should be unambiguous and testable.
-   **Completeness:** All aspects of the product vision are covered.
-   **Feasibility:** Requirements are technically achievable.

**Execution Mode for Agent:**
-   **Interactive Mode:** The agent should offer to review each section, present findings, and get user confirmation before proceeding.
-   **Comprehensive Mode:** The agent can complete a full analysis and present a comprehensive report at the end. The user's previous request indicates a preference for comprehensive mode.

## 1. PROBLEM DEFINITION & CONTEXT

## Agent Guidance: Problem Definition & Context Evaluation

**Purpose:** To evaluate if the core problem is clearly defined, relevant, and supported by user and business context.

**Instructions for Agent:**
1.  Verify that the problem statement is clear, real, and worth solving.
2.  Confirm that the target audience is specific.
3.  Ensure success metrics are measurable and tied to value.
4.  Look for evidence of user research or data, not just assumptions.
5.  Validate that the proposed solution logically addresses the identified problem.

### 1.1 Problem Statement

- [ ] Clear articulation of the problem being solved
- [ ] Identification of who experiences the problem
- [ ] Explanation of why solving this problem matters
- [ ] Quantification of problem impact (if possible)
- [ ] Differentiation from existing solutions

### 1.2 Business Goals & Success Metrics

- [ ] Specific, measurable business objectives defined
- [ ] Clear success metrics and KPIs established
- [ ] Metrics are tied to user and business value
- [ ] Baseline measurements identified (if applicable)
- [ ] Timeframe for achieving goals specified

### 1.3 User Research & Insights

- [ ] Target user personas clearly defined
- [ ] User needs and pain points documented
- [ ] User research findings summarized (if available)
- [ ] Competitive analysis included
- [ ] Market context provided

## 2. MVP SCOPE DEFINITION

## Agent Guidance: MVP Scope Definition Evaluation

**Purpose:** To assess if the MVP scope is appropriately minimal, focused, and achievable within the given constraints.

**Instructions for Agent:**
1.  Challenge every feature to ensure it is truly minimal for an MVP.
2.  Verify that each feature directly addresses the core problem.
3.  Confirm that "nice-to-haves" are clearly separated from "must-haves."
4.  Check for documented rationale for feature inclusion/exclusion.
5.  Evaluate if the MVP can realistically be shipped within the target timeframe.

### 2.1 Core Functionality

- [ ] Essential features clearly distinguished from nice-to-haves
- [ ] Features directly address defined problem statement
- [ ] Each Epic ties back to specific user needs
- [ ] Features and Stories are described from user perspective
- [ ] Minimum requirements for success defined

### 2.2 Scope Boundaries

- [ ] Clear articulation of what is OUT of scope
- [ ] Future enhancements section included
- [ ] Rationale for scope decisions documented
- [ ] MVP minimizes functionality while maximizing learning
- [ ] Scope has been reviewed and refined multiple times

### 2.3 MVP Validation Approach

- [ ] Method for testing MVP success defined
- [ ] Initial user feedback mechanisms planned
- [ ] Criteria for moving beyond MVP specified
- [ ] Learning goals for MVP articulated
- [ ] Timeline expectations set

## 3. USER EXPERIENCE REQUIREMENTS

## Agent Guidance: User Experience Requirements Evaluation

**Purpose:** To ensure that user experience considerations are adequately captured and will guide design and implementation.

**Instructions for Agent:**
1.  Verify that user flows cover primary use cases comprehensively.
2.  Check if edge cases are identified (even if deferred).
3.  Confirm that accessibility is considered, not an afterthought.
4.  Assess if performance expectations are realistic from a user perspective.
5.  Look for plans for error states and recovery.

### 3.1 User Journeys & Flows

- [ ] Primary user flows documented
- [ ] Entry and exit points for each flow identified
- [ ] Decision points and branches mapped
- [ ] Critical path highlighted
- [ ] Edge cases considered

### 3.2 Usability Requirements

- [ ] Accessibility considerations documented
- [ ] Platform/device compatibility specified
- [ ] Performance expectations from user perspective defined
- [ ] Error handling and recovery approaches outlined
- [ ] User feedback mechanisms identified

### 3.3 UI Requirements

- [ ] Information architecture outlined
- [ ] Critical UI components identified
- [ ] Visual design guidelines referenced (if applicable)
- [ ] Content requirements specified
- [ ] High-level navigation structure defined

## 4. FUNCTIONAL REQUIREMENTS

## Agent Guidance: Functional Requirements Evaluation

**Purpose:** To ensure functional requirements are clear, testable, and provide sufficient detail for implementation.

**Instructions for Agent:**
1.  Verify requirements focus on WHAT not HOW (avoid implementation details).
2.  Confirm each requirement is testable (how would QA verify it?).
3.  Check if dependencies are explicit (what needs to be built first?).
4.  Ensure requirements use consistent terminology.
5.  Assess if complex features are broken into manageable pieces.

### 4.1 Feature Completeness

- [ ] All required features for MVP documented
- [ ] Features have clear, user-focused descriptions
- [ ] Feature priority/criticality indicated
- [ ] Requirements are testable and verifiable
- [ ] Dependencies between features identified

### 4.2 Requirements Quality

- [ ] Requirements are specific and unambiguous
- [ ] Requirements focus on WHAT not HOW
- [ ] Requirements use consistent terminology
- [ ] Complex requirements broken into simpler parts
- [ ] Technical jargon minimized or explained

### 4.3 User Stories & Acceptance Criteria

- [ ] Stories follow consistent format
- [ ] Acceptance criteria are testable
- [ ] Stories are sized appropriately (not too large)
- [ ] Stories are independent where possible
- [ ] Stories include necessary context
- [ ] Local testability requirements (e.g., via CLI) defined in ACs for relevant backend/data stories

## 5. NON-FUNCTIONAL REQUIREMENTS

## Agent Guidance: Non-Functional Requirements Evaluation

**Purpose:** To ensure non-functional aspects like performance, security, and reliability are adequately addressed.

**Instructions for Agent:**
1.  Evaluate if performance expectations (response time, throughput, scalability) are defined.
2.  Check for specified security and compliance requirements.
3.  Verify reliability and resilience needs (availability, backup, fault tolerance).
4.  Confirm technical constraints (platform, integrations, infrastructure) are documented.

### 5.1 Performance Requirements

- [ ] Response time expectations defined
- [ ] Throughput/capacity requirements specified
- [ ] Scalability needs documented
- [ ] Resource utilization constraints identified
- [ ] Load handling expectations set

### 5.2 Security & Compliance

- [ ] Data protection requirements specified
- [ ] Authentication/authorization needs defined
- [ ] Compliance requirements documented
- [ ] Security testing requirements outlined
- [ ] Privacy considerations addressed

### 5.3 Reliability & Resilience

- [ ] Availability requirements defined
- [ ] Backup and recovery needs documented
- [ ] Fault tolerance expectations set
- [ ] Error handling requirements specified
- [ ] Maintenance and support considerations included

### 5.4 Technical Constraints

- [ ] Platform/technology constraints documented
- [ ] Integration requirements outlined
- [ ] Third-party service dependencies identified
- [ ] Infrastructure requirements specified
- [ ] Development environment needs identified

## 6. EPIC & STORY STRUCTURE

## Agent Guidance: Epic & Story Structure Evaluation

**Purpose:** To verify that epics and stories are well-structured, logically sequenced, and appropriately sized.

**Instructions for Agent:**
1.  Confirm epics represent cohesive units of functionality and deliver user/business value.
2.  Check if epic goals are clearly articulated and sized for incremental delivery.
3.  Evaluate if stories are broken down to an appropriate size, have clear value, and testable acceptance criteria.
4.  Verify story dependencies and sequence are documented and aligned with epic goals.
5.  Ensure the first epic includes all necessary setup and foundational steps.

### 6.1 Epic Definition

- [ ] Epics represent cohesive units of functionality
- [ ] Epics focus on user/business value delivery
- [ ] Epic goals clearly articulated
- [ ] Epics are sized appropriately for incremental delivery
- [ ] Epic sequence and dependencies identified

### 6.2 Story Breakdown

- [ ] Stories are broken down to appropriate size
- [ ] Stories have clear, independent value
- [ ] Stories include appropriate acceptance criteria
- [ ] Story dependencies and sequence documented
- [ ] Stories aligned with epic goals

### 6.3 First Epic Completeness

- [ ] First epic includes all necessary setup steps
- [ ] Project scaffolding and initialization addressed
- [ ] Core infrastructure setup included
- [ ] Development environment setup addressed
- [ ] Local testability established early

## 7. TECHNICAL GUIDANCE

## Agent Guidance: Technical Guidance Evaluation

**Purpose:** To assess if sufficient technical direction and constraints are provided for the architecture phase.

**Instructions for Agent:**
1.  Verify initial architecture direction and technical constraints are clearly communicated.
2.  Check if integration points, performance, and security requirements are highlighted.
3.  Identify if known areas of complexity or risk are flagged for architectural deep-dive.
4.  Look for a technical decision framework, trade-offs, and rationale for key choices.
5.  Confirm guidance on development approach, testing, deployment, and monitoring is provided.

### 7.1 Architecture Guidance

- [ ] Initial architecture direction provided
- [ ] Technical constraints clearly communicated
- [ ] Integration points identified
- [ ] Performance considerations highlighted
- [ ] Security requirements articulated
- [ ] Known areas of high complexity or technical risk flagged for architectural deep-dive

### 7.2 Technical Decision Framework

- [ ] Decision criteria for technical choices provided
- [ ] Trade-offs articulated for key decisions
- [ ] Rationale for selecting primary approach over considered alternatives documented (for key design/feature choices)
- [ ] Non-negotiable technical requirements highlighted
- [ ] Areas requiring technical investigation identified
- [ ] Guidance on technical debt approach provided

### 7.3 Implementation Considerations

- [ ] Development approach guidance provided
- [ ] Testing requirements articulated
- [ ] Deployment expectations set
- [ ] Monitoring needs identified
- [ ] Documentation requirements specified

## 8. CROSS-FUNCTIONAL REQUIREMENTS

## Agent Guidance: Cross-Functional Requirements Evaluation

**Purpose:** To ensure that data, integration, and operational aspects are considered.

**Instructions for Agent:**
1.  Verify data entities, storage, quality, retention, and migration needs are identified.
2.  Check if external system integrations, API requirements, and authentication are outlined.
3.  Confirm deployment frequency, environment, monitoring, and support requirements are defined.

### 8.1 Data Requirements

- [ ] Data entities and relationships identified
- [ ] Data storage requirements specified
- [ ] Data quality requirements defined
- [ ] Data retention policies identified
- [ ] Data migration needs addressed (if applicable)
- [ ] Schema changes planned iteratively, tied to stories requiring them

### 8.2 Integration Requirements

- [ ] External system integrations identified
- [ ] API requirements documented
- [ ] Authentication for integrations specified
- [ ] Data exchange formats defined
- [ ] Integration testing requirements outlined

### 8.3 Operational Requirements

- [ ] Deployment frequency expectations set
- [ ] Environment requirements defined
- [ ] Monitoring and alerting needs identified
- [ ] Support requirements documented
- [ ] Performance monitoring approach specified

## 9. CLARITY & COMMUNICATION

## Agent Guidance: Clarity & Communication Evaluation

**Purpose:** To assess the overall quality of documentation and stakeholder alignment.

**Instructions for Agent:**
1.  Verify documents use clear, consistent language, are well-structured, and versioned.
2.  Check if technical terms are defined and diagrams are included where helpful.
3.  Confirm key stakeholders are identified, their input incorporated, and a communication plan is established.

### 9.1 Documentation Quality

- [ ] Documents use clear, consistent language
- [ ] Documents are well-structured and organized
- [ ] Technical terms are defined where necessary
- [ ] Diagrams/visuals included where helpful
- [ ] Documentation is versioned appropriately

### 9.2 Stakeholder Alignment

- [ ] Key stakeholders identified
- [ ] Stakeholder input incorporated
- [ ] Potential areas of disagreement addressed
- [ ] Communication plan for updates established
- [ ] Approval process defined

## PRD & EPIC VALIDATION SUMMARY

## Agent Guidance: Final PM Checklist Report Generation

**Purpose:** To synthesize the evaluation into a comprehensive report for the user.

**Instructions for Agent:**
1.  **Executive Summary:**
    -   Provide an overall PRD completeness percentage.
    -   Assess MVP scope appropriateness (Too Large/Just Right/Too Small).
    -   Determine readiness for the architecture phase (Ready/Nearly Ready/Not Ready).
    -   List the most critical gaps or concerns.
2.  **Category Analysis Table:**
    -   Fill in the table with Status: PASS (90%+ complete), PARTIAL (60-89%), FAIL (<60%).
    -   List Critical Issues: Specific problems that block progress for each category.
3.  **Top Issues by Priority:**
    -   **BLOCKERS:** Must fix before the architect can proceed.
    -   **HIGH:** Should fix for quality.
    -   **MEDIUM:** Would improve clarity.
    -   **LOW:** Nice to have.
4.  **MVP Scope Assessment:**
    -   Suggest features that might be cut for a true MVP.
    -   Identify missing features that are essential.
    -   Highlight complexity concerns.
    -   Comment on timeline realism.
5.  **Technical Readiness:**
    -   Assess the clarity of technical constraints.
    -   Identify technical risks.
    -   Point out areas needing architect investigation.
6.  **Recommendations:**
    -   Provide specific actions to address each blocker.
    -   Suggest improvements.
    -   Outline next steps.
7.  **Post-Report Interaction:** After presenting the report, ask if the user wants:
    -   Detailed analysis of any failed sections.
    -   Suggestions for improving specific areas.
    -   Help with refining MVP scope.

### Category Statuses

| Category                         | Status | Critical Issues |
| -------------------------------- | ------ | --------------- |
| 1. Problem Definition & Context  | _TBD_  |                 |
| 2. MVP Scope Definition          | _TBD_  |                 |
| 3. User Experience Requirements  | _TBD_  |                 |
| 4. Functional Requirements       | _TBD_  |                 |
| 5. Non-Functional Requirements   | _TBD_  |                 |
| 6. Epic & Story Structure        | _TBD_  |                 |
| 7. Technical Guidance            | _TBD_  |                 |
| 8. Cross-Functional Requirements | _TBD_  |                 |
| 9. Clarity & Communication       | _TBD_  |                 |

### Critical Deficiencies

(To be populated during validation)

### Recommendations

(To be populated during validation)

### Final Decision

-   **READY FOR ARCHITECT**: The PRD and epics are comprehensive, properly structured, and ready for architectural design.
-   **NEEDS REFINEMENT**: The requirements documentation requires additional work to address the identified deficiencies.