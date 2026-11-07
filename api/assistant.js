const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 10;
const MAX_CONTEXT_LENGTH = 6000;

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readRequestBody(req) {
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) {
    return { error: 'Request is too large.' };
  }

  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return { body: JSON.parse(req.body) };
      } catch {
        return { error: 'Request body must be valid JSON.' };
      }
    }

    return { body: req.body };
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      return { error: 'Request is too large.' };
    }
    chunks.push(chunk);
  }

  try {
    return { body: JSON.parse(Buffer.concat(chunks).toString('utf8')) };
  } catch {
    return { error: 'Request body must be valid JSON.' };
  }
}

function validateInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A message is required.' };
  }

  if (typeof body.message !== 'string' || !body.message.trim()) {
    return { error: 'A message is required.' };
  }

  const message = body.message.trim();
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
    return { error: 'Chat history is invalid.' };
  }

  let contextLength = message.length;
  const contents = [];
  for (const item of history) {
    if (
      !item ||
      typeof item !== 'object' ||
      !['user', 'assistant'].includes(item.role) ||
      typeof item.text !== 'string' ||
      !item.text.trim() ||
      item.text.length > MAX_MESSAGE_LENGTH
    ) {
      return { error: 'Chat history is invalid.' };
    }

    const text = item.text.trim();
    contextLength += text.length;
    contents.push({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text }],
    });
  }

  if (contextLength > MAX_CONTEXT_LENGTH) {
    return { error: 'Conversation is too long. Please start a new chat.' };
  }

  contents.push({ role: 'user', parts: [{ text: message }] });
  return { contents };
}

export function createAssistantHandler(getApiKey = () => process.env.GEMINI_API_KEY) {
  return async function assistantHandler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      sendJson(res, 405, { error: 'Only POST requests are supported.' });
      return;
    }

    const { body, error: bodyError } = await readRequestBody(req);
    if (bodyError) {
      sendJson(res, 400, { error: bodyError });
      return;
    }

    const { contents, error: validationError } = validateInput(body);
    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      sendJson(res, 503, { error: 'The AI assistant is not configured yet.' });
      return;
    }

    let response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: 'You are AnimeVerse Guide, a friendly anime discovery assistant. Help with recommendations, genres, watch orders, characters, and spoiler-safe explanations. Ask about preferences when useful. Do not claim to know live rankings, current availability, or facts you are unsure about. Avoid spoilers unless the user asks for them. Keep replies concise, useful, and easy to scan.',
              }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 700,
            },
          }),
          signal: AbortSignal.timeout(20000),
        },
      );
    } catch (error) {
      console.error('Gemini assistant request failed:', error.name);
      sendJson(res, 502, { error: 'The AI service could not be reached.' });
      return;
    }

    if (!response.ok) {
      console.error('Gemini assistant returned HTTP status:', response.status);
      sendJson(res, response.status === 429 ? 429 : 502, {
        error: 'The AI service could not complete this request.',
      });
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      sendJson(res, 502, { error: 'The AI service returned an invalid response.' });
      return;
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!reply) {
      sendJson(res, 502, { error: 'The AI service returned an empty response.' });
      return;
    }

    sendJson(res, 200, { reply });
  };
}

export default createAssistantHandler();
