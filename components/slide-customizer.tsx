"use client"

import { useEffect, useState, useRef } from "react"
import type { AppInfo, SlideContent, SlideCustomization } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Palette, Type, Move, Layers, Eye } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { generateSlideStory } from "@/lib/pollinations"
import { generateSlide } from "@/lib/canvas"
import { downloadSlides } from "@/lib/download"
import { cn } from "@/lib/utils"

interface SlideCustomizerProps {
  appInfo: AppInfo
  selectedHook: string
  selectedImage: string
  customization: SlideCustomization
  slideContent: SlideContent[]
  onCustomizationChange: (customization: SlideCustomization) => void
  onSlideContentGenerated: (content: SlideContent[]) => void
  onPrev: () => void
}

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#FBBF24" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
]

export function SlideCustomizer({
  appInfo,
  selectedHook,
  selectedImage,
  customization,
  slideContent,
  onCustomizationChange,
  onSlideContentGenerated,
  onPrev,
}: SlideCustomizerProps) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false)
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0)
  const [generatedBlobs, setGeneratedBlobs] = useState<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate slide content when component mounts
  useEffect(() => {
    if (slideContent.length === 0 && selectedHook && !isGeneratingContent) {
      generateContent()
    }
  }, [selectedHook])

  // Update canvas preview when customization or preview slide changes
  useEffect(() => {
    if (slideContent.length > 0 && selectedImage) {
      updateCanvasPreview()
    }
  }, [customization, previewSlideIndex, slideContent, selectedImage])

  const generateContent = async () => {
    setIsGeneratingContent(true)
    try {
      const content = await generateSlideStory(appInfo.name, selectedHook)
      onSlideContentGenerated(content)
    } catch (error) {
      console.error("Error generating slide content:", error)
      // Fallback content
      const fallbackContent: SlideContent[] = [
        { type: "hook", text: selectedHook },
        { type: "problem", text: "Tired of complicated solutions?" },
        { type: "solution", text: `${appInfo.name} makes it simple and fast` },
        { type: "cta", text: `Download ${appInfo.name} today` },
      ]
      onSlideContentGenerated(fallbackContent)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const updateCanvasPreview = async () => {
    if (!canvasRef.current || slideContent.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      const currentSlide = slideContent[previewSlideIndex]
      if (!currentSlide) return

      // Create a temporary canvas for the slide
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = 1080
      tempCanvas.height = 1920
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // Draw background
        const scale = Math.max(1080 / img.width, 1920 / img.height)
        const x = (1080 - img.width * scale) / 2
        const y = (1920 - img.height * scale) / 2
        tempCtx.drawImage(img, x, y, img.width * scale, img.height * scale)

        // Draw overlay
        tempCtx.fillStyle = `rgba(0,0,0,${customization.overlayOpacity})`
        tempCtx.fillRect(0, 0, 1080, 1920)

        // Draw text
        tempCtx.fillStyle = customization.textColor
        tempCtx.font = `bold ${customization.fontSize}px Arial`
        tempCtx.textAlign = "center"
        tempCtx.textBaseline = "middle"

        // Text shadow
        tempCtx.shadowColor = "rgba(0,0,0,0.8)"
        tempCtx.shadowBlur = 4
        tempCtx.shadowOffsetX = 2
        tempCtx.shadowOffsetY = 2

        // Word wrap
        const words = currentSlide.text.split(" ")
        const maxWidth = 980
        const lines: string[] = []
        let currentLine = ""

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? " " : "") + word
          if (tempCtx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        })
        lines.push(currentLine)

        // Position text
        let startY = 960 // center default
        if (customization.textPosition === "top") startY = 300
        if (customization.textPosition === "bottom") startY = 1620

        const lineHeight = customization.fontSize + 20
        startY -= (lines.length * lineHeight) / 2

        lines.forEach((line, index) => {
          tempCtx.fillText(line, 540, startY + index * lineHeight)
        })

        // Scale down and draw to preview canvas
        const previewScale = canvas.width / 1080
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height)
      }

      img.src = selectedImage
    } catch (error) {
      console.error("Error updating canvas preview:", error)
    }
  }

  const generateAllSlides = async () => {
    if (slideContent.length === 0 || !selectedImage) return

    setIsGeneratingSlides(true)
    try {
      const blobs: Blob[] = []

      for (const slide of slideContent) {
        const blob = await generateSlide(selectedImage, slide, customization)
        blobs.push(blob)
      }

      setGeneratedBlobs(blobs)
      await downloadSlides(blobs)
    } catch (error) {
      console.error("Error generating slides:", error)
    } finally {
      setIsGeneratingSlides(false)
    }
  }

  const updateCustomization = (key: keyof SlideCustomization, value: any) => {
    onCustomizationChange({ ...customization, [key]: value })
  }

  if (isGeneratingContent) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-balance">Generating Your Slide Story</h2>
        </div>

        <Card className="glass-card max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-center">
                <p className="font-medium">Creating your 4-slide story...</p>
                <p className="text-sm text-muted-foreground">This will just take a moment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-balance">Customize & Download</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Fine-tune your slides and download all 4 as a ZIP file ready for TikTok.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Preview */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Canvas Preview */}
                <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                  <canvas ref={canvasRef} width={270} height={480} className="w-full h-full object-cover" />
                </div>

                {/* Slide Navigation */}
                <div className="flex gap-2">
                  {slideContent.map((slide, index) => (
                    <Button
                      key={index}
                      variant={previewSlideIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewSlideIndex(index)}
                      className={cn("flex-1 text-xs", previewSlideIndex === index && "gradient-primary text-white")}
                    >
                      {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Current Slide Text */}
                {slideContent[previewSlideIndex] && (
                  <Card className="glass">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Current Slide Text:</p>
                      <p className="text-sm italic">"{slideContent[previewSlideIndex].text}"</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customization Controls */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Text Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateCustomization("textColor", color.value)}
                    className={cn(
                      "w-12 h-12 rounded-lg border-2 transition-all",
                      customization.textColor === color.value
                        ? "border-primary scale-110"
                        : "border-border hover:border-muted-foreground",
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Font Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Size: {customization.fontSize}px</Label>
                </div>
                <Slider
                  value={[customization.fontSize]}
                  onValueChange={([value]) => updateCustomization("fontSize", value)}
                  min={24}
                  max={72}
                  step={2}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="w-5 h-5" />
                Text Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={customization.textPosition}
                onValueChange={(value: "top" | "center" | "bottom") => updateCustomization("textPosition", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Background Overlay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Opacity: {Math.round(customization.overlayOpacity * 100)}%</Label>
                </div>
                <Slider
                  value={[customization.overlayOpacity]}
                  onValueChange={([value]) => updateCustomization("overlayOpacity", value)}
                  min={0}
                  max={0.8}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Download Section */}
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Ready to Download?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your 4-slide TikTok story is ready! Download all slides as a ZIP file.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              {slideContent.map((slide, index) => (
                <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                  {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={generateAllSlides}
            disabled={isGeneratingSlides || slideContent.length === 0}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGeneratingSlides ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating Slides...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download All Slides (ZIP)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-sm text-muted-foreground">Step 5 of 5 - Complete!</div>
      </div>
    </div>
  )
}
