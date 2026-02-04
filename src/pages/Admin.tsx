import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, TrendingUp, Award, RefreshCw, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserManagement } from '@/components/admin/UserManagement';

interface StudentData {
  id: string;
  full_name: string;
  email: string;
  pre_test_score: number | null;
  pre_test_completed: boolean;
  post_test_score: number | null;
  post_test_completed: boolean;
  lesson1_completed: boolean;
  lesson1_score: number;
  lesson2_completed: boolean;
  lesson2_score: number;
  lesson3_completed: boolean;
  lesson3_score: number;
  total_progress: number;
  last_activity: string;
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchStudents = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*');

      if (progressError) throw progressError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email');

      if (profilesError) throw profilesError;

      const combined = progressData?.map(progress => {
        const profile = profilesData?.find(p => p.user_id === progress.user_id);
        return {
          id: progress.id,
          full_name: profile?.full_name || 'Unknown',
          email: profile?.email || '',
          ...progress
        };
      }) || [];

      setStudents(combined);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStudents();
    }
  }, [isAdmin]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const totalStudents = students.length;
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.total_progress, 0) / students.length)
    : 0;
  const completedStudents = students.filter(s => s.post_test_completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-chlorophyll to-chlorophyll-dark text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
              <p className="text-sm opacity-90">Manage users and monitor progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Student Progress
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Students</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{totalStudents}</div>
                  <p className="text-xs text-blue-600 mt-1">Registered learners</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Avg. Progress</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{averageProgress}%</div>
                  <Progress value={averageProgress} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">Completed</CardTitle>
                  <Award className="h-5 w-5 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-900">{completedStudents}</div>
                  <p className="text-xs text-amber-600 mt-1">Finished all lessons</p>
                </CardContent>
              </Card>
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Student Progress Overview</CardTitle>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead className="text-center">Pre-Test</TableHead>
                          <TableHead className="text-center">Lesson 1</TableHead>
                          <TableHead className="text-center">Lesson 2</TableHead>
                          <TableHead className="text-center">Lesson 3</TableHead>
                          <TableHead className="text-center">Post-Test</TableHead>
                          <TableHead className="text-center">Progress</TableHead>
                          <TableHead>Last Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{student.full_name}</p>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {student.pre_test_completed ? (
                                <Badge variant="secondary">{student.pre_test_score}/30</Badge>
                              ) : (
                                <Badge variant="outline">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.lesson1_completed ? (
                                <Badge className="bg-chlorophyll">{student.lesson1_score}%</Badge>
                              ) : (
                                <Badge variant="outline">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.lesson2_completed ? (
                                <Badge className="bg-sunlight text-black">{student.lesson2_score}%</Badge>
                              ) : (
                                <Badge variant="outline">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.lesson3_completed ? (
                                <Badge className="bg-glucose">{student.lesson3_score}%</Badge>
                              ) : (
                                <Badge variant="outline">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.post_test_completed ? (
                                <Badge className="bg-atp">{student.post_test_score}/30</Badge>
                              ) : (
                                <Badge variant="outline">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center gap-2">
                                <Progress value={student.total_progress} className="w-16 h-2" />
                                <span className="text-sm font-medium">{student.total_progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {new Date(student.last_activity).toLocaleDateString()}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement currentUserId={user?.id || ''} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
