import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Clock, CheckCircle, AlertTriangle, Plus, Upload, BarChartHorizontal, UserCog, History } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RESOURCES, HISTORY } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const totalIdle = RESOURCES.length;
  const urgent = RESOURCES.filter(r => r.isUrgent).length;
  const available = RESOURCES.filter(r => r.status === 'Available').length;
  const assignedThisWeek = 10; // Mock data

  const departmentData = RESOURCES.reduce((acc, resource) => {
    const dept = resource.department;
    if (!acc[dept]) {
      acc[dept] = { name: dept, count: 0 };
    }
    acc[dept].count++;
    return acc;
  }, {});

  const chartData = Object.values(departmentData);
  const COLORS = ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981', '#f59e0b', '#ef4444'];

  const recentActivities = HISTORY.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Idle" value={totalIdle} icon={Users} color="text-primary" />
        <StatCard title="Urgent (≥2mo)" value={urgent} icon={AlertTriangle} color="text-urgent" />
        <StatCard title="Available Now" value={available} icon={CheckCircle} color="text-success" />
        <StatCard title="Assigned This Wk" value={assignedThisWeek} icon={Clock} color="text-warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Idle by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#a3a3a3" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#a3a3a3" fontSize={12} width={80} />
                <Tooltip cursor={{fill: '#2f2f2f'}} contentStyle={{ backgroundColor: '#181818', border: '1px solid #2f2f2f' }} />
                <Bar dataKey="count" barSize={20}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-border p-2 rounded-full mt-1">
                    <History className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action} by {activity.user}</p>
                    <p className="text-xs text-text-secondary">{activity.resource}: {activity.changes}</p>
                    <p className="text-xs text-text-secondary">{new Date(activity.dateTime).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/dashboard/resources')} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-focus transition-colors"><Plus className="h-4 w-4 mr-2" /> Add Resource</button>
          <button className="flex items-center bg-border text-text px-4 py-2 rounded-md hover:bg-border/80 transition-colors"><Upload className="h-4 w-4 mr-2" /> Import</button>
          <button onClick={() => navigate('/dashboard/reports')} className="flex items-center bg-border text-text px-4 py-2 rounded-md hover:bg-border/80 transition-colors"><BarChartHorizontal className="h-4 w-4 mr-2" /> Reports</button>
          <button onClick={() => navigate('/dashboard/users')} className="flex items-center bg-border text-text px-4 py-2 rounded-md hover:bg-border/80 transition-colors"><UserCog className="h-4 w-4 mr-2" /> Manage Users</button>
          <button onClick={() => navigate('/dashboard/history')} className="flex items-center bg-border text-text px-4 py-2 rounded-md hover:bg-border/80 transition-colors"><History className="h-4 w-4 mr-2" /> History</button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
