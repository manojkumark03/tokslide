"use client"

import { useEffect, useState } from "react"
import type { AppInfo, GeneratedHook } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, RefreshCw, Sparkles, Copy, Check } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { generateCopy } from "@/lib/pollinations"
import { cn } from "@/lib/utils"

interface CopyGeneratorProps {
  appInfo: AppInfo
  hookType: string
  generatedHooks: GeneratedHook[]
  selectedHook: string
  isLoading: boolean
  onHooksGenerated: (hooks: GeneratedHook[]) => void
  onHookSelect: (hook: string) => void
  onLoadingChange: (loading: boolean) => void
  onNext: () => void
  onPrev: () => void
}

export function CopyGenerator({
  appInfo,
  hookType,
  generatedHooks,
  selectedHook,
  isLoading,
  onHooksGenerated,
  onHookSelect,
  onLoadingChange,
  onNext,
  onPrev,
}: CopyGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateHooks = async () => {
    onLoadingChange(true)
    try {
      const hooks = await generateCopy(appInfo.name, appInfo.description, hookType)
      const formattedHooks: GeneratedHook[] = hooks.map((text, index) => ({
        id: `hook-${index}`,
        text,
      }))
      onHooksGenerated(formattedHooks)
    } catch (error) {
      console.error("Error generating hooks:", error)
      // Fallback hooks
      const fallbackHooks: GeneratedHook[] = [
        { id: "hook-0", text: `Stop wasting time, use ${appInfo.name} instead` },
        { id: "hook-1", text: `This ${appInfo.name} secret changed everything` },
        { id: "hook-2", text: `Get results in 30 seconds with ${appInfo.name}` },
        { id: "hook-3", text: `Before ${appInfo.name} gets expensive` },
      ]
      onHooksGenerated(fallbackHooks)
    } finally {
      onLoadingChange(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  // Auto-generate hooks when component mounts
  useEffect(() => {
    if (generatedHooks.length === 0 && !isLoading) {
      generateHooks()
    }
  }, [])

  const canProceed = selectedHook !== ""

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-balance">AI-Generated Viral Hooks</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Our AI has created 4 viral hooks for <span className="text-accent font-semibold">{appInfo.name}</span>. Select
          the one that resonates most with your audience.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="glass-card max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-center">
                <p className="font-medium">Generating viral hooks...</p>
                <p className="text-sm text-muted-foreground">This may take a few seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Hooks */}
      {!isLoading && generatedHooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold">Choose your hook:</h3>
            <Button
              variant="outline"
              onClick={generateHooks}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {generatedHooks.map((hook, index) => (
              <Card
                key={hook.id}
                className={cn(
                  "glass-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl",
                  selectedHook === hook.text && "ring-2 ring-primary bg-primary/10",
                )}
                onClick={() => onHookSelect(hook.text)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Hook #{index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(hook.text, index)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium leading-relaxed text-pretty">"{hook.text}"</p>
                  {selectedHook === hook.text && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hook Performance Tips */}
      {!isLoading && generatedHooks.length > 0 && (
        <Card className="glass max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-accent">📈 Hook Performance Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Hooks with numbers perform 23% better</li>
                <li>• Questions increase engagement by 15%</li>
                <li>• Urgency words boost click-through rates</li>
              </ul>
              <ul className="space-y-2">
                <li>• Keep it under 15 words for maximum impact</li>
                <li>• Test multiple hooks to find your winner</li>
                <li>• Controversial takes drive more comments</li>
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
          Generate Images
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Selection Confirmation */}
      {selectedHook && (
        <Card className="glass max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium mb-1">Selected Hook:</p>
                <p className="text-foreground italic">"{selectedHook}"</p>
                <p className="text-sm text-muted-foreground mt-2">Ready to generate background images</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
