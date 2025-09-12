import type { SlideContent, SlideCustomization } from "@/types"

export const generateSlide = (
  backgroundImageUrl: string,
  slideContent: SlideContent,
  customization: SlideCustomization,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1080 // TikTok dimensions
    canvas.height = 1920
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        // 1. Draw background image (cover fit)
        const scale = Math.max(1080 / img.width, 1920 / img.height)
        const x = (1080 - img.width * scale) / 2
        const y = (1920 - img.height * scale) / 2
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

        // 2. Draw overlay
        const opacity = customization.overlayOpacity || 0.4
        ctx.fillStyle = `rgba(0,0,0,${opacity})`
        ctx.fillRect(0, 0, 1080, 1920)

        // 3. Draw text with word wrapping
        ctx.fillStyle = customization.textColor || "#ffffff"
        ctx.font = `bold ${customization.fontSize || 48}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Text shadow for readability
        ctx.shadowColor = "rgba(0,0,0,0.8)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Word wrap and positioning logic
        const words = slideContent.text.split(" ")
        const maxWidth = 980 // padding
        const lines: string[] = []
        let currentLine = ""

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? " " : "") + word
          if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        })
        lines.push(currentLine)

        // Position based on slide type and customization
        let startY = 960 // center default
        if (customization.textPosition === "top") startY = 300
        if (customization.textPosition === "bottom") startY = 1620
        if (slideContent.type === "hook" && customization.textPosition === "center") startY = 300
        if (slideContent.type === "cta" && customization.textPosition === "center") startY = 1620

        const lineHeight = customization.fontSize + 20
        startY -= (lines.length * lineHeight) / 2

        lines.forEach((line, index) => {
          ctx.fillText(line, 540, startY + index * lineHeight)
        })

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to create blob"))
            }
          },
          "image/png",
          0.9,
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = backgroundImageUrl
  })
}
