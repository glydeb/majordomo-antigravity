import { useState, useEffect } from 'react';
import { CheckCircle, ListTodo } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';
import { getTasks, updateTask } from '../api/tasks';
import type { Task } from '../api/tasks';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

const STATUS_TABS = ['Next Action', 'Waiting For', 'Someday/Maybe', 'Done'];

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Next Action');

  const fetchTasks = async (status: string) => {
    setIsLoading(true);
    try {
      const data = await getTasks({ status });
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(activeTab);
  }, [activeTab]);

  const toggleDone = async (task: Task) => {
    const newStatus = task.status === 'Done' ? 'Next Action' : 'Done';
    try {
      await updateTask(task.id, { status: newStatus });
      setTasks(tasks.filter(t => t.id !== task.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Tasks</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-2 px-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-slate-800 text-slate-100 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pb-20">
        {!isLoading && tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={`No ${activeTab} tasks`}
            description="You're all caught up in this view."
          />
        ) : (
          <LayoutGroup>
            <div className="space-y-2">
              {tasks.map(task => (
                <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="p-3 flex items-center gap-4 hoverable group">
                    <button 
                      onClick={() => toggleDone(task)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.status === 'Done' 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {task.status === 'Done' && <CheckCircle className="w-4 h-4" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium truncate ${task.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      {task.energyLevel && (
                        <Badge variant={task.energyLevel === 'High' ? 'danger' : task.energyLevel === 'Low' ? 'success' : 'warning'}>
                          {task.energyLevel} Energy
                        </Badge>
                      )}
                      {task.estimatedDuration && (
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                          {task.estimatedDuration}m
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
}
