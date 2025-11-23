import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlayIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetPistonSupportedLanguages,
  usePistonExecuteCode,
} from '../application/usePistonApi';

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

interface CodePlaygroundProps {
  lessonId?: string;
  courseId?: string;
  starterCode?: string;
  defaultLanguage?: string;
  courseLanguage?: string;
}

export function CodePlayground({
  lessonId,
  courseId,
  starterCode = '// Write your code here...',
  defaultLanguage = 'javascript',
  courseLanguage,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState('');

  const { data: pistonLanguages } = useGetPistonSupportedLanguages();
  const piston = usePistonExecuteCode();

  const getFilteredLanguages = () => {
    if (!pistonLanguages?.data) {
      return [];
    }

    const allLanguages = Array.from(
      new Set(
        pistonLanguages.data.map((runtime: PistonRuntime) => runtime.language)
      )
    ) as string[];

    if (!courseLanguage) {
      return allLanguages;
    }

    const courseLangLower = courseLanguage.toLowerCase();

    const languageMappings: Record<string, string[]> = {
      python: ['python'],
      javascript: ['javascript', 'typescript'],
      java: ['java'],
      'c++': ['c++', 'c'],
      c: ['c', 'c++'],
      'c#': ['csharp', 'c#'],
      csharp: ['csharp', 'c#'],
      go: ['go'],
      rust: ['rust'],
      php: ['php'],
      ruby: ['ruby'],
      swift: ['swift'],
      kotlin: ['kotlin'],
      r: ['r'],
      sql: ['sql'],
      bash: ['bash'],
    };

    for (const [key, supportedLangs] of Object.entries(languageMappings)) {
      if (courseLangLower.includes(key)) {
        return allLanguages.filter((lang: string) =>
          supportedLangs.some((supported) =>
            lang.toLowerCase().includes(supported.toLowerCase())
          )
        );
      }
    }

    return allLanguages;
  };

  const filteredLanguages = getFilteredLanguages();

  const getLanguageVersion = (lang: string): string => {
    if (!pistonLanguages?.data) return '';

    const runtime = pistonLanguages.data.find(
      (r: PistonRuntime) => r.language === lang
    );

    return runtime?.version || '';
  };

  const handleRunCode = async () => {
    try {
      setOutput('Running code...');

      const version = getLanguageVersion(language);

      const result = await piston.mutateAsync({
        language: language,
        version: version,
        code,
      });

      const executionResult = result;

      if (executionResult.run.stderr) {
        setOutput(`Error:\n${executionResult.run.output}`);
      } else if (executionResult.run.output) {
        setOutput(executionResult.run.stdout);
      } else {
        setOutput('Code executed successfully (no output)');
      }

      toast.success('Code executed successfully!');
    } catch (error) {
      toast.error('Failed to execute code');
      setOutput('Failed to execute code. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">💻 Code Playground</CardTitle>
          <div className="flex gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {filteredLanguages?.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRunCode}
              disabled={piston.isPending}
              size="sm"
            >
              {piston.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
              Run
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="text-sm font-semibold mb-2">Output</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {output || 'No output yet. Click "Run" to execute your code.'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
