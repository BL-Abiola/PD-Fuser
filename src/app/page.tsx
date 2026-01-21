import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';
import { ThemeToggle } from '@/components/theme-toggle';
import { Files } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 dark:bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 md:px-8">
          <a href="/" className="flex items-center space-x-2">
            <Files className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">PDFusion</span>
          </a>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Seamless PDF Merging
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground sm:text-lg">
              Drag, drop, and reorder your PDFs, then merge them into a single file. All processing is done securely on your device.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto">
            <PdfFusionClient />
          </div>
        </div>
      </main>
    </div>
  );
}
