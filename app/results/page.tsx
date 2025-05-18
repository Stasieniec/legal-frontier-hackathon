'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, XCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Results() {
  const router = useRouter();
  const { result, error, reset } = useAnalysisStore();

  // Redirect to check page if there's no result
  useEffect(() => {
    if (!result && !error) {
      router.push('/check');
    }
  }, [result, error, router]);

  // Helper function to map classification to risk level
  const getRiskLevel = (classification: string) => {
    const lowercaseClass = classification.toLowerCase();
    if (lowercaseClass.includes('high')) return 'high';
    if (lowercaseClass.includes('medium')) return 'medium';
    if (lowercaseClass.includes('low')) return 'low';
    if (lowercaseClass.includes('minimal')) return 'minimal';
    if (lowercaseClass.includes('limited')) return 'limited';
    return 'unknown';
  };

  // Return to check page and reset the store
  const handleRunAnotherCheck = () => {
    reset();
    router.push('/check');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
        <div className="max-w-4xl mx-auto space-y-8 pt-16">
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-destructive/5 rounded-t-lg pb-6">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <CardTitle className="text-2xl">Analysis Error</CardTitle>
              <CardDescription className="text-destructive font-medium">
                {error}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center p-6">
              <Button onClick={handleRunAnotherCheck} className="w-full max-w-xs">
                <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // If no result yet and we're not redirecting, show loading
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
        <div className="max-w-4xl mx-auto space-y-8 pt-16 text-center">
          <Card className="shadow-lg p-8">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="h-16 w-16 rounded-full border-4 border-t-primary border-background animate-spin mb-4"></div>
              <CardTitle className="text-2xl mb-2">Processing Results</CardTitle>
              <CardDescription>Please wait while we prepare your analysis report...</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get classification details
  const riskLevel = getRiskLevel(result.classification);
  
  // Set classes based on risk level
  const headerBgClass = {
    high: "bg-destructive/10",
    medium: "bg-yellow-500/10",
    low: "bg-green-500/10",
    minimal: "bg-green-500/10",
    limited: "bg-blue-500/10",
    unknown: "bg-muted/10"
  }[riskLevel];
  
  const badgeClass = {
    high: "bg-destructive hover:bg-destructive/80",
    medium: "bg-yellow-500 hover:bg-yellow-500/80",
    low: "bg-green-500 hover:bg-green-500/80", 
    minimal: "bg-green-500 hover:bg-green-500/80",
    limited: "bg-blue-500 hover:bg-blue-500/80",
    unknown: "bg-muted hover:bg-muted/80"
  }[riskLevel];
  
  // Risk icon based on classification
  const RiskIcon = () => {
    if (riskLevel === 'high') {
      return <XCircle className="text-destructive h-8 w-8" />;
    } else if (riskLevel === 'medium') {
      return <AlertTriangle className="text-yellow-500 h-8 w-8" />;
    } else {
      return <CheckCircle2 className="text-green-500 h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8 pb-16">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Compliance Analysis</h1>
          <p className="text-muted-foreground text-center max-w-md">
            AI Act compliance report for your repository
          </p>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className={cn("pb-8", headerBgClass)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Risk Classification</CardTitle>
              <div className="flex items-center space-x-2">
                <RiskIcon />
                <Badge className={cn("text-base py-1 px-3", badgeClass)}>
                  {result.classification}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Assessment</h3>
              <p className="text-muted-foreground leading-relaxed">{result.assessment}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                Legal Obligations
              </h3>

              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Requirements under the AI Act</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {result.legal_obligations.map((obligation, index) => (
                    <li key={index} className="leading-relaxed">{obligation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/20 p-6 flex gap-4 justify-between">
            <Button 
              onClick={handleRunAnotherCheck} 
              variant="outline" 
              className="flex-1 sm:flex-initial sm:min-w-32"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> New Analysis
            </Button>
            
            <Button 
              className="flex-1 sm:flex-initial sm:min-w-32"
              onClick={() => window.print()}
            >
              Export Report <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}