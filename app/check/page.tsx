'use client';
// export const runtime = "edge"; // Removed - conflicts with 'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GitBranch, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import { analyzeRepository } from '@/lib/api';

export default function Check() {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  
  const { setLoading, setResult, setError, isLoading } = useAnalysisStore();

  // Reset progress when loading changes to false
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
    }
  }, [isLoading]);

  // Animation for the progress bar
  useEffect(() => {
    if (!isLoading) return;
    
    let progressInterval: NodeJS.Timeout;
    let lastUpdate = Date.now();
    
    // Random progress animation
    const simulateProgress = () => {
      // Get current time
      const now = Date.now();
      // Time since last update in ms
      const elapsed = now - lastUpdate;
      lastUpdate = now;
      
      setProgress(currentProgress => {
        // Progress gets slower as we approach 90%
        const remainingProgress = 90 - currentProgress;
        
        if (remainingProgress <= 0) return currentProgress;
        
        // Calculate the next increment based on current progress
        // Lower increments as we get closer to 90%
        const baseIncrement = Math.max(0.2, remainingProgress / 25);
        
        // Add some randomness to the increment
        const randomFactor = 0.5 + Math.random();
        const timeAdjustment = Math.min(1, elapsed / 800); // Adjust for timing
        
        const increment = baseIncrement * randomFactor * timeAdjustment;
        
        // Calculate next progress value
        const nextProgress = Math.min(90, currentProgress + increment);
        
        // Occasionally add a "jump" in progress
        const shouldJump = Math.random() < 0.1; // 10% chance of jump
        const jumpAmount = shouldJump ? Math.random() * 5 : 0;
        
        return Math.min(90, nextProgress + jumpAmount);
      });
      
      // Vary the update interval between 100ms and 500ms
      // Slower updates as we get closer to completion
      progressInterval = setTimeout(
        simulateProgress, 
        100 + Math.random() * 400
      );
    };
    
    // Start the simulation
    progressInterval = setTimeout(simulateProgress, 200);
    
    // Clean up on unmount or when loading stops
    return () => clearTimeout(progressInterval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous errors
    setError('');
    
    try {
      setLoading(true);
      setProgress(5); // Start with a small progress value immediately
      
      // Call the webhook
      try {
        const result = await analyzeRepository({
          repo_url: repoUrl,
          branch_name: branch,
        });
        
        // Set progress to 100% when complete
        setProgress(100);
        
        console.log("Analysis result:", result);
        
        // Store the result in our global store
        setResult(result);
        
        // Navigate to results page after a short delay
        setTimeout(() => {
          router.push('/results');
        }, 500);
      } catch (apiError) {
        const errorMessage = apiError instanceof Error 
          ? apiError.message 
          : 'An unknown error occurred during analysis';
          
        console.error('Analysis API error:', apiError);
        setError(errorMessage);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Analysis submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Description based on progress
  const getProgressDescription = () => {
    if (progress < 10) return "Initializing analysis...";
    if (progress < 25) return "Scanning repository structure...";
    if (progress < 40) return "Identifying AI components...";
    if (progress < 60) return "Analyzing data handling patterns...";
    if (progress < 75) return "Evaluating risk factors...";
    if (progress < 90) return "Determining compliance requirements...";
    return "Finalizing assessment...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-xl mx-auto space-y-8 pt-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Repository Analysis</h1>
          <p className="text-muted-foreground">
            Enter your repository details to begin the compliance check
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <label className="text-sm font-medium">Repository URL</label>
            </div>
            <Input
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              className="bg-card"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <label className="text-sm font-medium">Branch Name</label>
            </div>
            <Input
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="bg-card"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </form>

        {isLoading && (
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                {getProgressDescription()}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {Math.round(progress)}% complete
              </p>
              <p className="text-xs text-muted-foreground/50 mt-2 italic">
                This may take 1-2 minutes depending on repository size
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}