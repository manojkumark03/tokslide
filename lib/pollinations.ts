// Pollinations AI API functions
export const generateCopy = async (appName: string, description: string, hookType: string): Promise<string[]> => {
  const prompt = `Generate exactly 4 viral TikTok hooks for "${appName}" app.
App Description: ${description}
Hook Type: ${hookType}

RULES:
1. Each hook must be 8-15 words
2. Use power words: Secret, Stop, Before, Everyone, Nobody, Insane
3. Create urgency or curiosity
4. Include numbers when possible

RESPONSE FORMAT - Return ONLY this JSON structure:
{
  "hooks": [
    "Hook text here",
    "Hook text here", 
    "Hook text here",
    "Hook text here"
  ]
}

Hook Pattern Examples:
- Problem: "Stop paying $50/month, use ${appName} instead"
- Curiosity: "This ${appName} secret nobody talks about"
- Tutorial: "Get [benefit] in 30 seconds with ${appName}"
- Contrarian: "Everyone uses [competitor], but ${appName} is better"
- FOMO: "Before ${appName} gets expensive"`

  try {
    const response = await fetch("https://text.pollinations.ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        model: "openai",
        seed: Math.floor(Math.random() * 1000000),
      }),
    })

    const result = await response.text()

    try {
      const parsed = JSON.parse(result)
      return parsed.hooks || []
    } catch (e) {
      // Fallback parsing
      return result
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 4)
    }
  } catch (error) {
    console.error("Error generating copy:", error)
    return [
      `Stop wasting time, use ${appName} instead`,
      `This ${appName} secret changed everything`,
      `Get results in 30 seconds with ${appName}`,
      `Before ${appName} gets expensive`,
    ]
  }
}

export const generateImages = async (prompt: string): Promise<string[]> => {
  const basePrompt = `${prompt}, professional, high quality, 4k, cinematic lighting, modern aesthetic`
  const images: string[] = []

  for (let i = 0; i < 4; i++) {
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?width=1080&height=1920&seed=${seed}&model=flux`
    images.push(imageUrl)
  }

  return images
}

interface SlideContent {
  type: string
  text: string
}

export const generateSlideStory = async (appName: string, selectedHook: string): Promise<SlideContent[]> => {
  const prompt = `Create a 4-slide TikTok story for "${appName}" app starting with the hook: "${selectedHook}"

Return ONLY this JSON:
{
  "slides": [
    {"type": "hook", "text": "${selectedHook}"},
    {"type": "problem", "text": "Problem statement (8-12 words)"},
    {"type": "solution", "text": "How ${appName} solves it (8-12 words)"},
    {"type": "cta", "text": "Download ${appName} now (5-8 words)"}
  ]
}`

  try {
    const response = await fetch("https://text.pollinations.ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        model: "openai",
        seed: Math.floor(Math.random() * 1000000),
      }),
    })

    const result = await response.text()
    const parsed = JSON.parse(result)
    return parsed.slides || []
  } catch (error) {
    console.error("Error generating slide story:", error)
    return [
      { type: "hook", text: selectedHook },
      { type: "problem", text: "Tired of complicated solutions?" },
      { type: "solution", text: `${appName} makes it simple and fast` },
      { type: "cta", text: `Download ${appName} today` },
    ]
  }
}
