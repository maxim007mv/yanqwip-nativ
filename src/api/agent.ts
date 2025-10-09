import { api } from './client';
import type { AgentMessage, AgentResponse } from '../types/api';

export const sendAgentMessage = async (message: string, history: AgentMessage[] = []) => {
  const response = await api.post<AgentResponse>('/agent/message', {
    message,
    history,
  });
  return response.data;
};
