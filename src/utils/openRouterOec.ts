import { rtdb, type OecStatus } from './firebaseRtdb';
import { ref, push, set } from 'firebase/database';

// OpenRouter API Configuration
// Hardcoded constant API key
export const OPENROUTER_API_KEY = "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";

export const OPENROUTER_MODEL = 'google/gemini-1.5-flash';

// Fallback chain: attempts google/gemini-1.5-flash first, and if OpenRouter returns
// model deprecation/replacement (400), seamlessly uses google/gemini-2.5-flash
export const CANDIDATE_MODELS = [
  'google/gemini-1.5-flash',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-flash-lite',
  'meta-llama/llama-3.1-8b-instruct',
];

export interface AiGeneratedUpdate {
  oecNumber: string;
  countryInfo: string;
  progress: string;
  status: OecStatus;
}

export interface AiOecResponse {
  summary: string;
  updates: AiGeneratedUpdate[];
  modelUsed: string;
  rawText?: string;
}

/**
 * Universal parser for AI departure board updates:
 * Handles:
 * 1. "OEC Code: EPS-2024, Board Info: Visa Processing, Progress: 85%, Status: Active"
 * 2. "OEC Code (EPS-2024), Board Info (Visa Processing), Progress (85%), Status (Active)"
 * 3. Comma-separated: "EPS-2024, Visa Processing, 85%, Active"
 * 4. Structured JSON object/array
 * 5. Multi-line key-value pairs
 */
export function parseAiUpdateText(text: string): AiGeneratedUpdate[] {
  const clean = text.replace(/```[a-z]*|```/gi, '').trim();

  // 1. Try JSON parsing
  try {
    const jsonMatch = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.updates)
        ? parsed.updates
        : [parsed];

      const validList: AiGeneratedUpdate[] = [];
      for (const item of list) {
        if (!item || typeof item !== 'object') continue;
        const oec = item.oecNumber || item.oecCode || item['OEC Code'] || item.code || item.flight;
        const info = item.countryInfo || item.boardInfo || item['Board Info'] || item.destination || item.info;
        const prog = item.progress || item['Progress'] || item.stage || item.time;
        const st = item.status || item['Status'] || 'Active';

        if (oec || info) {
          validList.push({
            oecNumber: String(oec || 'EPS-2024').toUpperCase().slice(0, 16),
            countryInfo: String(info || 'VISA PROCESSING').toUpperCase().slice(0, 24),
            progress: String(prog || '85%').toUpperCase().slice(0, 16),
            status: String(st).toLowerCase().includes('pend')
              ? 'Pending'
              : String(st).toLowerCase().includes('inact')
              ? 'Inactive'
              : 'Active',
          });
        }
      }
      if (validList.length > 0) return validList;
    }
  } catch (_e) {
    // Continue
  }

  // 2. Try Key-Value regex pattern
  // Matches "OEC Code: EPS-2024, Board Info: Visa Processing, Progress: 85%, Status: Active"
  // or "OEC Code (EPS-2024), Board Info (Visa Processing), Progress (85%), Status (Active)"
  const oecMatch = clean.match(/OEC(?:\s*Code)?[:\s\(-]+([A-Za-z0-9\s-]+?)(?=[,\)\n]|Board|Progress|Status|$)/i);
  const infoMatch = clean.match(/Board(?:\s*Info)?[:\s\(-]+([A-Za-z0-9\s\/-]+?)(?=[,\)\n]|Progress|Status|OEC|$)/i);
  const progMatch = clean.match(/Progress[:\s\(-]+([A-Za-z0-9\s%:\.-]+?)(?=[,\)\n]|Status|Board|OEC|$)/i);
  const statusMatch = clean.match(/Status[:\s\(-]+(Active|Pending|Inactive)/i);

  if (oecMatch || infoMatch || progMatch) {
    let oecNumber = 'EPS-2024';
    let countryInfo = 'VISA PROCESSING';
    let progress = '85%';
    let status: OecStatus = 'Active';

    if (oecMatch && oecMatch[1].trim()) oecNumber = oecMatch[1].trim();
    if (infoMatch && infoMatch[1].trim()) countryInfo = infoMatch[1].trim();
    if (progMatch && progMatch[1].trim()) progress = progMatch[1].trim();
    if (statusMatch && statusMatch[1]) {
      const s = statusMatch[1].toLowerCase();
      status = s.includes('pend') ? 'Pending' : s.includes('inact') ? 'Inactive' : 'Active';
    } else if (clean.toLowerCase().includes('pending')) {
      status = 'Pending';
    } else if (clean.toLowerCase().includes('inactive')) {
      status = 'Inactive';
    }

    return [
      {
        oecNumber: oecNumber.toUpperCase().slice(0, 16),
        countryInfo: countryInfo.toUpperCase().slice(0, 24),
        progress: progress.toUpperCase().slice(0, 16),
        status,
      },
    ];
  }

  // 3. Comma-separated or newline-separated fallback: "EPS-2024, Visa Processing, 85%, Active"
  const tokens = clean
    .split(/,|\n/)
    .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
    .filter((s) => s.length > 0);

  if (tokens.length >= 2) {
    const oecNumber = tokens[0] || 'EPS-2024';
    const countryInfo = tokens[1] || 'VISA PROCESSING';
    const progress = tokens[2] || '85%';
    let status: OecStatus = 'Active';
    if (tokens[3]) {
      const s = tokens[3].toLowerCase();
      status = s.includes('pend') ? 'Pending' : s.includes('inact') ? 'Inactive' : 'Active';
    }

    return [
      {
        oecNumber: oecNumber.toUpperCase().slice(0, 16),
        countryInfo: countryInfo.toUpperCase().slice(0, 24),
        progress: progress.toUpperCase().slice(0, 16),
        status,
      },
    ];
  }

  // 4. Fallback default entry based on text
  return [
    {
      oecNumber: 'EPS-2024',
      countryInfo: clean.slice(0, 24).toUpperCase() || 'VISA PROCESSING',
      progress: '85%',
      status: 'Active',
    },
  ];
}

/**
 * Sends the user's query to OpenRouter using the required system prompt
 * and endpoints.
 */
export async function queryOpenRouterOecUpdates(
  userQuery: string,
  customApiKey?: string
): Promise<AiOecResponse> {
  const apiKey = customApiKey?.trim() || OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing.');
  }

  // Exact system prompt requested by the user
  const systemPrompt =
    'You are an OEC and South Korea expert. Provide 1 short, real-time update formatted exactly like this: OEC Code (e.g. EPS-2024), Board Info (e.g. Visa Processing), Progress (e.g. 85%), Status (Active/Pending).';

  // Primary endpoint + dev proxy endpoint for guaranteed CORS-free browser execution
  const endpoints = [
    'https://openrouter.ai/api/v1/chat/completions',
    '/api/openrouter/api/v1/chat/completions',
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    for (const modelToTry of CANDIDATE_MODELS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://okkorean.edu.pk',
            'X-Title': 'OK Korean Language Center OEC Assistant',
          },
          body: JSON.stringify({
            model: modelToTry,
            max_tokens: 300,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userQuery.trim() || 'Latest EPS schedule' },
            ],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          let message = `OpenRouter error (${response.status})`;
          try {
            const parsed = JSON.parse(errorBody);
            if (parsed.error && parsed.error.message) {
              message = parsed.error.message;
            }
          } catch (_e) {
            if (errorBody) message += `: ${errorBody.slice(0, 120)}`;
          }
          throw new Error(message);
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '';

        const updates = parseAiUpdateText(rawContent);

        if (updates.length > 0) {
          return {
            summary: rawContent.slice(0, 120),
            updates,
            modelUsed: modelToTry,
            rawText: rawContent,
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }
  }

  throw (
    lastError ||
    new Error('Failed to fetch AI update from OpenRouter. Please verify your connection.')
  );
}

/**
 * Automatically pushes formatted AI updates to the existing Firebase RTDB node `oec_board`
 */
export async function pushAiUpdatesToFirebase(
  updates: AiGeneratedUpdate[]
): Promise<string[]> {
  const boardRef = ref(rtdb, 'oec_board');
  const pushedKeys: string[] = [];

  for (const update of updates) {
    const newRef = push(boardRef);
    await set(newRef, {
      oecNumber: update.oecNumber.trim().toUpperCase(),
      countryInfo: update.countryInfo.trim().toUpperCase(),
      progress: update.progress.trim().toUpperCase(),
      status: update.status,
      updatedAt: Date.now(),
      source: 'ai_assistant',
    });
    if (newRef.key) {
      pushedKeys.push(newRef.key);
    }
  }

  return pushedKeys;
}
