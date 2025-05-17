'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';
import { GitBranch, Github } from 'lucide-react';

export default function Check() {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsAnalyzing(true);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }

      router.push('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
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
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </form>

        {isAnalyzing && (
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Analyzing repository compliance... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}