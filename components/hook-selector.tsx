"use client"
import type { HookType } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Zap, Eye, BookOpen, TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface HookSelectorProps {
  selectedHookType: string
  onSelect: (hookType: string) => void
  onNext: () => void
  onPrev: () => void
}

const hookTypes: HookType[] = [
  {
    id: "problem-solution",
    name: "Problem/Solution",
    pattern: "Stop doing X, use Y instead",
    example: "Stop paying $50/month for project management, use TaskMaster instead",
    description: "Highlight a common problem and position your app as the solution",
  },
  {
    id: "curiosity-gap",
    name: "Curiosity Gap",
    pattern: "This secret changed everything",
    example: "This productivity secret nobody talks about",
    description: "Create intrigue and curiosity to drive engagement",
  },
  {
    id: "tutorial",
    name: "Tutorial",
    pattern: "Get X result in Y time",
    example: "Get organized in 30 seconds with this app",
    description: "Promise quick, actionable results",
  },
  {
    id: "contrarian",
    name: "Contrarian",
    pattern: "Everyone thinks X, but actually...",
    example: "Everyone uses Notion, but TaskMaster is actually better",
    description: "Challenge conventional wisdom or popular alternatives",
  },
  {
    id: "fomo",
    name: "FOMO",
    pattern: "Before this gets expensive/banned",
    example: "Before TaskMaster raises prices next month",
    description: "Create urgency with scarcity or time-sensitive offers",
  },
]

const getHookIcon = (id: string) => {
  switch (id) {
    case "problem-solution":
      return Zap
    case "curiosity-gap":
      return Eye
    case "tutorial":
      return BookOpen
    case "contrarian":
      return TrendingUp
    case "fomo":
      return Clock
    default:
      return Zap
  }
}

export function HookSelector({ selectedHookType, onSelect, onNext, onPrev }: HookSelectorProps) {
  const canProceed = selectedHookType !== ""

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-balance">Choose your viral hook type</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Select the type of hook that best fits your app's story. Each type is proven to drive engagement on TikTok.
        </p>
      </div>

      {/* Hook Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hookTypes.map((hookType) => {
          const Icon = getHookIcon(hookType.id)
          const isSelected = selectedHookType === hookType.id

          return (
            <Card
              key={hookType.id}
              className={cn(
                "glass-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl",
                isSelected && "ring-2 ring-primary bg-primary/10",
              )}
              onClick={() => onSelect(hookType.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isSelected ? "gradient-primary" : "bg-muted",
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-muted-foreground")} />
                  </div>
                  <CardTitle className="text-lg">{hookType.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-accent">Pattern:</p>
                  <p className="text-sm text-muted-foreground italic">"{hookType.pattern}"</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-accent">Example:</p>
                  <p className="text-sm text-foreground">"{hookType.example}"</p>
                </div>

                <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">{hookType.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

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
          Generate Copy
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Selection Indicator */}
      {selectedHookType && (
        <Card className="glass max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium">{hookTypes.find((h) => h.id === selectedHookType)?.name} selected</p>
                <p className="text-sm text-muted-foreground">Ready to generate viral copy for your app</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
