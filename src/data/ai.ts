import type { AiSummary, AiSuggestedReply, AiIntent } from '../types';

/**
 * AI mock outputs.
 * ASSUMPTION: In a real build, these would come from an AI provider with
 * explicit data-access scoping and human-approval guardrails (see spec §17, §42).
 */

export const aiSummaries: Record<string, AiSummary> = {
  'conv-001': {
    conversationId: 'conv-001',
    summary:
      'Customer is asking for the delivery status of a recent order and flagged a possible duplicate payment charge. Previous interaction (SMS, yesterday) confirmed the order left the Pune hub. Customer is waiting for a fresh update and a resolution on the duplicate charge.',
    sourceMessageIds: ['m-001-1', 'm-001-4', 'm-001-7'],
  },
  'conv-003': {
    conversationId: 'conv-003',
    summary:
      'Customer was charged for a subscription cancelled last week and is requesting a refund. Agent has acknowledged and is checking the billing record. No prior escalations on this account.',
    sourceMessageIds: ['m-003-1', 'm-003-2'],
  },
  'conv-006': {
    conversationId: 'conv-006',
    summary:
      'Customer reports a duplicate charge on order #INF-77102 with no resolution after 2 days. Conversation breached SLA and was escalated to Supervisor. Customer is requesting to speak with a manager.',
    sourceMessageIds: ['m-006-1', 'm-006-3', 'm-006-5'],
  },
};

export const aiSuggestedReplies: Record<string, AiSuggestedReply> = {
  'conv-001': {
    conversationId: 'conv-001',
    text: "I'm sorry for the delay, Rahul. I can see your order left our Pune hub and is on its way — I'll also review the duplicate payment charge right now and update you shortly.",
  },
  'conv-003': {
    conversationId: 'conv-003',
    text: "Thanks for your patience, Ayesha — I've confirmed the duplicate charge and initiated your refund. It should reflect in 3–5 business days.",
  },
  'conv-006': {
    conversationId: 'conv-006',
    text: "I understand your frustration, Farhan, and I'm escalating this personally. A supervisor will review the duplicate charge and follow up within the hour.",
  },
};

export const aiIntents: Record<string, AiIntent> = {
  'conv-001': {
    conversationId: 'conv-001',
    intent: 'Payment issue',
    confidence: 0.92,
    suggestedNextStep: 'Review transaction status',
  },
  'conv-003': {
    conversationId: 'conv-003',
    intent: 'Refund request',
    confidence: 0.88,
    suggestedNextStep: 'Verify billing record and process refund',
  },
  'conv-006': {
    conversationId: 'conv-006',
    intent: 'Escalation — billing dispute',
    confidence: 0.95,
    suggestedNextStep: 'Supervisor review required',
  },
};
