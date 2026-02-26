/**
 * Cloudflare Pages Function: POST /api/interior-design
 *
 * Receives a room photo + style preferences, calls Google Gemini to
 * 1) analyse the room structure
 * 2) generate a redesigned interior image
 *
 * Security:
 *   - Firebase ID token verification (Authorization: Bearer <token>)
 *   - CORS restricted to allowed origins
 *
 * Environment variable required:
 *   GEMINI_API_KEY – Google AI Studio API key
 */

const FIREBASE_API_KEY = 'AIzaSyCLMpMAXTBKp7M9NxyVjsepdHlq5xCEYv8';
const ALLOWED_ORIGINS = [
  'https://openinterior.pages.dev',
  'http://localhost:5173',
  'http://localhost:4173',
];

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = buildCorsHeaders(request);

  // Verify Firebase ID token first
  const authResult = await verifyIdToken(request);
  if (!authResult) {
    return jsonResponse({ error: '인증이 필요합니다.' }, 401, headers);
  }

  const GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return jsonResponse({ error: 'GEMINI_API_KEY is not configured' }, 500, headers);
  }

  try {
    const formData = await request.formData();

    const imageFile = formData.get('image');
    if (!imageFile) {
      return jsonResponse({ error: '방 사진이 필요합니다.' }, 400, headers);
    }

    const style = formData.get('style') || '모던';
    const roomType = formData.get('roomType') || '거실';
    const description = formData.get('description') || '';

    // Convert room image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = arrayBufferToBase64(imageBuffer);
    const imageMimeType = imageFile.type || 'image/jpeg';

    // Collect optional material images
    const materialParts = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'materialImages' && value instanceof File && value.size > 0) {
        const buf = await value.arrayBuffer();
        materialParts.push({
          inlineData: {
            mimeType: value.type || 'image/jpeg',
            data: arrayBufferToBase64(buf),
          },
        });
      }
    }

    // ── Step 1: Analyse the room with Gemini Flash ──────────────────
    const analysisPrompt = buildAnalysisPrompt(style, roomType, description);
    const analysisResult = await callGemini(
      GEMINI_API_KEY,
      'gemini-2.5-flash',
      [
        { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
        ...materialParts,
        { text: analysisPrompt },
      ],
    );

    let analysis;
    try {
      const raw = analysisResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(raw);
    } catch {
      analysis = {
        changes: [analysisResult.slice(0, 200)],
        style,
        estimatedMaterials: [],
      };
    }

    // ── Step 2: Generate redesigned image ───────────────────────────
    const generationPrompt = buildGenerationPrompt(style, roomType, description, analysis);
    const generatedImage = await callGeminiImageGeneration(
      GEMINI_API_KEY,
      [
        { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
        ...materialParts,
        { text: generationPrompt },
      ],
    );

    return jsonResponse({ generatedImage, analysis }, 200, headers);
  } catch (err) {
    console.error('Interior design API error:', err);
    return jsonResponse(
      { error: err.message || 'AI 처리 중 오류가 발생했습니다.' },
      500,
      headers,
    );
  }
}

export async function onRequestOptions(context) {
  const origin = getAllowedOrigin(context.request);
  if (!origin) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ── Inline utilities ─────────────────────────────────────────────────

function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return null;
}

function buildCorsHeaders(request) {
  const origin = getAllowedOrigin(request);
  if (!origin) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
  };
}

async function verifyIdToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.slice(7);
  if (!idToken) {
    return null;
  }
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const user = data.users?.[0];
    if (!user?.localId) return null;
    return { uid: user.localId };
  } catch {
    return null;
  }
}

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function buildAnalysisPrompt(style, roomType, description) {
  return `당신은 전문 인테리어 디자이너입니다.
첨부된 사진은 현재 ${roomType}의 모습입니다.
사용자가 원하는 스타일: ${style}
추가 요청사항: ${description || '없음'}

현재 방을 분석하고, 요청된 스타일로 변환하기 위한 변경 사항을 JSON 형식으로 답변하세요.

반드시 아래 JSON 형식만 출력하세요:
{
  "changes": ["변경사항1", "변경사항2", ...],
  "style": "적용된 스타일 이름",
  "estimatedMaterials": ["필요한 자재1", "필요한 자재2", ...]
}`;
}

function buildGenerationPrompt(style, roomType, description, analysis) {
  const changesText = analysis.changes?.join(', ') || '';
  return `이 ${roomType} 사진의 구조(벽, 바닥, 천장, 창문, 문 위치)를 정확히 유지하면서, ${style} 스타일로 인테리어를 변경한 실사 수준의 고품질 사진을 생성하세요.

적용할 변경 사항: ${changesText}
${description ? `추가 조건: ${description}` : ''}
${analysis.estimatedMaterials?.length ? `사용할 자재: ${analysis.estimatedMaterials.join(', ')}` : ''}

중요 규칙:
- 방의 구조와 비율을 절대 변경하지 마세요
- 실사 사진처럼 자연스러운 조명과 그림자를 적용하세요
- 가구와 소품을 스타일에 맞게 배치하세요
- 인테리어 잡지에 실릴 수준의 완성도를 목표로 하세요`;
}

async function callGemini(apiKey, model, parts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGeminiImageGeneration(apiKey, parts) {
  // Use Gemini 2.0 Flash preview with image generation capability
  const model = 'gemini-2.5-flash-image';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini Image API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0]?.content?.parts || [];
  for (const part of candidate) {
    if (part.inlineData) {
      return part.inlineData.data; // base64 encoded image
    }
  }

  throw new Error('이미지 생성에 실패했습니다. 다시 시도해주세요.');
}
