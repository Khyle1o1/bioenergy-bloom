import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, FileQuestion, BookOpen, Activity, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResetProgressModal } from './ResetProgressModal';

interface AnswerLog {
  id: string;
  activity_type: string;
  activity_name: string;
  lesson_id: string | null;
  question_id: string;
  question_text: string;
  selected_answer: string;
  correct_answer: string | null;
  is_correct: boolean | null;
  timestamp: string;
}

interface StudentDetailModalProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailModal({
  studentId,
  studentName,
  studentEmail,
  isOpen,
  onClose,
}: StudentDetailModalProps) {
  const [answerLogs, setAnswerLogs] = useState<AnswerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchAnswerLogs();
    }
  }, [isOpen, studentId]);

  const fetchAnswerLogs = async () => {
    setLoading(true);
    try {
      console.log('[StudentDetailModal] Fetching answer logs for user_id:', studentId);
      
      const { data, error } = await supabase
        .from('answer_logs')
        .select('*')
        .eq('user_id', studentId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('[StudentDetailModal] Error fetching answer logs:', error);
        throw error;
      }
      
      console.log('[StudentDetailModal] Raw answer logs:', data?.length || 0, 'total records');
      
      // Filter to only the latest attempt for each question
      const latestLogs = filterLatestAttempts(data || []);
      console.log('[StudentDetailModal] After filtering duplicates:', latestLogs.length, 'unique questions');
      
      setAnswerLogs(latestLogs);
    } catch (error) {
      console.error('[StudentDetailModal] Error in fetchAnswerLogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to keep only the latest attempt for each question
  const filterLatestAttempts = (logs: AnswerLog[]): AnswerLog[] => {
    const latestByQuestion: Record<string, AnswerLog> = {};
    
    logs.forEach(log => {
      const key = `${log.activity_type}_${log.question_id}`;
      
      if (!latestByQuestion[key]) {
        latestByQuestion[key] = log;
      } else {
        // Keep the one with the latest timestamp
        if (new Date(log.timestamp) > new Date(latestByQuestion[key].timestamp)) {
          latestByQuestion[key] = log;
        }
      }
    });
    
    return Object.values(latestByQuestion);
  };

  const groupByActivity = (logs: AnswerLog[]) => {
    const grouped: Record<string, AnswerLog[]> = {};
    
    // For each activity type, only keep the LATEST attempt per question
    logs.forEach((log) => {
      const key = log.activity_type;
      if (!grouped[key]) grouped[key] = [];
      
      // Check if we already have this question
      const existingIndex = grouped[key].findIndex(
        existing => existing.question_id === log.question_id
      );
      
      if (existingIndex >= 0) {
        // Keep the newer one (most recent timestamp)
        const existingLog = grouped[key][existingIndex];
        if (new Date(log.timestamp) > new Date(existingLog.timestamp)) {
          grouped[key][existingIndex] = log; // Replace with newer
        }
      } else {
        grouped[key].push(log); // First time seeing this question
      }
    });
    
    return grouped;
  };

  const groupedLogs = groupByActivity(answerLogs);

  const getActivityIcon = (type: string) => {
    if (type === 'pretest' || type === 'posttest') return <FileQuestion className="w-5 h-5" />;
    if (type.includes('quiz')) return <BookOpen className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      pretest: 'Pre-Test',
      posttest: 'Post-Test',
      lesson1_quiz: 'Lesson 1 Assessment',
      lesson2_quiz: 'Lesson 2 Assessment',
      lesson3_quiz: 'Lesson 3 Assessment',
      matching: 'Matching Activities',
      text_response: 'Text Responses',
    };
    return labels[type] || type;
  };

  const calculateScore = (logs: AnswerLog[]) => {
    const withCorrectAnswer = logs.filter((log) => log.is_correct !== null);
    if (withCorrectAnswer.length === 0) return null;
    const correct = withCorrectAnswer.filter((log) => log.is_correct).length;
    return { correct, total: withCorrectAnswer.length };
  };

  const pretestLogs = groupedLogs['pretest'] || [];
  const posttestLogs = groupedLogs['posttest'] || [];
  const lesson1Logs = groupedLogs['lesson1_quiz'] || [];
  const lesson2Logs = groupedLogs['lesson2_quiz'] || [];
  const lesson3Logs = groupedLogs['lesson3_quiz'] || [];
  const matchingLogs = groupedLogs['matching'] || [];
  const textLogs = groupedLogs['text_response'] || [];

  const handleResetComplete = () => {
    fetchAnswerLogs();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
          <div className="px-6 pt-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center justify-between">
                <span>Student Details</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetModalOpen(true)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-1 mt-2">
                  <div className="text-base font-semibold text-foreground">{studentName}</div>
                  <div className="text-sm text-muted-foreground">{studentEmail}</div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>

        {loading ? (
          <div className="space-y-4 flex-1 px-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="pretest" className="flex-1 flex flex-col min-h-0 px-6 pb-6">
            <TabsList className="grid w-full grid-cols-5 mt-4">
              <TabsTrigger value="pretest" className="text-xs">Pre-Test</TabsTrigger>
              <TabsTrigger value="lessons" className="text-xs">Lessons</TabsTrigger>
              <TabsTrigger value="posttest" className="text-xs">Post-Test</TabsTrigger>
              <TabsTrigger value="matching" className="text-xs">Matching</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 mt-4 overflow-hidden">
              <ScrollArea className="h-full pr-4">
              <TabsContent value="pretest" className="space-y-4">
                {pretestLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pre-test answers yet</p>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Pre-Test Results</span>
                          {(() => {
                            const score = calculateScore(pretestLogs);
                            return score ? (
                              <Badge variant="secondary" className="text-base">
                                {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                              </Badge>
                            ) : null;
                          })()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pretestLogs
                          .sort((a, b) => {
                            // Sort by question ID to ensure correct order (Q1, Q2, Q3...)
                            const aNum = parseInt(a.question_id.replace(/\D/g, ''));
                            const bNum = parseInt(b.question_id.replace(/\D/g, ''));
                            return aNum - bNum;
                          })
                          .map((log, index) => (
                          <div key={log.id} className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-medium text-sm">
                                <span className="text-primary mr-2">Q{index + 1}.</span>
                                {log.question_text}
                              </p>
                              {log.is_correct !== null && (
                                <div className="flex items-center gap-1">
                                  {log.is_correct ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-semibold text-green-700">Correct</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 text-red-500" />
                                      <span className="text-xs font-semibold text-red-600">Incorrect</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Student's answer:</span>{' '}
                                <span className={log.is_correct === false ? 'text-red-600' : ''}>
                                  {log.selected_answer}
                                </span>
                              </p>
                              {log.correct_answer && (
                                <p>
                                  <span className="font-medium">Correct answer:</span>{' '}
                                  <span className="text-green-700">{log.correct_answer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="lessons" className="space-y-4">
                {[lesson1Logs, lesson2Logs, lesson3Logs].map((lessonLogs, lessonIndex) => {
                  if (lessonLogs.length === 0) return null;
                  const score = calculateScore(lessonLogs);
                  return (
                    <Card key={lessonIndex}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Lesson {lessonIndex + 1} Assessment</span>
                          {score && (
                            <Badge variant="secondary" className="text-base">
                              {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {lessonLogs.map((log, index) => (
                          <div key={log.id} className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-medium text-sm">
                                <span className="text-primary mr-2">Q{index + 1}.</span>
                                {log.question_text}
                              </p>
                              {log.is_correct !== null && (
                                <div className="flex items-center gap-1">
                                  {log.is_correct ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-semibold text-green-700">Correct</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 text-red-500" />
                                      <span className="text-xs font-semibold text-red-600">Incorrect</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Student's answer:</span>{' '}
                                <span className={log.is_correct === false ? 'text-red-600' : ''}>
                                  {log.selected_answer}
                                </span>
                              </p>
                              {log.correct_answer && (
                                <p>
                                  <span className="font-medium">Correct answer:</span>{' '}
                                  <span className="text-green-700">{log.correct_answer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
                {lesson1Logs.length === 0 && lesson2Logs.length === 0 && lesson3Logs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No lesson assessments completed yet</p>
                )}
              </TabsContent>

              <TabsContent value="posttest" className="space-y-4">
                {posttestLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No post-test answers yet</p>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Post-Test Results</span>
                          {(() => {
                            const score = calculateScore(posttestLogs);
                            return score ? (
                              <Badge variant="secondary" className="text-base">
                                {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                              </Badge>
                            ) : null;
                          })()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {posttestLogs.map((log, index) => (
                          <div key={log.id} className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-medium text-sm">
                                <span className="text-primary mr-2">Q{index + 1}.</span>
                                {log.question_text}
                              </p>
                              {log.is_correct !== null && (
                                <div className="flex items-center gap-1">
                                  {log.is_correct ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-semibold text-green-700">Correct</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 text-red-500" />
                                      <span className="text-xs font-semibold text-red-600">Incorrect</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Student's answer:</span>{' '}
                                <span className={log.is_correct === false ? 'text-red-600' : ''}>
                                  {log.selected_answer}
                                </span>
                              </p>
                              {log.correct_answer && (
                                <p>
                                  <span className="font-medium">Correct answer:</span>{' '}
                                  <span className="text-green-700">{log.correct_answer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="matching" className="space-y-4">
                {matchingLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No matching activities completed yet</p>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Matching Activities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {matchingLogs.map((log) => (
                        <div key={log.id} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="font-medium text-sm">{log.question_text}</p>
                            {log.is_correct !== null && (
                              <div className="flex items-center gap-1">
                                {log.is_correct ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-xs font-semibold text-green-700">Correct</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-semibold text-red-600">Incorrect</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Matched:</span>{' '}
                              <span className={log.is_correct === false ? 'text-red-600' : ''}>
                                {log.selected_answer}
                              </span>
                            </p>
                            {log.correct_answer && (
                              <p>
                                <span className="font-medium">Correct match:</span>{' '}
                                <span className="text-green-700">{log.correct_answer}</span>
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedLogs).map(([type, logs]) => {
                    const score = calculateScore(logs);
                    return (
                      <Card key={type}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            {getActivityIcon(type)}
                            {getActivityLabel(type)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Total attempts: <span className="font-semibold text-foreground">{logs.length}</span>
                            </p>
                            {score && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Score:</p>
                                <Badge variant="secondary" className="text-base">
                                  {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                                </Badge>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Last activity: {new Date(logs[0].timestamp).toLocaleString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {Object.keys(groupedLogs).length === 0 && (
                    <p className="text-center text-muted-foreground py-8 col-span-2">
                      No activity data available yet
                    </p>
                  )}
                </div>
              </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>

      <ResetProgressModal
        studentId={studentId}
        studentName={studentName}
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onResetComplete={handleResetComplete}
      />
    </>
  );
}
