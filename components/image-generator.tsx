"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, RefreshCw, ImageIcon, Wand2 } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { generateImages } from "@/lib/pollinations"
import { cn } from "@/lib/utils"

interface ImageGeneratorProps {
  generatedImages: string[]
  selectedImage: string
  isLoading: boolean
  onImagesGenerated: (images: string[]) => void
  onImageSelect: (image: string) => void
  onLoadingChange: (loading: boolean) => void
  onNext: () => void
  onPrev: () => void
}

export function ImageGenerator({
  generatedImages,
  selectedImage,
  isLoading,
  onImagesGenerated,
  onImageSelect,
  onLoadingChange,
  onNext,
  onPrev,
}: ImageGeneratorProps) {
  const [imagePrompt, setImagePrompt] = useState("modern tech background, gradient colors, professional")

  const handleGenerateImages = async () => {
    onLoadingChange(true)
    try {
      const images = await generateImages(imagePrompt)
      onImagesGenerated(images)
    } catch (error) {
      console.error("Error generating images:", error)
      // Fallback to placeholder images
      const fallbackImages = [
        "/modern-tech-gradient-background.jpg",
        "/abstract-digital-purple.png",
        "/minimalist-geometric-design.jpg",
        "/futuristic-tech-interface.jpg",
      ]
      onImagesGenerated(fallbackImages)
    } finally {
      onLoadingChange(false)
    }
  }

  const canProceed = selectedImage !== ""

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-balance">Generate Background Images</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Create stunning background images that will make your TikTok slides stand out and grab attention.
        </p>
      </div>

      {/* Image Prompt Input */}
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Describe Your Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imagePrompt">Image Style & Description</Label>
            <Input
              id="imagePrompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="e.g., modern tech background, gradient colors, professional"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Describe the style, colors, and mood you want for your slide backgrounds
            </p>
          </div>

          <Button
            onClick={handleGenerateImages}
            disabled={isLoading || !imagePrompt.trim()}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating Images...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate 4 Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="glass-card max-w-4xl mx-auto">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-center">
                <p className="font-medium">Creating your background images...</p>
                <p className="text-sm text-muted-foreground">This may take 30-60 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Images */}
      {!isLoading && generatedImages.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold">Choose your background:</h3>
            <Button
              variant="outline"
              onClick={handleGenerateImages}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {generatedImages.map((imageUrl, index) => (
              <Card
                key={index}
                className={cn(
                  "glass-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl overflow-hidden",
                  selectedImage === imageUrl && "ring-2 ring-primary",
                )}
                onClick={() => onImageSelect(imageUrl)}
              >
                <div className="aspect-[9/16] relative overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Background option ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selectedImage === imageUrl && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">Background #{index + 1}</p>
                  <p className="text-xs text-muted-foreground">Click to select</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Image Tips */}
      {!isLoading && generatedImages.length > 0 && (
        <Card className="glass max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-accent">🎨 Background Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• High contrast backgrounds make text pop</li>
                <li>• Avoid busy patterns that distract from text</li>
                <li>• Gradients and solid colors work best</li>
              </ul>
              <ul className="space-y-2">
                <li>• Consider your brand colors</li>
                <li>• Test readability with white and dark text</li>
                <li>• Simple backgrounds perform better</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gradient-primary hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Customize Slides
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Selection Confirmation */}
      {selectedImage && (
        <Card className="glass max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium">Background selected</p>
                <p className="text-sm text-muted-foreground">Ready to customize your slides</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
