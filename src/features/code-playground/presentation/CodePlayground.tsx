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
import { PlayIcon, SaveIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useExecuteAndSave,
  useExecuteCode,
  useSupportedLanguages,
  useWorkspace,
} from '../application/useCodePlayground';
import {
  useGetPistonSupportedLanguages,
  usePistonExecuteCode,
} from '../application/usePistonApi';

interface CodePlaygroundProps {
  lessonId?: string;
  courseId?: string;
  starterCode?: string;
  defaultLanguage?: string;
}

export function CodePlayground({
  lessonId,
  courseId,
  starterCode = '// Write your code here...',
  defaultLanguage = 'javascript',
}: CodePlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState('');
  const { data } = useGetPistonSupportedLanguages();

  const { data: languages } = useSupportedLanguages();
  const { data: workspace } = useWorkspace(lessonId!);
  const executeAndSave = useExecuteAndSave();
  const piston = usePistonExecuteCode();

  useEffect(() => {
    if (workspace?.data) {
      setCode(workspace.data.code);
      setLanguage(workspace.data.language);
    }
  }, [workspace]);

  const handleRunCode = async () => {
    try {
      setOutput('Running code...');

      const result = await piston.mutateAsync({
        language: 'javascript',
        version: '1.32.3',
        code,
      });

      const executionResult = result;

      if (executionResult.run.stderr) {
        setOutput(`Error:\n${executionResult.run.output}`);
      } else if (executionResult.run.stdout) {
        setOutput(executionResult.run.stdout);
      } else {
        setOutput('Code executed successfully (no output)');
      }

      toast.success('Code executed and saved!');
    } catch (error) {
      toast.error('Failed to execute code');
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
                {languages?.data?.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRunCode}
              disabled={executeAndSave.isPending}
              size="sm"
            >
              {executeAndSave.isPending ? (
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
        {/* Editor */}
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
