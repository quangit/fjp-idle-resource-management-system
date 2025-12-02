import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Download, Calendar, Filter, TrendingUp, Users, Clock, AlertTriangle, CheckCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { RESOURCES, HISTORY } from '@/lib/mockData';

const COLORS = ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981', '#f59e0b', '#ef4444'];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');

  // Calculate statistics
  const totalIdle = RESOURCES.length;
  const urgent = RESOURCES.filter(r => r.isUrgent).length;
  const available = RESOURCES.filter(r => r.status === 'Available').length;
  const assigned = RESOURCES.filter(r => r.status === 'Assigned').length;

  // Department distribution
  const departmentData = RESOURCES.reduce((acc, resource) => {
    const dept = resource.department;
    if (!acc[dept]) {
      acc[dept] = { name: dept, count: 0 };
    }
    acc[dept].count++;
    return acc;
  }, {});
  const deptChartData = Object.values(departmentData);

  // Status distribution for pie chart
  const statusData = [
    { name: 'Available', value: available, color: '#10b981' },
    { name: 'Assigned', value: assigned, color: '#38bdf8' },
    { name: 'On Leave', value: RESOURCES.filter(r => r.status === 'On Leave').length, color: '#f59e0b' },
  ];

  // Skill distribution - FIX: Handle skills as string (comma-separated)
  const skillData = RESOURCES.reduce((acc, resource) => {
    // Defensive check: ensure skills exists and convert to array
    let skillsArray = [];
    
    if (typeof resource.skills === 'string') {
      // Split comma-separated string
      skillsArray = resource.skills.split(',').map(s => s.trim()).filter(s => s);
    } else if (Array.isArray(resource.skills)) {
      // Already an array
      skillsArray = resource.skills;
    }
    
    // Process each skill
    skillsArray.forEach(skill => {
      if (!acc[skill]) {
        acc[skill] = { name: skill, count: 0 };
      }
      acc[skill].count++;
    });
    
    return acc;
  }, {});
  const skillChartData = Object.values(skillData).sort((a, b) => b.count - a.count).slice(0, 8);

  // Trend data (mock monthly data)
  const trendData = [
    { month: 'Jan', idle: 45, assigned: 12 },
    { month: 'Feb', idle: 52, assigned: 15 },
    { month: 'Mar', idle: 48, assigned: 18 },
    { month: 'Apr', idle: 55, assigned: 14 },
    { month: 'May', idle: 60, assigned: 20 },
    { month: 'Jun', idle: totalIdle, assigned: 22 },
  ];

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implementation for export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleExport('pdf')} className="flex items-center bg-primary text-white px-4 py-2 text-sm rounded-md hover:bg-primary-focus transition-colors">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </button>
          <button onClick={() => handleExport('excel')} className="flex items-center bg-border text-text px-4 py-2 text-sm rounded-md hover:bg-border/80 transition-colors">
            <Download className="h-4 w-4 mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-text-secondary" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-text-secondary" />
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="overview">Overview</option>
                <option value="department">By Department</option>
                <option value="skills">By Skills</option>
                <option value="trends">Trends</option>
                <option value="utilization">Utilization</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Idle Resources</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIdle}</div>
            <p className="text-xs text-text-secondary mt-1">
              <span className="text-success">↑ 12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Urgent Cases</CardTitle>
            <AlertTriangle className="h-5 w-5 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urgent}</div>
            <p className="text-xs text-text-secondary mt-1">
              <span className="text-error">↑ 8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Available Now</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{available}</div>
            <p className="text-xs text-text-secondary mt-1">
              <span className="text-success">↑ 5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Avg Idle Duration</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.3mo</div>
            <p className="text-xs text-text-secondary mt-1">
              <span className="text-warning">↑ 0.4mo</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Idle Resources by Department</CardTitle>
            <BarChart3 className="h-5 w-5 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#a3a3a3" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#a3a3a3" fontSize={12} width={100} />
                <Tooltip 
                  cursor={{fill: '#2f2f2f'}} 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #2f2f2f', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="count" barSize={24} radius={[0, 8, 8, 0]}>
                  {deptChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status Distribution</CardTitle>
            <PieChartIcon className="h-5 w-5 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #2f2f2f', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Skills in Idle Pool</CardTitle>
            <TrendingUp className="h-5 w-5 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#a3a3a3" fontSize={11} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip 
                  cursor={{fill: '#2f2f2f'}} 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #2f2f2f', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="count" fill="#9E7FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>6-Month Trend</CardTitle>
            <TrendingUp className="h-5 w-5 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #2f2f2f', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ color: '#a3a3a3' }} />
                <Line type="monotone" dataKey="idle" stroke="#9E7FFF" strokeWidth={2} dot={{ fill: '#9E7FFF', r: 4 }} name="Idle Resources" />
                <Line type="monotone" dataKey="assigned" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Assigned" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-secondary">Department</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Total Idle</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Available</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Urgent</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Avg Duration</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {deptChartData.map((dept, index) => {
                  const deptResources = RESOURCES.filter(r => r.department === dept.name);
                  const deptAvailable = deptResources.filter(r => r.status === 'Available').length;
                  const deptUrgent = deptResources.filter(r => r.isUrgent).length;
                  const avgDuration = (deptResources.reduce((sum, r) => sum + (r.idleDuration || 0), 0) / deptResources.length).toFixed(1);
                  const utilization = Math.floor(Math.random() * 30 + 60); // Mock data
                  
                  return (
                    <tr key={index} className="border-b border-border hover:bg-surface">
                      <td className="px-4 py-3 font-medium">{dept.name}</td>
                      <td className="px-4 py-3 text-right">{dept.count}</td>
                      <td className="px-4 py-3 text-right">{deptAvailable}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${deptUrgent > 0 ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                          {deptUrgent}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{avgDuration}mo</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="w-20 bg-border rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${utilization >= 80 ? 'bg-success' : utilization >= 60 ? 'bg-warning' : 'bg-error'}`}
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary w-10">{utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary">High Idle Rate Detected</h4>
                <p className="text-sm text-text-secondary mt-1">
                  {urgent} resources have been idle for over 2 months. Consider reassignment or training programs.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning">Skills Gap Analysis</h4>
                <p className="text-sm text-text-secondary mt-1">
                  Top skills in idle pool: {skillChartData.slice(0, 3).map(s => s.name).join(', ')}. Consider matching with upcoming projects.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h4 className="font-semibold text-success">Utilization Improvement</h4>
                <p className="text-sm text-text-secondary mt-1">
                  Overall utilization increased by 5% this month. Continue current assignment strategies.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
