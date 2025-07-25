import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, History, AlertTriangle, Home, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageService } from "@/lib/storage";
import { FireExtinguisherWithLogs, MaintenanceLog } from "@shared/schema";
import { validateField, validateDate, generateUUID, formatDate } from "@/lib/utils";

export default function MaintenanceLogScreen() {
  const params = useParams<{ barcode: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const barcode = decodeURIComponent(params.barcode || '');
  
  const [extinguisher, setExtinguisher] = useState<FireExtinguisherWithLogs | null>(null);
  const [newLog, setNewLog] = useState({
    dateWorkDone: '',
    remarks: '',
    user: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = LocalStorageService.getExtinguisher(barcode);
    setExtinguisher(data);
  }, [barcode]);

  const navigateHome = () => {
    setLocation('/');
  };

  const handleLogInputChange = (field: keyof typeof newLog, value: string) => {
    setNewLog(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const dateError = validateDate(newLog.dateWorkDone, 'Date Work Done');
    const remarksError = validateField(newLog.remarks, 'Remarks');
    const userError = validateField(newLog.user, 'Technician Name');

    if (dateError || remarksError || userError) {
      toast({
        title: "Validation Error",
        description: dateError || remarksError || userError || "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!extinguisher) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const logEntry: MaintenanceLog = {
      id: generateUUID(),
      extinguisherId: extinguisher.id,
      dateWorkDone: new Date(newLog.dateWorkDone),
      remarks: newLog.remarks.trim(),
      user: newLog.user.trim(),
      createdAt: new Date()
    };

    const updatedExtinguisher = {
      ...extinguisher,
      maintenanceLogs: [logEntry, ...extinguisher.maintenanceLogs]
    };

    LocalStorageService.saveExtinguisher(barcode, updatedExtinguisher);
    setExtinguisher(updatedExtinguisher);
    setNewLog({ dateWorkDone: '', remarks: '', user: '' });
    setIsSubmitting(false);
    
    toast({
      title: "Success",
      description: "Maintenance log added successfully!",
    });
  };

  if (!extinguisher) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Fire Extinguisher Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The barcode "{barcode}" is not registered in the system.
        </p>
        <Button onClick={navigateHome} className="btn-primary">
          <Home className="h-4 w-4 mr-2" />
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Extinguisher Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Fire Extinguisher Details
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateHome}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Barcode</p>
              <p className="text-lg font-semibold text-gray-900">{extinguisher.barcode}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Extinguisher No.</p>
              <p className="text-lg font-semibold text-gray-900">{extinguisher.extinguisherNo}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Location</p>
              <p className="text-lg font-semibold text-gray-900">{extinguisher.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Date of Testing</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(extinguisher.dateOfTesting)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Maintenance Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            Add Maintenance Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLog} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date-work-done">Date Work Done *</Label>
                <Input
                  id="date-work-done"
                  type="date"
                  required
                  value={newLog.dateWorkDone}
                  onChange={(e) => handleLogInputChange('dateWorkDone', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="technician-name">Technician Name *</Label>
                <Input
                  id="technician-name"
                  type="text"
                  required
                  value={newLog.user}
                  onChange={(e) => handleLogInputChange('user', e.target.value)}
                  placeholder="e.g., John Doe"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maintenance-remarks">Maintenance Remarks *</Label>
              <Textarea
                id="maintenance-remarks"
                required
                rows={4}
                value={newLog.remarks}
                onChange={(e) => handleLogInputChange('remarks', e.target.value)}
                placeholder="Describe the maintenance work performed..."
                className="mt-2 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Log...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Log Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <History className="h-6 w-6 text-blue-600 mr-3" />
            Maintenance History ({extinguisher.maintenanceLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {extinguisher.maintenanceLogs.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Maintenance Records</h4>
              <p className="text-gray-600">Add the first maintenance log entry above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {extinguisher.maintenanceLogs.map((log, index) => (
                <div 
                  key={log.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{log.user}</p>
                        <p className="text-sm text-gray-600">{formatDate(log.dateWorkDone)}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                  </div>
                  <div className="pl-12">
                    <p className="text-gray-700 leading-relaxed">{log.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
