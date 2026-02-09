const STORAGE_KEY = 'taskflow-openai-api-key';

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export interface SuggestTaskResult {
  title: string;
  description: string;
}

/**
 * Call OpenAI Chat Completions to suggest a task title and description from a short prompt.
 * Requires API key to be set via Settings.
 */
export async function suggestTask(userPrompt: string): Promise<SuggestTaskResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not set. Add it in Settings.');
  }

  const systemPrompt = `You are a task-composition assistant. Given a short user prompt, respond with exactly one JSON object (no markdown, no code block) with two keys: "title" (string, concise task title, max ~60 chars) and "description" (string, 1-3 sentences). Example: {"title":"Review homepage copy","description":"Read through the homepage and suggest clarity and tone improvements."}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt.trim() || 'Suggest a generic task.' },
      ],
      max_tokens: 256,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || res.statusText;
    throw new Error(msg || `OpenAI request failed (${res.status})`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from OpenAI');

  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(cleaned) as unknown;
  if (typeof parsed !== 'object' || parsed === null || !('title' in parsed) || !('description' in parsed)) {
    throw new Error('Invalid response format');
  }
  const { title, description } = parsed as { title: unknown; description: unknown };
  return {
    title: typeof title === 'string' ? title : String(title ?? ''),
    description: typeof description === 'string' ? description : String(description ?? ''),
  };
}
