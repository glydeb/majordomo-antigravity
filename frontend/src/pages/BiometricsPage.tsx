import { useState, useEffect } from 'react';
import { Plus, Activity } from 'lucide-react';
import { getBiometricLogs, createBiometricLog } from '../api/biometrics';
import type { BiometricLog } from '../api/biometrics';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';

export function BiometricsPage() {
  const [logs, setLogs] = useState<BiometricLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [source, setSource] = useState('');
  const [metricType, setMetricType] = useState('');
  const [value, setValue] = useState('');
  const [timestamp, setTimestamp] = useState(() => new Date().toISOString().slice(0, 16));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getBiometricLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreate = async () => {
    if (!source || !metricType || !value || !timestamp) return;
    setIsSubmitting(true);
    try {
      await createBiometricLog({
        source,
        metricType,
        value: parseFloat(value),
        timestamp: new Date(timestamp).toISOString()
      });
      setIsModalOpen(false);
      setSource('');
      setMetricType('');
      setValue('');
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Biometrics</h1>
          <p className="text-slate-400 text-sm mt-1">Track your health and wellness data.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      </div>

      {!isLoading && logs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No logs found"
          description="You haven't recorded any biometrics yet."
          action={<Button onClick={() => setIsModalOpen(true)}>Record Data</Button>}
        />
      ) : (
        <div className="space-y-3 pb-20">
          {logs.map((log) => (
            <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200 capitalize">{log.metricType.replace('_', ' ')}</h4>
                    <p className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-100">{log.value}</div>
                  <Badge variant="default" className="mt-1">{log.source}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Biometric Data">
        <div className="space-y-4">
          <Input
            label="Metric Type"
            placeholder="e.g., body_weight, sleep_hours"
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
          />
          <Input
            label="Value"
            type="number"
            step="any"
            placeholder="e.g., 72.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Input
            label="Source"
            placeholder="e.g., AppleHealth, Manual"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <Input
            label="Timestamp"
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isSubmitting}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
