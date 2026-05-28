// Note: This file imports from server which creates a circular dependency in some setups.
// For production, keep services in a shared location. This is a simplified version.
export { evaluateQuestion } from '../decision-engine/decision.tree.js';